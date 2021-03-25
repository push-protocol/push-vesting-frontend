import { ethers } from "ethers";
import { getFundsDistributorFactory } from "contracts";
import { addresses, abis } from "@project/contracts";

export function displayAmount(amount, decimals) {
  return amount.div(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18))).toString()
}

export function tokensToBn(amount) {
  return ethers.BigNumber.from(amount).mul(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18)))
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const queryVestingLink = async (library, account) => {
    const factoryAddresses = Object.values(addresses.fundsDistributorFactory)

    for(var i = 0; i < factoryAddresses.length; i++){
      const fundsDistributorFactory = await getFundsDistributorFactory(factoryAddresses[i], library, account);
      const DeployFundee = await fundsDistributorFactory.filters.DeployFundee(null, account, null)
      const logs = await fundsDistributorFactory.queryFilter(DeployFundee, 0, "latest");
      if(logs.length > 0){
        return logs[0].args[0]
      }
    }
      
    return ''
}