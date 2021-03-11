import React from "react";
import VestingChart from "./VestingChart";
import Emoji from "./Emoji";
import styled, { css } from "styled-components";

const VestingSchedule = ({ details }) => {
  return (
    <div>
      <ChannelTitleLink>VESTING SCHEDULE</ChannelTitleLink>
      {!details.revoked ? (
        details.total > 0 ? (
          <VestingChart details={details} />
        ) : (
          <Empty />
        )
      ) : (
        <Revoked />
      )}
    </div>
  );
};

const Empty = () => {
  return (
    <div className="warning">
      <span className="warning-message">
        <Emoji e="⚠️" /> No funds in the contract
      </span>
      <VestingChart details={{}} />
    </div>
  );
};

const Revoked = () => {
  return (
    <div className="warning">
      <span className="warning-message">
        <Emoji e="⚠️" /> Revoked
      </span>
      <VestingChart details={{}} />
    </div>
  );
};

const ChannelTitleLink = styled.h4`
  text-decoration: none;
  font-weight: 600;
  color: #e20880;
  font-size: 20px;
`


export default VestingSchedule;
