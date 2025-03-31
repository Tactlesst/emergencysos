import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';

export const getUserData = async () => {
  const token = Cookies.get('token'); // Get the token from cookies
  if (!token) {
    console.error('No authentication token found');
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch('/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Attach token in header
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    return await response.json(); // Should return { firstName, phone, dob, userType }
  } catch (error) {
    console.error('User data fetch error:', error.message);
    clearAuthToken(); // Remove token if invalid
    throw error;
  }
};

  
  // ✅ Logout User
  export const logoutUser = () => {
    clearAuthToken();
    window.location.href = '/'; // Redirect to home after logout
  };
  
// ✅ Authenticate User and Return Token & Role
export const authenticateUser = async (phone, password) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Authentication failed');
    }

    const data = await response.json();
    return data; // { token, userType }
  } catch (error) {
    console.error('Authentication error:', error.message);
    throw error;
  }
};

// ✅ Register User
export const registerUser = async (userData) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Registration error:', error.message);
    throw error;
  }
};

// ✅ Store Token in Cookies
export const storeAuthToken = (token, rememberMe = false) => {
  const options = { path: '/', sameSite: 'Lax' };
  if (rememberMe) options.expires = 7; // Persist for 7 days if rememberMe is checked

  Cookies.set('token', token, options);
};

// ✅ Remove Token from Cookies
export const clearAuthToken = () => {
  Cookies.remove('token', { path: '/' });
};

// ✅ Redirect Based on User Role
export const redirectByRole = (router, userType) => {
    const routes = {
      super_admin: '/super_admin',
      station: '/station',
      user: '/user', // Make sure this exists in Next.js pages
    };
  
    router.push(routes[userType] || '/');
  };
  

// ✅ Check If User is Authenticated
export const isAuthenticated = () => {
  const token = Cookies.get('token');
  if (!token) return false;

  try {
    const decoded = jwt.decode(token);
    return decoded ? true : false;
  } catch (error) {
    console.error('Token decoding error:', error.message);
    clearAuthToken();
    return false;
  }
};

// ✅ Get Current User Details from Token
export const getCurrentUser = () => {
  const token = Cookies.get('token');
  if (!token) return null;

  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('Token decoding error:', error.message);
    return null;
  }
};
