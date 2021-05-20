import React, { Component } from 'react'
import moment from 'moment'

import styled, { css } from "styled-components";
import { getTokenVesting, getMultisigWallet, getFundsDistributorFactory, get } from '../contracts'
import { displayAmount, tokensToBn } from '../utils'

import { ContractLink, TransactionLink } from './Links'
import Emoji from './Emoji'
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { addresses, abis, bytecodes } from "@project/contracts";
import Loader from "react-loader-spinner";

const FundsDistributorCard = ({ name, contract }) => {
  const [ canRevoke, setRevoke ] = React.useState(true);
  const [ recipientAddress, setRecipientAddress ] = React.useState("");
  const [ startEpoch, setStartEpoch ] = React.useState(0);
  const [ cliffDuration, setCliffDuration ] = React.useState(0);
  const [ duration, setDuration ] = React.useState(0);
  const [ revocable, setRevocable ] = React.useState(0);
  const [ identifier, setIdentifier ] = React.useState(0);
  const [ deployedAddress, setDeployedAddress ] = React.useState(null)
  const [ loader, setLoader ] = React.useState(false);

  const { active, error, account, library, chainId } = useWeb3React();

  async function onDeployVesting() {
    let deployedVestingAddress = "";
    try {
      let txToast = toast.dark(<LoaderToast msg="Waiting for Confirmation..." color="#35c5f3" />, {
        position: "bottom-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      const tx = await contract.deploy(recipientAddress, startEpoch, cliffDuration, duration, revocable, identifier)
      console.log(tx);

      txToast = toast.dark(<LoaderToast msg="Transaction Sent, Waiting for mining..." color="#35c5f3" />, {
        position: "bottom-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      console.log(tx, "tx")
      deployedVestingAddress = tx.deployTransaction.creates
      setDeployedAddress(deployedVestingAddress);
      await tx.deployTransaction.wait()

      toast.update(txToast, {
        render: "Transaction Successful, Vesting Deployed",
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      
      try {
        let txToast = toast.dark(<LoaderToast msg="Transferring Ownership, Waiting for Confirmation..." color="#35c5f3" />, {
          position: "bottom-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        const fundsDistributorInstance = await getTokenVesting(deployedVestingAddress, library, account);
        const tx = await fundsDistributorInstance.transferOwnership(addresses.epnsMultisig);

        txToast = toast.dark(<LoaderToast msg="Transaction Sent, Waiting for mining..." color="#35c5f3" />, {
          position: "bottom-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        await tx.wait();

        toast.update(txToast, {
          render: "Transaction Successful, Ownership transferred",
          type: toast.TYPE.SUCCESS,
          autoClose: 5000,
        });
      } catch (e) {
        toast.update(txToast, {
          render: e.message,
          type: toast.TYPE.ERROR,
          autoClose: 5000,
        });
      }
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
    }
  }

  return (
     <>
        <Card>
          <CardTitle>{name}</CardTitle>
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

            <Input placeholder="Enter Identifier" onChange={(e) => setIdentifier(e.target.value)} />
            <Button onClick={onDeployVesting}>Submit</Button>
          </Action>
          {
            deployedAddress ? (<Label>New Funds Distributor Deployed to - {deployedAddress}</Label>): null
          } 
        </Card>
    </>
  ) 
}

const Toaster = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0px 10px;
`;

const ToasterMsg = styled.div`
  margin: 0px 10px;
`;


// toast customize
const LoaderToast = ({ msg, color }) => (
  <Toaster>
    <Loader type="Oval" color={color} height={30} width={30} />
    <ToasterMsg>{msg}</ToasterMsg>
  </Toaster>
);

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

export default FundsDistributorCard