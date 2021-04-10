// This address points to a dummy ERC20 contract deployed on Ethereum Mainnet,
// Goerli, Kovan, Rinkeby and Ropsten. Replace it with your smart contracts.
const addresses = {
  ceaErc20: "0xc1C0472c0C80bCcDC7F5D01A376Bd97a734B8815",
  epnscore: "0xb02E99b9634bD21A8e3E36cc7adb673287A8FeaC",
  dai: "0xf80A32A835F79D7787E8a8ee5721D0fEaFd78108",
  aDai: "0xcB1Fe6F440c49E9290c3eb7f158534c2dC374201",
  epnsToken: "0x310e92E288044e72B787aDeBe622A874f2F54E35",
  fundsDistributorFactory: {
    strategicAllocationFactory: "0x92D8F4b45cE4cfBdC648d06d7ee7b6c4BDC1689C",
    advisorsFactory: "0x92D8F4b45cE4cfBdC648d06d7ee7b6c4BDC1689C",
    teamFactory: "0xF276ccF581a11059A2D1D696D947164378DFe15A",
    investorsAllocationFactory: "0x9283124318C61630f481F264795B4D5d8A033b2f",
  },
  vestedReserves: {
    commReserves: "0x96E876bd120c11665088AFA911B1018623255372",
    foundationA: "0x96E876bd120c11665088AFA911B1018623255372",
    foundationB: "0xC644F3309831634e65888745b4ace3596B13f608",
  }
};

export default addresses;