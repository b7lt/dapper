// wallet connector button

import React from "react";
import styled from "styled-components";
import { 
  ConnectButton, 
  darkTheme, 
  useActiveAccount, 
  useActiveWallet, 
  useDisconnect 
} from "thirdweb/react";
import { client } from "@/utils/ThirdwebClient";
import { createWallet } from "thirdweb/wallets";

export default function WalletConnector() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  
  const isConnected = !!account;
  
  const shortenAddress = (addr) => {
    if (!addr) return "";
    return `${addr.substring(0, 7)}...${addr.substring(addr.length - 5)}`;
  };

  if (isConnected) {
    return (
      <ConnectedContainer>
        <AddressDisplay>{shortenAddress(account.address)}</AddressDisplay>
        <DisconnectButton onClick={() => disconnect(wallet)}>Disconnect</DisconnectButton>
      </ConnectedContainer>
    );
  }

  return (
    <ConnectContainer>
      <ConnectButton
        client={client}
        theme={darkTheme({
          colors: {
            primaryButtonBg: "var(--accent-blue)",
            primaryButtonText: "white",
          },
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        })}
        style={{
          width: "80%",
          borderRadius: "12px",
          marginBottom: "12px",
        }}
        wallets={[
          createWallet("io.metamask"),
          createWallet("com.coinbase.wallet"),
          createWallet("me.rainbow"),
        ]}
        connectModal={{
          title: "Sign in to Dapper",
          // titleIcon: "https://example.com/logo.png",
          size: "compact",
        }}

      />
    </ConnectContainer>
  );
}

const ConnectContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 0px;
`;

const ConnectedContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 16px;
  background-color: var(--section-background);
`;

const AddressDisplay = styled.div`
  font-weight: 600;
  background-color: rgba(29, 155, 240, 0.2);
  color: var(--accent-blue);
  padding: 4px 12px;
  border-radius: 16px;
  font-family: monospace;
`;

const DisconnectButton = styled.button`
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--foreground);
  padding: 4px 12px;
  border-radius: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;