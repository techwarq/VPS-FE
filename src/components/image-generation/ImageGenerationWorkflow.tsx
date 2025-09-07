import React, { useState } from 'react';
import { StepIndicator } from './StepIndicator';
import { ModelsStep } from './ModelsStep';
import { PosesStep } from './PosesStep';
import { BackgroundsStep } from './BackgroundsStep';
import { PhotoshootStep } from './PhotoshootStep';
import { FinalStep } from './FinalStep';
import { useImageStore } from '@/store/imageStore';
import { 
  ModelGenerationRequest, 
  PoseGenerationRequest, 
  BackgroundGenerationRequest, 
  PhotoshootRequest,
  ModelImage 
} from '@/services/api';

interface WorkflowData {
  models?: ModelGenerationRequest;
  poses?: PoseGenerationRequest;
  backgrounds?: BackgroundGenerationRequest;
  photoshoot?: PhotoshootRequest;
  final?: PhotoshootRequest;
  modelImages?: ModelImage[];
  poseImages?: ModelImage[];
  backgroundImages?: ModelImage[];
  photoshootImages?: ModelImage[];
  finalImages?: ModelImage[];
}

export const ImageGenerationWorkflow: React.FC = () => {
  const { 
    currentStep, 
    steps, 
    setCurrentStep, 
    updateStep, 
    completeStep
  } = useImageStore();

  const [workflowData, setWorkflowData] = useState<WorkflowData>({});

  const handleStepComplete = (stepId: string, data: unknown) => {
    updateStep(stepId, data);
    completeStep(stepId);
    setWorkflowData(prev => ({ ...prev, [stepId]: data }));
    
    // Move to next step
    const currentIndex = steps.findIndex(step => step.id === stepId);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(currentIndex + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // const handleWorkflowComplete = () => {
  //   resetWorkflow();
  //   setWorkflowData({});
  // };

  const renderCurrentStep = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'models':
        return (
          <ModelsStep
            onNext={(data) => handleStepComplete('models', data)}
            initialData={workflowData.models}
          />
        );
      
      case 'poses':
        return (
          <PosesStep
            onNext={(data) => handleStepComplete('poses', data)}
            onBack={handleStepBack}
            initialData={workflowData.poses}
            modelImages={workflowData.modelImages}
          />
        );
      
      case 'backgrounds':
        return (
          <BackgroundsStep
            onNext={(data) => handleStepComplete('backgrounds', data)}
            onBack={handleStepBack}
            initialData={workflowData.backgrounds}
          />
        );
      
      case 'photoshoot':
        return (
          <PhotoshootStep
            onNext={(data) => handleStepComplete('photoshoot', data)}
            onBack={handleStepBack}
            initialData={workflowData.photoshoot}
            modelImages={workflowData.modelImages}
            poseImages={workflowData.poseImages}
            backgroundImages={workflowData.backgroundImages}
          />
        );
      
      case 'final':
        return (
          <FinalStep
            onNext={(data) => handleStepComplete('final', data)}
            onBack={handleStepBack}
            initialData={workflowData.final}
            photoshootImages={workflowData.photoshootImages}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black matrix-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-400 mb-4 glow-green">
            AI Photoshoot Studio
          </h1>
          <p className="text-gray-400 text-lg">
            Create professional fashion photoshoots with AI
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator 
            steps={steps} 
            currentStep={currentStep}
          />
        </div>

        {/* Current Step Content */}
        <div className="mb-8">
          {renderCurrentStep()}
        </div>

        {/* Progress Info */}
        <div className="text-center">
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].name}
          </div>
        </div>
      </div>
    </div>
  );
};
