import { useState, useEffect } from 'react';
import Modal from '../superadmin/Modal'; // import Modal component
import axios from 'axios'; // Assuming you're using axios for API requests

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    dob: '',
  });

  useEffect(() => {
    // Fetch users
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        password: user.password,
        dob: user.dob,
      });
    } else {
      setEditingUser(null);
      setUserForm({
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        dob: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setUserForm({
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      dob: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingUser) {
      // Update existing user
      try {
        await axios.put(`/api/users/${editingUser.id}`, userForm);
        setUsers(users.map((user) => (user.id === editingUser.id ? userForm : user)));
        closeModal();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      // Add new user
      try {
        const response = await axios.post('/api/users', userForm);
        setUsers([...users, response.data]);
        closeModal();
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
  };

  const handleChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="bg-white shadow rounded-lg p-4 h-full">
          <h2 className="text-xl font-semibold mb-4">Manage Users</h2>

          {/* User List */}
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm"
              >
                <div>
                  <h3>{user.firstName} {user.lastName}</h3>
                  <p>{user.phone}</p>
                  <p>{user.dob}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(user)}
                    className="px-4 py-2 text-sm text-blue-600 bg-blue-100 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-4 py-2 text-sm text-red-600 bg-red-100 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => openModal()}
            className="mt-4 text-white bg-green-500 px-6 py-2 rounded-lg"
          >
            Add User
          </button>
        </div>
      </main>

      {/* Modal for Add/Edit User */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <h3 className="text-xl font-semibold mb-4 text-center">
            {editingUser ? 'Edit User' : 'Add User'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={userForm.firstName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={userForm.lastName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={userForm.phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={userForm.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={userForm.dob}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="flex justify-center space-x-4 mt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-white bg-gray-500 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 rounded-md"
              >
                {editingUser ? 'Update User' : 'Add User'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
