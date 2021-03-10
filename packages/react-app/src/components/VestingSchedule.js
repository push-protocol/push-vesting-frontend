import React from "react";
import VestingChart from "./VestingChart";
import Emoji from "./Emoji";

const VestingSchedule = ({ details }) => {
  return (
    <div>
      <h4>Vesting schedule</h4>
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

export default VestingSchedule;
