import styles from '../styles/AdminSidebar.module.css';

const Sidebar = ({ selectedPage, onPageChange, isSidebarOpen, toggleSidebar }) => {
  return (
    <div className={`${styles.sidebar} ${!isSidebarOpen ? styles.sidebarClosed : styles.open}`}>
      {/* Button only visible on mobile */}

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
