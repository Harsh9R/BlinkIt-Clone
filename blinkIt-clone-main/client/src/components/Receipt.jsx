import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../config/axios';
import { toast } from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

const Receipt = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [receiptData, setReceiptData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReceipt = async () => {
            try {
                console.log('Fetching receipt for orderId:', orderId);
                const response = await axiosInstance.get(`/order/receipt/${orderId}`);
                console.log('Receipt API response:', response.data);
                if (response.data.success) {
                    setReceiptData(response.data.data);
                } else {
                    toast.error(response.data.message || 'Failed to fetch receipt');
                }
                setLoading(false);
            } catch (error) {
                console.error('Receipt fetch error:', error.response?.data || error);
                toast.error(error.response?.data?.message || "Failed to fetch receipt");
                setLoading(false);
            }
        };

        if (orderId) {
            fetchReceipt();
        } else {
            toast.error('Order ID is missing');
            setLoading(false);
        }
    }, [orderId]);

    const handleDownload = () => {
        if (!receiptData) return;

        // Create a blob from the receipt text
        const blob = new Blob([receiptData.receipt], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${receiptData.orderDetails.orderId}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!receiptData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-red-500 mb-4">Receipt not found</div>
                <button
                    onClick={() => navigate('/dashboard/myorders')}
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                >
                    <FaArrowLeft />
                    <span>Back to Orders</span>
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard/myorders')}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <FaArrowLeft />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800">Order Receipt</h2>
                    </div>
                    <button
                        onClick={handleDownload}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Download Receipt
                    </button>
                </div>
                
                <div className="border-t border-b border-gray-200 py-4">
                    <pre className="whitespace-pre-wrap font-mono text-sm">
                        {receiptData.receipt}
                    </pre>
                </div>

                <div className="mt-6 text-sm text-gray-600">
                    <p className="font-semibold mb-2">Order Details:</p>
                    <p>Order ID: {receiptData.orderDetails.orderId}</p>
                    <p>Date: {new Date(receiptData.orderDetails.date).toLocaleDateString()}</p>
                    <p>Payment Status: {receiptData.orderDetails.paymentStatus}</p>
                    {receiptData.orderDetails.deliveryAddress && (
                        <div className="mt-4">
                            <p className="font-semibold mb-2">Delivery Address:</p>
                            <p>{receiptData.orderDetails.deliveryAddress.street}</p>
                            <p>{receiptData.orderDetails.deliveryAddress.city}, {receiptData.orderDetails.deliveryAddress.state}</p>
                            <p>{receiptData.orderDetails.deliveryAddress.pincode}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Receipt; 