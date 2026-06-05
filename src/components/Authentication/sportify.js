export const authEndpoint = "https://accounts.spotify.com/authorize";
export const tokenEndpoint = "https://accounts.spotify.com/api/token";

const CODE_VERIFIER_KEY = "spotify_code_verifier";
const AUTH_STATE_KEY = "spotify_auth_state";

export const clientId =
  process.env.REACT_APP_SPOTIFY_CLIENT_ID || "26a01ecfcb0e421995af48e901cfa1d0";

export const redirectUri =
  process.env.REACT_APP_SPOTIFY_REDIRECT_URI ||
  `${window.location.origin}/callback`;

const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-modify-playback-state",
];

// -------------------- PKCE HELPERS --------------------

export const generateRandomString = (length) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((x) => possible[x % possible.length])
    .join("");
};

export const generateCodeChallenge = async (verifier) => {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

// -------------------- LOGIN URL --------------------

export const getLoginUrl = async () => {
  if (!clientId) {
    throw new Error("Missing REACT_APP_SPOTIFY_CLIENT_ID.");
  }

  const codeVerifier = generateRandomString(128);
  const state = generateRandomString(32);

  sessionStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);
  sessionStorage.setItem(AUTH_STATE_KEY, state);

  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    state,
    show_dialog: "true",
  });

  return `${authEndpoint}?${params.toString()}`;
};

// -------------------- TOKEN EXCHANGE --------------------

export const getToken = async (code, state) => {
  const verifier = sessionStorage.getItem(CODE_VERIFIER_KEY);
  const expectedState = sessionStorage.getItem(AUTH_STATE_KEY);

  sessionStorage.removeItem(CODE_VERIFIER_KEY);
  sessionStorage.removeItem(AUTH_STATE_KEY);

  if (!verifier) {
    throw new Error("Missing Spotify PKCE verifier. Please try signing in again.");
  }

  if (!state || state !== expectedState) {
    throw new Error("Spotify login state mismatch. Please try signing in again.");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  });

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || "Spotify token exchange failed.");
  }

  return data;
};
