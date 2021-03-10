import { ethers } from "ethers";

export function displayAmount(amount, decimals) {
  return amount.div(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18))).toString()
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}