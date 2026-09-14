// ponytail: luxury DTC checkout sheet with selectable payment method (Apple Pay, Shop Pay, Card)
import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck, X, Sparkles, Truck, Lock, CreditCard } from 'lucide-react';
import AppleIcon from './AppleIcon';

export default function InstantCheckoutModal({
  isOpen,
  onClose,
  cartItems = [],
  checkoutMethod: initialMethod = 'apple',
  onOrderComplete
}) {
  const [stage, setStage] = useState('review'); // 'review' | 'processing' | 'confirmed'
  const [selectedMethod, setSelectedMethod] = useState(initialMethod);

  // Sync state whenever modal opens or initialMethod changes
  useEffect(() => {
    if (isOpen) {
      setStage('review');
      setSelectedMethod(initialMethod || 'apple');
    }
  }, [isOpen, initialMethod]);

  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleAuthorize = () => {
    setStage('processing');
    setTimeout(() => {
      setStage('confirmed');
    }, 700);
  };

  const handleFinish = () => {
    onOrderComplete && onOrderComplete({
      items: cartItems.length > 0 ? [...cartItems] : null,
      orderNumber: 'LUM-' + Math.floor(100000 + Math.random() * 900000),
      total: total,
      method: selectedMethod
    });
    setStage('review');
    onClose();
  };

  return (
    <div className="checkout-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="checkout-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sheet-header">
          <div className="sheet-title-group">
            <span className="method-brand-name standard">Secure Checkout</span>
            <span className="sheet-subtitle">Instant 256-Bit Encrypted Order</span>
          </div>
          <button
            type="button"
            className="sheet-close-btn"
            onClick={onClose}
            aria-label="Close checkout"
          >
            <X size={18} />
          </button>
        </div>

        {/* STAGE 1: REVIEW & PAYMENT SELECTION */}
        {stage === 'review' && (
          <div className="checkout-body">
            {/* Delivery Destination */}
            <div className="checkout-info-card">
              <div className="info-card-header">
                <span className="info-card-label">SHIPPING ADDRESS</span>
                <span className="info-card-edit">Auto-Filled</span>
              </div>
              <div className="info-card-name">Elena Rostova</div>
              <div className="info-card-address">742 Park Avenue, Suite 12B, New York, NY 10021</div>
              <div className="shipping-badge-pill">
                <Truck size={13} />
                <span>FedEx Priority Air (2 Business Days) • FREE</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="checkout-info-card">
              <div className="info-card-header">
                <span className="info-card-label">SELECT PAYMENT METHOD</span>
                <span className="payment-secure-tag">
                  <Lock size={12} />
                  <span>Encrypted</span>
                </span>
              </div>
              
              <div className="payment-options-grid">
                {/* Apple Pay Option */}
                <button
                  type="button"
                  className={`payment-option-tile ${selectedMethod === 'apple' ? 'active' : ''}`}
                  onClick={() => setSelectedMethod('apple')}
                >
                  <div className="option-tile-head">
                    <span className="payment-icon-pill apple">
                      <AppleIcon size={13} />
                      <span>Pay</span>
                    </span>
                    <span className="option-tile-radio" />
                  </div>
                  <div className="option-tile-info">
                    <div className="payment-title">Apple Pay</div>
                    <div className="payment-sub">Mastercard •••• 9841</div>
                  </div>
                </button>

                {/* Shop Pay Option */}
                <button
                  type="button"
                  className={`payment-option-tile ${selectedMethod === 'shop' ? 'active' : ''}`}
                  onClick={() => setSelectedMethod('shop')}
                >
                  <div className="option-tile-head">
                    <span className="payment-icon-pill shop">Shop Pay</span>
                    <span className="option-tile-radio" />
                  </div>
                  <div className="option-tile-info">
                    <div className="payment-title">Shop Pay</div>
                    <div className="payment-sub">Verified •••• 5120</div>
                  </div>
                </button>

                {/* Credit Card Option */}
                <button
                  type="button"
                  className={`payment-option-tile ${selectedMethod === 'card' || selectedMethod === 'standard' ? 'active' : ''}`}
                  onClick={() => setSelectedMethod('card')}
                >
                  <div className="option-tile-head">
                    <span className="payment-icon-pill standard"><CreditCard size={14} /> Card</span>
                    <span className="option-tile-radio" />
                  </div>
                  <div className="option-tile-info">
                    <div className="payment-title">Credit Card</div>
                    <div className="payment-sub">Visa •••• 4022</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Mini Order Summary */}
            <div className="checkout-summary-strip">
              <div className="summary-strip-row">
                <span>Items Subtotal ({cartItems.reduce((a, b) => a + b.qty, 0)})</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="summary-strip-row">
                <span>Priority 2-Day Air</span>
                <span className="free-tag">FREE</span>
              </div>
              <div className="summary-strip-total">
                <span>Total Charge:</span>
                <span className="total-number">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Single Action Button adapting to selected method */}
            {selectedMethod === 'apple' && (
              <button
                type="button"
                className="apple-pay-btn checkout-pay-btn"
                onClick={handleAuthorize}
                id="confirm-apple-pay-btn"
              >
                <AppleIcon size={18} />
                <span>Pay with Apple Pay • ${total.toFixed(2)}</span>
              </button>
            )}

            {selectedMethod === 'shop' && (
              <button
                type="button"
                className="shop-pay-btn checkout-pay-btn"
                onClick={handleAuthorize}
                id="confirm-shop-pay-btn"
              >
                <span>Pay with Shop Pay • ${total.toFixed(2)}</span>
              </button>
            )}

            {(selectedMethod === 'card' || selectedMethod === 'standard') && (
              <button
                type="button"
                className="cta-button-main checkout-pay-btn"
                onClick={handleAuthorize}
                id="confirm-standard-checkout-btn"
              >
                <Lock size={16} />
                <span>Complete Order • ${total.toFixed(2)}</span>
              </button>
            )}
          </div>
        )}

        {/* STAGE 2: PROCESSING */}
        {stage === 'processing' && (
          <div className="face-id-indicator">
            <div className="face-id-icon-circle">
              <Sparkles size={32} />
            </div>
            <h3 className="processing-title">Authorizing 1-Tap Payment...</h3>
            <p className="processing-sub">Sub-second biometric tokenization & secure confirmation</p>
          </div>
        )}

        {/* STAGE 3: ORDER CONFIRMED */}
        {stage === 'confirmed' && (
          <div className="order-confirmed-sheet">
            <div className="confirmed-icon-circle">
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>
            <h3 className="confirmed-title">Order Confirmed!</h3>
            <p className="confirmed-desc">
              Your order <strong>#LUM-2026-9812</strong> has been authorized. A receipt and real-time FedEx tracking link were sent to your email.
            </p>

            <button
              type="button"
              className="cta-button-main confirmed-finish-btn"
              onClick={handleFinish}
            >
              View Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
