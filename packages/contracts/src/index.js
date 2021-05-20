import erc20Abi from "./abis/ERC20";
import ownableAbi from "./abis/Ownable";
import epnscoreAbi from "./abis/epnscore";
import epnsAbi from "./abis/EPNS.json";
import tokenVestingAbi from "./abis/TokenVesting.json";
import fundsDistributorAbi from "./abis/FundsDistributor.json";
import fundsDistributorFactoryAbi from "./abis/FundsDistributorFactory.json";
import reservesAbi from "./abis/Reserves.json";
import vestedReservesAbi from "./abis/VestedReserves.json";
import multiSigWalletAbi from "./abis/MultiSigWallet.json";

export const abis = {
  erc20: erc20Abi,
  ownable: ownableAbi,
  epnscore: epnscoreAbi,
  epnsToken: epnsAbi,
  tokenVesting: tokenVestingAbi,
  fundsDistributor: fundsDistributorAbi,
  fundsDistributorFactory: fundsDistributorFactoryAbi,
  reserves: reservesAbi,
  vestedReserves: vestedReservesAbi,
  multiSigWallet: multiSigWalletAbi,
};

export { default as addresses } from "./addresses";
export { default as bytecodes } from "./bytecodes";
