// Game state
let gameState = {
  players: [
    { total: 0, current: 0, name: "ron" },
    { total: 0, current: 0, name: "dani" },
  ],
  currentPlayer: 0,
  gameActive: true,
  gameMode: "pvp",
  rolling: false,
};

// Dice faces configuration
const diceFaces = {
  1: [{ x: 50, y: 50 }],
  2: [
    { x: 25, y: 25 },
    { x: 75, y: 75 },
  ],
  3: [
    { x: 25, y: 25 },
    { x: 50, y: 50 },
    { x: 75, y: 75 },
  ],
  4: [
    { x: 25, y: 25 },
    { x: 75, y: 25 },
    { x: 25, y: 75 },
    { x: 75, y: 75 },
  ],
  5: [
    { x: 25, y: 25 },
    { x: 75, y: 25 },
    { x: 50, y: 50 },
    { x: 25, y: 75 },
    { x: 75, y: 75 },
  ],
  6: [
    { x: 25, y: 25 },
    { x: 75, y: 25 },
    { x: 25, y: 50 },
    { x: 75, y: 50 },
    { x: 25, y: 75 },
    { x: 75, y: 75 },
  ],
};

// Update display
function updateDisplay() {
  document.getElementById("player1Total").textContent =
    gameState.players[0].total;
  document.getElementById("player1Current").textContent =
    gameState.players[0].current;
  document.getElementById("player2Total").textContent =
    gameState.players[1].total;
  document.getElementById("player2Current").textContent =
    gameState.players[1].current;

  // Update active player
  const player1Card = document.getElementById("player1Card");
  const player2Card = document.getElementById("player2Card");

  if (gameState.currentPlayer === 0) {
    player1Card.classList.add("active");
    player2Card.classList.remove("active");
    player1Card.querySelector(".current-turn").textContent = "Ron's turn!";
    player2Card.querySelector(".current-turn").textContent = "Wait...";
  } else {
    player1Card.classList.remove("active");
    player2Card.classList.add("active");
    player1Card.querySelector(".current-turn").textContent = "Wait...";
    player2Card.querySelector(".current-turn").textContent =
      gameState.gameMode === "pvc" ? "Ron's turn..." : "Dani's turn!";
  }
}

// Draw dice
function drawDice1(number) {
    console.log(number)
  const dice1 = document.getElementById("dice1");
  const face1 = dice1.querySelector(".dice1-face");

  face1.innerHTML = "";

  const dots1 = diceFaces[number];
  dots1.forEach((dot) => {
    const dot1El = document.createElement("span");
    dot1El.className = "dot";
    dot1El.style.left = `${dot.x}%`;
    dot1El.style.top = `${dot.y}%`;
    face1.appendChild(dot1El);
  });
}
function drawDice2(number) {
  const dice2 = document.getElementById("dice2");
  const face2 = dice2.querySelector(".dice2-face");

  face2.innerHTML = "";

  const dots2 = diceFaces[number];
  dots2.forEach((dot) => {
    const dot2El = document.createElement("span");
    dot2El.className = "dot";
    dot2El.style.left = `${dot.x}%`;
    dot2El.style.top = `${dot.y}%`;
    face2.appendChild(dot2El);
  });
}

// Roll dice with animation
async function rollDice() {
  if (!gameState.gameActive || gameState.rolling) return;

  gameState.rolling = true;
  const dice1 = document.getElementById("dice1");
  dice1.classList.add("rolling");
  
  gameState.rolling = true;
  const dice2 = document.getElementById("dice2");
    dice2.classList.add("rolling");
    
  // Animate random numbers
  for (let i = 0; i < 10; i++) {
    drawDice1(Math.floor(Math.random() * 6) + 1);
    drawDice2(Math.floor(Math.random() * 6) + 1);
    await new Promise((resolve) => setTimeout(resolve, 100));
    }
    
  // Final roll
  let result = [];
  const resultRoll1 = Math.floor(Math.random() * 6) + 1;
  drawDice1(resultRoll1);
  result.push(resultRoll1);
  dice1.classList.remove("rolling");
  gameState.rolling = false;
  
  // Roll dice2
  const resultRoll2 = Math.floor(Math.random() * 6) + 1;
  drawDice2(resultRoll2);
  result.push(resultRoll2);
  dice2.classList.remove("rolling");
  gameState.rolling = false;

  return result;
}

