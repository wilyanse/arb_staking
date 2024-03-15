const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const INITIAL_BALANCE = ethers.parseEther("1000000");

describe("MyToken", function () {
  async function deploy() {
    const [account1, account2, account3] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("MyToken");
    const cMyToken = await MyToken.deploy(INITIAL_BALANCE, account1);

    return { cMyToken, account1, account2, account3 };
  }

  describe("Staking", function () {
    it("should call constructor", async function () {
      const { cMyToken, account1 } = await loadFixture(deploy);
      const balance = await cMyToken.balanceOf(account1.address);
      expect(balance).to.be.eq(INITIAL_BALANCE);
      expect(cMyToken).not.to.be.undefined;
    });

    it("should be able to mint", async function () {
      const { cMyToken, account2 } = await loadFixture(deploy);
      const amount = ethers.parseEther("100");
      await cMyToken["mint"](account2.address, amount);
      const balance = await cMyToken.balanceOf(account2);
      expect(balance).to.be.eq(amount);
    });

    it("should be able to stake", async function () {
      const { cMyToken, account2 } = await loadFixture(deploy);
      const amount = ethers.parseEther("100");
      await cMyToken["mint"](account2.address, amount);
      await cMyToken.connect(account2).stake(amount);

      const balance = await cMyToken.balanceOf(account2.address);
      expect(balance).to.be.eq(0);
    });

    it("should be able to get current rewards", async function () {
      const { cMyToken, account2 } = await loadFixture(deploy);

      const amount = ethers.parseEther("100");
      await cMyToken["mint"](account2.address, amount);

      await cMyToken.connect(account2).stake(amount);

      const ONE_HOUR_IN_SEC = 60 * 60;
      const unlockTime = (await time.latest()) + ONE_HOUR_IN_SEC;

      await time.increaseTo(unlockTime);

      const rewards = await cMyToken.getCurrentRewards(account2.address);

      expect(rewards).to.be.greaterThan(ethers.parseEther("0"));
      //   console.log("current rewards", rewards);
    });

    it("should be able to claim rewards", async function () {
      const { cMyToken, account2 } = await loadFixture(deploy);

      const amount = ethers.parseEther("100");
      await cMyToken["mint"](account2.address, amount);

      await cMyToken.connect(account2).stake(amount);

      const ONE_HOUR_IN_SEC = 60 * 60;
      const unlockTime = (await time.latest()) + ONE_HOUR_IN_SEC;

      await time.increaseTo(unlockTime);

      await cMyToken.connect(account2).withdraw();

      const balance = await cMyToken.balanceOf(account2);
      //   console.log("balance", balance);
    });

    it("should not be able to stake without tokens", async function () {
      const { cMyToken, account2 } = await loadFixture(deploy);
      const amount = ethers.parseEther("0");
      
      // Ensure account2 has no tokens
      const initialBalance = await cMyToken.balanceOf(account2.address);
      expect(initialBalance).to.be.eq(0);
    
      // Attempt to stake without tokens
      await expect(cMyToken.connect(account2).stake(amount)).to.be.revertedWith("Cannot stake 0 tokens");
    
      // Ensure balance remains zero
      const balance = await cMyToken.balanceOf(account2.address);
      expect(balance).to.be.eq(0);
    });
    
    it("should not be able to withdraw without a stake", async function () {
      const { cMyToken, account2 } = await loadFixture(deploy);
      const amount = ethers.parseEther("100");
    
      // Ensure account2 has tokens
      await cMyToken["mint"](account2.address, amount);
      const initialBalance = await cMyToken.balanceOf(account2.address);
      expect(initialBalance).to.be.eq(amount);
    
      // Attempt to withdraw without staking
      await expect(cMyToken.connect(account2).withdraw()).to.be.revertedWith("No staked tokens");
    
      // Ensure balance remains unchanged
      const balance = await cMyToken.balanceOf(account2.address);
      expect(balance).to.be.eq(amount);
    });
    
  });
});