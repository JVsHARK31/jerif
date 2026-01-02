'use client';

interface Step {
  id: number;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`step-indicator ${
                currentStep > step.id
                  ? 'step-completed'
                  : currentStep === step.id
                  ? 'step-active'
                  : 'step-pending'
              }`}
            >
              {currentStep > step.id ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <span
              className={`text-xs mt-2 font-medium ${
                currentStep >= step.id
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-secondary-400 dark:text-secondary-500'
              }`}
            >
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-12 sm:w-20 h-0.5 mx-2 ${
                currentStep > step.id
                  ? 'bg-primary-500'
                  : 'bg-secondary-200 dark:bg-secondary-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
