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
import sunscreenCutoutImg from '../assets/sunscreen_cutout.png';
import cleanserCutoutImg from '../assets/cleanser_cutout.png';

export default function AccountPortal({
  currentUser,
  onOpenAuth,
  onLogout,
  onNavigateToLanding,
  onNavigateToProduct,
  onNavigateToOrder,
  onOpenQuiz,
  onAddToCart
}) {
  const [activeTab, setActiveTab] = useState('subscriptions'); // 'subscriptions' | 'orders' | 'skin-profile' | 'settings'
  
  // Subscription state from localStorage or initial defaults
  const [subscription, setSubscription] = useState(() => {
    try {
      const saved = localStorage.getItem('lumiere_active_subscription');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      id: 'sub_lm_92810',
      status: 'Active',
      productName: 'Custom Anti-Aging Serum',
      formulaCode: 'Formula #LM-924',
      strength: 'Tretinoin 0.025% + Niacinamide 4%',
      price: 48,
      frequencyDays: 30,
      nextRefillDate: 'October 12, 2026',
      companionAddons: []
    };
  });

  // Modal controls
  const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);
  const [isStrengthModalOpen, setIsStrengthModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Strength adjustment state
  const [selectedStrength, setSelectedStrength] = useState(subscription.strength);
  const [strengthDoctorNote, setStrengthDoctorNote] = useState('');
  const [strengthRequested, setStrengthRequested] = useState(false);

  // Address state
  const [shippingAddress, setShippingAddress] = useState(() => {
    try {
      const saved = localStorage.getItem('lumiere_shipping_address');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
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

  const saveSubscription = (updated) => {
    setSubscription(updated);
    try {
      localStorage.setItem('lumiere_active_subscription', JSON.stringify(updated));
    } catch (e) {}
  };

  // Snooze next delivery by 30 days
  const handleSnoozeDelivery = (days = 30) => {
    // Calculate new date
    const currentDate = new Date(subscription.nextRefillDate.replace(/(\w+)\s(\d+),\s(\d+)/, '$1 $2, $3'));
    const validDate = isNaN(currentDate.getTime()) ? new Date() : currentDate;
    validDate.setDate(validDate.getDate() + days);
    
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const newDateStr = validDate.toLocaleDateString('en-US', options);

    const updated = {
      ...subscription,
      nextRefillDate: newDateStr
    };
    saveSubscription(updated);
    setIsSnoozeModalOpen(false);
    showToast(`Refill postponed to ${newDateStr}`);
  };

  // Change frequency (e.g. 30, 60, 90)
  const handleChangeFrequency = (days) => {
    const updated = { ...subscription, frequencyDays: days };
    saveSubscription(updated);
    showToast(`Delivery frequency updated to every ${days} days`);
  };

  // Submit strength adjustment request to Dr. Jenkins
  const handleStrengthSubmit = (e) => {
    e.preventDefault();
    setStrengthRequested(true);
    setTimeout(() => {
      const updated = { ...subscription, strength: selectedStrength };
      saveSubscription(updated);
      setIsStrengthModalOpen(false);
      setStrengthRequested(false);
      showToast('Strength adjustment submitted to Dr. Sarah Jenkins for approval');
    }, 900);
  };

  // Quick add companion to next refill
  const handleAddCompanionToRefill = (product) => {
    const exists = subscription.companionAddons?.some(p => p.id === product.id);
    if (exists) {
      showToast(`${product.title} is already added to your next shipment`);
      return;
    }
    const updated = {
      ...subscription,
      companionAddons: [...(subscription.companionAddons || []), product]
    };
    saveSubscription(updated);
    showToast(`Added ${product.title} to your next shipment (+$${product.price})`);
  };

  const handleRemoveCompanion = (productId) => {
    const updated = {
      ...subscription,
      companionAddons: subscription.companionAddons.filter(p => p.id !== productId)
    };
    saveSubscription(updated);
    showToast('Removed companion add-on from next shipment');
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
            <span>Shipping & Billing</span>
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

              <div className="panel-header-badges">
                <span className="refill-counter-badge">
                  <Calendar size={14} />
                  <span>Next Refill: <strong>{subscription.nextRefillDate}</strong></span>
                </span>
              </div>
            </div>

            {/* Primary Subscription Card */}
            <div className="hims-sub-card">
              <div className="hims-sub-card-left">
                <div className="hims-sub-img-wrap">
                  <img src={serumCutoutImg} alt={subscription.productName} className="product-cutout-img" />
                </div>
              </div>

              <div className="hims-sub-card-center">
                <div className="hims-sub-badge-row">
                  <span className="hims-rx-tag">{subscription.formulaCode}</span>
                  <span className="hims-status-tag active">Status: {subscription.status}</span>
                </div>
                <h3 className="hims-sub-title">{subscription.productName}</h3>
                <div className="hims-sub-formula-spec">
                  <strong>ACTIVE DOSAGE:</strong> {subscription.strength}
                </div>
                <p className="hims-sub-explanation">
                  Formulated to target fine lines, cellular density, and micro-texture. Formulated fresh in California 48 hours prior to delivery.
                </p>

                <div className="hims-sub-meta-row">
                  <div className="sub-meta-item">
                    <span className="meta-label">Schedule:</span>
                    <span className="meta-value">Every {subscription.frequencyDays} Days</span>
                  </div>
                  <div className="sub-meta-item">
                    <span className="meta-label">Price:</span>
                    <span className="meta-value">${subscription.price} / refill</span>
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
                    onClick={() => setIsSnoozeModalOpen(true)}
                  >
                    <Clock size={16} />
                    <span>Delay / Snooze (+30 Days)</span>
                  </button>

                  <button 
                    type="button" 
                    className="hims-btn-outline sub-action-btn"
                    onClick={() => setIsStrengthModalOpen(true)}
                  >
                    <Sliders size={16} />
                    <span>Adjust Formula Strength</span>
                  </button>

                  <div className="frequency-toggle-wrapper">
                    <span className="freq-label">Refill Frequency:</span>
                    <div className="freq-pill-group">
                      {[30, 60, 90].map((days) => (
                        <button
                          key={days}
                          type="button"
                          className={`freq-pill ${subscription.frequencyDays === days ? 'active' : ''}`}
                          onClick={() => handleChangeFrequency(days)}
                        >
                          {days}d
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="button" 
                    className="hims-link-danger"
                    onClick={() => setIsPauseModalOpen(true)}
                  >
                    Pause or Cancel Subscription
                  </button>
                </div>
              </div>
            </div>

            {/* Companion Products In Next Delivery */}
            {subscription.companionAddons && subscription.companionAddons.length > 0 && (
              <div className="companion-shipment-block">
                <h4 className="companion-block-title">Additional Items In Your Next Refill ({subscription.nextRefillDate}):</h4>
                <div className="companion-addons-list">
                  {subscription.companionAddons.map((item) => (
                    <div key={item.id} className="companion-addon-chip">
                      <img src={item.image} alt={item.title} className="chip-img" />
                      <div className="chip-info">
                        <span className="chip-title">{item.title}</span>
                        <span className="chip-price">+${item.price}</span>
                      </div>
                      <button 
                        type="button" 
                        className="chip-remove-btn"
                        onClick={() => handleRemoveCompanion(item.id)}
                        aria-label="Remove item"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Companion Refill Add-ons */}
            <div className="hims-sub-addons-section">
              <div className="addons-header-row">
                <h3 className="addons-title">Enhance Your Next Refill Shipment</h3>
                <span className="addons-tag">Subscriber Exclusive: 20% Off • Ships in Same Box</span>
              </div>

              <div className="addons-cards-grid">
                <div className="addon-product-card">
                  <div className="addon-img-box">
                    <img src={creamCutoutImg} alt="Goodnight Wrinkle Cream" className="product-cutout-img" />
                  </div>
                  <div className="addon-card-details">
                    <span className="addon-step-label">NIGHT COMPANION</span>
                    <h4 className="addon-prod-title">Goodnight Wrinkle Cream</h4>
                    <p className="addon-prod-desc">Locks in moisture barrier and prevents retinoid flaking.</p>
                    <div className="addon-bottom-row">
                      <div className="addon-price">$24 <span>$30</span></div>
                      <button 
                        type="button" 
                        className="addon-add-btn"
                        onClick={() => handleAddCompanionToRefill({
                          id: 'goodnight-wrinkle-cream',
                          title: 'Goodnight Wrinkle Cream',
                          price: 24,
                          image: creamCutoutImg
                        })}
                      >
                        <Plus size={15} />
                        <span>Add to Next Refill</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="addon-product-card">
                  <div className="addon-img-box">
                    <img src={sunscreenCutoutImg} alt="Daily Mineral Defense SPF 30" className="product-cutout-img" />
                  </div>
                  <div className="addon-card-details">
                    <span className="addon-step-label">MORNING DEFENSE</span>
                    <h4 className="addon-prod-title">Daily Mineral Shield SPF 30</h4>
                    <p className="addon-prod-desc">Non-greasy, 100% invisible UV shield for retinoid-treated skin.</p>
                    <div className="addon-bottom-row">
                      <div className="addon-price">$22 <span>$28</span></div>
                      <button 
                        type="button" 
                        className="addon-add-btn"
                        onClick={() => handleAddCompanionToRefill({
                          id: 'daily-mineral-defense-spf30',
                          title: 'Daily Mineral Shield SPF 30',
                          price: 22,
                          image: sunscreenCutoutImg
                        })}
                      >
                        <Plus size={15} />
                        <span>Add to Next Refill</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="addon-product-card">
                  <div className="addon-img-box">
                    <img src={cleanserCutoutImg} alt="Gentle Squalane Cleanser" className="product-cutout-img" />
                  </div>
                  <div className="addon-card-details">
                    <span className="addon-step-label">DAILY CLEANSER</span>
                    <h4 className="addon-prod-title">Gentle Squalane Cleanser</h4>
                    <p className="addon-prod-desc">Hydrating non-foaming wash that maintains natural lipids.</p>
                    <div className="addon-bottom-row">
                      <div className="addon-price">$18 <span>$24</span></div>
                      <button 
                        type="button" 
                        className="addon-add-btn"
                        onClick={() => handleAddCompanionToRefill({
                          id: 'gentle-squalane-cleanser',
                          title: 'Gentle Squalane Cleanser',
                          price: 18,
                          image: cleanserCutoutImg
                        })}
                      >
                        <Plus size={15} />
                        <span>Add to Next Refill</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER HISTORY & TRACKING */}
        {activeTab === 'orders' && (
          <div className="hims-account-tab-panel animate-fade-in">
            <div className="panel-header-row">
              <div>
                <h2 className="panel-section-title">Order History & Shipment Status</h2>
                <p className="panel-section-desc">
                  Review all previous shipments, track live 2-Day Air deliveries, and view invoices.
                </p>
              </div>
            </div>

            <div className="hims-orders-list">
              {/* Order 1: Most recent active */}
              <div className="hims-order-card">
                <div className="order-card-header">
                  <div className="order-meta-col">
                    <span className="order-number-label">ORDER #2939993</span>
                    <span className="order-date-text">Placed September 9, 2026</span>
                  </div>
                  <div className="order-status-badge in-transit">
                    <Truck size={14} />
                    <span>In Transit • Arriving Tomorrow</span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-items-preview">
                    <div className="order-item-thumb">
                      <img src={serumCutoutImg} alt="Custom Serum" />
                      <div className="order-thumb-details">
                        <div className="thumb-title">Custom Anti-Aging Serum (30ml)</div>
                        <div className="thumb-sub">Rx Formula #LM-924 • Monthly Subscription</div>
                      </div>
                    </div>

                    <div className="order-item-thumb">
                      <img src={creamCutoutImg} alt="Goodnight Wrinkle Cream" />
                      <div className="order-thumb-details">
                        <div className="thumb-title">Goodnight Wrinkle Cream (50ml)</div>
                        <div className="thumb-sub">Barrier Recovery Step • Auto-Delivery</div>
                      </div>
                    </div>
                  </div>

                  <div className="order-pricing-summary">
                    <div className="pricing-line">
                      <span>Total Paid:</span>
                      <strong>$72.00</strong>
                    </div>
                    <div className="shipping-line">Paid with Apple Pay • Free 2-Day Air</div>
                  </div>
                </div>

                <div className="order-card-footer">
                  <button 
                    type="button" 
                    className="hims-btn-black order-action-btn"
                    onClick={() => {
                      if (onNavigateToOrder) onNavigateToOrder();
                    }}
                  >
                    <Truck size={15} />
                    <span>Track 2-Day Air Shipment</span>
                  </button>

                  <button 
                    type="button" 
                    className="hims-btn-outline order-action-btn"
                    onClick={() => showToast('Receipt #2939993 downloaded to device')}
                  >
                    Download Invoice (PDF)
                  </button>
                </div>
              </div>

              {/* Order 2: Past shipment */}
              <div className="hims-order-card">
                <div className="order-card-header">
                  <div className="order-meta-col">
                    <span className="order-number-label">ORDER #2819441</span>
                    <span className="order-date-text">Delivered August 9, 2026</span>
                  </div>
                  <div className="order-status-badge delivered">
                    <Check size={14} strokeWidth={3} />
                    <span>Delivered & Verified</span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-items-preview">
                    <div className="order-item-thumb">
                      <img src={serumCutoutImg} alt="Custom Serum" />
                      <div className="order-thumb-details">
                        <div className="thumb-title">Custom Anti-Aging Serum (30ml)</div>
                        <div className="thumb-sub">Initial Diagnostic Starter Set</div>
                      </div>
                    </div>
                  </div>

                  <div className="order-pricing-summary">
                    <div className="pricing-line">
                      <span>Total Paid:</span>
                      <strong>$48.00</strong>
                    </div>
                    <div className="shipping-line">Free 2-Day Air Delivery</div>
                  </div>
                </div>

                <div className="order-card-footer">
                  <button 
                    type="button" 
                    className="hims-btn-outline order-action-btn"
                    onClick={() => showToast('Receipt #2819441 downloaded to device')}
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

        {/* TAB 4: SHIPPING & BILLING SETTINGS */}
        {activeTab === 'settings' && (
          <div className="hims-account-tab-panel animate-fade-in">
            <div className="panel-header-row">
              <div>
                <h2 className="panel-section-title">Shipping & Payment Settings</h2>
                <p className="panel-section-desc">
                  Manage your verified delivery address, payment methods, and account security.
                </p>
              </div>
            </div>

            <div className="hims-settings-grid">
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
                    onClick={() => showToast('Payment details updated securely')}
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
            <div className="hims-settings-logout-box">
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
                <span>Log Out of Lumière</span>
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
                  onClick={() => {
                    const updated = { ...subscription, status: 'Paused' };
                    saveSubscription(updated);
                    setIsPauseModalOpen(false);
                    showToast('Subscription safely paused. Reactivate anytime.');
                  }}
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
                } catch (err) {}
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

    </div>
  );
}
