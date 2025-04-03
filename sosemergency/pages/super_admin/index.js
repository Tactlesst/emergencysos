import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, logoutUser } from '@/utils/auth';
import Sidebar from '../../components/AdminSidebar';
import Header from '../../components/AdminHeader';
import Footer from '../../components/AdminFooter';
import AnalyticsPage from '@/pages/super_admin/superadmin/analytics';
import ManageStationsPage from '@/pages/super_admin/superadmin/stations';
import ManageRescuesPage from '@/pages/super_admin/superadmin/rescues';
import ManageUsersPage from '@/pages/super_admin/superadmin/users';
import styles from '../../styles/Admin.module.css'; // Import styles

export default function SuperAdminLayout() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedPage, setSelectedPage] = useState('analytics'); // Default page
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar open state for mobile

  useEffect(() => {
    // Check if user is logged in and has 'super_admin' rights
    const userData = getCurrentUser();
    if (!userData || userData.userType !== 'super_admin') {
      router.replace('/'); // Redirect to homepage if not super_admin
    } else {
      setUser(userData); // Set user data if valid
    }

    // Retrieve last active page from localStorage
    const savedPage = localStorage.getItem('selectedPage');
    if (savedPage) {
      setSelectedPage(savedPage);
    }
  }, [router]);

  // Handle page change and update localStorage
  const handlePageChange = (page) => {
    setSelectedPage(page);
    localStorage.setItem('selectedPage', page);
  };

  const handleLogout = () => {
    logoutUser(); // Handle logout
    localStorage.removeItem('selectedPage'); // Clear active page on logout
    router.replace('/'); // Redirect to homepage
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };

  // Return a loading message if user data is still being fetched
  if (!user) return <p>Loading...</p>;

  // Function to render the selected page content
  const renderContent = () => {
    switch (selectedPage) {
      case 'analytics':
        return <AnalyticsPage />;
      case 'stations':
        return <ManageStationsPage />;
      case 'rescues':
        return <ManageRescuesPage />;
      case 'users':
        return <ManageUsersPage />;
      default:
        return <AnalyticsPage />; // Default to AnalyticsPage
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <Header user={user} onLogout={handleLogout} onHamburgerClick={toggleSidebar} />

      <div className={styles.mainContent}>
        {/* Sidebar */}
        <Sidebar 
          selectedPage={selectedPage} 
          onPageChange={handlePageChange} 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} // Pass the toggle function
        />

        {/* Main Content */}
        <main className={styles.content}>
          <div className={styles.pageContainer}>
            {renderContent()} {/* Render content based on selected page */}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <Footer />
      </footer>
    </div>
  );
}
