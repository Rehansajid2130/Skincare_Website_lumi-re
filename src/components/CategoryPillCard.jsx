// ponytail: reusable category pill card supporting mouse click and keyboard Enter/Space
import React from 'react';

export default function CategoryPillCard({ id, title, bg, img, onClick }) {
  const handleClick = () => {
    if (onClick) onClick(id);
  };

  return (
    <div
      className="hims-category-pill-card"
      style={{ backgroundColor: bg }}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Shop ${title}`}
    >
      <span className="hims-category-pill-title">{title}</span>
      <div className="hims-category-pill-img-wrap">
        <img
          src={img}
          alt={title}
          className="hims-category-pill-img"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
