// ponytail: Order Confirmation view exactly matching reference images for desktop and mobile
import React from 'react';
import { Check, ArrowLeft, ShoppingBag } from 'lucide-react';
import serumCutoutImg from '../assets/serum_cutout.png';
import cleanserCutoutImg from '../assets/cleanser_cutout.png';

export default function OrderConfirmation({ 
  orderData, 
  onNavigateToLanding, 
  onNavigateToProduct 
}) {
  // Fallback items matching the user's reference layout
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

  const items = orderData?.items && orderData.items.length > 0 ? orderData.items : defaultItems;
  const orderNumber = orderData?.orderNumber || '2939993';
  
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1), 0);
  const tax = 0;
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <div className="order-confirm-page-container">
      {/* Back button */}
      <button 
        type="button" 
        className="order-confirm-back-btn"
        onClick={onNavigateToLanding}
      >
        <ArrowLeft size={16} />
        <span>Return to Store</span>
      </button>

      {/* Main Order Confirmation Card */}
      <div className="order-confirm-card">
        {/* Top Header Row */}
        <div className="order-confirm-header">
          <div className="order-confirm-check-badge">
            <Check size={20} strokeWidth={3} />
          </div>
          <div className="order-confirm-header-text">
            <h1 className="order-confirm-title">We received your order!</h1>
            <p className="order-confirm-sub">
              Your order #{orderNumber} is completed and ready to ship
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="order-confirm-divider" />

        {/* 2-Column Desktop Grid / 1-Column Mobile Layout */}
        <div className="order-confirm-grid">
          {/* Left Column: Order Details & Pricing */}
          <div className="order-details-col">
            <h3 className="order-details-heading">Order Details</h3>

            {/* Item List */}
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
                      {item.variant || (item.size ? `${item.size} • ${item.isSubscription ? 'Subscribe & Save' : 'One-time'}` : 'Standard Routine')}
                    </p>
                    {/* ponytail: format currency with .toFixed(2) to prevent IEEE-754 precision artifacts */}
                    <span className="order-item-price">${(Number(item.price) || 0).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary Breakdown */}
            <div className="order-summary-breakdown">
              <div className="order-summary-row">
                <span className="order-summary-label">Subtotal</span>
                <span className="order-summary-val">${subtotal.toFixed(2)}</span>
              </div>
              <div className="order-summary-row">
                <span className="order-summary-label">Tax</span>
                <span className="order-summary-val">${tax.toFixed(2)}</span>
              </div>
              <div className="order-summary-row">
                <span className="order-summary-label">Shipping</span>
                <span className="order-summary-val">${shipping.toFixed(2)}</span>
              </div>
              <div className="order-summary-row order-summary-total">
                <span className="order-summary-total-label">Total</span>
                <span className="order-summary-total-val">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Column (Stacks below on mobile): Address & Payment Info */}
          <div className="order-info-panel">
            {/* Shipping Address */}
            <div className="order-info-section">
              <h4 className="order-info-heading">Shipping Address</h4>
              <div className="order-info-body">
                <p className="order-info-name">Wilson Baker</p>
                <p className="order-info-address">
                  4517 Washington Ave. Manchester,<br />
                  Kentucky 39495, USA
                </p>
              </div>
            </div>

            {/* Billing Address */}
            <div className="order-info-section">
              <h4 className="order-info-heading">Billing Address</h4>
              <div className="order-info-body">
                <p className="order-info-name">Wilson Baker</p>
                <p className="order-info-address">
                  4517 Washington Ave. Manchester,<br />
                  Kentucky 39495, USA
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="order-info-section">
              <h4 className="order-info-heading">Payment Info</h4>
              <div className="order-info-body">
                <p className="order-info-meta">Credit Card</p>
                <p className="order-info-meta">VISA</p>
                <p className="order-info-meta">**** 4660</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
