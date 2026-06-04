import React, { useCallback, useEffect, useRef, useState } from "react";

import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { BiSkipPrevious, BiSkipNext } from "react-icons/bi";
import { IoIosShuffle } from "react-icons/io";
import { TbRepeat } from "react-icons/tb";
import { MdOutlineFullscreen } from "react-icons/md";
import { IoVolumeHighOutline } from "react-icons/io5";



let lastAutoPlayedTrackUri = "";

const TrackDetails = ({ track }) => {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackError, setPlaybackError] = useState("");
  const [volume, setVolume] = useState(50);
  const token = window.localStorage.getItem("access_token");
  const hasTrack = track && Object.keys(track).length > 0;

  const getPlaybackDeviceId = useCallback(async () => {
    const response = await fetch("https://api.spotify.com/v1/me/player/devices", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Unable to load Spotify devices.");
    }

    const data = await response.json();
    const device = data.devices?.find((device) => device.is_active) || data.devices?.[0];

    if (!device?.id) {
      window.localStorage.removeItem("spotify_device_id");
      throw new Error("Open Spotify on a device, then try playing again.");
    }

    window.localStorage.setItem("spotify_device_id", device.id);
    return device.id;
  }, [token]);

  const playTrack = useCallback(async (trackUri) => {
    if (!trackUri) {
      return;
    }

    if (!token) {
      setPlaybackError("Please log in again to control playback.");
      return;
    }

    try {
      setPlaybackError("");
      const deviceId = await getPlaybackDeviceId();
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            uris: [trackUri],
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      if (response.status === 204 || response.status === 200) {
        setIsPlaying(true);
      } else if(response.status === 403) {
        setPlaybackError("Spotify Premium is required to play songs from this app.");
      } else if (response.status === 404) {
        window.localStorage.removeItem("spotify_device_id");
        setPlaybackError("Spotify could not find an active device. Open Spotify, then try again.");
      } else {
        setPlaybackError("Spotify playback failed. Please try again.");
      }
    } catch (error) {
      console.error("Error playing/pausing track:", error);
      setPlaybackError(error.message || "Spotify playback failed. Please try again.");
    }
  }, [getPlaybackDeviceId, token]);

  const pauseTrack = async () => {
    if (!token) {
      setPlaybackError("Please log in again to control playback.");
      return;
    }

    try {
      setPlaybackError("");
      const response = await fetch(`https://api.spotify.com/v1/me/player/pause`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204 || response.status === 200) {
        setIsPlaying(false);
      } else if (response.status === 403) {
        setPlaybackError("Spotify Premium is required to pause songs from this app.");
      } else {
        setPlaybackError("Spotify pause failed. Please try again.");
      }
    } catch (error) {
      console.error("Error pausing track:", error);
      setPlaybackError(error.message || "Spotify pause failed. Please try again.");
    }
  };

  const handlePlayPause = async (trackUri) => {
    if (!hasTrack || !trackUri) {
      return;
    }

    if (isPlaying) {
      await pauseTrack();
      return;
    }

    await playTrack(trackUri);
  };

  useEffect(() => {
    if (track?.uri && track.uri !== lastAutoPlayedTrackUri) {
      lastAutoPlayedTrackUri = track.uri;
      playTrack(track.uri);
    }
  }, [playTrack, track?.uri]);

  const handleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await playerRef.current?.requestFullscreen();
    } catch (error) {
      console.error("Unable to toggle fullscreen:", error);
      setPlaybackError("Fullscreen is not available in this browser.");
    }
  };

  const handleVolumeChange = async (event) => {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);

    if (!token) {
      setPlaybackError("Please log in again to control playback.");
      return;
    }

    try {
      setPlaybackError("");
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/volume?volume_percent=${nextVolume}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204 || response.status === 200) {
        return;
      }

      if (response.status === 403) {
        setPlaybackError("Spotify Premium is required to adjust volume from this app.");
      } else if (response.status === 404) {
        setPlaybackError("Spotify could not find an active device. Open Spotify, then try again.");
      } else {
        setPlaybackError("Spotify volume update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating volume:", error);
      setPlaybackError(error.message || "Spotify volume update failed. Please try again.");
    }
  };

  return (
<div className="track-player bg-dark text-light py-3" ref={playerRef}>
  <div className="container-fluid">
    <div className="track-player-grid align-items-center text-center">
      {/* <!-- Album Art and Track Info --> */}
      <div className="track-player-info d-flex align-items-center">
        {hasTrack && track.album?.images?.length > 0 ? (
          <img
            src={track.album.images[0].url}
            alt={track.album.name}
            className="track-player-art img-fluid rounded"
          />
        ) : (
          <div className="track-player-art track-player-art--empty rounded" />
        )}
        <div className="track-player-copy ms-3">
          <p className="mb-0 fw-bold">{hasTrack ? track.name : "Choose a song"}</p>
          {hasTrack && track.artists && track.artists.length > 0 ? (
            <p className="mb-0 text-white">{track.artists[0].name}</p>
          ) : (
            <p className="mb-0 text-white">Ready to play</p>
          )}
        </div>
      </div>

      {/* <!-- Playback Controls --> */}
      <div className="track-player-controls d-flex justify-content-center align-items-center">
        <IoIosShuffle className="fs-4 me-3 text-white" />
        <BiSkipPrevious className="fs-4 me-3 text-white" />
        <button
          className="bg-transparent text-light border-0 p-0"
          disabled={!hasTrack}
          onClick={() => handlePlayPause(track.uri)}
          type="button"
        >
          {isPlaying ? (
            <FaPauseCircle className="fs-2 text-light" />
          ) : (
            <FaPlayCircle className="fs-2 text-light" />
          )}
        </button>
        <BiSkipNext className="fs-4 ms-3 me-3 text-white" />
        <TbRepeat className="fs-5 text-white" />
      </div>

      {/* <!-- Additional Controls --> */}
      <div className="track-player-extra d-flex justify-content-end align-items-center ">
        <label className="track-player-volume" htmlFor="track-player-volume">
          <IoVolumeHighOutline className="fs-5 text-white" aria-hidden="true" />
          <input
            aria-label="Adjust player volume"
            id="track-player-volume"
            max="100"
            min="0"
            onChange={handleVolumeChange}
            type="range"
            value={volume}
          />
        </label>
        <button
          aria-label="Toggle fullscreen player"
          className="track-player-fullscreen"
          onClick={handleFullscreen}
          type="button"
        >
          <MdOutlineFullscreen className="fs-4 text-white" />
        </button>
      </div>
    </div>
    {playbackError ? <p className="track-player-error">{playbackError}</p> : null}
  </div>
</div>

  );
};

export default TrackDetails;
