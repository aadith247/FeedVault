
import { Button } from "../Components/ui/Button"
import { PlusIcon } from "../Icons/PlusIcon"
import { ShareIcon } from "../Icons/ShareIcon"
import {Sidebar} from '../Components/Sidebar'
import { Title } from "../Components/ui/Title"
import {Card} from '../Components/Card'
import { CreateContentModal } from "../Components/CreateContentModal"
import {useState} from 'react'
import { useContent } from "../hooks/Usecontent"
function shareLink()
{
    return <>
    {console.log('hi')
    }
    </>
}
export function Dashboard() 
{
  const [modalOpen,setModalOpen]=useState(false);
  const data=useContent();
  return (
    <> <CreateContentModal open={modalOpen} onClose={setModalOpen}></CreateContentModal>
   <div className="flex">
   <Sidebar/>
    <div className='h-screen max-h-screen bg-[#fafafa] w-full'>
      <div className="flex mt-8 ml-10 mr-4 justify-between">
  <Title text="All Notes" size="md" bold="yes" color="slate" ></Title>
<div className='flex gap-4'>
  <Button variant="secondary" size="lg"  startIcon={<ShareIcon size="md"/>} text="Share Brain" onClick={()=>{shareLink}}   />
  <Button onClick={()=>setModalOpen(true)} variant="primary" size="lg"  startIcon={<PlusIcon size="md"/>} text="Add Content"    />
  </div>
  </div>
  <div className='grid grid-cols-3 flex-wrap ml-12 m-10'>
   
  {data.map(({ title, link, type },index) => (
                <Card  key={`${index}`} type={type} title={title} link={link} /> ))} </div></div></div>
    </>) }