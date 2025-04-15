let segments = [
  { label: "10 Coins", value: 10 },
  { label: "Try Again", value: 0 },
  { label: "50 Coins", value: 50 },
  { label: "100 Coins", value: 100 },
  { label: "1 Extra Spin", value: "spin" },
  { label: "500 Coins", value: 500 }
];

let currentAngle = 0;
let spinning = false;
let username = "";
let coins = 0;
let spinsLeft = 5;

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultDiv = document.getElementById("result");
const userInput = document.getElementById("username");
const coinsDisplay = document.getElementById("coinsDisplay");
const spinLimitDisplay = document.getElementById("spinLimitDisplay");
const leaderboardList = document.getElementById("leaderboardList");

function drawWheel() {
  let anglePerSegment = (2 * Math.PI) / segments.length;
  for (let i = 0; i < segments.length; i++) {
    let angle = i * anglePerSegment;
    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 200, angle, angle + anglePerSegment);
    ctx.fillStyle = i % 2 === 0 ? "#FFD700" : "#87CEEB";
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(
      segments[i].label,
      250 + 120 * Math.cos(angle + anglePerSegment / 2),
      250 + 120 * Math.sin(angle + anglePerSegment / 2)
    );
  }
}
drawWheel();

function spinWheel() {
  if (spinning || spinsLeft <= 0) return;

  spinning = true;
  let randomDeg = Math.floor(Math.random() * 360 + 360 * 5);
  let resultIndex = Math.floor(((360 - (randomDeg % 360)) % 360) / (360 / segments.length));
  let result = segments[resultIndex];

  currentAngle += randomDeg;
  canvas.style.transform = `rotate(${currentAngle}deg)`;

  setTimeout(() => {
    resultDiv.innerText = `You won: ${result.label}`;
    if (typeof result.value === "number") {
      coins += result.value;
    } else if (result.value === "spin") {
      spinsLeft++;
    }
    spinsLeft--;
    updateDisplays();
    spinning = false;
  }, 4000);
}

function updateDisplays() {
  coinsDisplay.innerText = `Coins: ${coins}`;
  spinLimitDisplay.innerText = `Spins Left: ${spinsLeft}`;
}

function saveUsername() {
  username = userInput.value;
  alert(`Welcome, ${username}!`);
  updateDisplays();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function playSound() {
  let audio = new Audio("spin.mp3");
  audio.play();
}

function addToLeaderboard() {
  let li = document.createElement("li");
  li.innerText = `${username} - ${coins} Coins`;
  leaderboardList.appendChild(li);
}

spinBtn.addEventListener("click", () => {
  playSound();
  spinWheel();
});
document.getElementById("setUsernameBtn").addEventListener("click", saveUsername);
document.getElementById("darkModeBtn").addEventListener("click", toggleDarkMode);
document.getElementById("leaderboardBtn").addEventListener("click", addToLeaderboard);
