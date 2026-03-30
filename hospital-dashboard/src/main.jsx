import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { testFirebaseConnection } from './services/firebase'

// ⚡ Check Firebase Connection on Load
testFirebaseConnection();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
