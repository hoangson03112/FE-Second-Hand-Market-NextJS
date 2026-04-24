interface RefundStepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function RefundStepIndicator({
  steps,
  currentStep,
}: RefundStepIndicatorProps) {
  return (
    <div className="px-6 pt-4">
      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={step} className="flex items-center flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                    isDone || isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stepNumber}
                </span>
                <span
                  className={`text-xs sm:text-sm truncate ${
                    isDone || isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                  title={step}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 rounded ${
                    isDone ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
