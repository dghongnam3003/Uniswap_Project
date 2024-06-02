require("dotenv").config();
const { ethers } = require("hardhat");
const SemiStableSwapABI = require("../artifacts/contracts/SemiStableSwap.sol/SemiStableSwap.json").abi;

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/310a96a3f8c1412a814e14279cf03ccd");
const privateKey = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey, provider);

const semiStableSwapAddress = "0xeD7d4F664227A8046e6A461CaC2A47Ad78651e94";
const semiStableSwap = new ethers.Contract(semiStableSwapAddress, SemiStableSwapABI, signer);

const tokenInAddress = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
const tokenOutAddress = "0x2B0974b96511a728CA6342597471366D3444Aa2a";
const poolFee = 3000;

const executeSwap = async (amountIn, amountOutMinimum) => {
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
  const outputAmount = await tokenOutContract.balanceOf(signer.address);
  const decimals = await tokenOutContract.decimals();
  console.log(`Received ${ethers.utils.formatUnits(outputAmount, decimals)} output tokens`);
}

readline.question('amountIn: ', (amountInStr) => {
  const amountIn = ethers.utils.parseUnits(amountInStr, 18);
  readline.question('amountOutMinimum: ', (amountOutMinimumStr) => {
    const amountOutMinimum = ethers.utils.parseUnits(amountOutMinimumStr, 18);

    executeSwap(amountIn, amountOutMinimum)
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });

    readline.close();
  });
});