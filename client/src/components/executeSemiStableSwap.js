const { ethers } = require("hardhat");
const SemiStableSwapABI = require("../contracts/SemiStableSwap.sol/SemiStableSwap.json").abi;

const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/310a96a3f8c1412a814e14279cf03ccd"); // Replace with your Infura project ID
const privateKey = "22b02c2736f2a473321b16d03aa57e2e3546b39a4acaba944928ed0232692776"; // Replace with your Ethereum account's private key
const signer = new ethers.Wallet(privateKey, provider);

const semiStableSwapAddress = "0xb38753e727D2113e970e200dAa84A9B5fc5a6c04"; // Your deployed contract address
const semiStableSwap = new ethers.Contract(semiStableSwapAddress, SemiStableSwapABI, signer);

const tokenInAddress = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14"; // Replace with the address of the input token contract
const tokenOutAddress = "0x2B0974b96511a728CA6342597471366D3444Aa2a"; // Replace with the address of the output token contract
const poolFee = 3000; // 0.3% pool fee

const amountIn = ethers.utils.parseUnits("0.05", 18); // 1 input token
const amountOutMinimum = 5000000; // Set to 0 for this example

async function executeSwap() {
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