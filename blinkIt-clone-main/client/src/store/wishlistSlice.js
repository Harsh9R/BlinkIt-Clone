import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from '@reduxjs/toolkit'

const initialState = {
    wishlistItems: []
}

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        setWishlistItems: (state, action) => {
            console.log('Reducer setWishlistItems called with:', action.payload);
            state.wishlistItems = action.payload
        },
        addToWishlist: (state, action) => {
            // Check if item already exists
            const exists = state.wishlistItems.some(
                item => item.productId === action.payload.productId
            )
            if (!exists) {
                state.wishlistItems.push(action.payload)
            }
        },
        removeFromWishlist: (state, action) => {
            state.wishlistItems = state.wishlistItems.filter(
                item => item.productId !== action.payload && item._id !== action.payload
            )
        },
        clearWishlist: (state) => {
            state.wishlistItems = []
        }
    }
})

// Memoized selector
export const selectWishlistItems = createSelector(
    [(state) => state.wishlist.wishlistItems],
    (wishlistItems) => wishlistItems
)

export const { setWishlistItems, addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer 