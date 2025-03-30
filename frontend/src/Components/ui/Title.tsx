interface Titletypes{
    text:String,
    size:"sm"|"md"|"lg" // whatever the user gives...
    bold:"yes"|"no",
    color:"slate"|"black"
   
}
// styles[props.text]
// styles[props.size] // the size given is sm..then styles of sm will be applied to the element

const titleStyles={
    "sm":"text-2xl",
    "md":"text-3xl",
    "lg": "text-4xl",
    "yes": "font-bold", 
    "no" : "font-medium",
    "slate":"text-[#373a45]",
    "black":"text-black"
    
}
const defaultStyles="text-[#373a45] py-4";

export const Title=(props:Titletypes)=>{

    return<p className={`${defaultStyles} ${titleStyles[props.size]} ${titleStyles[props.bold]} ${titleStyles[props.color]} `}>{props.text}</p>
   
};