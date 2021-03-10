import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import moment from 'moment'

import { getTokenVesting } from '../contracts'
import { displayAmount } from '../utils'

import { ContractLink } from './Links'
import Emoji from './Emoji'
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";

const VestingDetails = ({ address, token, details, getData, setLoader }) => {
  const [ canRevoke, setRevoke ] = React.useState(true);
  const { active, error, account, library, chainId } = useWeb3React();
  const { start, cliff, end, total, released, vested, revocable, beneficiary } = details
  const releasable = vested ? vested.sub(released) : null
  
  // React.useEffect(() => {
  //   const { owner, revoked } = nextProps.details

  //   const isOwner = accounts[0]
  //     ? owner === accounts[0].toLowerCase()
  //     : undefined

  //   setState({ accounts, canRevoke: isOwner && ! revoked })
  // })

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
      await tokenVesting.release(token, { from: account })
      getData()
    } catch (e) {
      stopLoader()
    }
  }

  async function onRevoke() {
    const tokenVesting = await getTokenVesting(address, library, account);

    try {
      startLoader()
      await tokenVesting.revoke(token, { from: account })
      getData()
    } catch (e) {
      stopLoader()
    }
  }

  return (
     <div className="details">
      <h4>Vesting details</h4>
      <Table striped bordered condensed>
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

          {/* <TableRow title="Revocable">
            <Revocable revocable={ revocable } canRevoke={ canRevoke } onRevoke={ () => onRevoke() } />
          </TableRow> */}
        </tbody>
      </Table>
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

export default VestingDetails