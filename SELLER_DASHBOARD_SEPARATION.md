# 🏬 Seller Dashboard Separation Guide

**Date:** February 3, 2026  
**Purpose:** Complete guide for separating the seller dashboard as a standalone application

---

## 📋 Table of Contents
1. Files to Keep
2. Files to Remove
3. Folder Structure
4. Dependencies to Keep
5. Modifications Required
6. Checklist & After Cleanup Steps

---

## ✅ Files to Keep

### Core Application Files
```
Root Level:
├── index.html ✓
├── main.tsx ✓
├── App.tsx ✓ (MODIFY)
├── vite-env.d.ts ✓
├── index.css ✓
└── package.json ✓ (MODIFY)
```

### Configuration Files
```
src/config/
├── firebase.ts ✓
└── constants.ts ✓
```

### Type Definitions
```
src/types/
└── index.ts ✓
   - Keep: User, Product, Order, OrderItem, SellerProfile interfaces
   - Remove: DeliveryRecord, DeliveryAssignment interfaces (if not used)
```

### Custom Hooks
```
src/hooks/
└── useAuth.ts ✓
└── useStockManager.ts ✓ (keep for seller inventory)
```

### Utilities
```
src/utils/
├── pincodeUtils.ts ✓ (if location features used)
├── qrUtils.ts ✓ (if scanning for returns or deliveries required)
└── upiUtils.ts ✓ (if seller payments are handled)
```

### Components - Seller Module
```
src/components/Seller/
├── SellerDashboard.tsx ✓ (Main dashboard)
├── SellerOrders.tsx ✓ (Order list & management)
├── SellerProducts.tsx ✓ (Product management)
├── SellerProfile.tsx ✓ (Profile & settings)
```

### Components - Authentication
```
src/components/Auth/
├── Login.tsx ✓
└── ProtectedRoute.tsx ✓
```

### Components - Layout
```
src/components/Layout/
├── Header.tsx ✓
└── Footer.tsx ✓
```

### Components - UI
```
src/components/UI/
└── LoadingSpinner.tsx ✓
```

### Public Assets
```
public/
├── assets/ ✓
└── favicon.ico ✓
```

### Build & Config Files
```
├── vite.config.ts ✓
├── tsconfig.json ✓
├── tsconfig.app.json ✓
├── tsconfig.node.json ✓
├── tailwind.config.js ✓
├── postcss.config.js ✓
├── eslint.config.js ✓
├── vercel.json ✓
├── .gitignore ✓
└── .env.example ✓ (update keys)
```

---

## ❌ Files to Remove

> Remove UI/modules unrelated to seller (move to backup branch before deleting).

### Admin Components (Entire Folder)
```
src/components/Admin/ ❌ DELETE ENTIRE FOLDER
├── AdminDashboard.tsx
├── AdminOrders.tsx
├── AdminProducts.tsx
└── AdminUsers.tsx
```

### Customer Components (Entire Folder)
```
src/components/Customer/ ❌ DELETE ENTIRE FOLDER
├── Cart.tsx
├── HomePage.tsx
└── ProductCard.tsx
```

### Delivery Components (Entire Folder)
```
src/components/Delivery/ ❌ DELETE ENTIRE FOLDER
├── DeliveryDashboard.tsx
├── DeliveryOrders.tsx
├── DeliveryScanner.tsx
├── OrderDetailsModal.tsx
└── QRScanner.tsx
```

### Unused Hooks
```
src/hooks/
├── useCart.ts ❌
```

### Unused Utilities
```
src/utils/
├── upiUtils.ts ⚠️ (keep only if seller handles payouts)
└── (Any other delivery-specific utils)
```

### Context Folder
```
src/context/ ❌ (remove if not used by seller stack)
```

---

## 📁 Final Folder Structure (seller-only)

```
seller-dashboard/
│
├── public/
│   ├── assets/
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── Seller/
│   │   │   ├── SellerDashboard.tsx
│   │   │   ├── SellerOrders.tsx
│   │   │   ├── SellerProducts.tsx
│   │   │   └── SellerProfile.tsx
│   │   ├── Layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── UI/
│   │       └── LoadingSpinner.tsx
│   │
│   ├── config/
│   │   ├── firebase.ts
│   │   └── constants.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useStockManager.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── pincodeUtils.ts
│   │   └── qrUtils.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
│
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── vercel.json
└── .env.example
```

---

## 📦 Dependencies to Keep

### Essential Dependencies
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "firebase": "^10.x",
    "date-fns": "^2.x",
    "lucide-react": "^0.x",
    "@headlessui/react": "^1.x", // optional UI helpers for seller forms
    "react-hook-form": "^7.x" // optional for product forms
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vite": "^5.x",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x",
    "@vitejs/plugin-react": "^4.x",
    "eslint": "^8.x"
  }
}
```

### Remove These Dependencies
```
- delivery-specific libs (e.g., @zxing/library) if not used by seller
- cart/customer libs
- admin-only tooling
```

---

## 🔧 Modifications Required

### 1. `App.tsx` Changes

- Remove non-seller imports:
```
import DeliveryDashboard from './components/Delivery/DeliveryDashboard';
import HomePage from './components/Customer/HomePage';
import AdminDashboard from './components/Admin/AdminDashboard';
```
- Keep only seller routes and auth routes:
```
- /login (Login component)
- /seller (SellerDashboard with ProtectedRoute)
Redirect `/` to `/seller` if authenticated, otherwise `/login`.
```

### 2. `types/index.ts` Changes

- Keep these interfaces:
  - `User` (auth)
  - `Product` (seller product management)
  - `Order` and `OrderItem` (seller orders)
  - `SellerProfile`
- Remove: delivery-only types and any customer-only types (CartItem etc.)

### 3. `constants.ts` Changes

- Keep seller-relevant constants:
  - `USER_ROLES` (filter to include `SELLER` role)
  - `PRODUCT_CATEGORIES` (if needed)
- Remove admin/delivery constants

### 4. `package.json` Changes

- Update `name` to "seller-dashboard"
- Update `description` to reflect seller-only purpose
- Set `version` to `1.0.0`
- Remove unused scripts and dependencies

### 5. Firebase Configuration

- Ensure `src/config/firebase.ts` is configured for seller app
- Update `.env.example` to include only necessary Firebase keys:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`

---

## 🎯 Summary

| Category | Count | Action |
|----------|-------|--------|
| Components to Keep | 4 | Seller module (4 files) |
| Helper Components to Keep | 5 | Auth, Layout, UI (5 files) |
| Components to Remove | 12+ | Admin (4), Customer (3), Delivery (5) |
| Hooks to Keep | 2 | useAuth, useStockManager |
| Hooks to Remove | 1 | useCart |
| Utilities to Keep | 2-3 | pincodeUtils, qrUtils, optionally upiUtils |

---

## ✨ Before You Start

- [ ] Backup your current project
- [ ] Commit changes to git before deleting files
- [ ] Verify all imports in remaining files
- [ ] Test the application after cleanup
- [ ] Update environment variables (.env)
- [ ] Update README.md to reflect seller-only purpose
- [ ] Run build and verify no errors

---

## 🚀 After Cleanup Steps

1. Delete unnecessary files (marked with ❌) after backing up
2. Update `App.tsx` with simplified routing for seller
3. Run `npm install` to clean up dependencies
4. Update `package.json` with correct metadata
5. Test all seller features (Products, Orders, Profile)
6. Deploy to your platform (Vercel, etc.)

---

**Status:** Ready for implementation  
**Last Updated:** February 3, 2026
