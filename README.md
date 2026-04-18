# Cart System TypeScript

A React + TypeScript storefront with a persistent client-side cart, Stripe checkout, an Express backend, MongoDB order storage, and a product customization flow for stamp-based designs.

The project currently supports two shopping modes:

- Standard catalog products loaded from local JSON data
- Customizable products with canvas-based mockups, preset PNG stamp designs, user PNG uploads, and saved customization metadata in the cart

## Overview

This repository is split into two main parts:

- `src/`: the Vite/React frontend deployed to Vercel
- `server/`: the Express backend intended for Railway deployment

The frontend is responsible for:

- Routing and page rendering
- Product browsing
- Cart state and persistence in local storage
- Product customization UI
- Uploading customer PNG files for fulfillment
- Redirecting the user into Stripe Checkout

The backend is responsible for:

- Creating Stripe checkout sessions
- Receiving Stripe webhooks
- Persisting completed order metadata in MongoDB
- Uploading customer PNG files to Cloudflare R2 and returning a public URL

## Current Feature Set

### Storefront

- Homepage with:
  - ready-to-buy catalog items
  - a customizable product section for stampable products
- Product detail page for standard store items
- About page
- Payment success and failed pages

### Shopping Cart

- Cart state stored in React context
- Cart contents persisted in local storage
- Quantity increase/decrease/remove controls
- Support for both standard products and customized products
- Custom items are treated as distinct cart lines based on their customization payload, not just item id/size

### Product Customization

- Dedicated routes for:
  - `/customize/tshirt`
  - `/customize/hoodie`
  - `/customize/sweater`
  - `/customize/glasscup`
  - `/customize/hat`
  - `/customize/apron`
  - `/customize/totebag`
- Canvas mockup preview with:
  - draggable design overlay
  - scale controls
  - rotation controls
  - reset positioning
- Preset PNG design picker
- Multiple user PNG uploads retained in the same session
- Uploads stored in Cloudflare R2 through the backend
- Customization metadata saved into the cart, including:
  - product type
  - color
  - size
  - material
  - design source and URL
  - transform position, scale, and rotation

### Payments and Orders

- Stripe Checkout session creation on the backend
- Stripe webhook handling
- Order persistence to MongoDB after successful payment
- Checkout metadata includes cart item information for downstream order handling
- Server-side cart quoting for the review page before payment
- Stripe Checkout remains the final source of truth for automatic tax and final shipping address collection

### Stripe Dashboard Checks

Verify these settings before production checkout goes live:

- Stripe Tax is enabled for the account
- Checkout is allowed to calculate tax automatically
- Line items are treated as tax-exclusive
  The backend explicitly sends `tax_behavior: "exclusive"` when creating Checkout Session line items.
- Shipping address collection is enabled through the Checkout Session flow
- The webhook endpoint is subscribed to at least:
  - `checkout.session.completed`
  - `checkout.session.async_payment_succeeded`

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router v7
- React Bootstrap
- Bootstrap 5
- React Icons
- React Helmet Async

### Backend

- Express 5
- TypeScript
- Stripe SDK
- Mongoose
- Multer
- Cloudflare R2 via AWS S3-compatible SDK
- CORS
- dotenv

## Frontend Dependencies

From the root `package.json`:

```json
{
  "dependencies": {
    "bootstrap": "^5.3.7",
    "mongoose": "^9.4.1",
    "react": "^19.1.0",
    "react-bootstrap": "^2.10.10",
    "react-dom": "^19.1.0",
    "react-helmet-async": "^3.0.0",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.6.3",
    "stripe": "^22.0.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.29.0",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^4.5.2",
    "eslint": "^9.29.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.2.0",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.34.1",
    "vite": "^7.0.0"
  }
}
```

Notes:

- `mongoose` and `stripe` appear in the root frontend package, although the backend owns the runtime usage.
- The frontend is built with Vite and uses a dev proxy for `/api`, `/checkout`, and `/webhook`.

## Backend Dependencies

From `server/package.json`:

