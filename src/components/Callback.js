import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "./Authentication/sportify";

function Callback() {
  const navigate = useNavigate();
  const isExchangingToken = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (code && !isExchangingToken.current) {
      isExchangingToken.current = true;

      getToken(code, state)
        .then((data) => {
          const token = data.access_token;

          if (token) {
            localStorage.setItem("access_token", token);

            // Optional: fetch device
            fetch("https://api.spotify.com/v1/me/player/devices", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.devices?.length > 0) {
                  localStorage.setItem(
                    "spotify_device_id",
                    data.devices[0].id
                  );
                }
              });

            // redirect to home after success
            navigate("/");
          } else {
            console.error("Token error:", data);
          }
        })
        .catch((error) => {
          console.error("Spotify login failed:", error);
          isExchangingToken.current = false;
          navigate("/");
        });
    }
  }, [navigate]);

  return <div>Loading Spotify login...</div>;
}

export default Callback;
