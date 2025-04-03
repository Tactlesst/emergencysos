import { useState } from 'react';
import Swal from 'sweetalert2';
import styles from '../styles/Auth.module.css';
import { registerUser } from '../utils/auth';

export default function Register({ switchToLogin, closeAuth }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dob: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field) => (e) => {
    let value = e.target.value;
    if (field === 'phone') {
      value = value.replace(/\D/g, '').slice(0, 11);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const validateField = (field, value) => {
    const newErrors = { ...formErrors };

    switch (field) {
      case 'firstName':
        if (!value.trim()) newErrors.firstName = 'First name is required';
        else if (value.length < 2) newErrors.firstName = 'Name too short';
        else delete newErrors.firstName;
        break;

      case 'lastName':
        if (!value.trim()) newErrors.lastName = 'Last name is required';
        else delete newErrors.lastName;
        break;

      case 'phone':
        if (!value) newErrors.phone = 'Phone number is required';
        else if (value.length !== 11) newErrors.phone = 'Phone must be 11 digits';
        else delete newErrors.phone;
        break;

      case 'password':
        if (!value) newErrors.password = 'Password is required';
        else if (value.length < 8) newErrors.password = 'Minimum 8 characters';
        else if (value !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.password;
          if (formData.confirmPassword) delete newErrors.confirmPassword;
        }
        break;

      case 'confirmPassword':
        if (!value) newErrors.confirmPassword = 'Please confirm password';
        else if (value !== formData.password) newErrors.confirmPassword = 'Passwords do not match';
        else delete newErrors.confirmPassword;
        break;

      case 'dob':
        if (!value) newErrors.dob = 'Date of birth is required';
        else {
          const dobDate = new Date(value);
          const today = new Date();
          const minAgeDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());

          if (dobDate > minAgeDate) newErrors.dob = 'You must be at least 13 years old';
          else delete newErrors.dob;
        }
        break;
    }

    setFormErrors(newErrors);
  };

  const validateForm = () => {
    const errors = {};
    const { firstName, lastName, phone, password, confirmPassword, dob } = formData;

    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!phone) errors.phone = 'Phone number is required';
    else if (phone.length !== 11) errors.phone = 'Phone must be 11 digits';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 8) errors.password = 'Minimum 8 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!dob) errors.dob = 'Date of birth is required';
    if (!agreeTerms) errors.terms = 'You must agree to the terms';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await registerUser({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone,
        password: formData.password,
        dob: formData.dob
      });

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Registration complete. You can now login.',
        timer: 2000,
        showConfirmButton: false
      });

      switchToLogin();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.message.includes('phone') 
          ? 'Phone number already registered' 
          : error.message || 'Registration error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2>Create an account</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.nameGroup}>
          <div className={`${styles.inputGroup} ${styles.halfWidth} ${formErrors.firstName ? styles.error : ''}`}>
            <label>First Name*</label>
            <input
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              onBlur={() => validateField('firstName', formData.firstName)}
              required
              minLength="2"
            />
            {formErrors.firstName && <span className={styles.errorMessage}>{formErrors.firstName}</span>}
          </div>

          <div className={`${styles.inputGroup} ${styles.halfWidth} ${formErrors.lastName ? styles.error : ''}`}>
            <label>Last Name*</label>
            <input
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              onBlur={() => validateField('lastName', formData.lastName)}
              required
            />
            {formErrors.lastName && <span className={styles.errorMessage}>{formErrors.lastName}</span>}
          </div>
        </div>

        <div className={`${styles.inputGroup} ${formErrors.phone ? styles.error : ''}`}>
          <label>Mobile Number*</label>
          <div className={styles.phoneInput}>
            <span>+63</span>
            <input
              type="tel"
              placeholder="9171234567"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              onBlur={() => validateField('phone', formData.phone)}
              required
              pattern="[0-9]{11}"
              inputMode="numeric"
            />
          </div>
          {formErrors.phone && (
            <span className={styles.errorMessage}>
              {formErrors.phone}
              <div className={styles.phoneExample}>(Example: 9171234567)</div>
            </span>
          )}
        </div>

        <div className={`${styles.inputGroup} ${formErrors.password ? styles.error : ''}`}>
          <label>Password* (min 8 characters)</label>
          <input
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleInputChange('password')}
            onBlur={() => validateField('password', formData.password)}
            required
            minLength="8"
          />
          {formErrors.password && <span className={styles.errorMessage}>{formErrors.password}</span>}
        </div>

        <div className={`${styles.inputGroup} ${formErrors.confirmPassword ? styles.error : ''}`}>
          <label>Confirm Password*</label>
          <input
            type="password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            onBlur={() => validateField('confirmPassword', formData.confirmPassword)}
            required
          />
          {formErrors.confirmPassword && <span className={styles.errorMessage}>{formErrors.confirmPassword}</span>}
        </div>

        <div className={`${styles.inputGroup} ${formErrors.dob ? styles.error : ''}`}>
          <label>Date of Birth*</label>
          <input
            type="date"
            value={formData.dob}
            onChange={handleInputChange('dob')}
            onBlur={() => validateField('dob', formData.dob)}
            required
            max={new Date().toISOString().split('T')[0]}
          />
          {formErrors.dob && <span className={styles.errorMessage}>{formErrors.dob}</span>}
        </div>

        <div className={`${styles.terms} ${formErrors.terms ? styles.error : ''}`}>
          <input
            type="checkbox"
            id="termsCheckbox"
            checked={agreeTerms}
            onChange={(e) => {
              setAgreeTerms(e.target.checked);
              if (formErrors.terms && e.target.checked) {
                setFormErrors(prev => ({ ...prev, terms: undefined }));
              }
            }}
          />
          <label htmlFor="termsCheckbox">
            I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>*
          </label>
          {formErrors.terms && <span className={styles.errorMessage}>{formErrors.terms}</span>}
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading || Object.keys(formErrors).length > 0}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span> Registering...
            </>
          ) : 'Create Account'}
        </button>
      </form>

      <p className={styles.switchForm}>
        Already have an account?{' '}
        <button 
          type="button" 
          onClick={switchToLogin}
          disabled={isLoading}
        >
          Login
        </button>
      </p>
    </>
  );
}
