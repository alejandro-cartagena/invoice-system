import React from 'react';
import logo from '../images/Volt-Merchant-Solutions-logo.png';

const Loading = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            {/* Logo/Image */}
            <img 
                src={logo} // Replace with your image path
                alt="Loading Logo"
                className="w-48 mb-8" // Adjust width and margin as needed
            />
            
            {/* Spinner */}
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}

export default Loading;
