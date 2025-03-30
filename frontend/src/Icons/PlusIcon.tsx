interface sizeProp{
    "size":"md"|"sm"|"lg"
}

let sizeStyle={
    "md" : "size-5",
    "lg":"size-8",
    "sm" : "size-2"
}

export const PlusIcon=(props:sizeProp)=>{
    return<>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"  className={sizeStyle[props.size]}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
  </>
  
}