import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [subTotal, setSubTotal] = useState(0);

    useEffect(() => {
        // Fetch cart items and calculate total amount
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('/api/cart/items');
                setCartItems(response.data);
                setTotalAmount(response.data.reduce((total, item) => total + item.price, 0));
                setSubTotal(response.data.reduce((total, item) => total + item.price, 0));
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch cart items");
            }
        };

        fetchCartItems();
    }, []);

    const handlePayment = async () => {
        try {
            const response = await axios.post('/api/order/checkout', {
                list_items: cartItems,
                totalAmt: totalAmount,
                addressId: selectedAddress,
                subTotalAmt: subTotal
            });

            if (response.data.id) {
                // Store the order ID in localStorage or state
                localStorage.setItem('lastOrderId', response.data.id);
                window.location.href = response.data.url;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Payment failed");
        }
    };

    return (
        <div>
            {/* Render your checkout form here */}
        </div>
    );
};

export default Checkout; 