import React from "react";
import { ContractLink, TokenLink } from "./Links";

const Header = ({ address, token, tokenName }) => {
  return (
    <header className="header">
      <div className="contracts">
        <h3>
          Vesting address: <ContractLink address={address} />
        </h3>
        <span>
          For <TokenLink address={token} name={tokenName} /> token
        </span>
      </div>
    </header>
  );
};

export default Header;
