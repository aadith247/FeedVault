import { Documents } from "../Icons/Documents";
import { ShareIcon } from "../Icons/ShareIcon"
import {memo, useEffect, useRef } from 'react'
import { Deleteicon } from "../Icons/Deleteicon";
import axios from "axios";
import { Backendurl } from "../Backendurl";
import { motion } from 'framer-motion';

interface cardTypes{
    title:string,
    link:string,
    type:"youtube"|"twitter",
    tags?: string[]
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

const typeColors: Record<string, string> = {
  youtube: 'bg-[#7C3AED] text-white',
  twitter: 'bg-[#34D399] text-white',
  default: 'bg-[#F472B6] text-white'
};

const getYouTubeEmbedUrl = (url: string) => {
  // Handles both youtu.be and youtube.com links
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
};

const getTwitterId = (url: string) => {
  // Extracts tweet ID from a standard Twitter URL
  const match = url.match(/twitter\.com\/.+\/status\/(\d+)/);
  return match ? match[1] : '';
};

// Add global declaration for twttr
declare global {
  interface Window {
    twttr?: any;
  }
}

const Cardc=({title,link,type,tags=[]}:cardTypes)=>
{
    // Always convert x.com to twitter.com for embedding
    const normalizedLink = type === 'twitter' ? link.replace('x.com', 'twitter.com') : link;
    const isYouTube = type === 'youtube' && getYouTubeEmbedUrl(link);
    const isTwitter = type === 'twitter' && getTwitterId(normalizedLink);
    const tweetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (isTwitter && tweetRef.current) {
        if (!window.twttr) {
          const script = document.createElement('script');
          script.src = 'https://platform.twitter.com/widgets.js';
          script.async = true;
          script.onload = () => {
            if (window.twttr && window.twttr.widgets) {
              window.twttr.widgets.load(tweetRef.current);
            }
          };
          document.body.appendChild(script);
        } else if (window.twttr && window.twttr.widgets) {
          window.twttr.widgets.load(tweetRef.current);
        }
      }
    }, [isTwitter, normalizedLink]);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.04, boxShadow: '0 12px 32px rgba(124,58,237,0.15)' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-[#F9FAFB] rounded-3xl shadow-xl p-0 mb-6 border border-[#F3F4F6] overflow-hidden flex flex-col min-h-[180px]"
      >
        {/* Gradient header bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#7C3AED] via-[#F472B6] to-[#FBBF24]" />
        <div className="p-6 flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${typeColors[type] || typeColors.default}`}>{type}</span>
          </div>
          <div className="text-2xl font-extrabold text-[#22223B] leading-tight break-words mb-1 font-sans">{title}</div>
          {/* Preview Section */}
          {isYouTube && (
            <div className="w-full aspect-video rounded-xl overflow-hidden my-2 shadow">
              <iframe
                src={getYouTubeEmbedUrl(link)}
                title="YouTube video preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          )}
          {isTwitter && (
            <div ref={tweetRef} className="w-full my-2 rounded-xl shadow max-h-56 overflow-y-auto bg-white">
              <blockquote className="twitter-tweet">
                <a href={normalizedLink}>{normalizedLink}</a>
              </blockquote>
            </div>
          )}
          {/* fallback for Twitter if not a valid tweet link */}
          {!isYouTube && type === 'twitter' && !isTwitter && (
            <div className="w-full bg-[#E8F5FD] rounded-xl p-4 flex items-center gap-3 my-2 shadow">
              <svg viewBox="0 0 24 24" fill="#1DA1F2" className="w-6 h-6 flex-shrink-0"><g><path d="M22.46 5.924c-.793.352-1.646.59-2.542.698a4.48 4.48 0 001.963-2.475 8.94 8.94 0 01-2.828 1.082 4.48 4.48 0 00-7.635 4.086A12.72 12.72 0 013.11 4.86a4.48 4.48 0 001.39 5.976 4.45 4.45 0 01-2.03-.56v.057a4.48 4.48 0 003.59 4.393c-.4.11-.82.17-1.25.17-.31 0-.6-.03-.89-.08a4.48 4.48 0 004.18 3.11A8.98 8.98 0 012 19.54a12.67 12.67 0 006.88 2.02c8.26 0 12.78-6.84 12.78-12.78 0-.2 0-.39-.01-.58a9.22 9.22 0 002.27-2.34z"></path></g></svg>
              <div className="flex-1">
                <div className="text-[#22223B] font-semibold text-sm truncate">{normalizedLink}</div>
                <div className="text-xs text-[#7C3AED] mt-1">Twitter post preview</div>
              </div>
            </div>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, idx) => (
                <span key={idx} className="bg-[#FBBF24]/20 text-[#FBBF24] px-2 py-1 rounded-full text-xs font-semibold">#{tag}</span>
              ))}
            </div>
          )}
          <a
            href={normalizedLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-4 py-2 bg-gradient-to-r from-[#7C3AED] via-[#F472B6] to-[#FBBF24] text-white rounded-full font-bold shadow hover:from-[#F472B6] hover:to-[#7C3AED] transition-all duration-200 text-sm"
          >
            Visit Link
          </a>
        </div>
      </motion.div>
    );
};

export const Card = memo(Cardc)