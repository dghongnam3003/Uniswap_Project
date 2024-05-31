import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GetPoolPrice from './pages/GetPoolPrice';
import SwapExactInput from './pages/SwapExactInput';
import SwapExactOutput from './pages/SwapExactOutput';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/get-pool-price" element={<GetPoolPrice />} />
        <Route path="/swap-exact-input" element={<SwapExactInput />} />
        <Route path="/swap-exact-output" element={<SwapExactOutput />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;