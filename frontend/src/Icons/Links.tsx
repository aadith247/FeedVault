interface sizeProp{
    "size":"md"|"sm"|"lg"
}

let sizeStyle={
    "md" : "size-5",
    "lg":"size-8",
    "sm" : "size-2"
}

let defaultStyles="self-center";

export const Links=(props:sizeProp)=>{
    return<>
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`${sizeStyle[props.size]} ${defaultStyles}`}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
</svg>

  </>
  
}