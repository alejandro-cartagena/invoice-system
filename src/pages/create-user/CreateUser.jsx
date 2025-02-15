import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';

const CreateUser = () => {
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

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Email validation function
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Add password regex
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

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
        const value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
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
            phoneNumber: value, // Store only numeric values
            displayPhoneNumber: formattedValue // Add this for display purposes
        }));
    };

    // Handle form submission with validation
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ form: '', email: '', username: '', userExists: '', password: '', confirmPassword: '' });

        // Validate all required fields
        const requiredFields = ['businessName', 'address', 'phoneNumber', 'email', 
                              'einNumber', 'bitcoinAccount', 'firstName', 'lastName', 
                              'username', 'password'];
        
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

        // Validate password
        if (!passwordRegex.test(formData.password)) {
            setErrors(prev => ({
                ...prev,
                password: 'Password must contain at least 8 characters, including letters, numbers, and special characters'
            }));
            return;
        }

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setErrors(prev => ({
                ...prev,
                confirmPassword: 'Passwords do not match'
            }));
            return;
        }

        try {
            // Add your API call here to check if user exists and create user
            const response = await checkIfUserExists(formData.username);
            if (response.userExists) {
                setErrors(prev => ({
                    ...prev,
                    userExists: 'A user with this username already exists'
                }));
                return;
            }

            // If all validations pass, proceed with user creation
            // Add your user creation logic here
            
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                form: 'An error occurred. Please try again.'
            }));
        }
    };

    console.log(formData);

    return (
        <div className="mb-10">
            <Navbar />
            <div className="container mx-auto px-4">
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                    {/* Show form-wide errors */}
                    {errors.form && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errors.form}
                        </div>
                    )}
                    
                    {/* Show user exists error */}
                    {errors.userExists && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errors.userExists}
                        </div>
                    )}

                    <h1 className="text-3xl md:text-5xl text-[var(--color-black-text)] font-medium mt-8 mb-10">Create a New User</h1>
                    {/* Business Information */}
                    <div className="space-y-4">
                        <h2 className="text-3xl font-medium text-[var(--color-black-text)]">Business Information</h2>
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
                                    value={formData.displayPhoneNumber || ''} // Use formatted value for display
                                    onChange={handlePhoneNumberChange}
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    maxLength="14"
                                    placeholder="(123)456-7890"
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
                                    required 
                                />
                                <button
                                    type="button"
                                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {/* Password requirements message */}
                            <p className="mt-1 text-sm text-gray-500">
                                Password must contain at least 8 characters, including letters, numbers, and special characters
                            </p>
                            {/* Error message */}
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
                                    required 
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
                            Create User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateUser;
