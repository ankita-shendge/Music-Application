import React, { useContext, useEffect, useState } from "react";
import "./BrowseAll.css";

import { redirectUri } from "../Authentication/sportify";
import { TrackContext } from "../TrackContext";
import MediaCard from "./MediaCard";
import TrackRow from "./TrackRow";

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
      <div className={`content-split ${selectedArtist ? "" : "content-split--single"}`}>
        <div className="content-panel">
          <div className="content-scroll">
            <div className="rounded-3 navbar_before">
              <h1 className="fs-5 m-2">Artists</h1>
              <div className="media-grid">
                {artists.length > 0 ? (
                  artists.map((artist) => (
                    <MediaCard
                      key={artist.id}
                      image={artist.images[0]?.url}
                      imageShape="circle"
                      onClick={() =>
                        fetchArtistTracks(
                          artist.id,
                          artist.name,
                          artist.images[0]?.url
                        )
                      }
                      subtitle="Artist"
                      title={artist.name}
                    />
                  ))
                ) : (
                  <p>Loading artist data...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {selectedArtist && (
          <div className="content-panel">
            <div
              className="detail-hero"
              style={{
                backgroundImage: `url(${selectedArtist.image})`,
              }}
            >
              <h3 className="detail-hero-title">
                Tracks for{" "}
                <span className="fw-italic">{selectedArtist.name}</span>
              </h3>
            </div>
            <div
              className="content-scroll"
            >
              <ul className="track-list">
                {artistTracks.length > 0 ? (
                  artistTracks.map((track) => (
                    <TrackRow
                      key={track.id}
                      image={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
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
    </>
  );
}

export default ArtistsList;
