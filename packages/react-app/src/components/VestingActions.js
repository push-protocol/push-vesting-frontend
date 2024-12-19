import React, { Component } from 'react'
import moment from 'moment'

import styled, { css } from "styled-components";
import { Section, Content, Item, ItemH, Span, B } from 'components/SharedStyling';

import { getTokenVesting } from '../contracts'
import { displayAmount, tokensToBn } from '../utils'

import Loader from "react-loader-spinner";

import { ContractLink, TransactionLink } from './Links'
import Emoji from './Emoji'
import { toast } from 'react-toastify';

import { addresses, abis } from "@project/contracts";
import { useWeb3React } from '@web3-react/core'
import { ethers } from "ethers";

import YieldFarmingDataStore from "singletons/YieldFarmingDataStore";


const VestingActions = ({ multisigContract, address, token, details, getData, setLoader, loaderTheme, loadAPR, actionable }) => {
  const [ canRevoke, setRevoke ] = React.useState(true);
  const [ recipientAddress, setRecipientAddress ] = React.useState("");
  const [ transferAmount, setTransferAmount ] = React.useState(0);
  const [ newBeneficiary, setNewBeneficiary ] = React.useState("");
  const [ loading, setLoading ] = React.useState(true);

  const { active, error, account, library, chainId } = useWeb3React();

  const [poolStats, setPoolStats] = React.useState(null);
  const [pushPoolStats, setPushPoolStats] = React.useState(null);
  const [lpPoolStats, setLpPoolStats] = React.useState(null);
  const [userDataPUSH, setUserDataPUSH] = React.useState(null);
  const [userDataLP, setUserDataLP] = React.useState(null);

  const [formattedDuration, setFormattedDuration] = React.useState("");

  const [epnsToken, setEpnsToken] = React.useState(null);
  const [staking, setStaking] = React.useState(null);
  const [yieldFarmingPUSH, setYieldFarmingPUSH] = React.useState(null);
  const [yieldFarmingLP, setYieldFarmingLP] = React.useState(null);
  const [uniswapV2Router02, setUniswapV2Router02] = React.useState(null);

  const [showAnswers, setShowAnswers] = React.useState([]);

  const [loadingUserData, setLoadingUserData] = React.useState(false);

  const toggleShowAnswer = (id) => {
    let newShowAnswers = [...showAnswers];
    newShowAnswers[id] = !newShowAnswers[id];

    setShowAnswers(newShowAnswers);
  }

  const getPoolStats = React.useCallback(async () => {
    const poolStats = await YieldFarmingDataStore.instance.getPoolStats();

    setPoolStats({ ...poolStats });
  }, [epnsToken, staking, yieldFarmingPUSH, yieldFarmingLP, uniswapV2Router02]);

  const getPUSHPoolStats = React.useCallback(async () => {
    const pushPoolStats = await YieldFarmingDataStore.instance.getPUSHPoolStats();

    setPushPoolStats({ ...pushPoolStats });
  }, [epnsToken, staking, yieldFarmingPUSH, yieldFarmingLP, uniswapV2Router02]);

  const getLPPoolStats = React.useCallback(async (poolStats) => {
    const lpPoolStats = await YieldFarmingDataStore.instance.getLPPoolStats(poolStats);

    setLpPoolStats({ ...lpPoolStats });
  }, [epnsToken, staking, yieldFarmingPUSH, yieldFarmingLP, uniswapV2Router02]);

  const getUserDataPUSH = React.useCallback(async () => {
    const userDataPUSH = await YieldFarmingDataStore.instance.getUserData(yieldFarmingPUSH);

    setUserDataPUSH({ ...userDataPUSH });
  }, [yieldFarmingPUSH]);

  const getUserDataLP = React.useCallback(async () => {
    const userDataLP = await YieldFarmingDataStore.instance.getUserData(yieldFarmingLP);

    setUserDataLP({ ...userDataLP });
  }, [yieldFarmingLP]);

  const formatTokens = (tokens) => {
    if (tokens) {
      return tokens.div(ethers.BigNumber.from(10).pow(18)).toString();
    }
  };

  const getFormattedDuration = () => {
    if (poolStats?.epochEndTimestamp) {
      const epochEndTimestamp = poolStats.epochEndTimestamp.toNumber();

      const duration = epochEndTimestamp - Math.floor(new Date() / 1000);

      if(duration < 0) {
        getPoolStats()
      }

      const day = parseInt(duration / 86400);
      const hour = parseInt((duration - day * 86400) / 3600);

      const minutes = parseInt((duration - (day * 86400 + hour * 3600)) / 60);
      const seconds = duration - (day * 86400 + hour * 3600 + minutes * 60);

      setFormattedDuration(`${day}D ${hour}H ${minutes}M ${seconds}S`);
    }
  };

  React.useEffect(() => {
    if (!loadAPR) {
      return;
    }

    let epnsToken = new ethers.Contract(
      addresses.epnsToken,
      abis.epnsToken,
      library
    );

    let staking = new ethers.Contract(addresses.staking, abis.staking, library);
    let yieldFarmingPUSH = new ethers.Contract(
      addresses.yieldFarmPUSH,
      abis.yieldFarming,
      library
    );

    let yieldFarmingLP = new ethers.Contract(
      addresses.yieldFarmLP,
      abis.yieldFarming,
      library
    );

    let uniswapV2Router02Instance = new ethers.Contract(
      addresses.uniswapV2Router02,
      abis.uniswapV2Router02,
      library
    );

    setEpnsToken(epnsToken);
    setStaking(staking);
    setYieldFarmingPUSH(yieldFarmingPUSH);
    setYieldFarmingLP(yieldFarmingLP);
    setUniswapV2Router02(uniswapV2Router02Instance)

    if (!!(library && account)) {
      var signer = library.getSigner(account);

      let epnsToken = new ethers.Contract(
        addresses.epnsToken,
        abis.epnsToken,
        signer
      );
      let staking = new ethers.Contract(
        addresses.staking,
        abis.staking,
        signer
      );
      let yieldFarmingPUSH = new ethers.Contract(
        addresses.yieldFarmPUSH,
        abis.yieldFarming,
        signer
      );
      let yieldFarmingLP = new ethers.Contract(
        addresses.yieldFarmLP,
        abis.yieldFarming,
        signer
      );

      let uniswapV2Router02Instance = new ethers.Contract(
        addresses.uniswapV2Router02,
        abis.uniswapV2Router02,
        signer
      );

      setEpnsToken(epnsToken);
      setStaking(staking);
      setYieldFarmingPUSH(yieldFarmingPUSH);
      setYieldFarmingLP(yieldFarmingLP);
      setUniswapV2Router02(uniswapV2Router02Instance);
  }
  }, [account]);

  React.useEffect(() => {
    if (!loadAPR) {
      return;
    }

    if (epnsToken != null && staking != null && yieldFarmingPUSH != null) {
      // Instantiate Data Stores
      YieldFarmingDataStore.instance.init(
        account,
        epnsToken,
        staking,
        yieldFarmingPUSH,
        yieldFarmingLP,
        uniswapV2Router02
      );

      getPoolStats();

      // setpoolStats(YieldFarmingDataStore.instance.state);
    }
  }, [getPoolStats]);

  React.useEffect(() => {
    if (!loadAPR) {
      return;
    }

    if (poolStats) {
      syncData(poolStats)
    }

  }, [poolStats]);

  const syncData = async (poolStats) => {
    if (!loadAPR) {
      return;
    }
    
    getPUSHPoolStats();
    getLPPoolStats(poolStats);

    getUserDataPUSH();
    getUserDataLP();

    setLoading(false);
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  React.useEffect(() => {
    if (loadAPR) {
      // don't turn loading off till this is loaded

    }
    else {
      setLoading(false)
    }

  }, [loadAPR]);

  function startLoader() {
    setLoader(true)
  }

  function stopLoader() {
    setLoader(false)
  }

  async function onRelease() {
    try {
      const tokenVesting = getTokenVesting(address, library, account);
      startLoader()
      let tx;
      if(multisigContract){
        const data = (await tokenVesting.populateTransaction.release(token)).data
        tx = await multisigContract.submitTransaction(tokenVesting.address, 0, data);
      } else {
        tx = await tokenVesting.release(token)
      }
      toast.dark("Transaction Sent - "+ TransactionLink(tx.hash), {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      const receipt = await tx.wait()
      toast.dark("Transaction Successful", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      getData()
    } catch (e) {
      toast.dark(e.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      stopLoader()
    }
  }

  async function onReleaseBeneficiary() {
    try {
      const tokenVesting = getTokenVesting(address, library, account);
      startLoader()
      let tx;
      if(recipientAddress == "" || transferAmount <= 0 ){
        toast.dark("Invalid Values. Please enter correct address or amount", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        return
      }
      if(multisigContract){
        const data = (await tokenVesting.populateTransaction.releaseToAddress(token, recipientAddress, tokensToBn(transferAmount))).data
        tx = await multisigContract.submitTransaction(tokenVesting.address, 0, data);
      } else {
        tx = await tokenVesting.releaseToAddress(token, recipientAddress, tokensToBn(transferAmount))
      }
      toast.dark("Transaction Sent - "+ TransactionLink(tx.hash), {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      const receipt = await tx.wait()
      toast.dark("Transaction Successful", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setRecipientAddress("")
      setTransferAmount(0)
      getData()
    } catch (e) {
      toast.dark(e.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      stopLoader()
    }
  }

  async function onChangeBeneficiary() {
    try {
      const tokenVesting = getTokenVesting(address, library, account);
      startLoader()
      if(newBeneficiary == ""){
        toast.dark("Invalid Values. Please enter correct address or amount", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        return
      }
      let tx;
      if(multisigContract){
        const data = (await tokenVesting.populateTransaction.setBeneficiary(newBeneficiary)).data
        tx = await multisigContract.submitTransaction(tokenVesting.address, 0, data);
      } else {
        tx = await tokenVesting.setBeneficiary(newBeneficiary)
      }
      toast.dark("Transaction Sent - "+ TransactionLink(tx.hash), {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      const receipt = await tx.wait()
      toast.dark("Transaction Successful", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      getData()
      setNewBeneficiary("")
    } catch (e) {
      toast.dark(e.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      stopLoader()
    }
  }

  return (
     <Section>
       <Content padding="0px">
         <Item self="stretch" align="center">
           {loading ?
             <Loader type="Oval" color={loaderTheme ? loaderTheme : "#e20880"} height={40} width={40} />
             : null
           }
           {!loading ?
             <>
               {/* {poolStats &&
                 <Item self="stretch" align="stretch">
                   <Content theme="#f3f3f3" padding="40px 0px 0px 0px">
                     <ItemH margin="0px 15px 0px 15px" align="stretch">
                       <StatsCard
                         bg="#fff"
                       >
                         <StatsHeading bg="#e20880">Current Uniswap V2 LP APR</StatsHeading>
                         {lpPoolStats &&
                           <StatsContent>
                             <StatsInnerTitle>{lpPoolStats.stakingAPR}%</StatsInnerTitle>
                             <StatsInnerSub>Epoch {lpPoolStats.currentEpochPUSH.toString()} of {lpPoolStats.totalEpochPUSH}</StatsInnerSub>
                           </StatsContent>
                         }
                         <StatsPreview color="#e20880">Uni-V2 LP APR</StatsPreview>
                       </StatsCard>

                       <StatsCard
                         bg="#fff"
                       >
                         <StatsHeading bg="#35c5f3">Current Staking APR</StatsHeading>
                         {pushPoolStats &&
                           <StatsContent>
                             <StatsInnerTitle>{pushPoolStats.stakingAPR}%</StatsInnerTitle>
                             <StatsInnerSub>Epoch {pushPoolStats.currentEpochPUSH.toString()} of {pushPoolStats.totalEpochPUSH}</StatsInnerSub>
                           </StatsContent>
                         }
                         <StatsPreview color="#35c5f3">Push Staking APR</StatsPreview>
                       </StatsCard>
                    </ItemH>

                    <FullButton onClick={() => {actionable()}}>Stake Now!</FullButton>
                  </Content>
                 </Item>
               } */}

               <Item self="stretch" align="stretch" padding="20px 40px 10px 40px">
                 <Action>
                   <Label>Release to Beneficiary Address</Label>
                   <Button onClick={onRelease}>Release</Button>
                 </Action>
                 <Action>
                   <Label>Release to Beneficiary Address</Label>
                   <Input placeholder="Recipient Address" onChange={(e) => setRecipientAddress(e.target.value)} />
                   <Input placeholder="Amount to Transfer" onChange={(e) => setTransferAmount(e.target.value)} />
                   <Button onClick={onReleaseBeneficiary}>Submit</Button>
                 </Action>
                 <Action>
                   <Label>Change Beneficiary Address</Label>
                   <Input placeholder="New Beneficiary Address" onChange={(e) => setNewBeneficiary(e.target.value)} />
                   <Button onClick={onChangeBeneficiary}>Submit</Button>
                 </Action>
               </Item>
             </>
             : null
           }
       </Item>
     </Content>
    </Section>
  )
}

const Action = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
`;

const Label = styled.span`
  flex: 1;
  align-self: center;
  font-weight: bold;
`;

const Input = styled.input`
  border: 0px;
  outline: 0px;
  border-bottom: 1px solid #ddd;
  margin: 25px 10px;
  padding: 5px;
  flex: 1;
`;

const Button = styled.button`
  width: 100px;
  height: 35px;
  align-self: center;
  border: 0;
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 15px;
  margin: 10px;
  color: #fff;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 400;
  position: relative;
  background: #e20880;
  &:hover {
    opacity: 0.9;
    cursor: pointer;
    pointer: hand;
  }
  &:active {
    opacity: 0.75;
    cursor: pointer;
    pointer: hand;
  }
  ${ props => props.disabled && css`
    &:hover {
      opacity: 1;
      cursor: default;
      pointer: default;
    }
    &:active {
      opacity: 1;
      cursor: default;
      pointer: default;
    }
  `}
`;

const FullButton = styled(Button)`
  margin: 0px;
  width: auto;
  flex: 1;
  align-self: auto;
  border-radius: 0px;
  background: #000000;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 16px;
  margin-top: 40px;
`

const TitleLink = styled.h4`
  text-decoration: none;
  font-weight: 600;
  color: #e20880;
  font-size: 20px;
  text-align: center;
`;

// css styles
const Container = styled.div`
  flex: 1;
  display: block;
  flex-direction: column;
  min-height: calc(100vh - 100px);
`

const StatsCard = styled(Item)`
  overflow: hidden;
  min-width: 180px;

  border-radius: 12px;
  border: 1px solid rgb(225, 225, 225);

  margin: 0px 15px;

  &:hover {
    opacity: 0.9;
  }
`;

const CenterHeading = styled.h2`
  text-align: center;
`;

const PoolContainer = styled.div`
  display: flex;
`;

const StatsHeading = styled(Item)`
  flex: 0;
  align-self: stretch;
  color: #fff;
  top: 0px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 15px;
  text-align: center;
  padding: 10px 5px;
  right: 0;
  left: 0;
`

const StatsContent = styled(Item)`
  padding: 20px 20px;
`

const StatsPreview = styled(Span)`
  position: absolute;
  bottom: 5px;
  right: 10px;
  font-weight: 600;
  font-size: 12px;
  opacity: 0.25;
  letter-spacing:0.1em;
  text-transform: uppercase;
  color: ${props => props.color || '#000'};
  z-index: -1;
`

const StatsInnerTitle = styled.span`
  font-weight: bold;
  font-size: 22px;
  letter-spacing: 0.1em;
`;

const StatsInnerSub = styled.span`
  font-size: 12px;
  color: #999;
  font-weight: 600;
  align-self: flex-end;
`;

export default VestingActions
