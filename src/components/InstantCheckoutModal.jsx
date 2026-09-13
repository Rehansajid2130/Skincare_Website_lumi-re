// ponytail: 1-Tap checkout sheet simulator highlighting lightning speed vs legacy friction
import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, X, Sparkles, Truck } from 'lucide-react';

export default function InstantCheckoutModal({ 
  isOpen, 
  onClose, 
  cartItems, 
  onOrderComplete 
}) {
  const [stage, setStage] = useState('review'); // 'review' | 'processing' | 'confirmed'

  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleAuthorize = () => {
    setStage('processing');
    setTimeout(() => {
      setStage('confirmed');
    }, 600);
  };

  const handleFinish = () => {
    onOrderComplete && onOrderComplete({
      items: cartItems.length > 0 ? [...cartItems] : null,
      orderNumber: '2939993',
      total: total
    });
    setStage('review');
    onClose();
  };

  return (
    <div className="checkout-modal-backdrop">
      <div className="checkout-sheet">
        <div className="sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}> Pay</span>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>1-Tap Express Authorization</span>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
          >
            <X size={20} />
          </button>
        </div>

        {stage === 'review' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Express Address Card */}
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>SHIP TO:</div>
              <div>Elena Vance</div>
              <div style={{ color: '#64748b' }}>742 Park Avenue, Suite 12B, New York, NY 10021</div>
              <div style={{ color: '#059669', fontWeight: 600, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Truck size={14} />
                <span>FedEx Priority Air (2 Business Days) • FREE</span>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>PAY WITH:</div>
                <div style={{ color: '#64748b' }}>Apple Card (Mastercard •••• 9841)</div>
              </div>
              <span style={{ color: '#10b981', fontWeight: 700 }}>Verified</span>
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 10, borderTop: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Charge:</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>${total.toFixed(2)}</span>
            </div>

            {/* Action */}
            <button 
              type="button"
              className="apple-pay-btn"
              onClick={handleAuthorize}
              style={{ width: '100%', padding: '16px', fontSize: '1.05rem' }}
              id="confirm-apple-pay-btn"
            >
              <span>Pay with  Pay</span>
            </button>
          </div>
        )}

        {stage === 'processing' && (
          <div className="face-id-indicator">
            <div className="face-id-icon-circle">
              <Sparkles size={32} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Biometric 1-Tap Processing...</h3>
            <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Zero redirect • Sub-second serverless authorization</p>
          </div>
        )}

        {stage === 'confirmed' && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '16px 0' }}>
            <div style={{ color: '#059669' }}>
              <CheckCircle2 size={64} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827' }}>Order Confirmed!</h3>
            <p style={{ fontSize: '0.9rem', color: '#4b5563', maxWidth: 360 }}>
              Order <strong>#LUM-2026-9812</strong> has been confirmed. Your tracking code and receipt were instantly dispatched to your Apple Pay email.
            </p>
            <div style={{ background: '#ecfdf5', color: '#065f46', padding: '10px 16px', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600 }}>
              ⚡ Total Checkout Time: <strong>1.4 seconds</strong> (vs 4.2 mins on legacy)
            </div>
            <button 
              type="button"
              className="cta-button-main"
              onClick={handleFinish}
              style={{ width: '100%', marginTop: 8 }}
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
