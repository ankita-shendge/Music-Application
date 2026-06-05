import React, { useState } from "react";
import styled from "styled-components";
import BrowseAll from "./BrowseAll";
import Navbar from "./Navbar";
import "./BrowseAll.css";

function Main() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <MainComponent className="app-main p-2 rounded-3">
      <Navbar onSearch={setSearchQuery} searchQuery={searchQuery} />
      <BrowseAll searchQuery={searchQuery} />
    </MainComponent>
  );
}

export default Main;

const MainComponent = styled.div`
  color: white;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column; 
  overflow: hidden;

  @media (max-width: 900px) {
    min-height: 0;
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
`;
