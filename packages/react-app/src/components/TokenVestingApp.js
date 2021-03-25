import React, { useEffect, useState, useCallback } from "react";
import styled, { css } from "styled-components";

import { getTokenVesting, getSimpleToken } from "../contracts";

import Header from "./Header";
import VestingDetails from "./VestingDetails";
import VestingSchedule from "./VestingSchedule";
import VestingActions from "./VestingActions";
import Spinner from "./Spinner";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { addresses, abis } from "@project/contracts";
import { queryVestingLink } from "../utils";
import { toast } from 'react-toastify';

const TokenVestingApp = () => {
  const [details, setDetails] = useState(null);
  const [ isSearchingVesting, setIsSearchingVesting ] = React.useState(true)
  const [loading, setLoader] = useState(true);
  const { active, error, account, library, chainId } = useWeb3React();
  const [ vestingAddress, setVestingAddress ] = React.useState('');

  const getVestingLink = useCallback(async () => {
    try {
      setIsSearchingVesting(true)
      setLoader(true)
      const vestingContractAddress = await queryVestingLink(library, account)
      setVestingAddress(vestingContractAddress);
      setLoader(false)
      setIsSearchingVesting(false)
    } catch (error) {
      toast.dark('Some error occured, please try again later', {
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

  const getData = useCallback(async () => {
    if(vestingAddress != ''){
      setLoader(true)
      const tokenVesting = await getTokenVesting(vestingAddress, library, account);
      const tokenContract = await getSimpleToken(library, account);

      const start = await tokenVesting.start();
      const duration = await tokenVesting.duration();
      const end = start.add(duration);
      const balance = await tokenContract.balanceOf(vestingAddress);
      const released = await tokenVesting.released(addresses.epnsToken);
      const total = balance.add(released);

      const cliff = await tokenVesting.cliff();
      const decimals = await tokenContract.decimals();
      const beneficiary = await tokenVesting.beneficiary();
      const owner = await tokenVesting.owner();
      const revocable = await tokenVesting.revocable();
      const revoked = await tokenVesting.revoked(addresses.epnsToken);
      const name = await tokenContract.name();

      const symbol = await tokenContract.symbol();
      const vested = await tokenVesting.vestedAmount(addresses.epnsToken);
      // const vested = 1
      setDetails({
        start,
        end,
        cliff,
        total,
        released,
        vested,
        decimals,
        beneficiary,
        owner,
        revocable,
        revoked,
        name,
        symbol,
        loading: false,
      });

      setLoader(false);
    } else {
      setLoader(false)
      setDetails(null)
    }
  }, [vestingAddress]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    getVestingLink();
  }, [getVestingLink])

  return (
    <Container>
      {loading ? <Spinner /> : null}
      {
        !isSearchingVesting && vestingAddress == '' ? (
          <Container>
            No Vesting Contract found for this address
          </Container>
        ) : null
      }
      {details ? (

      <>
        <Header address={vestingAddress} token={addresses.epnsToken} tokenName={"$PUSH"} />
        <Container>
          <VestingDetails
            address={vestingAddress}
            token={addresses.epnsToken}
            details={details}
            getData={getData}
            setLoader={setLoader}
          />
          <VestingSchedule details={details} />
          <VestingActions address={vestingAddress} token={addresses.epnsToken} setLoader={setLoader} getData={getData} />
        </Container>
      </>
      ) : null}
    </Container>
  );
};

const Container = styled.div`
  // display: flex;
  padding: 0.75rem;
  width: 100%;
`;

export default TokenVestingApp;
