import React, { useContext, useEffect, useState } from "react";

import { TrackContext } from "../TrackContext";
import { redirectUri } from "../Authentication/sportify";
import MediaCard from "./MediaCard";
import TrackRow from "./TrackRow";

function AlbumList() {
  const [albumList, setAlbumList] = useState([]);
  const [albumTracks, setAlbumTracks] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const { setCurrentTrack } = useContext(TrackContext);

  const token = window.localStorage.getItem("access_token");

  useEffect(() => {
    async function fetchAlbumListData() {
      if (!token) {
        console.error("No token found");
        // window.location.href = redirectUri;
        return;
      }

      try {
        const response = await fetch(
          "https://api.spotify.com/v1/browse/new-releases",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAlbumList(data.albums.items);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if (token) {
      fetchAlbumListData();
    } else {
      window.location.href = redirectUri;
    }
  }, [token]);

  const fetchAlbumTracks = async (albumId, albumName, albumImg) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/albums/${albumId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setAlbumTracks(data.items);
      setSelectedAlbum({ name: albumName, image: albumImg });
    } catch (error) {
      console.log("error fectching albumList", error);
    }
  };

  return (
    <>
      <div className={`content-split ${selectedAlbum ? "" : "content-split--single"}`}>
        <div className="content-panel">
          <div className="content-scroll">
            <h1 className="fs-5 m-2">Albums</h1>
            <div className="media-grid">
              {albumList.length > 0 ? (
                albumList
                  .map((album) => (
                    <MediaCard
                      key={album.id}
                      image={album.images[0]?.url}
                      onClick={() =>
                        fetchAlbumTracks(
                          album.id,
                          album.name,
                          album.images[0]?.url
                        )
                      }
                      subtitle={album.artists?.map((artist) => artist.name).join(", ")}
                      title={album.name}
                    />
                  ))
              ) : (
                <p>No albums available</p>
              )}
            </div>
          </div>
        </div>
    

      {selectedAlbum && (
        <div className="content-panel">
          <div className="content-scroll">
            <div
              className="detail-hero"
              style={{
                backgroundImage: `url(${selectedAlbum.image})`,
              }}
            >
              <h3 className="detail-hero-title">Top Tracks of {selectedAlbum.name}</h3>
            </div>
            <ul className="track-list">
              {albumTracks.length > 0 ? (
                albumTracks.map((track) => (
                  <TrackRow
                    key={track.id}
                    image={selectedAlbum.image}
                    onSelect={() => setCurrentTrack(track)}
                    subtitle={track.artists?.map((artist) => artist.name).join(", ")}
                    title={track.name}
                  />
                ))
              ) : (
                <p>No top tracks available.</p>
              )}
            </ul>
          </div>
        </div>
      )}
  </div>
      {/* {<TrackDetails track={currentTrack} />} */}
    </>
  );
}

export default AlbumList;
