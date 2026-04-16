import React, { useState } from 'react';

function Admin() {
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', role: 'Admin' },
    { id: 2, username: 'user', role: 'User' },
  ]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'User' });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = (event) => {
    event.preventDefault();
    if (newUser.username && newUser.password) {
      setUsers((prev) => [
        ...prev,
        { id: prev.length + 1, ...newUser },
      ]);
      setNewUser({ username: '', password: '', role: 'User' }); // Reset form
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin - User Management</h1>

      <div className="add-user-form">
        <h2>Add New User</h2>
        <form onSubmit={handleAddUser}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={newUser.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={newUser.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="primary-button">Add User</button>
        </form>
      </div>

      <div className="user-list">
        <h2>Existing Users</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
