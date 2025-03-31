import { useState } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import styles from '../styles/Auth.module.css';
import { authenticateUser, storeAuthToken, redirectByRole } from '../utils/auth';

export default function Login({ switchToRegister, closeAuth }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      const { token, userType } = await authenticateUser(formData.phone, formData.password);
      storeAuthToken(token, rememberMe);
      await Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Redirecting to your dashboard...',
        timer: 1500,
        showConfirmButton: false
      });
      redirectByRole(router, userType);
      closeAuth();
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
