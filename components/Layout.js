import React from "react";
import styled from "styled-components";
import LeftNavbar from "./LeftNavbar";
import RightSidebar from "./RightSidebar";

export default function Layout({ children }) {
  return (
    <AppContainer>
      <LeftNavbar />
      <MainContent>
        {children}
      </MainContent>
      <RightSidebar />
    </AppContainer>
  );
}

const AppContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  min-height: 100vh;
  max-width: 1300px;
  margin: 0 auto;
`;

const MainContent = styled.main`
  width: 100%;
  max-width: 600px;
  min-width: 100%;
  
  border-right: 1px solid var(--border-color);
  border-left: 1px solid var(--border-color);
`;