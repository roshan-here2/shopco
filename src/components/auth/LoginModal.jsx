import React from 'react';
import { Link } from 'react-router-dom';
import './LoginModal.css';

export default function LoginModal({ onClose }) {
  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close" onClick={onClose} aria-label="Close">×</button>
        <h2>Please Sign Up or Log In to Proceed</h2>
        <p>You need an account to place an order.</p>
        <div className="login-modal-actions">
          <Link to="/login" className="login-modal-btn primary" onClick={onClose}>Log In</Link>
          <Link to="/register" className="login-modal-btn secondary" onClick={onClose}>Sign Up</Link>
          <button className="login-modal-btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
