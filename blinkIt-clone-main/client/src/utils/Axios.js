import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json'
    }
})

// Request interceptor for adding auth token and handling content type
Axios.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accesstoken')
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        
        // Don't set Content-Type for FormData (file uploads)
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }
        
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for handling 401 and token refresh
Axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            
            try {
                const refreshToken = localStorage.getItem("refreshToken")
                if (!refreshToken) {
                    localStorage.clear()
                    window.location.href = '/login'
                    return Promise.reject(error)
                }
                
                const newAccessToken = await refreshAccessToken(refreshToken)
                if (newAccessToken) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                    return Axios(originalRequest)
                }
            } catch (refreshError) {
                localStorage.clear()
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios({
            ...SummaryApi.refreshToken,
            baseURL,
            headers: {
                Authorization: `Bearer ${refreshToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })

        if (response.data?.data?.accessToken) {
            localStorage.setItem('accesstoken', response.data.data.accessToken)
            return response.data.data.accessToken
        }
        return null
    } catch (error) {
        console.error('Error refreshing token:', error)
        return null
    }
}

export default Axios