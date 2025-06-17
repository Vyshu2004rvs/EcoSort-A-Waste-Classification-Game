// Set starting life totals here
var playerLife = 5;
var wasteLife = 5;

// Message when the game is over
var wasteWinnerMessage = "Oops! Try again to sort correctly.";
var playerWinnerMessage = "Game over:Great job! You sorted the waste correctly!";


// Game code starts here
var playerStartLife = parseInt(playerLife);
var wasteStartLife = parseInt(wasteLife);

var roundFinished = false;
var cardSelected = false;

updateScores();

document.querySelector(".game-board").classList.add("before-game");

var allCardElements = document.querySelectorAll(".card");

// Adds click handler to all player card elements
for(var i = 0; i < allCardElements.length; i++) {
  var card = allCardElements[i];
  if(card.classList.contains("player-card")) {
    card.addEventListener("click",function(e){
      cardClicked(this);
    });
  }
}


// When a card is clicked
function cardClicked(cardEl) {

  if(cardSelected) { return; }
  cardSelected = true;

  cardEl.classList.add("played-card");

  document.querySelector(".game-board").classList.add("card-selected");

  // Wait 500ms to reveal the waste power
  setTimeout(function(){
    revealwastePower();
  },500)

  // Wait 750ms to reveal the player power
  setTimeout(function(){
    revealPlayerPower();
  },800)

  // Wait 1250ms to compare the card scoers
  setTimeout(function(){
    compareCards();
  }, 1400);
}

// Shows the power level on the player card
function revealPlayerPower(){
  var playerCard = document.querySelector(".played-card");
  playerCard.classList.add("reveal-power");
}

// Shows the power level on the waste card
function revealwastePower(){
  var wasteCard = document.querySelector(".waste-card");
  wasteCard.classList.add("reveal-power");
}

function compareCards(){
  var playerCard = document.querySelector(".played-card");
  var playerPowerEl = playerCard.querySelector(".power");

  var wasteCard = document.querySelector(".waste-card");
  var wastePowerEl = wasteCard.querySelector(".power");

  var playerPower = parseInt(playerPowerEl.innerHTML);
  var wastePower = parseInt(wastePowerEl.innerHTML);

  var powerDifference = playerPower - wastePower;

  if (powerDifference < 0) {
    // Player Loses
    playerLife = playerLife + powerDifference;
    wasteCard.classList.add("better-card");
    playerCard.classList.add("worse-card");
    document.querySelector(".player-stats .thumbnail").classList.add("ouch");
  } else if (powerDifference > 0) {
    // Player Wins
    wasteLife = wasteLife - powerDifference;
    playerCard.classList.add("better-card");
    wasteCard.classList.add("worse-card");
    document.querySelector(".waste-stats .thumbnail").classList.add("ouch");
  } else {
    playerCard.classList.add("tie-card");
    wasteCard.classList.add("tie-card");
  }

  updateScores();

  if(playerLife <= 0) {
    gameOver("waste");
  } else if (wasteLife <= 0){
    gameOver("Player")
  }

  roundFinished = true;

  document.querySelector("button.next-turn").removeAttribute("disabled");
}

// Shows the winner message
function gameOver(winner) {
  document.querySelector(".game-board").classList.add("game-over");
  document.querySelector(".winner-section").style.display = "flex";
  document.querySelector(".winner-section").classList.remove("player-color");
  document.querySelector(".winner-section").classList.remove("waste-color");

  if(winner == "waste") {
    document.querySelector(".winner-message").innerHTML = wasteWinnerMessage;
    document.querySelector(".winner-section").classList.add("waste-color");
  } else {
    document.querySelector(".winner-message").innerHTML = playerWinnerMessage;
    document.querySelector(".winner-section").classList.add("player-color");
  }
}


// Starts the game
function startGame() {
  document.querySelector(".game-board").classList.remove("before-game");
  document.querySelector(".game-board").classList.add("during-game");
  playTurn();
}


