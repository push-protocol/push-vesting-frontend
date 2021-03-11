import React from "react";
import ReactGA from 'react-ga';

import styled, { css } from 'styled-components';

import { useWeb3React } from '@web3-react/core'
import TokenVestingApp from "../components/TokenVestingApp";


// Create Header
function Home({ setBadgeCount, bellPressed }) {
  ReactGA.pageview('/home');

  const { active, error, account, library, chainId } = useWeb3React();

  const [controlAt, setControlAt] = React.useState(0);

  React.useEffect(() => {
    // Reset when account refreshes
    userClickedAt(3);

  }, []);

  // handle user action at control center
  const userClickedAt = (controlIndex) => {
    setControlAt(controlIndex);
  }

  // Render
  return (
    <Container>
      <Controls>
        <ControlButton index={3} active={controlAt == 3 ? 1 : 0} border="#e20880"
          onClick={() => {
            userClickedAt(3)
          }}
        >
          <ControlImage src="./svg/channeladmin.svg" active={controlAt == 3 ? 1 : 0} />
          <ControlText active={controlAt == 3 ? 1 : 0}>Vesting Details</ControlText>
        </ControlButton>
      </Controls>
      <Interface>
        {controlAt == 3 &&
          <TokenVestingApp address={"0xD2f08fAFc6211aF7240b18ca67067f51E6203960"} token={"0xEC4c1C91cEE6C5764c7587E94792a7cBF2Bd053E"} />
        }
      </Interface>
    </Container>
  );
}

// css style
const Container = styled.div`
  flex: 1;
  display: block;
  flex-direction: column;
  min-height: calc(100vh - 100px);
`

const Controls = styled.div`
  flex: 0;
  display: flex;
  flex-direction: row;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

const ControlButton = styled.div`
  flex: 1 1 21%;
  height: 120px;
  min-width: 200px;
  background: #fff;

  box-shadow: 0px 15px 20px -5px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  border: 1px solid rgb(225,225,225);

  border-bottom: 10px solid rgb(180,180,180);
  margin: 20px;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  border-bottom: 10px solid ${(props) => props.active ? props.border : "rgb(180,180,180)"};

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
`

const ControlImage = styled.img`
  height: 30%;
  margin-right: 15px;
  filter: ${(props) => props.active ? "brightness(1)" : "brightness(0)"};
  opacity: ${(props) => props.active ? "1" : "0.25"};

  transition: transform .2s ease-out;
  ${ props => props.active && css`
    transform: scale(3.5) translate(-20px, 0px);
    opacity: 0.4;
  `};
`

const ControlText = styled.label`
  font-size: 16px;
  font-weight: 200;
  opacity: ${(props) => props.active ? "1" : "0.75"};

  transition: transform .2s ease-out;
  ${ props => props.active && css`
    transform: scale(1.3) translate(-10px, 0px);
  `};
`

const Interface = styled.div`
  flex: 1;
  display: flex;

  box-shadow: 0px 15px 20px -5px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  border: 1px solid rgb(225,225,225);

  margin: 15px;
  overflow: hidden;
`

// Export Default
export default Home;
