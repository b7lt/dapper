import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import Layout from "@/components/Layout";
import Post from "@/components/Post";
import RepliesSection from "@/components/RepliesSection";
import { usePost } from "@/utils/contract";
import Link from "next/link";
import { IoMdArrowBack } from "react-icons/io";

export default function PostDetail() {
  const router = useRouter();
  const { id: postIdParam } = router.query;
  const postId = parseInt(postIdParam);
  
  const { post, isLoading, error } = usePost(postId);
  
  if (isLoading || !post) {
    return (
      <Layout>
        <PostDetailContainer>
          <PostDetailHeader>
            <BackButton onClick={() => router.back()}>
              <IoMdArrowBack style={{width: "60%", height: "60%", color: "white"}}/>
            </BackButton>
            <HeaderTitle>Post</HeaderTitle>
          </PostDetailHeader>
          
          <LoadingPost>Loading post...</LoadingPost>
        </PostDetailContainer>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <PostDetailContainer>
          <PostDetailHeader>
            <BackButton onClick={() => router.back()}>
              <IoMdArrowBack style={{width: "60%", height: "60%", color: "white"}}/>
            </BackButton>
            <HeaderTitle>Post</HeaderTitle>
          </PostDetailHeader>
          
          <ErrorMessage>
            Failed to load post. 
            <Link href="/">
              <ReturnHomeLink>Return to home</ReturnHomeLink>
            </Link>
          </ErrorMessage>
        </PostDetailContainer>
      </Layout>
    );
  }
  
  // if this is a reply, show the parent post
  if (post.replyTo && post.replyTo > 0) {
    return (
      <Layout>
        <PostDetailContainer>
          <PostDetailHeader>
            <BackButton onClick={() => router.back()}>
              <IoMdArrowBack style={{width: "60%", height: "60%", color: "white"}}/>
            </BackButton>
            <HeaderTitle>Thread</HeaderTitle>
          </PostDetailHeader>
          
          <ThreadContainer>
            <ParentPostWrapper>
              <ParentPostLink 
                href={`/post/${post.replyTo}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/post/${post.replyTo}`);
                }}
              >
                <ParentPost postId={post.replyTo} />
              </ParentPostLink>
            </ParentPostWrapper>
            
            <CurrentPostContainer>
              <Post postId={postId} postData={post} />
              <RepliesSection postId={postId} />
            </CurrentPostContainer>
          </ThreadContainer>
        </PostDetailContainer>
      </Layout>
    );
  }
  
  // case if this isnt a reply
  return (
    <Layout>
      <PostDetailContainer>
        <PostDetailHeader>
          <BackButton onClick={() => router.back()}>
            <IoMdArrowBack style={{width: "60%", height: "60%", color: "white"}}/>
          </BackButton>
          <HeaderTitle>Post</HeaderTitle>
        </PostDetailHeader>
        
        <MainPostContainer>
          <Post postId={postId} postData={post} />
          <RepliesSection postId={postId} />
        </MainPostContainer>
      </PostDetailContainer>
    </Layout>
  );
}

function ParentPost({ postId }) {
  const { post, isLoading } = usePost(postId);
  
  if (isLoading || !post) {
    return <LoadingPostIndicator>Loading parent post...</LoadingPostIndicator>;
  }
  
  return <Post postId={postId} postData={post} />;
}

const PostDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const PostDetailHeader = styled.header`
  position: sticky;
  top: 0;
  backdrop-filter: blur(12px);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.65);
  border-bottom: 1px solid var(--border-color);
`;

const BackButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const HeaderTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
`;

const LoadingPost = styled.div`
  padding: 64px 16px;
  text-align: center;
  color: var(--secondary-text);
`;

const LoadingPostIndicator = styled.div`
  padding: 16px;
  text-align: center;
  color: var(--secondary-text);
  font-style: italic;
`;

const ErrorMessage = styled.div`
  padding: 64px 16px;
  text-align: center;
  color: var(--secondary-text);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReturnHomeLink = styled.a`
  color: var(--accent-blue);
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ThreadContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ParentPostWrapper = styled.div`
  position: relative;
  padding-bottom: 0;
  
  &:after {
    content: '';
    position: absolute;
    left: 24px;
    bottom: 0;
    width: 2px;
    height: 16px;
    background-color: var(--border-color);
    z-index: 0;
  }
`;

const ParentPostLink = styled.a`
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }
`;

const CurrentPostContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainPostContainer = styled.div`
  display: flex;
  flex-direction: column;
`;