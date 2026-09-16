// ponytail: luxury DTC checkout sheet with selectable payment method (Apple Pay, Shop Pay, Card)
// Enhanced with agency-payments-billing-engineer standards: integer cents, deterministic idempotency, 3DS challenge, test cards, and failure diagnostics.
import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck, X, Sparkles, Truck, Lock, CreditCard, AlertCircle, RefreshCw, Key, ExternalLink } from 'lucide-react';
import AppleIcon from './AppleIcon';
import { TEST_CARDS, processPaymentIntent, formatCents } from '../utils/billing';

export default function InstantCheckoutModal({
  isOpen,
  onClose,
  cartItems = [],
  checkoutMethod: initialMethod = 'card',
  onOrderComplete
}) {
  const [stage, setStage] = useState('review'); // 'review' | 'processing' | '3ds_challenge' | 'confirmed'
  const [selectedMethod, setSelectedMethod] = useState(initialMethod);
  const [orderNumber, setOrderNumber] = useState('');
  const [attemptCount, setAttemptCount] = useState(1);
  const [cardNum, setCardNum] = useState('4242 4242 4242 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [isTestMode] = useState(true);
  const [otpCode, setOtpCode] = useState('849201');

  // Sync state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setStage('review');
      setSelectedMethod(initialMethod || 'card');
      setOrderNumber('LUM-' + Math.floor(100000 + Math.random() * 900000));
      setAttemptCount(1);
      setPaymentError(null);
      setPaymentResult(null);
    }
  }, [isOpen, initialMethod]);

  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalCents = Math.round(total * 100);

  const handleAuthorize = async () => {
    setPaymentError(null);
    setStage('processing');

    try {
      const res = await processPaymentIntent({
        amountCents: totalCents,
        currency: 'usd',
        paymentMethod: selectedMethod,
        cardNumber: cardNum,
        orderId: orderNumber,
        attempt: attemptCount
      });

      setPaymentResult(res);

      if (res.status === 'requires_action') {
        // 3DS Challenge Flow
        setStage('3ds_challenge');
      } else if (res.status === 'failed') {
        setPaymentError(res);
        setAttemptCount(prev => prev + 1);
        setStage('review');
      } else {
        // Succeeded
        setStage('confirmed');
      }
    } catch (err) {
      setPaymentError({
        message: 'Network timeout connecting to payment processor. Please retry.',
        declineCode: 'network_error'
      });
      setAttemptCount(prev => prev + 1);
      setStage('review');
    }
  };

  const handleApprove3DS = () => {
    // 3DS authorized by user -> finalize payment
    setStage('processing');
    setTimeout(() => {
      const completedRes = {
        ...paymentResult,
        status: 'succeeded',
        authCode: 'AUTH_3DS_' + Math.floor(100000 + Math.random() * 900000),
        transactionId: 'ch_3ds_' + Math.random().toString(36).substring(2, 12),
        message: '3D Secure Verified by Visa/Mastercard identity check.'
      };
      setPaymentResult(completedRes);
      setStage('confirmed');
    }, 600);
  };

  const handleDecline3DS = () => {
    setPaymentError({
      message: '3D Secure Authentication was canceled or failed.',
      declineCode: '3ds_failed'
    });
    setAttemptCount(prev => prev + 1);
    setStage('review');
  };

  const handleFinish = () => {
    onOrderComplete && onOrderComplete({
      items: cartItems.length > 0 ? [...cartItems] : null,
      orderNumber: orderNumber,
      total: total,
      method: selectedMethod,
      paymentResult: paymentResult
    });
    setStage('review');
    onClose();
  };

  const handleSelectTestCard = (testCard) => {
    setSelectedMethod('card');
    setCardNum(testCard.number);
    setPaymentError(null);
  };

  return (
    <div className="checkout-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="checkout-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sheet-header">
          <div className="sheet-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="method-brand-name standard">Secure Checkout</span>
              {isTestMode && (
                <span className="payment-test-mode-badge" title="Stripe Developer Test Mode active">
                  <span className="badge-dot" /> Test Sandbox
                </span>
              )}
            </div>
            <span className="sheet-subtitle">
              Order {orderNumber} • Attempt #{attemptCount} • 256-Bit TLS Encrypted
            </span>
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
            {/* Error / Decline Alert if previous attempt failed */}
            {paymentError && (
              <div className="payment-decline-alert animate-fade-in">
                <AlertCircle size={18} className="decline-alert-icon" />
                <div className="decline-alert-content">
                  <div className="decline-alert-title">Payment Not Completed</div>
                  <div className="decline-alert-msg">{paymentError.message}</div>
                  <div className="decline-alert-hint">
                    Decline Code: <code>{paymentError.declineCode || 'error'}</code>. Choose a different card below to retry.
                  </div>
                </div>
              </div>
            )}

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
                <span className="info-card-label">PAYMENT METHOD</span>
                <span className="payment-secure-tag">
                  <Lock size={12} />
                  <span>PCI SAQ A</span>
                </span>
              </div>
              
              <div className="payment-options-grid">
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
                    <div className="payment-title">Credit / Debit Card</div>
                    <div className="payment-sub">Test Sandbox • Visa/MC</div>
                  </div>
                </button>

                {/* Apple Pay Option */}
                <button
                  type="button"
                  className={`payment-option-tile ${selectedMethod === 'apple' ? 'active' : ''}`}
                  onClick={() => setSelectedMethod('apple')}
                >
                  <div className="option-tile-head">
                    <span className="payment-icon-pill apple">
                      <AppleIcon size={14} />
                      <span>Pay</span>
                    </span>
                    <span className="option-tile-radio" />
                  </div>
                  <div className="option-tile-info">
                    <div className="payment-title">Apple Pay</div>
                    <div className="payment-sub">Biometric 1-Tap</div>
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
                    <div className="payment-sub">Express Wallet</div>
                  </div>
                </button>
              </div>

              {/* Expanded Card Input Fields when Card is selected */}
              {(selectedMethod === 'card' || selectedMethod === 'standard') && (
                <div className="card-fields-wrapper animate-fade-in">
                  <div className="card-test-chips-label">
                    <span>TEST PAYMENT CARDS (1-CLICK TEST):</span>
                  </div>
                  <div className="card-test-chips-row">
                    {TEST_CARDS.map(tc => (
                      <button
                        key={tc.name}
                        type="button"
                        className={`test-card-chip ${cardNum === tc.number ? 'active' : ''}`}
                        onClick={() => handleSelectTestCard(tc)}
                        title={tc.description}
                      >
                        <span className="chip-dot" style={{ background: tc.badgeColor }} />
                        <span className="chip-name">{tc.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="card-inputs-grid">
                    <div className="card-input-group full">
                      <label className="card-input-label">CARD NUMBER</label>
                      <div className="card-input-container">
                        <CreditCard size={15} className="card-input-icon" />
                        <input
                          type="text"
                          className="card-text-input"
                          value={cardNum}
                          onChange={(e) => setCardNum(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                        />
                      </div>
                    </div>
                    <div className="card-input-group">
                      <label className="card-input-label">EXPIRES</label>
                      <input
                        type="text"
                        className="card-text-input text-center"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="card-input-group">
                      <label className="card-input-label">CVC</label>
                      <input
                        type="text"
                        className="card-text-input text-center"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mini Order Summary */}
            <div className="checkout-summary-strip">
              <div className="summary-strip-row">
                <span>Items Subtotal ({cartItems.reduce((a, b) => a + b.qty, 0)})</span>
                <span>{formatCents(totalCents)}</span>
              </div>
              <div className="summary-strip-row">
                <span>Priority 2-Day Air</span>
                <span className="free-tag">FREE</span>
              </div>
              {cartItems.some(i => i.isSubscription) && (
                <div className="summary-strip-row" style={{ color: '#065F46', background: '#ECFDF5', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, margin: '4px 0' }}>
                  <span>Auto-Ship Discount (15% Off)</span>
                  <span>Active (Cancel Anytime)</span>
                </div>
              )}
              <div className="summary-strip-total">
                <span>Total Charge:</span>
                <span className="total-number">{formatCents(totalCents)}</span>
              </div>
            </div>

            {/* Action Buttons based on method */}
            {selectedMethod === 'apple' && (
              <button
                type="button"
                className="apple-pay-btn checkout-pay-btn"
                onClick={handleAuthorize}
                id="confirm-apple-pay-btn"
              >
                <AppleIcon size={19} />
                <span>Authorize with Apple Pay • {formatCents(totalCents)}</span>
              </button>
            )}

            {selectedMethod === 'shop' && (
              <button
                type="button"
                className="shop-pay-btn checkout-pay-btn"
                onClick={handleAuthorize}
                id="confirm-shop-pay-btn"
              >
                <span>Authorize with Shop Pay • {formatCents(totalCents)}</span>
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
                <span>
                  {paymentError ? `Retry Order (Attempt #${attemptCount})` : 'Authorize & Complete Order'} • {formatCents(totalCents)}
                </span>
              </button>
            )}
          </div>
        )}

        {/* STAGE 2: PROCESSING / TOKENIZING */}
        {stage === 'processing' && (
          <div className="face-id-indicator">
            <div className="face-id-icon-circle">
              <RefreshCw size={30} className="animate-spin-custom" />
            </div>
            <h3 className="processing-title">Authorizing Payment...</h3>
            <p className="processing-sub">
              Establishing 256-bit TLS handshake with payment gateway (Idempotency: order-{orderNumber}-attempt-{attemptCount})
            </p>
          </div>
        )}

        {/* STAGE 2.5: 3D SECURE (3DS 2.0) CHALLENGE MODAL */}
        {stage === '3ds_challenge' && (
          <div className="three-ds-challenge-sheet animate-fade-in">
            <div className="three-ds-header">
              <div className="bank-logo-placeholder">
                <ShieldCheck size={20} color="#059669" />
                <span className="bank-name">GLOBAL ISSUING BANK</span>
              </div>
              <span className="three-ds-badge">3D Secure 2.0</span>
            </div>

            <div className="three-ds-body">
              <h4 className="three-ds-title">Identity Verification Required</h4>
              <p className="three-ds-info">
                To protect your purchase of <strong>{formatCents(totalCents)}</strong>, enter the 6-digit one-time passcode sent to your mobile phone (+1 •••-•••-9841).
              </p>

              <div className="three-ds-otp-box">
                <label className="three-ds-otp-label">ONE-TIME PASSCODE (TEST CODE PRE-FILLED)</label>
                <input
                  type="text"
                  className="three-ds-otp-input"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                />
              </div>

              <div className="three-ds-actions">
                <button
                  type="button"
                  className="cta-button-main three-ds-btn-approve"
                  onClick={handleApprove3DS}
                >
                  Confirm & Authorize Payment
                </button>
                <button
                  type="button"
                  className="three-ds-btn-cancel"
                  onClick={handleDecline3DS}
                >
                  Cancel Authentication
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: ORDER CONFIRMED */}
        {stage === 'confirmed' && (
          <div className="order-confirmed-sheet animate-fade-in">
            <div className="confirmed-icon-circle">
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>
            <h3 className="confirmed-title">Payment Authorized!</h3>
            <p className="confirmed-desc">
              Your order <strong>#{orderNumber}</strong> has been successfully captured and confirmed.
            </p>

            {/* Payment Proof Card */}
            {paymentResult && (
              <div className="payment-receipt-audit-card">
                <div className="audit-row">
                  <span className="audit-label">Status</span>
                  <span className="audit-val success">● 200 OK Succeeded</span>
                </div>
                <div className="audit-row">
                  <span className="audit-label">Payment Method</span>
                  <span className="audit-val">{paymentResult.brand} •••• {paymentResult.last4}</span>
                </div>
                <div className="audit-row">
                  <span className="audit-label">Transaction ID</span>
                  <span className="audit-val monospace">{paymentResult.transactionId || 'ch_live_demo'}</span>
                </div>
                <div className="audit-row">
                  <span className="audit-label">Idempotency Key</span>
                  <span className="audit-val monospace">{paymentResult.idempotencyKey}</span>
                </div>
                <div className="audit-row">
                  <span className="audit-label">Auth Code</span>
                  <span className="audit-val monospace">{paymentResult.authCode}</span>
                </div>
                <div className="audit-row">
                  <span className="audit-label">Charged Amount</span>
                  <span className="audit-val bold">{formatCents(totalCents)}</span>
                </div>
              </div>
            )}

            {cartItems.some(i => i.isSubscription) && (
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '10px 14px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 600, width: '100%', boxSizing: 'border-box', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#059669" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Auto-Ship Protocol Active:</strong> Next refill scheduled in 30 days with 15% discount. You can pause or adjust frequency in your Account.
                </span>
              </div>
            )}

            <button
              type="button"
              className="cta-button-main confirmed-finish-btn"
              onClick={handleFinish}
            >
              View Order Tracking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
