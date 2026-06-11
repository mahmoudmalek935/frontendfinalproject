import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

function Register() {
  // تعريف المتغيرات لكل خانة في الفورم
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer'); // القيمة الافتراضية عميل
  
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      // بنبعت الداتا لمسار الـ register في الباك إند
      await api.post('/Auth/register', {
        fullName: fullName,
        email: email,
        password: password,
        phone: phone,
        role: role
      });

      // لو التسجيل نجح، بنوديه على صفحة اللوجين عشان يدخل بحسابه الجديد
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage('Registration failed: ' + error.response.data);
      } else {
        setErrorMessage('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Create an Account 📝</h1>
      
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          type="text" 
          placeholder="Full Name" 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <input 
          type="email" 
          placeholder="Email Address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        <input 
          type="tel" 
          placeholder="Phone Number" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />

        {/* 🌟 قائمة منسدلة عشان يختار هو عميل ولا صنايعي */}
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        >
          <option value="customer">Customer</option>
          <option value="provider">Service Provider</option>
        </select>

        {errorMessage && (
          <div style={{ color: 'red', fontWeight: 'bold' }}>
            {errorMessage}
          </div>
        )}

        <button type="submit" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
          Register
        </button>

      </form>

      <div style={{ marginTop: '20px' }}>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}

export default Register;