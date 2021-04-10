import erc20Abi from "./abis/erc20";
import ownableAbi from "./abis/ownable";
import epnscoreAbi from "./abis/epnscore";
import epnsAbi from "./abis/EPNS.json";
import tokenVestingAbi from "./abis/TokenVesting.json";
import fundsDistributorFactoryAbi from "./abis/FundsDistributorFactory.json";
import multiSigWalletAbi from "./abis/MultiSigWallet.json";

export const abis = {
  erc20: erc20Abi,
  ownable: ownableAbi,
  epnscore: epnscoreAbi,
  epnsToken: epnsAbi,
  tokenVesting: tokenVestingAbi,
  fundsDistributorFactory: fundsDistributorFactoryAbi,
  multiSigWallet: multiSigWalletAbi,
};

export { default as addresses } from "./addresses";
