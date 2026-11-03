import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CheckOut.css";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "../auth/LoginModal";
import { ordersAPI, cartAPI } from "../../api/client";

function getCartItemKey(item) {
  return [item.id, item.size || "", item.color || ""].map(String).join("::");
}

function getStoredCart() {
  try {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!Array.isArray(stored)) return [];
    return stored
      .filter((item) => item && item.id !== undefined && item.id !== null)
      .map((item) => ({
        ...item,
        quantity: Math.max(1, Number.parseInt(item.quantity, 10) || 1),
        price: Number(item.price) || 0,
      }));
  } catch {
    return [];
  }
}

function Cart() {
  const [cartItems, setCartItems] = useState(getStoredCart);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, user } = useAuth();

  const [shipping, setShipping] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA",
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (err) {}
  }, [cartItems]);

  useEffect(() => {
    if (user) {
      setShipping((s) => ({ ...s, fullName: user.name || "", email: user.email || "" }));
    }
  }, [user]);

  const increaseQuantity = (itemKey) => {
    setCartItems((items) =>
      items.map((item) =>
        getCartItemKey(item) === itemKey
          ? { ...item, quantity: Math.max(1, Number(item.quantity) || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (itemKey) => {
    setCartItems((items) =>
      items.map((item) =>
        getCartItemKey(item) === itemKey
          ? { ...item, quantity: Math.max(1, (Number(item.quantity) || 1) - 1) }
          : item
      )
    );
  };

  const removeItem = (itemKey) => {
    setCartItems((items) => items.filter((item) => getCartItemKey(item) !== itemKey));
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = Math.round(subtotal * 0.2);
  const deliveryFee = cartItems.length > 0 ? 15 : 0;
  const total = subtotal - discount + deliveryFee;

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return;
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setShowShipping(true);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Sync cart to backend then create order
      for (const item of cartItems) {
        try {
          await cartAPI.add({
            productId: item.id,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          });
        } catch (_) {
          // product id may be numeric from seed - backend uses ObjectId; try continuing
        }
      }

      const data = await ordersAPI.create({
        shippingInfo: shipping,
        paymentMethod: "Cash on Delivery",
        items: cartItems,
      });

      setCartItems([]);
      localStorage.removeItem("cart");
      setOrderSuccess(data.order);
      setShowShipping(false);
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <section className="cart-page">
        <div className="order-success" style={{ textAlign: "center", padding: "60px 20px" }}>
          <h1>Order Placed Successfully!</h1>
          <p>Order number: <strong>{orderSuccess.orderNumber}</strong></p>
          <p>Total: ${orderSuccess.total}</p>
          <p>Status: {orderSuccess.status}</p>
          <Link to="/" className="continue-shopping-btn" style={{ display: "inline-block", marginTop: 20 }}>
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      <div className="cart-breadcrumb">
        <span>Home</span>
        <span>›</span>
        <span>Cart</span>
      </div>

      <h1 className="cart-title">YOUR CART</h1>

      <div className="cart-layout">
        <div className="cart-products">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemKey = getCartItemKey(item);
              return (
              <div className="cart-item" key={itemKey}>
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  {item.size && <p>Size: {item.size}</p>}
                  {item.color && <p>Color: {item.color}</p>}
                  <p className="cart-item-price">${item.price}</p>
                  <button className="remove-btn" onClick={() => removeItem(itemKey)} aria-label={`Remove ${item.name} from cart`}>Remove</button>
                </div>
                <div className="cart-item-controls">
                  <strong className="cart-line-total">${(Number(item.price) * Number(item.quantity)).toFixed(2)}</strong>
                  <div className="quantity-box" aria-label={`Quantity for ${item.name}`}>
                    <button type="button" onClick={() => decreaseQuantity(itemKey)} aria-label="Decrease quantity">−</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => increaseQuantity(itemKey)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
              </div>
              );
            })
          )}
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>${subtotal}</strong>
          </div>
          <div className="summary-row discount-row">
            <span>Discount (-20%)</span>
            <strong>-${discount}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <strong>${deliveryFee}</strong>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>${total}</strong>
          </div>

          {!showShipping ? (
            <button
              className="checkout-btn"
              disabled={cartItems.length === 0}
              onClick={handleCheckoutClick}
            >
              Go to Checkout
              <span>→</span>
            </button>
          ) : (
            <form onSubmit={handlePlaceOrder} className="shipping-form" style={{ marginTop: 16 }}>
              <h3 style={{ marginBottom: 12 }}>Shipping Information</h3>
              {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
              <input required placeholder="Full Name" value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
              <input required type="email" placeholder="Email" value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
              <input placeholder="Phone" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
              <input required placeholder="Address" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
              <input required placeholder="City" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
              <input placeholder="State" value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
              <input required placeholder="Postal Code" value={shipping.postalCode} onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
              <button type="submit" className="checkout-btn" disabled={loading}>
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default Cart;
