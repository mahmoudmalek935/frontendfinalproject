import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api'; // 🌟 الكوبري بتاعنا

function Login() {
  // تعريف المتغيرات اللي هتشيل البيانات اللي اليوزر بيكتبها
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // الأداة اللي هتنقلنا للصفحة الرئيسية بعد تسجيل الدخول بنجاح
  const navigate = useNavigate();

  // الدالة دي بتشتغل أول ما اليوزر يدوس على زرار "Login"
  const handleLogin = async (e) => {
    e.preventDefault(); // بتمنع الصفحة إنها تعمل Refresh
    setErrorMessage(''); // بنفضي أي إيرور قديم

    try {
      // 1. بنبعت البيانات للباك إند (تأكد إن مسار اللوجين عندك اسمه كده)
        const response = await api.post('/Auth/login', {
        email: email, 
        password: password 
      });

      // 2. لو نجح، بناخد التوكن (Token) ونحفظه في المتصفح عشان نستخدمه بعدين
      const token = response.data.token;
      localStorage.setItem('token', token);

      // 3. بننقل اليوزر للصفحة الرئيسية
      navigate('/');
    } catch (error) {
      // لو حصل مشكلة (إيميل غلط أو باسوورد غلط) بنعرض رسالة
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid email or password.');
      } else {
        setErrorMessage('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Login to Baytak 🔐</h1>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* خانة الإيميل */}
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        {/* خانة الباسوورد */}
        <input 
          type="password" 
          placeholder="Enter your password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        {/* عرض رسالة الخطأ لو موجودة */}
        {errorMessage && (
          <div style={{ color: 'red', fontWeight: 'bold' }}>
            {errorMessage}
          </div>
        )}

        {/* زرار الدخول */}
        <button type="submit" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
          Login
        </button>

      </form>

      
      <div style={{ marginTop: '20px' }}>
        <Link to="/">⬅️ Back to Home</Link>
        {/* 🌟 السطر الجديد ده عشان يروح لصفحة التسجيل */}
        <p style={{ marginTop: '10px' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;