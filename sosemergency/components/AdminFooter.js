import styles from '../styles/Admin.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Super Admin Dashboard. All rights reserved.</p>
    </footer>
  );
}
