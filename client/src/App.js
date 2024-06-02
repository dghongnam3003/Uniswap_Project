import './App.css';
import MetaMask from './components/MetaMask.js';
// import EventsFeed from './components/EventsFeed.js';
import { MetaMaskProvider } from './contexts/MetaMask';
// import handleSubmit from'./components/semiStable.js'
import SemiStableInput from './pages/SwapSemiStable.js';


const App = () => {
  return (
    <MetaMaskProvider>
      <div className="App flex flex-col justify-between items-center w-full h-full">
        <MetaMask />
        <SemiStableInput/>
      </div>
    </MetaMaskProvider>
  );
}

export default App;
