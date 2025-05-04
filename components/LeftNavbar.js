// the left navbar that shows the connect button if user is not logged in, else shows links to profile/settings/home

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import WalletConnector from "./WalletConnector";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";

export default function LeftNavbar() {
  const account = useActiveAccount();
  const isConnected = !!account;
  const router = useRouter();

  return (
    <NavContainer>
      <LogoContainer>
        <Logo onClick={() => router.push("/")}>Dapper</Logo>
      </LogoContainer>
      
      {isConnected ? (
        <>
          <NavItems>
          <NavItem>
            <Link href="/">
              <NavLink>
                <FaHome style={{width: "24px", height: "24px", opacity: "0.6", marginRight: "16px"}}/>
                <NavText>Home</NavText>
              </NavLink>
            </Link>
          </NavItem>

          <NavItem>
            <Link href={`/profile/${account.address}`}>
              <NavLink>
                <IoPerson style={{width: "24px", height: "24px", opacity: "0.6", marginRight: "16px"}}/>
                <NavText>Profile</NavText>
              </NavLink>
            </Link>
          </NavItem>

          <NavItem>
            <Link href={`/profile/${account.address}?showEdit=true`}>
              <NavLink>
                <IoMdSettings style={{width: "24px", height: "24px", opacity: "0.6", marginRight: "16px"}}/>
                <NavText>Settings</NavText>
              </NavLink>
            </Link>
          </NavItem>
        </NavItems>
        
        <PostButtonContainer>
          <PostButton onClick={() => router.push("/")}>Post</PostButton>
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
  cursor: pointer;
  display: inline-block;

  &:hover {
    color: var(--accent-blue-hover);
  }
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
  gap: 4px;
`;

const ConnectMessage = styled.p`
  font-size: 25px;
  font-weight: 600;
`;