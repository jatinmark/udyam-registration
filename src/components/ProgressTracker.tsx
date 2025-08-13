import React from 'react';

interface ProgressTrackerProps {
  currentStep: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Aadhaar Verification' },
    { number: 2, title: 'PAN & Business Details' }
  ];

  return (
    <div className="bg-gray-50 px-6 py-4">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  ${currentStep >= step.number 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-600'}
                  transition-colors duration-300
                `}
              >
                {currentStep > step.number ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  Step {step.number}
                </p>
                <p className={`text-xs ${
                  currentStep >= step.number ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-1 mx-4 transition-colors duration-300 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;