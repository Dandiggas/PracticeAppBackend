import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

interface FormErrors {
  username?: string;
  email?: string;
  password1?: string;
  password2?: string;
}

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });
  const [redirect, setRedirect] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = () => {
    let tempErrors: FormErrors = {};
    tempErrors.username = formData.username ? "" : "Username is required.";
    tempErrors.email = formData.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i) ? "" : "Email is not valid.";
    tempErrors.password1 = formData.password1.length > 5 ? "" : "Password must be at least 6 characters.";
    tempErrors.password2 = formData.password1 === formData.password2 ? "" : "Passwords do not match.";
    
    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === "");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post('http://localhost:8000/api/v1/dj-rest-auth/registration/', formData);
        console.log(response.data);
        setRedirect(true);
      } catch (error) {
        console.error('Registration error', error);
      }
    }
  }

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <div style={{ color: 'red' }}>{errors.username}</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <div style={{ color: 'red' }}>{errors.email}</div>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <div style={{ color: 'red' }}>{errors.password1}</div>
        <input
          type="password"
          name="password1"
          value={formData.password1}
          onChange={handleChange}
          placeholder="Password"
        />
        <div style={{ color: 'red' }}>{errors.password2}</div>
        <input
          type="password"
          name="password2"
          value={formData.password2}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
