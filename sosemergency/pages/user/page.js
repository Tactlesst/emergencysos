import { redirect } from 'next/navigation';
import { isAuthenticated, getCurrentUser, clearAuthToken } from '@/util/auth';

export default function UserDashboard() {
  // Server-side check (runs on load)
  if (!isAuthenticated()) {
    redirect('/login');
  }

  const user = getCurrentUser();
  if (user?.userType !== 'user') { // Replace 'user' with expected role
    clearAuthToken();
    redirect('/login');
  }

  return (
    <div>
      <h1>User Dashboard</h1>
    </div>
  );
}