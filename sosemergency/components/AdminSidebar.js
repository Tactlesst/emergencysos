import { useEffect } from 'react';
import styles from '../styles/AdminSidebar.module.css';

const Sidebar = ({ selectedPage, onPageChange, isSidebarOpen, toggleSidebar }) => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 750 && isSidebarOpen) {
        toggleSidebar();
      } else if (window.innerWidth > 750 && !isSidebarOpen) {
        toggleSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen, toggleSidebar]);

  const menuItems = [
    'dashboard',
    'analytics',
    'stations',
    'rescues',
    'deployments',
    'tasks',
    'live alerts',
    'reports',
    'users',
    'settings'
  ];

  return (
    <div className={`${styles.sidebar} ${!isSidebarOpen ? styles.sidebarClosed : styles.open}`}>
      <div className={styles.navList}>
        {menuItems.map((page) => (
          <div
            key={page}
            className={`${styles.navItem} ${selectedPage === page ? styles.selected : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
