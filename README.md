# Customer E-Commerce Frontend (SHOP.CO)

React + Vite storefront connected to the e-commerce backend.

## Installation

```bash
cd ecommerce-frontend
npm install
```

## Environment

Create `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

## Start

```bash
npm run dev
```

Runs on `http://localhost:5173` (default Vite port).

## Features

- Browse products (static data + API ready)
- Cart (localStorage)
- Login / Register required before placing order
- "Please Sign Up or Log In to Proceed" modal when guest tries checkout
- Order placement with shipping form
- User session in navbar

## Demo accounts

After seeding backend:
- `demo@shop.co` / `password123`

## Notes

Product list currently uses local `productsd.js` for design fidelity. Cart stores product ids; when placing order the backend validates stock and prices. Prefer fetching products from `/api/products` for production.
