import erc20Abi from "./abis/erc20";
import ownableAbi from "./abis/ownable";
import epnscoreAbi from "./abis/epnscore";
import epnsAbi from "./abis/EPNS.json";
import tokenVestingAbi from "./abis/TokenVesting.json";
import fundsDistributorAbi from "./abis/FundsDistributor.json";
import fundsDistributorFactoryAbi from "./abis/FundsDistributorFactory.json";
import reservesAbi from "./abis/Reserves.json";
import vestedReservesAbi from "./abis/VestedReserves.json";
import multiSigWalletAbi from "./abis/MultiSigWallet.json";

import daiAbi from "./abis/dai";
import stakingAbi from "./abis/Staking.json";
import yieldFarmingAbi from "./abis/YieldFarm.json";
import UniswapV2Router02Abi from "./abis/UniswapV2Router02.json";


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
  dai: daiAbi,
  staking: stakingAbi,
  yieldFarming: yieldFarmingAbi,
  uniswapV2Router02: UniswapV2Router02Abi,
};

export { default as addresses } from "./addresses";
export { default as bytecodes } from "./bytecodes";
