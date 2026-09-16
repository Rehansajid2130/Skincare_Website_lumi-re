// ponytail: luxury DTC collection & all-products catalog page inspired by reference image with Lumière aesthetic
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  ShoppingBag,
  Check,
  ArrowLeft,
  Filter,
  X,
  Sparkles,
  Grid,
  LayoutGrid,
  ShieldCheck,
  CheckSquare,
  Square,
  RefreshCw
} from 'lucide-react';
import { PRODUCTS } from '../data/products';

import serumCutoutImg from '../assets/serum_cutout.png';
import creamCutoutImg from '../assets/cream_cutout.png';
import vitamincCutoutImg from '../assets/vitaminc_cutout.png';
import moisturizerCutoutImg from '../assets/moisturizer_cutout.png';
import cleanserCutoutImg from '../assets/cleanser_cutout.png';
import sunscreenCutoutImg from '../assets/sunscreen_cutout.png';
import rxCreamCutoutImg from '../assets/rx_cream_cutout.png';

export default function CatalogPage({
  products = PRODUCTS,
  initialCategory = 'All',
  initialSearch = '',
  onNavigateToProduct,
  onAddToCart,
  onNavigateToLanding
}) {
  // Category cards definition matching Landing Page design
  const topCategories = [
    { id: 'All', title: 'All Products', bg: '#F6F2EB', img: serumCutoutImg },
    { id: 'Serums', title: 'Serums', bg: '#F5EBE1', img: serumCutoutImg },
    { id: 'Cleansers', title: 'Cleansers', bg: '#E4EBE5', img: cleanserCutoutImg },
    { id: 'Creams', title: 'Wrinkle Creams', bg: '#F2EAE4', img: creamCutoutImg },
    { id: 'Vitamin C', title: 'Vitamin C', bg: '#FAF0DE', img: vitamincCutoutImg },
    { id: 'Moisturizers', title: 'Moisturizers', bg: '#E6ECEE', img: moisturizerCutoutImg },
    { id: 'Sun Care', title: 'Sun Care', bg: '#EDE8E3', img: sunscreenCutoutImg },
    { id: 'Rx Treatments', title: 'Rx Treatments', bg: '#E9E3DC', img: rxCreamCutoutImg }
  ];

  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      if (initialCategory !== 'All') {
        setSelectedCategories([initialCategory]);
      } else {
        setSelectedCategories([]);
      }
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance' | 'price-asc' | 'price-desc' | 'rating'
  const [viewCols, setViewCols] = useState(3); // 3 cols or 2 cols
  const [quickAddedId, setQuickAddedId] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sidebar filter states
  const [filterInStock, setFilterInStock] = useState(true);
  const [filterOutOfStock, setFilterOutOfStock] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [selectedActives, setSelectedActives] = useState([]);

  // Accordion open/close states in sidebar
  const [accordionOpen, setAccordionOpen] = useState({
    availability: true,
    category: true,
    price: true,
    concern: true,
    actives: false
  });

  const categoryScrollRef = useRef(null);

  const scrollCategories = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleAccordion = (section) => {
    setAccordionOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'All') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([catId]);
    }
  };

  const toggleCategoryFilter = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const togglePriceFilter = (rangeId) => {
    setSelectedPriceRanges(prev =>
      prev.includes(rangeId) ? prev.filter(r => r !== rangeId) : [...prev, rangeId]
    );
  };

  const toggleConcernFilter = (concern) => {
    setSelectedConcerns(prev =>
      prev.includes(concern) ? prev.filter(c => c !== concern) : [...prev, concern]
    );
  };

  const toggleActiveFilter = (active) => {
    setSelectedActives(prev =>
      prev.includes(active) ? prev.filter(a => a !== active) : [...prev, active]
    );
  };

  const handleClearAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setFilterInStock(true);
    setFilterOutOfStock(false);
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSelectedConcerns([]);
    setSelectedActives([]);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      // Top category or sidebar category check
      const effectiveCats = selectedCategories.length > 0
        ? selectedCategories
        : (selectedCategory !== 'All' ? [selectedCategory] : []);

      if (effectiveCats.length > 0) {
        const prodCat = prod.category?.toLowerCase() || '';
        const match = effectiveCats.some(c => prodCat.includes(c.toLowerCase()) || (c === 'Rx Treatments' && prod.badge?.includes('Prescription')));
        if (!match) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = prod.title?.toLowerCase().includes(q);
        const inSubtitle = prod.subtitle?.toLowerCase().includes(q);
        const inCategory = prod.category?.toLowerCase().includes(q);
        const inFormula = prod.activeFormula?.toLowerCase().includes(q);
        if (!inTitle && !inSubtitle && !inCategory && !inFormula) return false;
      }

      // Availability
      if (filterInStock && !filterOutOfStock && prod.inStock === false) return false;
      if (!filterInStock && filterOutOfStock && prod.inStock !== false) return false;

      // Price filter
      if (selectedPriceRanges.length > 0) {
        const price = prod.basePrice || 0;
        const matchesPrice = selectedPriceRanges.some(r => {
          if (r === 'under20') return price < 20;
          if (r === '20to35') return price >= 20 && price <= 35;
          if (r === '35to50') return price > 35 && price <= 50;
          if (r === 'over50') return price > 50;
          return true;
        });
        if (!matchesPrice) return false;
      }

      // Concern filter
      if (selectedConcerns.length > 0) {
        const desc = (prod.description + ' ' + prod.subtitle + ' ' + (prod.highlights || []).join(' ')).toLowerCase();
        const matchesConcern = selectedConcerns.some(c => {
          if (c === 'wrinkles') return desc.includes('wrinkle') || desc.includes('line') || desc.includes('aging');
          if (c === 'hydration') return desc.includes('hydrat') || desc.includes('moisture') || desc.includes('barrier');
          if (c === 'firmness') return desc.includes('firm') || desc.includes('elasticity') || desc.includes('collagen');
          if (c === 'brightening') return desc.includes('bright') || desc.includes('antioxidant') || desc.includes('vitamin c') || desc.includes('spot');
          if (c === 'clarifying') return desc.includes('clean') || desc.includes('pore') || desc.includes('squalane');
          return true;
        });
        if (!matchesConcern) return false;
      }

      // Active compound filter
      if (selectedActives.length > 0) {
        const formula = (prod.activeFormula || '').toLowerCase();
        const matchesActive = selectedActives.some(a => formula.includes(a.toLowerCase()));
        if (!matchesActive) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return (a.basePrice || 0) - (b.basePrice || 0);
      if (sortBy === 'price-desc') return (b.basePrice || 0) - (a.basePrice || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // 'relevance'
    });
  }, [
    products,
    selectedCategory,
    selectedCategories,
    searchQuery,
    filterInStock,
    filterOutOfStock,
    selectedPriceRanges,
    selectedConcerns,
    selectedActives,
    sortBy
  ]);

  const handleQuickAdd = (e, prod, isSub = false) => {
    e.stopPropagation();
    if (onAddToCart) {
      const finalPrice = isSub ? Math.round(prod.basePrice * 0.85 * 100) / 100 : prod.basePrice;
      onAddToCart({
        id: `${prod.id}-standard-${isSub ? 'sub' : 'one'}`,
        productId: prod.id,
        title: prod.title,
        size: prod.variants?.[0]?.label || 'Standard',
        isSubscription: isSub,
        price: finalPrice,
        originalPrice: prod.basePrice,
        frequency: isSub ? 'Every 30 Days' : null,
        image: prod.cutoutImage || prod.image,
        qty: 1
      });
    }
    setQuickAddedId(`${prod.id}-${isSub ? 'sub' : 'one'}`);
    setTimeout(() => setQuickAddedId(null), 1800);
  };

  // Build active filter chips list
  const activeChips = [];
  if (filterInStock && !filterOutOfStock) {
    activeChips.push({ label: 'In Stock', onRemove: () => setFilterInStock(false) });
  }
  selectedCategories.forEach(cat => {
    activeChips.push({ label: cat, onRemove: () => toggleCategoryFilter(cat) });
  });
  if (selectedCategory !== 'All' && selectedCategories.length === 0) {
    activeChips.push({ label: selectedCategory, onRemove: () => setSelectedCategory('All') });
  }
  selectedPriceRanges.forEach(p => {
    const map = { under20: 'Under $20', '20to35': '$20 - $35', '35to50': '$35 - $50', over50: '$50+' };
    activeChips.push({ label: map[p] || p, onRemove: () => togglePriceFilter(p) });
  });
  selectedConcerns.forEach(c => {
    const map = { wrinkles: 'Wrinkles & Aging', hydration: 'Barrier Hydration', firmness: 'Firmness & Collagen', brightening: 'Brightening & Spots', clarifying: 'Pore Clarifying' };
    activeChips.push({ label: map[c] || c, onRemove: () => toggleConcernFilter(c) });
  });
  if (searchQuery.trim()) {
    activeChips.push({ label: `"${searchQuery}"`, onRemove: () => setSearchQuery('') });
  }

  return (
    <div className="lumiere-collection-page animate-fade-in">
      {/* Top Breadcrumb */}
      <div className="collection-breadcrumbs">
        <button type="button" className="breadcrumb-link" onClick={onNavigateToLanding}>Home</button>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Collection</span>
      </div>

      {/* Main Collection Heading */}
      <div className="collection-header-row">
        <div>
          <h1 className="collection-main-title">All Product</h1>
    
        </div>

        <div className="collection-search-bar">
          <Search size={16} className="collection-search-icon" />
          <input
            type="text"
            className="collection-search-input"
            placeholder="Search product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="collection-search-clear"
              onClick={() => setSearchQuery('')}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* TOP CATEGORIES ROW (Matching Landing Page Style as requested) */}
      <div className="collection-categories-track-wrap">
        <div className="track-arrow-overlay left">
          <button
            type="button"
            className="track-arrow-btn"
            onClick={() => scrollCategories('left')}
            aria-label="Scroll categories left"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        <div className="collection-categories-track" ref={categoryScrollRef}>
          {topCategories.map(cat => {
            const isActive = selectedCategory === cat.id || selectedCategories.includes(cat.id);
            return (
              <div
                key={cat.id}
                className={`collection-cat-card ${isActive ? 'active' : ''}`}
                style={{ backgroundColor: cat.bg }}
                onClick={() => handleCategorySelect(cat.id)}
                role="button"
                tabIndex={0}
              >
                <span className="collection-cat-title">{cat.title}</span>
                <div className="collection-cat-img-box">
                  <img src={cat.img} alt={cat.title} className="collection-cat-img" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="track-arrow-overlay right">
          <button
            type="button"
            className="track-arrow-btn"
            onClick={() => scrollCategories('right')}
            aria-label="Scroll categories right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* RESULTS SUMMARY, ACTIVE CHIPS, & SORT CONTROLS */}
      <div className="collection-filter-bar">
        <div className="filter-bar-left">
          <span className="results-count-text">
            <strong>{filteredProducts.length}</strong> of {products.length} results
          </span>

          {/* Active Chips Strip */}
          <div className="active-chips-strip">
            {activeChips.map((chip, idx) => (
              <span key={idx} className="active-filter-chip">
                {chip.label}
                <button type="button" onClick={chip.onRemove} aria-label={`Remove ${chip.label}`}>
                  <X size={12} />
                </button>
              </span>
            ))}
            {activeChips.length > 0 && (
              <button
                type="button"
                className="clear-all-chips-btn"
                onClick={handleClearAllFilters}
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="filter-bar-right">
          <button
            type="button"
            className="mobile-filter-drawer-toggle"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            aria-label="Toggle Filters"
          >
            <Filter size={15} />
            <span>Filters{activeChips.length > 0 ? ` (${activeChips.length})` : ''}</span>
          </button>

          <div className="sort-dropdown-wrap">
            <span className="sort-by-label">Sort By:</span>
            <select
              className="collection-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>

          <div className="view-toggle-btns">
            <button
              type="button"
              className={`view-toggle-btn ${viewCols === 3 ? 'active' : ''}`}
              onClick={() => setViewCols(3)}
              aria-label="3 Column Grid"
            >
              <LayoutGrid size={17} />
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewCols === 2 ? 'active' : ''}`}
              onClick={() => setViewCols(2)}
              aria-label="2 Column Grid"
            >
              <Grid size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT: SIDEBAR FILTERS (LEFT) + PRODUCTS GRID (RIGHT) */}
      <div className="collection-main-layout">
        {/* Mobile Filter Backdrop */}
        {isMobileFilterOpen && (
          <div
            className="mobile-sidebar-backdrop"
            onClick={() => setIsMobileFilterOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* LEFT SIDEBAR FILTERS */}
        <aside className={`collection-sidebar ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
          {/* Mobile Drawer Header */}
          <div className="mobile-sidebar-header">
            <div className="mobile-sidebar-header-left">
              <span className="mobile-sidebar-title">Filters</span>
              {activeChips.length > 0 && (
                <span className="mobile-filter-count-pill">{activeChips.length} active</span>
              )}
            </div>
            <button
              type="button"
              className="mobile-sidebar-close"
              onClick={() => setIsMobileFilterOpen(false)}
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          </div>
          {/* SECTION: AVAILABILITY */}
          <div className="sidebar-filter-section">
            <button
              type="button"
              className="sidebar-section-toggle"
              onClick={() => toggleAccordion('availability')}
            >
              <span className="section-heading-text">Availability</span>
              {accordionOpen.availability ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {accordionOpen.availability && (
              <div className="sidebar-options-list">
                <label className="sidebar-checkbox-row">
                  <input
                    type="checkbox"
                    checked={filterInStock}
                    onChange={(e) => setFilterInStock(e.target.checked)}
                  />
                  <span className="checkbox-custom" />
                  <span className="checkbox-label-text">In Stock</span>
                  <span className="checkbox-count-badge">({products.filter(p => p.inStock !== false).length})</span>
                </label>

                <label className="sidebar-checkbox-row">
                  <input
                    type="checkbox"
                    checked={filterOutOfStock}
                    onChange={(e) => setFilterOutOfStock(e.target.checked)}
                  />
                  <span className="checkbox-custom" />
                  <span className="checkbox-label-text">Out of Stock</span>
                  <span className="checkbox-count-badge">(0)</span>
                </label>
              </div>
            )}
          </div>

          {/* SECTION: PRODUCT TYPE / CATEGORY */}
          <div className="sidebar-filter-section">
            <button
              type="button"
              className="sidebar-section-toggle"
              onClick={() => toggleAccordion('category')}
            >
              <span className="section-heading-text">Product type</span>
              {accordionOpen.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {accordionOpen.category && (
              <div className="sidebar-options-list">
                {[
                  { id: 'Serums', label: 'Facial Serums', count: products.filter(p => (p.category || '').toLowerCase().includes('serum')).length },
                  { id: 'Creams', label: 'Restorative Creams', count: products.filter(p => (p.category || '').toLowerCase().includes('cream')).length },
                  { id: 'Cleansers', label: 'Clarifying Cleansers', count: products.filter(p => (p.category || '').toLowerCase().includes('clean')).length },
                  { id: 'Moisturizers', label: 'Hydrating Moisturizers', count: products.filter(p => (p.category || '').toLowerCase().includes('moistur')).length },
                  { id: 'Sun Care', label: 'Daily Sun Protection', count: products.filter(p => (p.category || '').toLowerCase().includes('sun')).length },
                  { id: 'Rx Treatments', label: 'Prescription Formulations', count: products.filter(p => p.badge?.includes('Prescription') || (p.category || '').toLowerCase().includes('skincare')).length }
                ].map(catItem => {
                  const isChecked = selectedCategories.includes(catItem.id);
                  return (
                    <label key={catItem.id} className="sidebar-checkbox-row">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCategoryFilter(catItem.id)}
                      />
                      <span className="checkbox-custom" />
                      <span className="checkbox-label-text">{catItem.label}</span>
                      <span className="checkbox-count-badge">({catItem.count})</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION: PRICE RANGE */}
          <div className="sidebar-filter-section">
            <button
              type="button"
              className="sidebar-section-toggle"
              onClick={() => toggleAccordion('price')}
            >
              <span className="section-heading-text">Price range</span>
              {accordionOpen.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {accordionOpen.price && (
              <div className="sidebar-options-list">
                {[
                  { id: 'under20', label: 'Under $20', count: products.filter(p => (p.basePrice || 0) < 20).length },
                  { id: '20to35', label: '$20 – $35', count: products.filter(p => (p.basePrice || 0) >= 20 && (p.basePrice || 0) <= 35).length },
                  { id: '35to50', label: '$35 – $50', count: products.filter(p => (p.basePrice || 0) > 35 && (p.basePrice || 0) <= 50).length },
                  { id: 'over50', label: 'Over $50', count: products.filter(p => (p.basePrice || 0) > 50).length }
                ].map(pItem => {
                  const isChecked = selectedPriceRanges.includes(pItem.id);
                  return (
                    <label key={pItem.id} className="sidebar-checkbox-row">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePriceFilter(pItem.id)}
                      />
                      <span className="checkbox-custom" />
                      <span className="checkbox-label-text">{pItem.label}</span>
                      <span className="checkbox-count-badge">({pItem.count})</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION: SKIN CONCERN */}
          <div className="sidebar-filter-section">
            <button
              type="button"
              className="sidebar-section-toggle"
              onClick={() => toggleAccordion('concern')}
            >
              <span className="section-heading-text">Skin concern</span>
              {accordionOpen.concern ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {accordionOpen.concern && (
              <div className="sidebar-options-list">
                {[
                  { id: 'wrinkles', label: 'Fine Lines & Wrinkles' },
                  { id: 'hydration', label: 'Moisture Barrier Depletion' },
                  { id: 'firmness', label: 'Loss of Dermal Firmness' },
                  { id: 'brightening', label: 'Dark Spots & Hyperpigmentation' },
                  { id: 'clarifying', label: 'Pore Congestion & Texture' }
                ].map(concernItem => {
                  const isChecked = selectedConcerns.includes(concernItem.id);
                  return (
                    <label key={concernItem.id} className="sidebar-checkbox-row">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleConcernFilter(concernItem.id)}
                      />
                      <span className="checkbox-custom" />
                      <span className="checkbox-label-text">{concernItem.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION: KEY CLINICAL ACTIVES */}
          <div className="sidebar-filter-section">
            <button
              type="button"
              className="sidebar-section-toggle"
              onClick={() => toggleAccordion('actives')}
            >
              <span className="section-heading-text">Clinical bio-actives</span>
              {accordionOpen.actives ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {accordionOpen.actives && (
              <div className="sidebar-options-list">
                {[
                  { id: 'Phyto-Peptides', label: 'Phyto-Peptide Bio-Ferment' },
                  { id: 'Niacinamide', label: 'Clinical Niacinamide (4-5%)' },
                  { id: 'Tretinoin', label: 'Prescription Retinoids (Tretinoin)' },
                  { id: 'Squalane', label: 'Bio-Identical Squalane' },
                  { id: 'Shea Butter', label: 'Micro-Ceramides & Shea' }
                ].map(activeItem => {
                  const isChecked = selectedActives.includes(activeItem.id);
                  return (
                    <label key={activeItem.id} className="sidebar-checkbox-row">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleActiveFilter(activeItem.id)}
                      />
                      <span className="checkbox-custom" />
                      <span className="checkbox-label-text">{activeItem.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mobile Bottom Done Bar */}
          <div className="mobile-sidebar-footer">
            {activeChips.length > 0 && (
              <button
                type="button"
                className="mobile-clear-btn"
                onClick={handleClearAllFilters}
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              className="mobile-apply-btn"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </aside>

        {/* RIGHT PRODUCTS GRID */}
        <div className="collection-grid-container">
          {filteredProducts.length === 0 ? (
            <div className="collection-no-results">
              <Sparkles size={36} />
              <h3 className="no-results-title">No matching formulations found</h3>
              <p className="no-results-sub">Try expanding your price range or clearing active filters to see all clinical treatments.</p>
              <button
                type="button"
                className="hims-btn-black"
                onClick={handleClearAllFilters}
                style={{ marginTop: 12 }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={`collection-products-grid cols-${viewCols}`}>
              {filteredProducts.map(prod => (
                <div
                  key={prod.id}
                  className="collection-product-card"
                  onClick={() => onNavigateToProduct && onNavigateToProduct(prod.id)}
                >
                  {/* Card Visual / Image Canvas matching reference card styling */}
                  <div className="collection-card-canvas">
                    {/* Top Pill Category Tag (matching reference top-left pill) */}
                    <span className="collection-card-tag">
                      {prod.badge || prod.category || 'Clinical Treatment'}
                    </span>

                    <div className="collection-card-img-wrap">
                      <img
                        src={prod.cutoutImage || prod.image}
                        alt={prod.title}
                        className="collection-card-img"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>

                  {/* Card Meta & Actions */}
                  <div className="collection-card-details">
                    <div className="card-rating-row">
                      <div className="card-stars">
                        <Star size={12} fill="#12100E" stroke="none" />
                        <span className="card-rating-score">{prod.rating || 4.9}</span>
                        <span className="card-review-count">({prod.reviewCount || 420})</span>
                      </div>
                      <span className="card-category-indicator">{prod.category}</span>
                    </div>

                    <h3 className="collection-card-title">{prod.title}</h3>
                    <p className="collection-card-subtitle">{prod.subtitle}</p>

                    {prod.activeFormula && (
                      <div className="collection-formula-snippet">
                        {prod.activeFormula.split('•')[0]?.trim()}
                      </div>
                    )}

                    <div className="collection-card-bottom">
                      <div className="card-pricing-block">
                        <span className="card-retail-price">${prod.basePrice}</span>
                        <button
                          type="button"
                          className={`card-sub-pill-btn ${quickAddedId === `${prod.id}-sub` ? 'added' : ''}`}
                          onClick={(e) => handleQuickAdd(e, prod, true)}
                          title="Click to subscribe with 15% auto-ship discount"
                        >
                          <RefreshCw size={11} />
                          <span>${(prod.basePrice * 0.85).toFixed(2)} with refill</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        className={`collection-quick-add-btn ${quickAddedId === `${prod.id}-one` ? 'added' : ''}`}
                        onClick={(e) => handleQuickAdd(e, prod, false)}
                        aria-label={`Add ${prod.title} to bag`}
                      >
                        {quickAddedId === prod.id ? (
                          <>
                            <Check size={14} />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
