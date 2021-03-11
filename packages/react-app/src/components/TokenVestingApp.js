import React, { useEffect, useState, useCallback } from "react";
import styled, { css } from "styled-components";

import { getTokenVesting, getSimpleToken } from "../contracts";

import Header from "./Header";
import VestingDetails from "./VestingDetails";
import VestingSchedule from "./VestingSchedule";
import Spinner from "./Spinner";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";

const TokenVestingApp = ({ address, token }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoader] = useState(true);
  const { active, error, account, library, chainId } = useWeb3React();

  const getData = useCallback(async () => {
    const tokenVesting = await getTokenVesting(address, library, account);
    const tokenContract = await getSimpleToken(token, library, account);
    const start = await tokenVesting.start();
    const duration = await tokenVesting.duration();
    const end = start.add(duration);

    const balance = await tokenContract.balanceOf(address);
    const released = await tokenVesting.released(token);
    const total = balance.add(released);

    const cliff = await tokenVesting.cliff();
    const decimals = await tokenContract.decimals();
    const beneficiary = await tokenVesting.beneficiary();
    const owner = await tokenVesting.owner();
    const revocable = await tokenVesting.revocable();
    const revoked = await tokenVesting.revoked(token);
    const name = await tokenContract.name();
    const symbol = await tokenContract.symbol();
    const vested = await tokenVesting.vestedAmount(token);
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
  }, [address]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div>
      <Header address={address} token={token} tokenName={"$PUSH"} />

      {details ? (
        <Container>
          {loading ? <Spinner /> : null}

          <VestingDetails
            address={address}
            token={token}
            details={details}
            getData={getData}
            setLoader={setLoader}
          />
          <VestingSchedule details={details} />
        </Container>
      ) : null}
    </div>
  );
};

const Container = styled.div`
  // display: flex;
  padding: 2rem;
`;

export default TokenVestingApp;
