document.addEventListener('DOMContentLoaded', () => {
  // 1. Get our screen elements
  const screenWelcome = document.getElementById('screen-welcome');
  const screenQuestions = document.getElementById('screen-questions');
  const screenResults = document.getElementById('screen-results');

  const btnStart = document.getElementById('btn-start');
  const btnSubmit = document.getElementById('btn-submit');
  const btnRestart = document.getElementById('btn-restart');

  const rankingList = document.querySelector('.ranking-list');
  const numberPicker = document.getElementById('number-picker');

  // 2. Define the questions and cards map
  const questions = [
    "Cashback on utilities, grocery and dining",
    "Savings on travel & holidays",
    "Premium perks (lounges, golf, luxury experiences)",
    "Discounts on retail and lifestyle brands",
    "More value on groceries",
    "Cashback on everyday spending",
    "Savings on food delivery"
  ];

  const categoryToCardMap = {
    0: { text: "The Essentials Cashback Credit Card<br>fits your lifestyle the best.", image: "assets/cards/Essential_Cashback.png" },
    1: { text: "The Traveller Credit Card<br>fits your lifestyle the best.", image: "assets/cards/Traveller.png" },
    2: { text: "The Lulu Platinum Credit Card<br>fits your lifestyle the best.", image: "assets/cards/Lulu_Platinum.png" },
    3: { text: "The TouchPoints Infinite Credit Card<br>fits your lifestyle the best.", image: "assets/cards/TouchPoints_Infinite.png" },
    4: { text: "The Shukran ADCB Credit Card<br>fits your lifestyle the best.", image: "assets/cards/Shukran.png" },
    5: { text: "The 365 Cashback Credit Card<br>fits your lifestyle the best.", image: "assets/cards/365.png" },
    6: { text: "The talabat ADCB Credit Card<br>fits your lifestyle the best.", image: "assets/cards/Talabat.png" }
  };

  // State
  let currentRanks = new Array(questions.length).fill(null);
  let selectedQuestionIndex = 0; // Highlight the first question by default

  // 3. Helper to switch screens
  function switchScreen(fromScreen, toScreen) {
    fromScreen.classList.add('hidden');
    fromScreen.classList.remove('active');
    toScreen.classList.remove('hidden');
    toScreen.classList.add('active');
  }

  // 4. Update the UI
  function updateUI() {
    // Render Questions
    rankingList.innerHTML = '';
    questions.forEach((question, index) => {
      const item = document.createElement('div');
      item.className = 'ranking-item' + (selectedQuestionIndex === index ? ' selected' : '');
      
      const textSpan = document.createElement('span');
      textSpan.textContent = question;
      
      const rankCircle = document.createElement('div');
      rankCircle.className = 'rank-circle';
      const rank = currentRanks[index];
      if (rank !== null) {
        rankCircle.textContent = rank;
        rankCircle.classList.add('ranked');
      }

      item.appendChild(rankCircle);
      item.appendChild(textSpan);

      item.addEventListener('click', () => {
        selectedQuestionIndex = index;
        updateUI();
      });

      rankingList.appendChild(item);
    });

    // Render Number Picker
    numberPicker.innerHTML = '';
    for (let i = 1; i <= 7; i++) {
      const btn = document.createElement('div');
      btn.className = 'num-btn';
      btn.textContent = i;
      
      // If this number is already used, mark it as used
      if (currentRanks.includes(i)) {
        btn.classList.add('used');
      }

      btn.addEventListener('click', () => {
        if (selectedQuestionIndex !== null) {
          // Check if this number is already assigned somewhere else, if so, remove it
          const oldIndex = currentRanks.indexOf(i);
          if (oldIndex > -1) {
            currentRanks[oldIndex] = null;
          }

          // Assign number to the selected question
          currentRanks[selectedQuestionIndex] = i;

          // Auto-advance to the next unranked question
          const nextIndex = currentRanks.findIndex(r => r === null);
          selectedQuestionIndex = nextIndex !== -1 ? nextIndex : null;

          updateUI();
        }
      });

      numberPicker.appendChild(btn);
    }

    // Check if all are ranked
    if (!currentRanks.includes(null)) {
      btnSubmit.classList.remove('disabled');
    } else {
      btnSubmit.classList.add('disabled');
    }
  }

  // 5. Event Listeners for Navigation Buttons
  btnStart.addEventListener('click', () => {
    switchScreen(screenWelcome, screenQuestions);
    updateUI();
  });

  btnSubmit.addEventListener('click', () => {
    // Determine the #1 choice card mapping
    const topChoiceIndex = currentRanks.indexOf(1);
    
    if (topChoiceIndex > -1) {
      const cardData = categoryToCardMap[topChoiceIndex];
      // Update the result screen title and image with the mapped card
      document.querySelector('.result-title').innerHTML = cardData.text;
      document.querySelector('.result-card-image').src = cardData.image;
    }

    switchScreen(screenQuestions, screenResults);
  });

  btnRestart.addEventListener('click', () => {
    currentRanks = new Array(questions.length).fill(null);
    selectedQuestionIndex = 0;
    updateUI();
    switchScreen(screenResults, screenWelcome);
  });

  // Initialize
  updateUI();
});
