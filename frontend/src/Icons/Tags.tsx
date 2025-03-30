interface sizeProp{
    "size":"md"|"sm"|"lg"
}

let sizeStyle={
    "md" : "size-5",
    "lg":"size-8",
    "sm" : "size-2"
}

let defaultStyles="self-center";

export const Tags=(props:sizeProp)=>{
    return<>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`${sizeStyle[props.size]} ${defaultStyles}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
</svg>

  </>
  
}