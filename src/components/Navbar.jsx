import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import voltLogo from "../images/Volt-Merchant-Solutions-Logo.png";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <nav className="bg-[var(--color-primary)] shadow-md">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/admin">
              <img
                src={voltLogo}
                alt="Company Logo"
                className="h-8 w-auto"
              />
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `${isActive ? 'text-red-700' : 'text-white hover:text-gray-400'} transition-colors`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/create-user"
              className={({ isActive }) =>
                `${isActive ? 'text-red-700' : 'text-white hover:text-gray-400'} transition-colors`
              }
            >
              Create User
            </NavLink>
            <NavLink
              to="/view-users"
              className={({ isActive }) =>
                `${isActive ? 'text-red-700' : 'text-white hover:text-gray-400'} transition-colors`
              }
            >
              View Users
            </NavLink>
            <button
              onClick={logout}
              className="bg-red-700 hover:bg-red-800 cursor-pointer px-4 py-1 rounded-sm text-white transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button - Now vertically aligned */}
          <div className="md:hidden flex items-center h-full">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              {!isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[var(--color-primary)]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `${isActive ? 'text-red-700' : 'text-white hover:text-gray-400'} block px-3 py-2  transition-colors`
              }
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/create-user"
              className={({ isActive }) =>
                `${isActive ? 'text-red-700' : 'text-white hover:text-gray-400'} block px-3 py-2 transition-colors`
              }
              onClick={() => setIsOpen(false)}
            >
              Create User
            </NavLink>
            <NavLink
              to="/view-users"
              className={({ isActive }) =>
                `${isActive ? 'text-red-700' : 'text-white hover:text-gray-400'} block px-3 py-2 transition-colors`
              }
              onClick={() => setIsOpen(false)}
            >
              View Users
            </NavLink>
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="bg-red-700 text-white hover:text-gray-400 block w-full text-left px-3 py-2 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
