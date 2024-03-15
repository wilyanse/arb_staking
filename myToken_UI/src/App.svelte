<script lang="ts">
  import { ethers } from "ethers";
  import type { JsonRpcSigner } from "ethers";
  import { Contract } from "ethers";
  import { ABI } from "./abi";

  let stake: number = 0;
  let rewards: number = 0;
  let stakeTime: number = 0;
  const connectWallet = async () => {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const account = await provider.send("eth_accounts", []);
    console.log(account);
  };

  const getStake = async () => {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = await initializeContract(signer);
    const account = await provider.send("eth_accounts", []);
    console.log(account);
    stake = await contract.getStake(account[0]);
    console.log(stake);
  };

  const stakeTokens = async () => {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = await initializeContract(signer);
    await contract.stake(100);
    alert("100 tokens staked");
    getStake();
    getLastStake();
    getRewards();
  };

  const withdrawStakedTokens = async () => {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = await initializeContract(signer);
    await contract.withdraw();
    alert("Staked tokens withdrawn");
    getStake();
    getLastStake();
    getRewards();
  };

  const getRewards = async () => {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = await initializeContract(signer);
    const account = await provider.send("eth_accounts", []);
    rewards = await contract.getCurrentRewards(account[0]);
  };

  const getLastStake = async () => {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = await initializeContract(signer);
    const account = await provider.send("eth_accounts", []);
    stakeTime = await contract.getLastStakeTimestamp(account[0]);
  };

  const initializeContract = async (signer: JsonRpcSigner) => {
    return new Contract(
      "0x6C080Cf2e785F7A186Ce688f1d20e5D210e09AA6",
      ABI,
      signer
    );
  };
</script>

<main>
  <button on:click={connectWallet}>Connect Wallet</button>
  <br>
  <p>Stake: {stake}</p>
  <p>Update rewards: {rewards}</p>
  <p>Staked Time: {stakeTime}</p>
  <br>
  <button on:click={stakeTokens}>Stake 100</button>
  <button on:click={withdrawStakedTokens}>Withdraw</button>

</main>