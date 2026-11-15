# Apix Content Hub

A collaborative social media editorial workspace for Apix. Built with Next.js and Supabase.

## Setup

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in Vercel. Apply `supabase/migrations/001_initial.sql` in the Supabase SQL editor before signing in. Provision team users with Supabase Auth and create their `profiles` and `workspace_members` rows.

The application uses manual publishing, member color identification, multi-platform content planning, an idea vault, and comments.

> This initial release is an early implementation and needs production QA and Supabase migration before real team use.
