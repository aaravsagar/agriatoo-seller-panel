# QR Code Utility - Quick Reference

## File Location
`src/utils/qrCodeGenerator.ts`

## Functions Available

### 1. generateQRCodeDataUrl()
```typescript
const dataUrl = await generateQRCodeDataUrl('order-12345');
// Returns: PNG image as Data URL
// Use: <img src={dataUrl} alt="QR Code" />
```

### 2. generateQRCodeSVG()
```typescript
const svg = await generateQRCodeSVG('product-abc-123');
// Returns: SVG string
// Use: Embed in HTML or print-friendly documents
```

### 3. generateQRCodeCanvas()
```typescript
const canvas = document.getElementById('my-canvas') as HTMLCanvasElement;
await generateQRCodeCanvas('tracking-id', canvas);
// Renders directly to canvas element
```

### 4. generatePrintableQRCode()
```typescript
const printableDataUrl = await generatePrintableQRCode('order-12345');
// Returns: High-quality PNG optimized for printing
// Use: Thermal printer receipts with high error correction
```

### 5. generatePrintableQRCodeSVG() ⭐ Currently Used
```typescript
const printableSvg = await generatePrintableQRCodeSVG('order-12345');
// Returns: SVG string optimized for thermal printer
// Use: Embedded in HTML for direct printing
```

## Current Usage in App

### SellerOrders.tsx (Receipt Generation)
```typescript
import { generatePrintableQRCodeSVG } from '../../utils/qrCodeGenerator';

// In generateReceiptContent()
const qrSvg = await generatePrintableQRCodeSVG(order.orderId);
// Embedded in receipt HTML for printing
```

## Customization Example

```typescript
import { generateQRCodeDataUrl } from '../../utils/qrCodeGenerator';

// Custom options
const customQR = await generateQRCodeDataUrl('my-data', {
  errorCorrectionLevel: 'H',    // Higher error correction
  width: 300,                   // Larger size
  margin: 3,                    // More quiet zone
  quality: 0.99                 // Maximum quality
});
```

## Error Handling

All functions include try-catch and throw errors:
```typescript
try {
  const qr = await generatePrintableQRCodeSVG(data);
} catch (error) {
  console.error('QR generation failed:', error);
  // Use fallback SVG
}
```

## Performance Tips

- 📦 Use **SVG** for web/print - vector format, scalable
- 📸 Use **DataURL** for images - raster format, embedded
- 🎨 Use **Canvas** for real-time preview - fastest rendering
- ⚡ Cache generated QR codes if used repeatedly

## Supported Options

```typescript
interface Options {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';  // L = 7%, M = 15%, Q = 25%, H = 30%
  type?: 'image/png' | 'image/jpeg' | 'image/svg+xml';
  quality?: number;   // 0.0 - 1.0 (PNG quality)
  margin?: number;    // Quiet zone size in modules
  width?: number;     // Size in pixels
  color?: {
    dark?: string;    // Foreground color (hex)
    light?: string;   // Background color (hex)
  };
}
```

## Error Correction Levels

| Level | Error Correction | Use Case |
|-------|-----------------|----------|
| L | ~7% | Display/Screen QR codes |
| M | ~15% | Standard usage (default) |
| Q | ~25% | Print with possible wear |
| H | ~30% | Thermal printers/Labels ⭐ |

---

**Need to use QR codes elsewhere?** Just import from `src/utils/qrCodeGenerator.ts` and pick the function that fits your use case!
