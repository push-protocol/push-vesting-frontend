import React, { Component } from 'react'
import moment from 'moment'

import styled, { css } from "styled-components";
import { getTokenVesting } from '../contracts'
import { displayAmount, tokensToBn } from '../utils'

import { ContractLink, TransactionLink } from './Links'
import Emoji from './Emoji'
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { toast } from 'react-toastify';
import { ethers } from 'ethers';

const VestingActions = ({ multisigContract, address, token, details, getData, setLoader }) => {
  const [ canRevoke, setRevoke ] = React.useState(true);
  const [ recipientAddress, setRecipientAddress ] = React.useState("");
  const [ transferAmount, setTransferAmount ] = React.useState(0);
  const [ newBeneficiary, setNewBeneficiary ] = React.useState("");

  const { active, error, account, library, chainId } = useWeb3React();
  
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
     <div className="details">
      <TitleLink>VESTING ACTIONS</TitleLink>
      <Container>
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
      </Container>
    </div>
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

const Container = styled.div`
  // display: flex;
  padding: 2rem;
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

const TitleLink = styled.h4`
  text-decoration: none;
  font-weight: 600;
  color: #e20880;
  font-size: 20px;
  text-align: center;
`;

export default VestingActions