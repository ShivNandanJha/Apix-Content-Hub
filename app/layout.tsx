import type {Metadata} from "next";
import "./globals.css";
export const metadata:Metadata={title:"Apix Content Hub",description:"Your content planning workspace"};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}