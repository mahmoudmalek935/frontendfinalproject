import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// استدعاء المكونات الثابتة
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// استدعاء الصفحات
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



// الـ Component ده بيخلي الصفحة تفتح من فوق دايماً
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      {/* لازم يتحط هنا عشان يشتغل مع كل نقلة */}
      <ScrollToTop />

      <div className="flex flex-col min-h-screen">
        <Navbar /> 

        <main className="flex-grow bg-slate-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/provider/:name" element={<ProviderProfile />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/provider-dashboard" element={<ProviderDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;