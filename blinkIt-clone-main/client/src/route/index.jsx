import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProduct from "../pages/UploadProduct";
import ProductAdmin from "../pages/ProductAdmin";
import AdminPermision from "../layouts/AdminPermision";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CartMobile from "../pages/CartMobile";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
import OrderSuccess from "../pages/OrderSuccess";
import Wishlist from "../pages/Wishlist";
import ContactUs from "../pages/ContactUs";
import ContactSubmissions from "../pages/ContactSubmissions";
import AboutUs from "../pages/AboutUs";
import Shop from "../pages/Shop";
import Receipt from "../components/Receipt";

// Custom error boundary component
const ErrorBoundary = () => {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong</h1>
      <p className="text-gray-600 mb-4">We couldn't find what you were looking for.</p>
      <a href="/" className="text-indigo-600 hover:text-indigo-800">
        Return to Home
      </a>
    </div>
  );
};

const routes = [
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "search",
                element: <SearchPage />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "verification-otp",
                element: <OtpVerification />
            },
            {
                path: "reset-password",
                element: <ResetPassword />
            },
            {
                path: "user",
                element: <UserMenuMobile />
            },
            {
                path: "dashboard",
                element: <Dashboard />,
                children: [
                    {
                        path: "profile",
                        element: <Profile />
                    },
                    {
                        path: "myorders",
                        element: <MyOrders />
                    },
                    {
                        path: "wishlist",
                        element: <Wishlist />
                    },
                    {
                        path: "address",
                        element: <Address />
                    },
                    {
                        path: "category",
                        element: <AdminPermision><CategoryPage /></AdminPermision>
                    },
                    {
                        path: "subcategory",
                        element: <AdminPermision><SubCategoryPage /></AdminPermision>
                    },
                    {
                        path: "upload-product",
                        element: <AdminPermision><UploadProduct /></AdminPermision>
                    },
                    {
                        path: "product-admin",
                        element: <AdminPermision><ProductAdmin /></AdminPermision>
                    },
                    {
                        path: "contact-submissions",
                        element: <AdminPermision><ContactSubmissions /></AdminPermision>
                    }
                ]
            },
            {
                path: "product/:id",
                element: <ProductDisplayPage />,
                errorElement: <ErrorBoundary />
            },
            {
                path: "category/:categoryId",
                element: <ProductListPage />
            },
            {
                path: "category/:categoryId/:subcategoryId",
                element: <ProductListPage />
            },
            {
                path: "product-list",
                element: <ProductListPage />
            },
            {
                path: "cart",
                element: <CartMobile />
            },
            {
                path: "checkout",
                element: <CheckoutPage />
            },
            {
                path: "success",
                element: <Success />
            },
            {
                path: "cancel",
                element: <Cancel />
            },
            {
                path: "order-success",
                element: <OrderSuccess />
            },
            {
                path: "contact",
                element: <ContactUs />
            },
            {
                path: "about",
                element: <AboutUs />
            },
            {
                path: "shop",
                element: <Shop />
            },
            {
                path: "receipt/:orderId",
                element: <Receipt />
            }
        ]
    }
];

export default routes;