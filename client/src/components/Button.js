// src/components/Button.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const Button = ({ children, to }) => {
  return (
    <Link to={to}>
      <button className="w-full px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition duration-150 ease-in-out text-center">
        {children}
      </button>
    </Link>
  );
};

export default Button;
