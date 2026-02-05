# AGRIATOO - Agricultural Marketplace Seller Panel

A modern React-based seller dashboard for agricultural marketplace management.

## Features

### 🌾 Product Management
- Add/Edit/Delete agricultural products
- **Image Upload with Cloudinary** - Upload real product images or paste URLs
- Real-time stock management with low stock alerts
- Category-based product organization
- Multi-image support (up to 5 images per product)

### 📦 Order Management
- Real-time order tracking and status updates
- Bulk receipt printing for thermal printers
- QR code generation for order tracking
- Permanent delivery partner assignment
- Order cancellation with stock restoration

### 🚚 Delivery Integration
- Automatic delivery area calculation based on pincode
- Real-time pincode validation using Indian Postal API
- Distance-based delivery radius configuration
- Delivery partner management

### 🔔 Smart Notifications
- Real-time order notifications with sound alerts
- Low stock alerts with restock functionality
- Visual notification modals for new orders

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication)
- **Image Storage**: Cloudinary
- **QR Codes**: qrcode library
- **Icons**: Lucide React
- **Build Tool**: Vite

## Environment Setup

Create a `.env` file with the following variables:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_API_KEY=your_api_key_here
VITE_CLOUDINARY_API_SECRET=your_api_secret_here
VITE_CLOUDINARY_UPLOAD_PRESET=agriatoo_products

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Create an upload preset named `agriatoo_products`:
   - Go to Settings → Upload → Upload presets
   - Click "Add upload preset"
   - Set preset name: `agriatoo_products`
   - Set signing mode: "Unsigned"
   - Set folder: `agriatoo/products`
   - Enable auto-optimization and format conversion

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Features

### Image Upload System
- **Dual Mode**: Upload files or paste URLs
- **Cloudinary Integration**: Automatic upload to `agriatoo/products/` folder
- **Image Validation**: File type, size, and URL validation
- **Preview**: Real-time image preview with upload progress
- **Error Handling**: Comprehensive error messages and retry logic

### Stock Management
- **Real-time Updates**: Live stock synchronization across all users
- **Low Stock Alerts**: Automatic notifications when stock runs low
- **Bulk Operations**: Update multiple products simultaneously
- **Stock History**: Track stock changes and order impacts

### Order Processing
- **Status Workflow**: received → packed → out_for_delivery → delivered
- **Receipt Generation**: Thermal printer-optimized receipts with QR codes
- **Delivery Assignment**: Automatic or manual delivery partner assignment
- **Bulk Printing**: Print multiple order receipts at once

### Pincode System
- **Live Validation**: Real-time pincode verification using Indian Postal API
- **Coverage Calculation**: Automatic delivery area generation based on radius
- **Distance Optimization**: Smart delivery route optimization
- **Multi-state Support**: Works across all Indian states

## Project Structure

```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Layout/         # Header, Footer, Navigation
│   ├── Seller/         # Seller dashboard components
│   └── UI/             # Reusable UI components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── config/             # Configuration files
```

## Security Features

- **Firebase Authentication**: Secure user authentication
- **Role-based Access**: Seller-only access control
- **Input Validation**: Comprehensive form validation
- **Image Security**: File type and size validation
- **API Protection**: Environment variable protection

## Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Cloudinary auto-optimization
- **Caching**: Pincode and image caching
- **Real-time Updates**: Efficient Firestore listeners
- **Bundle Optimization**: Vite-powered build optimization

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software for AGRIATOO marketplace.

---

**AGRIATOO** - Empowering Indian Agriculture through Technology 🌾