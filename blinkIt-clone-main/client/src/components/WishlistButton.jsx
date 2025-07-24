import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { useGlobalContext } from '../provider/GlobalProvider';

const WishlistButton = ({ productId }) => {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [loading, setLoading] = useState(false);
    const { fetchWishlist } = useGlobalContext();
    const wishlistItems = useSelector(state => state.wishlist?.wishlistItems || []);

    useEffect(() => {
        // Check if product is in wishlist
        const isProductInWishlist = wishlistItems.some(item => item.productId === productId);
        setIsInWishlist(isProductInWishlist);
    }, [wishlistItems, productId]);

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (loading) return;

        try {
            setLoading(true);
            const response = await Axios({
                ...(isInWishlist ? SummaryApi.removeFromWishlist : SummaryApi.addToWishlist),
                data: { productId }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setIsInWishlist(!isInWishlist);
                if (fetchWishlist) {
                    fetchWishlist();
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating wishlist");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full ${
                isInWishlist ? 'bg-red-100 text-red-500' : 'bg-white text-gray-500'
            } hover:bg-red-100 hover:text-red-500 transition-colors`}
            disabled={loading}
        >
            {isInWishlist ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
        </button>
    );
};

export default WishlistButton; 