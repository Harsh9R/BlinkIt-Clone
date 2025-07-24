import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    _id : "",
    name : "",
    email : "",
    avatar : "",
    mobile : "",
    verify_email : "",
    last_login_date : "",
    status : "",
    address_details : [],
    shopping_cart : [],
    orderHistory : [],
    role : "",
}

const userSlice  = createSlice({
    name : 'user',
    initialState : initialValue,
    reducers : {
        setUserDetails : (state,action) =>{
            // Only update if we have valid data
            if (!action.payload) {
                console.log("Redux - Received empty user details, resetting to initial state");
                return initialValue;
            }
            
            console.log("Redux - Setting user details:", action.payload);
            
            // Create a new object with only the properties we need
            const updatedUser = {
                _id: action.payload?._id || "",
                name: action.payload?.name || "",
                email: action.payload?.email || "",
                avatar: action.payload?.avatar || "",
                mobile: action.payload?.mobile || "",
                verify_email: action.payload?.verify_email || "",
                last_login_date: action.payload?.last_login_date || "",
                status: action.payload?.status || "",
                address_details: action.payload?.address_details || [],
                shopping_cart: action.payload?.shopping_cart || [],
                orderHistory: action.payload?.orderHistory || [],
                role: action.payload?.role || ""
            };
            
            // Update the state with the new object
            Object.assign(state, updatedUser);
            
            console.log("Redux - Updated user state:", state);
        },
        updatedAvatar : (state,action)=>{
            state.avatar = action.payload
        },
        logout : (state,action)=>{
            // Reset to initial state
            Object.assign(state, initialValue);
        }
    }
})

export const { setUserDetails, updatedAvatar, logout } = userSlice.actions
export default userSlice.reducer