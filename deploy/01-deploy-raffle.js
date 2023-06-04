const { network, ethers } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("2");
const ETHERSCAN_API_KEY = "U1371BNIUSW4WR1MT5GAF93DMJ9GX4TD9Z";

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  //vrfCoordinatorV2Mock;
  let vrfCoordinatorV2Address, subscriptionId;
  const chainId = network.config.chainId;

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;

    //create subscriptionid
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait();

    subscriptionId = transactionReceipt.events[0].args.subId;
    //fund subscription
    // usually you had need link token on a real network
    await vrfCoordinatorV2Mock.fundSubscription(
      subscriptionId,
      VRF_SUB_FUND_AMOUNT
    );
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinator"];
    subscriptionId = networkConfig[chainId]["subscriptionId"];
  }

  //entranceFee
  const entranceFee = networkConfig[chainId]["entranceFee"];
  const gasLane = networkConfig[chainId]["gasLane"];
  const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"];
  const interval = networkConfig[chainId]["interval"];

  const args = [
    vrfCoordinatorV2Address,
    entranceFee,
    gasLane,
    subscriptionId,
    callbackGasLimit,
    interval,
  ];
  const raffle = await deploy("Raffle", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (!developmentChains.includes(network.name) && ETHERSCAN_API_KEY) {
    log("verifying.........");
    await verify(raffle.address, args);
    log("---------------------------");
  }
};
module.exports.tags = ["all", "raffle"];
