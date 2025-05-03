import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useActiveAccount } from "thirdweb/react";
import { useUserProfile } from "../utils/contract";
import ProfileEdit from "./ProfileEdit";

export default function ProfileCheck() {
  const account = useActiveAccount();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const { profile, isLoading } = useUserProfile(account?.address);

  useEffect(() => {
    if (account && !isLoading) {
      const hasProfile = profile && profile.username && profile.username !== "";
      console.log("Profile check:", { hasAccount: !!account, hasProfile, isLoading });
      
      if (!hasProfile) {
        setShowProfileForm(true);
      }
    }
  }, [account, profile, isLoading]);

  if (!account || isLoading) {
    return null;
  }

  if (profile && profile.username && profile.username !== "") {
    return null;
  }

  return (
    <>
      {showProfileForm && (
        <ProfileFormOverlay>
          <ProfileFormContainer>
            <WelcomeHeader>Welcome to Dapper</WelcomeHeader>
            <WelcomeText>
              Before you can start posting, you need to create a profile.
            </WelcomeText>
            <ProfileEdit 
              onClose={() => setShowProfileForm(false)} 
              isInitialSetup={true}
            />
          </ProfileFormContainer>
        </ProfileFormOverlay>
      )}
    </>
  );
}

const ProfileFormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ProfileFormContainer = styled.div`
  background-color: var(--background);
  padding: 24px;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
`;

const WelcomeHeader = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
`;

const WelcomeText = styled.p`
  font-size: 16px;
  margin-bottom: 24px;
  text-align: center;
  color: var(--secondary-text);
`;