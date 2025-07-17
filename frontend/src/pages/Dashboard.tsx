import { Button } from "../Components/ui/Button"
import { PlusIcon } from "../Icons/PlusIcon"
import { ShareIcon } from "../Icons/ShareIcon"
import {Sidebar, SIDEBAR_SECTIONS} from '../Components/Sidebar'
import { Title } from "../Components/ui/Title"
import {Card} from '../Components/Card'
import { CreateContentModal } from "../Components/CreateContentModal"
import {useState, useRef} from 'react'
import { useContent } from "../hooks/Usecontent"
import axios from 'axios';
import { Backendurl } from "../Backendurl";
import { MenuIcon } from '../Icons/MenuIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { CrossIcon } from '../Icons/CrossIcon';

export function Dashboard() 
{
  const [modalOpen,setModalOpen]=useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSummarizeModal, setShowSummarizeModal] = useState(false);
  const [summarizeTopic, setSummarizeTopic] = useState('');
  const [summary, setSummary] = useState('');
  const [summarizeLoading, setSummarizeLoading] = useState(false);
  const [summarizeError, setSummarizeError] = useState<string | null>(null);
  const topicInputRef = useRef<HTMLInputElement>(null);
  const data=useContent();
  const [selectedSection, setSelectedSection] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Responsive sidebar width
  const SIDEBAR_WIDTH = 288; // 72 * 4 (w-72)

  // Filter posts by selected section
  const filteredData = selectedSection === 'all'
    ? data
    : selectedSection === 'link'
      ? data.filter((item: any) => item.type === 'link')
      : data.filter((item: any) => item.type === selectedSection);

  async function handleShare() {
    setShareLoading(true);
    setShareError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        Backendurl + '/api/v1/share',
        { share: true },
        { headers: { authorization: token } }
      );
      const msg = response.data.message;
      const link = msg.replace('link is ', '').trim();
      setShareLink(window.location.origin + '/shared/' + link);
      setShowShareModal(true);
    } catch (err: any) {
      setShareError('Failed to generate share link.');
    } finally {
      setShareLoading(false);
    }
  }

  async function handleUnshare() {
    setShareLoading(true);
    setShareError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        Backendurl + '/api/v1/share',
        { share: false },
        { headers: { authorization: token } }
      );
      setShareLink(null);
      setShowShareModal(false);
    } catch (err: any) {
      setShareError('Failed to disable share link.');
    } finally {
      setShareLoading(false);
    }
  }

  function copyToClipboard() {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
    }
  }

  async function handleSummarize() {
    setSummarizeLoading(true);
    setSummarizeError(null);
    setSummary('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        Backendurl + '/api/v1/summarize',
        { topic: summarizeTopic },
        { headers: { authorization: token } }
      );
      setSummary(((response as any).data.summary));
    } catch (err: any) {
      setSummarizeError(err.response?.data?.message || 'Failed to summarize.');
    } finally {
      setSummarizeLoading(false);
    }
  }

  return (
    <>
      {/* Sidebar Toggle Button (mobile only, always visible) */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white rounded-full shadow-lg p-3 border border-[#F3F4F6] hover:bg-[#F3F4F6] transition-all focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        type="button"
      >
        {sidebarOpen ? <CrossIcon size="lg" /> : <MenuIcon size="lg" />}
      </button>
      {/* Sidebar and Overlay (mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -SIDEBAR_WIDTH, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -SIDEBAR_WIDTH, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl rounded-r-3xl flex flex-col md:hidden"
              style={{ width: SIDEBAR_WIDTH }}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
              <Sidebar selected={selectedSection} onSelect={key => { setSelectedSection(key); setSidebarOpen(false); }} />
              <div className="px-6 pb-8 pt-4 border-t border-[#F3F4F6] bg-white">
                <Button
                  variant="secondary"
                  onClick={() => {
                    localStorage.setItem("token", "");
                    window.location.href = "/signup";
                  }}
                  size="md"
                  text="Sign out"
                  startIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      {/* Sidebar (desktop) */}
      <aside className="hidden md:fixed md:top-0 md:left-0 md:h-full md:w-72 md:bg-white md:shadow-2xl md:rounded-r-3xl md:flex md:flex-col z-30">
        <Sidebar selected={selectedSection} onSelect={setSelectedSection} />
        <div className="px-6 pb-8 pt-4 border-t border-[#F3F4F6]">
          <Button
            variant="secondary"
            onClick={() => {
              localStorage.setItem("token", "");
              window.location.href = "/signup";
            }}
            size="md"
            text="Sign out"
            startIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>}
          />
        </div>
      </aside>
      <CreateContentModal open={modalOpen} onClose={setModalOpen}></CreateContentModal>
      {showSummarizeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg flex flex-col items-center">
            <div className="text-xl font-bold mb-4">AI Summarize Posts</div>
            <input
              ref={topicInputRef}
              className="border px-3 py-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter topic (e.g. AI, React, Finance)"
              value={summarizeTopic}
              onChange={e => setSummarizeTopic(e.target.value)}
            />
            <div className="flex gap-2 mb-4 w-full justify-end">
              <Button text="Summarize" onClick={handleSummarize} size="md" variant="primary" />
              <Button text="Close" onClick={() => setShowSummarizeModal(false)} size="md" variant="secondary" />
            </div>
            {summarizeLoading && <div className="text-indigo-500 mb-2">Summarizing...</div>}
            {summarizeError && <div className="text-red-500 mb-2">{summarizeError}</div>}
            {summary && (
              <div className="bg-gray-100 p-4 rounded w-full mt-2 text-gray-800 whitespace-pre-line max-h-60 overflow-y-auto">
                {summary}
              </div>
            )}
          </div>
        </div>
      )}
      {showShareModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg flex flex-col items-center">
            <div className="mb-2 font-bold">Share this link:</div>
            <input
              className="border px-2 py-1 w-64 mb-2"
              value={shareLink || ''}
              readOnly
              onClick={copyToClipboard}
            />
            <div className="flex gap-2">
              <Button text="Copy" onClick={copyToClipboard} size="sm" variant="secondary" />
              <Button text="Disable Link" onClick={handleUnshare} size="sm" variant="secondary" />
              <Button text="Close" onClick={() => setShowShareModal(false)} size="sm" variant="primary" />
            </div>
            {shareError && <div className="text-red-500 mt-2">{shareError}</div>}
          </div>
        </div>
      )}
      {/* Main content (with left margin on desktop) */}
      <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-white">
        <div className="hidden md:block" style={{ width: SIDEBAR_WIDTH }} />
        <div className='h-full w-full p-10 flex flex-col md:ml-8'>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <Title text={SIDEBAR_SECTIONS.find(s => s.key === selectedSection)?.text || 'All Notes'} size="lg" bold="yes" color="slate" />
            <div className='flex gap-4'>
              <Button variant="secondary" size="lg" startIcon={<ShareIcon size="md"/>} text={shareLoading ? "Sharing..." : "Share Brain"} onClick={handleShare} />
              <Button onClick={()=>setModalOpen(true)} variant="primary" size="lg" startIcon={<PlusIcon size="md"/>} text="Add Content" />
              <Button onClick={()=>setShowSummarizeModal(true)} variant="primary" size="lg" text="AI Summarize" />
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {filteredData.map(({ title, link, type, tags },index) => (
              <Card  key={`${index}`} type={type} title={title} link={link} tags={tags || []} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}