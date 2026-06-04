import React from "react";
// import HomeIcon from "./HomeIcon";
import "./Sidebar.css";
import SidebarLibrary from "./SidebarLibrary";
import { GiHamburgerMenu } from "react-icons/gi";
import { useMediaQuery } from 'react-responsive';

function Sidebar() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isDesktop = useMediaQuery({ minWidth: 769 });

  return (
    <>
      {isMobile && (
        <div className="mobile-sidebar-toggle">
          <GiHamburgerMenu />
        </div>
      )} 

      {isDesktop && (
        <div
          className="sidebar-panel bg-info rounded-2"
        >
          <div className="d-flex flex-column rounded">
            <img
              src="./images/Spotify_Full_Logo_RGB_White.png"
              className="sidebar-logo rounded bg-dark"
              alt="sportify_logo"
            />
            <SidebarLibrary />
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
