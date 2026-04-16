import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    // Here you would typically send a request to your backend for authentication
    console.log('Attempting to log in with:', { username, password });

    // For demonstration purposes, let's simulate a successful login
    // and redirect based on username (e.g., 'admin' goes to admin page)
    if (username === 'admin' && password === 'admin123') {
      navigate('/admin');
    } else if (username === 'user' && password === 'user123') {
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h1>Login Page</h1>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="primary-button">Login</button>
      </form>
    </div>
  );
}

export default Login;
