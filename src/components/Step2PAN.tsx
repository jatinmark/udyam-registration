'use client';

import React, { useState } from 'react';
import formSchema from '@/data/udyam-form-schema.json';

interface Step2PANProps {
  onComplete: (data: any) => void;
  onBack: () => void;
  initialData?: any;
  step1Data?: any;
}

const Step2PAN: React.FC<Step2PANProps> = ({ onComplete, onBack, initialData = {}, step1Data = {} }) => {
  const [formData, setFormData] = useState({
    typeOfOrganisation: initialData.typeOfOrganisation || '',
    pan: initialData.pan || '',
    mobile: initialData.mobile || '',
    email: initialData.email || '',
    socialCategory: initialData.socialCategory || '',
    gender: initialData.gender || '',
    speciallyAbled: initialData.speciallyAbled || '',
    nameOfEnterprise: initialData.nameOfEnterprise || '',
    majorActivity: initialData.majorActivity || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateField = (fieldId: string, value: string) => {
    const field = formSchema.step2.fields.find(f => f.id === fieldId);
    if (!field) return '';

    if (field.required && !value) {
      return `${field.name} is required`;
    }

    if (field.validation && value) {
      if (field.validation.regex) {
        const regex = new RegExp(field.validation.regex);
        if (!regex.test(value)) {
          return field.validation.message;
        }
      }
      
      if (field.validation.minLength && value.length < field.validation.minLength) {
        return field.validation.message;
      }
      
      if (field.validation.maxLength && value.length > field.validation.maxLength) {
        return field.validation.message;
      }
    }

    return '';
  };

  const handleInputChange = (fieldId: string, value: string) => {
    // Transform PAN to uppercase
    if (fieldId === 'pan') {
      value = value.toUpperCase();
    }
    
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const handleSubmit = async () => {
    // Validate all fields
    const newErrors: Record<string, string> = {};
    
    Object.keys(formData).forEach(fieldId => {
      const error = validateField(fieldId, formData[fieldId as keyof typeof formData]);
      if (error) {
        newErrors[fieldId] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsValidating(true);
    
    try {
      // Combine step1 and step2 data for submission
      const registrationData = {
        ...step1Data,
        ...formData
      };
      
      // Call API to save registration
      const response = await fetch('/api/udyam-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Pass registration details to parent component
        onComplete({
          ...formData,
          registrationNumber: result.data.registrationNumber,
          registrationDate: result.data.registrationDate,
          registrationId: result.data.id
        });
      } else {
        // Show error message
        setErrors({ 
          submit: result.error || 'Failed to save registration. Please try again.' 
        });
        setIsValidating(false);
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      setErrors({ 
        submit: 'Network error. Please check your connection and try again.' 
      });
      setIsValidating(false);
    }
  };

  const handleReset = () => {
    setFormData({
      typeOfOrganisation: '',
      pan: '',
      mobile: '',
      email: '',
      socialCategory: '',
      gender: '',
      speciallyAbled: '',
      nameOfEnterprise: '',
      majorActivity: ''
    });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {formSchema.step2.title}
        </h2>
        <p className="text-gray-600">
          {formSchema.step2.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type of Organisation */}
        <div>
          <label htmlFor="typeOfOrganisation" className="block text-sm font-medium text-gray-700 mb-1">
            Type of Organisation <span className="text-red-500">*</span>
          </label>
          <select
            id="typeOfOrganisation"
            value={formData.typeOfOrganisation}
            onChange={(e) => handleInputChange('typeOfOrganisation', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 ${
              errors.typeOfOrganisation ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Type of Organisation</option>
            {formSchema.step2.fields.find(f => f.id === 'typeOfOrganisation')?.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.typeOfOrganisation && (
            <p className="mt-1 text-sm text-red-600">{errors.typeOfOrganisation}</p>
          )}
        </div>

        {/* PAN */}
        <div>
          <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1">
            PAN <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="pan"
            maxLength={10}
            placeholder="Enter PAN (e.g., ABCDE1234F)"
            value={formData.pan}
            onChange={(e) => handleInputChange('pan', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 ${
              errors.pan ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.pan && (
            <p className="mt-1 text-sm text-red-600">{errors.pan}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="mobile"
            maxLength={10}
            placeholder="Enter 10 digit Mobile Number"
            value={formData.mobile}
            onChange={(e) => handleInputChange('mobile', e.target.value.replace(/\D/g, ''))}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 ${
              errors.mobile ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.mobile && (
            <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email ID <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter Email ID"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Social Category */}
        <div>
          <label htmlFor="socialCategory" className="block text-sm font-medium text-gray-700 mb-1">
            Social Category <span className="text-red-500">*</span>
          </label>
          <select
            id="socialCategory"
            value={formData.socialCategory}
            onChange={(e) => handleInputChange('socialCategory', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 ${
              errors.socialCategory ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Social Category</option>
            {formSchema.step2.fields.find(f => f.id === 'socialCategory')?.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.socialCategory && (
            <p className="mt-1 text-sm text-red-600">{errors.socialCategory}</p>
          )}
        </div>

        {/* Major Activity */}
        <div>
          <label htmlFor="majorActivity" className="block text-sm font-medium text-gray-700 mb-1">
            Major Activity <span className="text-red-500">*</span>
          </label>
          <select
            id="majorActivity"
            value={formData.majorActivity}
            onChange={(e) => handleInputChange('majorActivity', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 ${
              errors.majorActivity ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Major Activity</option>
            {formSchema.step2.fields.find(f => f.id === 'majorActivity')?.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.majorActivity && (
            <p className="mt-1 text-sm text-red-600">{errors.majorActivity}</p>
          )}
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gender <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-6">
          {formSchema.step2.fields.find(f => f.id === 'gender')?.options?.map(option => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value={option.value}
                checked={formData.gender === option.value}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="mr-2 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
        {errors.gender && (
          <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
        )}
      </div>

      {/* Specially Abled */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Specially Abled <span className="text-red-500">*</span>
        </label>
        <div className="flex space-x-6">
          {formSchema.step2.fields.find(f => f.id === 'speciallyAbled')?.options?.map(option => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="speciallyAbled"
                value={option.value}
                checked={formData.speciallyAbled === option.value}
                onChange={(e) => handleInputChange('speciallyAbled', e.target.value)}
                className="mr-2 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
        {errors.speciallyAbled && (
          <p className="mt-1 text-sm text-red-600">{errors.speciallyAbled}</p>
        )}
      </div>

      {/* Name of Enterprise */}
      <div>
        <label htmlFor="nameOfEnterprise" className="block text-sm font-medium text-gray-700 mb-1">
          Name of Enterprise <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nameOfEnterprise"
          placeholder="Enter Name of Enterprise/Business"
          value={formData.nameOfEnterprise}
          onChange={(e) => handleInputChange('nameOfEnterprise', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 ${
            errors.nameOfEnterprise ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.nameOfEnterprise && (
          <p className="mt-1 text-sm text-red-600">{errors.nameOfEnterprise}</p>
        )}
      </div>

      {/* Submit Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
          <p className="text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
        >
          Back
        </button>
        
        <div className="space-x-4">
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
          >
            Reset
          </button>
          
          <button
            onClick={handleSubmit}
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
              'Validate & Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2PAN;