export default function Footer() {
    return (
      <footer style={{ 
        background: '#333', 
        color: '#fff', 
        textAlign: 'center', 
        padding: '10px', 
        position: 'absolute', 
        bottom: 0, 
        width: '100%' 
      }}>
        <p>&copy; {new Date().getFullYear()} Super Admin Dashboard. All rights reserved.</p>
      </footer>
    );
  }
  