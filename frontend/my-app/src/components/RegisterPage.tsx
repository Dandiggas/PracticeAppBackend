import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password1: '',
    password2: '',
    name: '',  // Corresponding to the custom field in your Django form
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Make an API call to your Django backend to register the user
    try {
      const response = await axios.post('http://localhost:8000/dj-rest-auth/registration', formData);
      console.log(response.data);
      // Handle success (redirect to login page or display success message)
    } catch (error) {
      console.error('Registration error', error);
      // Handle errors (display error messages)
    }
  };

  return (
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
        name="password1"
        value={formData.password1}
        onChange={handleChange}
        placeholder="Password"
      />
      <input
        type="password"
        name="password2"
        value={formData.password2}
        onChange={handleChange}
        placeholder="Confirm Password"
      />
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
