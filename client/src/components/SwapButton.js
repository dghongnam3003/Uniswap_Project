// src/components/Button.js
import React from 'react';

const SwapButton = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className="w-full px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition duration-150 ease-in-out text-center">
      {children}
    </button>
  );
};

export default SwapButton;
