"use client";

import React, { useState, useEffect } from 'react';

interface GstinVerificationProps {
  initialVerifiedName?: string | null;
  // Placeholder for a function to notify parent components of verification status if needed
  // onVerificationComplete?: (result: { success: boolean; name?: string; message: string }) => void;
}

const GstinVerification: React.FC<GstinVerificationProps> = ({
  initialVerifiedName,
  // onVerificationComplete 
}) => {
  const [gstin, setGstin] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [verifiedName, setVerifiedName] = useState<string | null>(initialVerifiedName || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialVerifiedName) {
      setVerifiedName(initialVerifiedName);
    }
  }, [initialVerifiedName]);

  const handleVerifyGstin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setVerifiedName(null); // Clear previous verified name on new attempt

    if (!gstin.trim()) {
      setMessage('Please enter a GSTIN.');
      setIsLoading(false);
      return;
    }

    // Placeholder for getting the auth token.
    // In a real app, this would come from context, localStorage, a zustand store, etc.
    const authToken = localStorage.getItem('authToken'); // Example: "YOUR_JWT_TOKEN_HERE"; 
    
    if (!authToken) {
        setMessage('Authentication token not found. Please ensure you are logged in.');
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch('/api/v1/manufacturer/verify-gstin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // The Authorization header is crucial for protected routes.
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ gstin }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setVerifiedName(data.data.name);
        setMessage(`Successfully verified. Legal Name: ${data.data.name}`);
        // if (onVerificationComplete) {
        //   onVerificationComplete({ success: true, name: data.data.name, message: data.message });
        // }
      } else {
        setMessage(data.message || 'Verification failed. Please try again.');
        // if (onVerificationComplete) {
        //   onVerificationComplete({ success: false, message: data.message || 'Verification failed.' });
        // }
      }
    } catch (error) {
      console.error('GSTIN verification request failed:', error);
      setMessage('An error occurred while trying to verify the GSTIN. Please check your network connection and try again.');
      // if (onVerificationComplete) {
      //   onVerificationComplete({ success: false, message: 'Network or client-side error.' });
      // }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-sm max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">GSTIN Verification</h3>
      
      <div className="mb-4">
        <label htmlFor="gstinInput" className="block text-sm font-medium text-gray-700 mb-1">
          Enter GSTIN:
        </label>
        <input
          id="gstinInput"
          type="text"
          value={gstin}
          onChange={(e) => setGstin(e.target.value.toUpperCase())}
          placeholder="E.g., 29AABCU9603R1ZJ"
          maxLength={15}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <button
        onClick={handleVerifyGstin}
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
      >
        {isLoading ? 'Verifying...' : 'Verify GSTIN'}
      </button>

      {message && (
        <p className={`mt-3 text-sm ${verifiedName ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
      
      {/* Display area for initial or successfully fetched verified name, distinct from transient messages */}
      {verifiedName && !message?.includes('Successfully verified') && (
         <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-md">
            <p className="text-sm font-medium text-green-700">
                Verified Legal Name: <span className="font-bold">{verifiedName}</span>
            </p>
         </div>
      )}
    </div>
  );
};

export default GstinVerification;