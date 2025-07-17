// @ts-ignore
// eslint-disable-next-line
declare const chrome: any;
import React, { useEffect, useState, useRef } from 'react';
import { Brainlogo } from './Brainlogo';

const BACKEND_URL = 'http://localhost:3001'; // Change to your backend URL

function openDashboard() {
  window.open('https://your-feedvault-domain.com/dashboard', '_blank'); // Change to your deployed dashboard URL
}

function openDashboardWithJWT(token: string) {
  const dashboardUrl = 'https://your-feedvault-domain.com/dashboard'; // Change to your deployed dashboard URL
  chrome.tabs.create({ url: dashboardUrl }, (tab: any) => {
    if (tab.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (jwt: string) => {
          localStorage.setItem('token', jwt);
        },
        args: [token],
      });
    }
  });
}

export const Popup: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [feeds, setFeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [signupMode, setSignupMode] = useState(false);
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);

  // Load token from chrome.storage
  useEffect(() => {
    chrome.storage.local.get(['feedvault_jwt'], (result: any) => {
      if (result.feedvault_jwt) setToken(result.feedvault_jwt);
    });
  }, []);

  // Fetch feeds if logged in
  useEffect(() => {
    if (token) {
      fetch(`${BACKEND_URL}/api/v1/content`, {
        headers: { authorization: token },
      })
        .then(res => res.json())
        .then(data => setFeeds(data.content || []))
        .catch(() => setError('Failed to fetch feeds'));
    }
  }, [token]);

  // Toast auto-hide
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.token) {
        chrome.storage.local.set({ feedvault_jwt: data.token });
        setToken(data.token);
        setSuccess('Logged in!');
        setShowToast(true);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setSignupSuccess(null);
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: signupUsername, password: signupPassword }),
      });
      const data = await res.json();
      if (data.message && data.message.toLowerCase().includes('success')) {
        setSignupSuccess('Signup successful! Please log in.');
        setSignupUsername('');
        setSignupPassword('');
      } else {
        setSignupError(data.message || 'Signup failed');
      }
    } catch {
      setSignupError('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  function getContentType(url: string) {
    if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
    if (/twitter\.com|x\.com/.test(url)) return 'twitter';
    return 'link';
  }

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs: any[]) => {
      const tab = tabs[0];
      if (!tab || !tab.url) {
        setError('No active tab');
        setLoading(false);
        return;
      }
      const type = getContentType(tab.url);
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: token!,
          },
          body: JSON.stringify({
            title: tab.title || 'Untitled',
            link: tab.url,
            type,
            tags,
          }),
        });
        const data = await res.json();
        if (data.message === 'content added') {
          setSuccess('Content successfully added!');
          setShowToast(true);
          setTags([]);
          setTagInput('');
          // Optionally refresh feeds
          fetch(`${BACKEND_URL}/api/v1/content`, {
            headers: { authorization: token! },
          })
            .then(res => res.json())
            .then(data => setFeeds(data.content || []));
        } else {
          setError(data.message || 'Save failed');
        }
      } catch {
        setError('Save failed');
      } finally {
        setLoading(false);
      }
    });
  };

  const handleLogout = () => {
    chrome.storage.local.remove('feedvault_jwt');
    setToken(null);
    setFeeds([]);
  };

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
    if (e.target.value.endsWith(' ')) {
      const newTag = e.target.value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="w-80 min-h-[28rem] flex flex-col items-center justify-between p-0">
      <div className="w-full flex-1 flex flex-col items-center justify-center">
        {/* Glassy Card */}
        <div className="w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-[#F3F4F6] mt-4 mb-2 px-6 py-6 flex flex-col items-center">
          {/* Logo and Title */}
          <div className="flex flex-row items-center justify-center w-full" style={{gap: '0.75rem', height: '2.5rem', marginBottom: '2.5rem'}}>
            <Brainlogo className="" />
            <span className="font-extrabold text-[#22223B] tracking-tight font-sans" style={{fontSize: '2.5rem', letterSpacing: '-0.03em', lineHeight: '1.05', height: '2.5rem', display: 'flex', alignItems: 'center'}}>FeedVault</span>
          </div>
          {!token ? (
            signupMode ? (
              <form onSubmit={handleSignup} className="flex flex-col gap-3 w-full items-center">
                <input
                  className="fv-input"
                  placeholder="Username"
                  value={signupUsername}
                  onChange={e => setSignupUsername(e.target.value)}
                  required
                />
                <input
                  className="fv-input"
                  placeholder="Password"
                  type="password"
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full fv-btn fv-btn-primary fv-btn-lg mt-2"
                  disabled={loading}
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </button>
                {signupError && <div className="text-red-500 text-sm mt-1 text-center">{signupError}</div>}
                {signupSuccess && <div className="text-green-600 text-sm mt-1 text-center">{signupSuccess}</div>}
                <div className="w-full text-center mt-2 text-xs text-[#7C3AED]">
                  Already a user?{' '}
                  <a
                    role="button"
                    tabIndex={0}
                    className="underline font-semibold hover:text-[#F472B6] transition cursor-pointer"
                    onClick={e => { e.preventDefault(); setSignupMode(false); }}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSignupMode(false); } }}
                    href="#"
                  >
                    Login
                  </a>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="flex flex-col gap-3 w-full items-center">
                <input
                  className="fv-input"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
                <input
                  className="fv-input"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full fv-btn fv-btn-primary fv-btn-lg mt-2"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                {error && <div className="text-red-500 text-sm mt-1 text-center">{error}</div>}
                {success && <div className="text-green-600 text-sm mt-1 text-center">{success}</div>}
                <div className="w-full text-center mt-2 text-xs text-[#7C3AED]">
                  New user?{' '}
                  <a
                    role="button"
                    tabIndex={0}
                    className="underline font-semibold hover:text-[#F472B6] transition cursor-pointer"
                    onClick={e => { e.preventDefault(); setSignupMode(true); }}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSignupMode(true); } }}
                    href="#"
                  >
                    Signup
                  </a>
                </div>
              </form>
            )
          ) : (
            <>
              {/* Tag input and chips */}
              <div className="w-full mb-4">
                <div className="fv-tagbox flex flex-wrap items-center min-h-[3rem] px-3 py-2 rounded-2xl border border-[#F3F4F6] bg-[#F9FAFB] shadow-sm focus-within:ring-2 focus-within:ring-[#7C3AED] transition-all">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="bg-[#FBBF24]/20 text-[#FBBF24] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 mr-2 mb-1 shadow-sm">
                      #{tag}
                      <button
                        className="ml-1 text-[#F472B6] hover:text-[#7C3AED] text-xs font-bold focus:outline-none"
                        onClick={() => removeTag(tag)}
                        aria-label={`Remove tag ${tag}`}
                        tabIndex={-1}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    ref={tagInputRef}
                    className="flex-1 min-w-[6ch] bg-transparent border-none outline-none px-2 py-1 text-base placeholder:text-gray-400 focus:ring-0"
                    style={{maxWidth: '100%'}}
                    placeholder={tags.length === 0 ? 'Add tags…' : ''}
                    value={tagInput}
                    onChange={handleTagInput}
                    onKeyDown={handleTagKeyDown}
                    maxLength={20}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Sticky Save and See All Posts buttons */}
      {token && (
        <div className="w-full flex flex-col items-center px-6 pb-4 gap-3" style={{marginTop: '2.5rem'}}>
          <button
            className="fv-btn fv-btn-primary fv-btn-lg"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save This Page'}
          </button>
          <button
            className="fv-btn fv-btn-secondary fv-btn-lg"
            onClick={() => token && openDashboardWithJWT(token)}
          >
            See All Posts
          </button>
        </div>
      )}
      {/* Sign Out link at the very bottom */}
      {token && (
        <div className="w-full flex justify-center pb-2">
          <button
            className="text-xs text-[#7C3AED] opacity-70 hover:opacity-100 underline bg-transparent border-none outline-none cursor-pointer"
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', outline: 'none' }}
          >
            Sign Out
          </button>
        </div>
      )}
      {/* Toast for success (top center) */}
      {showToast && success && (
        <div className="fixed left-1/2 top-4 -translate-x-1/2 z-50 bg-white/90 border border-[#7C3AED] text-[#7C3AED] px-4 py-2 rounded-full shadow-lg text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4" fill="none" stroke="#7C3AED" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          {success}
          <button className="ml-2 text-[#F472B6] hover:text-[#7C3AED] text-xs font-bold focus:outline-none" onClick={() => setShowToast(false)}>×</button>
        </div>
      )}
      {error && !showToast && (
        <div className="fixed left-1/2 top-4 -translate-x-1/2 z-50 bg-white/90 border border-red-400 text-red-500 px-4 py-2 rounded-full shadow-lg text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4" fill="none" stroke="#F472B6" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          {error}
          <button className="ml-2 text-[#F472B6] hover:text-[#7C3AED] text-xs font-bold focus:outline-none" onClick={() => setError(null)}>×</button>
        </div>
      )}
    </div>
  );
}; 