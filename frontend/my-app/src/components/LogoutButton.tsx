import React from 'react';
import axios from 'axios';

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.post('http://localhost:8000/api/v1/logout/', null, {
          headers: { Authorization: `Token ${token}` }
        });
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to the login page
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;