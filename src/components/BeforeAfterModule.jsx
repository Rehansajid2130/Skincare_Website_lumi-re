// ponytail: interactive clinical before-and-after comparison module providing unfiltered photographic proof
import React, { useState } from 'react';
import { Eye, CheckCircle, ShieldCheck } from 'lucide-react';
import beforeAfterImg from '../assets/clinical_before_after.jpg';

export default function BeforeAfterModule() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'baseline' | 'week8'

  return (
    <div className="lumiere-before-after-card">
      <div className="before-after-header">
        <div className="before-after-badge">
          <ShieldCheck size={14} />
          <span>CLINICAL TRIAL DOCUMENTATION • CASE STUDY #208</span>
        </div>
        <h3 className="before-after-title">
          8-Week Patient Transformation: Visible Reduction in Orbital Creasing
        </h3>
        <p className="before-after-sub">
          High-resolution unretouched dermatological polarimetry imaging. Male subject, age 44. Daily regimen: Cellular Anti-Aging Serum (PM) and Goodnight Wrinkle Cream.
        </p>
      </div>

      <div className="before-after-view-toggle">
        <button
          type="button"
          className={`toggle-pill-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Comparative View (Both)
        </button>
        <button
          type="button"
          className={`toggle-pill-btn ${activeTab === 'baseline' ? 'active' : ''}`}
          onClick={() => setActiveTab('baseline')}
        >
          Baseline (Day 0)
        </button>
        <button
          type="button"
          className={`toggle-pill-btn ${activeTab === 'week8' ? 'active' : ''}`}
          onClick={() => setActiveTab('week8')}
        >
          Week 8 (Post-Treatment)
        </button>
      </div>

      <div className="before-after-media-frame">
        <div className={`before-after-img-container mode-${activeTab}`}>
          <img
            src={beforeAfterImg}
            alt="Clinical before and after skin study showing dramatic softening of fine lines and improved micro-texture over 8 weeks"
            className="before-after-full-img"
            loading="lazy"
            decoding="async"
          />
        </div>

        {activeTab === 'all' && (
          <div className="before-after-annotations">
            <span className="annotation-tag left">BASELINE (WEEK 0)</span>
            <span className="annotation-tag right">WEEK 8 (CLINICAL RESULT)</span>
          </div>
        )}
      </div>

      <div className="before-after-metrics-strip">
        <div className="metric-chip">
          <CheckCircle size={15} className="metric-check-icon" />
          <span><strong>-43%</strong> fine line depth around eye & temple</span>
        </div>
        <div className="metric-chip">
          <CheckCircle size={15} className="metric-check-icon" />
          <span><strong>+56%</strong> epidermal hydration capacity</span>
        </div>
        <div className="metric-chip">
          <CheckCircle size={15} className="metric-check-icon" />
          <span><strong>+38%</strong> measured dermal bounce & elasticity</span>
        </div>
      </div>
    </div>
  );
}
