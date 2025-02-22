import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate, Navigate } from 'react-router-dom';
import { PublicRoute } from '../components/PublicRoute';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  
  // Error state
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });

  // Add loading state
  const [isLoading, setIsLoading] = useState(false);

  // Add password visibility state
  const [showPassword, setShowPassword] = useState(false);

  // Load saved credentials on mount if they exist
  useEffect(() => {
    const savedCredentials = localStorage.getItem('savedCredentials');
    if (savedCredentials) {
      const { username, password } = JSON.parse(savedCredentials);
      setFormData(prev => ({
        ...prev,
        username,
        password,
        rememberMe: true
      }));
    }
  }, []);

  // Updated password regex to require letters, numbers, and special characters
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

  const validateForm = () => {
    const newErrors = {
      username: '',
      password: ''
    };

    if (!formData.username) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters and contain letters, numbers, and special characters';
    }

    setErrors(newErrors);
    return !newErrors.username && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const userData = await login(formData.username, formData.password);
      console.log("Login response:", userData);
      console.log("Is Super Admin:", userData.is_super_admin);
      
      // If remember me is checked, save credentials
      if (formData.rememberMe) {
        localStorage.setItem('savedCredentials', JSON.stringify({
          username: formData.username,
          password: formData.password
        }));
      } else {
        localStorage.removeItem('savedCredentials');
      }

      // Redirect based on user role
      if (userData.is_super_admin) {
        navigate('/admin');  // Redirect to admin dashboard
      } else {
        navigate('/dashboard');  // Redirect to regular user dashboard
      }
      
    } catch (error) {
      setErrors({
        ...errors,
        general: error.message || 'An error occurred during login'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Only render the login page if we're not loading and there's no user
  return (
    <div className="flex flex-col justify-center items-center min-h-[100vh]">
      {/* Add your login form here */}
        <form onSubmit={handleSubmit} className="bg-[#232e39] rounded-lg border border-[#979797] max-w-[546px] pt-12 pb-6 px-14">
            <div>
                {/* Logo Image Container */}
                <div>
                    <div className="flex justify-center align-middle w-[100%] max-w-[298px] mx-auto mb-12 pb-10 border-b border-b-[#9d9db2]">
                        <a href="" className="no-underline">
                            <img src="https://cdn.iriscrm.com/volt/public/logos/www.voltmscrm.com_new_ui?v=20240618085742" alt="" srcSet="" className="max-w-[179px] max-h-[109px]" />
                        </a>
                    </div>
                </div>

                {/* Center Block */}
                <div className="min-w-[320px] flex flex-col justify-center items-center gap-8">
                    <div className="w-[327px] pt-0">
                        <input 
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter Username"
                            required
                            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-[#e38932] bg-[#d99320] text-white placeholder-white"
                        />
                        
                    </div>
                    {errors.username && <p className="text-red-500 text-center text-sm">{errors.username}</p>}
                    <div className="w-[327px] pt-0z">
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter Password"
                                required
                                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-[#e38932] bg-[#d99320] text-white placeholder-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                            >
                                {showPassword ? (
                                    // Eye closed icon
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 cursor-pointer">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    // Eye open icon
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 cursor-pointer">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-center text-sm max-w-[327px]">{errors.password}</p>}
                    </div>

                    {/* Input Checkbox */}
                    <div className="flex justify-center items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="w-4 h-4 text-[#e38932] bg-[#d99320] border-gray-300 rounded focus:ring-[#e38932] focus:ring-2"
                        />
                        <label htmlFor="remember" className="ml-2 text-white">
                            Remember me
                        </label>

                    </div>

                    {errors.general && (
                        <div className="text-red-500 text-sm">{errors.general}</div>
                    )}

                    {/* Login Button */}
                    <div className="flex justify-center">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="rounded text-center min-w-[40px] min-h-[40px] h-[40px] bg-[#e38932] hover:bg-[#c47729] text-white cursor-pointer w-[172px] relative"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                            ) : 'Log In'}
                        </button>
                    </div>

                    {/* Forgot Username or Password */}
                    <div className="flex justify-center mb-4">
                        <a href="#" className="text-[#0090ff] text-sm no-underline">Forgot Username or Password?</a>
                    </div>

                </div>

            </div>

        </form>

    </div>
  )
}

export default function ProtectedLoginPage() {
  return (
    <PublicRoute>
      <LoginPage />
    </PublicRoute>
  );
} 