import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import './index.css';
import Home from "./pages/Main_Layout/Home";
import About from "./pages/Main_Layout/About";
import Collection from "./pages/Main_Layout/Collection";
import Cart from "./pages/Main_Layout/Cart";
import Login from "./pages/Main_Layout/Login";
import Signup from "./pages/Main_Layout/Signup";
import SingleProduct from "./pages/Main_Layout/SingleProduct";
import VerifyEmail from "./pages/Main_Layout/VerifyEmail";
import ForgotPassword from "./pages/Main_Layout/ForgotPassword";
import ResetPassword from "./pages/Main_Layout/ResetPassword";
// import ApiProvider from "./ApiProvider";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthProvider";
import ProtectRoutes from "./context/ProtectRoutes";
import AdminProtection from "./context/AdminProtection";
import VerifiedOnly from "./context/VerifiedOnly"; // ✅ NEW
import GuestOnly from "./context/GuestOnly"; // ✅ NEW

// Layouts
import AdminLayout from "./pages/AdminLayout";
import MainLayout from "./pages/MainLayout";

// Admin Pages
import Products from "./pages/Admin_Pages/Products/Products";
import AddProduct from "./pages/Admin_Pages/Products/AddProduct";
import EditProduct from "./pages/Admin_Pages/Products/EditProduct";
import Orders from "./pages/Admin_Pages/Orders/Orders";
import Dashbord from "./pages/Admin_Pages/Dashbord/Dashbord";
import Analytics from "./pages/Admin_Pages/Dashbord/Analytics";
import AllUsers from "./pages/Admin_Pages/Users/Users";

// Profile Pages
import ProfileLayout from "./pages/Main_Layout/Profile/ProfileLayout";
import Personal from "./pages/Main_Layout/Profile/Profile_Pages/Personal";
import SecurityPage from "./pages/Main_Layout/Profile/Profile_Pages/SecurityPage";
import PersonalOrders from "./pages/Main_Layout/Profile/Profile_Pages/PersonalOrders";
import WishList from "./pages/Main_Layout/Profile/Profile_Pages/WishList";

// Other Pages
import Contact from "./pages/Main_Layout/Contact";
import CheckOut from "./pages/Main_Layout/Order/CheckOut";
import PaymentPage from "./pages/Main_Layout/Order/PaymentPage";
import OrderConfirmationPage from "./pages/Main_Layout/Order/OrderConfirmationPage";
import { LanguageProvider } from "./context/LanguageContext";
import SupportBtn from "./components/SupportBtn";
import Reports from "./pages/Admin_Pages/Report/Reports";
import { ThemeProvider } from "./context/ThemeProvider";
import SearchPage from "./pages/Main_Layout/SearchPage";

function App() {

  const location = useLocation();

  const hideSupportBtnOnProductPage = 
    location.pathname.startsWith("/products/")

  return (
    <div className="relative w-full min-h-screen bg-white dark:bg-gray-900 text-[#080808] overflow-x-hidden">
      <LanguageProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
                <ToastContainer 
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />

                <Routes>
                  {/* ========================================
                      🔓 PUBLIC ROUTES (Guest Only)
                      ======================================== */}
                  <Route element={<GuestOnly />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:id" element={<ResetPassword />} />
                  </Route>

                  {/* ✅ Email verification (accessible to all) */}
                  <Route path="/verify-email/:id" element={<VerifyEmail />} />

                  {/* ========================================
                      🏠 MAIN LAYOUT ROUTES
                      ======================================== */}
                  <Route element={<MainLayout />}>
                    {/* Public pages (no auth required) */}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/collection" element={<Collection />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/products/:id" element={<SingleProduct />} />

                    {/* ========================================
                        🔐 PROTECTED ROUTES (Login Required)
                        ======================================== */}
                    <Route element={<ProtectRoutes />}>
                      <Route path="/carts" element={<Cart />} />
                      
                      {/* ✅ Checkout requires verified email */}
                      <Route element={<VerifiedOnly />}>
                        <Route path="/checkout" element={<CheckOut />} />
                        <Route path="/order/:id/pay" element={<PaymentPage />} />
                        <Route path="/order/:id" element={<OrderConfirmationPage />} />
                      </Route>

                      {/* ========================================
                          👤 PROFILE ROUTES
                          ======================================== */}
                      <Route path="/users/me" element={<ProfileLayout />}>
                        <Route index element={<Navigate to="personal" replace />} />
                        <Route path="personal" element={<Personal />} />
                        <Route path="my-orders" element={<PersonalOrders />} />
                        <Route path="security-page" element={<SecurityPage />} />
                        <Route path="wishlist" element={<WishList />} />
                      </Route>
                    </Route>
                  </Route>

                  {/* ========================================
                      👑 ADMIN ROUTES (Admin Only)
                      ======================================== */}
                  <Route element={<AdminProtection />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<Navigate to="dashboard/main" replace />} />
                      <Route path="dashboard/main" element={<Dashbord />} />
                      <Route path="dashboard/analytics" element={<Analytics />} />

                      <Route path="products/all" element={<Products />} />
                      <Route path="products/new" element={<AddProduct />} />
                      <Route path="products/edit/:id" element={<EditProduct />} />

                      <Route path="orders" element={<Orders />} />
                      <Route path="users" element={<AllUsers />} />
                      <Route path="reports" element={<Reports />} />
                    </Route>
                  </Route>

                  {/* ========================================
                      404 FALLBACK
                      ======================================== */}
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>

              
              {!hideSupportBtnOnProductPage && <SupportBtn />}
              
            </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
      </LanguageProvider>
    </div>
  );
}

export default App;