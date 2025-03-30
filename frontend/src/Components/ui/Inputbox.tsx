interface InputTypes{
    reference?:any,
    placeholder:string,
    className?: string
}


export const Inputbox=(props:InputTypes)=>{
    return<>
    <div className="flex justify-center">
    <div className="flex-col justify-center ">
    {/* <p className="pl-2  ml-2 font-normal text-gray-500 text-lg">{props.placeholder}</p> */}
    <input type="text" ref={props.reference} className={`p-2 w-70 border-blue-300 border-2 rounded-lg m-2 ${props.className}`} placeholder={props.placeholder} ></input>
    </div>
    </div>
    </>
}