import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/Button'; // Import the Button component
import SwapButton from '../components/SwapButton';

const SwapExactOutput = () => {
  const [amountOut, setAmountOut] = useState('');
  const [amountInMax, setAmountInMax] = useState('');
  const [response, setResponse] = useState({});

  const handleSwapExactOutput = async () => {
    try {
      const requestBody = {
        amountOut,
        amountInMax
      };

      const response = await axios.post('http://localhost:3000/api/v1/swap-exact-output', requestBody);
      setResponse(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#240750] text-white">
      <h2 className="mb-6 text-2xl font-bold">Swap exact output data</h2>
      <label className="mb-4">
        Amount Out:
        <input type="text" value={amountOut} onChange={(e) => setAmountOut(e.target.value)} 
        className="block w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </label>
      <label className="mb-4">
        Amount In Max:
        <input type="text" value={amountInMax} onChange={(e) => setAmountInMax(e.target.value)}
        className="block w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </label>
      <SwapButton onClick={handleSwapExactOutput}>Swap Exact Output</SwapButton>
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
          DAI balance after transaction:
          {response.balance}
        </p>
       </div> 
    </div>
  );
};

export default SwapExactOutput;
