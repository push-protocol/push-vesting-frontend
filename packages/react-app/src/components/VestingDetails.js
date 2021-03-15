import React, { Component } from 'react'
import moment from 'moment'

import styled, { css } from "styled-components";
import { getTokenVesting } from '../contracts'
import { displayAmount } from '../utils'

import { ContractLink, TransactionLink } from './Links'
import Emoji from './Emoji'
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { toast } from 'react-toastify';

const VestingDetails = ({ address, token, details, getData, setLoader }) => {
  const [ canRevoke, setRevoke ] = React.useState(true);
  const { active, error, account, library, chainId } = useWeb3React();
  const { start, cliff, end, total, released, vested, revocable, beneficiary } = details
  const releasable = vested ? vested.sub(released) : null
  
  function formatDate(date) {
    if (! date) return
    const milliseconds = date * 1000
    return moment(milliseconds).format("dddd, MMMM Do YYYY, h:mm:ss a")
  }

  function formatTokens(amount) {
    if (amount == null) return
    const { decimals, symbol } = details
    const display = displayAmount(amount, decimals)
    return `${display} ${symbol}`
  }

  function startLoader() {
    setLoader(true)
  }

  function stopLoader() {
    setLoader(false)
  }

  async function onRelease() {
    const tokenVesting = await getTokenVesting(address, library, account);

    try {
      startLoader()
      const tx = await tokenVesting.release(token)
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

  // async function onRevoke() {
  //   const tokenVesting = await getTokenVesting(address, library, account);

  //   try {
  //     startLoader()
  //     await tokenVesting.revoke(token, { from: account })
  //     getData()
  //   } catch (e) {
  //     stopLoader()
  //   }
  // }

  return (
     <div className="details">
      <ChannelTitleLink>VESTING DETAILS</ChannelTitleLink>
      <table>
        <tbody>
          <TableRow title="Beneficiary">
            <ContractLink address={ beneficiary } />
          </TableRow>

          <TableRow title="Start date">
            { formatDate(start) }
          </TableRow>
          
          <TableRow title="Cliff">
            { formatDate(cliff) }
          </TableRow>
          
          <TableRow title="End date">
            { formatDate(end) }
          </TableRow>
          
          <TableRow title="Total vesting">
            { formatTokens(total) }
          </TableRow>
          
          <TableRow title="Already vested">
            { formatTokens(vested) }
          </TableRow>
          
          <TableRow title="Already released">
            { formatTokens(released) }
          </TableRow>
          
          <TableRow title="Releasable">
              { formatTokens(releasable) }
          </TableRow>
          <TableRow title="" >
            <Button onClick={onRelease}>
              Release Vested Tokens
            </Button>
          </TableRow>

          {/* <TableRow title="Revocable">
            <Revocable revocable={ revocable } canRevoke={ canRevoke } onRevoke={ () => onRevoke() } />
          </TableRow> */}
        </tbody>
      </table>
    </div>
  )

  
}


const TableRow = ({ title, children }) => {
  return (
    <tr>
      <th>{ title }</th>
      <td>
        { children }
      </td>
    </tr>
  )
}

// const Revocable = ({ revocable, onRevoke, canRevoke }) => {
//   if (! revocable) return <Emoji e="❌" />

//   return <span>
//     <Emoji e="✅" />
//     { canRevoke ? <a className="action" onClick={ onRevoke }>revoke</a> : null }
//   </span>
// }


// const Releasable = ({ releasable, onRelease, children }) => {
//   return <span>
//     { children }
//     { releasable > 0 ? <a className="action" onClick={ onRelease }>release</a> : null }
//   </span>
// }


const Button = styled.button`
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

const ChannelTitleLink = styled.h4`
  text-decoration: none;
  font-weight: 600;
  color: #e20880;
  font-size: 20px;
`

export default VestingDetails