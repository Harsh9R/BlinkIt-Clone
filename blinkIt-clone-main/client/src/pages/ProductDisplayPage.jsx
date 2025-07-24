import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight,FaAngleLeft } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'
import Loading from '../components/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { setWishlistItems } from '../store/wishlistSlice'

const ProductDisplayPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const productId = id?.includes('-') ? id.split('-').pop() : id
  const [data, setData] = useState(null)
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const imageContainer = useRef()
  const dispatch = useDispatch()
  const wishlistItems = useSelector((state) => state.wishlist?.wishlistItems || [])

  const isInWishlist = data && wishlistItems.some(item => item._id === data._id)

  const fetchProductDetails = async() => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching product with ID:', productId)
      
      if (!productId) {
        throw new Error('Invalid product ID')
      }

      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId
        }
      })

      const { data: responseData } = response
      console.log('Product API response:', responseData)

      if (responseData.success && responseData.data) {
        setData(responseData.data)
      } else {
        throw new Error(responseData.message || 'Failed to fetch product details')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setError(error.message || 'Failed to load product')
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchProductDetails()
    } else {
      setError('Invalid product ID')
      setLoading(false)
    }
  }, [productId])
  
  const handleScrollRight = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft += 100
    }
  }

  const handleScrollLeft = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft -= 100
    }
  }

  const handleWishlistToggle = async () => {
    if (!data) return

    try {
      const api = isInWishlist ? SummaryApi.removeFromWishlist : SummaryApi.addToWishlist
      const response = await Axios({
        ...api,
        data: { productId: data._id }
      })

      if (response.data.success) {
        toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist')
        // Refresh wishlist data
        const wishlistResponse = await Axios(SummaryApi.getWishlist)
        if (wishlistResponse.data.success) {
          dispatch(setWishlistItems(wishlistResponse.data.data))
        }
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error)
      AxiosToastError(error)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-4">{error || 'We could not find the product you were looking for.'}</p>
        <button 
          onClick={() => navigate('/')}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Return to Home
        </button>
      </div>
    )
  }

  return (
    <section className='container mx-auto p-4 grid lg:grid-cols-2 '>
        <div className=''>
            <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full'>
                {data.image && data.image.length > 0 && (
                  <img
                    src={data.image[image]}
                    className='w-full h-full object-scale-down'
                    alt={data.name}
                  />
                )}
            </div>
            <div className='flex items-center justify-center gap-3 my-2'>
              {data.image && data.image.map((img, index) => (
                <div 
                  key={img+index+"point"} 
                  className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${index === image && "bg-slate-300"}`}
                />
              ))}
            </div>
            <div className='grid relative'>
                <div ref={imageContainer} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'>
                  {data.image && data.image.map((img, index) => (
                    <div className='w-20 h-20 min-h-20 min-w-20 scr cursor-pointer shadow-md' key={img+index}>
                      <img
                        src={img}
                        alt='min-product'
                        onClick={() => setImage(index)}
                        className='w-full h-full object-scale-down' 
                      />
                    </div>
                  ))}
                </div>
                <div className='w-full -ml-3 h-full hidden lg:flex justify-between absolute items-center'>
                    <button onClick={handleScrollLeft} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
                        <FaAngleLeft/>
                    </button>
                    <button onClick={handleScrollRight} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
                        <FaAngleRight/>
                    </button>
                </div>
            </div>

            <div className='my-4 hidden lg:grid gap-3'>
                <div>
                    <p className='font-semibold'>Description</p>
                    <p className='text-base'>{data.description}</p>
                </div>
                <div>
                    <p className='font-semibold'>Unit</p>
                    <p className='text-base'>{data.unit}</p>
                </div>
                {data?.more_details && Object.keys(data?.more_details).map((element, index) => (
                  <div key={element}>
                    <p className='font-semibold'>{element}</p>
                    <p className='text-base'>{data?.more_details[element]}</p>
                  </div>
                ))}
            </div>
        </div>

        <div className='p-4 lg:pl-7 text-base lg:text-lg'>
            <div className='flex justify-between items-start'>
              <h2 className='text-lg font-semibold lg:text-3xl'>{data.name}</h2>
              <button 
                onClick={handleWishlistToggle}
                className="text-2xl text-red-500 hover:scale-110 transition-transform"
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isInWishlist ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
            <p className=''>{data.unit}</p> 
            <Divider/>
            <div>
              <p className=''>Price</p> 
              <div className='flex items-center gap-2 lg:gap-4'>
                <div className='border border-green-600 px-4 py-2 rounded bg-green-50 w-fit'>
                    <p className='font-semibold text-lg lg:text-xl'>{DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}</p>
                </div>
                {data.discount && (
                  <p className='line-through'>{DisplayPriceInRupees(data.price)}</p>
                )}
                {data.discount && (
                  <p className="font-bold text-green-600 lg:text-2xl">{data.discount}% <span className='text-base text-neutral-500'>Discount</span></p>
                )}
              </div>
            </div> 
              
            {data.stock === 0 ? (
              <p className='text-lg text-red-500 my-2'>Out of Stock</p>
            ) : (
              <div className='my-4'>
                <AddToCartButton data={data}/>
              </div>
            )}

            <h2 className='font-semibold'>Why shop from Ecom? </h2>
            <div>
              <div className='flex items-center gap-4 my-4'>
                <img
                  src={image1}
                  alt='superfast delivery'
                  className='w-20 h-20'
                />
                <div className='text-sm'>
                  <div className='font-semibold'>Superfast Delivery</div>
                  <p>Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
                </div>
              </div>
              <div className='flex items-center gap-4 my-4'>
                <img
                  src={image2}
                  alt='Best prices offers'
                  className='w-20 h-20'
                />
                <div className='text-sm'>
                  <div className='font-semibold'>Best Prices & Offers</div>
                  <p>Best price destination with offers directly from the nanufacturers.</p>
                </div>
              </div>
              <div className='flex items-center gap-4 my-4'>
                <img
                  src={image3}
                  alt='Wide Assortment'
                  className='w-20 h-20'
                />
                <div className='text-sm'>
                  <div className='font-semibold'>Wide Assortment</div>
                  <p>Choose from 5000+ products across food personal care, household & other categories.</p>
                </div>
              </div>
            </div>

            {/****only mobile */}
            <div className='my-4 grid gap-3 lg:hidden'>
                <div>
                    <p className='font-semibold'>Description</p>
                    <p className='text-base'>{data.description}</p>
                </div>
                <div>
                    <p className='font-semibold'>Unit</p>
                    <p className='text-base'>{data.unit}</p>
                </div>
                {data?.more_details && Object.keys(data?.more_details).map((element, index) => (
                  <div key={element}>
                    <p className='font-semibold'>{element}</p>
                    <p className='text-base'>{data?.more_details[element]}</p>
                  </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default ProductDisplayPage
