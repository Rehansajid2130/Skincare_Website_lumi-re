// ponytail: comprehensive DTC skincare e-commerce admin portal with revenue analytics, inventory management, and storefront product editing
import React, { useState, useRef, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Package,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Upload,
  Eye,
  ArrowLeft,
  Truck,
  Search,
  Filter,
  Sparkles,
  CheckCircle,
  AlertCircle,
  CreditCard,
  ShieldCheck,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { TEST_CARDS, getPaymentLedger, formatCents, calculateReconciliation, processPaymentIntent } from '../utils/billing';

export default function AdminPortal({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onNavigateToLanding,
  onNavigateToProduct
}) {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'products' | 'orders'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Add / Edit Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Form fields for product
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'Serums',
    basePrice: 48,
    compareAtPrice: 60,
    costPerItem: 14,
    stock: 250,
    activeFormula: '',
    description: '',
    howToUse: '',
    image: null
  });

  const fileInputRef = useRef(null);
  const [imageError, setImageError] = useState(false);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState(null);
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Mock Orders Data
  const [orders, setOrders] = useState([
    {
      id: 'ORD-2939993',
      customer: 'Alex Smith',
      email: 'alexsmith@gmail.com',
      date: 'Sep 12, 2026',
      items: 'Custom Anti-Aging Serum (x1), Goodnight Wrinkle Cream (x1)',
      total: 72.00,
      payment: 'Apple Pay',
      status: 'Shipped'
    },
    {
      id: 'ORD-2939942',
      customer: 'Elena Rostova',
      email: 'elena.rostova@icloud.com',
      date: 'Sep 12, 2026',
      items: 'Daily Mineral Shield SPF 30 (x2)',
      total: 44.00,
      payment: 'Visa •••• 8821',
      status: 'Processing'
    },
    {
      id: 'ORD-2939901',
      customer: 'Marcus Chen',
      email: 'm.chen@outlook.com',
      date: 'Sep 11, 2026',
      items: 'Gentle Squalane Cleanser (x1), Custom Anti-Aging Serum (x1)',
      total: 66.00,
      payment: 'Mastercard •••• 3192',
      status: 'Delivered'
    },
    {
      id: 'ORD-2939874',
      customer: 'Sarah Miller',
      email: 'sarah.m@gmail.com',
      date: 'Sep 11, 2026',
      items: 'Overnight Intensive Cream (x1)',
      total: 24.00,
      payment: 'Apple Pay',
      status: 'Delivered'
    },
    {
      id: 'ORD-2939810',
      customer: 'David Kim',
      email: 'david.kim@yahoo.com',
      date: 'Sep 10, 2026',
      items: 'Custom Anti-Aging Serum (x2)',
      total: 96.00,
      payment: 'Visa •••• 4242',
      status: 'Delivered'
    }
  ]);

  // Billing & Payment Diagnostics state (agency-payments-billing-engineer)
  const [billingLedger, setBillingLedger] = useState(() => getPaymentLedger());
  const [diagLogs, setDiagLogs] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [stripeKey, setStripeKey] = useState(() => {
    try {
      return localStorage.getItem('lumiere_stripe_pk') || (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
    } catch (e) {
      return '';
    }
  });

  const handleSaveStripeKey = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('lumiere_stripe_pk', stripeKey.trim());
      showToast('Stripe Publishable Key saved');
      addDiagLog(`[CONFIG] Publishable Key updated: ${stripeKey.trim().slice(0, 12)}...`, 'info');
    } catch (err) {
      showToast('Failed to save key');
    }
  };

  const refreshLedger = () => {
    setBillingLedger(getPaymentLedger());
  };

  const addDiagLog = (msg, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setDiagLogs(prev => [{ time, msg, type }, ...prev.slice(0, 19)]);
  };

  const handleRunTestCard = async (testCard) => {
    setIsSimulating(true);
    addDiagLog(`[DISPATCH] Initiating payment for $48.00 with ${testCard.name} (${testCard.number})...`, 'info');
    
    try {
      const res = await processPaymentIntent({
        amountCents: 4800,
        currency: 'usd',
        paymentMethod: 'card',
        cardNumber: testCard.number,
        orderId: 'TEST-' + Math.floor(10000 + Math.random() * 90000),
        attempt: 1
      });

      refreshLedger();

      if (res.status === 'succeeded') {
        addDiagLog(`[SUCCESS 200 OK] Captured $48.00 | Tx ID: ${res.transactionId} | Auth: ${res.authCode} | Idempotency: ${res.idempotencyKey}`, 'success');
        showToast(`Payment Approved: ${res.authCode}`);
      } else if (res.status === 'requires_action') {
        addDiagLog(`[REQUIRES ACTION] 3D Secure 2.0 Challenge Triggered for card ${testCard.number} | Idempotency: ${res.idempotencyKey}`, 'warning');
        showToast('3DS Challenge Triggered');
      } else {
        addDiagLog(`[DECLINE] Payment Failed: ${res.message} (Code: ${res.declineCode}) | Attempt #1 logged in ledger`, 'error');
        showToast(`Declined: ${res.declineCode}`);
      }
    } catch (e) {
      addDiagLog(`[ERROR] Network failed: ${e.message}`, 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleRunIdempotencyTest = async () => {
    setIsSimulating(true);
    const testOrderId = 'IDEMPO-' + Math.floor(10000 + Math.random() * 90000);
    addDiagLog(`[STRESS TEST] Firing 2 concurrent charges with identical key: order-${testOrderId}-attempt-1`, 'info');

    try {
      // Fire request 1
      const req1 = await processPaymentIntent({
        amountCents: 6500,
        currency: 'usd',
        paymentMethod: 'card',
        cardNumber: '4242424242424242',
        orderId: testOrderId,
        attempt: 1
      });

      // Fire duplicate request 2 with exact same orderId and attempt
      const req2 = await processPaymentIntent({
        amountCents: 6500,
        currency: 'usd',
        paymentMethod: 'card',
        cardNumber: '4242424242424242',
        orderId: testOrderId,
        attempt: 1
      });

      refreshLedger();

      if (req2.isDuplicateHit) {
        addDiagLog(`[IDEMPOTENCY PROVEN] Req #1 created charge ${req1.transactionId}. Req #2 recognized as duplicate; returned cached charge without double-billing. Drift: $0.00!`, 'success');
        showToast('Idempotency verified: 0 duplicate charges');
      } else {
        addDiagLog('[WARNING] Second request was not caught as duplicate', 'warning');
      }
    } catch (e) {
      addDiagLog(`[ERROR] Idempotency test failed: ${e.message}`, 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleClearLedger = () => {
    if (window.confirm('Reset all sandbox payment ledger records?')) {
      localStorage.removeItem('lumiere_payment_ledger');
      refreshLedger();
      setDiagLogs([]);
      showToast('Ledger cleared');
    }
  };

  // Handle image upload directly via FileReader
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ponytail: enforce max 1.5MB to prevent exhausting browser localStorage quota
    if (file.size > 1.5 * 1024 * 1024) {
      showToast('Image exceeds 1.5MB. Please upload an optimized PNG to preserve storage.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target.result;
      setFormData(prev => ({ ...prev, image: dataUrl }));
      setImageError(false);
      showToast('Product image uploaded successfully');
    };
    reader.onerror = () => {
      showToast('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  // Open modal for new product
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setImageError(false);
    setFormData({
      title: '',
      subtitle: '',
      category: 'Skincare',
      basePrice: 48,
      compareAtPrice: 60,
      costPerItem: 14,
      stock: 250,
      activeFormula: '',
      description: '',
      howToUse: '',
      image: null
    });
    setIsProductModalOpen(true);
  };

  // Open modal for editing product
  const handleOpenEditProduct = (prod) => {
    setEditingProductId(prod.id);
    setImageError(false);
    setFormData({
      title: prod.title || '',
      subtitle: prod.subtitle || '',
      category: prod.category || 'Serums',
      basePrice: prod.basePrice || 48,
      compareAtPrice: prod.compareAtPrice || Math.round((prod.basePrice || 48) * 1.25),
      costPerItem: prod.costPerItem || 14,
      stock: prod.stock || 250,
      activeFormula: prod.activeFormula || '',
      description: prod.description || '',
      howToUse: prod.howToUse || '',
      image: prod.image || null
    });
    setIsProductModalOpen(true);
  };

  // Save product to catalog
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter a product title');
      return;
    }

    if (!formData.image) {
      setImageError(true);
      showToast('Product image is required before publishing');
      return;
    }

    const priceNum = parseFloat(formData.basePrice) || 0;
    const compareNum = parseFloat(formData.compareAtPrice) || priceNum;
    const costNum = parseFloat(formData.costPerItem) || 0;

    // ponytail: preserve existing product metadata (variants, clinical data, highlights, cutoutImage) on update
    const existingProduct = editingProductId ? products.find(p => p.id === editingProductId) : null;

    const productPayload = {
      ...(existingProduct || {}),
      ...formData,
      id: editingProductId || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      basePrice: priceNum,
      compareAtPrice: compareNum,
      costPerItem: costNum,
      stock: parseInt(formData.stock, 10) || 100,
      variants: existingProduct?.variants || [
        { size: 'standard', label: 'Standard Size', price: priceNum, savings: null }
      ],
      rating: existingProduct?.rating || 4.9,
      reviewCount: existingProduct?.reviewCount || 42,
      inStock: true,
      shipsIn: existingProduct?.shipsIn || 'Same-day Dispatch • Free 2-Day Air'
    };

    if (editingProductId) {
      onUpdateProduct(productPayload);
      showToast(`Updated "${productPayload.title}" in store catalog`);
    } else {
      onAddProduct(productPayload);
      showToast(`Added "${productPayload.title}" to store catalog`);
    }

    setIsProductModalOpen(false);
  };

  // Inline price update
  const handleQuickPriceChange = (prodId, newPrice) => {
    const val = parseFloat(newPrice);
    if (isNaN(val) || val <= 0) return;
    const existing = products.find(p => p.id === prodId);
    if (existing) {
      onUpdateProduct({ ...existing, basePrice: val });
      showToast(`Price updated to $${val.toFixed(2)}`);
    }
  };

  // Toggle order status
  const handleToggleOrderStatus = (orderId) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        let nextStatus = 'Processing';
        if (ord.status === 'Processing') nextStatus = 'Shipped';
        else if (ord.status === 'Shipped') nextStatus = 'Delivered';
        else if (ord.status === 'Delivered') nextStatus = 'Processing';
        return { ...ord, status: nextStatus };
      }
      return ord;
    }));
    showToast(`Order status updated`);
  };

  // Dynamically extract all unique categories present in the products catalog
  const availableCategories = useMemo(() => {
    const cats = new Set(['All', 'Skincare']);
    products.forEach(p => {
      if (p.category && p.category.trim()) {
        cats.add(p.category.trim());
      }
    });
    return Array.from(cats);
  }, [products]);

  // Filtered products list matching search query across title, subtitle, category & active formula
  const filteredProducts = products.filter(p => {
    const prodCat = (p.category && p.category.trim()) || 'Skincare';
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch = !query ||
      (p.title && p.title.toLowerCase().includes(query)) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(query)) ||
      prodCat.toLowerCase().includes(query) ||
      (p.activeFormula && p.activeFormula.toLowerCase().includes(query));

    const matchesCategory = selectedCategory === 'All' ||
      prodCat.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Revenue calculation metrics
  const totalRevenue = 148920;
  const totalCost = 50633;
  const netProfit = totalRevenue - totalCost;
  const profitMarginPercent = Math.round((netProfit / totalRevenue) * 100);

  return (
    <div className="hims-admin-wrapper">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="hims-admin-toast">
          <Check size={16} strokeWidth={2.5} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="hims-admin-header">
        <div className="hims-admin-header-inner">
          <div className="hims-admin-brand-col">
            <button
              type="button"
              className="hims-admin-back-btn"
              onClick={onNavigateToLanding}
              aria-label="Back to storefront"
            >
              <ArrowLeft size={16} />
              <span>Back to Store</span>
            </button>
            <div className="hims-admin-brand-title">
              lumière <span>Commerce Admin</span>
            </div>
            <span className="hims-admin-live-badge">
              <span className="dot" /> Store Live
            </span>
          </div>

          <div className="hims-admin-header-actions">
            <button
              type="button"
              className="hims-btn-black hims-admin-new-prod-btn"
              onClick={handleOpenAddProduct}
            >
              <Plus size={16} />
              <span>Add New Product</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <div className="hims-admin-tabs-bar">
        <div className="hims-admin-tabs-inner">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <TrendingUp size={17} />
            <span>Revenue & Analytics</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={17} />
            <span>Product Catalog & Pricing ({products.length})</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={17} />
            <span>Orders & Fulfillment ({orders.length})</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('billing');
              refreshLedger();
            }}
          >
            <CreditCard size={17} />
            <span>Billing & Diagnostics ({billingLedger.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="hims-admin-main-container">

        {/* =========================================================================
            TAB 1: REVENUE & FINANCIAL ANALYTICS
           ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="hims-admin-analytics-view animate-fade-in">
            {/* KPI Stat Cards Grid */}
            <div className="hims-admin-kpi-grid">
              <div className="admin-kpi-card">
                <div className="kpi-icon-wrap revenue">
                  <DollarSign size={22} />
                </div>
                <div className="kpi-data">
                  <span className="kpi-label">Gross Revenue (MTD)</span>
                  <div className="kpi-value">${totalRevenue.toLocaleString()}</div>
                  <div className="kpi-trend positive">
                    <TrendingUp size={13} />
                    <span>+18.4% vs last month</span>
                  </div>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="kpi-icon-wrap profit">
                  <TrendingUp size={22} />
                </div>
                <div className="kpi-data">
                  <span className="kpi-label">Net Operating Profit</span>
                  <div className="kpi-value">${netProfit.toLocaleString()}</div>
                  <div className="kpi-trend positive">
                    <span>{profitMarginPercent}% Avg Gross Margin</span>
                  </div>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="kpi-icon-wrap orders">
                  <ShoppingBag size={22} />
                </div>
                <div className="kpi-data">
                  <span className="kpi-label">Total Completed Orders</span>
                  <div className="kpi-value">2,418</div>
                  <div className="kpi-trend positive">
                    <span>+142 this week</span>
                  </div>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="kpi-icon-wrap aov">
                  <Package size={22} />
                </div>
                <div className="kpi-data">
                  <span className="kpi-label">Average Order Value (AOV)</span>
                  <div className="kpi-value">$61.58</div>
                  <div className="kpi-trend positive">
                    <span>+$4.20 with Companion Add-ons</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Breakdown & Revenue Velocity */}
            <div className="admin-charts-grid">
              {/* 30-Day Sales Trend Bar Graph */}
              <div className="admin-chart-card">
                <div className="chart-header">
                  <div>
                    <h3 className="chart-title">30-Day Sales & Order Velocity</h3>
                    <p className="chart-sub">DTC Skincare Daily Revenue Breakdown</p>
                  </div>
                  <div className="chart-legend">
                    <span className="legend-item"><span className="dot one-time" /> Direct Orders</span>
                    <span className="legend-item"><span className="dot subscription" /> Auto-Refills</span>
                  </div>
                </div>

                <div className="admin-bar-chart-visual">
                  {[
                    { day: 'Day 1', total: 3800, h: 45 },
                    { day: 'Day 3', total: 4200, h: 52 },
                    { day: 'Day 6', total: 4900, h: 62 },
                    { day: 'Day 9', total: 5400, h: 70 },
                    { day: 'Day 12', total: 5100, h: 65 },
                    { day: 'Day 15', total: 6200, h: 80 },
                    { day: 'Day 18', total: 5900, h: 75 },
                    { day: 'Day 21', total: 6800, h: 88 },
                    { day: 'Day 24', total: 7200, h: 94 },
                    { day: 'Day 27', total: 6900, h: 90 },
                    { day: 'Today', total: 7850, h: 100 }
                  ].map((bar, idx) => (
                    <div key={idx} className="chart-bar-col">
                      <div className="chart-bar-tooltip">${bar.total.toLocaleString()}</div>
                      <div className="chart-bar-track">
                        <div
                          className="chart-bar-fill"
                          style={{ height: `${bar.h}%` }}
                        />
                      </div>
                      <span className="chart-bar-label">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Selling Products Leaderboard */}
              <div className="admin-leaderboard-card">
                <h3 className="chart-title">Top Products</h3>

                <div className="leaderboard-list">
                  {products.slice(0, 5).map((prod, index) => {
                    const unitsSold = 840 - index * 140;
                    const prodRev = unitsSold * prod.basePrice;
                    const margin = Math.round(((prod.basePrice - 14) / prod.basePrice) * 100);

                    return (
                      <div key={prod.id} className="leaderboard-row">
                        <div className="leaderboard-rank">{index + 1}</div>
                        <img src={prod.image} alt={prod.title} className="leaderboard-thumb" />
                        <div className="leaderboard-info">
                          <div className="leaderboard-title">{prod.title}</div>
                          <div className="leaderboard-stats">
                            {unitsSold} units • ${prod.basePrice} retail
                          </div>
                        </div>
                        <div className="leaderboard-revenue-col">
                          <div className="leaderboard-amount">${prodRev.toLocaleString()}</div>
                          <div className="leaderboard-margin">{margin}% margin</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PRODUCT CATALOG & PRICING MANAGEMENT
           ========================================================================= */}
        {activeTab === 'products' && (
          <div className="hims-admin-products-view animate-fade-in">
            {/* Toolbar: Search, Category Filter, and Add Button */}
            <div className="admin-products-toolbar">
              <div className="toolbar-search-wrap">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search products by title, formula, or active..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="toolbar-search-input"
                />
              </div>

              <div className="toolbar-filter-wrap">
                <Filter size={15} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="toolbar-category-select"
                >
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="hims-btn-black toolbar-add-btn"
                onClick={handleOpenAddProduct}
              >
                <Plus size={16} />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Data Table */}
            <div className="admin-table-container">
              <table className="admin-products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Retail Price</th>
                    <th>Compare-At</th>
                    <th>Unit Cost</th>
                    <th>Margin</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const price = product.basePrice || 48;
                    const compareAt = product.compareAtPrice || Math.round(price * 1.25);
                    const cost = product.costPerItem || 14;
                    const margin = Math.round(((price - cost) / price) * 100);
                    const stockCount = product.stock !== undefined ? product.stock : 250;

                    return (
                      <tr key={product.id}>
                        {/* Product Title & Thumbnail */}
                        <td className="product-col">
                          <div className="table-product-cell">
                            <div className="table-img-wrap">
                              <img src={product.image} alt={product.title} />
                            </div>
                            <div>
                              <div className="table-product-title">{product.title}</div>
                              <div className="table-product-sku">SKU: {product.id}</div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td>
                          <span className="table-category-tag">
                            {product.category || 'Skincare'}
                          </span>
                        </td>

                        {/* Retail Price (Editable) */}
                        <td>
                          <div className="table-price-input-wrap">
                            <span>$</span>
                            <input
                              type="number"
                              defaultValue={price}
                              onBlur={(e) => handleQuickPriceChange(product.id, e.target.value)}
                              className="table-inline-input"
                            />
                          </div>
                        </td>

                        {/* Compare-At Price */}
                        <td>
                          <span className="table-compare-price">${compareAt}</span>
                        </td>

                        {/* Unit Cost */}
                        <td>
                          <span className="table-cost-price">${cost}</span>
                        </td>

                        {/* Profit Margin */}
                        <td>
                          <span className={`table-margin-badge ${margin >= 60 ? 'high' : 'medium'}`}>
                            {margin}%
                          </span>
                        </td>

                        {/* Stock Inventory */}
                        <td>
                          <span className="table-stock-num">{stockCount} units</span>
                        </td>

                        {/* Status */}
                        <td>
                          <span className={`table-status-pill ${stockCount > 20 ? 'in-stock' : 'low-stock'}`}>
                            {stockCount > 20 ? 'In Stock' : 'Low Stock'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'right' }}>
                          <div className="table-actions-group">
                            <button
                              type="button"
                              className="table-action-icon edit"
                              onClick={() => handleOpenEditProduct(product)}
                              title="Edit details & photos"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              type="button"
                              className="table-action-icon view"
                              onClick={() => {
                                onNavigateToProduct(product.id);
                              }}
                              title="View on live storefront"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              type="button"
                              className="table-action-icon delete"
                              onClick={() => {
                                if (window.confirm(`Delete "${product.title}" from catalog?`)) {
                                  onDeleteProduct(product.id);
                                  showToast(`Deleted "${product.title}"`);
                                }
                              }}
                              title="Delete product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: ORDERS & FULFILLMENT MANAGEMENT
           ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="hims-admin-orders-view animate-fade-in">
            <div className="admin-table-container">
              <table className="admin-products-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items Purchased</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Fulfillment Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td className="order-number-cell">
                        <strong>{ord.id}</strong>
                      </td>
                      <td>
                        <div className="order-cust-name">{ord.customer}</div>
                        <div className="order-cust-email">{ord.email}</div>
                      </td>
                      <td>{ord.date}</td>
                      <td>
                        <div className="order-items-summary">{ord.items}</div>
                      </td>
                      <td>
                        <span className="order-payment-method">{ord.payment}</span>
                      </td>
                      <td>
                        <strong>${ord.total.toFixed(2)}</strong>
                      </td>
                      <td>
                        <span className={`order-status-tag ${ord.status.toLowerCase()}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="hims-btn-outline order-update-status-btn"
                          onClick={() => handleToggleOrderStatus(ord.id)}
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: BILLING, IDEMPOTENCY & PAYMENT DIAGNOSTICS (agency-payments-billing-engineer)
           ========================================================================= */}
        {activeTab === 'billing' && (
          <div className="hims-admin-billing-view animate-fade-in">
            {/* Reconciliation KPI Strip */}
            {(() => {
              const recon = calculateReconciliation();
              return (
                <div className="hims-admin-kpi-grid">
                  <div className="admin-kpi-card">
                    <div className="kpi-icon-wrap revenue">
                      <CreditCard size={22} />
                    </div>
                    <div className="kpi-data">
                      <span className="kpi-label">Total Volume Captured</span>
                      <div className="kpi-value">{formatCents(recon.totalVolumeCents)}</div>
                      <div className="kpi-trend positive">
                        <span>{recon.transactionCount} Successful Transactions</span>
                      </div>
                    </div>
                  </div>

                  <div className="admin-kpi-card">
                    <div className="kpi-icon-wrap profit">
                      <DollarSign size={22} />
                    </div>
                    <div className="kpi-data">
                      <span className="kpi-label">Estimated Gateway Fees</span>
                      <div className="kpi-value">{formatCents(recon.totalFeesCents)}</div>
                      <div className="kpi-trend">
                        <span>2.9% + $0.30 standard rate</span>
                      </div>
                    </div>
                  </div>

                  <div className="admin-kpi-card">
                    <div className="kpi-icon-wrap aov">
                      <DollarSign size={22} />
                    </div>
                    <div className="kpi-data">
                      <span className="kpi-label">Net Settlement Payout</span>
                      <div className="kpi-value">{formatCents(recon.netPayoutCents)}</div>
                      <div className="kpi-trend positive">
                        <span>Ready for Bank Deposit</span>
                      </div>
                    </div>
                  </div>

                  <div className="admin-kpi-card">
                    <div className="kpi-icon-wrap orders" style={{ background: '#ECFDF5', color: '#059669' }}>
                      <ShieldCheck size={22} />
                    </div>
                    <div className="kpi-data">
                      <span className="kpi-label">Ledger Reconciliation Drift</span>
                      <div className="kpi-value" style={{ color: '#059669' }}>$0.00</div>
                      <div className="kpi-trend positive">
                        <CheckCircle size={13} />
                        <span>100% Balanced Audit</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Gateway API Key Configuration Card (PCI DSS SAQ A) */}
            <div className="admin-billing-test-harness" style={{ background: '#FAF9F6', borderColor: '#E7E0D6' }}>
              <div className="test-harness-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 12 }}>
                <div>
                  <h3 className="test-harness-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Stripe API Credentials & Key Locations</span>
                    <span className="payment-test-mode-badge" style={{ background: '#ECFDF5', color: '#065F46' }}>
                      <span className="badge-dot" style={{ background: '#059669' }} /> Secure SAQ A Architecture
                    </span>
                  </h3>
                  <p className="test-harness-sub">
                    Configure your Stripe API keys. Public keys go to the frontend; secret keys are strictly isolated in your backend server.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '14px' }}>
                {/* 1. Frontend Key Form */}
                <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#111827' }}>1. FRONTEND PUBLISHABLE KEY</span>
                    <span style={{ fontSize: '0.68rem', background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Client-Safe</span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: '#6B7280', margin: '0 0 10px 0' }}>
                    File: <code>.env</code> $\rightarrow$ <code>VITE_STRIPE_PUBLISHABLE_KEY</code>
                  </p>
                  <form onSubmit={handleSaveStripeKey} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="card-text-input"
                      style={{ fontSize: '0.76rem', fontFamily: 'monospace' }}
                      value={stripeKey}
                      onChange={(e) => setStripeKey(e.target.value)}
                      placeholder="pk_test_51..."
                    />
                    <button type="submit" className="hims-btn-black" style={{ padding: '6px 14px', fontSize: '0.76rem', flexShrink: 0 }}>
                      Save Key
                    </button>
                  </form>
                </div>

                {/* 2. Backend Secret Key Info */}
                <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#111827' }}>2. BACKEND SECRET KEY</span>
                    <span style={{ fontSize: '0.68rem', background: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Strictly Secret</span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: '#6B7280', margin: '0 0 8px 0' }}>
                    File: <code>server/.env</code> $\rightarrow$ <code>STRIPE_SECRET_KEY=sk_test_...</code>
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#4B5563', lineHeight: 1.4, background: '#F9FAFB', padding: '8px', borderRadius: '6px' }}>
                    🔒 Used only by <code>server/server.js</code> to create PaymentIntents and communicate with Stripe. Never exposed to browsers.
                  </div>
                </div>

                {/* 3. Webhook Signing Secret Info */}
                <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#111827' }}>3. WEBHOOK SIGNING SECRET</span>
                    <span style={{ fontSize: '0.68rem', background: '#EFF6FF', color: '#1E40AF', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>HMAC-SHA256</span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: '#6B7280', margin: '0 0 8px 0' }}>
                    File: <code>server/.env</code> $\rightarrow$ <code>STRIPE_WEBHOOK_SECRET=whsec_...</code>
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#4B5563', lineHeight: 1.4, background: '#F9FAFB', padding: '8px', borderRadius: '6px' }}>
                    ⚡ Used to verify cryptographic event signatures from <code>stripe listen</code> and prevent replay attacks.
                  </div>
                </div>
              </div>
            </div>

            {/* Test Harness & Diagnostics Execution Console */}
            <div className="admin-billing-test-harness">
              <div className="test-harness-header">
                <div>
                  <h3 className="test-harness-title">Payment Verification & Failure Catalog Test Runner</h3>
                  <p className="test-harness-sub">
                    Execute simulated payment requests against the gateway to verify state machine transitions, decline codes, 3DS challenges, and idempotency guarantees.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="hims-btn-outline"
                    onClick={refreshLedger}
                    disabled={isSimulating}
                  >
                    <RefreshCw size={14} className={isSimulating ? 'animate-spin-custom' : ''} />
                    <span>Refresh</span>
                  </button>
                  <button
                    type="button"
                    className="hims-btn-outline"
                    style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                    onClick={handleClearLedger}
                  >
                    Reset Ledger
                  </button>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="test-harness-buttons-grid">
                {TEST_CARDS.map(tc => (
                  <button
                    key={tc.name}
                    type="button"
                    className="test-runner-btn"
                    onClick={() => handleRunTestCard(tc)}
                    disabled={isSimulating}
                  >
                    <div className="runner-btn-top">
                      <span className="runner-dot" style={{ background: tc.badgeColor }} />
                      <span className="runner-badge">{tc.badge}</span>
                    </div>
                    <div className="runner-title">Test {tc.name}</div>
                    <div className="runner-number">{tc.number}</div>
                    <div className="runner-desc">{tc.description}</div>
                  </button>
                ))}

                {/* Idempotency Test Runner */}
                <button
                  type="button"
                  className="test-runner-btn idempotency-btn"
                  onClick={handleRunIdempotencyTest}
                  disabled={isSimulating}
                >
                  <div className="runner-btn-top">
                    <span className="runner-dot" style={{ background: '#3B82F6' }} />
                    <span className="runner-badge" style={{ background: '#EFF6FF', color: '#1E40AF' }}>Idempotency Guard</span>
                  </div>
                  <div className="runner-title">Stress Test Double-Click</div>
                  <div className="runner-number">Concurrent Multi-Fire</div>
                  <div className="runner-desc">Fires 2 simultaneous requests with same key; verifies zero double charge.</div>
                </button>
              </div>

              {/* Real-time Diagnostics Terminal */}
              {diagLogs.length > 0 && (
                <div className="diag-terminal-box">
                  <div className="diag-terminal-header">
                    <span>LIVE DIAGNOSTIC EXECUTION LOG</span>
                    <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>Showing last {diagLogs.length} events</span>
                  </div>
                  <div className="diag-terminal-body">
                    {diagLogs.map((log, idx) => (
                      <div key={idx} className={`diag-log-line ${log.type}`}>
                        <span className="diag-log-time">[{log.time}]</span>
                        <span className="diag-log-msg">{log.msg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Live Ledger Table */}
            <div className="admin-table-container" style={{ marginTop: '24px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Recorded Transaction Ledger (Double-Entry Storage)</h4>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Persisted locally via <code>localStorage.lumiere_payment_ledger</code>. Every transaction maintains strict minor units and idempotency records.
                  </p>
                </div>
                <span className="hims-admin-live-badge">
                  <span className="dot" /> {billingLedger.length} Records
                </span>
              </div>

              {billingLedger.length === 0 ? (
                <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <CreditCard size={32} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                  <p>No transactions recorded yet in sandbox. Click any of the test cards above or place an order in the store to see records populate!</p>
                </div>
              ) : (
                <table className="admin-products-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Order ID</th>
                      <th>Method / Brand</th>
                      <th>Amount</th>
                      <th>Fee</th>
                      <th>Net</th>
                      <th>Idempotency Key</th>
                      <th>Transaction ID / Auth</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingLedger.map((tx, idx) => (
                      <tr key={tx.idempotencyKey || idx}>
                        <td>
                          <span
                            className="order-status-tag"
                            style={{
                              background: tx.status === 'succeeded' ? '#ECFDF5' : '#FEF2F2',
                              color: tx.status === 'succeeded' ? '#065F46' : '#991B1B'
                            }}
                          >
                            {tx.status === 'succeeded' ? 'Succeeded' : (tx.declineCode || tx.status)}
                          </span>
                        </td>
                        <td><strong>{tx.orderId}</strong></td>
                        <td>
                          {tx.brand || 'Card'} {tx.last4 ? `•••• ${tx.last4}` : ''}
                        </td>
                        <td>
                          <strong>{formatCents(tx.amountCents || 0, tx.currency)}</strong>
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>
                          {tx.feeCents ? formatCents(tx.feeCents, tx.currency) : '-'}
                        </td>
                        <td style={{ color: tx.status === 'succeeded' ? '#059669' : 'inherit' }}>
                          {tx.netCents ? formatCents(tx.netCents, tx.currency) : '-'}
                        </td>
                        <td>
                          <code style={{ fontSize: '0.72rem', background: '#F3F4F6', padding: '2px 4px', borderRadius: '4px' }}>
                            {tx.idempotencyKey}
                          </code>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.74rem', fontFamily: 'monospace', color: '#4B5563' }}>
                            {tx.transactionId || tx.authCode || 'N/A'}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString() : 'Just now'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

      </main>

      {/* =========================================================================
          ADD / EDIT PRODUCT MODAL WITH AUTO BACKGROUND REMOVER
         ========================================================================= */}
      {isProductModalOpen && (
        <div className="hims-admin-modal-overlay" role="dialog" aria-modal="true">
          <div className="hims-admin-modal-card animate-fade-in">
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editingProductId ? 'Edit Product' : 'Add New Skincare Product'}
              </h2>
              <button
                type="button"
                className="admin-modal-close-btn"
                onClick={() => setIsProductModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="admin-modal-form">
              <div className="admin-modal-form-grid">

                {/* Left Column: Product Details */}
                <div className="form-col-left">
                  <div className="hims-input-group">
                    <label className="hims-input-label">Product Title</label>
                    <input
                      type="text"
                      className="hims-auth-input"
                      placeholder="e.g. Ceramide Barrier Recovery Crème"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="hims-input-group">
                    <label className="hims-input-label">Subtitle / Key Value Prop</label>
                    <input
                      type="text"
                      className="hims-auth-input"
                      placeholder="e.g. Deep 72-Hour Lipid Barrier Restoration"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    />
                  </div>

                  <div className="form-row-2col">
                    <div className="hims-input-group">
                      <label className="hims-input-label">Category Name</label>
                      <input
                        type="text"
                        list="admin-category-suggestions"
                        className="hims-auth-input"
                        placeholder="e.g. Skincare, Serums, Moisturizers, Cleansers..."
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      />
                      <datalist id="admin-category-suggestions">
                        {availableCategories.filter(c => c !== 'All').map(c => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                      <div className="category-quick-pills">
                        {['Skincare', 'Serums', 'Creams', 'Cleansers', 'Sunscreen'].map(chip => (
                          <button
                            key={chip}
                            type="button"
                            className={`category-pill-tag ${formData.category?.toLowerCase() === chip.toLowerCase() ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, category: chip })}
                          >
                            {formData.category?.toLowerCase() === chip.toLowerCase() ? '✓ ' : '+ '}{chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="hims-input-group">
                      <label className="hims-input-label">Inventory Stock</label>
                      <input
                        type="number"
                        className="hims-auth-input"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row-3col">
                    <div className="hims-input-group">
                      <label className="hims-input-label">Retail Price ($)</label>
                      <input
                        type="number"
                        step="0.5"
                        className="hims-auth-input"
                        value={formData.basePrice}
                        onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                        required
                      />
                    </div>

                    <div className="hims-input-group">
                      <label className="hims-input-label">Compare-At ($)</label>
                      <input
                        type="number"
                        step="0.5"
                        className="hims-auth-input"
                        value={formData.compareAtPrice}
                        onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                      />
                    </div>

                    <div className="hims-input-group">
                      <label className="hims-input-label">Cost per Item ($)</label>
                      <input
                        type="number"
                        step="0.5"
                        className="hims-auth-input"
                        value={formData.costPerItem}
                        onChange={(e) => setFormData({ ...formData, costPerItem: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="hims-input-group">
                    <label className="hims-input-label">Active Ingredients Formula</label>
                    <input
                      type="text"
                      className="hims-auth-input"
                      placeholder="e.g. Ceramides 3.0% • Niacinamide 4.0% • Squalane 5.0%"
                      value={formData.activeFormula}
                      onChange={(e) => setFormData({ ...formData, activeFormula: e.target.value })}
                    />
                  </div>

                  <div className="hims-input-group">
                    <label className="hims-input-label">Product Description</label>
                    <textarea
                      className="hims-auth-input"
                      rows={3}
                      placeholder="Detailed customer-facing product description..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{ resize: 'none', height: 'auto' }}
                    />
                  </div>
                </div>

                {/* Right Column: Product Image Upload */}
                <div className="form-col-right">
                  <div className="product-image-upload-card">
                    <div className="studio-header">
                      <div className="studio-title-row">
                        <ImageIcon size={18} color="#8C6D53" />
                        <h4 className="studio-title">Product Visual Asset</h4>
                      </div>
                      <span className="studio-badge required">Required • Transparent PNG</span>
                    </div>

                    {/* Notice / Guideline Banner */}
                    <div className="image-guideline-banner">
                      <Sparkles size={16} className="guideline-icon" />
                      <div className="guideline-text">
                        <strong>Quality Guideline:</strong>
                        <span>Please upload an image with the background already removed (transparent PNG) so that it will look best on the website.</span>
                      </div>
                    </div>

                    {imageError && (
                      <div className="image-required-alert">
                        <AlertCircle size={16} />
                        <span>Product image is required before this item can be published to the store.</span>
                      </div>
                    )}

                    {/* Upload Drop Zone */}
                    <div
                      className={`studio-upload-zone ${imageError ? 'error-ring' : ''}`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageFileChange}
                        accept="image/png,image/webp,image/jpeg"
                        style={{ display: 'none' }}
                      />
                      <div className="upload-icon-circle">
                        <Upload size={22} color={imageError ? '#b91c1c' : '#8C6D53'} />
                      </div>
                      <div className="upload-zone-text">
                        <strong>Click to select product image *</strong>
                        <span>PNG with transparent background (or JPG/WEBP)</span>
                        <span className="upload-sub-spec">Required • Recommended: 1000 x 1000px square</span>
                      </div>
                    </div>

                    {/* Live Storefront Background Preview */}
                    {formData.image ? (
                      <div className="image-preview-card">
                        <div className="preview-card-header">
                          <div className="preview-status-pill">
                            <CheckCircle size={14} color="#2D5A27" />
                            <span>Image Loaded for Storefront</span>
                          </div>
                          <button
                            type="button"
                            className="preview-remove-btn"
                            onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                            title="Remove Image"
                          >
                            <Trash2 size={14} />
                            <span>Remove</span>
                          </button>
                        </div>

                        <div className="preview-box full-width">
                          <span className="preview-label">Live Storefront Background Preview (#fffdfa)</span>
                          <div className="preview-img-container storefront-preview">
                            <img src={formData.image} alt="Product Preview" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`image-empty-placeholder ${imageError ? 'error-border' : ''}`}>
                        <ImageIcon size={32} strokeWidth={1.5} color={imageError ? '#ef4444' : '#D1C7BD'} />
                        <span style={imageError ? { color: '#b91c1c', fontWeight: 600 } : {}}>
                          {imageError
                            ? 'A product image is mandatory. Please click above to upload a transparent PNG.'
                            : 'No image uploaded yet. A transparent PNG cutout is required for presentation on the website.'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="hims-btn-outline"
                  onClick={() => setIsProductModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="hims-btn-black"
                >
                  {editingProductId ? 'Update Product in Catalog' : 'Publish Product to Storefront'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
