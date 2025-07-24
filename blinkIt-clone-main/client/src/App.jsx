import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlice';
import { useDispatch } from 'react-redux';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';
import GlobalProvider from './provider/GlobalProvider';
import CartMobileLink from './components/CartMobile';

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Clear localStorage in production mode
    if (process.env.NODE_ENV === 'production') {
      localStorage.clear()
    }

    // Check if user is logged in and fetch details
    const checkUserLogin = async () => {
      const accessToken = localStorage.getItem('accesstoken')
      if (accessToken) {
        try {
          const userData = await fetchUserDetails()
          dispatch(setUserDetails(userData.data))
        } catch (error) {
          // If there's an error fetching user details, clear the tokens
          localStorage.clear()
        }
      }
    }

    checkUserLogin()
  }, [dispatch])

  const fetchCategory = async() => {
    try {
      dispatch(setLoadingCategory(true))
      const response = await Axios({
        ...SummaryApi.getCategory
      })
      dispatch(setAllCategory(response.data.data))
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      dispatch(setLoadingCategory(false))
    }
  }

  const fetchSubCategory = async() => {
    try {
      const response = await Axios({
        ...SummaryApi.getSubCategory
      })
      dispatch(setAllSubCategory(response.data.data))
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }

  const initializeApp = async() => {
    try {
      await Promise.all([
        fetchCategory(),
        fetchSubCategory()
      ])
    } catch (error) {
      console.error('Error initializing app:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    initializeApp()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <GlobalProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        <Toaster />
      </div>
    </GlobalProvider>
  )
}

export default App