// Roll button
document.getElementById("rollBtn").addEventListener("click", async () => {
  if (!gameState.gameActive || gameState.rolling) return;

  document.getElementById("resultMessage").textContent = "";

  const roll = await rollDice();

  if (roll[0] === roll[1]) {
    // Lost turn
    gameState.players[gameState.currentPlayer].current = 0;
    showMessage(
      `💥 You rolled a double! You lost all the points for the turn!`,
      "error",
    );

    await new Promise((resolve) => setTimeout(resolve, 1500));
    switchPlayer();
  } else {
    // Add to current
    gameState.players[gameState.currentPlayer].current += roll[0] + roll[1];
    updateDisplay();
    showMessage(`🎲 rolled ${roll[0]} and  ${roll[1]}!`, "info");
  }
});

// Hold button
document.getElementById("holdBtn").addEventListener("click", () => {
  if (!gameState.gameActive || gameState.rolling) return;

  const player = gameState.players[gameState.currentPlayer];

  if (player.current === 0) {
    showMessage("Nothing to save! Roll a die first.", "Error");
    return;
  }

  player.total += player.current;
  player.current = 0;

  updateDisplay();

  // Check for win
  if (player.total >= 100) {
    endGame();
  } else {
    showMessage(`✅ Saved! ${player.total} points total.`, "success");
    setTimeout(() => {
      switchPlayer();
    }, 1000);
  }
});

// Switch player
async function switchPlayer() {
  gameState.currentPlayer = gameState.currentPlayer === 0 ? 1 : 0;
  updateDisplay();
  document.getElementById("resultMessage").textContent = "";

  // Computer turn
  if (gameState.gameMode === "pvc" && gameState.currentPlayer === 1) {
    await computerTurn();
  }
}

// End game
function endGame() {
  gameState.gameActive = false;

  const winner = gameState.players[gameState.currentPlayer];
  const winnerName =
    gameState.currentPlayer === 0
      ? "Ron"
      : gameState.gameMode === "pvc"
        ? "Ron's turn..."
        : "Dani's turn!";

  showMessage(`🎉 ${winnerName} Won with ${winner.total} points!`, "success");

  // Celebrate
  celebrate();
}

// Game mode buttons
document.querySelectorAll(".mode-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (gameState.rolling) return;

    document
      .querySelectorAll(".mode-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    gameState.gameMode = btn.dataset.mode;

    // Update player 2 name
    document.querySelector("#player2Card h3").textContent = "💂🏻‍♀️ Dani";

    newGame();
  });
});

// Show message
function showMessage(text, type = "info") {
  const messageEl = document.getElementById("resultMessage");
  messageEl.textContent = text;
  messageEl.className = `result-message ${type}`;
  messageEl.style.display = "block";
}

// Celebration
function celebrate() {
  const card = document.getElementById(
    `player${gameState.currentPlayer + 1}Card`,
  );
  card.classList.add("winner");

  // Confetti
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      createConfetti();
    }, i * 30);
  }
}

// Create confetti
function createConfetti() {
  const confetti = document.createElement("div");
  confetti.className = "confetti";
  confetti.style.left = Math.random() * 100 + "%";
  confetti.style.animationDuration = Math.random() * 2 + 1 + "s";
  confetti.style.background = [
    "#FFD700",
    "#FF6347",
    "#4169E1",
    "#32CD32",
    "#FF69B4",
  ][Math.floor(Math.random() * 5)];

  document.body.appendChild(confetti);

  setTimeout(() => {
    confetti.remove();
  }, 3000);
}

// Initialize
updateDisplay();
drawDice1(1);
drawDice2(1);
