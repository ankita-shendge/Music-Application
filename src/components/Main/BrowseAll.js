import React from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import "./BrowseAll.css";
import ArtistsList from "./ArtistsList";
import AlbumList from "./AlbumList";
import AudioBookList from "./AudioBookList";
import LikedSongs from "./LikedSongs";
import SearchResults from "./SearchResults";


function BrowseAll({ searchQuery }) {
  const hasSearch = Boolean(searchQuery);

  return (
    <BrowserRouter>
      {!hasSearch ? (
        <>
          <ul className="browse-tabs">
            <li>
              <NavLink
                className="browse-tab"
                to="/"
              >
                Songs
              </NavLink>
            </li>
            <li>
              <NavLink
                className="browse-tab"
                to="/trendy"
              >
                Trendy Top 10
              </NavLink>
            </li>
            <li>
              <NavLink
                className="browse-tab"
                to="/english"
              >
                English Top 10
              </NavLink>
            </li>
            <li>
              <NavLink
                className="browse-tab"
                to="/bollywood"
              >
                Bollywood Top 10
              </NavLink>
            </li>
            <li>
              <NavLink
                className="browse-tab"
                to="/spanish"
              >
                Spanish Top 10
              </NavLink>
            </li>
            <li>
              <NavLink
                className="browse-tab"
                to="/artists"
              >
                Artists
              </NavLink>
            </li>
            <li>
              <NavLink
                className="browse-tab"
                to="/albums"
              >
                Albums
              </NavLink>
            </li>

            <li>
              <NavLink
                className="browse-tab"
                to="/audiobooks"
              >
                Audiobooks
              </NavLink>
            </li>
          </ul>
          <Routes>
            <Route path="/" element={<LikedSongs />} />
            <Route path="/trendy" element={<LikedSongs category="trendy" />} />
            <Route path="/english" element={<LikedSongs category="english" />} />
            <Route path="/bollywood" element={<LikedSongs category="bollywood" />} />
            <Route path="/spanish" element={<LikedSongs category="spanish" />} />
            <Route path="/artists" element={<ArtistsList />} />
            <Route path="/albums" element={<AlbumList />} />
            <Route path="/audiobooks" element={<AudioBookList />} />
            {/* <Route path="/displayTracks" element={<DisplayArtistsTracks />} /> */}
          </Routes>
        </>
      ) : (
        <SearchResults query={searchQuery} />
      )}
    </BrowserRouter>
  );
}

export default BrowseAll;
