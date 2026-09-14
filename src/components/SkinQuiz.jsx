// ponytail: high-converting DTC luxury skin assessment quiz funnel matching Lumière aesthetic
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Sparkles, ShieldCheck, RefreshCw, UserCheck, Droplets, Sun, Moon, Activity, Layers } from 'lucide-react';
import serumCutoutImg from '../assets/serum_cutout.png';
import creamCutoutImg from '../assets/cream_cutout.png';
import cleanserCutoutImg from '../assets/cleanser_cutout.png';

export default function SkinQuiz({ 
  onClose, 
  onAddToCart, 
  onOpenAuth, 
  onNavigateToProduct,
  onQuizComplete
}) {
  const [currentStep, setCurrentStep] = useState(1); // 1, 2, 3, 4, 'analyzing', 'result'
  const [answers, setAnswers] = useState({
    concern: 'wrinkles',
    skinType: 'combination',
    experience: 'some',
    routine: 'complete'
  });
  const [analyzingStage, setAnalyzingStage] = useState(0);

  // Analysis screen stage animation
  useEffect(() => {
    if (currentStep === 'analyzing') {
      const timer1 = setTimeout(() => setAnalyzingStage(1), 800);
      const timer2 = setTimeout(() => setAnalyzingStage(2), 1600);
      const timer3 = setTimeout(() => {
        setCurrentStep('result');
        try {
          localStorage.setItem('lumiere_quiz_completed', 'true');
        } catch (e) {}
        if (onQuizComplete) onQuizComplete();
      }, 2500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [currentStep, onQuizComplete]);

  const concernsList = [
    {
      id: 'wrinkles',
      title: 'Wrinkles & Fine Lines',
      desc: "Smooth forehead creases, smile lines, and crow's feet with researched retinoids.",
      Icon: Sparkles
    },
    {
      id: 'firmness',
      title: 'Loss of Firmness & Elasticity',
      desc: 'Re-densify dermal collagen matrix to lift sagging and restore skin bounce.',
      Icon: Activity
    },
    {
      id: 'dark-spots',
      title: 'Dark Spots & Sun Damage',
      desc: 'Target stubborn hyperpigmentation and uneven skin tone from UV exposure.',
      Icon: Sun
    },
    {
      id: 'texture',
      title: 'Uneven Texture & Large Pores',
      desc: 'Refine micro-texture, minimize pore congestion, and reveal smooth skin.',
      Icon: Layers
    },
    {
      id: 'dryness',
      title: 'Dryness & Compromised Barrier',
      desc: 'Lock in deep hydration and reinforce the protective dermal moisture barrier.',
      Icon: Droplets
    }
  ];

  const skinTypesList = [
    {
      id: 'combination',
      title: 'Combination',
      desc: 'Oily or shiny around forehead & nose, but normal to dry on cheeks.'
    },
    {
      id: 'oily',
      title: 'Oily',
      desc: 'Consistent shine throughout the day with larger visible pores.'
    },
    {
      id: 'dry',
      title: 'Dry',
      desc: 'Skin often feels tight, thirsty, or occasionally shows fine flakes.'
    },
    {
      id: 'sensitive',
      title: 'Sensitive',
      desc: 'Easily turns red, reacts to fragrance, or stings with strong actives.'
    },
    {
      id: 'normal',
      title: 'Balanced / Normal',
      desc: 'Comfortable, neither oily nor dry throughout the day.'
    }
  ];

  const experienceList = [
    {
      id: 'new',
      title: 'First-time active user',
      desc: 'Never used prescription tretinoin or active retinoids. Start gentle to prevent purging.'
    },
    {
      id: 'some',
      title: 'Moderate experience',
      desc: 'Have used over-the-counter retinol, bakuchiol, or AHA exfoliants without issues.'
    },
    {
      id: 'experienced',
      title: 'Experienced prescription user',
      desc: 'Regularly use dermatological tretinoin 0.05%+ or adapalene. Ready for maximum clinical strength.'
    }
  ];

  const routineList = [
    {
      id: 'minimalist',
      title: '1-Step Targeted Power Routine',
      desc: 'Fast & effective. Just one personalized custom serum right before sleep.'
    },
    {
      id: 'complete',
      title: 'Complete 3-Step Dermatologist System (Recommended)',
      desc: 'Gentle Squalane Cleanser + Custom Serum + Overnight Wrinkle Hydrator for 3x faster results.'
    },
    {
      id: 'advanced',
      title: 'All-Day Defense & Clinical Regimen',
      desc: 'Morning antioxidant defense, daily mineral SPF 30, plus nighttime cellular repair.'
    }
  ];

  const handleSelectOption = (field, val) => {
    setAnswers(prev => ({ ...prev, [field]: val }));
  };

  const handleNext = () => {
    if (currentStep === 1) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(3);
    else if (currentStep === 3) setCurrentStep(4);
    else if (currentStep === 4) setCurrentStep('analyzing');
  };

  const handlePrev = () => {
    if (currentStep === 2) setCurrentStep(1);
    else if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 4) setCurrentStep(3);
    else if (currentStep === 'result') setCurrentStep(4);
  };

  // Generate personalized formula concentrations based on quiz responses
  const getPersonalizedFormula = () => {
    let tretinoin = '0.025%';
    if (answers.experience === 'experienced') tretinoin = '0.05%';
    if (answers.skinType === 'sensitive') tretinoin = '0.018%';

    let primaryFocus = 'Advanced Cellular Repair';
    if (answers.concern === 'wrinkles') primaryFocus = 'Deep Wrinkle & Line Reversal';
    if (answers.concern === 'dark-spots') primaryFocus = 'Photodamage & Pigment Correction';
    if (answers.concern === 'firmness') primaryFocus = 'Dermal Matrix & Collagen Synthesis';

    return {
      name: 'Custom Anti-Aging Serum (Formula #LM-924)',
      focus: primaryFocus,
      actives: `Tretinoin ${tretinoin} • Niacinamide 4% • Hyaluronic Acid 2% • Phyto-Peptides 5%`,
      price: 48,
      routineType: answers.routine
    };
  };

  const customFormula = getPersonalizedFormula();

  const handleClaimFormula = () => {
    if (answers.routine === 'complete') {
      // Add custom serum
      onAddToCart({
        id: 'custom-anti-aging-serum-quiz-plan',
        productId: 'custom-anti-aging-serum',
        title: 'Custom Anti-Aging Serum (Prescription Plan)',
        size: '30ml',
        isSubscription: true,
        price: 48,
        image: serumCutoutImg,
        qty: 1
      });
      // Add Goodnight Wrinkle Cream
      onAddToCart({
        id: 'goodnight-wrinkle-cream-quiz-plan',
        productId: 'goodnight-wrinkle-cream',
        title: 'Goodnight Wrinkle Cream (Night Step)',
        size: '50ml',
        isSubscription: true,
        price: 24,
        image: creamCutoutImg,
        qty: 1
      });
    } else {
      onAddToCart({
        id: 'custom-anti-aging-serum-quiz-plan',
        productId: 'custom-anti-aging-serum',
        title: 'Custom Anti-Aging Serum (Prescription Plan)',
        size: '30ml',
        isSubscription: true,
        price: 48,
        image: serumCutoutImg,
        qty: 1
      });
    }
    try {
      localStorage.setItem('lumiere_quiz_completed', 'true');
    } catch (e) {}
    if (onQuizComplete) onQuizComplete();
    onClose();
  };

  return (
    <div className="hims-quiz-overlay" role="dialog" aria-modal="true">
      {/* Quiz Top Navigation */}
      <div className="hims-quiz-nav">
        <div className="hims-quiz-nav-inner">
          {currentStep !== 'analyzing' && currentStep !== 'result' ? (
            <button 
              type="button" 
              className="hims-quiz-back-btn" 
              onClick={currentStep === 1 ? onClose : handlePrev}
              aria-label="Previous step"
            >
              <ArrowLeft size={18} />
              <span>{currentStep === 1 ? 'Exit' : 'Back'}</span>
            </button>
          ) : (
            <button 
              type="button" 
              className="hims-quiz-back-btn" 
              onClick={onClose}
              aria-label="Exit quiz"
            >
              <span>Close</span>
            </button>
          )}

          <div className="hims-quiz-nav-brand">
            lumière
          </div>

          {typeof currentStep === 'number' ? (
            <div className="hims-quiz-step-indicator">
              <span>Step {currentStep} of 4</span>
              <div className="hims-quiz-step-dots">
                {[1, 2, 3, 4].map((s) => (
                  <span 
                    key={s} 
                    className={`quiz-dot ${s <= currentStep ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div style={{ width: 60 }} />
          )}
        </div>
      </div>

      {/* Quiz Content Container */}
      <div className="hims-quiz-body">
        {/* STEP 1: SKIN CONCERN */}
        {currentStep === 1 && (
          <div className="hims-quiz-step-card animate-fade-in">
            <span className="quiz-question-badge">CONSULTATION STEP 1 OF 4</span>
            <h1 className="quiz-question-title">What is your primary skin concern?</h1>
            <p className="quiz-question-subtitle">
              Our dermatologists use this to determine the exact active compounds for your custom formulation.
            </p>

            <div className="quiz-options-grid">
              {concernsList.map((item) => {
                const isSelected = answers.concern === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`quiz-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption('concern', item.id)}
                  >
                    <div className="quiz-option-content">
                      <div className="quiz-option-title-row">
                        <span className="quiz-option-icon"><item.Icon size={18} /></span>
                        <h3 className="quiz-option-title">{item.title}</h3>
                      </div>
                      <p className="quiz-option-desc">{item.desc}</p>
                    </div>
                    <div className={`quiz-checkbox ${isSelected ? 'checked' : ''}`}>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="quiz-footer-actions">
              <button 
                type="button" 
                className="hims-btn-black quiz-continue-btn"
                onClick={handleNext}
              >
                <span>Continue</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SKIN TYPE */}
        {currentStep === 2 && (
          <div className="hims-quiz-step-card animate-fade-in">
            <span className="quiz-question-badge">CONSULTATION STEP 2 OF 4</span>
            <h1 className="quiz-question-title">How would you describe your skin?</h1>
            <p className="quiz-question-subtitle">
              This calibrates the emollient base so your skin absorbs the treatment without oiliness or irritation.
            </p>

            <div className="quiz-options-grid">
              {skinTypesList.map((item) => {
                const isSelected = answers.skinType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`quiz-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption('skinType', item.id)}
                  >
                    <div className="quiz-option-content">
                      <h3 className="quiz-option-title">{item.title}</h3>
                      <p className="quiz-option-desc">{item.desc}</p>
                    </div>
                    <div className={`quiz-checkbox ${isSelected ? 'checked' : ''}`}>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="quiz-footer-actions">
              <button 
                type="button" 
                className="hims-btn-black quiz-continue-btn"
                onClick={handleNext}
              >
                <span>Continue</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: EXPERIENCE WITH RETINOIDS */}
        {currentStep === 3 && (
          <div className="hims-quiz-step-card animate-fade-in">
            <span className="quiz-question-badge">CONSULTATION STEP 3 OF 4</span>
            <h1 className="quiz-question-title">Have you used prescription retinoids before?</h1>
            <p className="quiz-question-subtitle">
              Tretinoin is 20x stronger than OTC retinol. We personalize the starting strength for seamless tolerance.
            </p>

            <div className="quiz-options-grid">
              {experienceList.map((item) => {
                const isSelected = answers.experience === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`quiz-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption('experience', item.id)}
                  >
                    <div className="quiz-option-content">
                      <h3 className="quiz-option-title">{item.title}</h3>
                      <p className="quiz-option-desc">{item.desc}</p>
                    </div>
                    <div className={`quiz-checkbox ${isSelected ? 'checked' : ''}`}>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="quiz-footer-actions">
              <button 
                type="button" 
                className="hims-btn-black quiz-continue-btn"
                onClick={handleNext}
              >
                <span>Continue</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ROUTINE PREFERENCE */}
        {currentStep === 4 && (
          <div className="hims-quiz-step-card animate-fade-in">
            <span className="quiz-question-badge">CONSULTATION STEP 4 OF 4</span>
            <h1 className="quiz-question-title">What is your routine preference?</h1>
            <p className="quiz-question-subtitle">
              Whether you want a simple 60-second bedside routine or a complete clinical set, we design around you.
            </p>

            <div className="quiz-options-grid">
              {routineList.map((item) => {
                const isSelected = answers.routine === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`quiz-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption('routine', item.id)}
                  >
                    <div className="quiz-option-content">
                      <h3 className="quiz-option-title">{item.title}</h3>
                      <p className="quiz-option-desc">{item.desc}</p>
                    </div>
                    <div className={`quiz-checkbox ${isSelected ? 'checked' : ''}`}>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="quiz-footer-actions">
              <button 
                type="button" 
                className="hims-btn-black quiz-continue-btn"
                onClick={handleNext}
              >
                <span>Generate My Custom Formula</span>
                <Sparkles size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ANALYZING & FORMULATION TRANSITION SCREEN */}
        {currentStep === 'analyzing' && (
          <div className="hims-quiz-analyzing-card animate-fade-in">
            <div className="hims-loader-center-brand" style={{ width: 100, height: 100 }}>
              <span className="hims-loader-letter" style={{ fontSize: '3.8rem' }}>l</span>
              <svg className="hims-loader-orbit-svg" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="34"
                  fill="none"
                  stroke="#111111"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="3 16"
                />
              </svg>
            </div>

            <h2 className="quiz-analyzing-title">Formulating Your Compound</h2>
            
            <div className="quiz-analyzing-steps">
              <div className={`analyzing-row ${analyzingStage >= 0 ? 'done' : ''}`}>
                <Check size={16} />
                <span>Dermal profile & sensitivity mapping complete</span>
              </div>
              <div className={`analyzing-row ${analyzingStage >= 1 ? 'done' : ''}`}>
                <Check size={16} />
                <span>Balancing Tretinoin concentration with calming Niacinamide</span>
              </div>
              <div className={`analyzing-row ${analyzingStage >= 2 ? 'done' : ''}`}>
                <Check size={16} />
                <span>Custom compound calibrated & clinically verified</span>
              </div>
            </div>
          </div>
        )}

        {/* FINAL RESULT SCREEN: CUSTOM PRESCRIPTION PLAN */}
        {currentStep === 'result' && (
          <div className="hims-quiz-result-card animate-fade-in">
            <div className="quiz-result-header">
              <div className="quiz-result-badge-row">
                <span className="treatment-card-badge">Prescription Plan LM-924</span>
                <span className="quiz-doctor-approved-badge">
                  <ShieldCheck size={14} />
                  <span>Clinically Formulated</span>
                </span>
              </div>
              <h1 className="quiz-result-headline">
                Your Personalized Clinical Anti-Aging Plan
              </h1>
              <p className="quiz-result-sub">
                Formulated specifically for your <strong>{answers.skinType} skin</strong> to target{' '}
                <strong>{concernsList.find(c => c.id === answers.concern)?.title.toLowerCase()}</strong>.
              </p>
            </div>

            {/* Custom Formula Card */}
            <div className="quiz-prescription-box">
              <div className="quiz-prescription-left">
                <div className="quiz-prescription-img-wrap">
                  <img src={serumCutoutImg} alt="Custom Serum" className="product-cutout-img" />
                </div>
              </div>

              <div className="quiz-prescription-right">
                <span className="quiz-rx-label">CUSTOM NIGHT TREATMENT</span>
                <h3 className="quiz-rx-title">{customFormula.name}</h3>
                <div className="quiz-rx-actives">
                  <strong>ACTIVE FORMULA:</strong> {customFormula.actives}
                </div>
                <p className="quiz-rx-benefit">
                  Pairs prescription-strength tretinoin with anti-inflammatory niacinamide and bio-fermented peptides to accelerate cellular renewal while preventing dryness.
                </p>
                <div className="quiz-rx-pricing">
                  <div className="price-tag">$48 <span>/ monthly supply</span></div>
                  <div className="shipping-tag">Free 2-Day Air • Cancel Anytime</div>
                </div>
              </div>
            </div>

            {/* If Complete Routine Selected: Show the companion product */}
            {answers.routine === 'complete' && (
              <div className="quiz-routine-companion-box">
                <div className="companion-img-wrap">
                  <img src={creamCutoutImg} alt="Goodnight Wrinkle Cream" className="product-cutout-img" />
                </div>
                <div className="companion-details">
                  <span className="companion-tag">+ Recommended Step 2</span>
                  <h4 className="companion-title">Goodnight Wrinkle Cream</h4>
                  <p className="companion-desc">
                    Deeply conditions your moisture barrier overnight with shea butter, squalane, and multi-weight hyaluronic acid.
                  </p>
                </div>
                <div className="companion-price">+$24</div>
              </div>
            )}

            {/* AM / PM Daily Protocol Blueprint */}
            <div className="quiz-ampm-protocol-card">
              <h4 className="ampm-title">Your Daily Treatment Protocol</h4>
              <div className="ampm-grid">
                <div className="ampm-col">
                  <div className="ampm-badge am"><Sun size={14} /> Morning Protocol (60 Sec)</div>
                  <div className="ampm-step"><strong>Step 1:</strong> High Tide Squalane Cleanser (Rinse oil & detox pores)</div>
                  <div className="ampm-step"><strong>Step 2:</strong> Daily Mineral SPF 30 (Shield from UV & pollution)</div>
                </div>
                <div className="ampm-col">
                  <div className="ampm-badge pm"><Moon size={14} /> Evening Protocol (90 Sec)</div>
                  <div className="ampm-step"><strong>Step 1:</strong> {customFormula.name} (Rejuvenate cell turnover)</div>
                  <div className="ampm-step"><strong>Step 2:</strong> Goodnight Wrinkle Cream (Lock in moisture barrier)</div>
                </div>
              </div>
            </div>

            {/* Clinical Timeline */}
            <div className="quiz-timeline-row">
              <div className="timeline-col">
                <div className="timeline-week">WEEK 2</div>
                <div className="timeline-heading">Cellular Rebound</div>
                <p className="timeline-text">Dull dead cells slough off; skin feels softer and visibly refreshed.</p>
              </div>
              <div className="timeline-col">
                <div className="timeline-week">WEEK 6</div>
                <div className="timeline-heading">Line Reduction</div>
                <p className="timeline-text">Fine lines soften around eyes and forehead; tone becomes noticeably more even.</p>
              </div>
              <div className="timeline-col">
                <div className="timeline-week">WEEK 12</div>
                <div className="timeline-heading">Matrix Density</div>
                <p className="timeline-text">Collagen synthesis peaks, yielding firmer elasticity and lasting resilience.</p>
              </div>
            </div>

            {/* Primary Action Row */}
            <div className="quiz-claim-row">
              <button
                type="button"
                className="hims-btn-black quiz-claim-btn"
                onClick={handleClaimFormula}
              >
                <span>Claim My Formula & Start Trial</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="hims-btn-outline quiz-save-btn"
                onClick={() => {
                  try {
                    localStorage.setItem('lumiere_quiz_completed', 'true');
                  } catch (e) {}
                  if (onQuizComplete) onQuizComplete();
                  onClose();
                  onOpenAuth('signup');
                }}
              >
                Save Prescription to Account
              </button>
            </div>

            <div className="quiz-disclaimer-note">
              30-day money back guarantee • Prescription subject to medical consultation • 100% online
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
