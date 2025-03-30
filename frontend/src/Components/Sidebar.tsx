
import { Title } from "./ui/Title";
import { SidebarItem } from "./SidebarItem";
import { Twitter } from "../Icons/Twitter";
import { Documents } from "../Icons/Documents";
import {Youtube} from '../Icons/Youtube'
import {Links} from '../Icons/Links'
import { Button } from "./ui/Button";
import { Tags } from "../Icons/Tags";
import { Brainlogo } from "../Icons/Brainlogo";
import { useNavigate } from "react-router-dom";

export const Sidebar=()=>{
    const navigate=useNavigate();
return <div className='w-100 py-2 px-2' >
    <div className="flex mt-6 pb-4 ml-4 gap-4">
   <Brainlogo size="lg"></Brainlogo>
<Title size="md"  text="FeedVault" bold="yes" color="slate"></Title>
</div>
<div>
<SidebarItem color="text-[#373a45]" text="Tweets" startIcon={<Twitter size="md"></Twitter>}></SidebarItem>
<SidebarItem color="text-[#373a45]" text="Videos" startIcon={<Youtube size="md"></Youtube>}></SidebarItem>
<SidebarItem color="text-[#373a45]" text="Documents" startIcon={<Documents size="md"></Documents>}></SidebarItem>
<SidebarItem color="text-[#373a45]" text="Links" startIcon={<Links size="md"></Links>}></SidebarItem>
<SidebarItem color="text-[#373a45]" text="Tags" startIcon={<Tags size="md"></Tags>}></SidebarItem>
</div>
<Button variant="primary" onClick={()=>{
    localStorage.setItem("token","");
    navigate("/signup");
}} size="md" text="Sign out"/>
</div>


};