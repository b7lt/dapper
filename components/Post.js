import React from "react";
import styled from "styled-components";

export default function Post({ post }) {
  return (
    <PostWrapper>
      <PostLeft>
        <PostAvatar style={post.avatarColor ? { backgroundColor: post.avatarColor } : {}} />
      </PostLeft>
      <PostContent>
        <PostHeader>
          <PostAuthorName>{post.authorName}</PostAuthorName>
          <PostAuthorUsername>{post.authorUsername}</PostAuthorUsername>
          <PostTime>· {post.time}</PostTime>
        </PostHeader>
        <PostBody>{post.content}</PostBody>
        {post.hasImage && <PostImage />}
        <PostActions>
          <PostAction>
            <ActionIcon />
            <ActionCount>{post.commentCount}</ActionCount>
          </PostAction>
          <PostAction>
            <ActionIcon />
            <ActionCount>{post.repostCount}</ActionCount>
          </PostAction>
          <PostAction>
            <ActionIcon />
            <ActionCount>{post.likeCount}</ActionCount>
          </PostAction>
          <PostAction>
            <ActionIcon />
          </PostAction>
        </PostActions>
      </PostContent>
    </PostWrapper>
  );
}

const PostWrapper = styled.article`
  display: flex;
  padding: 12px 16px;
  transition: background-color 0.2s;
  
  border-bottom: 1px solid var(--border-color);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }
`;

const PostLeft = styled.div`
  margin-right: 12px;
`;

const PostAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #1da1f2;
  opacity: 0.8;
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

const PostImage = styled.div`
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  margin-bottom: 12px;
  overflow: hidden;
  
  background-color: #2f3336;
`;

const PostActions = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 425px;
`;

const PostAction = styled.div`
  display: flex;
  align-items: center;
  color: var(--secondary-text);
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: var(--accent-blue);
  }
`;

const ActionIcon = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0.8;
  margin-right: 4px;
`;

const ActionCount = styled.span`
  font-size: 13px;
`;