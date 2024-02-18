import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get('http://localhost:8000/api/v1/current-user/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        setUsername(response.data.username); 
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data', error);
        setError('Error fetching user data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-10">Welcome, {username}!</h1>

    </div>
  );
};

export default ProfilePage;
