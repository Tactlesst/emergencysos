import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import '../../../styles/ManageUsersPage.css';

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
    const minAgeDate = new Date(
      currentDate.getFullYear() - 13,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    // First Name validation
    if (!userData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (userData.firstName.length < 2) {
      newErrors.firstName = 'Minimum 2 characters';
    } else if (!/^[a-zA-Z\s-]+$/.test(userData.firstName)) {
      newErrors.firstName = 'Only letters, spaces and hyphens allowed';
    }

    // Last Name validation
    if (!userData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (userData.lastName.length < 2) {
      newErrors.lastName = 'Minimum 2 characters';
    } else if (!/^[a-zA-Z\s-]+$/.test(userData.lastName)) {
      newErrors.lastName = 'Only letters, spaces and hyphens allowed';
    }

    // Phone validation
    if (!userData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{11}$/.test(userData.phone)) {
      newErrors.phone = 'Must be 11 digits (e.g., 9171234567)';
    }

    // Password validation (only for new users)
    if (!isEditing && !userData.password) {
      newErrors.password = 'Password is required';
    } else if (!isEditing && userData.password.length < 8) {
      newErrors.password = 'Minimum 8 characters';
    }

    // Date of Birth validation
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
    
    // Clear error when user starts typing
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

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
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
    const newStatus = currentDisabled ? 0 : 1; // Toggle disabled status
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
        body: JSON.stringify({ disabled: newStatus }) // Send only disabled status
      });
  
      if (!response.ok) throw new Error('Failed to update user status');
  
      await fetchUsers(); // Refresh user list
      Swal.fire('Success!', `User has been ${newStatus ? 'disabled' : 'enabled'}.`, 'success');
    } catch (error) {
      Swal.fire('Error', error.message || 'Failed to update user status', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="manage-users-container">
      <h2>Manage Users</h2>
      
      <form onSubmit={handleSubmit} className="user-form">
        <div className={`form-group ${errors.firstName ? 'error' : ''}`}>
          <label>First Name*</label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={editingUser?.firstName || newUser.firstName}
            onChange={handleInputChange}
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>
        
        <div className={`form-group ${errors.lastName ? 'error' : ''}`}>
          <label>Last Name*</label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={editingUser?.lastName || newUser.lastName}
            onChange={handleInputChange}
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>
        
        <div className={`form-group ${errors.phone ? 'error' : ''}`}>
          <label>Phone*</label>
          <div className="phone-input">
            <span>+63</span>
            <input
              type="tel"
              name="phone"
              placeholder="9171234567"
              value={editingUser?.phone || newUser.phone}
              onChange={handleInputChange}
              maxLength="11"
            />
          </div>
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>
        
        {!editingUser && (
          <div className={`form-group ${errors.password ? 'error' : ''}`}>
            <label>Password*</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={newUser.password}
              onChange={handleInputChange}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
        )}
        
        <div className={`form-group ${errors.dob ? 'error' : ''}`}>
          <label>Date of Birth</label>
          <input
  type="date"
  name="dob"
  value={(editingUser?.dob || newUser.dob) ? new Date(editingUser?.dob || newUser.dob).toISOString().split('T')[0] : ''} 
  onChange={handleInputChange}
  max={new Date().toISOString().split('T')[0]}
/>

          {errors.dob && <span className="error-message">{errors.dob}</span>}
        </div>
        
        <div className="form-group">
          <label>User Type</label>
          <select
            name="userType"
            value={editingUser?.userType || newUser.userType}
            onChange={handleInputChange}
          >
            <option value="user">User</option>
            <option value="station">Station</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : editingUser ? 'Update User' : 'Add User'}
          </button>
          
          {editingUser && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setEditingUser(null)}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3>User List</h3>
      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>+63 {user.phone}</td>
                  <td className={`user-type ${user.userType}`}>
                    {user.userType.replace('_', ' ')}
                  </td>
                  <td className="actions">
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="edit-btn"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button 
  onClick={() => handleDisableUser(user.id, user.disabled)}
  className={`disable-btn ${user.disabled ? 'disabled' : ''}`}
  disabled={isLoading}
>
  {user.disabled ? 'Enable' : 'Disable'}
</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}