```json
{
  "dependencies": {
    "@aws-sdk/client-s3": "^3.1030.0",
    "@aws-sdk/lib-storage": "^3.1030.0",
    "cors": "^2.8.6",
    "dotenv": "^17.4.1",
    "express": "^5.2.1",
    "mongoose": "^9.4.1",
    "multer": "^2.1.1",
    "stripe": "^22.0.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/multer": "^2.1.0",
    "@types/node": "^25.5.2",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^6.0.2"
  }
}
```

## Project Structure

```bash
cart-system-typescript/
├── dist/                              # Frontend production build output
├── public/                            # Public frontend assets
├── server/                            # Express / Stripe / Mongo / R2 backend
│   ├── src/
│   │   └── lib/
│   │       └── r2Client.ts            # Cloudflare R2 S3-compatible client
│   ├── index.ts                       # Main Express server entry
│   ├── package.json                   # Backend dependencies and scripts
│   ├── package-lock.json
│   └── tsconfig.json
├── src/                               # Frontend source
│   ├── assets/
│   │   ├── designs/
│   │   │   ├── stampDesign1.png       # Preset stamp design asset
│   │   │   └── stampDesign2.png       # Preset stamp design asset
│   │   └── react.svg
│   ├── components/
│   │   ├── CartItem.tsx               # Cart row renderer
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx            # Reusable product card for custom entry points
│   │   ├── ShoppingCart.tsx           # Offcanvas cart and checkout trigger
│   │   └── StoreItem.tsx              # Standard store item card with cart actions
│   ├── context/
│   │   └── ShoppingCartContext.tsx    # Cart state, persistence, and cart item types
│   ├── data/
│   │   ├── customProducts.ts          # Stampable customizable product definitions
│   │   └── items.json                 # Standard catalog data
│   ├── hooks/
│   │   └── useLocalStorage.ts         # Local storage persistence hook
│   ├── pages/
│   │   ├── About.tsx
│   │   ├── Failed.tsx
│   │   ├── Home.tsx
│   │   ├── ProductCustomizer.tsx      # Canvas customizer, upload flow, add-to-cart integration
│   │   ├── ProductPage.tsx
│   │   └── Success.tsx
│   ├── utilities/
│   │   └── formatCurrency.ts
│   ├── App.tsx                        # Route definitions
│   ├── index.css                      # Global and component-level app styling
│   ├── main.tsx                       # Frontend entry point
│   └── vite-env.d.ts
├── eslint.config.js
├── index.html
├── LICENSE
├── package.json                       # Frontend dependencies and scripts
├── package-lock.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json                        # Vercel deployment config
└── vite.config.ts                     # Vite config and dev proxy setup
```

## Important Frontend Files

### `src/App.tsx`

Defines all current frontend routes, including the 7 customization routes.

### `src/context/ShoppingCartContext.tsx`

The central cart store for the frontend. This file currently:

- stores cart state in local storage
- exposes cart operations through context
- supports standard items and customized items
- differentiates cart rows using `id`, `size`, and serialized customization metadata

### `src/pages/ProductCustomizer.tsx`

The most feature-rich frontend page. It currently handles:

- product-specific option visibility
- color, size, material, and design selection
- canvas rendering and overlay manipulation
- design uploads through `/api/upload-design`
- saving customization metadata to the shopping cart

### `src/components/ShoppingCart.tsx`

Renders the offcanvas cart and posts the current cart to `/checkout`.

## Important Backend Files

### `server/index.ts`

The main Express app. It currently contains:

- MongoDB connection bootstrap
- Stripe webhook route
- Cloudflare R2 upload route at `/api/upload-design`
- checkout session route at `/checkout`
- order persistence after successful Stripe webhook confirmation

### `server/src/lib/r2Client.ts`

Creates the S3-compatible client used for Cloudflare R2 uploads.

## Routes

### Frontend routes

- `/`
- `/about`
- `/product/:id`
- `/customize/tshirt`
- `/customize/hoodie`
- `/customize/sweater`
- `/customize/glasscup`
- `/customize/hat`
- `/customize/apron`
- `/customize/totebag`
- `/payment/success`
- `/payment/failed`

### Backend routes

- `GET /`
- `GET /healthz`
- `POST /checkout`
- `POST /webhook`
- `POST /api/upload-design`

## Cart Data Model

The cart supports a base item shape plus optional customization metadata.

Current cart items include:

