import React, { useCallback, useEffect, useRef, useState } from "react";
import { getLoginUrl, redirectUri } from "./sportify";
import "./Login.css";

function Login() {
  const hasStartedLogin = useRef(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const startSpotifyLogin = useCallback(async () => {
    if (hasStartedLogin.current) {
      return;
    }

    hasStartedLogin.current = true;

    try {
      setError("");
      setIsLoading(true);
      const loginUrl = await getLoginUrl();
      window.location.href = loginUrl;
    } catch (error) {
      hasStartedLogin.current = false;
      setIsLoading(false);
      setError(error.message || "Unable to start Spotify login.");
    }
  }, []);

  const handleLogin = () => {
    const configuredRedirectOrigin = new URL(redirectUri).origin;

    if (window.location.origin !== configuredRedirectOrigin) {
      window.location.href = `${configuredRedirectOrigin}/?start_spotify_login=true`;
      return;
    }

    startSpotifyLogin();
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("start_spotify_login") === "true") {
      startSpotifyLogin();
    }
  }, [startSpotifyLogin]);

  return (
    <div className="login">
      <img
        src="https://music-b26f.kxcdn.com/wp-content/uploads/2017/06/635963274692858859903160895_spotify-logo-horizontal-black.jpg"
        alt="Spotify logo"
      />
      <button
        onClick={handleLogin}
        className="login-button"
        disabled={isLoading}
        type="button"
      >
        {isLoading ? "CONNECTING..." : "LOGIN WITH SPOTIFY"}
      </button>
      {error ? <p className="login-error">{error}</p> : null}
    </div>
  );
}

export default Login;
