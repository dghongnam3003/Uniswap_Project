require('dotenv').config();
const express = require('express');
const { ethers } = require('hardhat');
const { BigNumber } = require('ethers');
const { Web3 } = require('web3');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
	origin: 'http://localhost:3001'
}));

var web3 = new Web3(Web3.givenProvider || "http://localhost:8545");


const WETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
const USDC = "0x2B0974b96511a728CA6342597471366D3444Aa2a";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

// Load your contracts
let dai, weth, semiStableSwap, accounts;


async function loadContracts() {
	accounts = await ethers.getSigners();
	dai = await ethers.getContractAt("contracts/interfaces/IERC20.sol:IERC20", DAI);
	weth = await ethers.getContractAt("IWETH", WETH);

	// Use the existing contract address
	const existingContractAddress = process.env.SEMI_CONTRACT_ADDRESS;
	semiStableSwap = await ethers.getContractAt("SemiStableSwap", existingContractAddress);
}

app.post('/api/v1/semi-stable-swap', async (req, res) => {
	try {
	  await loadContracts();
  
	  const amountIn = BigNumber.from(req.body.amountIn);
	  const amountOutMinimum = BigNumber.from(req.body.amountOutMinimum);
  
	  // Approve the SemiStableSwap contract to spend the input token
	  const tokenInContract = new ethers.Contract(WETH, ["function approve(address spender, uint256 amount) external returns (bool)"], accounts[0]);
	  await tokenInContract.approve(semiStableSwap.address, amountIn);
  
	  // Execute the semi-stable swap
	  const tx = await semiStableSwap.semiStableSwap(
		amountIn,
		amountOutMinimum,
		WETH,
		USDC,
		3000 // poolFee
	  );
	  await tx.wait();
  
	  res.json({
		success: true,
		transactionHash: tx.hash
	  });
	} catch (error) {
	  console.error('Error:', error);
	  res.json({
		success: false,
		error: error.message
	  });
	  console.log(error);
	}
});

app.listen(3002, () => console.log('Server is running on port 3002'));