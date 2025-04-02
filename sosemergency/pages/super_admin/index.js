import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, logoutUser } from '@/utils/auth';
import Sidebar from '../../components/UserSidebar';
import AnalyticsPage from '@/pages/super_admin/superadmin/analytics';
import ManageStationsPage from '@/pages/super_admin/superadmin/stations';
import ManageRescuesPage from '@/pages/super_admin/superadmin/rescues';
import ManageUsersPage from '@/pages/super_admin/superadmin/users';

export default function SuperAdminLayout() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedPage, setSelectedPage] = useState('analytics'); // Default page

  useEffect(() => {
    const userData = getCurrentUser();
    if (!userData || userData.userType !== 'super_admin') {
      router.replace('/');
    } else {
      setUser(userData);
    }

    // Retrieve last active page from localStorage
    const savedPage = localStorage.getItem('selectedPage');
    if (savedPage) {
      setSelectedPage(savedPage);
    }
  }, []);

  // Update localStorage when changing pages
  const handlePageChange = (page) => {
    setSelectedPage(page);
    localStorage.setItem('selectedPage', page);
  };

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem('selectedPage'); // Clear active page on logout
    router.replace('/');
  };

  if (!user) return <p>Loading...</p>;

  // Function to render the selected page
  const renderContent = () => {
    switch (selectedPage) {
      case 'analytics':
        return <AnalyticsPage />;
      case 'stations':
        return <ManageStationsPage />;
      case 'rescues':
        return <ManageRescuesPage />;
        case'users':
        return <ManageUsersPage />;
      default:
        return <AnalyticsPage />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar selectedPage={selectedPage} onPageChange={handlePageChange} />
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Super Admin Dashboard</h1>
        <p>Welcome, {user.firstName}!</p>
        <button 
          onClick={handleLogout} 
          style={{
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>

        {/* Dynamic Content Changes Here */}
        {renderContent()}
      </div>
    </div>
  );
}