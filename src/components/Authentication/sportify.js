export const authEndpoint = "https://accounts.spotify.com/authorize";
export const redirectUri =
  "https://ankitashendge-ankita-shendges-projects.vercel.app";

  
//  export const redirectUri = "http://localhost:3000/";

const clientId = "65f331ac024346659850288cc526fb16";

const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-modify-playback-state",
];

// http://localhost:3000/#access_token=BQD3WNFGIaH07FkoYk_dHMRs_n_Gzc-vJbKfeNKvyxq12TbbT-yMgNqLV1ldTYGjPU46Ekq-rGJSymbyQrpXZwz67TfjkD3qFLvrHa0d0UzT2vUyRKzz1Yf1yOLKwAAhBXoXEtmYYO3Z5V5rRJJyx28IHqOCU9n1sE9ImCwjjfkteful2MlBSfzitpGYw7dCJdBQRhitqIyjrnAFhu4M&token_type=Bearer&expires_in=3600

export const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      let parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};



export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}&response_type=token&show_dialog=true`;
