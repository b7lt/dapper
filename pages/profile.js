import React from "react";
import styled from "styled-components";
import Layout from "@/components/Layout";

export default function Profile() {
  return (
    <Layout>
      <ProfileContainer>
        <ProfileHeader>
          <BackButton />
          <HeaderInfo>
            <ProfileName>User Profile</ProfileName>
            <PostCount>0 posts</PostCount>
          </HeaderInfo>
        </ProfileHeader>
        
        <ProfileBanner />
        
        <ProfileDetailsSection>
          <AvatarContainer>
            <ProfileAvatar />
          </AvatarContainer>
          
          <ProfileActions>
            <EditProfileButton>Edit profile</EditProfileButton>
          </ProfileActions>
          
          <ProfileInfo>
            <DisplayName>User Profile</DisplayName>
            <Username>@username</Username>
            
            <JoinDate>
              <CalendarIcon />
              Joined April 2025
            </JoinDate>
            
            <FollowInfo>
              <FollowCount><Bold>0</Bold> Following</FollowCount>
              <FollowCount><Bold>0</Bold> Followers</FollowCount>
            </FollowInfo>
          </ProfileInfo>
        </ProfileDetailsSection>
        
        <ProfileTabs>
          <Tab isActive>Posts</Tab>
          <Tab>Replies</Tab>
          <Tab>Media</Tab>
          <Tab>Likes</Tab>
        </ProfileTabs>
        
        <EmptyTimeline>
          <EmptyStateTitle>You haven't posted anything yet</EmptyStateTitle>
          <EmptyStateDescription>
            When you post, your posts will show up here.
          </EmptyStateDescription>
        </EmptyTimeline>
      </ProfileContainer>
    </Layout>
  );
}

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ProfileHeader = styled.header`
  position: sticky;
  top: 0;
  backdrop-filter: blur(12px);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  z-index: 10;
  
  background-color: rgba(0, 0, 0, 0.65);
`;

const BackButton = styled.div`
  width: 20px;
  height: 20px;
  background-color: currentColor;
  opacity: 0.6;
  border-radius: 50%;
  margin-right: 16px;
  cursor: pointer;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileName = styled.h1`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 2px;
`;

const PostCount = styled.span`
  font-size: 13px;
  color: var(--secondary-text);
`;

const ProfileBanner = styled.div`
  height: 200px;
  background-color: var(--accent-blue);
`;

const ProfileDetailsSection = styled.div`
  padding: 0 16px;
  position: relative;
  margin-bottom: 16px;
`;

const AvatarContainer = styled.div`
  position: absolute;
  top: -60px;
  left: 16px;
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--background);
  border: 4px solid var(--background);
`;

const ProfileActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
`;

const EditProfileButton = styled.button`
  padding: 8px 16px;
  background-color: transparent;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 15px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  color: white;
  
  &:hover {
    background-color: var(--border-color);
  }
`;

const ProfileInfo = styled.div`
  margin-top: 60px;
`;

const DisplayName = styled.h2`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 2px;
`;

const Username = styled.div`
  font-size: 15px;
  color: var(--secondary-text);
  margin-bottom: 12px;
`;

const JoinDate = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  color: var(--secondary-text);
  margin-bottom: 12px;
`;

const CalendarIcon = styled.div`
  width: 16px;
  height: 16px;
  background-color: currentColor;
  opacity: 0.6;
  margin-right: 4px;
`;

const FollowInfo = styled.div`
  display: flex;
  gap: 16px;
  font-size: 15px;
  color: var(--secondary-text);
`;

const FollowCount = styled.div`
  display: flex;
  align-items: center;
`;

const Bold = styled.span`
  font-weight: 700;
  color: var(--foreground);
  margin-right: 4px;
`;

const ProfileTabs = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border-color);
`;

const Tab = styled.div`
  flex: 1;
  text-align: center;
  padding: 16px;
  font-weight: ${props => props.isActive ? '700' : '500'};
  color: ${props => props.isActive ? 'var(--foreground)' : 'var(--secondary-text)'};
  border-bottom: ${props => props.isActive ? '4px solid var(--accent-blue)' : 'none'};
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }
`;

const EmptyTimeline = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 16px;
`;

const EmptyStateTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
`;

const EmptyStateDescription = styled.p`
  font-size: 15px;
  color: var(--secondary-text);
  max-width: 340px;
  line-height: 1.5;
`;