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
    return<div className="inset-0 bg-[#fafafa] h-screen w-screen flex justify-center items-center">
       <div className="w-90 h-80 bg-white border-2 rounded-lg border-gray-300">
       <div className="flex-col justify-center">
        <div className="flex justify-center">
        <Title text="Signin" size="md" bold="yes" color="slate" />
        </div>
        <Inputbox reference={usernameRef} placeholder="Enter Username"/>
        <Inputbox reference={passwordRef} placeholder="Enter password"/>
        <div className="flex justify-center p-4">
        
        <Button size="md" text="Signin" onClick={signin} variant="primary"/>
        </div>

        </div>
       </div>

    </div>

}