// main page that shows timeline and info about the site if the user isnt logged in

import React from "react";
import styled from "styled-components";
import { useActiveAccount } from "thirdweb/react";
import Layout from "@/components/Layout";
import CreatePost from "@/components/CreatePost";
import Timeline from "@/components/Timeline";
import WalletConnector from "@/components/WalletConnector";
import { usePost } from "@/utils/contract";

export default function Home() {
  const account = useActiveAccount();
  const isConnected = !!account;

  return (
    <Layout>
      <HomeContainer>
        <HomeHeader>
          <PageTitle>Home</PageTitle>
        </HomeHeader>
        
        {isConnected && (
          <CreatePost />
        )}
                
        {!isConnected && (
          <AboutDapperSection>
            <SectionTitle>Welcome to Dapper</SectionTitle>
            <SectionDescription>
              A decentralized social media platform built on blockchain technology. 
            </SectionDescription>
            
            <FeaturesList>
              <Feature>
                <FeatureTitle>Your Identity = Your Wallet</FeatureTitle>
                <FeatureDescription>
                  Your profile on Dapper is tied to your wallet address, allowing you to remain anonymous.
                </FeatureDescription>
              </Feature>

              <Feature>
                <FeatureTitle>Decentralized Storage</FeatureTitle>
                <FeatureDescription>
                  All post content is stored on IPFS, keeping it away from censorship.
                </FeatureDescription>
              </Feature>

              <Feature>
                <FeatureTitle>Transparent Backend</FeatureTitle>
                <FeatureDescription>
                  Dapper runs on open-source smart contracts, allowing you to be 100% sure that your timeline isn't being curated by a centralized authority.
                </FeatureDescription>
              </Feature>
              
              
            </FeaturesList>
          </AboutDapperSection>
        )}

      <Timeline />
      </HomeContainer>
    </Layout>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HomeHeader = styled.header`
  position: sticky;
  top: 0;
  backdrop-filter: blur(12px);
  padding: 16px;
  z-index: 10;
  
  background-color: rgba(0, 0, 0, 0.65);
  border-bottom: 1px solid var(--border-color);
`;

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
`;

const AboutDapperSection = styled.section`
  padding: 32px 16px;
  background-color: var(--section-background);
  margin: 16px;
  border-radius: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 12px;
`;

const SectionDescription = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: var(--secondary-text);
  margin-bottom: 24px;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Feature = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FeatureTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: var(--accent-blue);
`;

const FeatureDescription = styled.p`
  font-size: 15px;
  line-height: 1.5;
  color: var(--secondary-text);
`;