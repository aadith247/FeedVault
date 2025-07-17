import {CrossIcon} from "../Icons/CrossIcon";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

import {Inputbox} from './ui/Inputbox';
import { Button } from './ui/Button';
import { useState,useRef, KeyboardEvent } from "react";
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

export function CreateContentModal({ open, onClose }: CreateContentModalProps) {

    const titleRef=useRef<HTMLInputElement>(null);
    const linkRef=useRef<HTMLInputElement>(null);

    const [type,setType]=useState(content.Twitter);

    const [errors, setErrors] = useState<{ title?: string; link?: string }>({});
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    function handleTagInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
      if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
        e.preventDefault();
        if (!tags.includes(tagInput.trim())) {
          setTags([...tags, tagInput.trim()]);
        }
        setTagInput('');
      } else if (e.key === 'Backspace' && !tagInput && tags.length) {
        setTags(tags.slice(0, -1));
      }
    }

    function removeTag(idx: number) {
      setTags(tags.filter((_, i) => i !== idx));
    }

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

    setLoading(true);

    try {
      const response = await axios.post(Backendurl + "/api/v1/content", {
       title: titleRef.current?.value,
       link: linkRef.current?.value,
       type: type,
       tags: tags
     }, {
       headers: {
         'Authorization': `${localStorage.getItem('token')}`,
       }
     });
     console.log('Content posted successfully:', response.data);
     onClose(false);
    } catch (error) {
      console.error('Error posting content:', error);
      toast.error('An error occurred while posting content');
    } finally {
      setLoading(false);
    }
    }
    return (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-4"
              >
                <div className="flex justify-end">
                  <CrossIcon onClick={() => { onClose(false) }} size="md" />
                </div>
                <div className="flex justify-center">
                  <Title text="Add the content" size="md" color="slate" bold="no" />
                </div>
                <div className="max-w-90">
                  <Inputbox reference={titleRef} placeholder="Title" className={errors.title ? 'border-red-500' : ''} /><br />
                  <Inputbox reference={linkRef} placeholder="Link" className={errors.link ? 'border-red-500' : ''} /><br />
                  {/* Tags input */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag, idx) => (
                        <span key={idx} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                          {tag}
                          <button type="button" className="ml-1 text-indigo-400 hover:text-red-500" onClick={() => removeTag(idx)}>&times;</button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="Add tags (press Enter or comma)"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button size="md" onClick={() => setType(content.Youtube)} variant={type == "youtube" ? "primary" : "secondary"} text="Youtube"></Button>
                    <Button size="md" onClick={() => setType(content.Twitter)} variant={type == "twitter" ? "primary" : "secondary"} text="Twitter"></Button>
                  </div>
                  <div className="flex justify-center mt-10">
                    <Button size="md" text="Submit" onClick={postcontent} variant="primary" />
                  </div>
                </div>
                {loading && (
                  <div className="flex justify-center items-center mt-2">
                    <svg className="animate-spin h-6 w-6 text-indigo-500" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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