import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className='nav-bar'>
      <Link to="/" className="nav-logo"><h1>SHOP.CO</h1></Link>

      <div>
        <ul className='nav-links'>
          <li><Link to="/categorycarts">Shop</Link></li>
          <li><Link to="/categorycarts">On Sale</Link></li>
          <li><Link to="/">New Arrivals</Link></li>
          <li><a href="#brands">Brands</a></li>
          <li><Link to="/checkout">Cart</Link></li>
        </ul>
      </div>

      <div className='nav-search-bar'>
        <input type='text' placeholder='Search for products...' />
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>

      <div className='nav-icons'>
        <Link to="/checkout" className="nav-icon-link" title="Cart">
          <i className="fa-solid fa-cart-shopping"></i>
        </Link>
        {isAuthenticated ? (
          <div className="nav-user">
            <span className="nav-user-name">{user?.name}</span>
            <button type="button" className="nav-logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="nav-login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
