const { ethers } = require("hardhat");
const { expect } = require("chai");

// const WETH = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
// const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
// const DAI = "0xFFFeD8254566B7F800f6D8CDb843ec75AE49B07A";

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

describe("UniswapV3", function () {

  describe("UniswapV3MultiHopSwap", function () {
    let accounts, dai, weth, uniswapV3MultiHopSwap;

    beforeEach(async function () {
      accounts = await ethers.getSigners();

      dai = await ethers.getContractAt("@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", DAI);
      weth = await ethers.getContractAt("IWETH", WETH);

      const UniswapV3MultiHopSwap = await ethers.getContractFactory(
        "UniswapV3MultiHopSwap"
      );

      const swapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

      uniswapV3MultiHopSwap = await UniswapV3MultiHopSwap.deploy(swapRouterAddress);
      await uniswapV3MultiHopSwap.deployed();
      console.log("Multi-hop swap contract address: ", uniswapV3MultiHopSwap.address);
    });

    it("swapExactInputMultiHop", async function () {
      const amountIn = 10n ** 18n;

      await weth.deposit({ value: amountIn });
      await weth.approve(uniswapV3MultiHopSwap.address, amountIn);


      await uniswapV3MultiHopSwap.swapExactInputMultihop(amountIn);

      console.log(
        "DAI balance after",
        await dai.balanceOf(accounts[0].address)
      );
    });
  });
});