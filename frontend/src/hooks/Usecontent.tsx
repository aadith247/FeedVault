import { Backendurl } from "../Backendurl";
import {useState,useEffect} from 'react'
import axios from 'axios'

export function useContent(){
    const [data,setData]=useState([]);

    useEffect(()=>{
    axios.get(Backendurl+"/api/v1/content",{
        headers:{
            "authorization":localStorage.getItem('token')
        }
    }).then
    ((response:any) => {
        setData(response.data.content);
    });

   },[]);

   return data;

};