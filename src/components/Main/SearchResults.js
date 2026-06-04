import React, { useContext, useEffect, useState } from "react";
import { TrackContext } from "../TrackContext";
import { getSessionCache, setSessionCache } from "../../utils/sessionCache";
import TrackRow from "./TrackRow";

function SearchResults({ query }) {
  const token = window.localStorage.getItem("access_token");
  const { setCurrentTrack } = useContext(TrackContext);
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) {
      setTracks([]);
      setError("");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const cacheKey = `spotify_search_tracks:${query.toLowerCase()}`;
    const cachedTracks = getSessionCache(cacheKey, 2 * 60 * 1000);

    async function searchTracks() {
      if (cachedTracks) {
        setTracks(cachedTracks);
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }

      setError("");

      try {
        const params = new URLSearchParams({
          q: query,
          type: "track",
          limit: "20",
        });
        const response = await fetch(
          `https://api.spotify.com/v1/search?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`Search failed with status ${response.status}`);
        }

        const data = await response.json();
        const nextTracks = data.tracks?.items || [];
        setSessionCache(cacheKey, nextTracks);
        setTracks(nextTracks);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error searching Spotify:", error);
          setError("Search failed. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    searchTracks();

    return () => {
      controller.abort();
    };
  }, [query, token]);

  return (
    <div className="content-panel mt-2">
      <div className="content-scroll">
        <div className="search-results-header">
          <h1 className="fs-5 m-0">Search results</h1>
          <p className="m-0 text-white-50">{query}</p>
        </div>

        {isLoading ? <p className="m-2 text-white-50">Searching Spotify...</p> : null}
        {error ? <p className="m-2 search-error">{error}</p> : null}

        {!isLoading && !error && tracks.length === 0 ? (
          <p className="m-2 text-white-50">No tracks found.</p>
        ) : null}

        <ul className="track-list">
          {tracks.map((track) => (
            <TrackRow
              key={track.id}
              image={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
              meta={track.album?.name}
              onSelect={() => setCurrentTrack(track)}
              subtitle={track.artists?.map((artist) => artist.name).join(", ")}
              title={track.name}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SearchResults;
