import React from "react";
import styled from "styled-components";
import Layout from "@/components/Layout";
import Post from "@/components/Post";

export default function Home() {
  const posts = [
    {
      id: 1,
      authorName: "gurt",
      authorUsername: "@yogurt",
      time: "12m",
      content: "yo, wassup",
      commentCount: 16,
      repostCount: 4,
      likeCount: 28,
      hasImage: false,
      avatarColor: "#1da1f2"
    },
    {
      id: 2,
      authorName: "Bombardillo Crocodillo",
      authorUsername: "@aaa",
      time: "1h",
      content: "Check out my new NFT",
      commentCount: 24,
      repostCount: 7,
      likeCount: 42,
      hasImage: true,
      avatarColor: "#17bf63"
    },
    {
      id: 3,
      authorName: "Tralalero Tralala",
      authorUsername: "@trasrfas",
      time: "3h",
      content: "im losing my mind!",
      commentCount: 65,
      repostCount: 31,
      likeCount: 108,
      hasImage: false,
      avatarColor: "#794bc4"
    }
  ];

  return (
    <Layout>
      <HomeContainer>
        <HomeHeader>
          <PageTitle>Home</PageTitle>
        </HomeHeader>
        
        <ComposeBox>
          <ProfileAvatar />
          <ComposeInput placeholder="What's happening?" />
        </ComposeBox>
        
        <Timeline>
          {posts.map(post => (
            <Post key={post.id} post={post} />
          ))}
        </Timeline>
      </HomeContainer>
    </Layout>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HomeHeader = styled.header`
  position: sticky;
  top: 0;
  backdrop-filter: blur(12px);
  padding: 16px;
  z-index: 10;
  
  background-color: rgba(0, 0, 0, 0.65);
  border-bottom: 1px solid var(--border-color);
`;

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
`;

const ComposeBox = styled.div`
  display: flex;
  padding: 16px;
  
  border-bottom: 1px solid var(--border-color);
`;

const ProfileAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
  
  background-color: #333;
`;

const ComposeInput = styled.input`
  flex: 1;
  border: none;
  font-size: 18px;
  background: transparent;
  padding: 12px 0;
  
  &:focus {
    outline: none;
  }
  
  color: white;
  
  &::placeholder {
    color: var(--secondary-text);
  }
`;

const Timeline = styled.div``;