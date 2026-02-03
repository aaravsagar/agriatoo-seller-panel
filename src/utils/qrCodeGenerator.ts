import QRCode from 'qrcode';

/**
 * Generate QR Code as Data URL (PNG)
 * @param text - Text/data to encode
 * @param options - QR Code options
 * @returns Promise<string> - Data URL of the QR code image
 */
export const generateQRCodeDataUrl = async (
  text: string,
  options?: any
): Promise<string> => {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'L',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 200,
      ...options
    });
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Generate QR Code as SVG String
 * @param text - Text/data to encode
 * @param options - QR Code options
 * @returns Promise<string> - SVG string of the QR code
 */
export const generateQRCodeSVG = async (
  text: string,
  options?: any
): Promise<string> => {
  try {
    const svgString = await QRCode.toString(text, {
      errorCorrectionLevel: 'L',
      type: 'image/svg+xml',
      width: 200,
      margin: 1,
      ...options
    });
    return svgString;
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    throw new Error('Failed to generate QR code SVG');
  }
};

/**
 * Generate QR Code as Canvas
 * @param text - Text/data to encode
 * @param canvas - HTML Canvas element
 * @param options - QR Code options
 */
export const generateQRCodeCanvas = async (
  text: string,
  canvas: HTMLCanvasElement,
  options?: any
): Promise<void> => {
  try {
    await QRCode.toCanvas(canvas, text, {
      errorCorrectionLevel: 'L',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 200,
      ...options
    });
  } catch (error) {
    console.error('Error generating QR code on canvas:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Generate QR Code for Print (optimized for 4x4 inch thermal printer)
 * @param text - Text/data to encode
 * @returns Promise<string> - Data URL of the QR code optimized for print
 */
export const generatePrintableQRCode = async (text: string): Promise<string> => {
  return generateQRCodeDataUrl(text, {
    errorCorrectionLevel: 'H', // Higher error correction for better readability
    type: 'image/png',
    quality: 0.95,
    margin: 2,
    width: 200 // Suitable for 4x4 inch thermal printer
  });
};

/**
 * Generate QR Code SVG for Print (optimized for thermal printer)
 * @param text - Text/data to encode
 * @returns Promise<string> - SVG string optimized for print
 */
export const generatePrintableQRCodeSVG = async (text: string): Promise<string> => {
  return generateQRCodeSVG(text, {
    errorCorrectionLevel: 'H',
    type: 'image/svg+xml',
    width: 100, // Size for 4x4 inch thermal printer
    margin: 1
  });
};
