import React, { useState } from "react";
import styled from "styled-components";
import { useActiveAccount } from "thirdweb/react";
import { createPostContent } from "../utils/ipfs";
import { useCreatePost } from "../utils/contract";
import { GiTopHat } from "react-icons/gi";

export default function CreatePost() {
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
      
      await createPost({ contentUri: uri, hasImage });
      
      setContent("");
      
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ComposeBox>
      <GiTopHat style={{width: "48px", height: "48px", marginRight: "12px", color: "rgba(255, 255, 255, 0.7), 255, 0)"}}/>
      <ComposeContent>
        <ComposeInputWrapper>
          <ComposeInput
            placeholder={"What's happening?"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!isConnected || isSubmitting}
          />
        </ComposeInputWrapper>
        
        <ComposeActions>
          <PostButton 
            onClick={handleSubmit}
            disabled={!content || !isConnected || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </PostButton>
        </ComposeActions>
      </ComposeContent>
    </ComposeBox>
  );
}

const ComposeBox = styled.div`
  display: flex;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
`;

const ComposeContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ComposeInputWrapper = styled.div`
  margin-bottom: 12px;
`;

const ComposeInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: none;
  font-size: 18px;
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

const ComposeActions = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
`;

const PostButton = styled.button`
  background-color: var(--accent-blue);
  width: 15%;
  color: white;

  border: none;
  border-radius: 9999px;

  font-weight: 700;
  padding: 10px 16px;
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