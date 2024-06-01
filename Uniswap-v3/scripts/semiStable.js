const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const swapRouterAddress = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD";

  const SwapRouter = await ethers.getContractAt("@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol:ISwapRouter", swapRouterAddress);

  const SemiStableSwap = await ethers.getContractFactory("SemiStableSwap", deployer);
  const semiStableSwap = await SemiStableSwap.deploy(SwapRouter.address);

  console.log("SemiStableSwap contract deployed to:", semiStableSwap.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });