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
const CatalogPage = lazy(() => import('./components/CatalogPage'));

// Helper to parse route from location hash or localStorage so refreshing stays on the active view
const getInitialRoute = () => {
  try {
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (hash.startsWith('product/')) {
      const pId = hash.split('/')[1];
      return { view: 'product', productId: pId || 'custom-anti-aging-serum' };
    }
    if (hash === 'catalog' || hash.startsWith('catalog?')) {
      return { view: 'catalog', productId: null };
    }
    if (hash === 'account') {
      return { view: 'account', productId: null };
    }
    if (hash === 'admin') {
      return { view: 'admin', productId: null };
    }
    if (hash === 'order-confirmation') {
      return { view: 'order-confirmation', productId: null };
    }
    if (hash === 'landing') {
      return { view: 'landing', productId: 'custom-anti-aging-serum' };
    }

    // If no hash, check localStorage for persisted view across reloads
    const savedView = localStorage.getItem('lumiere_current_view');
    const savedProd = localStorage.getItem('lumiere_selected_product_id');
    if (savedView && ['catalog', 'product', 'account', 'admin', 'order-confirmation'].includes(savedView)) {
      return { view: savedView, productId: savedProd || 'custom-anti-aging-serum' };
    }
  } catch (e) {}
  return { view: 'landing', productId: 'custom-anti-aging-serum' };
};

