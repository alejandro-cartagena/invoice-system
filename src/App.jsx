import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import LoginPage from './pages/LoginPage'
import AdminHomePage from './pages/AdminHomePage'
import UserHomePage from './pages/UserHomePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/dashboard" element={<UserHomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
