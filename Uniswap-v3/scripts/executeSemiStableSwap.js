const { ethers } = require("hardhat");
const SemiStableSwapABI = require("../artifacts/contracts/SemiStable.sol/SemiStableSwap.json").abi; // Import the ABI of the SemiStableSwap contract

const provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/n6W8wkNrh4i5EsTHND1FKb8bk2sSEa5F");
const privateKey = "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"; // Replace with your Ethereum account's private key
const signer = new ethers.Wallet(privateKey, provider);

const semiStableSwapAddress = "0xbc71F5687CFD36f64Ae6B4549186EE3A6eE259a4"; // Replace with your deployed contract address
const semiStableSwap = new ethers.Contract(semiStableSwapAddress, SemiStableSwapABI, signer);

const tokenInAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // Address of the input token contract
const tokenOutAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48."; // Address of the output token contract
const poolFee = 3000; // 0.3% pool fee

const amountIn = ethers.utils.parseUnits("1", 18); // 1 input token
const amountOutMinimum = 0; // Set to 0 for this example

async function executeSwap() {
    // const [signer] = await ethers.getSigners();
    // Approve the SemiStableSwap contract to spend the input token
    const tokenInContract = new ethers.Contract(tokenInAddress, ["function approve(address spender, uint256 amount) external returns (bool)"], signer);
    await tokenInContract.approve(semiStableSwapAddress, amountIn);
  
    // Execute the semi-stable swap
    const tx = await semiStableSwap.semiStableSwap(
      amountIn,
      amountOutMinimum,
      tokenInAddress,
      tokenOutAddress,
      poolFee
    );
    await tx.wait();
  
    // Handle the received output token amount
    const tokenOutContract = new ethers.Contract(tokenOutAddress, ["function balanceOf(address account) external view returns (uint256)", "function decimals() external view returns (uint8)"], signer);
    const outputAmount = await tokenOutContract.balanceOf(signer.getAddress());
    const decimals = await tokenOutContract.decimals();
    console.log(`Received ${ethers.utils.formatUnits(outputAmount, decimals)} output tokens`);
  }
  
  executeSwap()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });