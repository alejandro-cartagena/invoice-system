import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../../components/Navbar.jsx';
import UserCard from '../../../components/UserCard.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { RequireAdmin } from '../../../components/RequireAdmin.jsx';

import users from "../../../data/user-data.js";

const ViewUsers = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const usersPerPage = 10;

    // This will be replaced with an API call
    const fetchUsers = async (page, searchTerm = '') => {
        setLoading(true);
        try {
            // This is where you'll make your API call
            // const response = await fetch(`/api/users?page=${page}&search=${searchTerm}`);
            // const data = await response.json();
            
            // For now, we'll simulate with dummy data
            const filteredUsers = users.filter(user => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    user.businessName.toLowerCase().includes(searchLower) ||
                    user.email.toLowerCase().includes(searchLower)
                );
            });

            // Calculate total pages
            setTotalPages(Math.ceil(filteredUsers.length / usersPerPage));
            
            // Get current page's users
            const startIndex = (page - 1) * usersPerPage;
            const endIndex = startIndex + usersPerPage;
            return filteredUsers.slice(startIndex, endIndex);

        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Fetch users when page or search term changes
    const [displayedUsers, setDisplayedUsers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            const users = await fetchUsers(currentPage, searchTerm);
            setDisplayedUsers(users);
        };
        getUsers();
    }, [currentPage, searchTerm]);

    // Handle edit user
    const handleEdit = (userId) => {
        navigate(`/view-users/edit?id=${userId}`);
    };

    // Handle delete user
    const handleDelete = (userId, userEmail) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Deleting a user will delete all data associated with it.",
            icon: "warning",
            iconColor: "#DC2626", // red-600
            showCancelButton: true,
            confirmButtonText: "Yes, delete user",
            cancelButtonText: "No, cancel",
            confirmButtonColor: "#DC2626", // red-600
            cancelButtonColor: "#4B5563", // gray-600
            customClass: {
                popup: 'rounded-lg',
                title: 'text-xl font-semibold',
                htmlContainer: 'text-gray-600'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUser(userId);
            }
        });
    };

    // Delete user function
    const deleteUser = (userId) => {
        try {
            // Find the index of the user in the array
            const userIndex = users.findIndex(user => user.id === userId);
            
            if (userIndex !== -1) {
                // Remove the user from the array
                users.splice(userIndex, 1);
                
                // Update the displayed users
                const updatedUsers = users.filter(user => user.id !== userId);
                setDisplayedUsers(prevUsers => 
                    prevUsers.filter(user => user.id !== userId)
                );

                // Show success message
                Swal.fire({
                    title: "Deleted!",
                    text: "User has been deleted successfully.",
                    icon: "success",
                    iconColor: "#DC2626", // red-600
                    confirmButtonColor: "#DC2626", // red-600
                    customClass: {
                        popup: 'rounded-lg',
                        title: 'text-xl font-semibold',
                        htmlContainer: 'text-gray-600'
                    }
                });

                // Recalculate total pages
                setTotalPages(Math.ceil(updatedUsers.length / usersPerPage));
                
                // If current page is empty after deletion, go to previous page
                if (displayedUsers.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                }
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire({
                title: "Error!",
                text: "There was an error deleting the user.",
                icon: "error",
                iconColor: "#DC2626", // red-600
                confirmButtonColor: "#DC2626", // red-600
                customClass: {
                    popup: 'rounded-lg',
                    title: 'text-xl font-semibold',
                    htmlContainer: 'text-gray-600'
                }
            });
        }
    };

    return (
        <div className='mb-16'>
            <Navbar />
            <div className="container mx-auto px-4">
                <h1 className="text-3xl md:text-5xl text-[var(--color-black-text)] font-medium mt-8 mb-10">View Users</h1>
                
                {/* Search Bar */}
                <div className="mb-8 max-w-2xl">
                    <div className="relative">
                        <FontAwesomeIcon 
                            icon={faSearch} 
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search by business name or email..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Loading...</p>
                    </div>
                )}

                {/* User Cards */}
                <div className="space-y-4">
                    {displayedUsers.map((user, index) => (
                        <UserCard
                            key={index}
                            imageUrl={user.imageUrl}
                            companyName={user.businessName}
                            email={user.email}
                            dateCreated={user.dateCreated}
                            onEdit={() => handleEdit(user.id)}
                            onDelete={() => handleDelete(user.id, user.email)}
                        />
                    ))}
                    
                    {!loading && displayedUsers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No users found matching your search.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 mt-8">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg ${
                                currentPage === 1
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-[var(--color-red)] text-white hover:bg-red-600'
                            }`}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        
                        <span className="text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg ${
                                currentPage === totalPages
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-[var(--color-red)] text-white hover:bg-red-600'
                            }`}
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// export default ViewUsers;

export default function ProtectedViewUsers() {
    return (
        <RequireAdmin>
            <ViewUsers />
        </RequireAdmin>
    );
}
