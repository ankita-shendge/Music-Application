import React, { useEffect, useState } from "react";
import { FaRegPlayCircle } from "react-icons/fa";
import { TrackContext } from "../TrackContext";
import { useContext } from "react";
import { redirectUri } from "../Authentication/sportify";

function LikedSongs() {
  const token = window.localStorage.getItem("access_token");
  const [likedTracks, setLikedTracks] = useState([]);

  const { setCurrentTrack } = useContext(TrackContext);

  useEffect(() => {
    async function fetchLikedTracks() {
      if (!token) {
        console.error("No token found");
        return;
      }
      try {
        const response = await fetch(
          "https://api.spotify.com/v1/me/top/tracks",
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
        setLikedTracks(data.items);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    if (token) {
      fetchLikedTracks();
    } else {
      window.location.href = redirectUri;
    }
  }, [token]); // Add dependency array to run only when `token` changes

  return (
    <div className=" mt-2 p-3 bg-dark rounded">
      <div className="rounded-3 navbar_before p-2">
        <h1 className="fs-5 m-2">Liked Songs</h1>
        {likedTracks.length > 0 ? (
          <div
            className="overflow-auto rounded"
            style={{ maxHeight: "53vh" }} // Ensures scrolling works
          >
            <ul className="list-group rounded h-75  mt-2">
              {likedTracks.map((track) => (
                <li
                  key={track.id}
                  className="list-group-item bg-dark bg-gradient text-light border-0 d-flex justify-content-between align-items-center p-3"
                >
                  <span className="ms-2">{track.name}</span>
                  <div onClick={() => setCurrentTrack(track)}>
                    <FaRegPlayCircle className="fs-4 fw-light" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No top tracks available.</p>
        )}
      </div>
    </div>
  );
}

export default LikedSongs;
