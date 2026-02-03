import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
        <div className="flex items-center justify-center space-x-2">
          <img src="/assets/icon.jpeg" alt="AGRIATOO" className="w-6 h-6 rounded object-cover" />
          <p className="text-gray-600">Loading AGRIATOO...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;