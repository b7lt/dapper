import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useActiveAccount } from "thirdweb/react";
import { downloadFromIPFS } from "../utils/ipfs";
import { useUserProfile, useHasLiked, useLikePost, useUnlikePost, usePost } from "../utils/contract";

import { GiTopHat } from "react-icons/gi";
import { FaHeart } from "react-icons/fa";
import { BiSolidMessageRounded } from "react-icons/bi";


export default function Post({ postId, postData, isReply = false }) {
  const account = useActiveAccount();
  const router = useRouter();

  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { profile: authorProfile } = useUserProfile(postData?.author);
  const { hasLiked } = useHasLiked(account?.address, postId);
  const { likePost } = useLikePost();
  const { unlikePost } = useUnlikePost();
  
  useEffect(() => {
    const fetchPostContent = async () => {
      if (postData && postData.contentURI) {
        try {
          const response = await downloadFromIPFS(postData.contentURI);
          const data = await response.json();
          setContent(data);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching post content:", error);
          setIsLoading(false);
        }
      }
    };

    fetchPostContent();
  }, [postData]);

  const handleLikeToggle = async () => {
    if(!account) return;
    try {
      if (hasLiked) {
        await unlikePost({ postId });
      } else {
        await likePost({ postId });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  if (isLoading) {
    return <LoadingPost />;
  }

  if (!content) {
    return <ErrorPost />;
  }

  return (
    <PostWrapper isReply={isReply} onClick={() => router.push(`/post/${postId}`)}>
      <PostLeft>
        <GiTopHat style={{width: "100%", height: "100%"}} onClick={(e) => {router.push(`/profile/${postData.author}`); e.stopPropagation();}}/>
      </PostLeft>
      <PostContent>
        
        <PostHeader>
          <PostAuthorName>{authorProfile?.displayName || "Unknown User"}</PostAuthorName>
          <PostAuthorUsername>
            {authorProfile?.username ? `@${authorProfile.username}` : ""}
          </PostAuthorUsername>
          <PostTime>· {formatTimestamp(postData.timestamp)}</PostTime>
        </PostHeader>

        <PostBody>{content.content}</PostBody>
        <PostActions>
          <PostAction>
            <BiSolidMessageRounded />
            <ActionCount>{postData.replyCount ? postData.replyCount.toString() : "0"}</ActionCount>
          </PostAction>
          <PostAction onClick={handleLikeToggle} isActive={hasLiked} account={account}>
            <FaHeart isActive={hasLiked}/>
            <ActionCount>{postData.likeCount.toString()}</ActionCount>
          </PostAction>
        </PostActions>
      </PostContent>
    </PostWrapper>
  );
}

function formatTimestamp(timestamp) {
  if (!timestamp) return "";
  
  const timestampValue = typeof timestamp === 'bigint' 
    ? Number(timestamp)
    : Number(timestamp.toString());
  
  const date = new Date(timestampValue * 1000);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `${diffSec}s`;
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHour < 24) return `${diffHour}h`;
  if (diffDay < 7) return `${diffDay}d`;

  return date.toLocaleDateString();
}

function LoadingPost() {
  return (
    <PostWrapper>
      <LoadingIndicator>Loading post...</LoadingIndicator>
    </PostWrapper>
  );
}

function ErrorPost() {
  return (
    <PostWrapper>
      <ErrorIndicator>Failed to load post</ErrorIndicator>
    </PostWrapper>
  );
}

const PostWrapper = styled.article`
  display: flex;
  padding: 12px 16px;
  transition: background-color 0.2s;
  position: relative;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }
`;

const PostLeft = styled.div`
  margin-right: 12px;
  // position: relative;
  z-index: 2;
  width: 48px;
  height: 48px;
  border-radius: 50%;

  // &:hover {
  //   background-color: rgba(255, 255, 255, 0.03);
  // }

  &:hover > * {
    color: rgba(255, 255, 255, 0.55);
  }
`;

const PostContent = styled.div`
  flex: 1;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const PostAuthorName = styled.span`
  font-weight: 700;
  margin-right: 4px;
`;

const PostAuthorUsername = styled.span`
  color: var(--secondary-text);
  margin-right: 4px;
`;

const PostTime = styled.span`
  color: var(--secondary-text);
`;

const PostBody = styled.p`
  margin-bottom: 12px;
  font-size: 15px;
  line-height: 1.3;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const PostActions = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 100px;
`;

const PostAction = styled.div`
  display: flex;
  align-items: center;
  color: ${props => (props.isActive ? 'var(--accent-blue)' : 'var(--secondary-text)')};
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    cursor: ${props => (props.account ? "" : 'not-allowed')};
    color: ${props => (props.account ? 'var(--accent-blue)' : "rgba(255, 255, 255, 0.7)")};
  }
`;

const ActionCount = styled.span`
  font-size: 13px;
  margin-left: 4px;
`;

const LoadingIndicator = styled.div`
  width: 100%;
  padding: 16px;
  text-align: center;
  color: var(--secondary-text);
`;

const ErrorIndicator = styled.div`
  width: 100%;
  padding: 16px;
  text-align: center;
  color: var(--secondary-text);
`;