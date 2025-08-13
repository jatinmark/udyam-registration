'use client';

import { useState } from 'react';
import Step1Aadhaar from '@/components/Step1Aadhaar';
import Step2PAN from '@/components/Step2PAN';
import ProgressTracker from '@/components/ProgressTracker';
import RegistrationSuccess from '@/components/RegistrationSuccess';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    step1: {},
    step2: {},
    registration: null as any
  });

  const handleStep1Complete = (data: any) => {
    setFormData(prev => ({ ...prev, step1: data }));
    setCurrentStep(2);
  };

  const handleStep2Complete = (data: any) => {
    setFormData(prev => ({ 
      ...prev, 
      step2: data,
      registration: {
        registrationNumber: data.registrationNumber,
        registrationDate: data.registrationDate,
        nameOfEnterprise: data.nameOfEnterprise
      }
    }));
    setCurrentStep(3); // Move to success screen
  };

  const handleNewRegistration = () => {
    setFormData({
      step1: {},
      step2: {},
      registration: null
    });
    setCurrentStep(1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <h1 className="text-2xl md:text-3xl font-bold text-center">
                Udyam Registration
              </h1>
              <p className="text-center mt-2 text-blue-100">
                Ministry of Micro, Small and Medium Enterprises
              </p>
            </div>

            {currentStep <= 2 && (
              <ProgressTracker currentStep={currentStep} totalSteps={2} />
            )}

            <div className="p-6 md:p-8">
              {currentStep === 1 && (
                <Step1Aadhaar 
                  onComplete={handleStep1Complete}
                  initialData={formData.step1}
                />
              )}
              
              {currentStep === 2 && (
                <Step2PAN 
                  onComplete={handleStep2Complete}
                  onBack={handleBack}
                  initialData={formData.step2}
                  step1Data={formData.step1}
                />
              )}
              
              {currentStep === 3 && formData.registration && (
                <RegistrationSuccess
                  registrationNumber={formData.registration.registrationNumber}
                  registrationDate={formData.registration.registrationDate}
                  nameOfEnterprise={formData.registration.nameOfEnterprise}
                  onNewRegistration={handleNewRegistration}
                />
              )}
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>© 2024 Udyam Registration Portal Clone</p>
            <p className="mt-1">This is a demonstration project</p>
          </div>
        </div>
      </div>
    </main>
  );
}
