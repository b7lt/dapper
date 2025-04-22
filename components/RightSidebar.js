import React from "react";
import styled from "styled-components";

export default function RightSidebar() {
  return (
    <SidebarContainer>
      <SearchContainer>
        <SearchIcon />
        <SearchInput placeholder="Search" />
      </SearchContainer>
      
    </SidebarContainer>
  );
}

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  padding: 0 16px;
  height: 100%;
  border-left: 1px solid var(--border-color)
`;

const SearchContainer = styled.div`
  position: relative;
  margin: 12px 0;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0.5;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 48px;
  border-radius: 9999px;
  border: none;
  font-size: 15px;
  
  background-color: var(--search-background);
  color: white;
  
  &:hover {
    outline: 2px solid var(--accent-blue-hover)
  }

  &:focus {
    outline: 2px solid var(--accent-blue);
    background-color: black;
  }
`;