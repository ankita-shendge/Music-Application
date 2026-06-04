import React, { useEffect, useMemo, useState } from "react";
import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import "./Navbar.css";
import Logout from "../Authentication/LogoutButton";

function Navbar({ onSearch, searchQuery }) {
  const [query, setQuery] = useState(searchQuery);
  const [displayProfileMenu, setProfileMenu] = useState(false);
  const [profile, setProfile] = useState(null);
  const token = window.localStorage.getItem("access_token");

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      if (!token) {
        return;
      }

      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Profile request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (isMounted) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching Spotify profile:", error);
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const profileInitials = useMemo(() => {
    const displayName = profile?.display_name || profile?.email || "User";
    const initials = displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");

    return initials || "U";
  }, [profile]);

  function toggleProfileMenu() {
    setProfileMenu((prevState) => !prevState);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    onSearch(query.trim());
  }

  function handleSearchChange(event) {
    const nextQuery = event.target.value;
    setQuery(nextQuery);

    if (!nextQuery.trim()) {
      onSearch("");
    }
  }

  function handleHomeClick() {
    setQuery("");
    onSearch("");
  }

  return (
    <>
      <nav className="navbar app-navbar rounded-3 bg-dark">
        <div className="container-fluid app-navbar-inner">
          <div className="app-navbar-search-group">
            <a className="navbar-brand app-home-link" href="/" onClick={handleHomeClick}>
              <AiFillHome className="fs-3 text-white" />
            </a>
            <form className="app-search-form" onSubmit={handleSearchSubmit}>
              <input
                className="form-control border-0 app-search-input"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={query}
                onChange={handleSearchChange}
              />
              <button
                className="btn btn-outline-success border-0 text-white app-search-button"
                type="submit"
                aria-label="Search Spotify"
              >
                <AiOutlineSearch className="fs-3 text-white ps-1" />
              </button>
            </form>
          </div>
          <div className="app-navbar-actions">
            <div
              className="bg-warning rounded-circle d-flex align-items-center justify-content-center text-white position-relative app-profile-button"
              onClick={toggleProfileMenu}
            >
              <p className="mb-0 fw-bold text-dark">{profileInitials}</p>
              {displayProfileMenu && (
                <ul className="app-profile-menu list-unstyled bg-dark position-absolute p-2 top-100 shadow">
                  <li>
                    <Logout />
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
