
import React from 'react';
import { AlertCircle } from 'lucide-react';

export const SharedLinkExpired: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Shared Link Expired
        </h1>
        <p className="text-gray-600 mb-6">
          This shared link expired on July 4th, 2025 at 5:00 PM EST. 
          Please contact the person who shared this link with you for access.
        </p>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">
            If you're the owner of this application, you can access it normally without the shared link.
          </p>
        </div>
      </div>
    </div>
  );
};
