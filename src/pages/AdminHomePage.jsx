import { Navbar } from "../components/Navbar"
import Card from "../components/Card"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function AdminHomePage() {
    const navigate = useNavigate();
    
    return (
      <>
        <Navbar />
        <div className="container">
          <h1 className="text-3xl md:text-5xl text-center text-[var(--color-black-text)] font-medium mt-8 mb-16">Admin Dashboard</h1>
          {/* Add admin-specific content here */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-10">
            <Card
              imageUrl={<FontAwesomeIcon 
                icon={faUserPlus} 
                className="w-full text-[var(--color-black-text)] text-7xl md:text-8xl" 
              />}
              imageAlt="Placeholder"
              title="Create New User" 
              description="Add new users and assign their roles"
              className="h-full"
              onClick={() => navigate('/create-user')}
            />
            <Card
              imageUrl={<FontAwesomeIcon 
                icon={faUsers} 
                className="w-full text-[var(--color-black-text)] text-7xl md:text-8xl" 
              />}
              imageAlt="Placeholder"
              title="View All Users"
              description="View and Manage Existing Users"
              className="h-full"
              onClick={() => navigate('/view-users')}
            />
          </div>
        </div>
      </>
    )
  }
  
  export default AdminHomePage