import React, { useMemo } from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import { useGlobalContext } from '../provider/GlobalProvider'
import AddToCartButton from './AddToCartButton'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { setWishlistItems, addToWishlist as addToWishlistAction } from '../store/wishlistSlice'

// Memoized selectors
const selectWishlistItems = state => state.wishlist?.wishlistItems || []
const selectUser = state => state.user

const CardProduct = ({ data, onWishlistUpdate }) => {
    const dispatch = useDispatch()
    const wishlistItems = useSelector(selectWishlistItems)
    const user = useSelector(selectUser)
    
    // Memoize the wishlist item check
    const isInWishlist = useMemo(() => {
        return wishlistItems.some(item => 
            item.productId === data._id || 
            item.productId._id === data._id
        )
    }, [wishlistItems, data._id])
    
    // Memoize the URL
    const url = useMemo(() => 
        `/product/${valideURLConvert(data.name)}-${data._id}`,
        [data.name, data._id]
    )

    const handleWishlistToggle = async (e) => {
        e.preventDefault() // Prevent navigation
        e.stopPropagation() // Stop event bubbling
        
        if (!user?._id) {
            toast.error('Please login to manage wishlist')
            return
        }

        try {
            const api = isInWishlist ? SummaryApi.removeFromWishlist : SummaryApi.addToWishlist
            const response = await Axios({
                ...api,
                data: { productId: data._id }
            })

            if (response.data.success) {
                if (isInWishlist) {
                    toast.success('Removed from wishlist')
                } else {
                    toast.success('Added to wishlist')
                    dispatch(addToWishlistAction(response.data.data))
                }
                
                if (onWishlistUpdate) {
                    onWishlistUpdate()
                } else {
                    const wishlistResponse = await Axios(SummaryApi.getWishlist)
                    if (wishlistResponse.data.success) {
                        dispatch(setWishlistItems(wishlistResponse.data.data))
                    }
                }
            }
        } catch (error) {
            console.error('Wishlist operation failed:', error)
            toast.error('Failed to update wishlist')
        }
    }

    // Memoize the price calculation
    const displayPrice = useMemo(() => 
        DisplayPriceInRupees(pricewithDiscount(data.price, data.discount)),
        [data.price, data.discount]
    )

    return (
        <div className='border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded bg-white relative'>
            <Link to={url} className='w-full'>
                <div className='min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden relative'>
                    <img 
                        src={data.image[0]}
                        className='w-full h-full object-scale-down lg:scale-125'
                        alt={data.name}
                    />
                </div>
                <div className='flex items-center gap-1'>
                    <div>
                        {Boolean(data.discount) && (
                            <p className='text-green-600 bg-green-100 px-2 w-fit text-xs rounded-full'>{data.discount}% discount</p>
                        )}
                    </div>
                </div>
                <div className='px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2'>
                    {data.name}
                </div>
                <div className='w-fit gap-1 px-2 lg:px-0 text-sm lg:text-base'>
                    {data.unit} 
                </div>

                <div className='px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base'>
                    <div className='flex items-center gap-1'>
                        <div className='font-semibold'>
                            {displayPrice}
                        </div>
                    </div>
                    <div className=''>
                        {data.stock === 0 ? (
                            <p className='text-red-500 text-sm text-center'>Out of stock</p>
                        ) : (
                            <AddToCartButton data={data} />
                        )}
                    </div>
                </div>
            </Link>
            <button
                onClick={handleWishlistToggle}
                className="absolute top-2 right-2 text-xl p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
            >
                {isInWishlist ? (
                    <FaHeart className="text-red-500" />
                ) : (
                    <FaRegHeart className="text-gray-600 hover:text-red-500" />
                )}
            </button>
        </div>
    )
}

export default CardProduct
