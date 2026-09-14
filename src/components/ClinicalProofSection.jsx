// ponytail: clinical proof module providing timeline transformation, unretouched case study, and medical authority
import React from 'react';
import { ShieldCheck, Award, Check } from 'lucide-react';
import doctorImg from '../assets/dermatologist_portrait.jpg';
import BeforeAfterModule from './BeforeAfterModule';

export default function ClinicalProofSection() {
  const milestones = [
    {
      period: 'Day 1',
      title: 'Micro-Hydration & Soothing',
      desc: 'Skin barrier is instantly replenished with multi-depth hyaluronic molecules and squalane. 0% greasy residue.'
    },
    {
      period: 'Week 4',
      title: 'Cellular Turnover Acceleration',
      desc: 'Old surface keratinocytes shed cleanly. Rough patches soften, pores tighten, and skin awakens with a clear glow.'
    },
    {
      period: 'Week 12',
      title: 'Collagen Architecture Density',
      desc: 'Sustained bio-peptide and retinoid signaling re-densifies the dermal matrix, visibly smoothing expression lines.'
    }
  ];

  return (
    <section className="lumiere-proof-section" id="clinical-proof-section">
      <div className="proof-header">
        <span className="proof-eyebrow">THE CELLULAR TIMELINE</span>
        <h2 className="proof-main-title">Measured clinical transformation over 12 weeks</h2>
        <p className="proof-main-sub">
          Formulated with prescription-grade actives engineered to work in synergy with your skin’s natural 28-day regenerative cycle.
        </p>
      </div>

      {/* 3-Step Milestone Progression */}
      <div className="proof-timeline-grid">
        {milestones.map((m, idx) => (
          <div className="proof-timeline-card" key={idx}>
            <div className="proof-step-badge">{m.period}</div>
            <h3 className="proof-step-title">{m.title}</h3>
            <p className="proof-step-desc">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Unfiltered Clinical Before & After Photographic Case Study */}
      <BeforeAfterModule />

      {/* Medical Authority & Doctor Endorsement */}
      <div className="proof-doctor-card">
        <div className="proof-doctor-img-wrap">
          <img
            src={doctorImg}
            alt="Dr. Sarah Jenkins, MD, FAAD - Board-Certified Dermatological Advisor"
            className="proof-doctor-img"
            loading="lazy"
            decoding="async"
          />
          <div className="doctor-verified-badge">
            <ShieldCheck size={14} />
            <span>Board-Certified FAAD</span>
          </div>
        </div>

        <div className="proof-doctor-content">
          <div className="doctor-quote-mark">“</div>
          <p className="proof-doctor-quote">
            By buffering micro-encapsulated retinoids with biomimetic squalane and phyto-peptides, Lumière delivers deep cellular regeneration without the chronic flaking or irritation typical of traditional men’s anti-aging treatments.
          </p>

          <div className="proof-doctor-meta">
            <strong>Dr. Sarah Jenkins, MD</strong>
            <span>Board-Certified Dermatological Advisor • Fellow of the American Academy of Dermatology</span>
          </div>

          <div className="proof-stats-row">
            <div className="proof-stat-item">
              <span className="proof-stat-number">94%</span>
              <span className="proof-stat-text">Reported smoother skin after first morning</span>
            </div>
            <div className="proof-stat-item">
              <span className="proof-stat-number">89%</span>
              <span className="proof-stat-text">Measured visible fine line depth reduction</span>
            </div>
            <div className="proof-stat-item">
              <span className="proof-stat-number">96%</span>
              <span className="proof-stat-text">Experienced zero irritation or skin redness</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
