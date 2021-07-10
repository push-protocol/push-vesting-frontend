// This address points to a dummy ERC20 contract deployed on Ethereum Mainnet,
// Goerli, Kovan, Rinkeby and Ropsten. Replace it with your smart contracts.
const addresses = {
  ceaErc20: "0xc1C0472c0C80bCcDC7F5D01A376Bd97a734B8815",
  epnscore: "0xb02E99b9634bD21A8e3E36cc7adb673287A8FeaC",
  dai: "0xf80A32A835F79D7787E8a8ee5721D0fEaFd78108",
  aDai: "0xcB1Fe6F440c49E9290c3eb7f158534c2dC374201",
  epnsToken: "0xf418588522d5dd018b425E472991E52EBBeEEEEE",
  fundsDistributorFactory: {
    strategicAllocationFactory: "0x4F2a8c211De3752FDFe2bC45737509dA8490eb28",
    advisorsFactory: "0x809A48D85E68610d01Cd4a9c88E694aeFc858CFE",
    teamFactory: "0x876DfF9043CFEdA0277031C7242744d6Fd3BC749",
    investorsAllocationFactory: "0xb10926Ab97774c3d08a7ED4bC7e65eb0AD09bb3d",
  },
  vestedReserves: {
    commReserves: "0x68a9832153fd7f95f1a3fa24fccc3d63a6486e66",  // deprecated = 0x6f59b37e9eabeca527504988c3c7d6d6e77e827a
    foundationA: "0xF1A0baa73205E97D9478752562d06F6dD5daEa2f",
    foundationB: "0x16b41A27dBD3E14F09AB1D57499Bf6738f23812A",
  },
  commUnlockedReserves: "0x0cc23a784F9753FA3359dC3aC261a6593cCf214e",
  epnsMultisig: "0x4957091F11Ca0A298a6656607Cc3B973cebb1F5c",

  staking: "0xB72ff1e675117beDefF05a7D0a472c3844cfec85",
  yieldFarmPUSH: "0x6019B84E2eE9EB62BC42E32AB6375A7095886366",
  yieldFarmLP: "0xbB2A70e67770D0A7F5f42d883C5BBE9b85e0DcD6",
  epnsToken: "0xf418588522d5dd018b425E472991E52EBBeEEEEE",
  epnsLPToken: "0xaf31fd9c3b0350424bf96e551d2d1264d8466205",

  uniswapV2Router02: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",

  // WETHAddress: "0xc778417e063141139fce010982780140aa0cd5ab", // ropsten address
  // USDTAddress: "0xad6d458402f60fd3bd25163575031acdce07538d", // ropsten address

  WETHAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // mainnet address
  USDTAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7", // mainnet address

  distributor: "0x64CfAb2eA55ADAe08c9040fdA247828444fB9D0D", //mainnet address
};

export default addresses;
