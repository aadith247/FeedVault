interface InputTypes{
    reference?:any,
    placeholder:string,
    className?: string
}


export const Inputbox=(props:InputTypes)=>{
    return (
      <div className="flex justify-center">
        <div className="flex-col justify-center w-full">
          <input
            type={props.placeholder.toLowerCase().includes('password') ? 'password' : 'text'}
            ref={props.reference}
            className={`p-3 w-full border border-[#F3F4F6] rounded-xl bg-[#F9FAFB] focus:bg-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#F472B6] transition-all duration-200 placeholder:text-[#F472B6] text-base outline-none ${props.className}`}
            placeholder={props.placeholder}
          />
        </div>
      </div>
    );
}