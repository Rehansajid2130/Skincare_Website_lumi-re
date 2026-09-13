// ponytail: high-conversion luxury DTC navbar with announcement bar and smooth section anchors
import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Sparkles, User } from 'lucide-react';

export default function Header({ 
  currentView, 
  setCurrentView, 
  cartItems, 
  setIsCartOpen,
  onNavigateToProductPage,
  currentUser,
  onOpenAuth,
  onOpenQuiz,
  isQuizCompleted
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    
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

  const handleGetStarted = () => {
    setIsMobileMenuOpen(false);
    if (currentUser) {
      setCurrentView('account');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleNavClick('treatments-section');
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

          {/* Center: Primary Category Navigation Links */}
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
              className="hims-nav-link"
              onClick={() => handleNavClick('basics-section')}
            >
              Daily Basics
            </button>
            <button 
              type="button" 
              className="hims-nav-link"
              onClick={() => handleNavClick('science-section')}
            >
              The Science
            </button>
            <button 
              type="button" 
              className="hims-nav-link"
              onClick={() => handleNavClick('categories-section')}
            >
              Categories
            </button>
            <button 
              type="button" 
              className={`hims-nav-link ${currentView === 'order-confirmation' ? 'active' : ''}`}
              onClick={() => handleNavClick('order-confirmation')}
            >
              Order Status
            </button>
          </nav>

          {/* Right: High-Intent Action CTAs */}
          <div className="hims-header-right">
            <button 
              type="button" 
              className="hims-nav-cta-btn"
              onClick={handleGetStarted}
            >
              {currentUser ? (currentUser.name || 'Member') : 'Get Started'}
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
            <button 
              type="button" 
              className="hims-mobile-nav-link"
              onClick={() => handleNavClick('treatments-section')}
            >
              Clinical Treatments
            </button>
            <button 
              type="button" 
              className="hims-mobile-nav-link"
              onClick={() => handleNavClick('basics-section')}
            >
              Daily Basics
            </button>
            <button 
              type="button" 
              className="hims-mobile-nav-link"
              onClick={() => handleNavClick('science-section')}
            >
              The Science
            </button>
            <button 
              type="button" 
              className="hims-mobile-nav-link"
              onClick={() => handleNavClick('categories-section')}
            >
              Shop by Category
            </button>
            <button 
              type="button" 
              className="hims-mobile-nav-link"
              onClick={() => handleNavClick('order-confirmation')}
            >
              Order Status & Confirmation
            </button>
            <button 
              type="button" 
              className="hims-btn-black"
              onClick={handleGetStarted}
              style={{ width: '100%', marginTop: 12 }}
            >
              {currentUser ? (currentUser.name || 'Member') : 'Get Started'}
            </button>
          </div>
        )}
      </header>
    </div>
  );
}
