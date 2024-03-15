const { HardhatUserConfig } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");

const ETHER_API_KEY = "";
const ARBITRUM_SEPOLIA_URL = "https://sepolia-rollup.arbitrum.io/rpc";
const PRIVATE_KEY = "";

const config = {
  solidity: "0.8.24",
  networks: {
    arbitrumSepolia: {
      url: ARBITRUM_SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
      chainId: 421614,
    },
  },
  sourcify: {
    enabled: true,
  },
  etherscan: {
    apiKey: ETHER_API_KEY,
    customChains: [
      {
        network: "arbsep",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
        },
      },
    ],
  }
};

module.exports = config;
