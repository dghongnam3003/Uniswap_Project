const { ethers } = require("hardhat");
const { getContractFactory } = require("@nomiclabs/hardhat-ethers/types");

async function main() {
  const [deployer] = await ethers.getSigners();

  // Replace this with the actual address of the Uniswap V3 SwapRouter contract
  const swapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

  const swapRouter = await ethers.getContractAt(
    "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol:ISwapRouter",
    swapRouterAddress
  );

  const SemiStableSwap = await getContractFactory(
    "SemiStableSwap",
    deployer
  );
  const semiStableSwap = await SemiStableSwap.deploy(swapRouter.address);

  console.log("SemiStableSwap contract deployed to:", semiStableSwap.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });