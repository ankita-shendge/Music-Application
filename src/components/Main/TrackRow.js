import React from "react";
import { FaRegPlayCircle } from "react-icons/fa";

function TrackRow({
  image,
  meta,
  onSelect,
  subtitle,
  title,
}) {
  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  }

  return (
    <li
      className="track-row"
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="track-row-main">
        {image ? (
          <img className="track-row-image" src={image} alt={title} />
        ) : (
          <div className="track-row-image track-row-image--empty" />
        )}
        <div className="track-row-copy">
          <p className="track-row-title">{title}</p>
          {subtitle ? <p className="track-row-subtitle">{subtitle}</p> : null}
        </div>
      </div>
      {meta ? <span className="track-row-meta">{meta}</span> : null}
      <span className="track-row-action">
        <FaRegPlayCircle />
      </span>
    </li>
  );
}

export default TrackRow;
