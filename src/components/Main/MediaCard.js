import React from "react";
import { FaPlay } from "react-icons/fa";

function MediaCard({
  image,
  imageShape = "square",
  onClick,
  subtitle,
  title,
}) {
  return (
    <button className="media-card" onClick={onClick} type="button">
      <span className={`media-card-art media-card-art--${imageShape}`}>
        {image ? (
          <img src={image} alt={title} />
        ) : (
          <span className="media-card-empty-art" />
        )}
        <span className="media-card-play">
          <FaPlay />
        </span>
      </span>
      <span className="media-title">{title}</span>
      {subtitle ? <span className="media-subtitle">{subtitle}</span> : null}
    </button>
  );
}

export default MediaCard;
