// main timeline that shows 10 most recent posts

import React, { useState } from "react";
import styled from "styled-components";
import { useRecentPosts } from "../utils/contract";
import Post from "./Post";

export default function Timeline() {
  const [stepIncrement, setStepIncrement] = useState(0);
  const { posts, isLoading } = useRecentPosts(stepIncrement, 10);
  
  const loadMorePosts = () => {
    setStepIncrement(prevStep => prevStep + 10);
  };
  
  if (isLoading) {
    return <LoadingTimeline />;
  }

  if (!posts || posts.length === 0) {
    return <EmptyTimeline />;
  }

  const filteredPosts = posts.filter((post) => post.replyTo == 0);
  
  if (!filteredPosts || filteredPosts.length === 0) {
    return <EmptyTimeline />;
  }
  
  return (
    <TimelineContainer>
      {filteredPosts.map(post => (
        <PostWrapper key={post.id}>
          <Post postId={post.id} postData={post} />
        </PostWrapper>
      ))}
      
      {filteredPosts.length === 10 && (
        <LoadMoreButton onClick={loadMorePosts}>
          Load More Posts
        </LoadMoreButton>
      )}
    </TimelineContainer>
  );
}

function LoadingTimeline() {
  return (
    <TimelineContainer>
      <LoadingIndicator>
        <LoadingText>Loading posts...</LoadingText>
        <LoadingSpinner />
      </LoadingIndicator>
    </TimelineContainer>
  );
}

function EmptyTimeline() {
  return (
    <TimelineContainer>
      <EmptyStateContainer>
        <EmptyStateTitle>No posts yet</EmptyStateTitle>
        <EmptyStateDescription>
          Be the first to post on Dapper Social!
        </EmptyStateDescription>
      </EmptyStateContainer>
    </TimelineContainer>
  );
}

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostWrapper = styled.div`
  border-bottom: 1px solid var(--border-color);
`;

const LoadingIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 16px;
  gap: 16px;
`;

const LoadingText = styled.div`
  color: var(--secondary-text);
  font-size: 18px;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 16px;
`;

const EmptyStateTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 8px;
`;

const EmptyStateDescription = styled.p`
  font-size: 15px;
  color: var(--secondary-text);
  max-width: 340px;
  line-height: 1.5;
`;

const LoadMoreButton = styled.button`
  background-color: transparent;
  border: none;
  color: var(--accent-blue);
  padding: 16px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(29, 155, 240, 0.1);
  }
`;