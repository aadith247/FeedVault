//UI libraries

import { ReactElement } from "react"
import { motion } from 'framer-motion';

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
    "primary" : "bg-[#7C3AED] text-white hover:bg-[#F472B6] font-bold",
    "secondary" : "bg-[#F472B6] text-white hover:bg-[#7C3AED] font-bold"
}

let sizeStyles={
    "sm" : "pd-4 w-30 py-2 text-md",
     "md" : "pd-4 w-40 py-3 text-md",
     "lg" : "pd-10 w-40 py-3 mt-2 text-lg" }

let defaultStyles="rounded-md  text-center cursor-pointer";

//   <Button variant="primary" size="md" onClick={} text="click me" startIcon="component"> </Button>
export const Button = (props:buttonProps)=>{
    return <motion.button
        onClick={props.onClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={`relative overflow-hidden ${variantStyles[props.variant]} ${sizeStyles[props.size]} rounded-xl shadow-md focus:ring-2 focus:ring-[#FBBF24] transition-all duration-200 ${defaultStyles}`}
    >
        <span className="absolute inset-0 pointer-events-none" />
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
    </motion.button>
}