// pages/user/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated, getCurrentUser, logoutUser } from '../../utils/auth';

export default function UserDashboard() {
  const router = useRouter();

  useEffect(() => {


    const user = getCurrentUser();
    if (user?.userType !== 'user') {
      logoutUser();
      router.push('/');
    }
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>
      <button onClick={logoutUser}>Logout</button>
    </div>
  );
}