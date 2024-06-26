// let currentStep = 0;
// const form = document.getElementById("stepForm");
// const steps = form.querySelectorAll(".step");

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

// const shuffleButton = document.getElementById('shuffleItems');

// console.log(shuffleButton)

// Store the initial state of articles in localStorage
const items = document.querySelectorAll('#overview article');
const itemsArray = Array.from(items);
localStorage.setItem('items', JSON.stringify(itemsArray.map(item => ({
    outerHTML: item.outerHTML,
    dataArticle: item.getAttribute('data-article')
}))));

// Retrieve data from localStorage
const data = JSON.parse(localStorage.getItem('items'));

function filterByData() {
    const category = document.getElementById('filter').value;
    const overview = document.getElementById('overview');

    // Clear the existing articles
    overview.innerHTML = '';

    // Determine which items to display
    if (category === 'all') {
        // Show all items
        data.forEach(itemData => {
            overview.innerHTML += itemData.outerHTML;
        });
    } else {
        // Show only the items that match the selected category
        data.filter(itemData => itemData.dataArticle === category).forEach(itemData => {
            overview.innerHTML += itemData.outerHTML;
        });
    }
}

function shuffleItems() {
  const list = document.getElementById('overview');
  const items = Array.from(list.children);
  const shuffledItems = items.sort(() => Math.random() - 0.5);
  list.innerHTML = '';
  shuffledItems.forEach(item => list.appendChild(item));
}

function resetItems() {
  const overview = document.getElementById('overview');
  overview.innerHTML = '';
  data.forEach(itemData => {
      overview.innerHTML += itemData.outerHTML;
  });

  // Reset the categorie filter to 'all'
  document.getElementById('filter').value = 'all';
}

document.getElementById('resetItems').addEventListener('click', resetItems);
document.getElementById('shuffleItems').addEventListener('click', shuffleItems);

// // write a onclick for the playbutton
// const playButton = document.getElementById("play-state");

// console.log(playButton);

// playButton.onclick = function () {
//   console.log("play button clicked");
// }
