import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

// المكونات الثابتة
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// الصفحات
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Providers from './pages/Providers';
import ProviderProfile from './pages/ProviderProfile';
import MyRequests from './pages/MyRequests';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import NotFound from './pages/NotFound'; // صفحة الإيرور
import Terms from './pages/Terms';
import EditProfile from './pages/EditProfile';
import History from './pages/History';
import ManageCategories from './pages/ManageCategories';
import Blog from './pages/Blog';
import ManageUsers from './pages/ManageUsers';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProviderOnboarding from './pages/ProviderOnboarding';
import ProviderEditProfile from './pages/ProviderEditProfile';
import CustomerProfile from './pages/CustomerProfile';
import OrderDetails from "./pages/OrderDetails"
import ManageOrders from './pages/ManageOrders';


// سكرول للصفحة من فوق
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// الكومبوننت ده بيجمع الـ Navbar والـ Footer حوالين أي صفحة جواه
function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-slate-100">
        <Outlet /> {/* الصفحة نفسها هتتعرض هنا */}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      
      <Routes>
        {/* أي صفحة جوه الـ Route ده، هيظهر فيها Navbar و Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/provider/:id" element={<ProviderProfile />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/history" element={<History />} />
          <Route path="/manage-categories" element={<ManageCategories />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/provider-onboarding" element={<ProviderOnboarding />} />
          <Route path="/provider/edit" element={<ProviderEditProfile />} />
          <Route path="/my-profile" element={<CustomerProfile />} />
          <Route path="/order-details/:id" element={<OrderDetails />} />
          <Route path="/manage-orders" element={<ManageOrders />} />

          {/* حط هنا أي صفحات تانية عايز فيها ناف بار */}
        </Route>

        {/* مسار الطوارئ بره الـ Layout، يعني هيفتح شاشة كاملة لوحده */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;