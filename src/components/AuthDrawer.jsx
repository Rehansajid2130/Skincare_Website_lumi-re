// ponytail: luxury DTC onboarding & auth drawer matching Hims reference images 1, 2, 3, 4
import React, { useState, useEffect } from 'react';
import { X, User, Check, ArrowRight, LogOut, ShieldCheck } from 'lucide-react';

export default function AuthDrawer({
  isOpen,
  onClose,
  initialMode = 'login',
  currentUser,
  onAuthSuccess,
  onLogout,
  onNavigateToOrder,
  onNavigateToAccount
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Sync mode when drawer opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage('');
      setForgotSent(false);
    }
  }, [isOpen, initialMode]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    // Simulate authentic network latency and transition with Image 4 loader
    setTimeout(() => {
      const user = {
        email: email.trim(),
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        memberSince: '2026',
        isPrescriptionVerified: true
      };
      setIsLoading(false);
      onAuthSuccess(user);
    }, 1400);
  };

  const handleSocialAuth = (provider) => {
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const socialUser = {
        email: provider === 'Google' ? 'alexsmith.mobbin+1@gmail.com' : 'alexsmith@icloud.com',
        name: 'Alex Smith',
        provider,
        memberSince: '2026',
        isPrescriptionVerified: true
      };
      setIsLoading(false);
      onAuthSuccess(socialUser);
    }, 1300);
  };

  const handleForgotTrigger = () => {
    if (!email) {
      setErrorMessage('Please enter your email first to reset password');
      return;
    }
    setForgotSent(true);
    setErrorMessage('');
  };

  // 1. Loading State (Matching Hims Reference Image 4)
  if (isLoading) {
    return (
      <>
        <div className="hims-auth-backdrop" onClick={onClose} />
        <div className="hims-auth-drawer loading-mode" role="dialog" aria-modal="true">
          <div className="hims-auth-loader-container">
            <div className="hims-loader-center-brand">
              <span className="hims-loader-letter">l</span>
              {/* Subtle orbiting dotted arc matching Image 4 */}
              <svg className="hims-loader-orbit-svg" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="32"
                  fill="none"
                  stroke="#8C6D53"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="2 16"
                  strokeDashoffset="24"
                />
              </svg>
            </div>
            <p className="hims-loader-caption">
              {mode === 'signup' ? 'Creating your secure profile...' : 'Authenticating your account...'}
            </p>
          </div>
        </div>
      </>
    );
  }

  // 2. Already Logged In Account Overview State
  if (currentUser) {
    return (
      <>
        <div className="hims-auth-backdrop" onClick={onClose} />
        <div className="hims-auth-drawer" role="dialog" aria-modal="true" aria-label="Account Overview">
          {/* Header */}
          <div className="hims-auth-header">
            <button 
              type="button" 
              className="hims-auth-close-btn" 
              onClick={onClose} 
              aria-label="Close account menu"
            >
              <X size={20} />
            </button>
            <span className="hims-auth-header-title">My Account</span>
            <div style={{ width: 32 }} /> {/* spacer */}
          </div>

          <div className="hims-auth-content-body">
            <div className="hims-account-profile-card">
              <div className="hims-account-avatar">
                <User size={28} />
              </div>
              <div className="hims-account-details">
                <h3 className="hims-account-name">{currentUser.name || 'Lumière Member'}</h3>
                <p className="hims-account-email">{currentUser.email}</p>
                <div className="hims-account-badge">
                  <Check size={13} strokeWidth={3} />
                  <span>Clinical Prescription Active</span>
                </div>
              </div>
            </div>

            <div className="hims-account-actions-list">
              <button 
                type="button" 
                className="hims-btn-black"
                onClick={() => {
                  onClose();
                  if (onNavigateToAccount) onNavigateToAccount();
                }}
                style={{ width: '100%', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <span>Manage Subscriptions & Refills</span>
                <ArrowRight size={16} />
              </button>

              <button 
                type="button" 
                className="hims-account-action-row"
                onClick={() => {
                  onClose();
                  if (onNavigateToOrder) onNavigateToOrder();
                }}
              >
                <div>
                  <div className="action-row-title">Active Orders & Prescriptions</div>
                  <div className="action-row-sub">Order #2939993 • Track 2-Day Air Delivery</div>
                </div>
                <ArrowRight size={18} color="#8C6D53" />
              </button>

              <div className="hims-account-action-row" style={{ cursor: 'default' }}>
                <div>
                  <div className="action-row-title">Dermatologist Care Team</div>
                  <div className="action-row-sub">Dr. Sarah Jenkins, MD • California Board</div>
                </div>
                <ShieldCheck size={18} color="#16a34a" />
              </div>
            </div>

            <button 
              type="button" 
              className="hims-auth-logout-btn"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              <LogOut size={16} />
              <span>Log out of account</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  // 3. Login & Signup Forms (Matching Hims Reference Images 1, 2, 3)
  return (
    <>
      <div className="hims-auth-backdrop" onClick={onClose} />
      <div 
        className="hims-auth-drawer" 
        role="dialog" 
        aria-modal="true" 
        aria-label={mode === 'signup' ? 'Create an account' : 'Log in'}
      >
        {/* Header: Close Button (left) and Header Title (center) */}
        <div className="hims-auth-header">
          <button 
            type="button" 
            className="hims-auth-close-btn" 
            onClick={onClose} 
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
          <span className="hims-auth-header-title">
            {mode === 'signup' ? 'Create an account' : 'Login'}
          </span>
          <div style={{ width: 32 }} /> {/* Balances center title */}
        </div>

        {/* Content Body */}
        <div className="hims-auth-content-body">
          {/* Main Form Heading */}
          <h2 className="hims-auth-main-heading">
            {mode === 'signup' ? "Let's get your account set up" : "Welcome back"}
          </h2>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="hims-auth-form" noValidate>
            {errorMessage && (
              <div className="hims-auth-error-banner">
                {errorMessage}
              </div>
            )}

            {forgotSent && (
              <div className="hims-auth-success-banner">
                Password reset link sent to <strong>{email}</strong>. Check your inbox.
              </div>
            )}

            {/* Email Field with clean floating/rounded styling */}
            <div className="hims-input-group">
              <label htmlFor="auth-email-input" className="hims-input-label">Email</label>
              <input 
                id="auth-email-input"
                type="email"
                className="hims-auth-input"
                placeholder="alexsmith@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* Password Field */}
            <div className="hims-input-group">
              <label htmlFor="auth-password-input" className="hims-input-label">Password</label>
              <input 
                id="auth-password-input"
                type="password"
                className="hims-auth-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                required
              />
            </div>

            {/* Forgot Password Link (Login mode only) */}
            {mode === 'login' && (
              <div className="hims-auth-forgot-row">
                <button 
                  type="button" 
                  className="hims-auth-link-btn"
                  onClick={handleForgotTrigger}
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Primary Action Button */}
            <button 
              type="submit" 
              className="hims-auth-primary-submit-btn"
            >
              {mode === 'signup' ? 'Create account' : 'Log in'}
            </button>
          </form>

          {/* Divider: "or" */}
          <div className="hims-auth-divider">
            <span className="hims-auth-divider-line"></span>
            <span className="hims-auth-divider-text">or</span>
            <span className="hims-auth-divider-line"></span>
          </div>

          {/* Social Auth Buttons */}
          <div className="hims-auth-social-group">
            {/* Google */}
            <button 
              type="button" 
              className="hims-auth-social-btn"
              onClick={() => handleSocialAuth('Google')}
            >
              <svg className="social-icon" width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Apple */}
            <button 
              type="button" 
              className="hims-auth-social-btn"
              onClick={() => handleSocialAuth('Apple')}
            >
              <svg className="social-icon" width="18" height="18" viewBox="0 0 170 170" fill="currentColor">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.77-7.96-12.24-14.64-6.3-9.54-11.37-20.19-15.19-31.95-3.83-11.76-5.74-23.08-5.74-33.97 0-14.46 3.63-26.6 10.9-36.42 7.27-9.82 16.57-14.83 27.89-15.03 4.8 0 10.11 1.28 15.93 3.84 5.82 2.56 9.61 3.89 11.37 3.89 1.54 0 5.46-1.39 11.76-4.18 6.3-2.79 11.89-4.02 16.78-3.69 12.83.64 22.95 5.34 30.36 14.1-11.18 6.77-16.64 16.22-16.39 28.34.25 9.82 4.18 18.06 11.78 24.71 7.6 6.65 16.64 10.42 27.12 11.32-2.34 7.27-5.39 14.54-9.14 21.8zM119.22 33.15c0-7.39 2.67-14.35 8.01-20.89 5.34-6.54 11.83-10.63 19.47-12.26.25 1.54.38 2.87.38 3.99 0 7.39-2.82 14.53-8.46 21.42-5.64 6.89-12.3 11.02-19.98 12.39-.25-1.54-.42-3.09-.42-4.65z"/>
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          {/* Legal disclaimer (Sign Up mode only) */}
          {mode === 'signup' && (
            <p className="hims-auth-legal-disclaimer">
              By creating an account using email, Google or Apple, I agree to the{' '}
              <a href="#terms" onClick={(e) => e.preventDefault()}>Terms & Conditions</a> and acknowledge the{' '}
              <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
            </p>
          )}

          {/* Bottom Switch Link */}
          <div className="hims-auth-bottom-switch">
            {mode === 'login' ? (
              <span>
                First time here?{' '}
                <button 
                  type="button" 
                  className="hims-auth-switch-btn"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage('');
                  }}
                >
                  Create an account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button 
                  type="button" 
                  className="hims-auth-switch-btn"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                >
                  Log in
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
