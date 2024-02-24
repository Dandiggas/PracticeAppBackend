import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/dj-rest-auth/login/', formData);
      localStorage.setItem('token', response.data.key); // Save token
      
      // Assuming the user ID is in the response data, adjust according to your API
      localStorage.setItem('userId', response.data.user); // Save user ID
      console.log(response.data)

      setRedirect(true);
    } catch (error) {
      console.error('Login error', error);
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to="/profilepage" />;
  }

  return (
    <div className="login-container">
      <div style={{ color: 'red' }}>{error}</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
