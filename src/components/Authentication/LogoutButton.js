import React from "react";
import { redirectUri } from "./sportify";
import styled from "styled-components";

function logoutFunctionality() {
  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("spotify_device_id");
  window.location.href = redirectUri;
}

function Logout() {
  return (
    <LogoutButton>
      <button className="logout-menu-button" onClick={logoutFunctionality} type="button">
        Logout
      </button>
    </LogoutButton>
  );
}

export default Logout;

const LogoutButton = styled.div`
  width: 100%;

  .logout-menu-button {
    width: 100%;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: white;
    cursor: pointer;
    padding: 8px 12px;
    text-align: left;
  }

  .logout-menu-button:hover,
  .logout-menu-button:focus-visible {
    background: #2a2a2a;
    outline: none;
  }
`;
