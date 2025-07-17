import { Title } from "../Components/ui/Title"
import { Inputbox } from "../Components/ui/Inputbox"
import { Button } from "../Components/ui/Button"
import {useRef} from 'react'
import axios from 'axios'
import { Backendurl } from "../Backendurl"

import { useNavigate } from "react-router-dom"


export function  Signin()
{
    const navigate=useNavigate()
   const usernameRef=useRef<HTMLInputElement>(null);
   const  passwordRef=useRef<HTMLInputElement>(null);

    async function signin()
    {
        const username=usernameRef.current?.value;
        const password=passwordRef.current?.value;
      const response:any= await axios.post(Backendurl+'/api/v1/signin',{
            username:username,
            password:password
        });
        const jwt=response.data.token;

      localStorage.setItem("token",jwt);
      navigate("/dashboard");

        
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6F0] font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-0 overflow-hidden border border-[#F3F4F6]">
          <div className="bg-gradient-to-r from-[#7C3AED] via-[#F472B6] to-[#FBBF24] h-3 w-full mb-0" />
          <div className="p-10 flex flex-col gap-7">
            <div className="flex flex-col items-center mb-2">
              <Title text="Sign in to FeedVault" size="lg" bold="yes" color="slate" />
              <div className="text-[#F472B6] text-sm mt-1 font-semibold">Welcome back, explorer!</div>
            </div>
            <div className="border-b border-[#F3F4F6] mb-4" />
            <Inputbox reference={usernameRef} placeholder="Username" />
            <Inputbox reference={passwordRef} placeholder="Password" />
            <Button size="md" text="Sign in" onClick={signin} variant="primary" />
            <div className="w-full text-center mt-2 text-xs text-[#7C3AED]">
              New user?{' '}
              <button type="button" className="underline font-semibold hover:text-[#F472B6] transition bg-transparent border-none outline-none" onClick={() => navigate('/signup')}>
                Signup
              </button>
            </div>
          </div>
        </div>
      </div>
    );

}