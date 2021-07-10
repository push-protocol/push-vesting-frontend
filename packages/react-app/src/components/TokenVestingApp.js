import React, { useEffect, useState, useCallback } from "react";
import styled, { css } from "styled-components";
import { Section, Content, Item, ItemH } from 'components/SharedStyling';

import { getTokenVesting, getEPNSToken, getMultisigWallet } from "../contracts";

import Header from "./Header";
import VestingDetails from "./VestingDetails";
import VestingSchedule from "./VestingSchedule";
import VestingActions from "./VestingActions";

import Loader from "react-loader-spinner";

import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { addresses, abis } from "@project/contracts";
import { queryVestingLink, queryVestingLinkMultiple } from "../utils";
import { toast } from 'react-toastify';

const TokenVestingApp = ({ multipleVesting, vestingAddresses, loaderTheme, loadAPR, actionable }) => {
  const [ details, setDetails ] = useState(null);
  const [ isSearchingVesting, setIsSearchingVesting ] = React.useState(true)
  const [ loading, setLoader ] = useState(true);
  const { active, error, account, library, chainId } = useWeb3React();
  const [ vestingAddress, setVestingAddress ] = React.useState(vestingAddresses);
  const [ vesting1, setVesting1 ] = React.useState(true);
  const [ vesting2, setVesting2 ] = React.useState(false);
  const [ manualVestingAddress, setManualVestingAddress ] = React.useState('');
  const [ manualBeneficiaryAddress, setManualBeneficiaryAddress ] = React.useState('');
  const [ multisigAddress, setMultisigAddress ] = React.useState("");
  const [ multisigContract, setMultisigContract ] = React.useState(null);

  const getVestingLink = useCallback(async () => {
    if(!vestingAddresses){
      try {
        setIsSearchingVesting(true)
        setLoader(true)
        if(!multipleVesting){
          const vestingContractAddress = await queryVestingLink(library, account)
          setVestingAddress(vestingContractAddress);
        } else {
          const vestingContractAddresses = await queryVestingLinkMultiple(library, account)
          setVestingAddress(vestingContractAddresses);
        }
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
    }
  }, [account])

  const getVestingLinkFromAddress = async () => {
    try {
      setIsSearchingVesting(true)
      setLoader(true)
      if(!multipleVesting){
        const vestingContractAddress = await queryVestingLink(library, manualBeneficiaryAddress)
        setVestingAddress(vestingContractAddress);
      } else {
        const vestingContractAddresses = await queryVestingLinkMultiple(library, manualBeneficiaryAddress)
        setVestingAddress(vestingContractAddresses);
      }
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
  }

  const getData = useCallback(async () => {
    try {
      if(vestingAddress){
        setLoader(true)
        let tokenVesting, tokenContract;
        let start, end, cliff, total, released, vested, decimals, beneficiary, owner, revocable, revoked, name, symbol, duration, balance;
        let details = [];

        for(var i = 0; i<vestingAddress.length; i++){
          tokenVesting = getTokenVesting(vestingAddress[i], library, account);
          tokenContract = getEPNSToken(library, account);

          start = await tokenVesting.start();
          duration = await tokenVesting.duration();
          end = start.add(duration);
          balance = await tokenContract.balanceOf(vestingAddress[i]);
          released = await tokenVesting.released(addresses.epnsToken);
          total = balance.add(released);

          cliff = await tokenVesting.cliff();
          decimals = await tokenContract.decimals();
          beneficiary = await tokenVesting.beneficiary();
          owner = await tokenVesting.owner();
          revocable = await tokenVesting.revocable();
          revoked = await tokenVesting.revoked(addresses.epnsToken);
          name = await tokenContract.name();

          symbol = await tokenContract.symbol();
          vested = await tokenVesting.vestedAmount(addresses.epnsToken);

          details.push(
            {
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
            }
          )

        }

        setDetails(details)
        setLoader(false);
      } else {
        setLoader(false)
        setDetails(null)
      }
    } catch (e) {
      toast.dark("Something went wrong", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoader(false);
    }
  }, [vestingAddress]);

  async function setMultisigInstance() {
    try {
      setLoader(true);
      if(multisigAddress == "" || multisigAddress.length < 42){
        toast.dark("Invalid Values. Please enter correct multisig address", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        return
      }
      const multisigContract = await getMultisigWallet(multisigAddress, library, account);
      setMultisigContract(multisigContract);
      toast.dark("Multisig Account Set", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoader(false);
    } catch (e) {
      toast.dark(e.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoader(false);
    }
  }

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    getVestingLink();
  }, [getVestingLink])

  return (
    <Section>
      <Content>
        <Item>
          {loading ?
            <Loader type="Oval" color={loaderTheme ? loaderTheme : "#e20880"} height={40} width={40} /> :
            null
          }
          {
            !isSearchingVesting && vestingAddress == null ? (
              <Item self="stretch" align="stretch" padding="10px 40px">
                <center>
                  <h4>No Vesting Contract found for this address</h4>
                  <h2>OR</h2>
                </center>
                <Action>
                  <Label>Enter Beneficiary Address Manually</Label>
                  <Input placeholder="Beneficiary Address" onChange={(e) => setManualBeneficiaryAddress(e.target.value)} />
                  <Button onClick={() => getVestingLinkFromAddress()}>Submit</Button>
                </Action>
                <center>
                  <h2>OR</h2>
                </center>
                <Action>
                  <Label>Enter Vesting Address Manually</Label>
                  <Input placeholder="Vesting Address" onChange={(e) => {setManualVestingAddress(e.target.value)}} />
                  <Button onClick={() => setVestingAddress([manualVestingAddress])}>Submit</Button>
                </Action>
              </Item>
            ) : null
          }
          {details &&
            <Item self="stretch" align="stretch" padding="10px 0px">
              <Item self="stretch" align="stretch" padding="10px 25px">
                <Action>
                  <Label>Set Multisig Address (If POA)</Label>
                  <Input placeholder="Enter Multisig Address" onChange={(e) => setMultisigAddress(e.target.value)} />
                  <Button onClick={setMultisigInstance}>Set Address</Button>
                </Action>

                {multisigContract &&
                  <>
                    <center><CardTitle>Multisig Address Set - </CardTitle><span>{multisigContract.address}</span></center>
                  </>
                }
              </Item>

              <Item self="stretch" align="stretch" padding="10px 25px">
                {multipleVesting &&
                  <ItemH self="flex-start">
                    <Input type="radio" id="vesting1" checked={vesting1} onChange={() => {
                      setVesting1(true)
                      setVesting2(false)
                    }} />
                    <label for="vesting1">Vesting 1</label>
                    <Input type="radio" id="vesting2" checked={vesting2} onChange={() => {
                      setVesting1(false)
                      setVesting2(true)
                    }}  />
                    <label for="vesting2">Vesting 2</label>
                  </ItemH>
                }

                {multipleVesting && vesting1 && vestingAddress.length > 0 &&
                  <>
                    <Header address={vestingAddress[0]} token={addresses.epnsToken} tokenName={"$PUSH"} />
                    <VestingDetails
                      address={vestingAddress[0]}
                      token={addresses.epnsToken}
                      details={details[0]}
                      getData={getData}
                      setLoader={setLoader}
                    />
                    <VestingSchedule details={details[0]} />
                  </>
                }

                {multipleVesting && vesting2 && vestingAddress.length > 0 &&
                  <>
                    <Header address={vestingAddress[1]} token={addresses.epnsToken} tokenName={"$PUSH"} />
                    <VestingDetails
                      address={vestingAddress[1]}
                      token={addresses.epnsToken}
                      details={details[1]}
                      getData={getData}
                      setLoader={setLoader}
                    />
                    <VestingSchedule details={details[1]} />
                  </>
                }

                {!multipleVesting &&
                  <>
                    <Header address={vestingAddress[0]} token={addresses.epnsToken} tokenName={"$PUSH"} />
                    <VestingDetails
                      address={vestingAddress[0]}
                      token={addresses.epnsToken}
                      details={details[0]}
                      getData={getData}
                      setLoader={setLoader}
                    />
                    <VestingSchedule details={details[0]} />
                  </>
                }
              </Item>

              <Item self="stretch" align="stretch" padding="10px 0px">
                {multipleVesting &&
                  <>
                  {vesting1 && vestingAddress.length > 0 &&
                    <VestingActions multisigContract={multisigContract} address={vestingAddress[0]} token={addresses.epnsToken} setLoader={setLoader} getData={getData} loaderTheme={loaderTheme} loadAPR={loadAPR} actionable={actionable} />
                  }

                  {vesting2 && vestingAddress.length > 0 &&
                    <VestingActions multisigContract={multisigContract} address={vestingAddress[1]} token={addresses.epnsToken} setLoader={setLoader} getData={getData} loaderTheme={loaderTheme} loadAPR={loadAPR} actionable={actionable} />
                  }
                  </>
                }

                {!multipleVesting &&
                  <VestingActions loadAPR={loadAPR} multisigContract={multisigContract} address={vestingAddress[0]} token={addresses.epnsToken} setLoader={setLoader} getData={getData} loaderTheme={loaderTheme} loadAPR={loadAPR} actionable={actionable} />
                }
              </Item>

            </Item>
          }
        </Item>
      </Content>
    </Section>
  );
};

const CardTitle = styled.span`
  color: #e20880;
  font-size: larger;
  font-weight: bold;
`;

const Action = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
`;

const Label = styled.span`
  flex: 1;
  align-self: center;
  font-weight: bold;
`;

const Input = styled.input`
  border: 0px;
  outline: 0px;
  border-bottom: 1px solid #ddd;
  margin: 25px 10px;
  padding: 5px;
  flex: 1;
`;

const Button = styled.button`
  width: 100px;
  height: 35px;
  align-self: center;
  border: 0;
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 15px;
  margin: 10px;
  color: #fff;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 400;
  position: relative;
  background: #e20880;
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
  ${ props => props.disabled && css`
    &:hover {
      opacity: 1;
      cursor: default;
      pointer: default;
    }
    &:active {
      opacity: 1;
      cursor: default;
      pointer: default;
    }
  `}
`;

const Container = styled.div`
  //display: flex;
  padding: 0.75rem;
`;

export default TokenVestingApp;
