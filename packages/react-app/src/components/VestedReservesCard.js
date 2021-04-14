import React, { Component } from 'react'
import moment from 'moment'

import styled, { css } from "styled-components";
import { getTokenVesting, getMultisigWallet, getFundsDistributorFactory, getEPNSToken } from '../contracts'
import { displayAmount, tokensToBn } from '../utils'

import { ContractLink, TransactionLink } from './Links'
import Emoji from './Emoji'
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { toast } from 'react-toastify';
import { addresses, abis } from "@project/contracts";
import { ethers } from 'ethers';

const VestedReservesCard = ({ name, contract, multisigContract }) => {
  const [ canRevoke, setRevoke ] = React.useState(true);
  const [ recipientAddress, setRecipientAddress ] = React.useState("");
  const [ startEpoch, setStartEpoch ] = React.useState(0);
  const [ cliffDuration, setCliffDuration ] = React.useState(0);
  const [ duration, setDuration ] = React.useState(0);
  const [ revocable, setRevocable ] = React.useState(0);
  const [ transferAmount, setTransferAmount ] = React.useState(0);
  const [ withdrawAmount, setWithdrawAmount ] = React.useState(0);
  const [ identifier, setIdentifier ] = React.useState(0);
  const [ loader, setLoader ] = React.useState(false);
  const [ epnsToken, setEpnsToken ] = React.useState(null);
  const [ tokenBalance, setTokenBalance ] = React.useState(ethers.BigNumber.from(0));

  const { active, error, account, library, chainId } = useWeb3React();
  
  function startLoader() {
    setLoader(true)
  }

  function stopLoader() {
    setLoader(false)
  }

  async function onRevokeCommRes() {
    try {
      console.log(contract)
      const data = (await contract.populateTransaction.revoke(addresses.epnsToken)).data

      startLoader()
      
      const tx = await multisigContract.submitTransaction(contract.address, 0, data);

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

  // async function onReleaseCommRes() {
  //   try {
  //     const tokenVesting = await getTokenVesting(releaseVestingAddress, library, account);
  //     const data = (await tokenVesting.populateTransaction.release(addresses.epnsToken)).data
  //     startLoader()
      
  //     const tx = await multisigContract.submitTransaction(tokenVesting.address, 0, data);

  //     toast.dark("Transaction Sent - "+ TransactionLink(tx.hash), {
  //       position: "bottom-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //     const receipt = await tx.wait()
  //     toast.dark("Transaction Successful", {
  //       position: "bottom-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //   } catch (e) {
  //     toast.dark(e.message, {
  //       position: "bottom-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //     stopLoader()
  //   }
  // }

  React.useEffect(() => {
    try {
      const epnsToken = getEPNSToken(library, account);
      setEpnsToken(epnsToken);

      const getTokenBalance = async () => {
        const balance = await epnsToken.balanceOf(contract.address);
        setTokenBalance(balance);
      }

      getTokenBalance();
    } catch (error) {
      toast.dark("Something went wrong fetching balance", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

  }, [account])

  return (
     <>
        <Card>
          <CardTitle>Manage {name}</CardTitle>
          {/* <Action>
            <Label>Release to Beneficiary Address</Label>
            <Button onClick={onReleaseCommRes}>Release</Button>
          </Action>
          <Action>
            <Label>Release to Beneficiary Address</Label>
            <Input placeholder="Recipient Address" onChange={(e) => setRecipientAddressCommRes(e.target.value)} />
            <Input placeholder="Amount to Transfer" onChange={(e) => setTransferAmountCommRes(e.target.value)} />
            <Button onClick={onReleaseBeneficiaryCommRes}>Submit</Button>
          </Action>
          <Action>
            <Label>Change Beneficiary Address</Label>
            <Input placeholder="New Beneficiary Address" onChange={(e) => setNewBeneficiary(e.target.value)} />
            <Button onClick={onChangeBeneficiary}>Submit</Button>
          </Action> */}
          <Button onClick={onRevokeCommRes}>Revoke</Button>
        </Card>
    </>
  )

  
}

const CardTitle = styled.span`
  color: #e20880;
  font-size: larger;
  font-weight: bold;
`;

const Action = styled.div`
  border-bottom: 1px solid #eee;
`;

const Label = styled.p`
  flex: 1;
  align-self: center;
  font-weight: bold;
`;

const Container = styled.div`
  // display: flex;
  padding: 2rem;
  width: 100%;
`;

const Input = styled.input`
  border: 0px;
  outline: 0px;
  border-bottom: 1px solid #ddd;
  margin: 25px 10px;
  padding: 5px;
`

const Card = styled.div`
  padding: 1.5rem;
  background: #fff;

  box-shadow: 0px 15px 20px -5px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  border: 1px solid rgb(225,225,225);

  margin: 20px;

  align-items: center;
  justify-content: center;
`

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
`

const TitleLink = styled.h4`
  text-decoration: none;
  font-weight: 600;
  color: #e20880;
  font-size: 20px;
  text-align: center;
`

export default VestedReservesCard