import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button'; // Import the Button component
import SwapButton from '../components/SwapButton';

const SwapExactInput = () => {
  const [amountIn, setAmountIn] = useState('');
  const [amountOutMin, setAmountOutMin] = useState('');
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSwapExactInput = async () => {
    try {
      setLoading(true); // Set loading state to true
      const requestBody = {
        amountIn,
        amountOutMin,
      };

      const response = await axios.post('http://localhost:3000/api/v1/swap-exact-input', requestBody);
      setResponse(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#240750] text-white">
      <h2 className="mb-6 text-2xl font-bold">Swap exact input data</h2>
      <label className="mb-4">
        Amount In:
        <input
          type="text"
          value={amountIn}
          onChange={(e) => setAmountIn(e.target.value)}
          className="block w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </label>
      <label className="mb-4">
        Amount Out Min:
        <input
          type="text"
          value={amountOutMin}
          onChange={(e) => setAmountOutMin(e.target.value)}
          className="block w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </label>
      <SwapButton onClick={handleSwapExactInput}>Swap Exact Input</SwapButton>
      {loading && <p>Loading...</p>} {/* Render loading indicator if loading state is true */}
      <div className="mt-6 w-full text-center px-4 py-2 text-white rounded-md">
        <p>
          Transaction success:{" "}
          {response.success !== undefined ? (
            <span className={`text-${response.success ? 'green' : 'red'}-500 font-bold`}>
              {response.success ? 'Yes' : 'No'}
            </span>
          ) : null}
        </p>
        <p>
          DAI balance after transaction:{" "}
          {response.balance !== undefined ? (
            <span className="text-cyan-500 font-bold">
              {response.balance}
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
};

export default SwapExactInput;
