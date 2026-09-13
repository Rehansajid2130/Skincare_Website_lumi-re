// ponytail: standard React 18 DOM mount
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/base.css';
import './styles/home.css';
import './styles/product.css';
import './styles/cart.css';
import './styles/order-confirmation.css';
import './styles/auth.css';
import './styles/quiz.css';
import './styles/account.css';
import './styles/admin.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
