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

    return<div className="inset-0 bg-[#fafafa] h-screen w-screen flex justify-center items-center">
       <div className="w-90 h-80 bg-white border-2 rounded-lg border-gray-300">
       <div className="flex-col justify-center">
        <div className="flex justify-center">
        <Title text="Signup" size="md" bold="yes" color="slate" />
        </div>
        <Inputbox reference={usernameRef} placeholder="Enter Username"/>
        <Inputbox reference={passwordRef} placeholder="Enter password"/>
        <div className="flex justify-center p-4">
        <Button size="md" text="Signup" onClick={signup} variant="primary"/>
        </div>
        </div>
       </div>

    </div>

}