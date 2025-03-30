
import { Documents } from "../Icons/Documents";
import { ShareIcon } from "../Icons/ShareIcon"
import {memo } from 'react'
import { Deleteicon } from "../Icons/Deleteicon";
import axios from "axios";
import { Backendurl } from "../Backendurl";



interface cardTypes{
    title:string,
    link:string,
    type:"youtube"|"twitter"
}
//@ts-ignore
async function deleteContent(title,link)
    {
        console.log(link);
        title=encodeURIComponent(title);
        link=encodeURIComponent(link);
        console.log(title);
        console.log(link);
        await axios.delete(`${Backendurl}/api/v1/delete/${title}/${link}`,{
            headers:{
                "authorization":localStorage.getItem("token")
            }

        })
        


    }

const Cardc=({title,link,type}:cardTypes)=>
{

    

    return <div className='w-80 h-75 mt-2 border-[#e6e8eb] border-2 rounded-xl shadow-lg ' >
    <div className="flex justify-between items-center py-3 px-2">
  <div className="flex gap-2">
    <Documents size="md" />
    <p className=' text-[20px] font-semibold'>{title}</p>
    </div>

   <div className="flex flex-end gap-4">
<ShareIcon size="md"/>

    <Deleteicon size="md" onClick={()=>deleteContent(title,link)}/>
    </div>   

    </div>
  {type=="youtube" && <iframe  className="w-65 cursor-pointer place-self-center mt-5 items-center h-45 rounded-md" src={link.replace("watch","embed").replace("?v=","/").replace("&t","?si")} title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> }  
   {type == "twitter" && <div className="h-50 cursor-pointer overflow-auto"><blockquote className="twitter-tweet cursor-pointer">
        <a href={link.replace("x","twitter")}></a> 
      </blockquote></div>
      } 
    </div>  

};

export const Card = memo(Cardc)