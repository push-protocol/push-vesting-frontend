import React from "react";
import { ContractLink, TokenLink } from "./Links";
import styled, { css } from "styled-components";

const Header = ({ address, token, tokenName }) => {
  return (
    <header className="header">
      <div className="contracts">
        <HeaderStyle>Vesting address: <ContractLink address={address} /></HeaderStyle>
        <span>
          For <TokenLink address={token} name={tokenName} /> token
        </span>
      </div>
    </header>
  );
};

const HeaderStyle = styled.h3`
  color: rgba(0, 0, 0, 0.5);
  font-weight: 300;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: "Source Sans Pro", Helvetica, sans-serif;
  text-align: inherit;
}
`;

export default Header;
