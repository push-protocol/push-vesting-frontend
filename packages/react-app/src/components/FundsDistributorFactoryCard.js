import React, { Component } from 'react'
import moment from 'moment'

import styled, { css } from "styled-components";
import { getTokenVesting, getMultisigWallet, getFundsDistributorFactory, getEPNSToken } from '../contracts'
import { displayAmount, tokensToBn } from '../utils'

import { ContractLink, TransactionLink } from './Links'
import Emoji from './Emoji'
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

const FundsDistributorFactoryCard = ({ name, contract, multisigContract }) => {
  const [ canRevoke, setRevoke ] = React.useState(true);
  const [ recipientAddress, setRecipientAddress ] = React.useState("");
  const [ startEpoch, setStartEpoch ] = React.useState(0);
  const [ cliffDuration, setCliffDuration ] = React.useState(0);
  const [ duration, setDuration ] = React.useState(0);
  const [ revocable, setRevocable ] = React.useState(null);
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

  async function onDeployVesting() {
    try {
      const bnTransferAmount = tokensToBn(transferAmount);
      const data = (await contract.populateTransaction.deployFundee(recipientAddress, startEpoch, cliffDuration, duration, revocable, bnTransferAmount, identifier)).data
      
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

  async function onWithdrawTokens() {
    const bnWithdrawAmount = tokensToBn(withdrawAmount);
    const data = (await contract.populateTransaction.withdrawTokens(bnWithdrawAmount)).data
    try {
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
          <CardTitle>{name}</CardTitle>
            <Label>Amount of Tokens Left - {displayAmount(tokenBalance)}</Label>
          <Action>
            <Label>Deploy New Instance</Label>
            <Input placeholder="Enter Beneficiary Address" onChange={(e) => setRecipientAddress(e.target.value)} />
            <Input placeholder="Enter Start Epoch" onChange={(e) => setStartEpoch(e.target.value)} />
            <Input placeholder="Enter Cliff Duration" onChange={(e) => setCliffDuration(e.target.value)} />
            <Input placeholder="Enter Duration" onChange={(e) => setDuration(e.target.value)} />
            <label for="revocable">Revocable ?</label>

            <Input type="radio" id="true" onChange={(e) => setRevocable(true)} />
            <label for="true">True</label>
            <Input type="radio" id="false" onChange={(e) => setRevocable(false)} />
            <label for="false">False</label>

            <Input placeholder="Enter Token Amount" onChange={(e) => setTransferAmount(e.target.value)} />
            <Input placeholder="Enter Identifier" onChange={(e) => setIdentifier(e.target.value)} />
            <Button onClick={onDeployVesting}>Submit</Button>
          </Action>

          <Action style={{ display: 'flex' }}>
            <Label>Withdraw Tokens</Label>
            <Input placeholder="Enter Token Amount" onChange={(e) => setWithdrawAmount(e.target.value)} />
            <Button onClick={onWithdrawTokens}>Withdraw</Button>
          </Action>
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

export default FundsDistributorFactoryCard