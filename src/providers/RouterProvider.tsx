import { createBrowserRouter } from "react-router-dom";
import Login from "../routes/authRoutes/Login";
import Register from "../routes/authRoutes/Register";
import ResetPassword from "../routes/authRoutes/ResetPassword";
import Home from "../routes";
import Dashboard from "../routes/DashboardRoutes/Index";
import Products from "../routes/DashboardRoutes/Products";
import Categories from "../routes/DashboardRoutes/Categories";
import Orders from "../routes/DashboardRoutes/Orders";
import User from "../routes/DashboardRoutes/User";
import Settings from "../routes/DashboardRoutes/Settings";
import Support from "../routes/DashboardRoutes/Support";
import Notifications from "../routes/DashboardRoutes/Notifications";
import Messages from "../routes/DashboardRoutes/Messages";
import Farms from "../routes/DashboardRoutes/Farms";
import FarmerDashboard from "../routes/farmerRoutes/Index";
import FarmerProducts from "../routes/farmerRoutes/Products";
import FarmerOrders from "../routes/farmerRoutes/Orders";
import FarmerSales from "../routes/farmerRoutes/Sales";
import FarmerSupport from "../routes/farmerRoutes/Support";
import FarmerSettings from "../routes/farmerRoutes/Settings";
import FarmerNotifications from "../routes/farmerRoutes/Notifications";
import FarmerMessages from "../routes/farmerRoutes/Messages";
import ProductsPage from "../routes/ProductsPage";
import Shop from "../routes/userRoutes/Shop";
import ProductDetail from "../routes/userRoutes/ProductDetail";
import Cart from "../routes/userRoutes/Cart";
import MyAccount from "../routes/userRoutes/MyAccount";
import Checkout from "../routes/userRoutes/Checkout";


const router = createBrowserRouter([
    {
        path: '',
        element: <Home />
    },
    {
        path: '/products',
        element: <ProductsPage />
    },
    {
        path: '/shop',
        element: <Shop />
    },
    {
        path: '/product/:id',
        element: <ProductDetail />
    },
    {
        path: '/cart',
        element: <Cart />
    },
    {
        path: '/checkout',
        element: <Checkout />
    },
    {
        path: '/account',
        element: <MyAccount />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/reset-password',
        element: <ResetPassword />
    },
    {
        path: '/dashboard',
        element: <Dashboard />
    },
    {
        path: '/dashboard/products',
        element: <Products />
    },
    {
        path: '/dashboard/categories',
        element: <Categories />
    },
    {
        path: '/dashboard/farms',
        element: <Farms />
    },
    {
        path: '/dashboard/orders',
        element: <Orders />
    },
    {
        path: '/dashboard/users',
        element: <User />
    },
    {
        path: '/dashboard/support',
        element: <Support />
    },
    {
        path: '/dashboard/settings',
        element: <Settings />
    },
    {
        path: '/dashboard/notifications',
        element: <Notifications />
    },
    {
        path: '/dashboard/messages',
        element: <Messages />
    },
    {
        path: '/farmer',
        element: <FarmerDashboard />
    },
    {
        path: '/farmer/products',
        element: <FarmerProducts />
    },
    {
        path: '/farmer/orders',
        element: <FarmerOrders />
    },
    {
        path: '/farmer/sales',
        element: <FarmerSales />
    },
    {
        path: '/farmer/support',
        element: <FarmerSupport />
    },
    {
        path: '/farmer/settings',
        element: <FarmerSettings />
    },
    {
        path: '/farmer/notifications',
        element: <FarmerNotifications />
    },
    {
        path: '/farmer/messages',
        element: <FarmerMessages />
    },
])

export default router;