import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-5xl font-bold text-center my-10">Welcome to the Musician's Practice App</h1>
      <div className="flex justify-center items-center">
        <Link to="/register" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2">
          Sign Up
        </Link>
        <Link to="/login" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-2">
          Login
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