// Start the game over from scratch
function restartGame(){
  document.querySelector(".game-board").classList.remove("game-over");
  document.querySelector(".game-board").classList.remove("during-game");
  document.querySelector(".game-board").classList.add("before-game");

  document.querySelector(".winner-section").style.display = "none";
  document.querySelector(".waste-card").style.display = "none";

  var cards = allCardElements;

  document.querySelector("button").removeAttribute("disabled");

  for(var i = 0; i < cards.length; i++) {
    cards[i].style.display = "none";
  }

  playerLife = playerStartLife;
  wasteLife = wasteStartLife;

  roundFinished = true;
  cardSelected = false;

  updateScores();
}

// Updates the displayed life bar and life totals
function updateScores(){

  // Update life totals for each player
  document.querySelector(".player-stats .life-total").innerHTML = playerLife;
  document.querySelector(".waste-stats .life-total").innerHTML = wasteLife;

  // Update the player lifebar
  var playerPercent = playerLife / playerStartLife * 100;
  if (playerPercent < 0) {
    playerPercent = 0;
  }
  document.querySelector(".player-stats .life-left").style.height =  playerPercent + "%";

  // Update the waste lifebar
  var wastePercent = wasteLife / wasteStartLife * 100
  if (wastePercent < 0) {
    wastePercent = 0;
  }
  document.querySelector(".waste-stats .life-left").style.height =  wastePercent + "%";
}


// Shuffles an array
function shuffleArray(a) {
  var j, x, i;
  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
  return a;
}


// Plays one turn of the game
function playTurn() {

  roundFinished = true;
  cardSelected = false;

  document.querySelector(".game-board").classList.remove("card-selected");

  // Remove "ouch" class from player and waste thumbnails
  document.querySelector(".waste-stats .thumbnail").classList.remove("ouch");
  document.querySelector(".player-stats .thumbnail").classList.remove("ouch");

  // Hides the "next turn" button, will show again when turn is over
  document.querySelector(".next-turn").setAttribute("disabled", "true");

  for(var i = 0; i < allCardElements.length; i++) {
    var card = allCardElements[i];
    card.classList.remove("showCard");
  }

  setTimeout(function(){
    revealCards();
  }, 500);
}

function revealCards(){


  var j = 0;
  var cardIndexes = shuffleArray([0, 1, 2]);

  // Get scenario cards
  console.log("scenarios.length == " + scenarios.length);

  var randomScenarioIndex = Math.floor(Math.random() * scenarios.length);
  var scenario = scenarios[randomScenarioIndex];
  console.log(scenario.wasteCard.description);

  scenarios.splice(randomScenarioIndex, 1);

  console.log("scenarios.length after splice == " + scenarios.length);

  var wasteCard = scenario.wasteCard;
  var wasteCardEl = document.querySelector(".waste-area .card");

  // Contents of the player cards
  var playerCards = scenario.playerCards;

  for(var i = 0; i < allCardElements.length; i++) {
    var card = allCardElements[i];

    card.classList.remove("worse-card");
    card.classList.remove("better-card");
    card.classList.remove("played-card");
    card.classList.remove("tie-card");
    card.classList.remove("prepared");
    card.classList.remove("reveal-power");

    // Display the payer card details
    if(card.classList.contains("player-card")) {
      card.querySelector(".text").innerHTML = playerCards[cardIndexes[j]].description;
      card.querySelector(".power").innerHTML = playerCards[cardIndexes[j]].power;
      j++;
    }

    // Reveal each card one by one with a delay of 100ms
    setTimeout(function(card, j){
      return function() {
        card.classList.remove("prepared");
        card.style.display = "block";
        card.classList.add("showCard");
      }
    }(card,i), parseInt(i+1) * 200);
  }

  // Display the waste card
  wasteCardEl.querySelector(".text").innerHTML = wasteCard.description;
  wasteCardEl.querySelector(".power").innerHTML = wasteCard.power;
}
