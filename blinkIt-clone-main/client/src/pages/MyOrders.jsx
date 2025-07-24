import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import NoData from '../components/NoData'
import { FaReceipt } from 'react-icons/fa'
import axiosInstance from '../config/axios'
import { setOrder } from '../store/orderSlice'
import toast from 'react-hot-toast'

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('accesstoken')
        if (!token) {
          toast.error('Please login to view your orders')
          navigate('/login')
          return
        }

        const response = await axiosInstance.get('/order/get-order-details')
        if (response.data.success) {
          dispatch(setOrder(response.data.data))
        } else {
          toast.error(response.data.message || 'Failed to fetch orders')
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        if (error.response?.status === 401) {
          toast.error('Please login to view your orders')
          navigate('/login')
        } else {
          toast.error('Failed to fetch orders. Please try again later.')
        }
      }
    }

    fetchOrders()
  }, [dispatch, navigate])

  const handleViewReceipt = (orderId) => {
    const token = localStorage.getItem('accesstoken')
    if (!token) {
      toast.error('Please login to view receipt')
      navigate('/login')
      return
    }
    navigate(`/receipt/${orderId}`)
  }

  return (
    <div>
      <div className='bg-white shadow-md p-3 font-semibold'>
        <h1>My Orders</h1>
      </div>
      {!orders || orders.length === 0 ? (
        <NoData />
      ) : (
        orders.map((order, index) => (
          <div key={order._id + index + "order"} className='order rounded p-4 text-sm bg-white shadow-sm mb-4'>
            <div className='flex justify-between items-start mb-3'>
              <div>
                <p className='font-semibold'>Order No: {order?.orderId}</p>
                <p className='text-gray-600'>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleViewReceipt(order.orderId)}
                className='flex items-center gap-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors'
              >
                <FaReceipt />
                <span>View Receipt</span>
              </button>
            </div>
            <div className='flex gap-3 items-center'>
              <img
                src={order.product_details.image[0]} 
                className='w-14 h-14 object-cover rounded'
                alt={order.product_details.name}
              />  
              <div>
                <p className='font-medium'>{order.product_details.name}</p>
                <p className='text-gray-600'>Amount: ₹{order.totalAmt}</p>
                <p className='text-gray-600'>Status: {order.payment_status}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default MyOrders
