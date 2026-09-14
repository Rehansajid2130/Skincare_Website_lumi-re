// ponytail: reusable section header with optional eyebrow, subtitle, and directional arrows
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SectionHeader({
  title,
  subtitle,
  onPrev,
  onNext,
  prevLabel = 'Scroll left',
  nextLabel = 'Scroll right'
}) {
  return (
    <div className="hims-section-top-header">
      <div>
        <h2 className="hims-section-title">{title}</h2>
        {subtitle && <p className="hims-section-desc-left">{subtitle}</p>}
      </div>

      {(onPrev || onNext) && (
        <div className="hims-section-header-right">
          <div className="hims-scroll-arrows">
            {onPrev && (
              <button
                type="button"
                className="hims-arrow-btn"
                onClick={onPrev}
                aria-label={prevLabel}
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {onNext && (
              <button
                type="button"
                className="hims-arrow-btn"
                onClick={onNext}
                aria-label={nextLabel}
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
