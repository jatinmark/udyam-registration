'use client';

import React, { useState } from 'react';
import formSchema from '@/data/udyam-form-schema.json';

interface Step1AadhaarProps {
  onComplete: (data: any) => void;
  initialData?: any;
}

const Step1Aadhaar: React.FC<Step1AadhaarProps> = ({ onComplete, initialData = {} }) => {
  const [formData, setFormData] = useState({
    aadhaar: initialData.aadhaar || '',
    nameAsPerAadhaar: initialData.nameAsPerAadhaar || '',
    disclaimer: initialData.disclaimer || false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateField = (fieldId: string, value: string | boolean) => {
    const field = formSchema.step1.fields.find(f => f.id === fieldId);
    if (!field) return '';

    if (field.required && !value) {
      return `${field.name} is required`;
    }

    if (field.validation && typeof value === 'string') {
      const regex = new RegExp(field.validation.regex);
      if (!regex.test(value)) {
        return field.validation.message;
      }
    }

    return '';
  };

  const handleInputChange = (fieldId: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handleValidateAadhaar = async () => {
    // Validate Aadhaar fields
    const newErrors: Record<string, string> = {};
    
    const aadhaarError = validateField('aadhaar', formData.aadhaar);
    if (aadhaarError) newErrors.aadhaar = aadhaarError;
    
    const nameError = validateField('nameAsPerAadhaar', formData.nameAsPerAadhaar);
    if (nameError) newErrors.nameAsPerAadhaar = nameError;
    
    if (!formData.disclaimer) {
      newErrors.disclaimer = 'You must accept the declaration';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsValidating(true);
    // Simulate validation process
    setTimeout(() => {
      setIsValidating(false);
      // Move directly to step 2 after validation
      onComplete(formData);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {formSchema.step1.title}
        </h2>
        <p className="text-gray-600">
          {formSchema.step1.description}
        </p>
      </div>

      <div className="space-y-4">
        {/* Aadhaar Number */}
        <div>
          <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700 mb-1">
            Aadhaar Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="aadhaar"
            maxLength={12}
            placeholder="Enter 12 digit Aadhaar Number"
            value={formData.aadhaar}
            onChange={(e) => handleInputChange('aadhaar', e.target.value.replace(/\D/g, ''))}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 ${
              errors.aadhaar ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={false}
          />
          {errors.aadhaar && (
            <p className="mt-1 text-sm text-red-600">{errors.aadhaar}</p>
          )}
        </div>

        {/* Name as per Aadhaar */}
        <div>
          <label htmlFor="nameAsPerAadhaar" className="block text-sm font-medium text-gray-700 mb-1">
            Name as per Aadhaar <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nameAsPerAadhaar"
            placeholder="Enter name exactly as mentioned in Aadhaar"
            value={formData.nameAsPerAadhaar}
            onChange={(e) => handleInputChange('nameAsPerAadhaar', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 ${
              errors.nameAsPerAadhaar ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={false}
          />
          {errors.nameAsPerAadhaar && (
            <p className="mt-1 text-sm text-red-600">{errors.nameAsPerAadhaar}</p>
          )}
        </div>

        {/* Declaration Checkbox */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={formData.disclaimer}
              onChange={(e) => handleInputChange('disclaimer', e.target.checked)}
              className="mt-1 mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={false}
            />
            <span className="text-sm text-gray-700">
              I, the holder of above mentioned Aadhaar Number, hereby give my consent to use my Aadhaar Number for Udyam Registration
            </span>
          </label>
          {errors.disclaimer && (
            <p className="mt-1 text-sm text-red-600 ml-7">{errors.disclaimer}</p>
          )}
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleValidateAadhaar}
          disabled={isValidating}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isValidating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Validating...
            </span>
          ) : (
            'Validate & Proceed'
          )}
        </button>
      </div>
    </div>
  );
};

export default Step1Aadhaar;