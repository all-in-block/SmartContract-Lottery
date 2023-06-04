// our staging test is runned just on a testnet;

const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");
developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Unit Tests", function () {
      let raffle, raffleEntranceFee, deployer;
      //   const chainId = network.config.chainId;
      //beforeeach()
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        raffle = await ethers.getContract("Raffle", deployer);
        raffleEntranceFee = raffle.getEntranceFee();
      });
      //describe
      describe("fulfillRandomWords", function () {
        it("works with chainlink keepers and chainlink vrf, we get a random winner", async function () {
          //enter the raffle
          const startingTimeStamp = await raffle.getLastTimeStamp();
          const accounts = await ethers.getSigners();
          await new Promise(async (resolve, reject) => {
            raffle.once("WinnerPicked", async () => {
              console.log("winnerPicked event fire");
              try {
                const recentWinner = await raffle.getRecentWinner();
                const raffleState = await raffle.getRaffleState();
                const winnerEndingBalance = await accounts[0].getBalance();
                const endingTimeStamp = await raffle.getLastTimeStamp();
                console.log(recentWinner);
                console.log(raffleState);
                console.log(winnerEndingBalance.toString());
                console.log(startingTimeStamp.toString());
                console.log(endingTimeStamp.toString());
                const tx = await raffle.ful

                await expect(raffle.getPlayer(0)).to.be.reverted;
                //it will be no object in getplayer(0): so it will revert
                assert.equal(recentWinner.toString(), accounts[0].address);
                assert.equal(raffleState, 0);
                assert.equal(
                  winnerEndingBalance.toString(),
                  winnerStartingBalance.add(raffleEntranceFee).toString()
                );
                assert(
                  endingTimeStamp.toString() > startingTimeStamp.toString()
                );

                resolve();
              } catch (error) {
                console.log(error);
                reject(e);
              }
            });
            await raffle.enterRaffle({ value: raffleEntranceFee });
            const winnerStartingBalance = await accounts[0].getBalance();
          });
          // setup the listerner before we enter the
          // just in case the blockchain moves really fast
          // await raffle.enterRaffle({value:raffleEntranceFee});
        });
      });
    });
