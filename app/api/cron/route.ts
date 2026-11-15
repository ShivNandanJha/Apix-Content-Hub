import {NextRequest,NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';
export async function GET(req:NextRequest){
if(!process.env.CRON_SECRET||req.headers.get('authorization')!=='Bearer '+process.env.CRON_SECRET)return NextResponse.json({error:'Unauthorized'},{status:401});
if(!process.env.SUPABASE_SERVICE_ROLE_KEY||!process.env.NEXT_PUBLIC_SUPABASE_URL)return NextResponse.json({error:'Server credentials missing'},{status:503});
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const before=new Date(Date.now()-48*60*60*1000).toISOString();
const {data,error}=await db.from('posts').select('id,title,scheduled_at,workspace_id,primary_owner_id').eq('status','Scheduled').eq('locked',false).lt('scheduled_at',before).limit(100);
if(error)return NextResponse.json({error:'Query failed'},{status:500});
let flagged=0;
for(const p of data||[]){
const {data:updated}=await db.from('posts').update({status:'Missed'}).eq('id',p.id).eq('status','Scheduled').select('id');
if(!updated?.length)continue;flagged++;
const next=new Date();next.setUTCDate(next.getUTCDate()+1);next.setUTCHours(10,0,0,0);
await db.from('reschedule_suggestions').insert({workspace_id:p.workspace_id,post_id:p.id,old_at:p.scheduled_at,proposed_at:next.toISOString()});
if(p.primary_owner_id)await db.from('notifications').insert({workspace_id:p.workspace_id,recipient_id:p.primary_owner_id,post_id:p.id,title:'Missed publishing deadline',body:p.title+' is more than 48 hours overdue. Please review its schedule.'});
if(process.env.SLACK_WEBHOOK_URL)try{await fetch(process.env.SLACK_WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:'Apix Content Hub: '+p.title+' is overdue.'})})}catch{}
}
return NextResponse.json({flagged});
}