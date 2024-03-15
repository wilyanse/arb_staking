const { HardhatUserConfig } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");

const ETHER_API_KEY = "EBYUE4MMHKBCZQU5IMSRZZ9TB7ZESCI2PB";
const ARBITRUM_SEPOLIA_URL = "https://sepolia-rollup.arbitrum.io/rpc";
const PRIVATE_KEY = "04f0856be7787855951c21d3f2f4d25b6eb9f20c7f243ecaf2e6cb4066e54686";

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
