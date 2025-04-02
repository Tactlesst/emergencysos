import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser, isAuthenticated, logoutUser } from '@/utils/auth';
import UserLayout from '@/components/UserLayout';

export default function UserDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const userData = getCurrentUser();
      if (!userData || userData.userType !== 'user') {
        router.replace('/');
      } else {
        setUser(userData);
      }
    }, []);
  
    const handleLogout = () => {
      logoutUser();
      router.replace('/');
    };
  
    if (!user) return <p>Loading...</p>;
  
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Welcome, {user.firstName}!</h1>
        <p>Phone: {user.phone}</p>
        <button 
          onClick={handleLogout} 
          style={{
            padding: '10px 20px',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Logout
        </button>
      </div>
    );
  }