import React from "react";

type Props = {
  initialVerifiedName: string | null;
};

export default function GstinVerification({ initialVerifiedName }: Props) {
  return (
    <div className="border p-4 rounded-md shadow-sm bg-white dark:bg-gray-900">
      <h3 className="text-lg font-semibold mb-2">GSTIN Verification</h3>
      <p>
        {initialVerifiedName
          ? `Verified Name: ${initialVerifiedName}`
          : "No GSTIN verified yet."}
      </p>
    </div>
  );
}
