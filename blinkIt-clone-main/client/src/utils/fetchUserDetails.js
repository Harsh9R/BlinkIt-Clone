import Axios from "./Axios"
import SummaryApi from "../common/SummaryApi"

const fetchUserDetails = async()=>{
    try {
        // Check if we have a token first
        const token = localStorage.getItem('accesstoken');
        if (!token) {
            console.log('No access token found, user is not authenticated');
            return null;
        }
        
        const response = await Axios({
            ...SummaryApi.userDetails
        });
        
        if (response.data?.success && response.data?.data) {
            console.log('User details fetched successfully:', response.data.data);
            return response.data;
        } else {
            console.error('Failed to fetch user details:', response.data);
            return null;
        }
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('Unauthorized access, clearing token');
            // Clear invalid token
            localStorage.removeItem('accesstoken');
            localStorage.removeItem('refreshToken');
            // Return null to indicate unauthenticated state
            return null;
        }
        // For other errors, return null and log the error
        console.error('Error fetching user details:', error);
        return null;
    }
}

export default fetchUserDetails