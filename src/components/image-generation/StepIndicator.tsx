import React from 'react';
import { ImageGenerationStep } from '@/store/imageStore';

interface StepIndicatorProps {
  steps: ImageGenerationStep[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            {/* Step Circle */}
            <button
              onClick={() => onStepClick?.(index)}
              disabled={!onStepClick}
              className={`
                w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-semibold
                transition-all duration-300 mb-2
                ${index === currentStep 
                  ? 'border-green-500 bg-green-500 text-black glow-green-strong' 
                  : step.completed 
                    ? 'border-green-500 bg-green-500 text-black' 
                    : 'border-gray-600 bg-gray-800 text-gray-400'
                }
                ${onStepClick ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
              `}
            >
              {step.completed ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </button>

            {/* Step Info */}
            <div className="text-center max-w-24">
              <h4 className={`text-xs font-medium ${
                index === currentStep ? 'text-green-400' : 
                step.completed ? 'text-green-500' : 'text-gray-500'
              }`}>
                {step.name}
              </h4>
              <p className="text-xs text-gray-600 mt-1 hidden sm:block">
                {step.description}
              </p>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`
                absolute top-6 left-1/2 w-full h-0.5 -z-10
                ${step.completed ? 'bg-green-500' : 'bg-gray-600'}
              `} style={{ left: 'calc(50% + 24px)', width: 'calc(100% - 48px)' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
