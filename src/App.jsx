import { Routes, Route, Navigate } from "react-router-dom";
import { RequireAdmin } from './components/RequireAdmin';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';

// Pages
import LoginPage from './pages/LoginPage'
import AdminHomePage from './pages/admin/AdminHomePage'
import UserHomePage from './pages/UserHomePage'
import CreateUser from './pages/admin/create-user/CreateUser'
import ViewUsers from './pages/admin/view-users/ViewUsers'
import EditUser from './pages/admin/view-users/EditUser'

function App() {
  return (
    <Routes>
      <Route path="/" element={
          <LoginPage />
      } />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <RequireAdmin>
          <AdminHomePage />
        </RequireAdmin>
      } />
      <Route path="/create-user" element={
        <RequireAdmin>
          <CreateUser />
        </RequireAdmin>
      } />
      <Route path="/view-users" element={
        <RequireAdmin>
          <ViewUsers />
        </RequireAdmin>
      } />
      <Route path="/view-users/edit" element={
        <RequireAdmin>
          <EditUser />
        </RequireAdmin>
      } />

      {/* User Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <UserHomePage />
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
