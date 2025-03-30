import { ReactElement } from "react";

interface SideType{
    text:String,
    startIcon:ReactElement,
    endIcon?:ReactElement,
    color:String
}

const defaultStyles="text-xl";


export const SidebarItem=(props:SideType)=>{
    return <div className="flex mt-9 ml-5 gap-4 p-2 max-w-50 rounded-lg duration-300  hover:bg-gray-300 cursor-pointer ">
    {props.startIcon}
    <div className={`${props.color} ${defaultStyles}` }>{props.text}</div>
    </div>
};