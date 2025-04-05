import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

const TOKEN_KEY = 'token';
const TOKEN_EXPIRY_MINUTES = 10;

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

// Store authentication token with rememberMe option
export const storeAuthToken = (token, remember = false) => {
  const now = new Date();
  const expires = new Date(now.getTime() + TOKEN_EXPIRY_MINUTES * 60 * 1000); // 10 min expiry

  const options = {
    path: '/',
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
    expires: remember ? 7 : expires // 7 days if "remember me", else 10 mins
  };

  Cookies.set(TOKEN_KEY, token, options);
  Cookies.set(`${TOKEN_KEY}_issuedAt`, now.toISOString(), options); // track timestamp
};

// Clear authentication token
export const clearAuthToken = () => {
  Cookies.remove(TOKEN_KEY, { path: '/' });
  Cookies.remove(`${TOKEN_KEY}_issuedAt`, { path: '/' });
};

// Check if token is still valid based on time
export const isAuthenticated = () => {
  const token = Cookies.get(TOKEN_KEY);
  const issuedAt = Cookies.get(`${TOKEN_KEY}_issuedAt`);

  if (!token || !issuedAt) return false;

  const issuedTime = new Date(issuedAt).getTime();
  const now = new Date().getTime();
  const elapsedMinutes = (now - issuedTime) / (1000 * 60);

  if (elapsedMinutes > TOKEN_EXPIRY_MINUTES) {
    clearAuthToken();
    return false;
  }

  return true;
};

// Decode and get current user
export const getCurrentUser = () => {
  const token = Cookies.get(TOKEN_KEY);
  if (!token) return null;

  try {
    const decoded = jwt.decode(token);

    return {
      userId: decoded.sub || decoded.userId,
      userType: decoded.userType || decoded.role,
      email: decoded.email,
      phone: decoded.phone,
      issuedAt: decoded.iat ? new Date(decoded.iat * 1000) : null,
      expiresAt: decoded.exp ? new Date(decoded.exp * 1000) : null,
      _raw: decoded
    };
  } catch (error) {
    console.error('Token decode error:', error);
    clearAuthToken();
    return null;
  }
};

// Logout user and redirect
export const logoutUser = () => {
  clearAuthToken();
  window.location.href = '/';
};

// Redirect by user role
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
