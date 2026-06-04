import React, { useEffect, useState } from "react";
import { TrackContext } from "../TrackContext";
import { useContext } from "react";
import { redirectUri } from "../Authentication/sportify";
import { getSessionCache, setSessionCache } from "../../utils/sessionCache";
import TrackRow from "./TrackRow";

const LIKED_TRACKS_CACHE_KEY = "spotify_top_tracks";
const TRENDING_SECTIONS = [
  {
    key: "trendy",
    title: "Trendy Top 10",
    query: "viral trending hits",
  },
  {
    key: "english",
    title: "Top 10 English",
    query: "top english hits",
  },
  {
    key: "bollywood",
    title: "Top 10 Bollywood",
    query: "top bollywood hits",
  },
  {
    key: "spanish",
    title: "Top 10 Spanish",
    query: "top spanish hits",
  },
];

function SongSection({ title, tracks, onSelectTrack }) {
  if (!tracks.length) {
    return null;
  }

  return (
    <section className="song-section">
      <h2 className="song-section-title">{title}</h2>
      <ul className="track-list">
        {tracks.map((track) => (
          <TrackRow
            key={track.id}
            image={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url}
            meta={track.album?.name}
            onSelect={() => onSelectTrack(track)}
            subtitle={track.artists?.map((artist) => artist.name).join(", ")}
            title={track.name}
          />
        ))}
      </ul>
    </section>
  );
}

function LikedSongs({ category = "all" }) {
  const token = window.localStorage.getItem("access_token");
  const [likedTracks, setLikedTracks] = useState([]);
  const [trendingTracks, setTrendingTracks] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { setCurrentTrack } = useContext(TrackContext);
  const selectedSection = TRENDING_SECTIONS.find(
    (section) => section.key === category
  );

  useEffect(() => {
    let isMounted = true;

    async function fetchLikedTracks() {
      if (!token) {
        console.error("No token found");
        setIsLoading(false);
        return;
      }

      const cachedTracks = getSessionCache(LIKED_TRACKS_CACHE_KEY);

      if (cachedTracks?.length) {
        setLikedTracks(cachedTracks);
        setIsLoading(false);
      }

      try {
        const response = await fetch(
          "https://api.spotify.com/v1/me/top/tracks?limit=20",
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
        setSessionCache(LIKED_TRACKS_CACHE_KEY, data.items);

        if (isMounted) {
          setLikedTracks(data.items);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    async function fetchTrendingSection(section) {
      const cacheKey = `spotify_top_10:${section.key}`;
      const cachedTracks = getSessionCache(cacheKey);

      if (cachedTracks?.length) {
        return cachedTracks;
      }

      const params = new URLSearchParams({
        q: section.query,
        type: "track",
        market: "US",
        limit: "10",
      });
      const response = await fetch(
        `https://api.spotify.com/v1/search?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`${section.title} request failed with status ${response.status}`);
      }

      const data = await response.json();
      const tracks = data.tracks?.items || [];
      setSessionCache(cacheKey, tracks);
      return tracks;
    }

    async function fetchTrendingTracks() {
      try {
        const entries = await Promise.all(
          TRENDING_SECTIONS.map(async (section) => [
            section.key,
            await fetchTrendingSection(section),
          ])
        );

        if (isMounted) {
          setTrendingTracks(Object.fromEntries(entries));
        }
      } catch (error) {
        console.error("Error fetching trending tracks:", error);
      }
    }

    if (token) {
      fetchLikedTracks();
      fetchTrendingTracks();
    } else {
      window.location.href = redirectUri;
    }

    return () => {
      isMounted = false;
    };
  }, [token]); // Add dependency array to run only when `token` changes

  return (
    <div className="content-panel mt-2">
      <div className="content-scroll">
        <h1 className="fs-5 m-2">{selectedSection?.title || "Songs"}</h1>
        {isLoading ? (
          <p className="m-2 text-white-50">Loading songs...</p>
        ) : selectedSection ? (
          <SongSection
            onSelectTrack={setCurrentTrack}
            title={selectedSection.title}
            tracks={trendingTracks[selectedSection.key] || []}
          />
        ) : (
          <>
            <SongSection
              onSelectTrack={setCurrentTrack}
              title="Your Top Tracks"
              tracks={likedTracks.slice(0, 10)}
            />
            {TRENDING_SECTIONS.map((section) => (
              <SongSection
                key={section.key}
                onSelectTrack={setCurrentTrack}
                title={section.title}
                tracks={trendingTracks[section.key] || []}
              />
            ))}
            {!likedTracks.length && !Object.keys(trendingTracks).length ? (
              <p>No top tracks available.</p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default LikedSongs;
