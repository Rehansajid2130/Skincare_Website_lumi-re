// ponytail: clean warm aesthetic footer matching Hims design without external watermark bars
import React from 'react';

export default function Footer({ onNavigateToProductPage, onNavigateToCatalog, onNavigateToLanding, onNavigateToAdmin }) {
  return (
    <footer className="hims-footer">
      <div className="hims-footer-inner">
        <div className="hims-footer-top">
          {/* ponytail: accessible keyboard navigation for logo and links */}
          <button 
            type="button" 
            className="hims-logo" 
            onClick={onNavigateToLanding} 
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
          >
            lumière
          </button>
          <div style={{ display: 'flex', gap: 24, fontSize: '0.9rem', fontWeight: 600 }}>
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit' }} onClick={onNavigateToLanding}>Treatments</button>
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit' }} onClick={onNavigateToCatalog || onNavigateToProductPage}>Products</button>
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit' }} onClick={onNavigateToProductPage}>Formulations</button>
            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit' }} onClick={onNavigateToProductPage}>Science</button>
            <span style={{ color: 'inherit' }}>Safety Info</span>
          </div>
        </div>

        <div className="hims-footer-bottom">
          <span>© 2026 LUMIÈRE Health & Bio-Clinical Skincare Inc. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
            <span>Clinical Efficacy Notice</span>
            {onNavigateToAdmin && (
              <button 
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8C6D53', fontWeight: 700, font: 'inherit', padding: 0 }}
                onClick={onNavigateToAdmin}
              >
                ⚙️ Admin Portal
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
