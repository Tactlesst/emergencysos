import styles from '../styles/AdminHeader.module.css';

const Header = ({ user, onLogout, onHamburgerClick }) => {
  return (
    <header className={styles.header}>
      <button className={styles.hamburgerButton} onClick={onHamburgerClick}>
        ☰ {/* Hamburger icon */}
      </button>

      <div className={styles.headerRight}>
        <span>Welcome, {user.firstName}</span>
        <button onClick={onLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
