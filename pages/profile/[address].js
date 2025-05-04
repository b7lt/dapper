// dynamic page for each profile, shows users name, username, and has sections for their posts, replies, and likes

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useActiveAccount } from "thirdweb/react";
import Layout from "@/components/Layout";
import ProfileEdit from "@/components/ProfileEdit";
import Post from "@/components/Post";
import WalletConnector from "@/components/WalletConnector";
import { 
  useUserProfile, 
  usePost, 
  useFollowers, 
  useFollowing,
  useFollowUser,
  useUnfollowUser,
  useIsFollowing,
  useUserParentPosts,
  useUserReplies,
  useLikedPosts
} from "@/utils/contract";

import { GiTopHat } from "react-icons/gi";
import { IoMdArrowBack } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";

export default function Profile() {
  const router = useRouter();
  const { address: profileAddress, showEdit } = router.query;
  const currentAccount = useActiveAccount();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  
  const targetAddress = profileAddress || currentAccount?.address;
  
  const { profile, isLoading: profileLoading } = useUserProfile(targetAddress);

  const { parentPostIds, isLoading: parentPostsLoading } = useUserParentPosts(targetAddress);
  const { replyIds, isLoading: repliesLoading } = useUserReplies(targetAddress);
  const { likedPostIds, isLoading: likedPostsLoading } = useLikedPosts(targetAddress);
  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  
  const { followers, isLoading: followersLoading } = useFollowers(targetAddress);
  const { following, isLoading: followingLoading } = useFollowing(targetAddress);
  
  const { isFollowing: userIsFollowing } = useIsFollowing(
    currentAccount?.address, 
    targetAddress
  );
  
  const { followUser } = useFollowUser();
  const { unfollowUser } = useUnfollowUser();
  
  const handleFollowToggle = async () => {
    if (!currentAccount?.address) return;
    
    try {
      if (userIsFollowing) {
        await unfollowUser({ userToUnfollow: targetAddress });
      } else {
        await followUser({ userToFollow: targetAddress });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };
  
  // parent posts
  useEffect(() => {
    if (!parentPostIds || parentPostsLoading) return;
    
    try {
      const fixed = parentPostIds.map(id => 
        typeof id === 'bigint' ? Number(id) : Number(id.toString())
      );
      
      fixed.sort((a, b) => b - a);
      setPosts(fixed);
    } catch (error) {
      console.error("Error processing parent posts:", error);
    }
  }, [parentPostIds, parentPostsLoading]);
  
  // replies
  useEffect(() => {
    if (!replyIds || repliesLoading) return;
    
    try {
      const fixed = replyIds.map(id => 
        typeof id === 'bigint' ? Number(id) : Number(id.toString())
      );
      
      fixed.sort((a, b) => b - a);
      setReplies(fixed);
    } catch (error) {
      console.error("Error processing replies:", error);
    }
  }, [replyIds, repliesLoading]);
  
  // likes
  useEffect(() => {
    if (!likedPostIds || likedPostsLoading) return;
    
    try {
      const fixed = likedPostIds.map(id => 
        typeof id === 'bigint' ? Number(id) : Number(id.toString())
      );
      
      fixed.sort((a, b) => b - a);
      setLikedPosts(fixed);
    } catch (error) {
      console.error("Error processing liked posts:", error);
    }
  }, [likedPostIds, likedPostsLoading]);
  
  const isCurrentUser = currentAccount?.address === targetAddress;

  useEffect(() => {
    if (showEdit === 'true' && isCurrentUser) {
      setShowEditProfile(true);
      router.replace(`/profile/${targetAddress}`, undefined, { shallow: true });
    }
  }, [showEdit, isCurrentUser, targetAddress, router]);
  
  const formatJoinDate = (timestamp) => {
    if (!timestamp) return '';
    
    const timestampValue = typeof timestamp === 'bigint' 
      ? Number(timestamp) 
      : Number(timestamp.toString());
    
    return new Date(timestampValue * 1000).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  const joinDate = profile?.joinDate ? formatJoinDate(profile.joinDate) : '';
  const totalPostCount = (posts?.length || 0) + (replies?.length || 0);
  
  if (!targetAddress) {
    return (
      <Layout>
        <ProfileContainer>
          <ConnectWalletMessage>
            <h2>Connect your wallet to view your profile</h2>
            <WalletConnector />
          </ConnectWalletMessage>
        </ProfileContainer>
      </Layout>
    );
  }

  const getPostsToDisplay = () => {
    switch(activeTab) {
      case 'posts':
        return { 
          ids: posts, 
          loading: parentPostsLoading, 
          emptyMessage: "No posts yet"
        };
      case 'replies':
        return { 
          ids: replies, 
          loading: repliesLoading, 
          emptyMessage: "No replies yet" 
        };
      case 'likes':
        return { 
          ids: likedPosts, 
          loading: likedPostsLoading, 
          emptyMessage: "No liked posts yet" 
        };
      default:
        return { 
          ids: posts, 
          loading: parentPostsLoading, 
          emptyMessage: "No posts yet" 
        };
    }
  };
  
  const { ids: postsToDisplay, loading: postsLoading, emptyMessage } = getPostsToDisplay();
  
  return (
    <Layout>
      <ProfileContainer editing={showEditProfile}>
        <ProfileHeader>
          <IoMdArrowBack 
            style={{width: "25px", height: "25px", marginRight: "16px", cursor: "pointer"}} 
            onClick={() => router.push('/')} 
          />
          <HeaderInfo>
            <ProfileName>{profile?.displayName || "User Profile"}</ProfileName>
            <PostCount>{totalPostCount} posts</PostCount>
          </HeaderInfo>
        </ProfileHeader>
        
        <ProfileBanner />
        
        <ProfileDetailsSection>
          <AvatarContainer>
              <GiTopHat style={{width: "85%", height: "85%"}}/>
          </AvatarContainer>
          
          <ProfileActions>
            {isCurrentUser ? (
              <EditProfileButton onClick={() => setShowEditProfile(true)}>
                Edit profile
              </EditProfileButton>
            ) : (
              <FollowButton 
                isFollowing={userIsFollowing}
                onClick={handleFollowToggle}
              >
                {userIsFollowing ? "Unfollow" : "Follow"}
              </FollowButton>
            )}
          </ProfileActions>
          
          <ProfileInfo>
            <DisplayName>{profile?.displayName || "User Profile"}</DisplayName>
            <Username>
              {profile?.username ? `@${profile.username}` : `${targetAddress.slice(0, 6)}...${targetAddress.slice(-4)}`}
            </Username>
            
            <JoinDate>
              <FaCalendarAlt style={{width: "16px", height: "16px", marginRight: "4px", opacity: "0.75"}} />
              Joined {joinDate || "recently"}
            </JoinDate>
            
            <FollowInfo>
              <FollowCount>
                <Bold>{following?.length || 0}</Bold> Following
              </FollowCount>
              <FollowCount>
                <Bold>{followers?.length || 0}</Bold> Followers
              </FollowCount>
            </FollowInfo>
          </ProfileInfo>
        </ProfileDetailsSection>
        
        <ProfileTabs>
          <Tab 
            isActive={activeTab === "posts"}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </Tab>
          <Tab 
            isActive={activeTab === "replies"}
            onClick={() => setActiveTab("replies")}
          >
            Replies
          </Tab>
          <Tab 
            isActive={activeTab === "likes"}
            onClick={() => setActiveTab("likes")}
          >
            Likes
          </Tab>
        </ProfileTabs>
        
        {postsLoading ? (
          <LoadingTimeline>Loading posts...</LoadingTimeline>
        ) : postsToDisplay && postsToDisplay.length > 0 ? (
          <PostsTimeline>
            {postsToDisplay.map(postId => (
              <PostContainer key={postId}>
                <PostWithData postId={postId} />
              </PostContainer>
            ))}
          </PostsTimeline>
        ) : (
          <EmptyTimeline>
            <EmptyStateTitle>{emptyMessage}</EmptyStateTitle>
            <EmptyStateDescription>
              When content is created, it will show up here.
            </EmptyStateDescription>
          </EmptyTimeline>
        )}
        
        {showEditProfile && (
          <>
            <EditOverlay onClick={() => setShowEditProfile(false)} />
            <ProfileEdit onClose={() => setShowEditProfile(false)} />
          </>
        )}
      </ProfileContainer>
    </Layout>
  );
}

function PostWithData({ postId }) {
  const [postData, setPostData] = useState(null);
  const { post, isLoading } = usePost(postId);
  
  useEffect(() => {
    if (post) {
      setPostData(post);
    }
  }, [post]);
  
  if (isLoading || !postData) {
    return <div>Loading post...</div>;
  }
  
  return <Post postId={postId} postData={postData} />;
}

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  filter: ${props => props.isEditing ? 'blur(10px)' : 'none'};
  transition: filter 0.3s ease;
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
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--background);
  border: 4px solid var(--background);
  display: flex;
  justify-content: center;
  align-items: center;
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

const FollowButton = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.isFollowing ? 'transparent' : 'white'};
  color: ${props => props.isFollowing ? 'white' : 'black'};
  border-radius: 9999px;
  font-weight: 700;
  font-size: 15px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.isFollowing ? 'rgba(255, 0, 0, 0.1)' : '#e6e6e6'};
    ${props => props.isFollowing && 'color: #ff4040;'}
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

const LoadingTimeline = styled.div`
  display: flex;
  justify-content: center;
  padding: 32px;
  color: var(--secondary-text);
`;

const PostsTimeline = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostContainer = styled.div`
  border-bottom: 1px solid var(--border-color);
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

const ConnectWalletMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 64px 16px;
  text-align: center;
`;

const EditOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
`;