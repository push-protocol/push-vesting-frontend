import erc20Abi from "./abis/erc20";
import ownableAbi from "./abis/ownable";
import epnscoreAbi from "./abis/epnscore";
import epnsAbi from "./abis/EPNS.json";
import tokenVestingAbi from "./abis/TokenVesting.json";
import fundsDistributorFactoryAbi from "./abis/FundsDistributorFactory.json"

export const abis = {
  erc20: erc20Abi,
  ownable: ownableAbi,
  epnscore: epnscoreAbi,
  epnsToken: epnsAbi,
  tokenVesting: tokenVestingAbi,
  fundsDistributorFactory: fundsDistributorFactoryAbi,
};

export { default as addresses } from "./addresses";
