import { ArrowLeft, Check, Rocket, Share2 } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { useState } from 'react'


function Dashboard() {

    const { userData } = useSelector(state => state.user)
    const navigate = useNavigate()
    const [websites, setWebsites] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [copiedId, setCopiedId] = useState(null)

    const handleDeploy = async (id) => {
        try {
            const result = await axios.post(
                `${serverUrl}/api/website/deploy/${id}`, {},
                { withCredentials: true });
            window.open(`${result.data.deployUrl}`, '_blank');
            setWebsites((prev) => prev.map((w) => w._id === id ? { ...w, deployed: true, deployUrl: result.data.deployUrl } : w));
            console.log(result.data);
        } catch (error) {
            console.log(error)
        }
    }

    const handleCopy = async (site) => {
        try {
            await navigator.clipboard.writeText(site.deployUrl);
            setCopiedId(site._id);
            setTimeout(() => {
                setCopiedId(null);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy URL to clipboard:", error);
        }
    }


    useEffect(() => {
        const handleGetAllWebsites = async () => {
            try {
                setLoading(true);
                const result = await axios.get(
                    `${serverUrl}/api/website/get-all`,
                    { withCredentials: true }
                );
                setWebsites(result.data || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching websites:', error);
                setError(error.response?.data?.message || 'Failed to load websites');
                setLoading(false);
            }
        }

        handleGetAllWebsites();
    }, []);

    return (
        <div className='text-white min-h-screen bg-[#050505]'>
            <div className='sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10'>
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <button className='p-2 rounded-lg hover:bg-white/10 transition' onClick={() => navigate(-1)}><ArrowLeft size={16} /></button>
                        <h1 className='text-lg font-semibold'>Dashboard</h1>
                    </div>
                    <button className='px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:scale-105 transition' onClick={() => navigate('/generate')}>
                        + New Website
                    </button>
                </div>
            </div>
            <div className='max-w-7xl mx-auto px-6 py-10'>
                <motion.div
                    className='mb-10'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className='text-sm text-zinc-400 mb-1'>Welcome Back</p>
                    <h1 className='text-3xl font-bold'>{userData.name}</h1>
                </motion.div>
                {loading && (
                    <div className='mt-24 text-center text-zinc-400'>
                        Loading Your Websites...
                    </div>
                )}

                {error && !loading && (
                    <div className='mt-24 text-center text-red-400'>{error}</div>
                )}

                {websites?.length == 0 && (
                    <div className='mt-24 text-center text-zinc-400'>
                        You not created any website yet. Click on "New Website" to create your first one.
                    </div>
                )}

                {!loading && !error && websites.length > 0 && (
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8'>
                        {websites.map((w, i) => {
                            const copied = copiedId === w._id;


                            return <motion.div
                                key={w._id}
                                className='bg-white/10 rounded-2xl border border-white/20 overflow-hidden cursor-pointer hover:bg-white/20 transition flex flex-col'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -6 }}
                                onClick={() => navigate(`/editor/${w._id}`)}
                            >
                                <div className='relative h-40 bg-black cursor-pointer'>
                                    <iframe loading="lazy" srcDoc={w.latestCode} title={w.title} className='absolute inset-0 w-[140%] h-[140%] origin-top-left pointer-events-none scale-[0.72] bg-white' />
                                    <div className='absolute inset-0 bg-black/30' />
                                </div>
                                <div className='p-5 flex flex-col gap-4 flex-1'>
                                    <h3 className='text-base font-semibold line-clamp-2'>{w.title}</h3>
                                    <p className='text-xs text-zinc-400'>{`Last Updated: ${new Date(w.updatedAt).toLocaleDateString()}`}</p>
                                    {!w.deployed ? (
                                        <button className='mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-linear-to-r from-indigo-500 to-purple-500 hover:scale-105 transition' onClick={() => handleDeploy(w._id)}>
                                            <Rocket size={18} />Deploy
                                        </button>
                                    ) : (
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleCopy(w)}
                                            className={`mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 hover:bg-white/20 border border-white/10'}`}
                                        >
                                            {copied ? (<>
                                                <Check size={18} />
                                                Link Copied!
                                            </>) : (<>
                                                <Share2 size={18} />
                                                Share Link
                                            </>
                                            )}

                                        </motion.button>
                                    )}
                                </div>
                            </motion.div>


                        })}
                    </div>
                )}


            </div>
        </div>
    )
}

export default Dashboard