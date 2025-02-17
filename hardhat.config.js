require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Base Sepolia (testnet)
    "base-sepolia": {
      url: 'https://sepolia.base.org',
      accounts: [PRIVATE_KEY],
      chainId: 84532,
      gasPrice: 1000000000,
    },
    // Base mainnet
    base: {
      url: 'https://mainnet.base.org',
      accounts: [PRIVATE_KEY],
      chainId: 8453,
      gasPrice: 1000000000,
    }
  },
  etherscan: {
    apiKey: {
      "base-sepolia": ETHERSCAN_API_KEY,
      "base": ETHERSCAN_API_KEY
    },
    customChains: [
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      }
    ]
  },
  sourcify: {
    enabled: true
  }
}; 