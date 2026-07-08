import { Check } from 'lucide-react';

interface Step {
  label: string;
  description?: string;
}

export function StepIndicator({ steps, currentStep }: { steps: Step[]; currentStep: number }) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex size-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-smooth ${
                index < currentStep
                  ? 'border-primary bg-primary text-primary-foreground'
                  : index === currentStep
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-muted text-muted-foreground'
              }`}
            >
              {index < currentStep ? <Check className="size-5" /> : index + 1}
            </div>
            <div className="mt-2 text-center">
              <div className={`text-xs font-medium ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </div>
              {step.description && (
                <div className="text-xs text-muted-foreground">{step.description}</div>
              )}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`mx-2 mb-6 h-0.5 w-12 transition-smooth ${
                index < currentStep ? 'bg-primary' : 'bg-border'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
