import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import LoginPage from './pages/LoginPage'
import AdminHomePage from './pages/AdminHomePage'
import UserHomePage from './pages/UserHomePage'
import CreateUser from './pages/create-user/CreateUser'
import ViewUsers   from './pages/view-users/ViewUsers'
import EditUser from './pages/view-users/EditUser'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/dashboard" element={<UserHomePage />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/view-users" element={<ViewUsers />} />
        <Route path="/view-users/edit" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
