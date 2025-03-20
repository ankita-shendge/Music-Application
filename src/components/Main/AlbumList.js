import React, { useContext, useEffect, useState } from "react";
import { FaRegPlayCircle } from "react-icons/fa";

import { TrackContext } from "../TrackContext";
import { redirectUri } from "../Authentication/sportify";

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
      <div className="d-flex flex-row justify-content-between gap-2">
        <div className="mt-2 rounded bg-dark flex-grow-1 w-50">
          <div
            className="overflow-auto rounded p-2"
            style={{ maxHeight: "65vh" }}   
          >
            <h1 className="fs-5 m-2">Albums</h1>
            <div className="d-flex mt-3 flex-wrap justify-content-space-evenly">
              {albumList.length > 0 ? (
                albumList
                  .filter((album) => album.name.length <= 10)
                  .map((album) => (
                    <div
                      key={album.id}
                      className="card-body m-1 rounded text-light d-flex flex-column align-items-center bg-secondary p-1 w-15"
                      onClick={() =>
                        fetchAlbumTracks(
                          album.id,
                          album.name,
                          album.images[0]?.url
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        className="rounded p-1 img-fluid artist-image"
                        src={album.images[0]?.url}
                        alt={album.name}
                        width="150"
                      />
                      <h3 className="fs-6">{album.name}</h3>
                    </div>
                  ))
              ) : (
                <p>No albums available</p>
              )}
            </div>
          </div>
        </div>
    

      {selectedAlbum && (
        <div className="mt-2 p-1 bg-dark rounded flex-grow-2 w-50 p-2">
          <div
            className="overflow-auto rounded"
            style={{ maxHeight: "65vh" }} // Ensures scrolling works
          >
            <div
              className="d-flex position-relative rounded"
              style={{
                backgroundImage: `url(${selectedAlbum.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            >
              <h3 className="text-light p-2">Top Tracks of {selectedAlbum.name}</h3>
            </div>
            <ul className="list-group mt-2">
              {albumTracks.length > 0 ? (
                albumTracks.map((track) => (
                  <li
                    key={track.id}
                    className="list-group-item bg-dark bg-gradient text-light border-0 d-flex justify-content-between align-items-center"
                  >
                    <p className="m-2"> {track.name}</p>
                    <div onClick={() => setCurrentTrack(track)}>
                      <FaRegPlayCircle className="fs-4 fw-light" />
                    </div>
                  </li>
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
