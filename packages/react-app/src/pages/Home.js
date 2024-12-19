import React, { useCallback } from "react";
import ReactGA from 'react-ga';

import styled, { css } from 'styled-components';

import { useWeb3React } from '@web3-react/core'
import { addresses, abis } from "@project/contracts";

import TokenVestingApp from "../components/TokenVestingApp";
import AdminPanel from "../components/AdminPanel";
import YieldFarming from 'segments/YieldFarming';

import ChannelsDataStore, { ChannelEvents } from "singletons/ChannelsDataStore";
import UsersDataStore, { UserEvents } from "singletons/UsersDataStore";

// Create Header
function Home({ setBadgeCount, bellPressed }) {
  ReactGA.pageview('/home');

  const { active, error, account, library, chainId } = useWeb3React();

  const [controlAt, setControlAt] = React.useState(0);

  React.useEffect(() => {
    // Reset when account refreshes
    userClickedAt(0);
  }, []);


  // handle user action at control center
  const userClickedAt = (controlIndex) => {
    setControlAt(controlIndex);
  }

  const isAccountAdmin = () => {
    if (account == "0xFbA7Df351ADD4E79099f63E33b2679EDFDD5e2aB" ||
        account == "0x0ec9990fFdA6484B6047ed874f173fbD37f939F7" ||
        account == "0x2E06acc49D2B0724a3681B6b0C264a74786C98d5" ||
        account == "0x742D46D44E627375F7439CFC9042bB48A47A8C0A" ||
        account == "0x3054C63304548F8477A734DA36077bE6a983DCaD") {
      return true;
    }

    return false;
  }

  // Render
  return (
    <Container>
      <Controls>
        {/* <ControlButton index={0} active={controlAt == 0 ? 1 : 0} border="#e20880"
          onClick={() => {
            userClickedAt(0)
          }}
        >
          <ControlImage src="./svg/yield.svg" active={controlAt == 0 ? 1 : 0} />
          <ControlText active={controlAt == 0 ? 1 : 0}>Yield Farming</ControlText>
        </ControlButton> */}

        <ControlButton index={0} active={controlAt == 0 ? 1 : 0} border="#35c5f3"
          onClick={() => {
            userClickedAt(0)
          }}
        >
          <ControlImage src="./svg/investor.svg" active={controlAt == 0 ? 1 : 0} />
          <ControlText active={controlAt == 0 ? 1 : 0}>Investors</ControlText>
        </ControlButton>

        <ControlButton index={1} active={controlAt == 1 ? 1 : 0} border="#674c9f"
          onClick={() => {
            userClickedAt(1)
          }}
        >
          <ControlImage src="./svg/advisor.svg" active={controlAt == 1 ? 1 : 0} />
          <ControlText active={controlAt == 1 ? 1 : 0}>Advisors/Team</ControlText>
        </ControlButton>

        {isAccountAdmin() &&
          <>
            <ControlButton index={2} active={controlAt == 2 ? 1 : 0} border="#e20880"
              onClick={() => {
                userClickedAt(2)
              }}
            >
              <ControlImage src="./svg/channeladmin.svg" active={controlAt == 2 ? 1 : 0} />
              <ControlText active={controlAt == 2 ? 1 : 0}>Foundation</ControlText>
            </ControlButton>

            <ControlButton index={3} active={controlAt == 3 ? 1 : 0} border="#e20880"
              onClick={() => {
                userClickedAt(3)
              }}
            >
              <ControlImage src="./svg/channeladmin.svg" active={controlAt == 3 ? 1 : 0} />
              <ControlText active={controlAt == 3 ? 1 : 0}>Admin Controls</ControlText>
            </ControlButton>
          </>
        }
      </Controls>

      <Interface>
        {/* {controlAt == 0 &&
          <YieldFarming />
        } */}
        {controlAt == 0 &&
          <TokenVestingApp multipleVesting={true} vestingAddresses={null} loaderTheme="#35c5f3" loadAPR={true} actionable={() => userClickedAt(0)} />
        }
        {controlAt == 1 &&
          <TokenVestingApp multipleVesting={false} vestingAddresses={null} loaderTheme="#674c9f" loadAPR={true} actionable={() => userClickedAt(0)} />
        }
        {controlAt == 2 && isAccountAdmin() &&
          <TokenVestingApp multipleVesting={true} vestingAddresses={[addresses.vestedReserves.foundationA, addresses.vestedReserves.foundationB]} loaderTheme="#e20880" loadAPR={false} actionable={null} />
        }
        {controlAt == 3 && isAccountAdmin() &&
          <AdminPanel />
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
