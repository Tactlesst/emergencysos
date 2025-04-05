import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import styles from '../../../styles/Admin.module.css';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    dob: '',
    userType: 'user'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const validateForm = (userData, isEditing = false) => {
    const newErrors = {};
    const currentDate = new Date();
    const minAgeDate = new Date(currentDate.getFullYear() - 13, currentDate.getMonth(), currentDate.getDate());

    if (!userData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (userData.firstName.length < 2) {
      newErrors.firstName = 'Minimum 2 characters';
    } else if (!/^[a-zA-Z\s-]+$/.test(userData.firstName)) {
      newErrors.firstName = 'Only letters, spaces, and hyphens allowed';
    }

    if (!userData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (userData.lastName.length < 2) {
      newErrors.lastName = 'Minimum 2 characters';
    } else if (!/^[a-zA-Z\s-]+$/.test(userData.lastName)) {
      newErrors.lastName = 'Only letters, spaces, and hyphens allowed';
    }

    if (!userData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{11}$/.test(userData.phone)) {
      newErrors.phone = 'Must be 11 digits (e.g., 9171234567)';
    }

    if (!isEditing && !userData.password) {
      newErrors.password = 'Password is required';
    } else if (!isEditing && userData.password.length < 8) {
      newErrors.password = 'Minimum 8 characters';
    } else if (isEditing && userData.password && userData.password.length < 8) {
      newErrors.password = 'Minimum 8 characters if changing password';
    }

    if (userData.dob) {
      const dobDate = new Date(userData.dob);
      if (dobDate > minAgeDate) {
        newErrors.dob = 'User must be at least 13 years old';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Swal.fire('Error', 'Failed to load users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewUser((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = editingUser || newUser;

    if (!validateForm(userData, !!editingUser)) return;

    setIsLoading(true);
    const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
    const method = editingUser ? 'PUT' : 'POST';

    const payload = { ...userData };
    if (editingUser && !userData.password) {
      delete payload.password;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save user');
      }

      await fetchUsers();
      Swal.fire('Success', `User ${editingUser ? 'updated' : 'added'} successfully`, 'success');
      setEditingUser(null);
      setNewUser({ firstName: '', lastName: '', phone: '', password: '', dob: '', userType: 'user' });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', error.message || 'Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableUser = async (id, currentDisabled) => {
    const newStatus = currentDisabled ? 0 : 1;
    const confirmationText = newStatus ? 'This user will be disabled!' : 'This user will be enabled!';

    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: confirmationText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: newStatus ? 'Yes, disable!' : 'Yes, enable!',
    });

    if (!isConfirmed) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disabled: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update user status');

      await fetchUsers();
      Swal.fire('Success!', `User has been ${newStatus ? 'disabled' : 'enabled'}.`, 'success');
    } catch (error) {
      Swal.fire('Error', error.message || 'Failed to update user status', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.manageUsersContainer}>
      <h2 className={styles.pageTitle}>Manage Users</h2>

      <form onSubmit={handleSubmit} className={styles.userForm}>
        <div className={`${styles.formGroup} ${errors.firstName ? styles.error : ''}`}>
          <label className={styles.label}>First Name*</label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={editingUser?.firstName || newUser.firstName}
            onChange={handleInputChange}
            className={styles.input}
          />
          {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
        </div>

        <div className={`${styles.formGroup} ${errors.lastName ? styles.error : ''}`}>
          <label className={styles.label}>Last Name*</label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={editingUser?.lastName || newUser.lastName}
            onChange={handleInputChange}
            className={styles.input}
          />
          {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
        </div>

        <div className={`${styles.formGroup} ${errors.phone ? styles.error : ''}`}>
          <label className={styles.label}>Phone*</label>
          <div className={styles.phoneInput}>
            <span className={styles.phonePrefix}>+63</span>
            <input
              type="tel"
              name="phone"
              placeholder="9171234567"
              value={editingUser?.phone || newUser.phone}
              onChange={handleInputChange}
              maxLength="11"
              className={styles.input}
            />
          </div>
          {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
        </div>

        <div className={`${styles.formGroup} ${errors.password ? styles.error : ''}`}>
          <label className={styles.label}>
            Password{editingUser ? ' (leave blank to keep current)' : '*'}
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={editingUser ? editingUser.password || '' : newUser.password}
            onChange={handleInputChange}
            className={styles.input}
          />
          {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
        </div>

        <div className={`${styles.formGroup} ${errors.dob ? styles.error : ''}`}>
          <label className={styles.label}>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={(editingUser?.dob || newUser.dob) ? new Date(editingUser?.dob || newUser.dob).toISOString().split('T')[0] : ''}
            onChange={handleInputChange}
            max={new Date().toISOString().split('T')[0]}
            className={styles.input}
          />
          {errors.dob && <span className={styles.errorMessage}>{errors.dob}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>User Type</label>
          <select
            name="userType"
            value={editingUser?.userType || newUser.userType}
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="user">User</option>
            <option value="station">Station</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Processing...' : editingUser ? 'Update User' : 'Add User'}
          </button>
          {editingUser && (
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setEditingUser(null)}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className={styles.userListTitle}>User List</h3>
      {isLoading ? (
        <div className={styles.loadingSpinner}></div>
      ) : users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul className={styles.userList}>
          {users.map((user) => (
            <li key={user.id} className={styles.userItem}>
              <span>{user.firstName} {user.lastName}</span>
              <button
                onClick={() => handleDisableUser(user.id, user.disabled)}
                className={styles.toggleDisableBtn}
              >
                {user.disabled ? 'Enable' : 'Disable'}
              </button>
              <button
                onClick={() => setEditingUser(user)}
                className={styles.editBtn}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
