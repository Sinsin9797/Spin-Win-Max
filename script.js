const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const coinsEl = document.getElementById("coins");
const rewardBox = document.getElementById("reward");

let coins = 0;
let isMuted = false;
let segments = ["10 Coins", "20 Coins", "Try Again", "50 Coins", "100 Coins"];
let colors = ["#f44336", "#e91e63", "#9c27b0", "#2196f3", "#4caf50"];

function drawWheel() {
  let angle = (2 * Math.PI) / segments.length;
  for (let i = 0; i < segments.length; i++) {
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.fillStyle = colors[i];
    ctx.arc(150, 150, 150, i * angle, (i + 1) * angle);
    ctx.lineTo(150, 150);
    ctx.fill();

    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(i * angle + angle / 2);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "right";
    ctx.fillText(segments[i], 140, 10);
    ctx.restore();
  }
}
drawWheel();

function spin() {
  let winIndex = Math.floor(Math.random() * segments.length);
  let reward = segments[winIndex];

  if (reward.includes("Coins")) {
    let num = parseInt(reward.split(" ")[0]);
    coins += num;
    coinsEl.textContent = coins;
    rewardBox.textContent = `You won ${num} coins!`;
  } else {
    rewardBox.textContent = "Try Again!";
  }

  if (!isMuted) {
    let audio = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
    audio.play();
  }
}

function toggleMute() {
  isMuted = !isMuted;
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}
