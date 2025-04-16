let segments = ["10", "20", "30", "Try Again", "50", "100"];
let spinCount = 0;
let maxSpins = 5;
let coins = 0;
let muted = false;
let userName = localStorage.getItem("username") || "";

const canvas = document.getElementById("wheelcanvas");
const ctx = canvas.getContext("2d");
const spinSound = document.getElementById("spinSound");
const winSound = document.getElementById("winSound");

function saveUsername() {
  const name = document.getElementById("username").value;
  if (name) {
    userName = name;
    localStorage.setItem("username", name);
  }
}

function drawWheel() {
  let arc = Math.PI / (segments.length / 2);
  for (let i = 0; i < segments.length; i++) {
    let angle = i * arc;
    ctx.beginPath();
    ctx.fillStyle = i % 2 == 0 ? "#FF8C00" : "#FFD700";
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 150, angle, angle + arc);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.translate(150, 150);
    ctx.rotate(angle + arc / 2);
    ctx.fillText(segments[i], 90, 5);
    ctx.rotate(-(angle + arc / 2));
    ctx.translate(-150, -150);
  }
}
drawWheel();

function spinWheel() {
  if (spinCount >= maxSpins) {
    alert("No more spins left today!");
    return;
  }
  if (!muted) spinSound.play();

  let randomIndex = Math.floor(Math.random() * segments.length);
  let result = segments[randomIndex];
  document.getElementById("result").innerText = `Result: ${result}`;
  if (result !== "Try Again") {
    coins += parseInt(result);
    if (!muted) winSound.play();
  }

  spinCount++;
  updateUI();
}

function updateUI() {
  document.getElementById("spinCount").innerText = `Spins: ${spinCount}/${maxSpins}`;
  document.getElementById("userCoins").innerText = `Coins: ${coins}`;
}

function toggleMute() {
  muted = !muted;
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function withdrawCoins() {
  const amount = parseInt(document.getElementById("withdrawAmount").value);
  if (coins >= amount && amount > 0) {
    coins -= amount;
    alert(`Withdraw requested: ${amount} coins`);
    updateUI();
  } else {
    alert("Not enough coins to withdraw.");
  }
}
