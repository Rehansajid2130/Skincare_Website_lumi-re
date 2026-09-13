// ponytail: 2026 DTC landing page matching Hims reference images 0, 1, 3, and 4
import React, { useRef } from 'react';
import { ArrowRight, Check, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import heroPedestalImg from '../assets/hero_pedestal.jpg';
import himsHeroBgImg from '../assets/hims_hero_bg.jpg';
import editorialModelImg from '../assets/editorial_model.jpg';
import serumImg from '../assets/serum_studio.jpg';
import creamImg from '../assets/cream_studio.jpg';
import cleanserImg from '../assets/cleanser_studio.jpg';
import skinScienceImg from '../assets/skin_science.jpg';
import serumCutoutImg from '../assets/serum_cutout.png';
import creamCutoutImg from '../assets/cream_cutout.png';
import vitamincCutoutImg from '../assets/vitaminc_cutout.png';
import moisturizerCutoutImg from '../assets/moisturizer_cutout.png';
import cleanserCutoutImg from '../assets/cleanser_cutout.png';
import sunscreenCutoutImg from '../assets/sunscreen_cutout.png';
import rxCreamCutoutImg from '../assets/rx_cream_cutout.png';
import { PRODUCTS } from '../data/products';

export default function LandingPage({
  onSelectProduct,
  onAddToCart,
  onNavigateToProductPage,
  onOpenQuiz,
  products = PRODUCTS
}) {
  const serum = products[0] || PRODUCTS[0];
  const cream = products[1] || PRODUCTS[1];
  const cleanser = products[2] || PRODUCTS[2];
  const basicsTrackRef = useRef(null);
  const categoryTrackRef = useRef(null);

  const scrollBasics = (direction) => {
    if (basicsTrackRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      basicsTrackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollCategories = (direction) => {
    if (categoryTrackRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      categoryTrackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const categories = [
    {
      id: 'custom-anti-aging-serum',
      title: 'Anti-Aging',
      bg: '#F5EBE1',
      img: serumCutoutImg,
    },
    {
      id: 'high-tide-cleanser',
      title: 'Cleansers',
      bg: '#E4EBE5',
      img: cleanserCutoutImg,
    },
    {
      id: 'goodnight-wrinkle-cream',
      title: 'Wrinkle Creams',
      bg: '#F2EAE4',
      img: creamCutoutImg,
    },
    {
      id: 'vitaminc-serum',
      title: 'Vitamin C',
      bg: '#FAF0DE',
      img: vitamincCutoutImg,
    },
    {
      id: 'everyday-moisturizer',
      title: 'Moisturizers',
      bg: '#E6ECEE',
      img: moisturizerCutoutImg,
    },
    {
      id: 'daily-spf-defense',
      title: 'Sun Care',
      bg: '#EDE8E3',
      img: sunscreenCutoutImg,
    },
    {
      id: 'prescription-anti-aging-cream',
      title: 'Rx Treatments',
      bg: '#E9E3DC',
      img: rxCreamCutoutImg,
    },
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
      desc: 'Antioxidant-packed molecules that quickly absorb to soften skin and protect it from the hazards of the elements.',
      img: vitamincCutoutImg,
      badge: null,
    },
    {
      id: 'everyday-moisturizer',
      title: 'Everyday Moisturizer',
      price: '$18',
      desc: "This light-weight moisturizer is formulated to help lock in your skin's moisture without leaving you looking shiny or oily.",
      img: moisturizerCutoutImg,
      badge: null,
    },
    {
      id: 'high-tide-cleanser',
      title: 'High Tide Cleanser',
      price: '$15',
      desc: "2-in-1 cleanser formulated with hydrating squalane to cleanse gently without stripping skin's moisture.",
      img: cleanserCutoutImg,
      badge: 'New',
    },
    {
      id: 'daily-spf-defense',
      title: 'Daily Mineral SPF 30',
      price: '$22',
      desc: 'Broad-spectrum daily mineral defense with soothing zinc oxide and botanical antioxidants that blends invisibly.',
      img: sunscreenCutoutImg,
      badge: null,
    },
  ];

  return (
    <div className="hims-landing-page">
      {/* SECTION 1: HERO BANNER (Image 1 reference) */}
      <section className="hims-hero-card">
        {/* ponytail: high-priority LCP image decoding synchronously */}
        <img
          src={himsHeroBgImg}
          alt="Lumière Clinical Formulations"
          className="hims-hero-bg-img"
          fetchPriority="high"
          decoding="sync"
        />
        <div className="hims-hero-gradient-overlay" />

        <div className="hims-hero-content">
          {/* ponytail: clean natural punctuation instead of unrendered pipe delimiter string */}
          <h1 className="hims-hero-headline" style={{ color: '#111111' }}>
            Men's anti aging ingredients proven to reduce wrinkles, dark spots & fine lines
          </h1>

          <p className="hims-hero-sub" style={{ color: '#3d3935' }}>
            If you want to minimize the signs of aging skin, our personalized prescription-strength cream (if prescribed) can help your skin look and feel its best no matter where it’s been — or where it goes next.
          </p>

          <button
            type="button"
            className="hims-btn-black hims-hero-cta"
            onClick={() => onNavigateToProductPage('custom-anti-aging-serum')}
          >
            Get started today
          </button>
        </div>
      </section>

      {/* SECTION 2: CATEGORY TRIO CARDS (Image 0 reference) */}
      <section className="hims-category-section" id="treatments-section">
        <div className="hims-trio-grid">
          {/* Card 1: Editorial Lifestyle Application Card */}
          <div className="hims-model-card">
            <img src={editorialModelImg} alt="Model applying cellular serum" loading="lazy" decoding="async" />
            <div className="hims-model-card-overlay"></div>
            <h2 className="hims-model-title">Anti-Aging</h2>
          </div>

          {/* Card 2: Custom Treatment Card with background-removed cutout */}
          <div className="hims-treatment-card">
            <div className="treatment-card-header">
              <h3 className="treatment-card-title">Custom<br />Anti-Aging Serum</h3>
              <span className="treatment-card-badge">Prescription</span>
            </div>

            <div className="treatment-card-img-wrap" onClick={() => onNavigateToProductPage('custom-anti-aging-serum')} style={{ cursor: 'pointer' }}>
              <img src={serumCutoutImg} alt="Custom Anti-Aging Serum" className="product-cutout-img" loading="lazy" decoding="async" />
            </div>

            <div className="treatment-card-footer">
              <div className="treatment-safety-info" onClick={() => onNavigateToProductPage('custom-anti-aging-serum')}>
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

          {/* Card 3: Goodnight Wrinkle Cream Card with background-removed cutout */}
          <div className="hims-treatment-card">
            <div className="treatment-card-header">
              <h3 className="treatment-card-title">Goodnight<br />Wrinkle Cream</h3>
              <span className="treatment-card-price">$24</span>
            </div>

            <div className="treatment-card-img-wrap" onClick={() => onNavigateToProductPage('goodnight-wrinkle-cream')} style={{ cursor: 'pointer' }}>
              <img src={creamCutoutImg} alt="Goodnight Wrinkle Cream" className="product-cutout-img" loading="lazy" decoding="async" />
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

        {/* Bottom Category Description and Shop All Arrow */}
        <div className="hims-category-subrow">
          <p className="hims-category-subtext">
            Dry skin, crow's feet, forehead wrinkles, fine lines, and sun damage. Whatever it is, we combine dermatologist-recommended ingredients like tretinoin, azelaic acid, and niacinamide to minimize wrinkles & improve skin elasticity.
          </p>
          <button
            type="button"
            className="hims-shop-all-btn"
            onClick={onNavigateToProductPage}
          >
            <span>Shop All</span>
            <div className="circle-arrow-icon">
              <ArrowRight size={20} />
            </div>
          </button>
        </div>
      </section>


      {/* SECTION 3: PRODUCT BASICS SHOWCASE (Image 3 reference) */}
      <section className="hims-basics-section" id="basics-section">
        <div className="hims-section-top-header">
          <div>
            <h2 className="hims-section-title">
              Dermatologist-approved skin care basics
            </h2>
          </div>
          <div className="hims-section-header-right">

            <div className="hims-scroll-arrows">
              <button
                type="button"
                className="hims-arrow-btn"
                onClick={() => scrollBasics('left')}
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="hims-arrow-btn"
                onClick={() => scrollBasics('right')}
                aria-label="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="hims-basics-scroll-wrap">
          <div className="hims-basics-track" ref={basicsTrackRef}>
            {basicsItems.map((item) => (
              <div className="hims-basic-card" key={item.id}>
                <div
                  className="basic-card-img-box"
                  onClick={() => onNavigateToProductPage(item.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.badge && (
                    <span className="basic-card-badge">{item.badge}</span>
                  )}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="basic-product-cutout-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="basic-card-info">
                  <h3 className="basic-card-title">{item.title}</h3>
                  <div className="basic-card-price">{item.price}</div>
                  <p className="basic-card-text">{item.desc}</p>
                  <button
                    type="button"
                    className="hims-btn-outline basic-card-btn"
                    onClick={() => onNavigateToProductPage(item.id)}
                  >
                    Learn more
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: THE SCIENCE BEHIND OUR SKIN CARE (Image 4 reference) */}
      <section className="hims-science-section" id="science-section">
        <h2 className="hims-section-title">
          The science behind our cellular anti-aging skin care
        </h2>

        <div className="hims-science-diagram-card">
          <img src={skinScienceImg} alt="Clinical cross-section diagram of skin dermal layers" loading="lazy" decoding="async" />
        </div>

        <div className="hims-science-grid">
          <div>
            <h3 className="science-item-title">Aging skin appearance</h3>
            <p className="science-item-text">
              As skin ages, it naturally produces less collagen and hyaluronic acid which can lead to the appearance of wrinkles and fine lines on the surface.
            </p>
          </div>

          <div>
            <h3 className="science-item-title">Phyto-peptide effect</h3>
            <p className="science-item-text">
              Bio-fermented peptide complexes trigger the regeneration of healthy new skin cells, while increasing micro-circulation and dermal collagen matrix density.
            </p>
          </div>

          <div>
            <h3 className="science-item-title">Smoother, firmer results</h3>
            <p className="science-item-text">
              The increased collagen production and multi-depth hydration results in skin which has a noticeably smoother texture with visibly reduced fine lines and wrinkles.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: TREATMENT DETAIL SECTION (Image 2 reference) */}
      <section className="hims-product-detail-layout">
        <div className="hims-product-left-canvas">
          <img src={rxCreamCutoutImg} alt="Researched prescription anti-aging treatment cream" className="hims-rx-product-img" loading="lazy" decoding="async" />
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
                  Our prescription ingredients work together to visibly reduce wrinkles, shrink pores, and give skin a more even-looking tone and texture.
                </p>
              </div>
            </div>

            <div className="hims-check-row">
              <div className="hims-check-circle">
                <Check size={14} strokeWidth={3} />
              </div>
              <div>
                <h4 className="hims-check-heading">Fight signs of aging with hydration</h4>
                <p className="hims-check-desc">
                  Anti-aging treatment works best when paired with researched moisturizers like hyaluronic acid and shea butter.
                </p>
              </div>
            </div>

            <div className="hims-check-row">
              <div className="hims-check-circle">
                <Check size={14} strokeWidth={3} />
              </div>
              <div>
                <h4 className="hims-check-heading">Watch skin transform overnight</h4>
                <p className="hims-check-desc">
                  While some of our prescription treatments require weeks to see results, our non-prescription anti-aging treatments hydrate skin while you sleep so skin looks smoother and younger in the morning.
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

      {/* SECTION 6: EXPLORE BY CATEGORY HORIZONTAL SLIDER */}
      <section className="hims-categories-section" id="categories-section">
        <div className="hims-section-top-header">
          <div>
            <h2 className="hims-section-title">
              Shop by category
            </h2>

          </div>
          <div className="hims-scroll-arrows">
            <button
              type="button"
              className="hims-arrow-btn"
              onClick={() => scrollCategories('left')}
              aria-label="Scroll categories left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="hims-arrow-btn"
              onClick={() => scrollCategories('right')}
              aria-label="Scroll categories right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="hims-category-scroll-wrap">
          <div className="hims-category-track" ref={categoryTrackRef}>
            {categories.map((cat) => (
              <div
                key={cat.title}
                className="hims-category-pill-card"
                style={{ backgroundColor: cat.bg }}
                onClick={() => onNavigateToProductPage(cat.id)}
                // ponytail: support keyboard Enter/Space activation for accessibility
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigateToProductPage(cat.id);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <span className="hims-category-pill-title">{cat.title}</span>
                <div className="hims-category-pill-img-wrap">
                  <img src={cat.img} alt={cat.title} className="hims-category-pill-img" loading="lazy" decoding="async" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
