// allows users to reply to a given postId

import React, { useState } from "react";
import styled from "styled-components";
import { useActiveAccount } from "thirdweb/react";
import { createPostContent } from "../utils/ipfs";
import { useCreatePost } from "../utils/contract";

export default function ReplyForm({ postId, onReplySubmitted }) {
  const account = useActiveAccount();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPost } = useCreatePost();

  const isConnected = !!account;

  const handleSubmit = async () => {
    if (!content || !isConnected || isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      const { uri, hasImage } = await createPostContent(content);
      
      await createPost({ contentUri: uri, hasImage, replyTo: postId });
      
      setContent("");
      
      if (onReplySubmitted) {
        onReplySubmitted();
      }
      
    } catch (error) {
      console.error("Error creating reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReplyBox>
      <ProfileAvatar />
      <ReplyContent>
        <ReplyInputWrapper>
          <ReplyInput
            placeholder={isConnected ? "Write your reply..." : "Connect wallet to reply"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!isConnected || isSubmitting}
          />
        </ReplyInputWrapper>
        
        <ReplyActions>
          
          <ReplyButton 
            onClick={handleSubmit}
            disabled={!content || !isConnected || isSubmitting}
          >
            {isSubmitting ? "Replying..." : "Reply"}
          </ReplyButton>
        </ReplyActions>
      </ReplyContent>
    </ReplyBox>
  );
}

const ReplyBox = styled.div`
  display: flex;
  padding: 16px;
  border-top: 1px solid var(--border-color);
  background-color: rgba(255, 255, 255, 0.02);
`;

const ProfileAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  background-color: #333;
`;

const ReplyContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ReplyInputWrapper = styled.div`
  margin-bottom: 12px;
`;

const ReplyInput = styled.textarea`
  width: 100%;
  min-height: 60px;
  border: none;
  font-size: 16px;
  background: transparent;
  resize: none;
  
  &:focus {
    outline: none;
  }
  
  color: white;
  
  &::placeholder {
    color: var(--secondary-text);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ReplyActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReplyButton = styled.button`
  background-color: var(--accent-blue);
  color: white;
  border: none;
  border-radius: 9999px;
  font-weight: 700;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: var(--accent-blue-hover);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;