import React, { useState } from "react";
import { getLoginUrl } from "./sportify";
import "./Login.css";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setError("");
      setIsLoading(true);
      const loginUrl = await getLoginUrl();
      window.location.href = loginUrl;
    } catch (error) {
      setIsLoading(false);
      setError(error.message || "Unable to start Spotify login.");
    }
  };

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
