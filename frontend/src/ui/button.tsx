import type { ReactElement } from "react";


interface ButtonProps {
    variant: "primary" | "secondary";
    text: String;
    startIcon?: ReactElement;
    onClick?: () => void;
}

const variantClasses = {
    "primary": " bg-purple-800 text-white px-4 py-2 rounded-md font-medium cursor-pointer ",
    "secondary": " bg-purple-200 text-purple-800  px-4 py-2 font-medium cursor-pointer ",
}

const defaultStyles = " px-2 py-2 rounded-md font-light flex items-center "

export function Button(props: ButtonProps) {
    return (
        <button onClick={props.onClick} className={` ${variantClasses[props.variant]} ${defaultStyles} `}>
         <div className=" pr-2 ">{props.startIcon}</div>
          
          {props.text}
      
        </button>
    );
}
