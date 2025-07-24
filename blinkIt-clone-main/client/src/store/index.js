import { configureStore } from '@reduxjs/toolkit';
import cartItemSlice from './cartItemSlice';
import categorySlice from './categorySlice';
import subCategorySlice from './subCategorySlice';
import addressSlice from './addressSlice';
import orderSlice from './orderSlice';
import userSlice from './userSlice';
import wishlistSlice from './wishlistSlice';

const store = configureStore({
    reducer: {
        cartItem: cartItemSlice,
        category: categorySlice,
        subCategory: subCategorySlice,
        addresses: addressSlice,
        orders: orderSlice,
        user: userSlice,
        wishlist: wishlistSlice
    }
});

export default store; 