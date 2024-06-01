require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();


//const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.7.6",
        settings: {
          evmVersion: "istanbul",
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },

      // { version: "0.4.11" },
      { version: "0.8.20" },
    ],
  },
  networks: {
    hardhat: {
      forking: {
          url: "https://eth-mainnet.g.alchemy.com/v2/ab-_KAcwTtyW6cBoTlHEv5Fp6EHtMOct",
      },
      gas: "auto"
    },
    sepolia: {
      url: process.env.INFURA_SEPOLIA_URL,
      chainId: 11155111,
      accounts: [process.env.PRIVATE_KEY],
    }
  },
}
