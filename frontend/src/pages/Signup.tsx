import { Title } from "../Components/ui/Title"
import { Inputbox } from "../Components/ui/Inputbox"
import { Button } from "../Components/ui/Button"
import {useRef} from 'react'
import { Backendurl } from "../Backendurl"
import axios from 'axios'
import { useNavigate } from "react-router-dom"

export function  Signup()
{
    const navigate=useNavigate();
    const usernameRef=useRef<any>(null); // generics..learn it by own
    const passwordRef=useRef<any>(null); // generics

    async function signup()
    {
        const username=usernameRef.current?.value;
        const password=passwordRef.current?.value;
       
      const response= await axios.post(Backendurl+"/api/v1/signup",{

        username:username,
        password:password

       });
       if(response)
       {
        navigate("/signin");

       }
       else {
        console.log("error");
       }
      

     

       console.log("signin success");
       



        // got whatever is entered... we created a reference to whatever is entered in the inputs..
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6F0] font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-0 overflow-hidden border border-[#F3F4F6]">
          <div className="bg-gradient-to-r from-[#7C3AED] via-[#F472B6] to-[#FBBF24] h-3 w-full mb-0" />
          <div className="p-10 flex flex-col gap-7">
            <div className="flex flex-col items-center mb-2">
              <Title text="Create your FeedVault account" size="lg" bold="yes" color="slate" />
              <div className="text-[#7C3AED] text-sm mt-1 font-semibold">Join the vault of knowledge!</div>
            </div>
            <div className="border-b border-[#F3F4F6] mb-4" />
            <Inputbox reference={usernameRef} placeholder="Username" />
            <Inputbox reference={passwordRef} placeholder="Password" />
            <Button size="md" text="Sign up" onClick={signup} variant="primary" />
            <div className="w-full text-center mt-2 text-xs text-[#7C3AED]">
              Already a user?{' '}
              <button type="button" className="underline font-semibold hover:text-[#F472B6] transition bg-transparent border-none outline-none" onClick={() => navigate('/signin')}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );

}