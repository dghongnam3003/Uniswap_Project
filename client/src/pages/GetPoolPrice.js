import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GetPoolPrice = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/get-pool-price');
        setData(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#240750] text-white">
      <h2 className="mb-6 text-2xl font-bold">Pool price data</h2>
      <p className="mb-4">
        Price:{" "}
        <span className="text-cyan-500 font-bold">{data.price}</span>
      </p>
      <p className="mb-4">
        Decimal Adjustment Factor:{" "}
        <span className="text-cyan-500 font-bold">{data.decimalAdjFactor}</span>
      </p>
    </div>
  );
};

export default GetPoolPrice;
