// ponytail: ultra-responsive slide-out cart drawer with express 1-tap checkout
import React from 'react';
import { X, Trash2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQty, 
  onRemoveItem, 
  onTriggerCheckout 
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const freeShippingThreshold = 50;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <>
      <div className="cart-backdrop" onClick={onClose}></div>
      <div className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping Bag">
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <span>Your Bag</span>
            <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>
              ({cartItems.reduce((a, b) => a + b.qty, 0)} items)
            </span>
          </div>
          <button className="close-drawer-btn" onClick={onClose} title="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="shipping-meter">
          {amountToFreeShipping === 0 ? (
            <span>🎉 You unlocked <strong>FREE Priority 2-Day Air Shipping</strong>!</span>
          ) : (
            <span>Add <strong>${amountToFreeShipping.toFixed(2)}</strong> more for FREE 2-Day Air</span>
          )}
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Items List */}
        <div className="cart-items-scroll">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
              <p style={{ fontSize: '1rem', fontWeight: 600 }}>Your bag is empty.</p>
              <button 
                onClick={onClose}
                style={{ 
                  marginTop: 16, 
                  background: '#111827', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: 9999,
                  fontWeight: 700,
                  cursor: 'pointer' 
                }}
              >
                Explore Formulations
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item-row">
                <img src={item.image} alt={item.title} className="cart-item-thumb" />
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.title}</div>
                  <div className="cart-item-meta">
                    Size: {item.size} {item.isSubscription ? '• Subscribed (15% Off)' : ''}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </div>
                  <div className="cart-qty-row">
                    <div className="qty-stepper">
                      <button 
                        className="stepper-btn" 
                        onClick={() => onUpdateQty(item.id, item.qty - 1)}
                      >
                        -
                      </button>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.qty}</span>
                      <button 
                        className="stepper-btn" 
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="drawer-subtotal-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={14} color="#10b981" />
              <span>Taxes calculated at 1-tap checkout. Carbon-neutral shipping.</span>
            </div>

            {/* Express Checkout 1-Tap Buttons */}
            <div className="express-checkout-grid">
              <button 
                type="button"
                className="apple-pay-btn"
                onClick={() => onTriggerCheckout('apple')}
                id="drawer-apple-pay"
              >
                <span> Pay</span>
              </button>
              <button 
                type="button"
                className="shop-pay-btn"
                onClick={() => onTriggerCheckout('shop')}
                id="drawer-shop-pay"
              >
                <span>Shop Pay</span>
              </button>
            </div>

            <button 
              type="button"
              className="cta-button-main"
              onClick={() => onTriggerCheckout('standard')}
              style={{ padding: '14px 20px', fontSize: '0.95rem' }}
              id="drawer-checkout-btn"
            >
              <span>Instant Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
