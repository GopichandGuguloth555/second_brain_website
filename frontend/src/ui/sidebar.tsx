import { LinkIcon } from "../Icons/linkIcon";
import { Logo } from "../Icons/logo";
import { DocumentIcon } from "../Icons/documentIcon";
import { TwitterIcon } from "../Icons/twitterIcon";
import { YoutubeIcon } from "../Icons/youtubeIcon";
import { SidebarItem } from "./sidebarItem";
import { LinkedinIcon } from "../Icons/linkedinIcon";
import { Button } from "./button";
import { Link } from "react-router-dom";

export function Sidebar ()
{ 
   return(
    <div className=" fixed left-0 top-0 bg-white h-screen w-72 yb  rounded-md items-center ">
     <div className="  flex pt-8 pl-2 gap-4 ">
      <div className=" text-violet-800 ">
         <Logo/>
      </div>
      <div className=" text-violet-600 text-3xl pt-4 ">
          <h1><b>Second Brain</b></h1>
      </div>
     </div>
      <div className="pt-24 pl-10">

     <div className="hover:bg-gray-400 rounded-md cursor-pointer px-1 py-1 pl-3">
      <SidebarItem text="Videos" icon={<YoutubeIcon />} />
     </div>
     </div>

     <div className="pt-4 pl-12">
     <div className="hover:bg-gray-400 rounded-md cursor-pointer px-2 py-2">
     <SidebarItem text="   Tweets" icon={<TwitterIcon />} />
     </div>
     </div>

     <div className="pt-4 pl-12">
     <div className="hover:bg-gray-400 rounded-md cursor-pointer px-2 py-2">
     <SidebarItem text="Documents" icon={<DocumentIcon />} />
     </div>
     </div>

     <div className="pt-4 pl-12">
     <div className="hover:bg-gray-400 rounded-md cursor-pointer px-2 py-2">
     <SidebarItem text="LinkedIn" icon={<LinkedinIcon/>} />
     </div>
     </div>

     <div className="pt-4 pl-12">
     <div className="hover:bg-gray-400 rounded-md cursor-pointer px-2 py-2">
     <SidebarItem text="Links" icon={<LinkIcon/>} />
     </div>
     </div>

     <div className=" flex justify-center gap-8 pt-8 ">
      <div className=" size-7xl ">
         <Link to="/signup" ><Button text="sign-up" variant="primary" /></Link>
      </div>
      <div>
         <Link to="/login" ><Button text="Log-in" variant="secondary" /></Link>
      </div>
     </div>

   </div>
   )
   
}