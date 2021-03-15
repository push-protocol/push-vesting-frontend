import { addresses, abis } from "@project/contracts";
const ethers = require('ethers');

export async function getTokenVesting(address, library, account) {
  var signer = library.getSigner(account);
  let TokenVesting = new ethers.Contract(address, abis.tokenVesting, signer);
  return TokenVesting;
}

export async function getFundsDistributorFactory(address, library, account) {
  var signer = library.getSigner(account);
  let FundsDistributorFactory = new ethers.Contract(address, abis.fundsDistributorFactory, signer);
  return FundsDistributorFactory;
}

export async function getSimpleToken(library, account) {
  var signer = library.getSigner(account);
  let SimpleToken = new ethers.Contract(addresses.epnsToken, abis.epnsToken, signer);
  return SimpleToken;
}