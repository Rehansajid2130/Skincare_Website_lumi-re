// ponytail: Order Confirmation & Live Parcel Tracking view matching DTC standards and surpassing legacy tracking.html
import React, { useState } from 'react';
import { Check, ArrowLeft, ShoppingBag, Truck, Search, Package, MapPin, ChevronDown, ChevronUp, ShieldCheck, Clock } from 'lucide-react';
import serumCutoutImg from '../assets/serum_cutout.png';
import cleanserCutoutImg from '../assets/cleanser_cutout.png';

export default function OrderConfirmation({ 
  orderData, 
  onNavigateToLanding, 
  onNavigateToProduct 
}) {
  const defaultItems = [
    {
      id: 'custom-anti-aging-serum',
      title: 'Custom Anti-Aging Serum',
      variant: 'Standard (30ml) • Daily Active Routine',
      price: 48,
      image: serumCutoutImg
    },
    {
      id: 'high-tide-cleanser',
      title: 'High Tide Cleanser',
      variant: 'Full Size (200ml) • Gentle Cleansing Wash',
      price: 15,
      image: cleanserCutoutImg
    }
  ];

  const [lookupQuery, setLookupQuery] = useState('');
  const [activeOrderNum, setActiveOrderNum] = useState(orderData?.orderNumber || '2939993');
  const [openFaq, setOpenFaq] = useState(null);

  const items = orderData?.items && orderData.items.length > 0 ? orderData.items : defaultItems;
  const orderNumber = activeOrderNum;
  
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1), 0);
  const tax = 0;
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const handleLookup = (e) => {
    e.preventDefault();
    if (lookupQuery.trim()) {
      setActiveOrderNum(lookupQuery.trim());
    }
  };

  const trackingSteps = [
    { title: 'Order Authorized', date: 'Sep 13, 10:14 AM', status: 'completed' },
    { title: 'Clinical Compounding', date: 'Sep 13, 2:30 PM', status: 'completed' },
    { title: 'Dispatched from Lab', date: 'Sep 14, 8:45 AM', status: 'completed' },
    { title: 'In Transit (FedEx Air Hub)', date: 'Sep 15, 6:12 PM', status: 'current' },
    { title: 'Out for Delivery', date: 'Est. Tomorrow by 4:30 PM', status: 'upcoming' }
  ];

  const faqs = [
    {
      q: 'Do I need to sign for prescription deliveries?',
      a: 'No signature is required for standard residential delivery. Our courier will leave your discreet package in your mailbox or sheltered front porch area.'
    },
    {
      q: 'How are temperature-sensitive serums packaged?',
      a: 'All custom formulations are packaged in UV-protective amber containers with dual-sealed thermal insulation to protect active retinoids and peptides during transit.'
    },
    {
      q: 'Can I redirect my delivery to a FedEx Hold at Location?',
      a: 'Yes, once your parcel arrives at your regional hub, you can use your FedEx tracking number to request a hold at any local Walgreens or FedEx Office location for up to 5 business days.'
    }
  ];

  return (
    <div className="order-confirm-page-container animate-fade-in">
      {/* Top Bar: Return to Store & Quick Tracker Lookup */}
      <div className="order-confirm-top-bar">
        <button 
          type="button" 
          className="order-confirm-back-btn"
          onClick={onNavigateToLanding}
        >
          <ArrowLeft size={16} />
          <span>Return to Storefront</span>
        </button>

        {/* Live Parcel Lookup Widget (replaces legacy tracking search box) */}
        <form className="order-lookup-form" onSubmit={handleLookup}>
          <Search size={15} className="lookup-icon" />
          <input
            type="text"
            className="order-lookup-input"
            placeholder="Track another Order #..."
            value={lookupQuery}
            onChange={(e) => setLookupQuery(e.target.value)}
          />
          <button type="submit" className="order-lookup-btn">Track</button>
        </form>
      </div>

      {/* Main Order Confirmation & Status Card */}
      <div className="order-confirm-card">
        {/* Header Row */}
        <div className="order-confirm-header">
          <div className="order-confirm-check-badge">
            <Check size={20} strokeWidth={3} />
          </div>
          <div className="order-confirm-header-text">
            <h1 className="order-confirm-title">Order Status: In Transit</h1>
            <p className="order-confirm-sub">
              Order <strong>#{orderNumber}</strong> • FedEx Priority 2-Day Air • Tracking: <strong>FDX-8821-9923841</strong>
            </p>
          </div>
        </div>

        {/* Live Logistics Visual Stepper (replaces legacy tracking timeline) */}
        <div className="order-tracking-timeline-box">
          <div className="timeline-header-meta">
            <div className="meta-carrier">
              <Truck size={16} />
              <span>FedEx Priority 2-Day Air</span>
            </div>
            <div className="meta-eta">
              <Clock size={16} />
              <span>Estimated Delivery: <strong>Tomorrow by 4:30 PM</strong></span>
            </div>
          </div>

          <div className="stepper-track-wrap">
            <div className="stepper-progress-bar" style={{ width: '75%' }} />
            <div className="stepper-nodes">
              {trackingSteps.map((step, idx) => (
                <div key={idx} className={`stepper-node ${step.status}`}>
                  <div className="node-dot">
                    {step.status === 'completed' && <Check size={12} strokeWidth={3} />}
                  </div>
                  <div className="node-label">{step.title}</div>
                  <div className="node-date">{step.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="order-confirm-divider" />

        {/* 2-Column Grid: Left = Items & Financials; Right = Shipping Address & Payment */}
        <div className="order-confirm-grid">
          {/* Left Column: Order Details */}
          <div className="order-details-col">
            <h3 className="order-details-heading">Formulations In This Shipment</h3>

            <div className="order-items-list">
              {items.map((item, index) => (
                <div key={item.id || index} className="order-item-row">
                  <div className="order-item-img-box">
                    <img 
                      src={item.image || item.cutoutImage || serumCutoutImg} 
                      alt={item.title} 
                      className="order-item-img"
                    />
                  </div>
                  <div className="order-item-info">
                    <h4 className="order-item-name">{item.title}</h4>
                    <p className="order-item-variant">
                      {item.variant || (item.size ? `${item.size} • ${item.isSubscription ? 'Subscribe & Save' : 'Standard Routine'}` : 'Standard Routine')}
                    </p>
                    <span className="order-item-price">${(Number(item.price) || 0).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="order-summary-breakdown">
              <div className="order-summary-row">
                <span className="order-summary-label">Subtotal</span>
                <span className="order-summary-val">${subtotal.toFixed(2)}</span>
              </div>
              <div className="order-summary-row">
                <span className="order-summary-label">Estimated Tax</span>
                <span className="order-summary-val">${tax.toFixed(2)}</span>
              </div>
              <div className="order-summary-row">
                <span className="order-summary-label">FedEx 2-Day Air</span>
                <span className="order-summary-val">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="order-summary-row order-summary-total">
                <span className="order-summary-total-label">Total Paid</span>
                <span className="order-summary-total-val">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Address & Verification Info */}
          <div className="order-info-panel">
            <div className="order-info-section">
              <h4 className="order-info-heading">Shipping Destination</h4>
              <div className="order-info-body">
                <p className="order-info-name">Wilson Baker</p>
                <p className="order-info-address">
                  4517 Washington Ave. Suite 12B<br />
                  Manchester, Kentucky 39495, USA
                </p>
                <div className="carrier-badge-chip">
                  <MapPin size={13} />
                  <span>Carrier Hub: Louisville Distribution Facility</span>
                </div>
              </div>
            </div>

            <div className="order-info-section">
              <h4 className="order-info-heading">Payment & Verification</h4>
              <div className="order-info-body">
                <p className="order-info-meta">
                  <strong>{orderData?.paymentResult?.brand || 'Credit Card'}</strong> ending in <strong>{orderData?.paymentResult?.last4 || '4242'}</strong>
                </p>
                <p className="order-info-meta" style={{ color: '#059669', fontWeight: 600 }}>
                  ● Payment Captured (Status: Succeeded)
                </p>
                {orderData?.paymentResult?.transactionId && (
                  <p className="order-info-meta" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    Tx ID: {orderData.paymentResult.transactionId}
                  </p>
                )}
                {orderData?.paymentResult?.idempotencyKey && (
                  <p className="order-info-meta" style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#6B7280' }}>
                    Idempotency: {orderData.paymentResult.idempotencyKey}
                  </p>
                )}
                <p className="order-info-meta">Receipt emailed to: <strong>elena.rostova@gmail.com</strong></p>
              </div>
            </div>

            <div className="order-info-section">
              <h4 className="order-info-heading">Need Support?</h4>
              <div className="order-info-body">
                <p style={{ fontSize: '0.84rem', color: '#6b7280', lineHeight: 1.5 }}>
                  Our concierge dermatological support team is on standby 7 days a week.
                </p>
                <a href="mailto:support@lumiere.com" className="support-link-btn">
                  Contact Clinical Concierge &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery FAQs Accordion (replaces legacy tracking FAQ table) */}
        <div className="order-faqs-section">
          <h3 className="faqs-title">Frequently Asked Delivery Questions</h3>
          <div className="faqs-list">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openFaq === i && (
                  <p className="faq-answer-text animate-fade-in">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
