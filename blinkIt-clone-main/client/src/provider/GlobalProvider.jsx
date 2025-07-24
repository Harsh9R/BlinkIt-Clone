import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";
import { useNavigate } from "react-router-dom";
import { setWishlistItems } from '../store/wishlistSlice';

export const GlobalContext = createContext(null)
export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({children}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [totalPrice, setTotalPrice] = useState(0)
    const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0)
    const [totalQty, setTotalQty] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state?.user)

    const fetchCartItem = async() => {
        if (!user?._id) return; // Don't fetch if user is not logged in
        
        try {
            setIsLoading(true)
            const response = await Axios({
                ...SummaryApi.getCartItem
            })
            const { data: responseData } = response
    
            if(responseData.success) {
                dispatch(handleAddItemCart(responseData.data))
            }
        } catch (error) {
            if (error.response?.status === 401) {
                // Clear tokens and redirect to login
                localStorage.removeItem('accesstoken')
                localStorage.removeItem('refreshToken')
                navigate('/login')
                return
            }
            console.error('Error fetching cart:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const updateCartItem = async(id,qty)=>{
      try {
          const response = await Axios({
            ...SummaryApi.updateCartItemQty,
            data : {
              _id : id,
              qty : qty
            }
          })
          const { data : responseData } = response

          if(responseData.success){
              // toast.success(responseData.message)
              fetchCartItem()
              return responseData
          }
      } catch (error) {
        AxiosToastError(error)
        return error
      }
    }
    const deleteCartItem = async(cartId)=>{
      try {
          const response = await Axios({
            ...SummaryApi.deleteCartItem,
            data : {
              _id : cartId
            }
          })
          const { data : responseData} = response

          if(responseData.success){
            toast.success(responseData.message)
            fetchCartItem()
          }
      } catch (error) {
         AxiosToastError(error)
      }
    }

    const fetchAddress = async() => {
        if (!user?._id) return; // Don't fetch if user is not logged in
        
        try {
            setIsLoading(true)
            const response = await Axios({
                ...SummaryApi.getAddress
            })
            const { data: responseData } = response

            if(responseData.success) {
                dispatch(handleAddAddress(responseData.data))
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('accesstoken')
                localStorage.removeItem('refreshToken')
                navigate('/login')
                return
            }
            console.error('Error fetching address:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchOrder = async() => {
        if (!user?._id) return; // Don't fetch if user is not logged in
        
        try {
            setIsLoading(true)
            const response = await Axios({
                ...SummaryApi.getOrderItems,
            })
            const { data: responseData } = response

            if(responseData.success) {
                dispatch(setOrder(responseData.data))
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('accesstoken')
                localStorage.removeItem('refreshToken')
                navigate('/login')
                return
            }
            console.error('Error fetching orders:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchWishlist = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.getWishlist
            });

            if (response.data.success) {
                dispatch(setWishlistItems(response.data.data));
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchCartItem()
            fetchAddress()
            fetchOrder()
            fetchWishlist()
        }
    }, [user?._id])

    useEffect(() => {
        const qty = cartItem.reduce((preve, curr) => {
            return preve + curr.quantity
        }, 0)
        setTotalQty(qty)
        
        const tPrice = cartItem.reduce((preve, curr) => {
            const priceAfterDiscount = pricewithDiscount(curr?.productId?.price, curr?.productId?.discount)
            return preve + (priceAfterDiscount * curr.quantity)
        }, 0)
        setTotalPrice(tPrice)

        const notDiscountPrice = cartItem.reduce((preve, curr) => {
            return preve + (curr?.productId?.price * curr.quantity)
        }, 0)
        setNotDiscountTotalPrice(notDiscountPrice)
    }, [cartItem])

    const handleLogoutOut = ()=>{
        localStorage.clear()
        dispatch(handleAddItemCart([]))
    }

    return(
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            fetchAddress,
            totalPrice,
            totalQty,
            notDiscountTotalPrice,
            fetchOrder,
            handleLogoutOut,
            isLoading,
            fetchWishlist
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider