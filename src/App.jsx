// ponytail: root application component with React.lazy code splitting for maximum initial page load speed
import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import ProductPage from './components/ProductPage';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import { PRODUCTS } from './data/products';

// ponytail: lazy-load non-critical subportals, quiz, and modals so landing page bundle stays featherweight
const SkinQuiz = lazy(() => import('./components/SkinQuiz'));
const AccountPortal = lazy(() => import('./components/AccountPortal'));
const AdminPortal = lazy(() => import('./components/AdminPortal'));
const AuthDrawer = lazy(() => import('./components/AuthDrawer'));
const InstantCheckoutModal = lazy(() => import('./components/InstantCheckoutModal'));
const OrderConfirmation = lazy(() => import('./components/OrderConfirmation'));

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'product' | 'order-confirmation' | 'account' | 'admin'
  const [selectedProductId, setSelectedProductId] = useState('custom-anti-aging-serum');
  const [cartItems, setCartItems] = useState([]);
  const [lastOrderData, setLastOrderData] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutMethod, setCheckoutMethod] = useState('standard');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login');
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(() => {
    try {
      return localStorage.getItem('lumiere_quiz_completed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const handleQuizComplete = useCallback(() => {
    setIsQuizCompleted(true);
  }, []);

  // Dynamic products catalog synced with localStorage
  const [productsList, setProductsList] = useState(() => {
    try {
      const saved = localStorage.getItem('lumiere_products_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(p => ({
            ...p,
            category: p.category || (PRODUCTS.find(dp => dp.id === p.id)?.category) || 'Skincare'
          }));
        }
      }
    } catch (e) {}
    return PRODUCTS;
  });

  const saveProductsList = (newCatalog) => {
    setProductsList(newCatalog);
    try {
      localStorage.setItem('lumiere_products_catalog', JSON.stringify(newCatalog));
    } catch (e) {}
  };

  const handleAddProduct = (newProduct) => {
    const updated = [newProduct, ...productsList];
    saveProductsList(updated);
  };

  const handleUpdateProduct = (updatedProduct) => {
    const updated = productsList.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    saveProductsList(updated);
  };

  const handleDeleteProduct = (productId) => {
    const updated = productsList.filter(p => p.id !== productId);
    saveProductsList(updated);
  };

  const currentProduct = productsList.find(p => p.id === selectedProductId) || productsList[0];

  // Sync to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lumiere_modern_cart');
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }

    const savedUser = localStorage.getItem('lumiere_auth_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('lumiere_modern_cart', JSON.stringify(items));
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('lumiere_auth_user', JSON.stringify(user));
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lumiere_auth_user');
  };

  const handleAddToCart = (newItem) => {
    const existingIndex = cartItems.findIndex(i => i.id === newItem.id);
    let updated;
    if (existingIndex > -1) {
      updated = [...cartItems];
      updated[existingIndex].qty += newItem.qty;
    } else {
      updated = [...cartItems, newItem];
    }
    saveCart(updated);
    setIsCartOpen(true);
  };

  const handleUpdateQty = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    const updated = cartItems.map(item => item.id === itemId ? { ...item, qty: newQty } : item);
    saveCart(updated);
  };

  const handleRemoveItem = (itemId) => {
    const updated = cartItems.filter(item => item.id !== itemId);
    saveCart(updated);
  };

  const handleTriggerCheckout = (method = 'standard') => {
    setCheckoutMethod(method);
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleOrderComplete = (orderData) => {
    setLastOrderData(orderData || { items: [...cartItems], orderNumber: '2939993' });
    saveCart([]);
    setIsCheckoutModalOpen(false);
    setCurrentView('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToProduct = (productId) => {
    if (productId) {
      setSelectedProductId(productId);
    }
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="hims-styled-app">
      {/* Clean Minimal Header (Storefront only, Admin has dedicated console header) */}
      {currentView !== 'admin' && (
        <Header 
          currentView={currentView}
          setCurrentView={setCurrentView}
          cartItems={cartItems}
          setIsCartOpen={setIsCartOpen}
          onNavigateToProductPage={handleNavigateToProduct}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onOpenQuiz={() => setIsQuizOpen(true)}
          isQuizCompleted={isQuizCompleted}
        />
      )}

      {/* Main Content Area */}
      <main className="hims-page-container">
        {currentView === 'landing' && (
          <LandingPage 
            products={productsList}
            onAddToCart={handleAddToCart}
            onNavigateToProductPage={handleNavigateToProduct}
            onOpenQuiz={() => setIsQuizOpen(true)}
          />
        )}
        {currentView === 'product' && (
          <ProductPage 
            product={currentProduct}
            onAddToCart={handleAddToCart}
            onNavigateToProduct={handleNavigateToProduct}
            onNavigateToLanding={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
        {currentView === 'order-confirmation' && (
          <Suspense fallback={<div className="hims-suspense-loader" />}>
            <OrderConfirmation 
              orderData={lastOrderData}
              onNavigateToLanding={() => {
                setCurrentView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToProduct={handleNavigateToProduct}
            />
          </Suspense>
        )}
        {currentView === 'account' && (
          <Suspense fallback={<div className="hims-suspense-loader" />}>
            <AccountPortal 
              currentUser={currentUser}
              onOpenAuth={handleOpenAuth}
              onLogout={handleLogout}
              onNavigateToLanding={() => {
                setCurrentView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToProduct={handleNavigateToProduct}
              onNavigateToOrder={() => {
                setCurrentView('order-confirmation');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenQuiz={() => setIsQuizOpen(true)}
              onAddToCart={handleAddToCart}
            />
          </Suspense>
        )}
        {currentView === 'admin' && (
          <Suspense fallback={<div className="hims-suspense-loader" />}>
            <AdminPortal 
              products={productsList}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onNavigateToLanding={() => {
                setCurrentView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToProduct={handleNavigateToProduct}
            />
          </Suspense>
        )}
      </main>

      {/* Interactive Skin Assessment Quiz Funnel (Lazy) */}
      {isQuizOpen && (
        <Suspense fallback={null}>
          <SkinQuiz 
            onClose={() => setIsQuizOpen(false)}
            onAddToCart={handleAddToCart}
            onOpenAuth={handleOpenAuth}
            onNavigateToProduct={handleNavigateToProduct}
            onQuizComplete={handleQuizComplete}
          />
        </Suspense>
      )}

      {/* Slide-out Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onTriggerCheckout={handleTriggerCheckout}
        onAddToCart={handleAddToCart}
      />

      {/* Onboarding & Authentication Drawer (Lazy) */}
      {isAuthOpen && (
        <Suspense fallback={null}>
          <AuthDrawer 
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            initialMode={authInitialMode}
            currentUser={currentUser}
            onAuthSuccess={handleAuthSuccess}
            onLogout={handleLogout}
            onNavigateToOrder={() => {
              setCurrentView('order-confirmation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToAccount={() => {
              setCurrentView('account');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </Suspense>
      )}

      {/* 1-Tap Checkout Modal Simulator (Lazy) */}
      {isCheckoutModalOpen && (
        <Suspense fallback={null}>
          <InstantCheckoutModal 
            isOpen={isCheckoutModalOpen}
            onClose={() => setIsCheckoutModalOpen(false)}
            cartItems={cartItems}
            checkoutMethod={checkoutMethod}
            onOrderComplete={handleOrderComplete}
          />
        </Suspense>
      )}

      {/* Minimal Footer (Storefront only) */}
      {currentView !== 'admin' && (
        <Footer 
          onNavigateToLanding={() => {
            setCurrentView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateToProductPage={() => handleNavigateToProduct('custom-anti-aging-serum')}
          onNavigateToAdmin={() => {
            setCurrentView('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Quick Developer / Admin Switcher Button (Bottom Left) */}
      <div className="hims-admin-quick-toggle">
        {currentView === 'admin' ? (
          <button 
            type="button" 
            className="admin-floating-btn"
            onClick={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            ← View Storefront
          </button>
        ) : (
          <button 
            type="button" 
            className="admin-floating-btn"
            onClick={() => {
              setCurrentView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            ⚙️ Admin Portal
          </button>
        )}
      </div>
    </div>
  );
}
