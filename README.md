# Music Application

A responsive Spotify-powered music application built with React. Users can sign
in with Spotify, browse music, search for tracks, view their top tracks, and
control playback from a custom player.

## Features

- Spotify login using Authorization Code Flow with PKCE
- Browse trending, English, Bollywood, and Spanish tracks
- View top tracks, artists, albums, and audiobooks
- Search Spotify tracks
- Responsive desktop, tablet, and mobile layouts
- Play and pause Spotify playback
- Volume control
- Playback progress bar with seeking
- Fullscreen player with large album artwork
- Spotify profile menu and logout

## Tech Stack

- React 18
- Spotify Web API
- React Router
- React Icons
- Bootstrap
- Styled Components
- React Split
- Vercel

## Requirements

- Node.js and npm
- A Spotify account
- A Spotify Developer application
- Spotify Premium for playback controls such as play, pause, seek, and volume

When the Spotify application is in Development Mode, users must be added to the
app's allowlist in the Spotify Developer Dashboard before they can sign in.

## Spotify Setup

1. Open the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Create an app or open an existing app.
3. Copy the app's Client ID.
4. Add the redirect URI used by the application.

For local development:

```text
http://127.0.0.1:3000/callback
```

For production:

```text
https://your-production-domain.vercel.app/callback
```

The redirect URI must exactly match the value configured in the application.
The protocol, domain, port, path, and trailing slash all matter.

This project uses PKCE, so a Spotify Client Secret is not required and should
never be added to the frontend.

## Environment Variables

Create a `.env.local` file in the project root:

```env
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
REACT_APP_SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback
```

Environment files such as `.env.local` are ignored by git.

## Installation

```bash
git clone https://github.com/ankita-shendge/Music-Application.git
cd Music-Application
npm install
```

Start the development server:

```bash
npm start
```

Open:

```text
http://127.0.0.1:3000
```

## Production Build

```bash
npm run build
```

The optimized production build is created in the `build` directory.

## Vercel Deployment

Add these environment variables in the Vercel project settings:

```text
REACT_APP_SPOTIFY_CLIENT_ID
REACT_APP_SPOTIFY_REDIRECT_URI
```

Use the stable production domain for `REACT_APP_SPOTIFY_REDIRECT_URI`:

```text
https://your-production-domain.vercel.app/callback
```

Add the same URI to the Spotify Developer Dashboard, then redeploy the project.
Avoid using changing Vercel preview URLs for Spotify login.

The included `vercel.json` rewrites application routes to `index.html`, allowing
Spotify's `/callback` redirect to load the React application.

## Available Scripts

```bash
npm start
```

Runs the application in development mode.

```bash
npm run build
```

Creates an optimized production build.

```bash
npm test
```

Runs the test runner in watch mode.

## Project Structure

```text
src/
  components/
    Authentication/   Spotify login, PKCE, and logout
    Main/             Browse, search, navigation, and track lists
    Right/            Music player
    Sidebar/          Sidebar components
    TrackContext.js   Selected-track state
  utils/              Session cache utilities
  App.js              Authentication and responsive application layout
  App.css             Application and player styles
```

## Troubleshooting

### `redirect_uri: Not matching configuration`

Confirm that `REACT_APP_SPOTIFY_REDIRECT_URI` exactly matches a Redirect URI in
the Spotify Developer Dashboard.

### `client_id: Invalid`

Confirm that `REACT_APP_SPOTIFY_CLIENT_ID` contains the Client ID from the same
Spotify application where the redirect URI was configured.

### Playback controls do not work

Spotify playback controls require Spotify Premium and an active Spotify device.
Open Spotify on a device before attempting playback.

### Login works only after a second attempt

Start login from the same stable domain that Spotify redirects back to. PKCE
login data is stored per browser origin and cannot be shared between changing
Vercel preview domains and the production domain.

## Author

Built by [Ankita Shendge](https://github.com/ankita-shendge).
