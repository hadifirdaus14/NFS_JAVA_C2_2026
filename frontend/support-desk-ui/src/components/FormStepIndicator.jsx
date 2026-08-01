// Shows the three steps and highlights the current one.
const STEPS = ['Details', 'Classification', 'Review'];

export default function FormStepIndicator({ currentStep }) {
    return (
        <ol className="step-indicator">
            {STEPS.map((label, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isDone = stepNumber < currentStep;

                return (
                    <li
                        key={label}
                        className={isActive ? 'active' : isDone ? 'done' : ''}
                    >
                        <span className="step-number">{stepNumber}</span>
                        {label}
                    </li>
                );
            })}
        </ol>
    );
}
