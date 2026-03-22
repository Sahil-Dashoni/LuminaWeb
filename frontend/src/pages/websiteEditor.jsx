import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App';
import { Code, Code2, MessageSquare, Monitor, Rocket, Send, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Editor from '@monaco-editor/react';


function WebsiteEditor() {

    const { id } = useParams();
    const [website, setWebsite] = useState(null);
    const [error, setError] = useState(null);
    const [code, setCode] = useState("");
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState("");
    const iframeRef = useRef(null);
    const [updateLoading, setUpdateLoading] = useState(false)
    const [thinkingIndex, setThinkingIndex] = useState(0)
    const [showCode, setShowCode] = useState(false)
    const [showFullPreview, setShowFullPreview] = useState(false)
    const [showChat, setShowChat] = useState(false)

    const thinkingsteps = [
        "Understanding your request.",
        "Planning layout changes.",
        "Improving responsiveness.",
        "Applying animations.",
        "Finalizing the update."
    ]

    const handleDeploy = async () => {
        try {
            const result = await axios.post(
                `${serverUrl}/api/website/deploy/${website._id}`, {},
                { withCredentials: true });
            window.open(`${result.data.deployUrl}`, '_blank');
            
            console.log(result.data);
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdate = async () => {
        if (!prompt.trim()) return;
        setUpdateLoading(true);
        const text = prompt
        setPrompt("");

        setMessages((messages) => [
            ...messages,
            { role: "user", content: text }
        ]);

        try {
            const result = await axios.post(
                `${serverUrl}/api/website/update/${id}`,
                { prompt: text },
                { withCredentials: true }
            );

            setUpdateLoading(false);

            setMessages((messages) => [
                ...messages,
                { role: "ai", content: result.data.message }
            ]);

            setCode(result.data.code);


        } catch (error) {
            setUpdateLoading(false);
            console.log("Error updating website data:", error.response?.data);
        }
    };

    useEffect(() => {
        if (!updateLoading) {
            setThinkingIndex(0)
            return
        }
        const i = setInterval(() => {
            setThinkingIndex((index) => (index + 1) % thinkingsteps.length);
        }, 4000)

        return () => clearInterval(i)
    }, [updateLoading])

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-by-id/${id}`, {
                    withCredentials: true
                });
                setWebsite(result.data);
                setCode(result.data.latestCode);
                setMessages(result.data.conversation);
            } catch (error) {
                console.error("Error fetching website data:", error);
                setError(error.response.data.message);
            }
        }
        handleGetWebsite();
    }, [id])

    useEffect(() => {
        if (!code || !iframeRef.current) {
            return
        }
        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        iframeRef.current.src = url;
        return () => {
            URL.revokeObjectURL(url);
        }
    }, [code]);


    if (error) {
        return <div className='text-red-500 h-screen flex items-center justify-center bg-black'>{error}</div>
    }

    if (!website) {
        return <div className='text-white h-screen flex items-center justify-center bg-black'>Loading...</div>
    }

    return (
        <div className='h-screen w-screen flex bg-black text-white overflow-hidden'>
            <aside className='hidden lg:flex w-95 flex-col border-r border-white/10 bg-black/80'>
                <Header />
                <>
                    <div className='px-4 py-4 space-y-4 overflow-y-auto flex-1'>
                        {messages.map((message, index) => (
                            <div key={index} className={`max-w-[85%] p-4 rounded ${message.role === 'user' ? "ml-auto" : "mr-auto"}`}>
                                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${message.role === "user" ? "bg-white text-black" : "bg-white/5 border border-white/10 text-zinc-200"} `}>
                                    {message.content}
                                </div>
                            </div>
                        ))}

                        {updateLoading && (
                            <div className='max-w-[85%] p-4 rounded mr-auto'>
                                <div className='px-4 py-2.5 rounded-2xl text-xs leading-relaxed bg-white/5 border border-white/10 text-zinc-400 italic'>
                                    {thinkingsteps[thinkingIndex]}
                                </div>
                            </div>
                        )}

                    </div>
                    <div className='p-3 border-t border-white/10'>
                        <div className='flex gap-2'>
                            <input placeholder='Describe Changes..' className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none' onChange={(e) => setPrompt(e.target.value)} value={prompt} />
                            <button className='px-4 py-3 rounded-2xl bg-white text-black' disabled={updateLoading} onClick={handleUpdate} ><Send size={15} /></button>
                        </div>
                    </div>
                </>
            </aside>
            <div className='flex-1 flex flex-col'>
                <div className='h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80'>
                    <span className='text-xs text-zinc-300'>Live Preview</span>
                    <div className='flex gap-2'>
                        {website.deployed ?  ("") : 
                        <button className='flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition' onClick={handleDeploy}>
                            <Rocket size={14} /> Deploy
                        </button>
                        }
                        
                        <button className='p-2 lg:hidden' onClick={() => setShowChat(true)}>
                            <MessageSquare size={18} />
                        </button>
                        <button className='p-2' onClick={() => setShowCode(true)}><Code2 size={18} /></button>
                        <button className='p-2' onClick={() => setShowFullPreview(true)}><Monitor size={18} /></button>
                    </div>
                </div>

                <iframe ref={iframeRef} sandbox='allow-scripts allow-same-origin allow-forms' className='bg-white flex-1 w-full' />

            </div>

            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        className='fixed inset-y-0 w-full right-0 bg-[#1e1e1e] flex flex-col lg:w-[45%] z-9999'
                    >
                        <Header onClose={() => setShowChat(false)} />
                        <>
                            <div className='px-4 py-4 space-y-4 overflow-y-auto flex-1'>
                                {messages.map((message, index) => (
                                    <div key={index} className={`max-w-[85%] p-4 rounded ${message.role === 'user' ? "ml-auto" : "mr-auto"}`}>
                                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${message.role === "user" ? "bg-white text-black" : "bg-white/5 border border-white/10 text-zinc-200"} `}>
                                            {message.content}
                                        </div>
                                    </div>
                                ))}

                                {updateLoading && (
                                    <div className='max-w-[85%] p-4 rounded mr-auto'>
                                        <div className='px-4 py-2.5 rounded-2xl text-xs leading-relaxed bg-white/5 border border-white/10 text-zinc-400 italic'>
                                            {thinkingsteps[thinkingIndex]}
                                        </div>
                                    </div>
                                )}

                            </div>
                            <div className='p-3 border-t border-white/10'>
                                <div className='flex gap-2'>
                                    <input placeholder='Describe Changes..' className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none' onChange={(e) => setPrompt(e.target.value)} value={prompt} />
                                    <button className='px-4 py-3 rounded-2xl bg-white text-black' disabled={updateLoading} onClick={handleUpdate} ><Send size={15} /></button>
                                </div>
                            </div>
                        </>
                    </motion.div>
                )}

            </AnimatePresence>

            <AnimatePresence>
                {showCode && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        className='fixed inset-y-0 w-full right-0 bg-[#1e1e1e] flex flex-col lg:w-[45%] z-9999'

                    >
                        <div className='h-12 px-4 flex justify-between items-center border-b border-white/10 bg-[#1e1e1e]' onClick={(e) => e.stopPropagation()}>
                            <span className='text-sm font-medium'>index.html</span>
                            <button onClick={() => setShowCode(false)}><X size={18} /></button>
                        </div>
                        <Editor
                            theme='vs-dark'
                            value={code}
                            language='html'
                            onChange={(v) => setCode(v)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showFullPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 bg-black/80  z-9999'
                    >

                        <iframe ref={iframeRef} sandbox='allow-scripts allow-same-origin allow-forms' srcDoc={code} className='w-full h-full border border-gray-300' />

                        <button className='absolute top-4 right-4 p-2 bg-black/70 rounded-lg' onClick={() => setShowFullPreview(false)}><X size={20} /></button>


                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
    function Header({ onClose }) {
        return (
            <div className='h-14 px-4 flex items-center justify-between border-b border-white/10'>
                <span className='font-semibold truncate'>{website?.title || 'Website Editor'}</span>
                {onClose && <button onClick={onClose}><X size={18} color='white' /></button>}
            </div>
        )
    }
}



export default WebsiteEditor