// Example: 4:6 method default preset
// Step 1: Pour at 0s
// Step 2: Pour at 45s
// Step 3: Pour at 90s
// Step 4: Pour at 135s

const steps = [
  { stepNumber: 1, timeSeconds: 0 },
  { stepNumber: 2, timeSeconds: 45 },
  { stepNumber: 3, timeSeconds: 90 },
  { stepNumber: 4, timeSeconds: 135 }
];

console.log("Testing timer logic:");
console.log("===================\n");

// Simulate different elapsed times
const testCases = [
  { elapsed: 0, expectedCurrentStep: 0, expectedNextStep: 1 },
  { elapsed: 30, expectedCurrentStep: 0, expectedNextStep: 1 },
  { elapsed: 45, expectedCurrentStep: 1, expectedNextStep: 2 },
  { elapsed: 60, expectedCurrentStep: 1, expectedNextStep: 2 },
  { elapsed: 90, expectedCurrentStep: 2, expectedNextStep: 3 },
  { elapsed: 120, expectedCurrentStep: 2, expectedNextStep: 3 },
  { elapsed: 135, expectedCurrentStep: 3, expectedNextStep: null },
  { elapsed: 150, expectedCurrentStep: 3, expectedNextStep: null }
];

testCases.forEach(({ elapsed, expectedCurrentStep, expectedNextStep }) => {
  // Find current step (last step whose timeSeconds <= elapsed)
  let currentStepIndex = 0;
  for (let i = steps.length - 1; i >= 0; i--) {
    if (elapsed >= steps[i].timeSeconds) {
      currentStepIndex = i;
      break;
    }
  }
  
  const currentStep = steps[currentStepIndex];
  const nextStep = currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;
  const timeUntilNextPour = nextStep ? nextStep.timeSeconds - elapsed : null;
  
  console.log(`Elapsed: ${elapsed}s`);
  console.log(`  Current Step: ${currentStepIndex + 1} (starts at ${currentStep.timeSeconds}s)`);
  console.log(`  Next Step: ${nextStep ? (currentStepIndex + 2) + ' (starts at ' + nextStep.timeSeconds + 's)' : 'None (last step)'}`);
  console.log(`  Time Until Next Pour: ${timeUntilNextPour !== null ? timeUntilNextPour + 's' : 'N/A'}`);
  console.log();
});

console.log("\nIssue Analysis:");
console.log("===============");
console.log("The current logic auto-advances when elapsed >= nextStep.timeSeconds");
console.log("This means at elapsed=45s, we should advance from step 0 to step 1");
console.log("But the calculation seems correct throughout!");
