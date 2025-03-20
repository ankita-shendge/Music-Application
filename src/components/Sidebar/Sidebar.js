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
        <div>
          <GiHamburgerMenu />
        </div>
      )} 

      {isDesktop && (
        <div
          className="bg-info rounded-2"
          style={{ width: "100%" }} // Set the width to 100% to fill the parent
        >
          <div className="d-flex flex-column rounded">
            <img
              src="./images/Spotify_Full_Logo_RGB_White.png"
              className="rounded bg-dark w-99 m-2 p-5"
              style={{ width: "200px" }}
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
