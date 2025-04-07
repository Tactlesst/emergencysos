import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import styles from '../styles/Auth.module.css';
import {
  authenticateUser,
  storeAuthToken,
  getCurrentUser,
  isAuthenticated
} from '../utils/auth';

export default function Login({ switchToRegister, closeAuth }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Redirect user based on role
  const redirectByRole = async (userType) => {
    const routes = {
      super_admin: '/super_admin',
      station: '/station',
      user: '/user'
    };

    const targetRoute = routes[userType] || '/auth';
    
    try {
      await router.replace(targetRoute);
    } catch (error) {
      console.error('Redirection failed:', error);
      window.location.href = '/auth';
    }
  };

  // ✅ Auto login effect
  useEffect(() => {
    const autoLogin = async () => {
      if (isAuthenticated()) {
        const user = getCurrentUser();
        if (user && user.userType) {
          await redirectByRole(user.userType);
          if (closeAuth) closeAuth();
        }
      }
    };

    autoLogin();
  }, []);

  const handleInputChange = (field) => (e) => {
    let value = e.target.value;
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 11);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.phone) errors.phone = 'Phone number is required';
    else if (formData.phone.length !== 11) errors.phone = 'Phone must be 11 digits';
    if (!formData.password) errors.password = 'Password is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // 1. Authenticate
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const { token, userType, disabled } = await response.json();

      if (disabled === 1) {
        throw new Error('Your account has been deactivated. Please contact support.');
      }

      // 2. Store token
      storeAuthToken(token, rememberMe);

      // 3. Show success
      await Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Redirecting to your dashboard...',
        timer: 1500,
        showConfirmButton: false
      });

      // 4. Redirect
      await redirectByRole(userType);
      if (closeAuth) closeAuth();

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message || 'Invalid credentials. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2>Sign in to your account</h2>
      <form onSubmit={handleSubmit} noValidate>

        <div className={`${styles.inputGroup} ${formErrors.phone ? styles.error : ''}`}>
          <label>Phone</label>
          <div className={styles.phoneInput}>
            <span>+63</span>
            <input
              type="tel"
              placeholder="9171234567"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              required
              pattern="[0-9]{11}"
              inputMode="numeric"
              disabled={isLoading}
            />
          </div>
          {formErrors.phone && <span className={styles.errorMessage}>{formErrors.phone}</span>}
        </div>

        <div className={`${styles.inputGroup} ${formErrors.password ? styles.error : ''}`}>
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange('password')}
            required
            autoComplete="current-password"
            disabled={isLoading}
          />
          {formErrors.password && <span className={styles.errorMessage}>{formErrors.password}</span>}
        </div>

        <div className={styles.rememberMe}>
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
          <label htmlFor="rememberMe">Remember me</label>
        </div>

        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? <><span className={styles.spinner}></span> Logging in...</> : 'Log in'}
        </button>

        <p className={styles.forgotPassword}>
          <button type="button" disabled={isLoading}>Forgot password?</button>
        </p>
      </form>

      <p className={styles.switchForm}>
        Don't have an account?{' '}
        <button type="button" onClick={switchToRegister} disabled={isLoading}>Register</button>
      </p>
    </>
  );
}
