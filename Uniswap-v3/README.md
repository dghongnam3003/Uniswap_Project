# Prepare
- npm install
- Edit .env file with ALCHEMY_URL=<....>. If choose a mainnet ALCHEMY_URL, change the address of the pool to mainnet Uniswap v3 pool.
# Multihop & Singlehop testing
- Edit node_modules\@uniswap\v3-core\contracts\libraries\TickMath.sol so that it uses solidity >= 0.5.0.
- To test multihop and singlehop: npx harhat test ./test/swapV3.test.js -> This should works fine but deploying on server is causing problem of 0 balance after swapped.
# Deploy forked mainnet 
- npx hardhat node
# Deploy contracts
- npx hardhat run .\scripts\getPoolPrice.js --network localhost 
- npx hardhat run .\scripts\multihopSwap.js --network localhost 
Change the addresses of deployed contracts in .env file.
# Deploy the backend server
- node .\server.js
