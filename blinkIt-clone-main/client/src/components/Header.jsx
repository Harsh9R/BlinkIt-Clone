import React, { useState, useEffect, useMemo } from 'react'
import logo from '../assets/logo.svg'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaUser, FaShoppingCart } from "react-icons/fa";
import useMobile from '../hooks/useMobile';
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';

const Header = () => {
    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    
    // Use useMemo to memoize the user state
    const user = useSelector((state) => {
        // Return a stable reference to the user object
        return state?.user || {};
    });
    
    // Memoize the user ID to prevent unnecessary re-renders
    const userId = useMemo(() => user?._id || "", [user?._id]);
    
    // Memoize the cart state
    const cartItem = useSelector((state) => {
        // Return a stable reference to the cart array
        return state?.cartItem?.cart || [];
    });
    
    const { totalPrice, totalQty } = useGlobalContext()
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const [openCartSection, setOpenCartSection] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // Add debug logs and check for logged in state
    useEffect(() => {
        console.log("Header - User state:", user);
        console.log("Header - User ID:", userId);
        
        // Check if user is logged in
        const hasUserId = Boolean(userId);
        console.log("Header - Is logged in:", hasUserId);
        setIsLoggedIn(hasUserId);
        
        // Also check localStorage for token
        const hasToken = Boolean(localStorage.getItem('accesstoken'));
        console.log("Header - Has token:", hasToken);
        
        // If we have a token but no user ID, try to refresh the user state
        if (hasToken && !hasUserId) {
            console.log("Header - Token exists but no user ID, attempting to refresh user state");
            // You could dispatch an action here to refresh user state if needed
        }
    }, [user, userId]);

    const redirectToLoginPage = () => {
        navigate("/login")
    }

    const handleCloseUserMenu = () => {
        setOpenUserMenu(false)
    }

    const handleMobileUser = () => {
        if (!user._id) {
            navigate("/login")
            return
        }
        navigate("/user")
    }

    return (
        <header className='h-16 sticky top-0 z-40 bg-white shadow-md'>
            <div className='container mx-auto h-full px-4'>
                <div className='flex items-center justify-between h-full'>
                    {/* Logo */}
                    <Link to="/" className='flex items-center'>
                        <img 
                            src={logo}
                            alt='Ecom'
                            className='h-10 w-auto'
                        />
                    </Link>

                    {/* Search - Hidden on mobile when on search page */}
                    {!(isSearchPage && isMobile) && (
                        <div className='flex-1 max-w-2xl mx-4 hidden md:block'>
                            <Search />
                        </div>
                    )}

                    {/* Navigation Links & User Menu */}
                    <div className='flex items-center gap-4'>
                        {/* Shop Link */}
                        <Link 
                            to="/shop"
                            className='hidden md:block text-gray-700 hover:text-gray-900'
                        >
                            Shop
                        </Link>

                        {/* About Us Link */}
                        <Link 
                            to="/about"
                            className='hidden md:block text-gray-700 hover:text-gray-900'
                        >
                            About Us
                        </Link>

                        {/* Contact Us Link - Hidden on mobile */}
                        <Link 
                            to="/contact"
                            className='hidden md:block text-gray-700 hover:text-gray-900'
                        >
                            Contact Us
                        </Link>

                        {/* Mobile User Icon */}
                        <button className='text-gray-600 md:hidden' onClick={handleMobileUser}>
                            <FaUser size={24} />
                        </button>

                        {/* Desktop Menu */}
                        <div className='hidden md:flex items-center gap-6'>
                            {isLoggedIn ? (
                                <div className='relative'>
                                    <button 
                                        onClick={() => setOpenUserMenu(prev => !prev)}
                                        className='flex items-center gap-1 text-gray-700 hover:text-gray-900'
                                    >
                                        <span>Account</span>
                                        {openUserMenu ? <GoTriangleUp size={20} /> : <GoTriangleDown size={20} />}
                                    </button>
                                    
                                    {openUserMenu && (
                                        <div className='absolute right-0 top-12 bg-white rounded-lg shadow-lg p-4 min-w-[200px]'>
                                            <UserMenu close={handleCloseUserMenu} />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button 
                                    onClick={redirectToLoginPage}
                                    className='text-gray-700 hover:text-gray-900'
                                >
                                    Login
                                </button>
                            )}

                            {/* Cart Button */}
                            <button 
                                onClick={() => setOpenCartSection(true)}
                                className='flex items-center gap-2 bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg text-white transition-colors'
                            >
                                <FaShoppingCart size={20} className={cartItem.length > 0 ? 'animate-bounce' : ''} />
                                <div className='text-sm font-medium'>
                                    {cartItem.length > 0 ? (
                                        <div>
                                            <span>{totalQty} Items</span>
                                            <span className='mx-1'>•</span>
                                            <span>{DisplayPriceInRupees(totalPrice)}</span>
                                        </div>
                                    ) : (
                                        <span>Cart</span>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar */}
            {!(isSearchPage && isMobile) && (
                <div className='md:hidden px-4 py-2 bg-gray-50'>
                    <Search />
                </div>
            )}

            {/* Cart Sidebar */}
            {openCartSection && (
                <DisplayCartItem close={() => setOpenCartSection(false)} />
            )}
        </header>
    )
}

export default Header
