'use client';

import React from 'react';

interface RegistrationSuccessProps {
  registrationNumber: string;
  registrationDate: string;
  nameOfEnterprise: string;
  onNewRegistration: () => void;
}

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  registrationNumber,
  registrationDate,
  nameOfEnterprise,
  onNewRegistration
}) => {
  const formattedDate = new Date(registrationDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Registration Successful!
        </h2>
        <p className="text-gray-600">
          Your Udyam Registration has been completed successfully.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Registration Details</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-gray-600">Registration Number:</span>
            <span className="font-mono font-bold text-green-600 text-lg">
              {registrationNumber}
            </span>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="text-gray-600">Enterprise Name:</span>
            <span className="font-semibold text-gray-800">
              {nameOfEnterprise}
            </span>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="text-gray-600">Registration Date:</span>
            <span className="text-gray-800">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Important:</strong> Please save your registration number for future reference. 
          A confirmation email has been sent to your registered email address.
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
        >
          Print Certificate
        </button>
        
        <button
          onClick={onNewRegistration}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
        >
          New Registration
        </button>
      </div>
    </div>
  );
};

export default RegistrationSuccess;