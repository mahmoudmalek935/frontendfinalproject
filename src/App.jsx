import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      {/* الكلاسات دي بتضمن إن الفوتر يفضل تحت خالص حتى لو محتوى الصفحة قليل */}
      <div className="flex flex-col min-h-screen">

        {/* الـ Navbar ثابت في الموقع كله من فوق */}
        <Navbar /> 

        {/* ده المكان اللي الصفحات بتتغير فيه وبياخد باقي مساحة الشاشة */}
        <main className="flex-grow bg-slate-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        {/* الـ Footer ثابت في الموقع كله من تحت */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;