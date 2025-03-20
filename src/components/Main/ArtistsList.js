import React, { useContext, useEffect, useState } from "react";
import { FaRegPlayCircle } from "react-icons/fa";
import "./BrowseAll.css";

import { redirectUri } from "../Authentication/sportify";
import { TrackContext } from "../TrackContext";

function ArtistsList() {
  const token = window.localStorage.getItem("access_token");

  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistTracks, setArtistTracks] = useState([]);

  const { setCurrentTrack } = useContext(TrackContext);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch(
          "https://api.spotify.com/v1/me/top/artists?limit=9",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch artist data");
        }

        const data = await response.json();
        const popularArtists = data.items.filter(
          (artist) => artist.popularity > 70
        );
        setArtists(popularArtists);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      }
    };

    if (token) {
      fetchArtists();
    } else {
      window.location.href = redirectUri;
    }
  }, [token]);

  // Function to fetch top tracks for the selected artist
  const fetchArtistTracks = async (artistId, artistName, artistImage) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch top tracks");
      }

      const data = await response.json();
      setArtistTracks(data.tracks); // Set the top tracks
      setSelectedArtist({ name: artistName, image: artistImage, id: artistId });
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
  };

  return (
    <>
      <div className="d-flex flex-row justify-content-between gap-2">
        <div className="mt-2 rounded-3 bg-dark flex-grow-1 w-50">
          <div
            className="overflow-auto rounded"
            style={{ maxHeight: "65vh" }} // Ensures scrolling works
          >
            <div className="rounded-3 navbar_before p-3">
              <h1 className="fs-5 m-2">Artists</h1>
              <div className="d-flex mt-3 flex-wrap justify-content-space-evenly ">
                {artists.length > 0 ? (
                  artists.map((artist) => (
                    <div
                      key={artist.id}
                      className="card-body m-1 rounded text-light d-flex flex-column align-items-center bg-secondary p-1 w-15"
                      onClick={() =>
                        fetchArtistTracks(
                          artist.id,
                          artist.name,
                          artist.images[0]?.url
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        className="rounded p-1 img-fluid artist-image rounded-3"
                        src={artist.images[0].url}
                        alt={artist.name}
                        width="150"
                      />
                      <h5 className="mt-2">{artist.name}</h5>
                      <h6>Artists</h6>
                    </div>
                  ))
                ) : (
                  <p>Loading artist data...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {selectedArtist && (
          <div className="mt-2 p-1 bg-secondary rounded flex-grow-2 w-50 p-2">
            <div
              className="d-flex position-relative rounded"
              style={{
                backgroundImage: `url(${selectedArtist.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            >
              <h3 className="text-light p-1 fs-2 position-absolute bottom-0 start-0 w-100 fw-bold">
                Tracks for{" "}
                <span className="fw-italic">{selectedArtist.name}</span>
              </h3>
            </div>
            <div
              className="overflow-auto rounded mt-2"
              style={{ maxHeight: "40vh" }} // Ensures scrolling works
            >
              <ul className="list-group">
                {artistTracks.length > 0 ? (
                  artistTracks.map((track) => (
                    <li
                      key={track.id}
                      className="list-group-item bg-dark bg-gradient text-light border-0 d-flex justify-content-between align-items-center"
                    >
                      <p className="m-2">{track.name}</p>
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
    </>
  );
}

export default ArtistsList;