```ts
type CartItem = {
  id: number;
  size: string;
  quantity: number;
  customization?: {
    productType: string;
    color?: string;
    size?: string;
    material?: string;
    design: {
      id: string;
      label: string;
      sourceType: "preset" | "upload";
      imageUrl: string;
    };
    transform: {
      x: number;
      y: number;
      scale: number;
      rotationDeg: number;
    };
  };
};
```

This is important because custom items are preserved for fulfillment with:

- the exact chosen design
- whether it came from a preset or a user upload
- the permanent design URL
- placement and transform metadata from the canvas

## PNG Upload Flow

The current upload flow works like this:

1. User chooses a PNG in `ProductCustomizer`
2. Frontend sends `multipart/form-data` to `POST /api/upload-design`
3. Backend validates:
   - file exists
   - file is PNG
   - file is within the 20MB multer limit
4. Backend uploads the image buffer to Cloudflare R2
5. Backend returns a public URL
6. Frontend stores that URL in the selected uploaded design object
7. When the item is added to cart, that URL is saved in customization metadata

Preset PNGs do not go through the backend upload route. Their `imageUrl` is the Vite-resolved static asset URL.

## Environment Variables

### Frontend

In development, the frontend relies on the Vite proxy in `vite.config.ts` so requests to:

- `/api`
- `/checkout`
- `/webhook`

are forwarded to `http://localhost:4000`.

If the Vite dev server is already running and the proxy config changes, the dev server must be restarted.

### Backend

The backend expects at least the following environment variables:

#### General backend / database / Stripe

- `PORT`
- `MONGO_URI`
- `CLIENT_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

#### Cloudflare R2 upload route

- `R2_ENDPOINT`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_URL`

The current backend source documents the R2 values as:

- `R2_ENDPOINT` — `https://<accountid>.r2.cloudflarestorage.com`
- `R2_ACCESS_KEY_ID` — from Cloudflare R2 API token
- `R2_SECRET_ACCESS_KEY` — from Cloudflare R2 API token
- `R2_BUCKET_NAME` — for example `stamplabprints-designs`
- `R2_PUBLIC_URL` — public base URL such as `https://pub-xxxx.r2.dev`

## Local Development

### Frontend

From the repository root:

```bash
npm install
npm run dev
```

This starts the Vite dev server on port `5173`.

### Backend

From `server/`:

```bash
npm install
npm run build
node dist/index.js
```

The current `server/package.json` exposes `build` and `start`, but does not currently define a dedicated hot-reload `dev` script.

### Recommended local workflow

Run both processes at the same time:

1. Start the backend on port `4000`
2. Start the frontend on port `5173`
3. Let Vite proxy `/api`, `/checkout`, and `/webhook` to the backend during development

## Build Commands

### Frontend

```bash
npm run build
```

This runs TypeScript project references and then builds the Vite app.

### Backend

```bash
cd server
npm run build
```

This compiles `server/index.ts` and supporting backend source into `server/dist/`.

## Deployment Notes

The intended deployment model appears to be:

- Frontend on Vercel
- Backend on Railway
- MongoDB for order persistence
- Stripe for checkout and webhook events
- Cloudflare R2 for customer-uploaded PNG storage

For production, make sure:

- frontend and backend origins are configured correctly
- Stripe webhook secret is set in Railway
- `CLIENT_URL` matches the deployed frontend URL
- Cloudflare R2 credentials and public URL are valid
- MongoDB is reachable from the Railway environment

## Current Limitations and Notes

- The backend order model stores the raw `items` array from Stripe webhook metadata, but fulfillment-specific downstream processing is still minimal.
- Root `package.json` still includes some backend-oriented packages that are not frontend runtime concerns.
- The customizer currently supports image placement, scaling, rotation, and cart persistence, but not a final flattened preview export.
- The backend upload route only accepts PNG files.

## Summary

This is no longer a simple demo cart. It is a small full-stack custom merch flow with:

- a React storefront
- a persistent browser cart
- customizable mockup pages
- PNG asset uploads to Cloudflare R2
- Stripe checkout
- Mongo-backed order capture through webhooks

The codebase is organized clearly enough to extend further in three obvious directions:

- richer product data and pricing
- stronger fulfillment tooling
- better production hardening around uploads, order schemas, and admin workflows
