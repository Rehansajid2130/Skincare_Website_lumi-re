// ponytail: unified reusable product card component shared across LandingPage and ProductPage
import React from 'react';

export default function ProductCard({
  id,
  title,
  price,
  desc,
  img,
  badge = null,
  onClick,
  onAction,
  actionLabel = 'Learn more',
  imageHeight = 260
}) {
  const handleCardClick = () => {
    if (onClick) onClick(id);
    else if (onAction) onAction(id);
  };

  return (
    <div className="hims-basic-card" key={id}>
      <div
        className="basic-card-img-box"
        style={{ height: imageHeight, cursor: 'pointer' }}
        onClick={handleCardClick}
      >
        {badge && <span className="basic-card-badge">{badge}</span>}
        <img
          src={img}
          alt={title}
          className="basic-product-cutout-img"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="basic-card-info">
        <h3 className="basic-card-title">{title}</h3>
        <div className="basic-card-price">{price}</div>
        <p className="basic-card-text">{desc}</p>
        <button
          type="button"
          className="hims-btn-outline basic-card-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (onAction) onAction(id);
            else if (onClick) onClick(id);
          }}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
