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

export const SIDEBAR_SECTIONS = [
  { key: 'all', text: 'All Posts', icon: <Documents size="md" />, color: 'text-[#7C3AED]' },
  { key: 'youtube', text: 'YouTube Feed', icon: <Youtube size="md" />, color: 'text-[#7C3AED]' },
  { key: 'twitter', text: 'Twitter Feed', icon: <Twitter size="md" />, color: 'text-[#34D399]' },
  { key: 'link', text: 'Others', icon: <Links size="md" />, color: 'text-[#64748B]' },
];

export const Sidebar = ({ selected, onSelect }: { selected: string, onSelect: (key: string) => void }) => {
  const navigate = useNavigate();
  return (
    <nav className="flex flex-col h-full w-full bg-white  rounded-r-3xl px-4 py-6">
      {/* Logo at the top */}
      <div className="flex items-center gap-3 mb-8 px-2 mt-6">
        <Brainlogo size="lg" />
        <span className="font-extrabold text-2xl text-[#7C3AED] tracking-tight">FeedVault</span>
      </div>
      {/* Divider */}
      <div className="border-b border-[#F3F4F6] mb-6 mx-2" />
      {/* Navigation */}
      <div className="flex-1 flex flex-col justify-start gap-2">
        {SIDEBAR_SECTIONS.map(section => (
          <SidebarItem
            key={section.key}
            color={section.color}
            text={section.text}
            startIcon={section.icon}
            active={selected === section.key}
            onClick={() => onSelect(section.key)}
          />
        ))}
      </div>
      {/* Divider above sign out (handled in Dashboard) */}
      <div className="border-t border-[#F3F4F6] mt-6 mx-2" />
    </nav>
  );
};