import { StrictMode } from 'react'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/auth.context.jsx';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)
