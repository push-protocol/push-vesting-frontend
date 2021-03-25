import React from "react";
import VestingChart from "./VestingChart";
import Emoji from "./Emoji";
import styled, { css } from "styled-components";

const VestingSchedule = ({ details }) => {
  return (
    <div>
      <TitleLink>VESTING SCHEDULE</TitleLink>
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

const TitleLink = styled.h4`
  text-decoration: none;
  font-weight: 600;
  color: #e20880;
  font-size: 20px;
  text-align: center;
`


export default VestingSchedule;
