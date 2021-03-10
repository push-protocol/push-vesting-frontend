import { addresses, abis } from "@project/contracts";
const ethers = require('ethers');

export async function getTokenVesting(address, library, account) {
  // Send Transaction
  // First Approve DAI
  var signer = library.getSigner(account);
  let TokenVesting = new ethers.Contract(address, abis.tokenVesting, signer);
  return TokenVesting;
}

export async function getSimpleToken(address, library, account) {
  // Send Transaction
  // First Approve DAI
  var signer = library.getSigner(account);
  let SimpleToken = new ethers.Contract(address, abis.erc20, signer);
  return SimpleToken;
}