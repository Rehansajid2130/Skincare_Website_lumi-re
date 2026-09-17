// ponytail: luxury DTC subscription & account management portal matching Lumière aesthetic
import React, { useState, useEffect } from 'react';
import {
  Package,
  Calendar,
  Clock,
  RefreshCw,
  ShieldCheck,
  Sliders,
  Check,
  AlertCircle,
  Truck,
  ChevronRight,
  Edit3,
  Plus,
  User,
  MapPin,
  CreditCard,
  LogOut,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  HelpCircle,
  X
} from 'lucide-react';
import serumCutoutImg from '../assets/serum_cutout.png';
import creamCutoutImg from '../assets/cream_cutout.png';
import rxCreamCutoutImg from '../assets/rx_cream_cutout.png';
import sunscreenCutoutImg from '../assets/sunscreen_cutout.png';
import cleanserCutoutImg from '../assets/cleanser_cutout.png';
import { PRODUCTS } from '../data/products';

export default function AccountPortal({
  currentUser,
  onOpenAuth,
  onLogout,
  onUpdateUser,
  onNavigateToAdmin,
  onNavigateToLanding,
  onNavigateToProduct,
  onNavigateToOrder,
  onOpenQuiz,
  onAddToCart
}) {
  const [activeTab, setActiveTab] = useState('subscriptions'); // 'subscriptions' | 'orders' | 'skin-profile' | 'settings'

  // Editable Account Profile state
  const [profileForm, setProfileForm] = useState(() => ({
    name: currentUser?.name || 'Alex Smith',
    phone: currentUser?.phone || '(415) 890-2341',
    email: currentUser?.email || 'alex.smith@example.com',
    preferredName: currentUser?.preferredName || 'Alex',
    smsNotifications: currentUser?.smsNotifications !== false,
    emailConsultations: currentUser?.emailConsultations !== false
  }));

  // Synchronize with currentUser when updated
  useEffect(() => {
    if (currentUser) {
      setProfileForm(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        preferredName: currentUser.preferredName || prev.preferredName,
        smsNotifications: currentUser.smsNotifications !== undefined ? currentUser.smsNotifications : prev.smsNotifications,
        emailConsultations: currentUser.emailConsultations !== undefined ? currentUser.emailConsultations : prev.emailConsultations
      }));
    }
  }, [currentUser]);

  const loadMergedSubscriptions = () => {
    const list = [];
    const seen = new Set();

    const addSub = (sub) => {
      if (!sub) return;
      const key = (sub.productId || sub.productName || sub.title || '').toLowerCase().trim();
      if (!key || seen.has(key)) return;
      seen.add(key);

      const catalogMatch = PRODUCTS.find(p => 
        p.id === sub.productId || 
        p.title.toLowerCase() === (sub.productName || sub.title || '').toLowerCase()
      );

      const isCream = key.includes('cream');
      const isRx = key.includes('rx') || key.includes('prescription');
      const isSPF = key.includes('sunscreen') || key.includes('spf');
      const isCleanser = key.includes('cleanser');

      const fallbackImage = isRx ? rxCreamCutoutImg 
        : (isCream ? creamCutoutImg 
        : (isSPF ? sunscreenCutoutImg 
        : (isCleanser ? cleanserCutoutImg : serumCutoutImg)));

      list.push({
        id: sub.id || ('sub_' + Math.random().toString(36).substring(2, 9)),
        productId: sub.productId || catalogMatch?.id || key,
        status: sub.status || 'Active',
        productName: sub.productName || sub.title || catalogMatch?.title || 'Clinical Formulation',
        formulaCode: sub.formulaCode || (catalogMatch?.id ? `Formula #${catalogMatch.id.substring(0, 4).toUpperCase()}` : 'Formula #LM-924'),
        strength: sub.strength || catalogMatch?.activeFormula || 'Dermatologist Custom Protocol',
        price: Number(sub.price) || (catalogMatch ? Math.round(catalogMatch.basePrice * 0.85 * 100) / 100 : 24),
        frequencyDays: Number(sub.frequencyDays) || (sub.frequency?.includes('60') ? 60 : (sub.frequency?.includes('90') ? 90 : 30)),
        nextRefillDate: sub.nextRefillDate || 'October 16, 2026',
        image: sub.image || catalogMatch?.cutoutImage || catalogMatch?.image || fallbackImage,
        description: sub.description || catalogMatch?.description || 'Formulated with prescription-strength active ingredients backed by board-certified dermatologists.',
        companionAddons: sub.companionAddons || []
      });
    };

    // 1. Load from lumiere_subscriptions
    try {
      const saved = localStorage.getItem('lumiere_subscriptions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) parsed.forEach(addSub);
      }
    } catch (e) {}

    // 2. Load any subscription items from lumiere_modern_cart or lumiere_cart
    try {
      const savedCart = localStorage.getItem('lumiere_modern_cart') || localStorage.getItem('lumiere_cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          parsedCart.filter(item => item.isSubscription).forEach(item => {
            addSub({
              id: 'sub_' + (item.productId || item.id),
              productId: item.productId || item.id,
              productName: item.title || item.name,
              price: item.price,
              frequencyDays: item.frequency?.includes('60') ? 60 : (item.frequency?.includes('90') ? 90 : 30),
              image: item.image
            });
          });
        }
      }
    } catch (e) {}

    // 3. Load from legacy single active subscription
    try {
      const single = localStorage.getItem('lumiere_active_subscription');
      if (single) addSub(JSON.parse(single));
    } catch (e) {}

    // 4. Default items if list is empty
    if (!seen.has('custom-anti-aging-serum') && !seen.has('custom anti-aging serum')) {
      addSub({
        id: 'sub_serum_92810',
        productId: 'custom-anti-aging-serum',
        status: 'Active',
        productName: 'Custom Anti-Aging Serum',
        formulaCode: 'Formula #LM-924',
        strength: 'Tretinoin 0.025% + Niacinamide 4%',
        price: 48,
        frequencyDays: 30,
        nextRefillDate: 'October 12, 2026',
        image: serumCutoutImg
      });
    }

    if (!seen.has('goodnight-wrinkle-cream') && !seen.has('goodnight wrinkle cream')) {
      addSub({
        id: 'sub_cream_71904',
        productId: 'goodnight-wrinkle-cream',
        status: 'Active',
        productName: 'Goodnight Wrinkle Cream',
        formulaCode: 'Formula #LM-612',
        strength: 'Squalane 5% + Multi-Weight HA Complex (50ml)',
        price: 20.40,
        frequencyDays: 30,
        nextRefillDate: 'October 16, 2026',
        image: creamCutoutImg
      });
    }

    return list;
  };

  const getSubscriptionImage = (sub) => {
    if (sub.image && typeof sub.image === 'string' && (sub.image.startsWith('/') || sub.image.startsWith('data:'))) {
      return sub.image;
    }
    const name = (sub.productName || sub.title || '').toLowerCase();
    const pid = (sub.productId || sub.id || '').toLowerCase();
    
    // Try to find in PRODUCTS data catalog
    const found = PRODUCTS.find(p => p.id === pid || p.title.toLowerCase() === name || name.includes(p.title.toLowerCase()));
    if (found && (found.cutoutImage || found.image)) {
      return found.cutoutImage || found.image;
    }

    if (name.includes('cream') || pid.includes('cream')) {
      if (name.includes('rx') || pid.includes('prescription')) return rxCreamCutoutImg;
      return creamCutoutImg;
    }
    if (name.includes('sunscreen') || name.includes('spf') || pid.includes('sunscreen') || pid.includes('spf')) return sunscreenCutoutImg;
    if (name.includes('cleanser') || pid.includes('cleanser')) return cleanserCutoutImg;
    return serumCutoutImg;
  };

  // Subscriptions array state from localStorage
  const [subscriptionsList, setSubscriptionsList] = useState(() => loadMergedSubscriptions());

  // Track which subscription is targeted for modal actions
  const [targetSubId, setTargetSubId] = useState(() => subscriptionsList[0]?.id || 'sub_serum_92810');
  const activeTargetSub = subscriptionsList.find(s => s.id === targetSubId) || subscriptionsList[0];

  // Quick Add Subscription modal state
  const [isAddSubModalOpen, setIsAddSubModalOpen] = useState(false);

  // Sync latest subscriptions from localStorage on mount/focus
  useEffect(() => {
    const handleSync = () => {
      setSubscriptionsList(loadMergedSubscriptions());
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('lumiere_subscription_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('lumiere_subscription_updated', handleSync);
    };
  }, []);

  // Backward compatibility alias for single-subscription references
  const subscription = activeTargetSub;

  // Modal controls
  const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);
  const [isStrengthModalOpen, setIsStrengthModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Strength adjustment state
  const [selectedStrength, setSelectedStrength] = useState(subscription?.strength || 'Tretinoin 0.025% + Niacinamide 4%');
  const [strengthDoctorNote, setStrengthDoctorNote] = useState('');
  const [strengthRequested, setStrengthRequested] = useState(false);

  // Address state
  const [shippingAddress, setShippingAddress] = useState(() => {
    try {
      const saved = localStorage.getItem('lumiere_shipping_address');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return {
      fullName: currentUser?.name || 'Alex Smith',
      street: '742 Evergreen Terrace, Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      phone: '(415) 890-2341'
    };
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      showToast('Please enter your full name');
      return;
    }
    if (!profileForm.phone.trim()) {
      showToast('Please enter your contact phone number');
      return;
    }

    const updatedUser = {
      ...(currentUser || {}),
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim(),
      email: profileForm.email.trim(),
      preferredName: profileForm.preferredName.trim(),
      smsNotifications: profileForm.smsNotifications,
      emailConsultations: profileForm.emailConsultations
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    // Synchronize shipping address name and phone as well
    setShippingAddress(prev => {
      const updatedAddr = {
        ...prev,
        fullName: profileForm.name.trim(),
        phone: profileForm.phone.trim()
      };
      try {
        localStorage.setItem('lumiere_shipping_address', JSON.stringify(updatedAddr));
      } catch (err) {}
      return updatedAddr;
    });

    showToast('Account details & phone number updated successfully');
  };

  const saveSubscriptionsList = (updated) => {
    setSubscriptionsList(updated);
    try {
      localStorage.setItem('lumiere_subscriptions', JSON.stringify(updated));
      if (updated.length > 0) {
        localStorage.setItem('lumiere_active_subscription', JSON.stringify(updated[0]));
      }
    } catch (e) { }
  };

  // Snooze next delivery by days for targeted subscription
  const handleSnoozeDelivery = (days = 30) => {
    const sub = activeTargetSub;
    if (!sub) return;
    const currentDate = new Date((sub.nextRefillDate || '').replace(/(\w+)\s(\d+),\s(\d+)/, '$1 $2, $3'));
    const validDate = isNaN(currentDate.getTime()) ? new Date() : currentDate;
    validDate.setDate(validDate.getDate() + days);

    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const newDateStr = validDate.toLocaleDateString('en-US', options);

    const updated = subscriptionsList.map(s => s.id === sub.id ? { ...s, nextRefillDate: newDateStr } : s);
    saveSubscriptionsList(updated);
    setIsSnoozeModalOpen(false);
    showToast(`${sub.productName} refill postponed to ${newDateStr}`);
  };

  // Change frequency (e.g. 30, 60, 90) for specific subscription
  const handleChangeFrequency = (subId, days) => {
    const sub = subscriptionsList.find(s => s.id === subId);
    const updated = subscriptionsList.map(s => s.id === subId ? { ...s, frequencyDays: days } : s);
    saveSubscriptionsList(updated);
    showToast(`${sub?.productName || 'Delivery'} cadence updated to every ${days} days`);
  };

  // Submit strength adjustment request
  const handleStrengthSubmit = (e) => {
    e.preventDefault();
    setStrengthRequested(true);
    setTimeout(() => {
      const updated = subscriptionsList.map(s => s.id === activeTargetSub.id ? { ...s, strength: selectedStrength } : s);
      saveSubscriptionsList(updated);
      setIsStrengthModalOpen(false);
      setStrengthRequested(false);
      showToast(`Protocol for ${activeTargetSub.productName} submitted to Dr. Sarah Jenkins for approval`);
    }, 900);
  };

  // Pause or cancel subscription
  const handlePauseOrCancel = (subId, action = 'pause') => {
    const sub = subscriptionsList.find(s => s.id === subId);
    if (!sub) return;
    let updated;
    if (action === 'cancel') {
      updated = subscriptionsList.filter(s => s.id !== subId);
      showToast(`${sub.productName} auto-ship cancelled`);
    } else {
      const nextStatus = sub.status === 'Paused' ? 'Active' : 'Paused';
      updated = subscriptionsList.map(s => s.id === subId ? { ...s, status: nextStatus } : s);
      showToast(`${sub.productName} is now ${nextStatus.toLowerCase()}`);
    }
    saveSubscriptionsList(updated);
    setIsPauseModalOpen(false);
  };

  // Add any product directly as an active subscription to the regimen
  const handleAddCompanionToRefill = (product) => {
    const prodTitle = product.title || product.productName || 'Clinical Formulation';
    const prodId = product.id || product.productId || ('sub_' + Math.random().toString(36).substring(2, 8));

    const alreadySubbed = subscriptionsList.some(s => 
      s.productId === prodId || 
      s.productName?.toLowerCase() === prodTitle.toLowerCase()
    );
    if (alreadySubbed) {
      showToast(`${prodTitle} is already active in your subscriptions!`);
      return;
    }

    const catalogItem = PRODUCTS.find(p => p.id === prodId || p.title?.toLowerCase() === prodTitle.toLowerCase());
    const nextDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const formattedDate = nextDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const finalPrice = Math.round((Number(product.price || catalogItem?.basePrice || 24) * 0.85) * 100) / 100;

    const isCream = prodTitle.toLowerCase().includes('cream');
    const isRx = prodTitle.toLowerCase().includes('rx') || prodTitle.toLowerCase().includes('prescription');
    const isSPF = prodTitle.toLowerCase().includes('sunscreen') || prodTitle.toLowerCase().includes('spf');
    const isCleanser = prodTitle.toLowerCase().includes('cleanser');

    const fallbackImg = isRx ? rxCreamCutoutImg 
      : (isCream ? creamCutoutImg 
      : (isSPF ? sunscreenCutoutImg 
      : (isCleanser ? cleanserCutoutImg : serumCutoutImg)));

    const newSub = {
      id: 'sub_' + Math.random().toString(36).substring(2, 9),
      productId: prodId,
      status: 'Active',
      productName: prodTitle,
      formulaCode: catalogItem?.activeFormula ? `Formula #${(catalogItem.id || 'LM01').substring(0, 4).toUpperCase()}` : ('Formula #LM-' + Math.floor(100 + Math.random() * 900)),
      strength: catalogItem?.activeFormula || product.strength || (isSPF ? 'Zinc Oxide 12% + Niacinamide 2%' : 'Active Dermatological Protocol'),
      price: finalPrice,
      frequencyDays: 30,
      nextRefillDate: formattedDate,
      image: catalogItem?.cutoutImage || catalogItem?.image || product.image || fallbackImg,
      description: catalogItem?.description || product.desc || 'Dermatologist-formulated routine companion to synergize with your daily skincare protocol.',
      companionAddons: []
    };

    const updated = [...subscriptionsList, newSub];
    saveSubscriptionsList(updated);
    showToast(`Subscribed! ${prodTitle} added to your Active Regimen ($${finalPrice.toFixed(2)}/refill).`);
  };

  const handleRemoveCompanion = (productId) => {
    const updated = subscriptionsList.filter(s => s.id !== productId && s.productId !== productId);
    saveSubscriptionsList(updated);
    showToast('Removed formulation from active regimen');
  };

  // If not logged in, show luxury auth gateway
  if (!currentUser) {
    return (
      <div className="hims-account-gateway-container">
        <div className="hims-account-gateway-card">
          <div className="hims-gateway-badge">LUMIÈRE CLINICAL PORTAL</div>
          <h1 className="hims-gateway-title">Access Your Prescriptions & Subscriptions</h1>
          <p className="hims-gateway-subtitle">
            Log in to manage upcoming refills, modify dosage strength, track active orders, or consult with your care team.
          </p>

          <div className="hims-gateway-actions">
            <button
              type="button"
              className="hims-btn-black"
              onClick={() => onOpenAuth('login')}
              style={{ width: '100%' }}
            >
              Log in to Account
            </button>
            <button
              type="button"
              className="hims-btn-outline"
              onClick={() => onOpenAuth('signup')}
              style={{ width: '100%', marginTop: 10 }}
            >
              Create an Account
            </button>
          </div>

          <div className="hims-gateway-footer">
            <button
              type="button"
              className="hims-link-subtle"
              onClick={onNavigateToLanding}
            >
              ← Back to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hims-account-page-wrapper">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="hims-account-toast">
          <Check size={16} strokeWidth={2.5} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Account Top Profile Banner */}
      <div className="hims-account-hero-bar">
        <div className="hims-account-hero-inner">
          <div className="hims-account-user-meta">
            <div className="hims-account-hero-avatar">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hims-account-hero-info">
              <div className="hims-account-hero-name-row">
                <h1 className="hims-account-hero-name">{currentUser.name || 'Lumière Member'}</h1>
                <span className="hims-prescription-active-pill">
                  <ShieldCheck size={13} />
                  <span>Clinical Prescription Active</span>
                </span>
              </div>
              <p className="hims-account-hero-email">
                {currentUser.email} • Member since {currentUser.memberSince || '2026'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation Navigation Bar */}
      <div className="hims-account-tabs-nav-bar">
        <div className="hims-account-tabs-inner">
          <button
            type="button"
            className={`hims-account-tab-btn ${activeTab === 'subscriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscriptions')}
          >
            <RefreshCw size={16} />
            <span>Active Subscriptions</span>
          </button>
          <button
            type="button"
            className={`hims-account-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={16} />
            <span>Order History & Tracking</span>
          </button>
          <button
            type="button"
            className={`hims-account-tab-btn ${activeTab === 'skin-profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('skin-profile')}
          >
            <Sparkles size={16} />
            <span>Skin Diagnostic Profile</span>
          </button>
          <button
            type="button"
            className={`hims-account-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Sliders size={16} />
            <span>Account Settings</span>
          </button>
        </div>
      </div>

      {/* Main Tab Panels Container */}
      <div className="hims-account-main-content">

        {/* TAB 1: ACTIVE SUBSCRIPTIONS & REFILLS */}
        {activeTab === 'subscriptions' && (
          <div className="hims-account-tab-panel animate-fade-in">
            <div className="panel-header-row">
              <div>
                <h2 className="panel-section-title">Your Active Regimen</h2>
                <p className="panel-section-desc">
                  Manage your automatic shipments, reschedule delivery dates, or adjust active concentrations without cancellation.
                </p>
              </div>

              <div className="panel-header-badges" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  className="hims-btn-black"
                  style={{ padding: '8px 18px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '9999px', cursor: 'pointer' }}
                  onClick={() => setIsAddSubModalOpen(true)}
                  id="add-product-to-regimen-btn"
                >
                  <Plus size={15} />
                  <span>+ Subscribe New Product</span>
                </button>
                <span className="refill-counter-badge">
                  <Calendar size={14} />
                  <span>Next Refill: <strong>{activeTargetSub?.nextRefillDate || 'October 16, 2026'}</strong></span>
                </span>
              </div>
            </div>

            {/* List of All Active Subscriptions */}
            <div className="hims-subs-list" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {subscriptionsList.map((sub) => {
                const subImg = getSubscriptionImage(sub);
                return (
                  <div key={sub.id} className="hims-sub-card">
                    <div className="hims-sub-card-left">
                      <div className="hims-sub-img-wrap">
                        <img src={subImg} alt={sub.productName} className="product-cutout-img" />
                      </div>
                    </div>

                    <div className="hims-sub-card-center">
                      <div className="hims-sub-badge-row">
                        <span className="hims-rx-tag">{sub.formulaCode || 'Formula #LM-924'}</span>
                        <span className={`hims-status-tag ${sub.status === 'Active' ? 'active' : 'paused'}`}>
                          Status: {sub.status}
                        </span>
                      </div>
                      <h3 className="hims-sub-title">{sub.productName}</h3>
                      <div className="hims-sub-formula-spec">
                        <strong>ACTIVE DOSAGE:</strong> {sub.strength || 'Dermatologist Custom Protocol'}
                      </div>
                      <p className="hims-sub-explanation">
                        {sub.description || (sub.productName.toLowerCase().includes('cream')
                          ? 'Ultra-nourishing overnight moisture barrier shield that locks in active retinoids and restores dermal lipid balance.'
                          : 'Formulated to target fine lines, cellular density, and micro-texture. Formulated fresh in California 48 hours prior to delivery.')}
                      </p>

                      <div className="hims-sub-meta-row">
                        <div className="sub-meta-item">
                          <span className="meta-label">Schedule:</span>
                          <span className="meta-value">Every {sub.frequencyDays || 30} Days</span>
                        </div>
                        <div className="sub-meta-item">
                          <span className="meta-label">Price:</span>
                          <span className="meta-value">${sub.price} / refill</span>
                        </div>
                        <div className="sub-meta-item">
                          <span className="meta-label">Shipping:</span>
                          <span className="meta-value">Free 2-Day Air</span>
                        </div>
                      </div>
                    </div>

                    <div className="hims-sub-card-right">
                      <div className="sub-actions-box">
                        <button
                          type="button"
                          className="hims-btn-black sub-action-btn"
                          onClick={() => {
                            setTargetSubId(sub.id);
                            setIsSnoozeModalOpen(true);
                          }}
                        >
                          <Clock size={16} />
                          <span>Delay / Snooze (+30 Days)</span>
                        </button>

                        <button
                          type="button"
                          className="hims-btn-outline sub-action-btn"
                          onClick={() => {
                            setTargetSubId(sub.id);
                            setSelectedStrength(sub.strength || '');
                            setIsStrengthModalOpen(true);
                          }}
                        >
                          <Sliders size={16} />
                          <span>Adjust Active Strength</span>
                        </button>

                        <div className="frequency-toggle-wrapper">
                          <span className="freq-label">Refill Frequency:</span>
                          <div className="freq-pill-group">
                            {[30, 60, 90].map((days) => (
                              <button
                                key={days}
                                type="button"
                                className={`freq-pill ${(sub.frequencyDays || 30) === days ? 'active' : ''}`}
                                onClick={() => handleChangeFrequency(sub.id, days)}
                              >
                                {days}d
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="sub-secondary-link"
                          onClick={() => {
                            setTargetSubId(sub.id);
                            setIsPauseModalOpen(true);
                          }}
                        >
                          {sub.status === 'Paused' ? 'Resume Subscription' : 'Manage / Pause Subscription'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Companion Products Section */}
            <div className="hims-addons-section">
              <div className="addons-header">
                <h4 className="addons-title">Clinical Routine Companions</h4>
                <p className="addons-sub">
                  Dermatologist-recommended formulations that synergize with your prescription tretinoin to maximize dermal barrier health. Click any item to add it to your active refill shipments at 15% discount.
                </p>
              </div>

              <div className="addons-cards-grid">
                {/* Companion 1: Goodnight Wrinkle Cream */}
                {(() => {
                  const isCreamActive = subscriptionsList.some(s => s.productName?.toLowerCase().includes('wrinkle cream') || s.productId?.includes('goodnight-wrinkle-cream'));
                  return (
                    <div className="addon-product-card">
                      <div className="addon-img-box">
                        <img src={creamCutoutImg} alt="Goodnight Wrinkle Cream" className="product-cutout-img" />
                      </div>
                      <div className="addon-info">
                        <span className="addon-step-label">Moisture Barrier Shield</span>
                        <h5 className="addon-prod-title">Goodnight Wrinkle Cream</h5>
                        <p className="addon-prod-desc">Deeply conditions the stratum corneum with squalane and multi-weight hyaluronic acid.</p>
                        <div className="addon-bottom-row">
                          <span className="addon-price">$20.40 <span style={{ textDecoration: 'line-through', fontSize: '0.75rem', color: '#8c827a' }}>$24</span></span>
                          <button
                            type="button"
                            className="addon-add-btn"
                            disabled={isCreamActive}
                            onClick={() => handleAddCompanionToRefill({ id: 'goodnight-wrinkle-cream', title: 'Goodnight Wrinkle Cream', price: 24, image: creamCutoutImg })}
                            style={isCreamActive ? { background: '#f5f0eb', color: '#065f46', border: '1px solid #cce3de', cursor: 'default' } : {}}
                          >
                            {isCreamActive ? <Check size={14} /> : <Plus size={14} />}
                            <span>{isCreamActive ? 'Active in Regimen' : 'Add to Next Box'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Companion 2: Daily Mineral SPF 30 */}
                {(() => {
                  const isSpfActive = subscriptionsList.some(s => s.productName?.toLowerCase().includes('spf') || s.productId?.includes('sunscreen') || s.productId?.includes('spf'));
                  return (
                    <div className="addon-product-card">
                      <div className="addon-img-box">
                        <img src={sunscreenCutoutImg} alt="Daily Mineral Defense SPF 30" className="product-cutout-img" />
                      </div>
                      <div className="addon-info">
                        <span className="addon-step-label">Broad Spectrum Defense</span>
                        <h5 className="addon-prod-title">Daily Mineral SPF 30</h5>
                        <p className="addon-prod-desc">Invisible mineral protection that guards newly surfaced retinoid-treated cells against UV photoaging.</p>
                        <div className="addon-bottom-row">
                          <span className="addon-price">$22.10 <span style={{ textDecoration: 'line-through', fontSize: '0.75rem', color: '#8c827a' }}>$26</span></span>
                          <button
                            type="button"
                            className="addon-add-btn"
                            disabled={isSpfActive}
                            onClick={() => handleAddCompanionToRefill({ id: 'daily-mineral-defense-spf-30', title: 'Daily Mineral SPF 30', price: 26, image: sunscreenCutoutImg })}
                            style={isSpfActive ? { background: '#f5f0eb', color: '#065f46', border: '1px solid #cce3de', cursor: 'default' } : {}}
                          >
                            {isSpfActive ? <Check size={14} /> : <Plus size={14} />}
                            <span>{isSpfActive ? 'Active in Regimen' : 'Add to Next Box'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Companion 3: High Tide Squalane Cleanser */}
                {(() => {
                  const isCleanserActive = subscriptionsList.some(s => s.productName?.toLowerCase().includes('cleanser') || s.productId?.includes('cleanser'));
                  return (
                    <div className="addon-product-card">
                      <div className="addon-img-box">
                        <img src={cleanserCutoutImg} alt="High Tide Squalane Cleanser" className="product-cutout-img" />
                      </div>
                      <div className="addon-info">
                        <span className="addon-step-label">Lipid-Preserving Cleanse</span>
                        <h5 className="addon-prod-title">High Tide Squalane Cleanser</h5>
                        <p className="addon-prod-desc">Gentle amino acid wash that rinses surface impurities without compromising natural sebum lipids.</p>
                        <div className="addon-bottom-row">
                          <span className="addon-price">$18.70 <span style={{ textDecoration: 'line-through', fontSize: '0.75rem', color: '#8c827a' }}>$22</span></span>
                          <button
                            type="button"
                            className="addon-add-btn"
                            disabled={isCleanserActive}
                            onClick={() => handleAddCompanionToRefill({ id: 'gentle-cream-cleanser', title: 'High Tide Squalane Cleanser', price: 22, image: cleanserCutoutImg })}
                            style={isCleanserActive ? { background: '#f5f0eb', color: '#065f46', border: '1px solid #cce3de', cursor: 'default' } : {}}
                          >
                            {isCleanserActive ? <Check size={14} /> : <Plus size={14} />}
                            <span>{isCleanserActive ? 'Active in Regimen' : 'Add to Next Box'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER HISTORY & LIVE SHIPMENT TRACKING */}
        {activeTab === 'orders' && (
          <div className="hims-account-tab-panel animate-fade-in">
            <div className="panel-header-row">
              <div>
                <h2 className="panel-section-title">Order History & Shipments</h2>
                <p className="panel-section-desc">
                  View tracking details, delivery receipts, and compounding batch codes for all your previous formulations.
                </p>
              </div>
            </div>

            <div className="hims-orders-list">
              {/* Order 1: Most recent shipment */}
              <div className="hims-order-card">
                <div className="order-card-header">
                  <div className="order-meta-col">
                    <span className="meta-label">ORDER PLACED</span>
                    <span className="meta-val">September 12, 2026</span>
                  </div>
                  <div className="order-meta-col">
                    <span className="meta-label">ORDER NUMBER</span>
                    <span className="meta-val font-mono">#LM-92841</span>
                  </div>
                  <div className="order-meta-col">
                    <span className="meta-label">TOTAL</span>
                    <span className="meta-val">$48.00</span>
                  </div>
                  <div className="order-status-badge in-transit">
                    <Truck size={14} />
                    <span>In Transit • Arriving Friday</span>
                  </div>
                </div>

                <div className="order-tracking-strip">
                  <div className="tracking-progress-bar">
                    <div className="progress-fill" style={{ width: '75%' }}></div>
                  </div>
                  <div className="tracking-steps-row">
                    <span className="step-item done">Compounded</span>
                    <span className="step-item done">Quality Checked</span>
                    <span className="step-item active">Out with Courier</span>
                    <span className="step-item">Delivered</span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-items-row">
                    <div className="order-item-thumb">
                      <img src={serumCutoutImg} alt="Custom Serum" />
                      <div>
                        <div className="thumb-title">Custom Anti-Aging Serum (30ml)</div>
                        <div className="thumb-sub">Formula #LM-924 • Tretinoin 0.025% + Niacinamide 4%</div>
                      </div>
                    </div>
                    <div className="order-pricing-summary">
                      <div className="pricing-line">$48.00</div>
                      <div className="shipping-line">Carrier: FedEx 2-Day Air (#928190241)</div>
                    </div>
                  </div>
                </div>

                <div className="order-card-footer">
                  <button
                    type="button"
                    className="hims-btn-black order-action-btn"
                    onClick={() => {
                      if (onNavigateToOrder) {
                        onNavigateToOrder();
                      }
                    }}
                  >
                    View Live Tracking Details
                  </button>
                  <button
                    type="button"
                    className="hims-btn-outline order-action-btn"
                    onClick={() => showToast('Order invoice downloaded')}
                  >
                    Download Invoice (PDF)
                  </button>
                </div>
              </div>

              {/* Order 2: Prior Delivery */}
              <div className="hims-order-card">
                <div className="order-card-header">
                  <div className="order-meta-col">
                    <span className="meta-label">ORDER PLACED</span>
                    <span className="meta-val">August 12, 2026</span>
                  </div>
                  <div className="order-meta-col">
                    <span className="meta-label">ORDER NUMBER</span>
                    <span className="meta-val font-mono">#LM-84192</span>
                  </div>
                  <div className="order-meta-col">
                    <span className="meta-label">TOTAL</span>
                    <span className="meta-val">$72.00</span>
                  </div>
                  <div className="order-status-badge delivered">
                    <Check size={14} />
                    <span>Delivered • August 15, 2026</span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-items-row">
                    <div className="order-item-thumb">
                      <img src={serumCutoutImg} alt="Custom Serum" />
                      <div>
                        <div className="thumb-title">Custom Anti-Aging Serum (30ml) + Goodnight Wrinkle Cream</div>
                        <div className="thumb-sub">Formula #LM-924 • Clinical 2-Step Night Set</div>
                      </div>
                    </div>
                    <div className="order-pricing-summary">
                      <div className="pricing-line">$72.00</div>
                      <div className="shipping-line">Delivered to Front Door</div>
                    </div>
                  </div>
                </div>

                <div className="order-card-footer">
                  <button
                    type="button"
                    className="hims-btn-outline order-action-btn"
                    onClick={() => showToast('Order invoice downloaded')}
                  >
                    Download Invoice (PDF)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SKIN DIAGNOSTIC PROFILE & CARE TEAM */}
        {activeTab === 'skin-profile' && (
          <div className="hims-account-tab-panel animate-fade-in">
            <div className="panel-header-row">
              <div>
                <h2 className="panel-section-title">Your Clinical Skin Profile</h2>
                <p className="panel-section-desc">
                  Based on your medical consultation and diagnostic assessment. You can retake the quiz anytime as seasons change.
                </p>
              </div>

              <button
                type="button"
                className="hims-btn-outline"
                onClick={() => {
                  if (onOpenQuiz) onOpenQuiz();
                }}
              >
                <Sparkles size={16} />
                <span>Retake Consultation Quiz</span>
              </button>
            </div>

            {/* Diagnostic Details Grid */}
            <div className="hims-skin-profile-grid">
              <div className="profile-spec-card">
                <span className="spec-label">PRIMARY TARGET CONCERN</span>
                <h4 className="spec-value">Wrinkles & Expression Lines</h4>
                <p className="spec-sub">
                  Targeted with precision-compounded tretinoin to stimulate dermal collagen and cellular renewal.
                </p>
              </div>

              <div className="profile-spec-card">
                <span className="spec-label">SKIN TYPE CALIBRATION</span>
                <h4 className="spec-value">Combination / Balanced</h4>
                <p className="spec-sub">
                  Emollient vehicle adjusted to absorb cleanly without clogging T-zone pores or drying cheeks.
                </p>
              </div>

              <div className="profile-spec-card">
                <span className="spec-label">ACTIVE TOLERANCE LEVEL</span>
                <h4 className="spec-value">Moderate Active Retinoid User</h4>
                <p className="spec-sub">
                  Calibrated to 0.025% strength paired with 4% anti-inflammatory Niacinamide to buffer against redness.
                </p>
              </div>

              <div className="profile-spec-card">
                <span className="spec-label">RECOMMENDED PROTOCOL</span>
                <h4 className="spec-value">Bedside 3-Step Regimen</h4>
                <p className="spec-sub">
                  Apply 1 pump of Custom Serum nightly after gentle cleansing; seal with Goodnight Wrinkle Cream.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACCOUNT SETTINGS, PROFILE & ADMIN PANEL */}
        {activeTab === 'settings' && (
          <div className="hims-account-tab-panel animate-fade-in">
            <div className="panel-header-row">
              <div>
                <h2 className="panel-section-title">Account Settings & Operations</h2>
                <p className="panel-section-desc">
                  Manage your personal account profile, contact number, communication preferences, staff admin studio, and billing.
                </p>
              </div>
            </div>

            {/* Top Priority: Staff / Store Operations Card (The requested Admin Panel button) */}
            <div className="hims-admin-access-card">
              <div className="admin-access-left">
                <div className="admin-access-badge-row">
                  <span className="admin-staff-badge">
                    <ShieldCheck size={13} />
                    <span>Store Operations</span>
                  </span>
                  <span className="admin-active-status">Privileged Access</span>
                </div>
                <h3 className="admin-access-title">Lumière Admin & Inventory Studio</h3>
                <p className="admin-access-desc">
                  Access catalog management, product cutout studio, inventory stock tracking, and real-time sales telemetry.
                </p>
                <div className="admin-feature-tags">
                  <span className="feature-tag">Catalog CMS</span>
                  <span className="feature-tag">Photo Studio Cutouts</span>
                  <span className="feature-tag">Stock & Pricing Controls</span>
                  <span className="feature-tag">Telemetry Analytics</span>
                </div>
              </div>

              <div className="admin-access-right">
                <button
                  type="button"
                  className="hims-btn-black admin-launch-btn"
                  onClick={() => {
                    if (onNavigateToAdmin) {
                      onNavigateToAdmin();
                    }
                  }}
                  id="account-admin-panel-btn"
                >
                  <Sliders size={16} />
                  <span>Open Admin Panel</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="hims-settings-grid">
              {/* Profile Information & Contact Details Card */}
              <div className="hims-settings-card hims-profile-edit-card">
                <div className="settings-card-header">
                  <div className="settings-header-left">
                    <User size={18} color="#8C6D53" />
                    <h3 className="settings-card-title">Personal Profile & Contact Info</h3>
                  </div>
                  <span className="address-tag">Verified Member</span>
                </div>

                <form onSubmit={handleSaveProfile} className="settings-card-body">
                  <div className="profile-form-grid">
                    <div className="profile-input-group">
                      <label htmlFor="account-full-name" className="profile-label">
                        Full Name <span className="req-star">*</span>
                      </label>
                      <input
                        id="account-full-name"
                        type="text"
                        className="profile-input"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="e.g. Alex Smith"
                        required
                      />
                    </div>

                    <div className="profile-input-group">
                      <label htmlFor="account-phone-number" className="profile-label">
                        Phone Number <span className="req-star">*</span>
                      </label>
                      <input
                        id="account-phone-number"
                        type="tel"
                        className="profile-input"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="e.g. (415) 890-2341"
                        required
                      />
                      <span className="input-hint">Used for carrier tracking & automated refill SMS alerts</span>
                    </div>

                    <div className="profile-input-group">
                      <label htmlFor="account-email-address" className="profile-label">
                        Email Address
                      </label>
                      <input
                        id="account-email-address"
                        type="email"
                        className="profile-input"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        placeholder="yourname@domain.com"
                      />
                    </div>

                    <div className="profile-input-group">
                      <label htmlFor="account-preferred-name" className="profile-label">
                        Preferred Name / Salutation
                      </label>
                      <input
                        id="account-preferred-name"
                        type="text"
                        className="profile-input"
                        value={profileForm.preferredName}
                        onChange={(e) => setProfileForm({ ...profileForm, preferredName: e.target.value })}
                        placeholder="e.g. Alex"
                      />
                      <span className="input-hint">Printed on your personalized prescription bottle label</span>
                    </div>
                  </div>

                  <div className="profile-save-action-row">
                    <button
                      type="submit"
                      className="hims-btn-black profile-save-btn"
                    >
                      <Check size={16} strokeWidth={2.5} />
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Notification & Care Alerts Card */}
              <div className="hims-settings-card">
                <div className="settings-card-header">
                  <div className="settings-header-left">
                    <Sparkles size={18} color="#8C6D53" />
                    <h3 className="settings-card-title">Communication & Alerts</h3>
                  </div>
                  <span className="address-tag">Automated</span>
                </div>

                <div className="settings-card-body">
                  <p style={{ color: '#665f57', fontSize: '0.88rem', margin: '0 0 16px', lineHeight: 1.45 }}>
                    Configure how our clinical pharmacy and care team connect with you regarding active treatments.
                  </p>

                  <div className="notification-toggles-list">
                    <label className="notif-toggle-item">
                      <input
                        type="checkbox"
                        checked={profileForm.smsNotifications}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setProfileForm(prev => ({ ...prev, smsNotifications: val }));
                          if (onUpdateUser) {
                            onUpdateUser({ ...(currentUser || {}), ...profileForm, smsNotifications: val });
                          }
                          showToast(val ? 'SMS refill alerts enabled' : 'SMS refill alerts paused');
                        }}
                        className="notif-checkbox"
                      />
                      <div className="notif-toggle-text">
                        <strong>SMS Refill Reminders</strong>
                        <span>Receive SMS notifications 3 days before your formula compound ships</span>
                      </div>
                    </label>

                    <label className="notif-toggle-item">
                      <input
                        type="checkbox"
                        checked={profileForm.emailConsultations}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setProfileForm(prev => ({ ...prev, emailConsultations: val }));
                          if (onUpdateUser) {
                            onUpdateUser({ ...(currentUser || {}), ...profileForm, emailConsultations: val });
                          }
                          showToast(val ? 'Dermatology check-ins enabled' : 'Dermatology check-ins paused');
                        }}
                        className="notif-checkbox"
                      />
                      <div className="notif-toggle-text">
                        <strong>Provider Clinical Check-Ins</strong>
                        <span>Quarterly medical assessments & active strength adjustment invitations</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="hims-settings-card">
                <div className="settings-card-header">
                  <div className="settings-header-left">
                    <MapPin size={18} color="#8C6D53" />
                    <h3 className="settings-card-title">Default Shipping Address</h3>
                  </div>
                  <button
                    type="button"
                    className="settings-edit-btn"
                    onClick={() => setIsAddressModalOpen(true)}
                  >
                    <Edit3 size={15} />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="settings-card-body">
                  <div className="address-name">{shippingAddress.fullName}</div>
                  <div className="address-line">{shippingAddress.street}</div>
                  <div className="address-line">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</div>
                  <div className="address-phone">{shippingAddress.phone}</div>
                  <span className="address-tag">Default Delivery Destination</span>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="hims-settings-card">
                <div className="settings-card-header">
                  <div className="settings-header-left">
                    <CreditCard size={18} color="#8C6D53" />
                    <h3 className="settings-card-title">Payment & Billing</h3>
                  </div>
                  <button
                    type="button"
                    className="settings-edit-btn"
                    onClick={() => showToast('Payment method encrypted & updated')}
                  >
                    <Edit3 size={15} />
                    <span>Update</span>
                  </button>
                </div>

                <div className="settings-card-body">
                  <div className="payment-card-row">
                    <div className="card-brand-badge">Apple Pay</div>
                    <div className="card-number-mask">Connected via Apple Wallet (•••• 4242)</div>
                  </div>
                  <div className="billing-meta">Billed automatically on shipment date (${subscription.price}.00)</div>
                  <span className="address-tag">Encrypted 256-bit SSL</span>
                </div>
              </div>
            </div>

            {/* Logout Row */}
            <div className="hims-settings-logout-box" style={{ marginTop: 24 }}>
              <div>
                <h4 className="logout-title">Account Session</h4>
                <p className="logout-sub">Logged in as {currentUser.email}</p>
              </div>

              <button
                type="button"
                className="hims-btn-outline"
                onClick={() => {
                  onLogout();
                  onNavigateToLanding();
                }}
                style={{ color: '#dc2626', borderColor: '#fca5a5' }}
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: DELAY / SNOOZE NEXT REFILL */}
      {isSnoozeModalOpen && (
        <div className="hims-account-modal-overlay" role="dialog" aria-modal="true">
          <div className="hims-account-modal-card animate-fade-in">
            <div className="modal-header">
              <h3 className="modal-title">Reschedule Next Refill</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsSnoozeModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-desc">
                Current refill is scheduled for <strong>{subscription.nextRefillDate}</strong>. Still have product left? Delay your next bottle so you never get overwhelmed.
              </p>

              <div className="modal-snooze-options">
                <button
                  type="button"
                  className="snooze-choice-btn"
                  onClick={() => handleSnoozeDelivery(14)}
                >
                  <span>Delay 2 Weeks (+14 Days)</span>
                  <ChevronRight size={16} />
                </button>

                <button
                  type="button"
                  className="snooze-choice-btn recommended"
                  onClick={() => handleSnoozeDelivery(30)}
                >
                  <span>Delay 1 Month (+30 Days)</span>
                  <span className="badge">Most Popular</span>
                </button>

                <button
                  type="button"
                  className="snooze-choice-btn"
                  onClick={() => handleSnoozeDelivery(60)}
                >
                  <span>Delay 2 Months (+60 Days)</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADJUST FORMULA STRENGTH */}
      {isStrengthModalOpen && (
        <div className="hims-account-modal-overlay" role="dialog" aria-modal="true">
          <div className="hims-account-modal-card animate-fade-in">
            <div className="modal-header">
              <h3 className="modal-title">Request Formula Strength Change</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsStrengthModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleStrengthSubmit} className="modal-body">
              <p className="modal-desc">
                Our dermatologists formulate treatments based on your skin adaptation. Select the desired strength below:
              </p>

              <div className="strength-options-list">
                {[
                  { id: 'Tretinoin 0.018% + Niacinamide 4%', label: 'Gentle Starter (0.018%)', sub: 'For highly sensitive or easily flushed skin' },
                  { id: 'Tretinoin 0.025% + Niacinamide 4%', label: 'Balanced Standard (0.025%)', sub: 'Targeted cellular renewal • Proven results' },
                  { id: 'Tretinoin 0.05% + Niacinamide 4%', label: 'Advanced Strength (0.05%)', sub: 'For skin well-adapted to active retinoids' },
                  { id: 'Tretinoin 0.1% + Niacinamide 4%', label: 'Maximum Clinical (0.1%)', sub: 'Maximum cellular turnover for resistant concerns' }
                ].map((item) => (
                  <label key={item.id} className={`strength-option-label ${selectedStrength === item.id ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="strength"
                      checked={selectedStrength === item.id}
                      onChange={() => setSelectedStrength(item.id)}
                    />
                    <div className="strength-text">
                      <div className="strength-name">{item.label}</div>
                      <div className="strength-sub">{item.sub}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="hims-input-group" style={{ marginTop: 16 }}>
                <label className="hims-input-label">Formulation Adjustment Note (Optional):</label>
                <textarea
                  className="hims-auth-input"
                  rows={3}
                  placeholder="e.g. My skin has adapted completely without any dryness over the last 6 weeks."
                  value={strengthDoctorNote}
                  onChange={(e) => setStrengthDoctorNote(e.target.value)}
                  style={{ resize: 'none', height: 'auto', padding: 12 }}
                />
              </div>

              <div className="modal-footer-actions">
                <button
                  type="submit"
                  className="hims-btn-black"
                  style={{ width: '100%' }}
                  disabled={strengthRequested}
                >
                  {strengthRequested ? 'Updating Formulation...' : 'Save Formula Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PAUSE OR CANCEL SUBSCRIPTION */}
      {isPauseModalOpen && (
        <div className="hims-account-modal-overlay" role="dialog" aria-modal="true">
          <div className="hims-account-modal-card animate-fade-in">
            <div className="modal-header">
              <h3 className="modal-title">Pause or Cancel Plan</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsPauseModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-desc">
                Consistent retinoid application is key to collagen synthesis. Instead of canceling, you can pause refills for up to 3 months without losing your active prescription.
              </p>

              <div className="modal-snooze-options">
                <button
                  type="button"
                  className="snooze-choice-btn recommended"
                  onClick={() => {
                    handleSnoozeDelivery(60);
                    setIsPauseModalOpen(false);
                  }}
                >
                  <span>Pause for 2 Months (Keep Prescription)</span>
                  <span className="badge">Recommended</span>
                </button>

                <button
                  type="button"
                  className="snooze-choice-btn"
                  onClick={() => {
                    handleSnoozeDelivery(90);
                    setIsPauseModalOpen(false);
                  }}
                >
                  <span>Pause for 3 Months</span>
                  <ChevronRight size={16} />
                </button>

                <button
                  type="button"
                  className="hims-link-danger"
                  style={{ textAlign: 'center', display: 'block', margin: '18px auto 0' }}
                  onClick={() => handlePauseOrCancel(activeTargetSub.id, 'cancel')}
                >
                  Cancel auto-delivery completely
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT SHIPPING ADDRESS */}
      {isAddressModalOpen && (
        <div className="hims-account-modal-overlay" role="dialog" aria-modal="true">
          <div className="hims-account-modal-card animate-fade-in">
            <div className="modal-header">
              <h3 className="modal-title">Edit Shipping Address</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsAddressModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                try {
                  localStorage.setItem('lumiere_shipping_address', JSON.stringify(shippingAddress));
                } catch (err) { }
                setIsAddressModalOpen(false);
                showToast('Shipping address updated');
              }}
              className="modal-body"
            >
              <div className="hims-input-group">
                <label className="hims-input-label">Full Name</label>
                <input
                  type="text"
                  className="hims-auth-input"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="hims-input-group">
                <label className="hims-input-label">Street Address</label>
                <input
                  type="text"
                  className="hims-auth-input"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', gap: 10 }}>
                <div className="hims-input-group">
                  <label className="hims-input-label">City</label>
                  <input
                    type="text"
                    className="hims-auth-input"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    required
                  />
                </div>
                <div className="hims-input-group">
                  <label className="hims-input-label">State</label>
                  <input
                    type="text"
                    className="hims-auth-input"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    required
                  />
                </div>
                <div className="hims-input-group">
                  <label className="hims-input-label">ZIP Code</label>
                  <input
                    type="text"
                    className="hims-auth-input"
                    value={shippingAddress.zip}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer-actions">
                <button type="submit" className="hims-btn-black" style={{ width: '100%' }}>
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD NEW FORMULATION TO REGIMEN */}
      {isAddSubModalOpen && (
        <div className="hims-account-modal-overlay" role="dialog" aria-modal="true">
          <div className="hims-account-modal-card animate-fade-in" style={{ maxWidth: '640px', width: '92%' }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Subscribe Formulation to Regimen</h3>
                <p style={{ fontSize: '0.8rem', color: '#78716c', margin: '4px 0 0 0' }}>
                  Auto-ships every 30 days with member 15% discount and Free 2-Day Air.
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsAddSubModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {PRODUCTS.map((prod) => {
                const isSubbed = subscriptionsList.some(s => 
                  s.productId === prod.id || 
                  s.productName?.toLowerCase() === prod.title?.toLowerCase()
                );
                const subPrice = Math.round(prod.basePrice * 0.85 * 100) / 100;
                const prodImg = prod.cutoutImage || prod.image;

                return (
                  <div
                    key={prod.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '14px',
                      border: '1px solid #e7e0d6',
                      borderRadius: '14px',
                      background: isSubbed ? '#faf8f5' : '#ffffff',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ width: '56px', height: '56px', background: '#F9F6F0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', flexShrink: 0 }}>
                      <img src={prodImg} alt={prod.title} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111111' }}>{prod.title}</h4>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#8C6D53', background: '#F3ECE2', padding: '2px 8px', borderRadius: '9999px' }}>
                          {prod.category || 'Skincare'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#665f57', marginTop: '3px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {prod.activeFormula || prod.desc || prod.subtitle || 'Dermatologist formulation'}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#065f46', marginTop: '4px' }}>
                        ${subPrice.toFixed(2)}/refill <span style={{ textDecoration: 'line-through', color: '#a8a29e', fontSize: '0.74rem', fontWeight: 400 }}>${prod.basePrice}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isSubbed}
                      onClick={() => {
                        handleAddCompanionToRefill({
                          id: prod.id,
                          productId: prod.id,
                          title: prod.title,
                          price: prod.basePrice,
                          image: prodImg
                        });
                        setIsAddSubModalOpen(false);
                      }}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '9999px',
                        border: isSubbed ? '1px solid #dcd5cc' : 'none',
                        background: isSubbed ? '#f5f0eb' : '#111111',
                        color: isSubbed ? '#8c827a' : '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: isSubbed ? 'default' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        flexShrink: 0
                      }}
                    >
                      {isSubbed ? (
                        <>
                          <Check size={14} />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} />
                          <span>Subscribe</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
