import React, { useEffect, useRef, useState } from "react";
import Split from "react-split";
import { useMediaQuery } from "react-responsive";
import { getToken } from "./components/Authentication/sportify";
import Main from "./components/Main/Main";
import Login from "./components/Authentication/Login";
import Rightbar from "./components/Right/Rightbar";
import { TrackProvider } from "./components/TrackContext";
import "./App.css";

function App() {
  const isCompactLayout = useMediaQuery({ maxWidth: 900 });
  const isExchangingToken = useRef(false);
  const [token, setToken] = useState(
    () => window.localStorage.getItem("access_token") || "",
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (code && !token && !isExchangingToken.current) {
      isExchangingToken.current = true;

      getToken(code, state)
        .then((data) => {
          const _token = data.access_token;

          if (_token) {
            setToken(_token);
            window.localStorage.setItem("access_token", _token);

            // Fetch Spotify devices
            fetch("https://api.spotify.com/v1/me/player/devices", {
              headers: {
                Authorization: `Bearer ${_token}`,
              },
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.devices?.length > 0) {
                  const deviceId = data.devices[0].id;
                  window.localStorage.setItem("spotify_device_id", deviceId);
                }
              });

            // Clean URL
            window.history.replaceState({}, document.title, "/");
          } else {
            console.error("Token error:", data);
          }
        })
        .catch((error) => {
          console.error("Spotify login failed:", error);
          isExchangingToken.current = false;
        });
    }
  }, [token]);

  return (
    <>
      {token ? (
        <TrackProvider>
          {isCompactLayout ? (
            <div className="app-shell app-shell--compact">
              <Main />
              <Rightbar />
            </div>
          ) : (
            <Split
              className="app-shell"
              sizes={[85, 15]}
              direction="vertical"
              minSize={50}
              gutterSize={8}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
              }}
            >
              <Main />

              <Rightbar />
            </Split>
          )}
        </TrackProvider>
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;
