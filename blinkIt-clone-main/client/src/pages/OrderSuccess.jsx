import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaCheckCircle } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        // Try to get order ID from localStorage first
        const storedOrderId = localStorage.getItem('lastOrderId');
        if (storedOrderId) {
            setOrderId(storedOrderId);
            // Clear the stored order ID
            localStorage.removeItem('lastOrderId');
        }
    }, []);

    const handleViewReceipt = () => {
        if (orderId) {
            navigate(`/receipt/${orderId}`);
        } else {
            toast.error('Order ID not found');
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
            <div className='max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center'>
                <FaCheckCircle className='text-green-500 text-6xl mx-auto mb-4' />
                <h1 className='text-2xl font-bold text-gray-800 mb-2'>Order Placed Successfully!</h1>
                <p className='text-gray-600 mb-6'>
                    Thank you for your purchase. Your order has been placed successfully.
                </p>
                <div className='flex flex-col space-y-4'>
                    <Link
                        to='/dashboard/myorders'
                        className='bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors'
                    >
                        View Orders
                    </Link>
                    {orderId && (
                        <button
                            onClick={handleViewReceipt}
                            className='bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors'
                        >
                            View Receipt
                        </button>
                    )}
                    <Link
                        to='/'
                        className='text-gray-600 hover:text-green-500 transition-colors'
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccess 