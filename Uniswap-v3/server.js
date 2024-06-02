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
	}
	console.log(req,res);
});

// app.get('/api/v1/get-pool-price', async (req, res) => {
// 	try {
// 		const contractABI = require('../Uniswap-v3/artifacts/contracts/UniswapV3Oracle.sol/UniswapV3Oracle.json').abi;
// 		const contractAddress = process.env.ORACLE_CONTRACT_ADDR;
// 		console.log('Contract ABI:', contractABI);
// 		console.log('Contract Address:', contractAddress);

// 		const contract = new web3.eth.Contract(contractABI, contractAddress);

// 		const result = await contract.methods.getPrice().call();
// 		console.log('Contract call result:', result);

// 		const price = result[0].toString();
// 		const decimalAdjFactor = result[1].toString();

// 		console.log('Price:', price);
// 		console.log('Decimal Adjustment Factor:', decimalAdjFactor);

// 		res.json({
// 			price,
// 			decimalAdjFactor
// 		});
// 	} catch (error) {
// 		console.error('Error:', error);
// 		res.status(500).json({
// 			error: 'Internal server error'
// 		});
// 	}
// });

// app.post('/api/v1/swap-exact-input', async (req, res) => {
// 	try {
// 		await loadContracts();
		
// 		console.log(await dai.balanceOf(accounts[0].address));
// 		console.log(await weth.balanceOf(accounts[0].address));
// 		const amountIn = BigNumber.from(req.body.amountIn);
// 		const amountOutMin = BigNumber.from(req.body.amountOutMin);

// 		// Perform the swap
// 		await weth.deposit({
// 			value: amountIn
// 		});
// 		await weth.approve(uniswapV3MultiHopSwap.address, amountIn);

// 		const tx = await uniswapV3MultiHopSwap.swapExactInputMultiHop(amountIn, amountOutMin);
// 		const txreceipt = await tx.wait();

// 		console.log(await dai.balanceOf(accounts[0].address));
// 		console.log(await weth.balanceOf(accounts[0].address));
// 		console.log(txreceipt)
// 		// Get the balance
// 		const balance = await dai.balanceOf(accounts[0].address);
// 		res.json({
// 			success: true,
// 			balance: balance.toString()
// 		});
// 	} catch (error) {
// 		console.error('Error:', error);
// 		res.json({
// 			success: false,
// 			error: error.message
// 		});
// 	}
// });

// app.post('/api/v1/swap-exact-output', async (req, res) => {
// 	try {
// 		await loadContracts();

// 		console.log(accounts[0].address)

// 		console.log(await dai.balanceOf(accounts[0].address));
// 		console.log(await weth.balanceOf(accounts[0].address));

		
// 		const amountOut = BigNumber.from(req.body.amountOut);
// 		const amountInMax = BigNumber.from(req.body.amountInMax);

// 		// Perform the swap
// 		await weth.deposit({
// 			value: amountInMax
// 		});
// 		await weth.approve(uniswapV3MultiHopSwap.address, amountInMax);
// 		const tx = await uniswapV3MultiHopSwap.swapExactInputMultiHop(amountOut, amountInMax);
// 		const txreceipt = await tx.wait();

// 		console.log(await dai.balanceOf(accounts[0].address));
// 		console.log(await weth.balanceOf(accounts[0].address));

// 		console.log(txreceipt)
// 		// Get the balance
// 		const balance = await dai.balanceOf(accounts[0].address);
// 		res.json({
// 			success: true,
// 			balance: balance.toString()
// 		});
// 	} catch (error) {
// 		console.error('Error:', error);
// 		res.json({
// 			success: false,
// 			error: error.message
// 		});
// 	}
// 	/*
// 	try {
// 		accounts = await ethers.getSigners();
// 		dai = await ethers.getContractAt("contracts/interfaces/IERC20.sol:IERC20", DAI);
// 		weth = await ethers.getContractAt("IWETH", WETH);

// 		for(let i=0; i<10; i++){
// 			console.log(accounts[i].address.toString())
// 			console.log(await dai.balanceOf(accounts[i].address));
// 			console.log(await weth.balanceOf(accounts[i].address));
// 		}

// 		console.log(await dai.balanceOf(accounts[0].address));
// 		console.log(await weth.balanceOf(accounts[0].address));

// 		const amountOut = ethers.BigNumber.from(req.body.amountOut);
// 		const amountInMax = ethers.BigNumber.from(req.body.amountInMax);

// 		const contractABI = require('../Uniswap-v3/artifacts/contracts/UniswapV3MultiHopSwap.sol/UniswapV3MultiHopSwap.json').abi;
// 		const contractAddress = process.env.MULTIHOP_CONTRACT_ADDR;
// 		console.log('Contract ABI:', contractABI);
// 		console.log('Contract Address:', contractAddress);

// 		const contract = new web3.eth.Contract(contractABI, contractAddress);

// 		await weth.deposit({value: amountInMax});
// 		await weth.approve(contract.address, amountInMax);

// 		const tx = await contract.swapExactOutputMultiHop(amountOut, amountInMax);
// 		const txreceipt = await tx.wait();
// 		console.log(txreceipt)

// 		console.log(await dai.balanceOf(accounts[0].address));
// 		console.log(await weth.balanceOf(accounts[0].address));

// 		res.json({
// 			success: true,
// 			balance: balance.toString()
// 		});
// 	} catch (err) {
// 		console.error(err);
// 		return res.status(500).json({
// 			message: 'Internal Server Error'
// 		});
// 	}
// 	*/
// });

app.listen(3000, () => console.log('Server is running on port 3000'));