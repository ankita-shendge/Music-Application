import React, { useEffect, useState, useContext } from "react";
import { TrackContext } from "../TrackContext";
import { redirectUri } from "../Authentication/sportify";
import MediaCard from "./MediaCard";
import TrackRow from "./TrackRow";

const FALLBACK_AUDIOBOOK_IDS =
  "18yVqkdbdRvS24c0Ilj2ci,1HGw3J3NxZO1TP1BTtVhpZ,7iHfbu1YPACw6oZPAFJtqe";

function AudioBookList() {
  const token = window.localStorage.getItem("access_token");
  const [audioBooks, setAudioBooks] = useState([]);
  const [selectedAudioBook, setSelectedAudioBook] = useState(null);
  const [audioChapters, setAudioChapters] = useState([]);
  const { setCurrentTrack } = useContext(TrackContext);

  useEffect(() => {
    async function fetchAudioBooksData() {
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const searchParams = new URLSearchParams({
          q: "audiobook",
          type: "audiobook",
          market: "US",
          limit: "20",
        });
        const response = await fetch(
          `https://api.spotify.com/v1/search?${searchParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAudioBooks(data.audiobooks?.items || []);
      } catch (error) {
        console.error("Error searching audiobooks:", error);

        try {
          const fallbackResponse = await fetch(
            `https://api.spotify.com/v1/audiobooks?ids=${FALLBACK_AUDIOBOOK_IDS}&market=US`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!fallbackResponse.ok) {
            throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
          }

          const fallbackData = await fallbackResponse.json();
          setAudioBooks(fallbackData.audiobooks || []);
        } catch (fallbackError) {
          console.error("Error fetching fallback audiobooks:", fallbackError);
        }
      }
    }

    if (token) {
      fetchAudioBooksData();
    } else {
      window.location.href = redirectUri;
    }
  }, [token]);

  const fetchAudioChapters = async (
    audioBookId,
    audioBookName,
    audioBookImage
  ) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/audiobooks/${audioBookId}/chapters`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch chapters");
      }

      const data = await response.json();
      setAudioChapters(data.items);

      setSelectedAudioBook({
        name: audioBookName,
        audioBookImage: audioBookImage,
      });
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  return (
    <div className={`content-split ${selectedAudioBook ? "" : "content-split--single"}`}>
      <div className="content-panel">
        <div className="content-scroll">
          <h1 className="fs-5 m-2">AudioBooks</h1>
          <div className="media-grid">
            {audioBooks.length > 0 ? (
              audioBooks.map((audioBook) => (
                <MediaCard
                  key={audioBook.id}
                  image={audioBook.images[0]?.url}
                  onClick={() =>
                    fetchAudioChapters(
                      audioBook.id,
                      audioBook.name,
                      audioBook.images[0]?.url
                    )
                  }
                  subtitle={audioBook.authors.map((author) => author.name).join(", ")}
                  title={audioBook.name}
                />
              ))
            ) : (
              <p>No audiobooks available</p>
            )}
          </div>
        </div>
      </div>

      {selectedAudioBook && (
        <div className="content-panel">
          <div className="content-scroll">
            <div
              className="detail-hero"
              style={{
                backgroundImage: `url(${selectedAudioBook.audioBookImage})`,
              }}
            >
              {/* <h1 className="fs-4 m-2">Chapters of {selectedAudioBook.name}</h1> */}
            </div>
            <ul className="track-list">
              {audioChapters.length > 0 ? (
                audioChapters.map((track) => (
                  <TrackRow
                    key={track.id}
                    image={selectedAudioBook.audioBookImage}
                    onSelect={() => setCurrentTrack(track)}
                    subtitle={track.description}
                    title={track.name}
                  />
                ))
              ) : (
                <p>No chapters available.</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioBookList;
