import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import users from "../../data/user-data.js";

const EditUser = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = searchParams.get('id');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [originalBusinessName, setOriginalBusinessName] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        businessName: '',
        address: '',
        phoneNumber: '',
        email: '',
        einNumber: '',
        bitcoinAccount: '',
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: '',
        enable2FA: false
    });

    // Add error state
    const [errors, setErrors] = useState({
        form: '',
        email: '',
        username: '',
        userExists: '',
        password: '',
        confirmPassword: ''
    });

    // Email validation function
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Add password regex
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

    useEffect(() => {
        if (!userId) {
            navigate('/view-users');
            return;
        }

        // Find user in users array
        const user = users.find(u => u.id === parseInt(userId));

        setOriginalBusinessName(user.businessName);
        
        if (!user) {
            navigate('/view-users');
            return;
        }

        // Pre-fill form with user data
        setFormData({
            businessName: user.businessName,
            address: user.address,
            phoneNumber: user.phoneNumber,
            email: user.email,
            einNumber: user.einNumber,
            bitcoinAccount: user.bitcoinAccount,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            password: '', // Don't pre-fill password for security
            confirmPassword: '',
            enable2FA: user.enable2FA
        });
    }, [userId, navigate]);

    // Handle input changes with validation
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear errors when user starts typing
        setErrors(prev => ({
            ...prev,
            [name]: '',
            form: '',
            userExists: ''
        }));

        // Validate email format
        if ((name === 'email' || name === 'username') && value) {
            if (!isValidEmail(value)) {
                setErrors(prev => ({
                    ...prev,
                    [name]: 'Please enter a valid email address'
                }));
            }
        }

        // Password validation
        if (name === 'password' && value) {
            if (!passwordRegex.test(value)) {
                setErrors(prev => ({
                    ...prev,
                    password: 'Password must contain at least 8 characters, including letters, numbers, and special characters'
                }));
            }
            // Check if confirm password matches
            if (formData.confirmPassword && value !== formData.confirmPassword) {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: 'Passwords do not match'
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: ''
                }));
            }
        }

        // Confirm password validation
        if (name === 'confirmPassword') {
            if (formData.password && value !== formData.password) {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: 'Passwords do not match'
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: ''
                }));
            }
        }
    };

    // Updated phone number handler with formatting
    const handlePhoneNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        let formattedValue = value;
        
        if (value.length > 0) {
            formattedValue = '(' + value.substring(0,3);
            if (value.length > 3) {
                formattedValue += ')' + value.substring(3,6);
            }
            if (value.length > 6) {
                formattedValue += '-' + value.substring(6,10);
            }
        }

        setFormData(prevState => ({
            ...prevState,
            phoneNumber: value,
            displayPhoneNumber: formattedValue
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ form: '', email: '', username: '', userExists: '', password: '', confirmPassword: '' });

        // Validate all required fields except password (password only required if provided)
        const requiredFields = ['businessName', 'address', 'phoneNumber', 'email', 
                              'einNumber', 'bitcoinAccount', 'firstName', 'lastName', 
                              'username'];
        
        const emptyFields = requiredFields.filter(field => !formData[field]);
        
        if (emptyFields.length > 0) {
            setErrors(prev => ({
                ...prev,
                form: 'Please fill in all required fields'
            }));
            return;
        }

        // Validate email formats
        if (!isValidEmail(formData.email) || !isValidEmail(formData.username)) {
            setErrors(prev => ({
                ...prev,
                form: 'Please enter valid email addresses'
            }));
            return;
        }

        // Validate password only if one is provided
        if (formData.password && !passwordRegex.test(formData.password)) {
            setErrors(prev => ({
                ...prev,
                password: 'Password must contain at least 8 characters, including letters, numbers, and special characters'
            }));
            return;
        }

        // Validate password match if password is provided
        if (formData.password) {
            if (formData.password !== formData.confirmPassword) {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: 'Passwords do not match'
                }));
                return;
            }
        }

        try {
            // Update user in the users array
            const userIndex = users.findIndex(u => u.id === parseInt(userId));
            if (userIndex !== -1) {
                users[userIndex] = {
                    ...users[userIndex],
                    ...formData,
                    id: parseInt(userId), // Ensure ID remains unchanged
                    dateCreated: users[userIndex].dateCreated, // Preserve creation date
                    imageUrl: users[userIndex].imageUrl // Preserve image
                };
                
                // Navigate back to view users page
                navigate('/view-users');
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                form: 'An error occurred. Please try again.'
            }));
        }
    };

    return (
        <div className="mb-10">
            <Navbar />
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/view-users')}
                    className="cursor-pointer flex items-center text-gray-600 hover:text-gray-900 mt-4 mb-2"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Back to Users
                </button>

                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                    {errors.form && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errors.form}
                        </div>
                    )}
                    
                    <h1 className="text-3xl md:text-5xl text-[var(--color-black-text)] font-medium mt-8 mb-10">
                        Edit User ({originalBusinessName})
                    </h1>

                    {/* Business Information */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-medium text-[var(--color-black-text)]">Business Information</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Business Name</label>
                            <input 
                                type="text" 
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address</label>
                            <input 
                                type="text" 
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500" 
                                required 
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input 
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.displayPhoneNumber || formData.phoneNumber}
                                    onChange={handlePhoneNumberChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    } px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500`}
                                    required 
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">EIN Number</label>
                                <input 
                                    type="text" 
                                    name="einNumber"
                                    value={formData.einNumber}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bitcoin Account</label>
                                <input 
                                    type="text" 
                                    name="bitcoinAccount"
                                    value={formData.bitcoinAccount}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500" 
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="space-y-4 pt-6">
                        <h2 className="text-2xl font-medium text-[var(--color-black-text)]">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input 
                                    type="text" 
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500" 
                                    required 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input 
                                    type="text" 
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500" 
                                    required 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username (Email)</label>
                            <input 
                                type="email" 
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border ${
                                    errors.username ? 'border-red-500' : 'border-gray-300'
                                } px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500`}
                                required 
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.username}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    } px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500`}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Leave blank to keep current password. New password must contain at least 8 characters, including letters, numbers, and special characters.
                            </p>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${
                                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    } px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-red-500`}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <input 
                                type="checkbox" 
                                id="enable2fa"
                                name="enable2FA"
                                checked={formData.enable2FA}
                                onChange={handleChange}
                                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <label htmlFor="enable2fa" className="text-sm font-medium text-gray-700">
                                Enable Two-Factor Authentication (2FA)
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            className="cursor-pointer w-full bg-[var(--color-red)] text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-300"
                        >
                            Update User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;
