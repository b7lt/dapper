// shows replies to a parent post of postId

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { usePost, usePostReplies } from "../utils/contract";
import Post from "./Post";
import ReplyForm from "./ReplyForm";

export default function RepliesSection({ postId, showReplyForm = true }) {
  const [showReplies, setShowReplies] = useState(true);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const { replyIds, isLoading } = usePostReplies(postId);
  
  const handleReplySubmitted = () => {
    setRefreshCounter(prev => prev + 1);
    setShowReplies(true);
  };
  
  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };
  
  return (
    <RepliesSectionContainer>
      {replyIds && replyIds.length > 0 && (
        <ReplyCounter onClick={toggleReplies}>
          {showReplies ? "Hide" : "Show"} {replyIds.length} {replyIds.length === 1 ? "reply" : "replies"}
        </ReplyCounter>
      )}
      
      {showReplyForm && (
        <ReplyForm postId={postId} onReplySubmitted={handleReplySubmitted} />
      )}
      
      {showReplies && (
        <RepliesContainer>
          {isLoading ? (
            <LoadingReplies>Loading replies...</LoadingReplies>
          ) : replyIds && replyIds.length > 0 ? (
            replyIds.map(replyId => (
              <ReplyWrapper key={replyId}>
                <ReplyPostContainer>
                  <PostWithData postId={replyId} isReply={true} />
                </ReplyPostContainer>
              </ReplyWrapper>
            ))
          ) : (
            <NoReplies>No replies yet</NoReplies>
          )}
        </RepliesContainer>
      )}
    </RepliesSectionContainer>
  );
}

// to handle loading each reply separately basically
function PostWithData({ postId, isReply }) {
  const [postData, setPostData] = useState(null);
  const { post, isLoading } = usePost(postId);
  
  useEffect(() => {
    if (post) {
      setPostData(post);
    }
  }, [post]);
  
  if (isLoading || !postData) {
    return <div>Loading reply...</div>;
  }
  
  return <Post postId={postId} postData={postData} isReply={isReply} />;
}

const RepliesSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border-color);
`;

const ReplyCounter = styled.button`
  background: transparent;
  border: none;
  color: var(--accent-blue);
  font-size: 14px;
  padding: 12px 16px;
  text-align: left;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const RepliesContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReplyWrapper = styled.div`
  // position: relative;
`;

const ReplyPostContainer = styled.div`
  // margin-left: 16px;
  border-bottom: 1px solid var(--border-color);
`;

const LoadingReplies = styled.div`
  padding: 16px;
  text-align: center;
  color: var(--secondary-text);
`;

const NoReplies = styled.div`
  padding: 16px;
  text-align: center;
  color: var(--secondary-text);
  font-style: italic;
`;