export default function App() {
  const initialRoute = getInitialRoute();
  const [currentView, setCurrentView] = useState(initialRoute.view);
  const [selectedProductId, setSelectedProductId] = useState(initialRoute.productId || 'custom-anti-aging-serum');
  const [cartItems, setCartItems] = useState([]);
  const [lastOrderData, setLastOrderData] = useState(() => {
    try {
      const saved = localStorage.getItem('lumiere_last_order');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
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
          const existingIds = new Set(parsed.map(p => p.id));
          const newAdditions = PRODUCTS.filter(p => !existingIds.has(p.id));
          const merged = [...parsed, ...newAdditions];
          return merged.map(p => ({
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

  // Synchronize route with URL hash & localStorage so reloading the page stays on the current view
  useEffect(() => {
    try {
      localStorage.setItem('lumiere_current_view', currentView);
      if (selectedProductId) {
        localStorage.setItem('lumiere_selected_product_id', selectedProductId);
      }

      let newHash = '';
      if (currentView === 'product') {
        newHash = `#product/${selectedProductId}`;
      } else if (currentView === 'catalog') {
        newHash = '#catalog';
      } else if (currentView === 'account') {
        newHash = '#account';
      } else if (currentView === 'admin') {
        newHash = '#admin';
      } else if (currentView === 'order-confirmation') {
        newHash = '#order-confirmation';
      } else {
        newHash = '';
      }

      const currentHash = window.location.hash.replace(/^#\/?/, '').trim();
      const targetHashClean = newHash.replace(/^#\/?/, '').trim();
      if (currentHash !== targetHashClean) {
        window.history.replaceState(null, '', newHash || window.location.pathname);
      }
    } catch (e) {}
  }, [currentView, selectedProductId]);

  // Support browser Back and Forward navigation buttons
  useEffect(() => {
    const handleHashChange = () => {
      const route = getInitialRoute();
      if (route.view && route.view !== currentView) {
        setCurrentView(route.view);
      }
      if (route.productId && route.productId !== selectedProductId) {
        setSelectedProductId(route.productId);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [currentView, selectedProductId]);

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

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('lumiere_auth_user', JSON.stringify(updatedUser));
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

    // ponytail: if added as auto-ship subscription, sync immediately to active subscriptions
    if (newItem.isSubscription) {
      try {
        let existingSubs = [];
        const saved = localStorage.getItem('lumiere_subscriptions');
        if (saved) {
          try { existingSubs = JSON.parse(saved); } catch (e) {}
        }
        if (!Array.isArray(existingSubs)) existingSubs = [];
        const itemTitle = newItem.title || newItem.name || 'Clinical Formulation';
        const matchIdx = existingSubs.findIndex(s => 
          (s.productId && s.productId === newItem.productId) ||
          (s.productName && s.productName.toLowerCase() === itemTitle.toLowerCase())
        );
        const nextDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const newSub = {
          id: 'sub_' + Math.random().toString(36).substring(2, 9),
          productId: newItem.productId || newItem.id,
          status: 'Active',
          productName: itemTitle,
          formulaCode: 'Formula #LM-' + Math.floor(100 + Math.random() * 900),
          strength: newItem.size ? `${newItem.size} • Dermatologist Custom Protocol` : 'Clinical Strength Protocol',
          price: Number(newItem.price) || 24,
          frequencyDays: newItem.frequency?.includes('60') ? 60 : (newItem.frequency?.includes('90') ? 90 : 30),
          nextRefillDate: nextDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          image: newItem.image,
          companionAddons: []
        };
        if (matchIdx >= 0) {
          existingSubs[matchIdx] = { ...existingSubs[matchIdx], ...newSub, id: existingSubs[matchIdx].id };
        } else {
          existingSubs.push(newSub);
        }
        localStorage.setItem('lumiere_subscriptions', JSON.stringify(existingSubs));
        window.dispatchEvent(new Event('lumiere_subscription_updated'));
      } catch (e) {}
    }
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

  const handleToggleItemSubscription = (itemId) => {
    let toggledItem = null;
    const updated = cartItems.map(item => {
      if (item.id === itemId) {
        const nextSub = !item.isSubscription;
        const original = item.originalPrice || (item.isSubscription ? Math.round((item.price / 0.85) * 100) / 100 : item.price);
        const finalPrice = nextSub ? Math.round(original * 0.85 * 100) / 100 : original;
        toggledItem = {
          ...item,
          originalPrice: original,
          isSubscription: nextSub,
          price: finalPrice,
          frequency: nextSub ? (item.frequency || 'Every 30 Days') : null
        };
        return toggledItem;
      }
      return item;
    });
    saveCart(updated);

    if (toggledItem && toggledItem.isSubscription) {
      try {
        let existingSubs = [];
        const saved = localStorage.getItem('lumiere_subscriptions');
        if (saved) {
          try { existingSubs = JSON.parse(saved); } catch (e) {}
        }
        if (!Array.isArray(existingSubs)) existingSubs = [];
        const itemTitle = toggledItem.title || 'Clinical Formulation';
        const matchIdx = existingSubs.findIndex(s => 
          (s.productId && s.productId === toggledItem.productId) ||
          (s.productName && s.productName.toLowerCase() === itemTitle.toLowerCase())
        );
        const nextDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const newSub = {
          id: 'sub_' + Math.random().toString(36).substring(2, 9),
          productId: toggledItem.productId || toggledItem.id,
          status: 'Active',
          productName: itemTitle,
          formulaCode: 'Formula #LM-' + Math.floor(100 + Math.random() * 900),
          strength: toggledItem.size ? `${toggledItem.size} • Dermatologist Custom Protocol` : 'Clinical Strength Protocol',
          price: Number(toggledItem.price) || 24,
          frequencyDays: 30,
          nextRefillDate: nextDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          image: toggledItem.image,
          companionAddons: []
        };
        if (matchIdx >= 0) {
          existingSubs[matchIdx] = { ...existingSubs[matchIdx], ...newSub, id: existingSubs[matchIdx].id };
        } else {
          existingSubs.push(newSub);
        }
        localStorage.setItem('lumiere_subscriptions', JSON.stringify(existingSubs));
        window.dispatchEvent(new Event('lumiere_subscription_updated'));
      } catch (e) {}
    }
  };

  const handleUpdateItemFrequency = (itemId, frequency) => {
    const updated = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, frequency };
      }
      return item;
    });
    saveCart(updated);
  };

  const handleTriggerCheckout = (method = 'standard') => {
    setCheckoutMethod(method);
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleOrderComplete = (orderData) => {
    const completedItems = orderData?.items || cartItems;
    setLastOrderData(orderData || { items: [...completedItems], orderNumber: '2939993' });
    
    // ponytail: register real active subscriptions for every subscribed item
    const subItems = completedItems.filter(i => i.isSubscription);
    if (subItems.length > 0) {
      try {
        let existingSubs = [];
        const saved = localStorage.getItem('lumiere_subscriptions');
        if (saved) {
          try { existingSubs = JSON.parse(saved); } catch (e) {}
        }
        if (!Array.isArray(existingSubs) || existingSubs.length === 0) {
          existingSubs = [
            {
              id: 'sub_serum_92810',
              productId: 'custom-anti-aging-serum',
              status: 'Active',
              productName: 'Custom Anti-Aging Serum',
              formulaCode: 'Formula #LM-924',
              strength: 'Tretinoin 0.025% + Niacinamide 4%',
              price: 48,
              frequencyDays: 30,
              nextRefillDate: 'October 12, 2026',
              companionAddons: []
            }
          ];
        }

        const nextDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const formattedDate = nextDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        subItems.forEach(item => {
          const itemTitle = item.title || item.name || 'Custom Formulation';
          const matchIdx = existingSubs.findIndex(s => 
            (s.productId && s.productId === item.productId) ||
            (s.productName && s.productName.toLowerCase() === itemTitle.toLowerCase())
          );
          const newSub = {
            id: 'sub_' + Math.random().toString(36).substring(2, 9),
            productId: item.productId || item.id,
            status: 'Active',
            productName: itemTitle,
            formulaCode: 'Formula #LM-' + Math.floor(100 + Math.random() * 900),
            strength: item.size ? `${item.size} • Dermatologist Custom Protocol` : 'Clinical Strength Protocol',
            price: Number(item.price) || 24,
            frequencyDays: item.frequency?.includes('60') ? 60 : (item.frequency?.includes('90') ? 90 : 30),
            nextRefillDate: formattedDate,
            image: item.image,
            companionAddons: [],
            orderId: orderData?.orderNumber
          };
          if (matchIdx >= 0) {
            existingSubs[matchIdx] = { ...existingSubs[matchIdx], ...newSub, id: existingSubs[matchIdx].id };
          } else {
            existingSubs.push(newSub);
          }
        });

        localStorage.setItem('lumiere_subscriptions', JSON.stringify(existingSubs));
        localStorage.setItem('lumiere_active_subscription', JSON.stringify(existingSubs[existingSubs.length - 1]));
        window.dispatchEvent(new Event('lumiere_subscription_updated'));
      } catch (e) {
        console.error('Error saving subscriptions:', e);
      }
    }

    saveCart([]);
    setLastOrderData(orderData);
    try {
      localStorage.setItem('lumiere_last_order', JSON.stringify(orderData));
    } catch (e) {}
    setIsCheckoutModalOpen(false);
    setCurrentView('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [catalogCategory, setCatalogCategory] = useState('All');
  const [catalogSearch, setCatalogSearch] = useState('');

  const handleNavigateToProduct = (productId) => {
    if (productId) {
      setSelectedProductId(productId);
    }
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCatalog = (category = 'All', search = '') => {
    setCatalogCategory(category || 'All');
    setCatalogSearch(search || '');
    setCurrentView('catalog');
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
          onNavigateToCatalog={handleNavigateToCatalog}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onOpenQuiz={() => setIsQuizOpen(true)}
          isQuizCompleted={isQuizCompleted}
        />
      )}

      {/* Main Content Area */}
      <main className={`hims-page-container ${currentView === 'catalog' ? 'catalog-page-mode' : ''} ${currentView === 'account' ? 'account-page-mode' : ''}`}>
        {currentView === 'landing' && (
          <LandingPage 
            products={productsList}
            onAddToCart={handleAddToCart}
            onNavigateToProductPage={handleNavigateToProduct}
            onNavigateToCatalog={handleNavigateToCatalog}
            onOpenQuiz={() => setIsQuizOpen(true)}
          />
        )}
        {currentView === 'catalog' && (
          <Suspense fallback={<div className="hims-suspense-loader" />}>
            <CatalogPage 
              key={`${catalogCategory}-${catalogSearch}`}
              products={productsList}
              initialCategory={catalogCategory}
              initialSearch={catalogSearch}
              onNavigateToProduct={handleNavigateToProduct}
              onAddToCart={handleAddToCart}
              onNavigateToLanding={() => {
                setCurrentView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </Suspense>
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
              onUpdateUser={handleUpdateUser}
              onNavigateToAdmin={() => {
                setCurrentView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
        onToggleSubscription={handleToggleItemSubscription}
        onUpdateFrequency={handleUpdateItemFrequency}
        onTriggerCheckout={handleTriggerCheckout}
        onAddToCart={handleAddToCart}
        onNavigateToCatalog={handleNavigateToCatalog}
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
          onNavigateToCatalog={handleNavigateToCatalog}
          onNavigateToAdmin={() => {
            setCurrentView('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
