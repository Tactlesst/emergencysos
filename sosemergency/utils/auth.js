import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

// Register new user
export const registerUser = async (userData) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Store authentication token
export const storeAuthToken = (token, remember = false) => {
  const options = {
    path: '/',
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
    ...(remember && { expires: 7 }) // 7 days if "remember me"
  };
  Cookies.set('token', token, options);
};

// Remove authentication token
export const clearAuthToken = () => {
  Cookies.remove('token', { path: '/' });
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!Cookies.get('token');
};

// Get complete decoded token data
export const getCurrentUser = () => {
  const token = Cookies.get('token');
  if (!token) return null;

  try {
    const decoded = jwt.decode(token);
    
    return {
      // Standard claims
      userId: decoded.sub || decoded.userId,
      userType: decoded.userType || decoded.role,
      email: decoded.email,
      phone: decoded.phone,
      
      // JWT metadata
      issuedAt: decoded.iat ? new Date(decoded.iat * 1000) : null,
      expiresAt: decoded.exp ? new Date(decoded.exp * 1000) : null,
      
      // Raw decoded token (for debugging)
      _raw: decoded
    };
  } catch (error) {
    console.error('Token decode error:', error);
    clearAuthToken();
    return null;
  }
};
  

// Logout handler
export const logoutUser = () => {
  clearAuthToken();
  window.location.href = '/';
};

// Role-based redirect helper
export const redirectByRole = (router) => {
  const user = getCurrentUser();
  if (!user) return router.push('/login');

  const routes = {
    super_admin: '/super_admin',
    station: '/station',
    user: '/dashboard'
  };

  const target = routes[user.userType] || '/';
  return router.push(target);
};