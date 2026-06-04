import React, { useContext } from "react";

import TrackDetails from "./TrackDetails";
import { TrackContext } from "../TrackContext";

function Rightbar() {
  const { currentTrack } = useContext(TrackContext); // Access currentTrack from context

  return (
    <>
      <div className="player-shell p-2 rounded-3 bg-info">
        <div className="player-shell-inner">
          <TrackDetails track={currentTrack}  />
        </div>
      </div>
    </>
  );
}

export default Rightbar;
