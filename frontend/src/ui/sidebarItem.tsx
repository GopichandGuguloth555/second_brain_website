import type { ReactElement } from "react";


interface SidebarItem{

    text: string;
    icon: ReactElement;
}


     
export function SidebarItem(props: SidebarItem)
{
    return (

        <div className=" flex items-center justify-content ">
            <div className=" p-2 ">
                {props.icon}
            </div>
            <div className=" p-2">
                {props.text}
            </div>
        </div>
    )
    
}