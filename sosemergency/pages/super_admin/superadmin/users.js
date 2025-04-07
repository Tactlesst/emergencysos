import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Users</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        {[
          { label: 'First Name*', name: 'firstName', type: 'text' },
          { label: 'Last Name*', name: 'lastName', type: 'text' },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block font-medium mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={editingUser?.[name] || newUser[name]}
              onChange={handleInputChange}
              className={`w-full border rounded px-3 py-2 ${
                errors[name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
          </div>
        ))}

        <div>
          <label className="block font-medium mb-1">Phone*</label>
          <div className="flex items-center">
            <span className="px-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l">+63</span>
            <input
              type="tel"
              name="phone"
              maxLength="11"
              placeholder="9171234567"
              value={editingUser?.phone || newUser.phone}
              onChange={handleInputChange}
              className={`w-full border px-3 py-2 rounded-r ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">
            Password{editingUser ? ' (leave blank to keep current)' : '*'}
          </label>
          <input
            type="password"
            name="password"
            value={editingUser ? editingUser.password || '' : newUser.password}
            onChange={handleInputChange}
            className={`w-full border px-3 py-2 rounded ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={(editingUser?.dob || newUser.dob) ? new Date(editingUser?.dob || newUser.dob).toISOString().split('T')[0] : ''}
            onChange={handleInputChange}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full border px-3 py-2 rounded ${
              errors.dob ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">User Type</label>
          <select
            name="userType"
            value={editingUser?.userType || newUser.userType}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded border-gray-300"
          >
            <option value="user">User</option>
            <option value="station">Station</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : editingUser ? 'Update User' : 'Add User'}
          </button>
          {editingUser && (
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mt-10 mb-4">User List</h3>

      {isLoading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : users.length === 0 ? (
        <p className="text-gray-600">No users found</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="flex items-center justify-between border p-3 rounded bg-white shadow-sm">
              <span>{user.firstName} {user.lastName}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleDisableUser(user.id, user.disabled)}
                  className="px-3 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600"
                >
                  {user.disabled ? 'Enable' : 'Disable'}
                </button>
                <button
                  onClick={() => setEditingUser(user)}
                  className="px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700"
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
