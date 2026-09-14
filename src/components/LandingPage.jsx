// ponytail: component-based luxury DTC landing page with high-conversion visual storytelling modules
import React, { useRef } from 'react';
import { ArrowRight, Check, Info } from 'lucide-react';
import himsHeroBgImg from '../assets/hims_hero_bg.jpg';
import editorialModelImg from '../assets/editorial_model.jpg';
import serumCutoutImg from '../assets/serum_cutout.png';
import creamCutoutImg from '../assets/cream_cutout.png';
import vitamincCutoutImg from '../assets/vitaminc_cutout.png';
import moisturizerCutoutImg from '../assets/moisturizer_cutout.png';
import cleanserCutoutImg from '../assets/cleanser_cutout.png';
import sunscreenCutoutImg from '../assets/sunscreen_cutout.png';
import rxCreamCutoutImg from '../assets/rx_cream_cutout.png';
import { PRODUCTS } from '../data/products';

// ponytail: modular reusable components
import ProductCard from './ProductCard';
import SectionHeader from './SectionHeader';
import CategoryPillCard from './CategoryPillCard';
import QuizTeaserBanner from './QuizTeaserBanner';
import ScienceSection from './ScienceSection';
import ClinicalProofSection from './ClinicalProofSection';

export default function LandingPage({
  onSelectProduct,
  onAddToCart,
  onNavigateToProductPage,
  onOpenQuiz,
  products = PRODUCTS
}) {
  const basicsTrackRef = useRef(null);
  const categoryTrackRef = useRef(null);

  // ponytail: reuse unified scroll helper for both horizontal tracks
  const handleScroll = (ref, direction, amount = 380) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -amount : amount;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const categories = [
    { id: 'custom-anti-aging-serum', title: 'Anti-Aging', bg: '#F5EBE1', img: serumCutoutImg },
    { id: 'high-tide-cleanser', title: 'Cleansers', bg: '#E4EBE5', img: cleanserCutoutImg },
    { id: 'goodnight-wrinkle-cream', title: 'Wrinkle Creams', bg: '#F2EAE4', img: creamCutoutImg },
    { id: 'vitaminc-serum', title: 'Vitamin C', bg: '#FAF0DE', img: vitamincCutoutImg },
    { id: 'everyday-moisturizer', title: 'Moisturizers', bg: '#E6ECEE', img: moisturizerCutoutImg },
    { id: 'daily-spf-defense', title: 'Sun Care', bg: '#EDE8E3', img: sunscreenCutoutImg },
    { id: 'prescription-anti-aging-cream', title: 'Rx Treatments', bg: '#E9E3DC', img: rxCreamCutoutImg },
  ];

  const basicsItems = [
    {
      id: 'goodnight-wrinkle-cream',
      title: 'Goodnight Wrinkle Cream',
      price: '$24',
      desc: 'Keeps skin hydrated through the night with shea butter and hyaluronic acid, while caffeine works to reduce puffiness.',
      img: creamCutoutImg,
      badge: null,
    },
    {
      id: 'vitaminc-serum',
      title: 'Vitamin C Serum',
      price: '$33',
      desc: 'Antioxidant-packed molecules that quickly absorb to soften skin and protect it from environmental hazards.',
      img: vitamincCutoutImg,
      badge: null,
    },
    {
      id: 'everyday-moisturizer',
      title: 'Everyday Moisturizer',
      price: '$18',
      desc: "Light-weight formulation designed to lock in deep hydration without leaving shine or an oily film.",
      img: moisturizerCutoutImg,
      badge: null,
    },
    {
      id: 'high-tide-cleanser',
      title: 'High Tide Cleanser',
      price: '$15',
      desc: "2-in-1 foaming cleanser formulated with hydrating squalane to cleanse gently without stripping skin's barrier.",
      img: cleanserCutoutImg,
      badge: 'New',
    },
    {
      id: 'daily-spf-defense',
      title: 'Daily Mineral SPF 30',
      price: '$22',
      desc: 'Broad-spectrum mineral defense with soothing zinc oxide and botanical antioxidants that blends invisibly.',
      img: sunscreenCutoutImg,
      badge: null,
    },
  ];

  return (
    <div className="hims-landing-page">
      {/* SECTION 1: HERO BANNER */}
      <section className="hims-hero-card">
        <img
          src={himsHeroBgImg}
          alt="Lumière Clinical Formulations"
          className="hims-hero-bg-img"
          fetchPriority="high"
          decoding="sync"
        />
        <div className="hims-hero-gradient-overlay" />

        <div className="hims-hero-content">
          <span className="hero-eyebrow-tag">LABORATOIRES LUMIÈRE PARIS</span>
          <h1 className="hims-hero-headline" style={{ color: '#111111' }}>
            Precision anti-aging skin care, engineered for real results
          </h1>

          <p className="hims-hero-sub" style={{ color: '#3d3935' }}>
            Target deep wrinkles, crow's feet, and texture loss with prescription-strength active ingredients backed by board-certified dermatologists.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="hims-btn-black hims-hero-cta"
              onClick={() => onNavigateToProductPage('custom-anti-aging-serum')}
            >
              Explore Treatments
            </button>
            <button
              type="button"
              className="hims-btn-outline hims-hero-secondary-cta"
              onClick={onOpenQuiz}
            >
              Take 2-Min Skin Quiz
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: CATEGORY TRIO CARDS */}
      <section className="hims-category-section" id="treatments-section">
        <div className="hims-trio-grid">
          {/* Card 1: Editorial Lifestyle Application Card */}
          <div className="hims-model-card">
            <img src={editorialModelImg} alt="Model applying cellular serum" loading="lazy" decoding="async" />
            <div className="hims-model-card-overlay" />
            <div className="model-card-text-wrap">
              <span className="model-card-step">CLINICAL PROTOCOL</span>
              <h2 className="hims-model-title">Targeted Anti-Aging</h2>
            </div>
          </div>

          {/* Card 2: Custom Treatment Card */}
          <div className="hims-treatment-card">
            <div className="treatment-card-header">
              <h3 className="treatment-card-title">Custom<br />Anti-Aging Serum</h3>
              <span className="treatment-card-badge">Prescription</span>
            </div>

            <div
              className="treatment-card-img-wrap"
              onClick={() => onNavigateToProductPage('custom-anti-aging-serum')}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={serumCutoutImg}
                alt="Custom Anti-Aging Serum"
                className="product-cutout-img"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="treatment-card-footer">
              <div
                className="treatment-safety-info"
                onClick={() => onNavigateToProductPage('custom-anti-aging-serum')}
              >
                <Info size={14} />
                <span>Important safety information</span>
              </div>
              <div className="treatment-btn-row">
                <button
                  type="button"
                  className="hims-btn-white"
                  onClick={() => onNavigateToProductPage('custom-anti-aging-serum')}
                >
                  Get started
                </button>
                <button
                  type="button"
                  className="hims-btn-outline"
                  onClick={() => onNavigateToProductPage('custom-anti-aging-serum')}
                >
                  Learn more
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Goodnight Wrinkle Cream Card */}
          <div className="hims-treatment-card">
            <div className="treatment-card-header">
              <h3 className="treatment-card-title">Goodnight<br />Wrinkle Cream</h3>
              <span className="treatment-card-price">$24</span>
            </div>

            <div
              className="treatment-card-img-wrap"
              onClick={() => onNavigateToProductPage('goodnight-wrinkle-cream')}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={creamCutoutImg}
                alt="Goodnight Wrinkle Cream"
                className="product-cutout-img"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="treatment-card-footer">
              <div style={{ height: 21 }}></div>
              <div className="treatment-btn-row">
                <button
                  type="button"
                  className="hims-btn-white"
                  onClick={() => onAddToCart({
                    id: 'goodnight-wrinkle-cream-50ml-one',
                    productId: 'goodnight-wrinkle-cream',
                    title: 'Goodnight Wrinkle Cream',
                    size: '50ml',
                    isSubscription: false,
                    price: 24,
                    image: creamCutoutImg,
                    qty: 1
                  })}
                >
                  Buy now
                </button>
                <button
                  type="button"
                  className="hims-btn-outline"
                  onClick={() => onNavigateToProductPage('goodnight-wrinkle-cream')}
                >
                  Learn more
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Description and Shop All Arrow */}
        <div className="hims-category-subrow">
          <p className="hims-category-subtext">
            Dry skin, crow's feet, forehead creases, and sun damage. We combine dermatologist-prescribed actives like tretinoin, azelaic acid, and niacinamide to smooth lines and restore dermal bounce.
          </p>
          <button
            type="button"
            className="hims-shop-all-btn"
            onClick={() => onNavigateToProductPage()}
          >
            <span>Shop All Formulations</span>
            <div className="circle-arrow-icon">
              <ArrowRight size={20} />
            </div>
          </button>
        </div>
      </section>

      {/* SECTION 3: PRODUCT BASICS SHOWCASE (using reusable SectionHeader & ProductCard) */}
      <section className="hims-basics-section" id="basics-section">
        <SectionHeader
          title="Dermatologist-approved skin care basics"
          onPrev={() => handleScroll(basicsTrackRef, 'left', 380)}
          onNext={() => handleScroll(basicsTrackRef, 'right', 380)}
        />

        <div className="hims-basics-scroll-wrap">
          <div className="hims-basics-track" ref={basicsTrackRef}>
            {basicsItems.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                desc={item.desc}
                img={item.img}
                badge={item.badge}
                onClick={onNavigateToProductPage}
                onAction={onNavigateToProductPage}
                actionLabel="Learn more"
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE QUIZ & SENSORY TEASER (Visual Storytelling Module) */}
      <QuizTeaserBanner onOpenQuiz={onOpenQuiz} />

      {/* SECTION 5: CLINICAL TIMELINE & DERMATOLOGIST PROOF (Visual Storytelling Module) */}
      <ClinicalProofSection />

      {/* SECTION 6: THE CELLULAR SCIENCE */}
      <ScienceSection />

      {/* SECTION 7: RESEARched TREATMENT SPOTLIGHT */}
      <section className="hims-product-detail-layout">
        <div className="hims-product-left-canvas">
          <img
            src={rxCreamCutoutImg}
            alt="Researched prescription anti-aging treatment cream"
            className="hims-rx-product-img"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="hims-product-right-info">
          <h2 className="hims-product-headline">
            Researched anti-aging treatments for real results
          </h2>

          <div className="hims-checklist-group">
            <div className="hims-check-row">
              <div className="hims-check-circle">
                <Check size={14} strokeWidth={3} />
              </div>
              <div>
                <h4 className="hims-check-heading">Reduce fine lines and deep wrinkles</h4>
                <p className="hims-check-desc">
                  Our prescription ingredients visibly soften creases, refine pores, and give skin a more uniform texture.
                </p>
              </div>
            </div>

            <div className="hims-check-row">
              <div className="hims-check-circle">
                <Check size={14} strokeWidth={3} />
              </div>
              <div>
                <h4 className="hims-check-heading">Fight signs of aging with lipid hydration</h4>
                <p className="hims-check-desc">
                  Prescription treatments work best when paired with biomimetic moisturizers like squalane and multi-depth hyaluronic acid.
                </p>
              </div>
            </div>

            <div className="hims-check-row">
              <div className="hims-check-circle">
                <Check size={14} strokeWidth={3} />
              </div>
              <div>
                <h4 className="hims-check-heading">Formulated for night cellular recovery</h4>
                <p className="hims-check-desc">
                  Hydrates and stimulates cellular rejuvenation while you sleep, so skin looks refreshed, plump, and rested by morning.
                </p>
              </div>
            </div>
          </div>

          <div className="hims-product-cta-row">
            <button
              type="button"
              className="hims-btn-black"
              onClick={() => onNavigateToProductPage('prescription-anti-aging-cream')}
            >
              Get started today
            </button>
            <button
              type="button"
              className="hims-btn-outline"
              onClick={() => onNavigateToProductPage('prescription-anti-aging-cream')}
            >
              Learn more
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 8: EXPLORE BY CATEGORY (using reusable SectionHeader & CategoryPillCard) */}
      <section className="hims-categories-section" id="categories-section">
        <SectionHeader
          title="Shop by category"
          onPrev={() => handleScroll(categoryTrackRef, 'left', 300)}
          onNext={() => handleScroll(categoryTrackRef, 'right', 300)}
        />

        <div className="hims-category-scroll-wrap">
          <div className="hims-category-track" ref={categoryTrackRef}>
            {categories.map((cat) => (
              <CategoryPillCard
                key={cat.id}
                id={cat.id}
                title={cat.title}
                bg={cat.bg}
                img={cat.img}
                onClick={onNavigateToProductPage}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
