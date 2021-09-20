import React, { Component } from 'react'
import moment from 'moment'

import styled, { css } from "styled-components";
import { getTokenVesting, getMultisigWallet, getFundsDistributorFactory, getFundsDistributor, getReserves, getEPNSToken, getVestedReserves } from '../contracts'
import { displayAmount, tokensToBn } from '../utils'
import { addresses, abis } from "@project/contracts";

import { ContractLink, TransactionLink } from './Links'
import Emoji from './Emoji'
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import FundsDistributorCard from "./FundsDistributorCard";
import FundsDistributorFactoryCard from "./FundsDistributorFactoryCard";
import VestedReservesCard from "./VestedReservesCard";

const AdminPanel = () => {
  const [ canRevoke, setRevoke ] = React.useState(true);
  const [ multisigAddress, setMultisigAddress ] = React.useState("");
  const [ multisigContract, setMultisigContract ] = React.useState(null);
  const [ revokeFundsDistributorFactory, setRevokeFundsDistributorFactory ] = React.useState(addresses.fundsDistributorFactory.advisorsFactory);
  const [ releaseVestingAddress, setReleaseVestingAddress ] = React.useState("");
  const [ revokeVestingAddress, setRevokeVestingAddress ] = React.useState("");
  const [ recipientAddress, setRecipientAddress ] = React.useState("");
  const [ transferAmount, setTransferAmount ] = React.useState(0);
  const [ commUnlockedReservesBalance, setCommUnlockedReservesBalance ] = React.useState(0);

  const [ confirmMultisigTxID, setConfirmMultisigTxID ] = React.useState("");
  const [ executeMultisigTxID, setExecuteMultisigTxID ] = React.useState("");
  const [ revokeMultisigTxID, setRevokeMultisigTxID ] = React.useState("");

  const [ loader, setLoader ] = React.useState(false)

  const { active, error, account, library, chainId } = useWeb3React();

  function startLoader() {
    setLoader(true)
  }

  function stopLoader() {
    setLoader(false)
  }

  async function onRelease() {
    try {
      const tokenVesting = await getTokenVesting(releaseVestingAddress, library, account);
      const data = (await tokenVesting.populateTransaction.release(addresses.epnsToken)).data
      startLoader()

      const tx = await multisigContract.submitTransaction(tokenVesting.address, 0, data);

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

  async function onMultisigConfirm() {
    try {
      const multisigContractInstance = await getMultisigWallet(addresses.epnsMultisig, library, account);
      startLoader()

      const tx = await multisigContractInstance.confirmTransaction(confirmMultisigTxID);

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

  async function onMultisigExecute() {
    try {
      const multisigContractInstance = await getMultisigWallet(addresses.epnsMultisig, library, account);
      startLoader()

      const tx = await multisigContractInstance.executeTransaction(executeMultisigTxID);

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

  async function onMultisigRevoke() {
    try {
      const multisigContractInstance = await getMultisigWallet(addresses.epnsMultisig, library, account);
      startLoader()

      const tx = await multisigContractInstance.revokeTransaction(revokeMultisigTxID);

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

  async function onRevoke() {
    try {
      const fundsDistributorFactoryInstance = await getFundsDistributorFactory(revokeFundsDistributorFactory, library, account);
      const data = (await fundsDistributorFactoryInstance.populateTransaction.revokeFundeeTokens(revokeVestingAddress)).data

      startLoader()

      const tx = await multisigContract.submitTransaction(fundsDistributorFactoryInstance.address, 0, data);

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

  async function onTransferTokens() {
    try {
      const commUnlockedReserves = await getReserves(library, account);
      const data = (await commUnlockedReserves.populateTransaction.transferTokensToAddress(recipientAddress, tokensToBn(transferAmount))).data

      startLoader()

      const tx = await multisigContract.submitTransaction(commUnlockedReserves.address, 0, data);

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

  async function setMultisigInstance() {
    try {
      startLoader()
      if(multisigAddress == "" || multisigAddress.length < 42){
        toast.dark("Invalid Values. Please enter correct multisig address", {
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
      const multisigContract = await getMultisigWallet(multisigAddress, library, account);
      setMultisigContract(multisigContract);
      toast.dark("Multisig Account Set", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      startLoader()
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

      const getCommReservesBalance = async () => {
        const balance = await epnsToken.balanceOf(addresses.commUnlockedReserves);
        setCommUnlockedReservesBalance(balance);
      }

      getCommReservesBalance();
    } catch (error) {
      toast.dark("Something went wrong fetching Unlocked Community Reserves Balance", {
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
     <Container>
      <TitleLink>ADMIN PANEL</TitleLink>
        <Action>
          <Label>Set Multisig Address (If POA)</Label>
          <Input placeholder="Enter Multisig Address" onChange={(e) => setMultisigAddress(e.target.value)} />
          <Button onClick={setMultisigInstance}>Set Address</Button>
        </Action>
          {
            multisigContract ? (
              <><center><CardTitle>Multisig Address Set - </CardTitle><span>{multisigContract.address}</span></center></>
            ): null
          }

        <Card>
          <CardTitle>Manage Multisig Signing</CardTitle>
          <Action>
            <Label>Confirm & Execute Transaction</Label>
            <Input placeholder="Multisig Id to Confirm" onChange={(e) => setConfirmMultisigTxID(e.target.value)} />
            <Button onClick={onMultisigConfirm}>Confirm</Button>
          </Action>
          <Action>
            <Label>Execute Transaction</Label>
            <Input placeholder="Multisig Id to Execute" onChange={(e) => setExecuteMultisigTxID(e.target.value)} />
            <Button onClick={onMultisigExecute}>Confirm</Button>
          </Action>
          <Action>
            <Label>Revoke Transaction</Label>
            <Input placeholder="Multisig Id to Revoke" onChange={(e) => setRevokeMultisigTxID(e.target.value)} />
            <Button onClick={onMultisigRevoke}>Revoke</Button>
          </Action>
        </Card>

        <Card>
          <CardTitle>Manage Vesting</CardTitle>
          <Action>
            <Label>Release to Beneficiary Address</Label>
            <Input placeholder="Enter Vesting Contract Address" onChange={(e) => setReleaseVestingAddress(e.target.value)} />
            <Button onClick={onRelease}>Release</Button>
          </Action>
          <Action>
            <Label>Revoke Vesting Tokens</Label>
            <Select value={revokeFundsDistributorFactory} onChange={(e) => setRevokeFundsDistributorFactory(e.target.value)}>
              <option value={addresses.fundsDistributorFactory.advisorsFactory}>Advisors</option>
              <option value={addresses.fundsDistributorFactory.teamFactory}>Team</option>
              <option value={addresses.fundsDistributorFactory.investorsAllocationFactory}>Investors</option>
              <option value={addresses.fundsDistributorFactory.strategicAllocationFactory}>Strategic</option>
            </Select>
            <Input placeholder="Enter Vesting Contract Address" onChange={(e) => setRevokeVestingAddress(e.target.value)} />
            <Button onClick={onRevoke}>Revoke</Button>
          </Action>
        </Card>

        <VestedReservesCard name={"Community Reserves"} contract={getVestedReserves(addresses.vestedReserves.commReserves, library, account)} multisigContract={multisigContract} />

        <Card>
          <CardTitle>Manage Unlocked Reserves</CardTitle>
          <Label>Amount of Tokens Left - {displayAmount(commUnlockedReservesBalance)}</Label>
          <Action>
            <Label>Transfer Tokens to Address</Label>
            <Input placeholder="Recipient Address" onChange={(e) => setRecipientAddress(e.target.value)} />
            <Input placeholder="Amount to Transfer" onChange={(e) => setTransferAmount(e.target.value)} />
            <Button onClick={onTransferTokens}>Submit</Button>
          </Action>
        </Card>

        <FundsDistributorCard name={"Deploy Funds Distributor"} contract={getFundsDistributor(library, account)} />

        <FundsDistributorFactoryCard name={"Advisors"} contract={getFundsDistributorFactory(addresses.fundsDistributorFactory.advisorsFactory, library, account)} multisigContract={multisigContract} />
        <FundsDistributorFactoryCard name={"Team"} contract={getFundsDistributorFactory(addresses.fundsDistributorFactory.teamFactory, library, account)} multisigContract={multisigContract} />
        <FundsDistributorFactoryCard name={"Investors"} contract={getFundsDistributorFactory(addresses.fundsDistributorFactory.investorsAllocationFactory, library, account)} multisigContract={multisigContract} />
        <FundsDistributorFactoryCard name={"Strategic"} contract={getFundsDistributorFactory(addresses.fundsDistributorFactory.strategicAllocationFactory, library, account)} multisigContract={multisigContract} />
    </Container>
  )
}

const Select = styled.select`
  border: 0px;
  outline: 0px;
  border-bottom: 1px solid #ddd;
`;

const CardTitle = styled.span`
  color: #e20880;
  font-size: larger;
  font-weight: bold;
`;

const Action = styled.div`
  display: flex;
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
  flex: 1;
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

export default AdminPanel
