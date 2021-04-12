import { addresses, abis } from "@project/contracts";
const ethers = require('ethers');

export function getTokenVesting(address, library, account) {
  var signer = library.getSigner(account);
  let TokenVesting = new ethers.Contract(address, abis.tokenVesting, signer);
  return TokenVesting;
}

export function getFundsDistributorFactory(address, library, account) {
  var signer = library.getSigner(account);
  let FundsDistributorFactory = new ethers.Contract(address, abis.fundsDistributorFactory, signer);
  return FundsDistributorFactory;
}

export function getReserves(library, account) {
  var signer = library.getSigner(account);
  let CommUnlockedReserves = new ethers.Contract(addresses.commUnlockedReserves, abis.reserves, signer);
  return CommUnlockedReserves;
}

export function getEPNSToken(library, account) {
  var signer = library.getSigner(account);
  let SimpleToken = new ethers.Contract(addresses.epnsToken, abis.epnsToken, signer);
  return SimpleToken;
}

export function getMultisigWallet(address, library, account) {
  var signer = library.getSigner(account);
  let MultiSigWallet = new ethers.Contract(address, abis.multiSigWallet, signer);
  return MultiSigWallet;
}