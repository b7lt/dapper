import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import WalletConnector from "./WalletConnector";

export default function LeftNavbar() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const isConnected = !!account;

  return (
    <NavContainer>
      <LogoContainer>
        <Logo>Dapper</Logo>
      </LogoContainer>
      
      {isConnected ? (
        <>
          <NavItems>
          <NavItem>
            <Link href="/">
              <NavLink>
                <IconPlaceholder />
                <NavText>Home</NavText>
              </NavLink>
            </Link>
          </NavItem>
          
          <NavItem>
            <Link href="/notifications">
              <NavLink>
                <IconPlaceholder />
                <NavText>Notifications</NavText>
              </NavLink>
            </Link>
          </NavItem>

          <NavItem>
            <Link href="/profile">
              <NavLink>
                <IconPlaceholder />
                <NavText>Profile</NavText>
              </NavLink>
            </Link>
          </NavItem>

          <NavItem>
            <Link href="/settings">
              <NavLink>
                <IconPlaceholder />
                <NavText>Settings</NavText>
              </NavLink>
            </Link>
          </NavItem>
        </NavItems>
        
        <PostButtonContainer>
          <PostButton>Post</PostButton>
        </PostButtonContainer>
        </>
      ) : (
        <ConnectWalletContainer>
          <ConnectMessage>Join the conversation</ConnectMessage>
          <WalletConnector />
        </ConnectWalletContainer>
      )}

    </NavContainer>
  );
}

const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  height: 100%;
  width: 275px;
  border-right: 1px solid var(--border-color);
`;

const LogoContainer = styled.div`
  padding: 16px 12px;
  margin-bottom: 8px;
`;

const Logo = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: var(--accent-blue);
`;

const NavItems = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 8px;
`;

const NavLink = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 9999px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(29, 155, 240, 0.1);
  }
`;

const NavText = styled.span`
  font-size: 20px;
  font-weight: 500;
`;

const IconPlaceholder = styled.div`
  width: 24px;
  height: 24px;
  background-color: currentColor;
  opacity: 0.6;
  border-radius: 50%;
  margin-right: 16px;
`;

const PostButtonContainer = styled.div`
  margin-top: 16px;
  padding: 0 12px;
`;

const PostButton = styled.button`
  background-color: var(--accent-blue);
  color: white;
  border: none;
  border-radius: 9999px;
  font-size: 17px;
  font-weight: 700;
  padding: 16px 0;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--accent-blue-hover);
  }
`;

const ConnectWalletContainer = styled.div`
  // padding: 24px 16px;
  padding: 8px 12px;
  // border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

const ConnectMessage = styled.p`
  font-size: 25px;
  font-weight: 600;
`;