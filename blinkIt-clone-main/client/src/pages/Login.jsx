import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import googleLogo from '../assets/google-logo.svg';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((preve) => ({
            ...preve,
            [name]: value
        }))
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data: data
            })
            
            if(response.data.error) {
                toast.error(response.data.message)
                return
            }

            if(response.data.success) {
                toast.success(response.data.message)
                
                // Store tokens
                localStorage.setItem('accesstoken', response.data.data.accesstoken)
                localStorage.setItem('refreshToken', response.data.data.refreshToken)

                // Fetch and set user details
                const userDetails = await fetchUserDetails()
                if (userDetails?.data) {
                    dispatch(setUserDetails(userDetails.data))
                    setData({ email: "", password: "" })
                    navigate("/")
                } else {
                    toast.error("Failed to fetch user details")
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            console.log("Starting Google sign-in process");
            
            // Try to sign in with Google
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Google sign-in successful", user);
            
            // Get Firebase token
            const token = await user.getIdToken();
            console.log("Firebase token obtained:", token ? "Yes" : "No");
            
            // Send token to backend for authentication
            try {
                const response = await Axios({
                    ...SummaryApi.googleAuth,
                    data: {
                        token: token,
                        name: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL
                    }
                });
                
                console.log("Backend authentication response:", response.data);
                
                if (response.data.success) {
                    // Store tokens from backend
                    localStorage.setItem('accesstoken', response.data.data.accesstoken);
                    localStorage.setItem('refreshToken', response.data.data.refreshToken);
                    
                    // Fetch and set user details
                    const userDetails = await fetchUserDetails();
                    if (userDetails?.data) {
                        dispatch(setUserDetails(userDetails.data));
                        toast.success(`Welcome ${userDetails.data.name || "User"}!`);
                        console.log("Redirecting to home page");
                        navigate("/");
                    } else {
                        console.error("Failed to fetch user details after Google auth");
                        toast.error("Failed to fetch user details");
                        // Clear tokens if we couldn't get user details
                        localStorage.removeItem('accesstoken');
                        localStorage.removeItem('refreshToken');
                    }
                } else {
                    console.error("Backend authentication failed:", response.data.message);
                    toast.error(response.data.message || "Authentication failed");
                }
            } catch (backendError) {
                console.error("Backend authentication error:", backendError);
                toast.error("Failed to authenticate with backend");
                // Clear any tokens that might have been set
                localStorage.removeItem('accesstoken');
                localStorage.removeItem('refreshToken');
            }
        } catch (error) {
            console.error("Google sign-in error:", error);
            
            // Handle specific Firebase errors
            if (error.code === 'auth/popup-blocked') {
                toast.error("Pop-up was blocked. Please allow pop-ups for this site.");
            } else if (error.code === 'auth/cancelled-popup-request') {
                toast.error("Sign-in was cancelled.");
            } else if (error.code === 'auth/network-request-failed') {
                toast.error("Network error. Please check your internet connection.");
            } else if (error.code === 'auth/internal-error') {
                // This is likely a certificate error in development
                toast.error("Authentication error. Please try again or use email/password login.");
                
                // For development environments, you might want to provide a fallback
                if (process.env.NODE_ENV === 'development') {
                    console.log("Development environment detected, providing fallback login option");
                    // You could set a state here to show a fallback login form
                }
            } else {
                toast.error("Google sign-in failed. Please try again or use email/password login.");
            }
        }
    };

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='email'>Email :</label>
                        <input
                            type='email'
                            id='email'
                            className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                            required
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='password'>Password :</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full outline-none'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter your password'
                                required
                            />
                            <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer'>
                                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </div>
                        </div>
                        <div className='text-right'>
                            <Link to="/forgot-password" className='text-sm text-primary-200 hover:text-primary-300'>
                                Forgot Password?
                            </Link>
                        </div>
                    </div>
                    <button 
                        type='submit' 
                        className='bg-primary-200 text-white py-2 rounded hover:bg-primary-300 transition-all'
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-2.5 rounded-md mt-2 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                    type="button"
                >
                    <img 
                        src={googleLogo} 
                        alt="Google" 
                        className="w-5 h-5"
                    />
                    <span className="font-medium">Sign in with Google</span>
                </button>

                <p className="mt-4 text-center">
                    Don't have account? <Link to={"/register"} className='font-semibold text-green-700 hover:text-green-800'>Register</Link>
                </p>
            </div>
        </section>
    )
}

export default Login

