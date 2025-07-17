import { ReactElement } from "react";

interface SideType{
    text: string,
    startIcon: ReactElement,
    endIcon?: ReactElement,
    color: string,
    active?: boolean,
    onClick?: () => void
}

const defaultStyles="text-xl font-semibold";

export const SidebarItem=(props:SideType)=>{
    return (
      <div
        className={`flex mt-4 ml-5 gap-4 p-3 max-w-50 rounded-xl duration-300 cursor-pointer select-none transition-all
          ${props.active ? 'bg-gradient-to-r from-[#7C3AED]/10 to-[#F472B6]/10 text-[#7C3AED] shadow' : 'hover:bg-[#F3F4F6] text-[#373a45]'}
        `}
        onClick={props.onClick}
      >
        {props.startIcon}
        <div className={`${props.color} ${defaultStyles}`}>{props.text}</div>
        {props.endIcon}
      </div>
    );
}