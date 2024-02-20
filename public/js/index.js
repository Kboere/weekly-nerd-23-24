console.log("Hello World");

let currentStep = 0;
const form = document.getElementById("stepForm");
const steps = form.querySelectorAll(".step");

function showStep(stepIndex) {
  steps.forEach((step, index) => {
    if (index === stepIndex) {
      step.style.display = "block";
    } else {
      step.style.display = "none";
    }
  });
}

function nextStep() {
  currentStep++;
  showStep(currentStep);
}

function prevStep() {
  currentStep--;
  showStep(currentStep);
}

showStep(currentStep);
