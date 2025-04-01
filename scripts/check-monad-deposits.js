const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

const walletsPath = path.join(__dirname, "../data/monad_wallets.json");
const balancesPath = path.join(__dirname, "../data/balances.json");

const provider = new ethers.providers.JsonRpcProvider("https://testnet.monad.rpc"); // Monad Testnet RPC URL

async function checkDeposits() {
  const wallets = JSON.parse(fs.readFileSync(walletsPath, "utf-8"));
  let balances = fs.existsSync(balancesPath)
    ? JSON.parse(fs.readFileSync(balancesPath, "utf-8"))
    : {};

  for (const wallet of wallets) {
    const balance = await provider.getBalance(wallet.monadWallet);
    const monadBalance = ethers.utils.formatEther(balance);

    balances[wallet.userId] = {
      monadWallet: wallet.monadWallet,
      monadBalance: monadBalance,
    };

    console.log(`Updated balance for ${wallet.userId}: ${monadBalance} MONAD`);
  }

  fs.writeFileSync(balancesPath, JSON.stringify(balances, null, 2));
}

checkDeposits();
