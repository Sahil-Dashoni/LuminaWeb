import React from 'react'
import { AnimatePresence, motion } from "motion/react"
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';

function LoginModel({ open, onClose }) {

    const dispatch = useDispatch()
    const handleGoogleAuth= async()=>{
        try {
            const result = await signInWithPopup(auth, provider);
            const {data}= await axios.post(`${serverUrl}/api/auth/google`, {
                email: result.user.email,
                name: result.user.displayName,
                avatar: result.user.photoURL
            },{withCredentials:true});
            dispatch(setUserData(data));
            onClose()
        } catch (error) {
            console.error("Error during Google authentication:", error);
        }
    }

    return (
        <AnimatePresence>
            {open && <motion.div
                className='fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-xl px-4'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => onClose()}>

                <motion.div
                    className="relative w-full max-w-md rounded-3xl p-px bg-linear-to-r from-purple-600/40 via-blue-500/30 to-transparent"
                    initial={{ scale: 0.8, y: 60, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.8, y: 40, opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className='relative rounded-3xl bg-[#0b0b0b] border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.8)] overflow-hidden'>
                        <motion.div
                            animate={{ opacity: [0.25, 0.4, 0.25] }}
                            transition={{ repeat: Infinity, duration: 6 }}
                            className='absolute -top-32 -left-32 w-80 h-80 bg-purple-600/30 blur-[140px]'
                        />
                        <motion.div
                            animate={{ opacity: [0.25, 0.4, 0.25] }}
                            transition={{ repeat: Infinity, duration: 6, delay: 3 }}
                            className='absolute -bottom-32 -right-32 w-80 h-80 bg-purple-600/30 blur-[140px]'
                        />
                        <button
                            className='absolute top-5 right-5 z-20 text-zinc-400 transition text-lg hover:text-white'
                            onClick={() => onClose()}
                        >
                            X
                        </button>
                        <div className='relative px-8 pt-14 pb-10 text-center'>
                            <h1 className='inline-block mb-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300'> AI-powered website builder</h1>
                            <h2 className='text-3xl font-semibold leading-tight mb-3 space-x-2'>
                                <span>Welcome to</span>
                                <span className='bg-linear-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent '>LuminaWeb</span>
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="group relative w-full h-13 rounded-xl bg-white text-black font-semibold shadow-xl overflow-hidden"
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGoogleAuth}
                            >
                                <div className='absolute inset-0 bg-linear-to-r from-purple-500 to-white opacity-0 group-hover:opacity-100 transition' />
                                <div className='relative flex items-center justify-center gap-3'>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png" alt="" className="w-6 h-6" />
                                    Continue with Google
                                </div>
                            </motion.button>
                            <div className='flex items-center gap-4 my-10'>
                                <div className='h-px flex-1 bg-white/10' />
                                <span className='text-xs text-zinc-500 tracking-wide'>Secure Login</span>
                                <div className='h-px flex-1 bg-white/10' />
                            </div>
                            <p>
                                By continuing, you agree to our <span className='text-purple-500 hover:underline cursor-pointer'>Terms of Service</span> and acknowledge that you have read our <span className='text-purple-500 hover:underline cursor-pointer'>Privacy Policy</span>.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>}
        </AnimatePresence>
    )
}

export default LoginModel