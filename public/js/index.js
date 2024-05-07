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

// // write a onclick for the playbutton
// const playButton = document.getElementById("play-state");

// console.log(playButton);

// playButton.onclick = function () {
//   console.log("play button clicked");
// }
