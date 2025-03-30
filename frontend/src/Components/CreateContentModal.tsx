import {CrossIcon} from "../Icons/CrossIcon";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {Inputbox} from './ui/Inputbox';
import { Button } from './ui/Button';
import { useState,useRef } from "react";
import { Backendurl } from "../Backendurl";
import axios from "axios";
import { Title } from "./ui/Title";
import { z } from 'zod';

interface CreateContentModalProps {
  open: true|false;
  onClose:(x:any)=>void;
}



enum content {
    "Youtube"='youtube',
    "Twitter"="twitter"
}

// Define a schema for validation
const contentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  link: z.string().url('Invalid URL format'),
});

export const CreateContentModal = ({ open, onClose }: CreateContentModalProps) => {

    const titleRef=useRef<HTMLInputElement>(null);
    const linkRef=useRef<HTMLInputElement>(null);

    const [type,setType]=useState(content.Twitter);

    const [errors, setErrors] = useState<{ title?: string; link?: string }>({});

 async function postcontent()
  {
   // Validate inputs
   const validation = contentSchema.safeParse({
     title: titleRef.current?.value || '',
     link: linkRef.current?.value || '',
   });

   if (!validation.success) {
     // Handle validation errors
     const formattedErrors = validation.error.format();
     setErrors({
       title: formattedErrors.title?._errors[0],
       link: formattedErrors.link?._errors[0],
     });
     toast.error('Please fix the errors in the form');
     return;
   }

   // Clear errors
   setErrors({});

  await axios.post(Backendurl + "/api/v1/content", {
     title: titleRef.current?.value,
     link: linkRef.current?.value,
     type: type
   }, {
     headers: {
       'Authorization': `${localStorage.getItem('token')}`,
     }
   });
   
   onClose(false);
  }
    return (
        <div>
          {open && (
            <div className="fixed inset-0 flex justify-center">
              <div className="absolute inset-0 bg-slate-300 opacity-60"></div>
              <div className="relative z-50 flex flex-col justify-center">
                <div className="bg-[#f8f8f8] border-slate-300 border-1 w-90 h-120  opacity-100 p-4 rounded-xl">

                    
                <div className="flex justify-end">
                   
                   <CrossIcon onClick={()=>{onClose(false)}} size="md"/>
                   </div>
                <div className="flex justify-center">
                <Title text="Add the content" size="md" color="slate" bold="no" />
                </div>
                
                   
                        <div className="max-w-90">
                           
                            <Inputbox reference={titleRef} placeholder="Title" className={errors.title ? 'border-red-500' : ''}/><br/>

                            <Inputbox reference={linkRef} placeholder="Link" className={errors.link ? 'border-red-500' : ''}/><br/>
                          
                            {/* <Dropdown  /> */}
                             <div className="flex gap-4">
                                <Button size="md" onClick={()=>setType(content.Youtube)} variant={type=="youtube"?"primary":"secondary" } text="Youtube"></Button>
                                <Button size="md" onClick={()=>setType(content.Twitter)} variant={type=="twitter"?"primary":"secondary"}  text="Twitter"></Button>
                                </div>
                                <div className="flex justify-center mt-10">
                            <Button size="md" text="Submit" onClick={postcontent} variant="primary"/>
                            </div>
            
                            </div>
                </div>
              </div>
            </div>
          )}
          <ToastContainer aria-label="Notification" />
        </div>
      );

//   return (
//     <>
//       {open === "true" && (
//         <div className="fixed inset-0 flex items-center justify-center">
//           {/* Semi-transparent backdrop */}
//           <div className="absolute inset-0 bg-slate-300/70 backdrop-blur-sm" />
          
//           {/* Modal content - fully opaque */}
//           <div className="relative z-50 w-full max-w-lg">
//             <div className="bg-white rounded-lg shadow-xl p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold text-gray-900">Create Content</h2>
//                 <button 
//                   className="text-gray-400 hover:text-gray-500 transition-colors"
//                   onClick={() => onClose}
//                 >
//                   <X className="h-5 w-5" />
//                 </button>
//               </div>
              
//               <div className="space-y-6">
//                 <Input />
                
//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//                     onClick={() => onClose}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
//                   >
//                     Submit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
};