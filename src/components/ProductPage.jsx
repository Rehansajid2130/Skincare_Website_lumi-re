// ponytail: component-based dynamic DTC product detail page with clean Buy Box and lower details section
import React, { useState, useEffect } from 'react';
import { Star, Check, Zap, ShieldCheck, Sparkles, Truck, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { PRODUCTS, REVIEWS } from '../data/products';

export default function ProductPage({ product: propProduct, onAddToCart, onNavigateToProduct, onNavigateToLanding }) {
  // Safe fallback to first product if none provided
  const product = propProduct || PRODUCTS[0];

  // ponytail: safe fallback for products without pre-configured variants to prevent runtime crashes
  const variants = (product.variants && product.variants.length > 0)
    ? product.variants
    : [{ size: 'standard', label: 'Standard Size', price: product.basePrice || 48, savings: null }];

  const [selectedSize, setSelectedSize] = useState(variants[0]?.size || 'standard');
  const [isSubscription, setIsSubscription] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('about'); // 'about' | 'usage' | 'clinical'

  useEffect(() => {
    if (variants.length > 0) {
      setSelectedSize(variants[0].size);
    }
  }, [product.id]);

  const selectedVariant = variants.find(v => v.size === selectedSize) || variants[0];
  const rawPrice = selectedVariant?.price || product.basePrice || 48;
  const finalPrice = isSubscription ? Math.round(rawPrice * 0.85 * 100) / 100 : rawPrice;

  // ponytail: instantaneous add-to-bag without artificial 150ms setTimeout lag
  const handleAdd = () => {
    onAddToCart({
      id: `${product.id}-${selectedSize}-${isSubscription ? 'sub' : 'one'}`,
      productId: product.id,
      title: product.title,
      size: selectedSize,
      isSubscription,
      price: finalPrice,
      image: product.cutoutImage || product.image,
      qty: 1
    });
  };

  const otherProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div className="hims-product-page-view">
      {/* Breadcrumb navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#8c867e', marginBottom: 20 }}>
        <span
          style={{ cursor: 'pointer', color: '#1c1917', fontWeight: 600 }}
          onClick={onNavigateToLanding}
        >
          Home
        </span>
        <span>/</span>
        <span
          style={{ cursor: 'pointer', color: '#1c1917', fontWeight: 600 }}
          onClick={onNavigateToLanding}
        >
          Treatments
        </span>
        <span>/</span>
        <span>{product.title}</span>
      </div>

      {/* TOP HERO ROW: Left Image Canvas + Right Clean Buy Box (Title, Rating, Supply, Add to Bag) */}
      <div className="hims-product-detail-layout" style={{ marginTop: 0 }}>
        {/* Left Column: Studio Canvas with Background-Removed Cutout & Active Formula */}
        <div className="hims-product-left-canvas">
          {product.badge && (
            <div style={{ position: 'absolute', top: 24, left: 24 }}>
              <span className="treatment-card-badge">{product.badge}</span>
            </div>
          )}

          <img
            src={product.cutoutImage || product.image}
            alt={product.title}
            className="hims-rx-product-img"
            id="main-product-image"
          />

          {product.activeFormula && (
            <div className="product-active-formula-pill">
              <strong>ACTIVE FORMULA:</strong> {product.activeFormula}
            </div>
          )}
        </div>

        {/* Right Column: Clean Buy Box (Only Name, Rating, Select Supply & Add to Bag) */}
        <div className="hims-product-right-info">
          <div>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9A7B62', fontWeight: 800 }}>
              LABORATOIRES LUMIÈRE PARIS
            </span>
            <h1 className="hims-product-headline">
              {product.title}
            </h1>
            <p className="hims-product-subtitle">
              {product.subtitle}
            </p>
          </div>

          {/* Size Variant Selectors */}
          {variants && variants.length > 0 && (
            <div>
              <div className="hims-pills-row">
                {variants.map((v) => (
                  <button
                    key={v.size}
                    type="button"
                    className={`hims-pill-select-btn ${selectedSize === v.size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(v.size)}
                    id={`variant-${v.size}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.88rem' }}>
                      <span>{v.label}</span>
                      <span>${v.price}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: v.savings ? '#065f46' : '#8c867e', marginTop: 3, fontWeight: v.savings ? 700 : 400 }}>
                      {v.savings || 'Daily Active Routine'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subscribe & Save Switch (15% Off) */}
          <div
            className="hims-subscribe-box"
            onClick={() => setIsSubscription(!isSubscription)}
            id="subscribe-save-toggle"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: '2px solid #1c1917',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isSubscription ? '#1c1917' : '#ffffff'
              }}>
                {isSubscription && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffffff' }}></div>}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Subscribe & Save</span>
                  <span style={{ background: '#065f46', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 7px', borderRadius: 9999 }}>
                    15% OFF
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#645f59', marginTop: 2 }}>
                  Auto-ships every 60 days • Free 2-Day Air • Pause or cancel anytime
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.08rem', fontWeight: 800, color: '#1c1917' }}>
                ${finalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Primary CTA Button */}
          <div className="hims-cta-block">
            <button
              type="button"
              className="hims-cta-main-btn"
              onClick={handleAdd}
              id="add-to-cart-btn"
            >
              <Zap size={18} fill="#ffffff" />
              Add to Bag — ${finalPrice.toFixed(2)}
            </button>
          </div>

          {/* Guarantees */}
          <div className="hims-product-guarantees-grid">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', fontWeight: 600, color: '#645f59' }}>
              <Truck size={16} color="#8c6d53" />
              <span>Free 2-Day Air</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', fontWeight: 600, color: '#645f59' }}>
              <ShieldCheck size={16} color="#8c6d53" />
              <span>30-Day Guarantee</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', fontWeight: 600, color: '#645f59' }}>
              <Sparkles size={16} color="#8c6d53" />
              <span>100% Vegan</span>
            </div>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: PRODUCT DETAILS, CLINICAL BENEFITS & USAGE (Below Image & Buy Box) */}
      <div className="hims-product-details-lower">
        {/* 3 Clinical Benefits Cards Row */}
        {product.benefitsChecklist && product.benefitsChecklist.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 20 }}>
              Key Clinical Benefits
            </h3>
            <div className="hims-product-benefits-grid">
              {product.benefitsChecklist.map((benefit, idx) => (
                <div className="hims-benefit-box" key={idx}>
                  <div className="hims-check-circle">
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="hims-check-heading">{benefit.heading}</h4>
                    <p className="hims-check-desc">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clinical Trial Metrics (if available) */}
        {product.clinical && product.clinical.length > 0 && (
          <div className="hims-clinical-stats-row">
            {product.clinical.map((stat, idx) => (
              <div className="hims-clinical-stat-card" key={idx}>
                <span className="hims-stat-percent">{stat.percent}</span>
                <p className="hims-stat-label">{stat.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Formulation Details & Usage Accordion */}
        <div style={{ background: '#ffffff', border: '1px solid #e6dfd4', borderRadius: 16, padding: '8px 24px' }}>
          {/* Tab 1: About & Clinical Description */}
          <div style={{ borderBottom: '1px solid #e6dfd4', padding: '16px 0' }}>
            <button
              type="button"
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 600, fontSize: '0.92rem', color: '#1c1917' }}
              onClick={() => setOpenAccordion(openAccordion === 'about' ? '' : 'about')}
            >
              <span>About this formulation</span>
              {openAccordion === 'about' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openAccordion === 'about' && (
              <div style={{ marginTop: 12, fontSize: '0.86rem', color: '#645f59', lineHeight: 1.6 }}>
                {product.description}
              </div>
            )}
          </div>

          {/* Tab 2: How to Use */}
          <div style={{ borderBottom: product.highlights ? '1px solid #e6dfd4' : 'none', padding: '16px 0' }}>
            <button
              type="button"
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 600, fontSize: '0.92rem', color: '#1c1917' }}
              onClick={() => setOpenAccordion(openAccordion === 'usage' ? '' : 'usage')}
            >
              <span>How to use</span>
              {openAccordion === 'usage' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openAccordion === 'usage' && (
              <div style={{ marginTop: 12, fontSize: '0.86rem', color: '#645f59', lineHeight: 1.6 }}>
                {product.howToUse}
              </div>
            )}
          </div>

          {/* Tab 3: Clinical Highlights */}
          {product.highlights && (
            <div style={{ padding: '16px 0' }}>
              <button
                type="button"
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 600, fontSize: '0.92rem', color: '#1c1917' }}
                onClick={() => setOpenAccordion(openAccordion === 'clinical' ? '' : 'clinical')}
              >
                <span>Key active highlights</span>
                {openAccordion === 'clinical' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openAccordion === 'clinical' && (
                <ul style={{ marginTop: 12, paddingLeft: 20, fontSize: '0.86rem', color: '#645f59', lineHeight: 1.7 }}>
                  {product.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Routine Synergy: Recommended Pairings */}
      {otherProducts.length > 0 && (
        <section style={{ marginTop: 56, borderTop: '1px solid #e6dfd4', paddingTop: 40 }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
              Frequently paired together
            </h3>
            <p style={{ color: '#645f59', fontSize: '0.88rem', marginTop: 4 }}>
              Complete your daily routine with matching clinical treatments.
            </p>
          </div>

          <div className="hims-product-pairings-grid">
            {otherProducts.map((other) => (
              <div
                key={other.id}
                className="hims-basic-card"
                onClick={() => onNavigateToProduct && onNavigateToProduct(other.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="basic-card-img-box" style={{ height: 240 }}>
                  {other.badge && <span className="basic-card-badge">{other.badge}</span>}
                  <img 
                    src={other.cutoutImage || other.image} 
                    alt={other.title} 
                    className="basic-product-cutout-img" 
                    loading="lazy" 
                    decoding="async" 
                  />
                </div>
                <div className="basic-card-info">
                  <h4 className="basic-card-title" style={{ fontSize: '1.15rem' }}>{other.title}</h4>
                  <div className="basic-card-price" style={{ fontSize: '0.88rem' }}>${other.basePrice}</div>
                  <p className="basic-card-text" style={{ minHeight: '3.4em', fontSize: '0.84rem' }}>
                    {other.subtitle}
                  </p>
                  <button
                    type="button"
                    className="hims-btn-outline basic-card-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToProduct && onNavigateToProduct(other.id);
                    }}
                  >
                    View details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      <section style={{ marginTop: 56, borderTop: '1px solid #e6dfd4', paddingTop: 40 }}>
        <div className="hims-reviews-header">
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Patient & Customer Reviews</h3>
            <p style={{ color: '#645f59', fontSize: '0.84rem', marginTop: 2 }}>Real results from verified community members.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>★ {product.rating}</span>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#f59e0b" stroke="#f59e0b" />
              ))}
            </div>
            <span style={{ color: '#645f59', fontSize: '0.8rem' }}>({product.reviewCount || 1200} reviews)</span>
          </div>
        </div>

        <div className="hims-product-reviews-grid">
          {REVIEWS.map((r) => (
            <div key={r.id} style={{ background: '#f1ede6', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.84rem' }}>{r.author}</span>
                <span style={{ background: '#ecfdf5', color: '#065f46', fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: 9999 }}>
                  ✓ Verified
                </span>
              </div>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} size={13} fill="#f59e0b" stroke="#f59e0b" />
                ))}
              </div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>"{r.title}"</h4>
              <p style={{ fontSize: '0.82rem', color: '#645f59', lineHeight: 1.55 }}>{r.content}</p>
              <div style={{ fontSize: '0.72rem', color: '#8c867e', marginTop: 'auto' }}>
                {r.helpful} found this helpful • {r.date}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
