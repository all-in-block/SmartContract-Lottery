require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();

const SEPOLIA_RPC_URL = "";
const GOERLI_RPC_URL = "";
const PRIVATE_KEY = "";
const ETHERSCAN_API_KEY = "";
const COINMARKETCAP_API_KEY = "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    localhost: {
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      chainId: 11155111,
      accounts: [PRIVATE_KEY],
      blockConfirmations: 6,
    },
    goerli: {
      url: GOERLI_RPC_URL,
      chainId: 5,
      accounts: [PRIVATE_KEY],
      blockConfirmations: 6,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true, //must be true
    outputFile: "gas-reporter.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    // token: "MATIC", //to deploy to matic network
  },
  mocha: {
    timeout: 300000, //300 seconds
  },
  solidity: "0.8.18",
};
