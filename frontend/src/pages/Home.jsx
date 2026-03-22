import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import LoginModel from '../components/LoginModel'
import { useDispatch, useSelector } from 'react-redux'
import { Coins } from "lucide-react"
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

function Home() {

    const highlights = [
        "AI Generated Code",
        "Fully Responsive Layouts",
        "Production Ready Output",
    ]

    const [openLogin, setOpenLogin] = useState(false)
    const { userData } = useSelector(state => state.user)
    const [openProfile, setOpenProfile] = useState(false)
    const [websites, setWebsites] = useState([])
    const dispatch = useDispatch()
    const navigate = useNavigate()



    const handleLogout = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            setOpenProfile(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (userData) return
        const handleGetAllWebsites = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/website/get-all`,
                    { withCredentials: true }
                );
                setWebsites(result.data || []);
            } catch (error) {
                console.error('Error fetching websites:', error);
                
            }
        }

        handleGetAllWebsites();
    }, [userData]);

    return (
        <div className='relative min-h-screen bg-[#040404] text-white overflow-hidden'>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.75 }}
                className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10'
            >
                <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
                    <div className='text-xl font-semibold'>
                        LuminaWeb
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className='hidden md:inline text-sm text-zinc-400 hover:text-white cursor-pointer' onClick={() => navigate('/pricing')}>
                            Pricing
                        </div>

                        {userData && <div className='hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition' onClick={() => navigate('/pricing')}>
                            <Coins size={14} className='text-yellow-400' />
                            <span className='text-zinc-300'>Credits</span>
                            <span>{userData.credits}</span>
                            <span className='font-semibold'>+</span>
                        </div>}

                        {!userData ? <button className='px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-sm' onClick={() => setOpenLogin(true)}>
                            Get Started
                        </button>
                            :
                            <div className='relative'>
                                <button className='flex items-center' onClick={() => setOpenProfile(!openProfile)}>
                                    <img src={userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}`} alt="" referrerPolicy='no-referrer' className='W-9 h-9 rounded-full border border-white/20 object-cover' />
                                </button>

                                <AnimatePresence>
                                    {openProfile && (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                className='absolute right-0 mt-3 w-60 z-50 rounded-xl border border-white/10 bg-[#0b0b0b] shadow-2xl overflow-hidden'>
                                                <div className='px-4 py-3 border-b border-white/10'>
                                                    <p className='text-sm font-medium truncate'>{userData.name}</p>
                                                    <p className='text-xs text-zinc-400 truncate'>{userData.email}</p>
                                                </div>
                                                <button className='md:hidden flex w-full px-4 py-3 items-center gap-2 text-sm border-b border-white/10 hover:bg-white/5' onClick={() => navigate('/pricing')}>
                                                    <Coins size={14} className='text-yellow-400' />
                                                    <span className='text-zinc-300'>Credits</span>
                                                    <span>{userData.credits}</span>
                                                    <span className='font-semibold'>+</span>
                                                </button>

                                                <button className='w-full px-4 py-2 text-left text-sm hover:bg-white/5' onClick={() => navigate('/dashboard')}>Dashboard</button>
                                                <button className='w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/5' onClick={handleLogout}>
                                                    Logout
                                                </button>

                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        }

                    </div>

                </div>
            </motion.div>

            <section className='pt-44 pb-32 px-6 text-center '>
                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.75 }}
                    className='text-3xl md:text-5xl font-bold tracking-tight'
                >
                    Build Awesome Websites with
                    <br />
                    <span className='bg-linear-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent'>LuminaWeb</span>
                </motion.h1>

                <motion.p
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.75 }}
                    className='mt-6 text-lg text-zinc-400 max-w-2xl mx-auto'
                >
                    A powerful and intuitive web development framework that makes building modern websites a breeze.
                </motion.p>
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.75, delay: 0.25 }}
                    className='mt-8 flex justify-center gap-4'
                >
                    <button className='px-6 py-3 rounded-lg bg-linear-to-r from-purple-600 to-blue-500 text-white text-sm font-medium hover:from-purple-700 hover:to-blue-600 hover:scale-105 transition' onClick={() => userData? navigate('/dashboard'): setOpenLogin(true)}>
                        {userData ? "Go to Dashboard" : "Get Started"}
                    </button>
                    <button className='px-6 py-3 rounded-lg border border-white/20 hover:bg-white/10 text-sm font-medium'>
                        Learn More
                    </button>
                </motion.div>
            </section>


            {!userData && <section className='max-w-7xl mx-auto px-6 pb-32'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {highlights.map((highlight, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className='mb-8 p-6 bg-[#1a1a1a] rounded-2xl shadow-lg text-left'
                        >
                            <h3 className='text-xl font-semibold mb-2'>{highlight}</h3>
                            <p className='text-zinc-400'>LuminaWeb builds modern, responsive websites and scalable applications with ease.</p>
                        </motion.div>
                    ))}

                </div>
            </section>}

            {userData && websites.length > 0 && (
                <section className='max-w-7xl mx-auto px-6 pb-32'>
                    <h2 className='text-2xl font-bold text-center mb-8'>Your Websites</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {websites.slice(0,3).map((w,i) => (
                            <motion.div
                                key={w._id}
                                whileHover={{  y: -8 }}
                                className='bg-[#1a1a1a] rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:bg-white/10 transition'
                                onClick={() => navigate(`/editor/${w._id}`)}
                            >
                                <div className='relative h-40 bg-black'>
                                    <iframe loading="lazy" srcDoc={w.latestCode} title={w.title} className='absolute inset-0 w-[140%] h-[140%] origin-top-left pointer-events-none scale-[0.72] bg-white' />
                                    <div className='absolute inset-0 bg-black/30' />
                                </div>
                                <div className='p-5'>
                                    <h3 className='text-base font-semibold line-clamp-2'>{w.title}</h3>
                                    <p className='text-xs text-zinc-400'>{`Last Updated: ${new Date(w.updatedAt).toLocaleDateString()}`}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            <footer className='border-t border-white/10 py-10 text-center text-sm text-zinc-500'>
                &copy; {new Date().getFullYear()} LuminaWeb. All rights reserved.
            </footer>

            {openLogin && <LoginModel open={openLogin} onClose={() => setOpenLogin(false)} />}
        </div>
    )
}

export default Home