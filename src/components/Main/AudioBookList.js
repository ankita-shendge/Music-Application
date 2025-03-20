import React, { useEffect, useState, useContext } from "react";
import { FaRegPlayCircle } from "react-icons/fa";
import { TrackContext } from "../TrackContext";
import { redirectUri } from "../Authentication/sportify";

function AudioBookList() {
  const token = window.localStorage.getItem("access_token");
  const [audioBooks, setAudioBooks] = useState([]);
  const [selectedAudioBook, setSelectedAudioBook] = useState(null);
  const [audioChapters, setAudioChapters] = useState([]);
  const { setCurrentTrack } = useContext(TrackContext);

  useEffect(() => {
    async function fetchAudioBooksData() {
      if (!token) {
        console.log("No Token Found");
        return;
      }

      try {
        const response = await fetch(
          "https://api.spotify.com/v1/audiobooks?ids=18yVqkdbdRvS24c0Ilj2ci,1HGw3J3NxZO1TP1BTtVhpZ,7iHfbu1YPACw6oZPAFJtqe",
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
        console.log("chapters data", data);
        setAudioBooks(data.audiobooks);
      } catch (error) {
        console.error("Error fetching data:", error);
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
      console.log("chapters data", data);
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
    <div className="d-flex flex-row justify-content-between gap-2">
      <div className="mt-2 rounded bg-dark flex-grow-1 w-50">
        <div
          className="overflow-auto rounded p-2"
          style={{ maxHeight: "65vh" }}
        >
          <h1 className="fs-5 m-2">AudioBooks</h1>
          <div className="d-flex flex-wrap">
            {audioBooks.length > 0 ? (
              audioBooks.map((audioBook) => (
                <div
                  key={audioBook.id}
                  className="card-body m-1 rounded text-light d-flex flex-column align-items-center bg-secondary p-1 w-15"
                  onClick={() =>
                    fetchAudioChapters(
                      audioBook.id,
                      audioBook.name,
                      audioBook.images[0]?.url
                    )
                  } // Handle click for chapters
                >
                  <img
                    className="rounded p-1 img-fluid artist-image"
                    src={audioBook.images[0]?.url}
                    alt={audioBook.name}
                  />
                  <h3>{audioBook.name}</h3>
                  <h4>
                    {audioBook.authors.map((author) => author.name).join(", ")}
                  </h4>
                </div>
              ))
            ) : (
              <p>No audiobooks available</p>
            )}
          </div>
        </div>
      </div>

      {selectedAudioBook && (
        <div className="mt-2 p-1 bg-dark rounded flex-grow-2 w-50 p-2">
          <div
            className="overflow-auto rounded"
            style={{ maxHeight: "65vh" }} // Ensures scrolling works
          >
            <div
              className="d-flex position-relative rounded"
              style={{
                backgroundImage: `url(${selectedAudioBook.audioBookImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            >
              {/* <h1 className="fs-4 m-2">Chapters of {selectedAudioBook.name}</h1> */}
            </div>
            <ul className="list-group mt-2">
              {audioChapters.length > 0 ? (
                audioChapters.map((track) => (
                  <li
                    key={track.id}
                    className="list-group-item bg-dark bg-gradient text-light border-0 d-flex justify-content-between align-items-center"
                  >
                    <p className="m-2">{track.name}</p>
                    <p className="m-2">{track.description}</p>
                    <div onClick={() => setCurrentTrack(track)}>
                      <FaRegPlayCircle className="fs-4 fw-light" />
                    </div>
                  </li>
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
