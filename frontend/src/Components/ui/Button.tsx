
//UI libraries

import { ReactElement } from "react"

interface buttonProps // exporting this type to outside...
{
     //let us define type of something
    variant:"primary"| "secondary",
    size:"sm"|"md"|"lg",
    text:String | ReactElement,
    startIcon?:ReactElement, // reactElement you can keep instead of 'any'
    endIcon?:any,
    onClick?:()=>void }

let variantStyles={
    "primary" : "bg-[#5046e4] text-[#e0e7fe]",
    "secondary" : "bg-[#e0e7fe] text-[#5046e4]"
}

let sizeStyles={
    "sm" : "pd-4 w-30 py-2 text-md",
     "md" : "pd-4 w-40 py-3 text-md",
     "lg" : "pd-10 w-40 py-3 mt-2 text-lg" }

let defaultStyles="rounded-md  text-center cursor-pointer";

//   <Button variant="primary" size="md" onClick={} text="click me" startIcon="component"> </Button>
export const Button = (props:buttonProps)=>{
    return <button onClick={props.onClick} className={`${variantStyles[props.variant]} ${sizeStyles[props.size]} ${defaultStyles}`}>
   
            <div className="flex justify-center items-center">
            <div className=" pl-2">
            {props.startIcon}
            </div>
            <div className="pl-2" >
            {props.text}
            </div>
            <div className="pl-2">
                {props.endIcon}
            </div>
            </div>

      
   </button>
}