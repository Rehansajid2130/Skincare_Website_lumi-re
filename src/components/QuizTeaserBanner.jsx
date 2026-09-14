// ponytail: interactive diagnostic teaser connecting landing page directly to SkinQuiz
import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import textureImg from '../assets/skincare_texture.jpg';

export default function QuizTeaserBanner({ onOpenQuiz }) {
  return (
    <section className="lumiere-quiz-teaser-card" id="quiz-diagnostic-section">
      <div className="quiz-teaser-left">
        <div className="quiz-teaser-texture-wrap">
          <img
            src={textureImg}
            alt="Velvety night cream swirl and golden cellular serum droplet on travertine stone"
            className="quiz-teaser-texture-img"
            loading="lazy"
            decoding="async"
          />
          <div className="quiz-teaser-badge">
            <Sparkles size={14} />
            <span>Bio-Active Cellular Emulsion</span>
          </div>
        </div>
      </div>

      <div className="quiz-teaser-content">
        <div className="quiz-teaser-eyebrow">
          <span>CLINICAL DIAGNOSTIC CONSULTATION</span>
        </div>

        <h2 className="quiz-teaser-headline">
          Stop guessing what your skin needs. Let clinical science build your routine.
        </h2>

        <p className="quiz-teaser-sub">
          Every face has a unique cellular profile. Take our 2-minute diagnostic assessment to identify your barrier strength, UV damage index, and receive a precision-matched regimen.
        </p>

        <div className="quiz-teaser-bullets">
          <div className="quiz-teaser-bullet-item">
            <CheckCircle2 size={16} className="quiz-bullet-icon" />
            <span>Analyze barrier hydration & wrinkle depth</span>
          </div>
          <div className="quiz-teaser-bullet-item">
            <CheckCircle2 size={16} className="quiz-bullet-icon" />
            <span>Formulate custom Rx active concentration</span>
          </div>
          <div className="quiz-teaser-bullet-item">
            <CheckCircle2 size={16} className="quiz-bullet-icon" />
            <span>Free licensed medical provider review included</span>
          </div>
        </div>

        <button
          type="button"
          className="hims-btn-black quiz-teaser-cta"
          onClick={onOpenQuiz}
        >
          <span>Start Skin Diagnostic</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </section>
  );
}
