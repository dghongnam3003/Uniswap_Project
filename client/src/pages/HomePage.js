// src/pages/HomePage.js
import React from 'react';
import Button from '../components/Button'; // Import the Button component

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-950 text-white">
      <h2 className="mb-6 text-2xl font-bold">Select an API:</h2>
      <div className="flex flex-col gap-4 w-64"> {/* Set a fixed width for buttons container */}
        <Button to="/get-pool-price">Get time-weighted pool price</Button>
        <Button to="/swap-exact-input">Swap exact input</Button>
        <Button to="/swap-exact-output">Swap exact output</Button>
      </div>
    </div>
  );
};

export default HomePage;
