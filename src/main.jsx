import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'; // 🔴 ضفنا سطر الاستدعاء ده بس

// 🔴 وحطينا الـ ID بتاعك هنا
const GOOGLE_CLIENT_ID = "291946841966-01b66k6c16691louc6supvl10dpr66ag.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 🔴 غلفنا التطبيق بتاعك من بره بجوجل */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)