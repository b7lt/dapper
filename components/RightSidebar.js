import React from "react";
import styled from "styled-components";
import { useActiveAccount, useActiveWallet, useDisconnect } from "thirdweb/react";
import { FaSearch } from "react-icons/fa";

export default function RightSidebar() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const isConnected = !!account;

  return (
    <SidebarContainer>
      <SearchContainer>
        <FaSearch 
        style={{position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)",
                width: "16px", height: "16px", opacity: "0.5"
        }}/>
        <SearchInput placeholder="Search (not implemented)" />
      </SearchContainer>

      {isConnected && (
        <WalletSection>
          <WalletInfo>
            Connected: {account.address.substring(0, 7)}...{account.address.substring(account.address.length - 5)}
          </WalletInfo>
          <DisconnectBtn onClick={() => disconnect(wallet)}>Disconnect Wallet</DisconnectBtn>
        </WalletSection>
      )}
      
    </SidebarContainer>
  );
}

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  padding: 0 16px;
  height: 100%;
  border-left: 1px solid var(--border-color)
`;

const SearchContainer = styled.div`
  position: relative;
  margin: 12px 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 48px;
  border-radius: 9999px;
  border: none;
  font-size: 15px;
  
  background-color: var(--search-background);
  color: white;
  
  &:hover {
    outline: 2px solid var(--accent-blue-hover)
  }

  &:focus {
    outline: 2px solid var(--accent-blue);
    background-color: black;
  }
`;

const WalletSection = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: var(--section-background);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const WalletInfo = styled.div`
  font-size: 14px;
  color: var(--secondary-text);
`;

const DisconnectBtn = styled.button`
  background-color: #ff4040;
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #e63535;
  }
`;