import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Countdown from "react-countdown";
import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button, CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  mintOneToken,
  getCandyMachineState,
} from "./candy-machine";
import { useConnection } from "@oyster/common";
import { Col, Layout, Row } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";

// const ConnectButton = styled(WalletDialogButton)``;

const CounterText = styled.span``; // add your styles here

const MintContainer = styled.div``; // add your styles here

const MintButton = styled(Button)``; // add your styles here

const CenterCol = styled(Col)`
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items: center
`;

const treasury = new anchor.web3.PublicKey(
    process.env.REACT_APP_TREASURY_ADDRESS!
  );

const config = new anchor.web3.PublicKey(
    process.env.REACT_APP_CANDY_MACHINE_CONFIG!
);

const candyMachineId = new anchor.web3.PublicKey(
    process.env.REACT_APP_CANDY_MACHINE_ID!
);

// const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
// const connection = new anchor.web3.Connection(rpcHost);

const startDateSeed = parseInt(process.env.REACT_APP_CANDY_START_DATE!, 10);

const txTimeout = 30000; // milliseconds (confirm this works for your project)

const MintMachine = () => {
  const [balance, setBalance] = useState<number>();
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
  const connection = useConnection();

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [startDate, setStartDate] = useState(new Date(startDateSeed));

  const wallet = useWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const onMint = async () => {
    try {
      setIsMinting(true);
      if (wallet && candyMachine?.program) {
        const mintTxId = await mintOneToken(
          candyMachine,
          config,
          wallet.publicKey!, // TODO
          treasury
        );

        const status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          txTimeout,
          connection,
          "singleGossip",
          false
        );

        if (!status?.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          setIsSoldOut(true);
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      if (wallet) {
        const balance = await connection.getBalance(wallet.publicKey!);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
      setIsMinting(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet.publicKey) {
        const balance = await connection.getBalance(wallet.publicKey!);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, connection]);

  useEffect(() => {
    (async () => {
      if (!wallet.publicKey) return;

      const { candyMachine, goLiveDate, itemsRemaining } =
        await getCandyMachineState(
          wallet,
          candyMachineId,
          connection
        );

      setIsSoldOut(itemsRemaining === 0);
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);
    })();
  }, [wallet, candyMachineId, connection]);

  return (
    <div>
    <Layout>
      <Content>
        <Row
          style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <CenterCol>
            <div style={{width: 400, height: 600, backgroundColor: 'rgb(23 18 56 / 33%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img style={{ paddingTop: 20 }} src="/img/shadow.png" width="180"></img>
            </div>
            <MintContainer>
              {!wallet ? (
                  <div>Connect Wallet</div>
              //    <ConnectButton>Connect Wallet</ConnectButton>
              ) : (
              <MintButton
                  style={{ 
                    margin: '30px', 
                    textAlign: 'left',
                    fontSize: '1.4rem',
                    background: "linear-gradient(80.68deg, #AA92FF 5.82%, #FF2CF9 47.69%, #FFC289 107.64%)" 
                  }}
                  disabled={isSoldOut || isMinting || !isActive}
                  onClick={onMint}
                  variant="contained"
              >
                  {isSoldOut ? (
                    <div>SOLD OUT</div>
                  ) : isActive ? (
                  isMinting ? (
                      <CircularProgress />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                      <span style= {{ fontSize: 14 }}>CLAIM</span>
                      <img style={{  paddingLeft: 5 }} src="/svg/claim.svg" alt="claim nft"></img>
                    </div>
                  )
                  ) : (
                  <Countdown
                      date={startDate}
                      onMount={({ completed }) => completed && setIsActive(true)}
                      onComplete={() => setIsActive(true)}
                      renderer={renderCounter}
                  />
                  )}
              </MintButton>
              )}
            </MintContainer>
          </CenterCol>
        </Row>
      </Content>
    </Layout>

        <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <CounterText>
      {hours} hours, {minutes} minutes, {seconds} seconds
    </CounterText>
  );
};

export default MintMachine;
