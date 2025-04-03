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

  return (
    <div className={`${styles.sidebar} ${!isSidebarOpen ? styles.sidebarClosed : styles.open}`}>
      <div className={styles.navList}>
        {['analytics', 'stations', 'rescues', 'users'].map((page) => (
          <div
            key={page}
            className={`${styles.navItem} ${selectedPage === page ? styles.selected : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;