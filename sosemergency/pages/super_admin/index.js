import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // <-- Ensure this is imported correctly
import { getCurrentUser, logoutUser } from '@/utils/auth';
import Sidebar from '../../components/AdminSidebar';
import Header from '../../components/AdminHeader';
import Footer from '../../components/AdminFooter';
import AnalyticsPage from '@/pages/super_admin/superadmin/analytics';
import ManageStationsPage from '@/pages/super_admin/superadmin/stations';
import ManageRescuesPage from '@/pages/super_admin/superadmin/rescues';
import ManageUsersPage from '@/pages/super_admin/superadmin/users';

export default function SuperAdminLayout() {
  const router = useRouter(); // <-- Using the useRouter hook
  const [user, setUser] = useState(null);
  const [selectedPage, setSelectedPage] = useState('analytics');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const userData = getCurrentUser();
    if (!userData || userData.userType !== 'super_admin') {
      router.replace('/auth'); // <-- Navigating using useRouter
    } else {
      setUser(userData);
    }

    const savedPage = localStorage.getItem('selectedPage');
    if (savedPage) {
      setSelectedPage(savedPage);
    }
  }, [router]);

  const handlePageChange = (page) => {
    setSelectedPage(page);
    localStorage.setItem('selectedPage', page);
  };

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem('selectedPage');
    router.replace('/auth'); // <-- Navigating after logout
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

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
        return <AnalyticsPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Header user={user} onLogout={handleLogout} onHamburgerClick={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          selectedPage={selectedPage}
          onPageChange={handlePageChange}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="bg-white shadow rounded-lg p-4 h-full">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow p-4">
        <Footer />
      </footer>
    </div>
  );
}
