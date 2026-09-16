import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Sparkles, User, Search } from 'lucide-react';

export default function Header({ 
  currentView, 
  setCurrentView, 
  cartItems, 
  setIsCartOpen,
  onNavigateToProductPage,
  onNavigateToCatalog,
  currentUser,
  onOpenAuth,
  onOpenQuiz,
  isQuizCompleted
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleHeaderSearchSubmit = (e) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      if (onNavigateToCatalog) {
        onNavigateToCatalog('All', headerSearch.trim());
      } else {
        setCurrentView('catalog');
      }
    }
  };

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    
    if (sectionId === 'catalog') {
      if (onNavigateToCatalog) {
        onNavigateToCatalog();
      } else {
        setCurrentView('catalog');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (sectionId === 'order-confirmation') {
      setCurrentView('order-confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleAccountClick = () => {
    setIsMobileMenuOpen(false);
    if (currentUser) {
      setCurrentView('account');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (onOpenAuth) {
        onOpenAuth('login');
      } else {
        setCurrentView('account');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleQuizClick = () => {
    setIsMobileMenuOpen(false);
    if (onOpenQuiz) {
      onOpenQuiz();
    }
  };

  return (
    <div className="hims-header-wrapper">
      {/* Main Navigation Header */}
      <header className="hims-header">
        <div className="hims-header-inner">
          {/* Left: Brand Logo & Mobile Toggle */}
          <div className="hims-header-left">
            <button 
              type="button" 
              className="hims-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div 
              className="hims-logo" 
              onClick={() => {
                setCurrentView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              lumière
            </div>
          </div>

          {/* Center: Primary Navigation Links */}
          <nav className="hims-nav-links-center">
            <button 
              type="button" 
              className={`hims-nav-link ${currentView === 'landing' ? 'active' : ''}`}
              onClick={() => handleNavClick('treatments-section')}
            >
              Treatments
            </button>
            <button 
              type="button" 
              className={`hims-nav-link ${currentView === 'catalog' ? 'active' : ''}`}
              onClick={() => handleNavClick('catalog')}
            >
              Products
            </button>
            <button 
              type="button" 
              className="hims-nav-link"
              onClick={handleQuizClick}
            >
              Skin Quiz
            </button>
          </nav>

          {/* Right: High-Intent Action CTAs & Search */}
          <div className="hims-header-right">
            {currentView !== 'catalog' && (
              <form onSubmit={handleHeaderSearchSubmit} className="hims-header-search-form">
                <Search size={15} className="hims-header-search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  className="hims-header-search-input"
                  aria-label="Search products"
                />
                {headerSearch && (
                  <button
                    type="button"
                    className="hims-header-search-clear"
                    onClick={() => setHeaderSearch('')}
                    aria-label="Clear search"
                  >
                    <X size={12} />
                  </button>
                )}
              </form>
            )}

            <button 
              type="button" 
              className={`hims-account-btn ${currentView === 'account' ? 'active' : ''}`}
              onClick={handleAccountClick}
              id="header-account-btn"
              aria-label="View account"
            >
              <User size={15} />
              <span>{currentUser ? currentUser.name : 'Account'}</span>
            </button>

            <button 
              type="button" 
              className="hims-cart-btn" 
              onClick={() => setIsCartOpen(true)}
              id="open-cart-btn"
              aria-label="View shopping bag"
            >
              <ShoppingBag size={16} />
              <span>Bag ({totalCartCount})</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="hims-mobile-nav-menu">
            {currentView !== 'catalog' && (
              <form 
                onSubmit={(e) => {
                  handleHeaderSearchSubmit(e);
                  setIsMobileMenuOpen(false);
                }} 
                className="hims-mobile-search-form"
              >
                <Search size={16} className="hims-header-search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  className="hims-mobile-search-input"
                />
              </form>
            )}
            <button 
              type="button" 
              className="hims-mobile-nav-link"
              onClick={() => handleNavClick('treatments-section')}
            >
              Treatments
            </button>
            <button 
              type="button" 
              className={`hims-mobile-nav-link ${currentView === 'catalog' ? 'active' : ''}`}
              onClick={() => handleNavClick('catalog')}
            >
              Products
            </button>
            <button 
              type="button" 
              className="hims-mobile-nav-link"
              onClick={handleQuizClick}
            >
              Skin Quiz
            </button>
            <button 
              type="button" 
              className={`hims-mobile-nav-link ${currentView === 'account' ? 'active' : ''}`}
              onClick={handleAccountClick}
            >
              <User size={15} style={{ marginRight: 6, verticalAlign: '-2px' }} />
              {currentUser ? currentUser.name : 'Account'}
            </button>
            <button 
              type="button" 
              className="hims-btn-black"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCartOpen(true);
              }}
              style={{ width: '100%', marginTop: 12 }}
            >
              <ShoppingBag size={16} style={{ marginRight: 8, verticalAlign: '-2px' }} />
              View Bag ({totalCartCount})
            </button>
          </div>
        )}
      </header>
    </div>
  );
}
