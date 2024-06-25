// let currentStep = 0;
// const form = document.getElementById("stepForm");
// const steps = form.querySelectorAll(".step");

const shuffleButton = document.getElementById('shuffleItems');

console.log(shuffleButton)

// function showStep(stepIndex) {
//   steps.forEach((step, index) => {
//     if (index === stepIndex) {
//       step.style.display = "block";
//     } else {
//       step.style.display = "none";
//     }
//   });
// }

// function nextStep() {
//   currentStep++;
//   showStep(currentStep);
// }

// function prevStep() {
//   currentStep--;
//   showStep(currentStep);
// }

// showStep(currentStep);


function filterByData() {
  const category = document.getElementById('filter').value;
  const items = document.querySelectorAll('#overview article');
  items.forEach(item => {
      if (category === 'all' || item.getAttribute('data-article') === category) {
          item.style.display = 'list-item';
      } else {
          item.style.display = 'none';
      }
  });
}

function shuffleItems() {
  const list = document.getElementById('overview');
  const items = Array.from(list.children);
  const shuffledItems = items.sort(() => Math.random() - 0.5);
  list.innerHTML = '';
  shuffledItems.forEach(item => list.appendChild(item));
}

document.getElementById('shuffleItems').addEventListener('click', shuffleItems);

// // write a onclick for the playbutton
// const playButton = document.getElementById("play-state");

// console.log(playButton);

// playButton.onclick = function () {
//   console.log("play button clicked");
// }
