import React, { useState, useRef } from 'react';
import { Upload, Link, X, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { uploadImageToCloudinary, validateImageUrl } from '../../utils/cloudinaryUpload';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  index: number;
  showRemove: boolean;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  onRemove,
  index,
  showRemove
}) => {
  const [uploadMode, setUploadMode] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [preview, setPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setMessage(null);

    try {
      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const cloudinaryUrl = await uploadImageToCloudinary(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
      setPreview('');
      
      onChange(cloudinaryUrl);
      showMessage('success', 'Image uploaded successfully!');
      
    } catch (error: any) {
      console.error('Upload error:', error);
      showMessage('error', error.message);
      
      // Clean up preview on error
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview('');
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    
    if (url && !validateImageUrl(url)) {
      showMessage('error', 'Please use a valid image URL from supported domains (Cloudinary, Unsplash, Pexels, etc.)');
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border border-gray-600 rounded-lg p-4 bg-gray-750">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-300">
          Image {index + 1}
        </label>
        <div className="flex items-center space-x-2">
          {/* Mode Toggle */}
          <div className="flex bg-gray-700 rounded-md p-1">
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              className={`px-3 py-1 text-xs rounded transition-colors flex items-center space-x-1 ${
                uploadMode === 'url'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Link className="w-3 h-3" />
              <span>URL</span>
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('upload')}
              className={`px-3 py-1 text-xs rounded transition-colors flex items-center space-x-1 ${
                uploadMode === 'upload'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Upload className="w-3 h-3" />
              <span>Upload</span>
            </button>
          </div>
          
          {showRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900 rounded"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* URL Input Mode */}
      {uploadMode === 'url' && (
        <div className="space-y-2">
          <input
            type="url"
            placeholder="Paste image URL here..."
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400">
            Supported: Cloudinary, Unsplash, Pexels, Pixabay URLs
          </p>
        </div>
      )}

      {/* Upload Mode */}
      {uploadMode === 'upload' && (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <button
            type="button"
            onClick={triggerFileUpload}
            disabled={uploading}
            className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <>
                <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin mb-2"></div>
                <span className="text-sm text-gray-300">Uploading... {uploadProgress}%</span>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-300">Click to upload image</span>
                <span className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP (max 5MB)</span>
              </>
            )}
          </button>

          {uploading && (
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {(value || preview) && (
        <div className="mt-3">
          <div className="relative">
            <img
              src={preview || value}
              alt={`Product image ${index + 1}`}
              className="w-full h-32 object-cover rounded-md border border-gray-600"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                <div className="text-white text-sm">Uploading...</div>
              </div>
            )}
          </div>
          {value && !uploading && (
            <p className="text-xs text-gray-400 mt-1 truncate">
              {value.includes('cloudinary.com') ? '☁️ Cloudinary' : '🔗 External'} • {value}
            </p>
          )}
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`mt-3 p-2 rounded-md flex items-center space-x-2 text-sm ${
          message.type === 'success'
            ? 'bg-green-900 border border-green-700 text-green-300'
            : 'bg-red-900 border border-red-700 text-red-300'
        }`}>
          {message.type === 'success' ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;