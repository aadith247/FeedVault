interface sizeProp{
    "size":"md"|"sm"|"lg",
    onClick:()=>void
}

let sizeStyle={
    "md" : "size-5",
    "lg":"size-9",
    "sm" : "size-2"
}


const defaultStyles="ml-45 cursor-pointer"


export const CrossIcon=(props:sizeProp)=>{
    return<>
   <svg onClick={props.onClick} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className=  {`${sizeStyle[props.size]} ${defaultStyles}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>

  </>
  
}