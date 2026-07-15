import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Code2, 
  Settings, 
  Link2, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  Wifi, 
  Battery, 
  Clock, 
  ArrowRight, 
  Save, 
  RotateCcw, 
  Smartphone, 
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Default URLs to make it work immediately
const DEFAULT_MEET_URL = "https://meet.google.com/abc-defg-hij";
const DEFAULT_DEV_MEET_URL = "https://meet.google.com/xyz-uvwx-yza";

export default function App() {
  // Persistence state
  const [meetUrl, setMeetUrl] = useState(() => {
    return localStorage.getItem('user_meet_url') || DEFAULT_MEET_URL;
  });
  const [devMeetUrl, setDevMeetUrl] = useState(() => {
    return localStorage.getItem('user_dev_meet_url') || DEFAULT_DEV_MEET_URL;
  });

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'join' | 'settings'>('join');

  // Input states for setting values
  const [inputMeet, setInputMeet] = useState(meetUrl);
  const [inputDevMeet, setInputDevMeet] = useState(devMeetUrl);

  // Validation state
  const [errors, setErrors] = useState<{ meet?: string; devMeet?: string }>({});
  
  // Notification states
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState<string | null>(null);

  // Clock state for the status bar
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update draft values when saved values change (like on Reset)
  useEffect(() => {
    setInputMeet(meetUrl);
    setInputDevMeet(devMeetUrl);
  }, [meetUrl, devMeetUrl]);

  // URL Validator helper
  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    try {
      // Must start with http or https
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  // Save Link Configuration
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { meet?: string; devMeet?: string } = {};

    if (!validateUrl(inputMeet)) {
      newErrors.meet = "অনুগ্রহ করে একটি সঠিক লিঙ্ক প্রদান করুন (যেমন: https://meet.google.com/...)";
    }
    if (!validateUrl(inputDevMeet)) {
      newErrors.devMeet = "অনুগ্রহ করে একটি সঠিক লিঙ্ক প্রদান করুন (যেমন: https://meet.google.com/...)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    localStorage.setItem('user_meet_url', inputMeet.trim());
    localStorage.setItem('user_dev_meet_url', inputDevMeet.trim());
    setMeetUrl(inputMeet.trim());
    setDevMeetUrl(inputDevMeet.trim());
    
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveTab('join');
    }, 1200);
  };

  // Reset to default links
  const handleResetToDefaults = () => {
    if (window.confirm("আপনি কি লিঙ্কগুলো ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?")) {
      localStorage.removeItem('user_meet_url');
      localStorage.removeItem('user_dev_meet_url');
      setMeetUrl(DEFAULT_MEET_URL);
      setDevMeetUrl(DEFAULT_DEV_MEET_URL);
      setErrors({});
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1200);
    }
  };

  // Trigger google meet redirect
  const handleJoinMeet = (url: string, meetName: string) => {
    setIsRedirecting(meetName);
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      setIsRedirecting(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 md:p-8 font-sans select-none overflow-x-hidden relative">
      {/* Background Ambience decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Top App Header (Outside Mobile Frame) */}
        <div className="text-center mb-5">
          <h1 id="app-title" className="text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <span>Meet Link Manager</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 Bengali-sub">
            সহজে গুগল মিট লিঙ্কে জয়েন ও কনফিগার করার মোবাইল হাব
          </p>
        </div>

        {/* Realistic Mobile Device Frame */}
        <div className="bg-zinc-900 border-[8px] border-zinc-800 rounded-[3rem] shadow-2xl overflow-hidden aspect-[9/19.5] w-full max-w-[380px] mx-auto flex flex-col relative ring-1 ring-white/10">
          
          {/* Speaker / Notch (Dynamic Island look) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-zinc-800 absolute left-3" />
            <div className="w-12 h-1 bg-zinc-900 rounded-full" />
          </div>

          {/* Mobile Status Bar */}
          <div className="bg-zinc-950 text-zinc-300 h-10 px-6 pt-3 flex justify-between items-center text-xs font-medium tracking-wide z-40 relative">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{currentTime || "09:14 AM"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded border border-emerald-500/30">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">98%</span>
                <Battery className="w-4 h-4 text-emerald-400 fill-current" />
              </div>
            </div>
          </div>

          {/* Mobile Screen Area */}
          <div className="flex-1 bg-zinc-950 flex flex-col justify-between overflow-y-auto overflow-x-hidden p-5 pt-4 scrollbar-thin scrollbar-thumb-zinc-800">
            
            {/* Main Application Body */}
            <div className="flex-1 flex flex-col justify-start">
              
              <AnimatePresence mode="wait">
                {/* 1. Redirecting Overlay Screen inside App */}
                {isRedirecting && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-zinc-950/95 flex flex-col items-center justify-center p-6 text-center z-50"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mb-6"
                    />
                    <h3 className="text-xl font-bold text-white mb-2">Redirecting...</h3>
                    <p className="text-sm text-zinc-400 mb-4 Bengali-sub">
                      আপনাকে <span className="text-emerald-400 font-semibold">{isRedirecting}</span> সেশনে নিয়ে যাওয়া হচ্ছে।
                    </p>
                    <div className="px-3 py-1.5 bg-zinc-900 rounded-lg text-xs font-mono text-zinc-500 truncate max-w-xs">
                      {isRedirecting === "Meet" ? meetUrl : devMeetUrl}
                    </div>
                  </motion.div>
                )}

                {/* 2. JOIN TAB */}
                {activeTab === 'join' && !isRedirecting && (
                  <motion.div
                    key="join-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col space-y-6 pt-2"
                  >
                    {/* Welcome Card */}
                    <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Smartphone className="w-16 h-16 text-zinc-400" />
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-800/30">
                        Active Dashboard
                      </span>
                      <h2 className="text-lg font-bold text-white mt-3 mb-1">মিটিং লিঙ্ক সিলেক্টর</h2>
                      <p className="text-xs text-zinc-400 leading-relaxed Bengali-sub">
                        নিচের বাটনগুলোতে ক্লিক করে সরাসরি আপনার সেট করা গুগল মিটে জয়েন করুন।
                      </p>
                    </div>

                    {/* Main Actions Container */}
                    <div className="flex flex-col space-y-4">
                      
                      {/* ACTION CARD 1: JOIN MEET */}
                      <motion.div 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleJoinMeet(meetUrl, "Meet")}
                        className="bg-zinc-900 hover:bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 p-4 rounded-2xl cursor-pointer transition-all duration-300 shadow-lg group relative overflow-hidden"
                      >
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3.5">
                            <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800/50 group-hover:scale-110 transition-transform duration-300">
                              <Video className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">Join meet</h3>
                              <p className="text-[11px] text-zinc-400 mt-0.5 Bengali-sub font-medium">সাধারণ মিটিংয়ে যোগ দিন</p>
                            </div>
                          </div>
                          <div className="p-1 bg-zinc-800 group-hover:bg-emerald-500 group-hover:text-black rounded-full transition-all">
                            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>

                        {/* Link Preview Indicator */}
                        <div className="mt-3 pt-2.5 border-t border-zinc-800/50 flex items-center justify-between text-[10px] text-zinc-500">
                          <span className="flex items-center gap-1 font-mono truncate max-w-[200px]">
                            <Link2 className="w-3 h-3 text-zinc-600 flex-shrink-0" />
                            {meetUrl}
                          </span>
                          <span className="bg-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-400 uppercase font-mono tracking-wider text-[9px]">
                            {meetUrl === DEFAULT_MEET_URL ? "Default" : "Custom"}
                          </span>
                        </div>
                      </motion.div>

                      {/* ACTION CARD 2: JOIN DEV MEET */}
                      <motion.div 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleJoinMeet(devMeetUrl, "Dev Meet")}
                        className="bg-zinc-900 hover:bg-zinc-900/80 border border-zinc-800 hover:border-sky-500/50 p-4 rounded-2xl cursor-pointer transition-all duration-300 shadow-lg group relative overflow-hidden"
                      >
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3.5">
                            <div className="p-3 bg-sky-950 text-sky-400 rounded-xl border border-sky-800/50 group-hover:scale-110 transition-transform duration-300">
                              <Code2 className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">Join dev meet</h3>
                              <p className="text-[11px] text-zinc-400 mt-0.5 Bengali-sub font-medium">ডেভলপার মিটিংয়ে যোগ দিন</p>
                            </div>
                          </div>
                          <div className="p-1 bg-zinc-800 group-hover:bg-sky-500 group-hover:text-black rounded-full transition-all">
                            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>

                        {/* Link Preview Indicator */}
                        <div className="mt-3 pt-2.5 border-t border-zinc-800/50 flex items-center justify-between text-[10px] text-zinc-500">
                          <span className="flex items-center gap-1 font-mono truncate max-w-[200px]">
                            <Link2 className="w-3 h-3 text-zinc-600 flex-shrink-0" />
                            {devMeetUrl}
                          </span>
                          <span className="bg-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-400 uppercase font-mono tracking-wider text-[9px]">
                            {devMeetUrl === DEFAULT_DEV_MEET_URL ? "Default" : "Custom"}
                          </span>
                        </div>
                      </motion.div>

                    </div>

                    {/* Simple Help Info card */}
                    <div className="bg-zinc-900/35 border border-zinc-900 p-3 rounded-xl flex items-start space-x-2">
                      <Info className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                      <p className="text-[10px] text-zinc-500 leading-snug Bengali-sub">
                        লিঙ্ক পরিবর্তন করতে চাইলে নিচের <span className="text-zinc-400 font-semibold">Settings</span> ট্যাব থেকে পরিবর্তন করে নিতে পারবেন।
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 3. SETTINGS TAB */}
                {activeTab === 'settings' && (
                  <motion.div
                    key="settings-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col space-y-5 pt-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-white">সেটিংস / Configure</h2>
                        <p className="text-[11px] text-zinc-400 Bengali-sub">মিটিং লিঙ্কগুলো নিজের ইচ্ছেমত সেট করুন</p>
                      </div>
                    </div>

                    <form onSubmit={handleSaveChanges} className="space-y-4">
                      {/* Input 1: Join Meet URL */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Meet Link URL</span>
                        </label>
                        <input
                          type="text"
                          value={inputMeet}
                          onChange={(e) => setInputMeet(e.target.value)}
                          placeholder="https://meet.google.com/abc-defg-hij"
                          className={`w-full bg-zinc-900 text-zinc-100 text-xs px-3 py-2.5 rounded-xl border ${
                            errors.meet ? 'border-red-500/80 focus:ring-red-500/20' : 'border-zinc-800 focus:ring-emerald-500/20'
                          } focus:outline-none focus:ring-4 transition-all font-mono`}
                        />
                        {errors.meet ? (
                          <p className="text-[10px] text-red-400 flex items-center gap-1 mt-1 font-sans Bengali-sub">
                            <AlertCircle className="w-3 h-3 flex-shrink-0" />
                            <span>{errors.meet}</span>
                          </p>
                        ) : (
                          <p className="text-[9px] text-zinc-500 Bengali-sub font-mono">
                            ডিফল্ট: {DEFAULT_MEET_URL}
                          </p>
                        )}
                      </div>

                      {/* Input 2: Join Dev Meet URL */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-sky-400" />
                          <span>Dev Meet Link URL</span>
                        </label>
                        <input
                          type="text"
                          value={inputDevMeet}
                          onChange={(e) => setInputDevMeet(e.target.value)}
                          placeholder="https://meet.google.com/xyz-uvwx-yza"
                          className={`w-full bg-zinc-900 text-zinc-100 text-xs px-3 py-2.5 rounded-xl border ${
                            errors.devMeet ? 'border-red-500/80 focus:ring-red-500/20' : 'border-zinc-800 focus:ring-sky-500/20'
                          } focus:outline-none focus:ring-4 transition-all font-mono`}
                        />
                        {errors.devMeet ? (
                          <p className="text-[10px] text-red-400 flex items-center gap-1 mt-1 font-sans Bengali-sub">
                            <AlertCircle className="w-3 h-3 flex-shrink-0" />
                            <span>{errors.devMeet}</span>
                          </p>
                        ) : (
                          <p className="text-[9px] text-zinc-500 Bengali-sub font-mono">
                            ডিফল্ট: {DEFAULT_DEV_MEET_URL}
                          </p>
                        )}
                      </div>

                      {/* Submit / Action Buttons */}
                      <div className="flex flex-col space-y-2 pt-2">
                        {/* Save Button */}
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          type="submit"
                          disabled={saveSuccess}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            saveSuccess 
                              ? 'bg-emerald-500 text-black' 
                              : 'bg-white hover:bg-zinc-200 text-black shadow-lg shadow-white/5'
                          }`}
                        >
                          {saveSuccess ? (
                            <>
                              <Check className="w-4 h-4 animate-bounce" />
                              <span>সফলভাবে সেভ হয়েছে! / Saved!</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>লিঙ্ক সেভ করুন / Save Changes</span>
                            </>
                          )}
                        </motion.button>

                        {/* Reset Defaults Button */}
                        <button
                          type="button"
                          onClick={handleResetToDefaults}
                          className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>ডিফল্ট লিঙ্ক রিসেট / Reset Defaults</span>
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Bottom Navigation Bar */}
            <div className="mt-6 pt-3 border-t border-zinc-900 flex justify-around items-center text-[10px] text-zinc-400 relative z-10 bg-zinc-950">
              
              {/* Home/Join Tab Button */}
              <button 
                onClick={() => setActiveTab('join')}
                className={`flex flex-col items-center gap-1 py-1.5 px-6 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'join' 
                    ? 'text-emerald-400 font-semibold bg-emerald-950/25' 
                    : 'hover:text-white hover:bg-zinc-900/30'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Join Meets</span>
              </button>

              {/* Configure/Settings Tab Button */}
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex flex-col items-center gap-1 py-1.5 px-6 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'settings' 
                    ? 'text-sky-400 font-semibold bg-sky-950/25' 
                    : 'hover:text-white hover:bg-zinc-900/30'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>

            </div>

            {/* Simulated Smartphone Home Bar (Apple-style pill at the bottom) */}
            <div className="flex justify-center mt-3 pt-1">
              <div className="w-28 h-1.5 bg-zinc-800 rounded-full" />
            </div>

          </div>

        </div>

        {/* Outer Quick-Tip/Status for user convenience */}
        <div className="mt-4 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-3.5 max-w-[380px] mx-auto text-center">
          <p className="text-[11px] text-zinc-400 Bengali-sub">
            💡 <strong>প্রো-টিপ:</strong> প্রথমবার ব্যবহারের সুবিধার্থে অ্যাপটি ডেমো গুগল মিট লিঙ্ক দিয়ে কনফিগার করা আছে। আপনার নিজস্ব লিঙ্ক বসাতে <strong>Settings</strong> ট্যাবে যান।
          </p>
        </div>

      </div>
    </div>
  );
}
