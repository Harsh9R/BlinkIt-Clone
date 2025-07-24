import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CardProduct from '../components/CardProduct'
import { Link } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { setWishlistItems } from '../store/wishlistSlice'
import Loading from '../components/Loading'
import toast from 'react-hot-toast'

const Wishlist = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const wishlistItems = useSelector((state) => state.wishlist?.wishlistItems || [])
  const user = useSelector((state) => state.user)

  const fetchWishlistItems = async () => {
    try {
      setLoading(true)
      const response = await Axios(SummaryApi.getWishlist)
      if (response.data.success) {
        dispatch(setWishlistItems(response.data.data))
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?._id) {
      fetchWishlistItems()
    }
  }, [user?._id])

  if (!user?._id) {
    return (
      <div className="container mx-auto p-8 text-center">
        <FaHeart className="text-6xl text-red-500 mx-auto mb-4 opacity-50" />
        <h2 className="text-2xl font-semibold mb-4">Please login to view your wishlist</h2>
        <Link 
          to="/login"
          className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Login
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex justify-center items-center min-h-[60vh]">
        <Loading />
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <FaHeart className="text-6xl text-red-500 mx-auto mb-4 opacity-50" />
        <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
        <p className="text-gray-600 mb-6">Start adding items you love to your wishlist!</p>
        <Link 
          to="/"
          className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Wishlist ({wishlistItems.length})</h1>
        <Link 
          to="/"
          className="text-indigo-600 hover:text-indigo-800 text-sm"
        >
          Continue Shopping
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {wishlistItems.map((item) => (
          <CardProduct 
            key={item._id} 
            data={{
              ...item.product_details,
              _id: item.productId
            }}
            onWishlistUpdate={fetchWishlistItems}
          />
        ))}
      </div>
    </div>
  )
}

export default Wishlist 