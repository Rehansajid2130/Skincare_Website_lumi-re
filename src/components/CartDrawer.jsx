// ponytail: airy, spacious luxury DTC cart drawer with smooth steppers and 1-tap express checkout
import React from 'react';
import { X, Trash2, ShieldCheck, ArrowRight, Sparkles, Lock } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import AppleIcon from './AppleIcon';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onTriggerCheckout,
  onAddToCart
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const freeShippingThreshold = 50;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // ponytail: recommend the first product from catalog not yet in bag
  const upsellCandidate = PRODUCTS.find(p => !cartItems.some(item => item.productId === p.id || item.id.startsWith(p.id))) || PRODUCTS[3];

  return (
    <>
      <div className="cart-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping Bag">
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-group">
            <h2 className="cart-drawer-title">Shopping Bag</h2>
            <span className="cart-count-badge">{totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}</span>
          </div>
          <button
            type="button"
            className="close-drawer-btn"
            onClick={onClose}
            aria-label="Close shopping bag"
          >
            <X size={18} />
          </button>
        </div>



        {/* Items List (Scrollable Area) */}
        <div className="cart-items-scroll">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon-wrap">
                <Sparkles size={28} />
              </div>
              <h3 className="cart-empty-title">Your bag is empty</h3>
              <p className="cart-empty-desc">Explore our dermatologist-approved formulations to begin your routine.</p>
              <button
                type="button"
                className="hims-btn-black cart-empty-btn"
                onClick={onClose}
              >
                Shop Formulations
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    <div className="cart-item-thumb-box">
                      <img src={item.image} alt={item.title} className="cart-item-thumb" />
                    </div>

                    <div className="cart-item-details">
                      <div className="cart-item-top">
                        <h4 className="cart-item-name">{item.title}</h4>
                        <button
                          type="button"
                          className="cart-item-remove-btn"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remove ${item.title}`}
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="cart-item-meta">
                        <span>{item.size}</span>
                        {item.isSubscription && <span className="cart-sub-tag">15% Off Auto-Ship</span>}
                      </div>

                      <div className="cart-item-bottom">
                        <div className="qty-stepper">
                          <button
                            type="button"
                            className="stepper-btn"
                            onClick={() => onUpdateQty(item.id, item.qty - 1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="stepper-qty">{item.qty}</span>
                          <button
                            type="button"
                            className="stepper-btn"
                            onClick={() => onUpdateQty(item.id, item.qty + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="cart-item-price">
                          ${(item.price * item.qty).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 1-Click Routine Companion Upsell (Inside Scroll, Breathing Room) */}
              {upsellCandidate && onAddToCart && (
                <div className="cart-upsell-box">
                  <div className="cart-upsell-header">
                    <Sparkles size={12} />
                    <span>Complete Your Daily Protocol</span>
                  </div>
                  <div className="cart-upsell-body">
                    <div className="cart-upsell-thumb-wrap">
                      <img
                        src={upsellCandidate.cutoutImage || upsellCandidate.image}
                        alt={upsellCandidate.title}
                        className="cart-upsell-thumb"
                      />
                    </div>
                    <div className="cart-upsell-info">
                      <h5 className="cart-upsell-title">{upsellCandidate.title}</h5>
                      <span className="cart-upsell-price">${upsellCandidate.basePrice}</span>
                    </div>
                    <button
                      type="button"
                      className="cart-upsell-btn"
                      onClick={() => onAddToCart({
                        id: `${upsellCandidate.id}-standard-one`,
                        productId: upsellCandidate.id,
                        title: upsellCandidate.title,
                        size: 'Standard',
                        isSubscription: false,
                        price: upsellCandidate.basePrice,
                        image: upsellCandidate.cutoutImage || upsellCandidate.image,
                        qty: 1
                      })}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Anchored Clean Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="drawer-subtotal-row">
              <span className="subtotal-label">Subtotal</span>
              <span className="subtotal-amount">${subtotal.toFixed(2)}</span>
            </div>

            <div className="drawer-perk-note">
              <ShieldCheck size={14} className="perk-shield-icon" />
              <span>Carbon-neutral delivery • 30-day money-back guarantee</span>
            </div>

            {/* ponytail: single unified Checkout CTA */}
            <button
              type="button"
              className="cta-button-main single-pay-cta"
              onClick={() => onTriggerCheckout('standard')}
              id="drawer-checkout-btn"
            >
              <Lock size={15} />
              <span>Checkout • ${subtotal.toFixed(2)}</span>
              <ArrowRight size={16} />
            </button>

            {/* Subtle payment acceptance indicators */}
            <div className="cart-payment-methods-strip">
              <span className="accepted-label">Accepted:</span>
              <span className="method-pill-mini apple-pill">
                <AppleIcon size={12} />
                <span>Pay</span>
              </span>
              <span className="method-pill-mini">Shop Pay</span>
              <span className="method-pill-mini">Visa</span>
              <span className="method-pill-mini">Mastercard</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
