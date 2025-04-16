const segments = [
  { label: "10 Coins", value: 10 },
  { label: "5 Coins", value: 5 },
  { label: "20 Coins", value: 20 },
  { label: "Try Again", value: 0 },
  { label: "50 Coins", value: 50 },
  { label: "No Luck", value: 0 },
];

let spinAngle = 0;
let spinning = false;
let spinsLeft = 5;
let coins = 0;
let muted = false;
let username = localStorage.getItem("username") || "";
const telegramBotToken = "YOUR_TELEGRAM_BOT_TOKEN";
const telegramChatID = "YOUR_TELEGRAM_CHAT_ID";

const canvas = document.getElementById("wheelcanvas");
const ctx = canvas.getContext("2d");
const spinSound = document.getElementById("spinSound");
const winSound = document.getElementById("winSound");

document.getElementById("spinCount").innerText = `Spins left: ${spinsLeft}`;
document.getElementById("userCoins").innerText = `Coins: ${coins}`;

function saveUsername() {
  const input = document.getElementById("username");
  username = input.value.trim();
  if (username) {
    localStorage.setItem("username", username);
    alert(`Welcome, ${username}!`);
  }
}

function drawWheel() {
  const radius = canvas.width / 2;
  const angleStep = (2 * Math.PI) / segments.length;
  for (let i = 0; i < segments.length; i++) {
    const angle = angleStep * i;
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, angle, angle + angleStep);
    ctx.fillStyle = i % 2 === 0 ? "#ffcc00" : "#ffa500";
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angle + angleStep / 2);
    ctx.fillText(segments[i].label, radius - 50, 5);
    ctx.restore();
  }
}

function spinWheel() {
  if (spinning || spinsLeft <= 0 || !username) return;
  spinning = true;
  spinsLeft--;
  updateSpinCount();

  if (!muted) spinSound.play();

  const randomSpin = Math.floor(Math.random() * segments.length);
  const result = segments[randomSpin];
  spinAngle += 360 * 5 + (randomSpin * (360 / segments.length));
  animateSpin(spinAngle, () => {
    showResult(result);
    spinning = false;
  });
}

function animateSpin(finalAngle, callback) {
  let current = 0;
  const totalFrames = 60;
  const initialAngle = spinAngle - (360 * 5);
  const animate = () => {
    current++;
    const angle = easeOut(current, initialAngle, finalAngle - initialAngle, totalFrames);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    drawWheel();
    ctx.restore();
    if (current < totalFrames) {
      requestAnimationFrame(animate);
    } else {
      callback();
    }
  };
  animate();
}

function easeOut(t, b, c, d) {
  t /= d;
  return -c * t*(t-2) + b;
}

function showResult(result) {
  const resEl = document.getElementById("result");
  if (result.value > 0) {
    resEl.innerText = `Congrats! You won ${result.label}`;
    coins += result.value;
    document.getElementById("userCoins").innerText = `Coins: ${coins}`;
    if (!muted) winSound.play();
    launchConfetti();
  } else {
    resEl.innerText = "Better luck next time!";
  }

  sendTelegramAlert(result.label);
  updateLeaderboard();
}

function updateSpinCount() {
  document.getElementById("spinCount").innerText = `Spins left: ${spinsLeft}`;
}

function toggleMute() {
  muted = !muted;
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function sendTelegramAlert(prize) {
  if (!telegramBotToken || !telegramChatID) return;
  fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: telegramChatID,
      text: `🎉 ${username} just won: ${prize} in Spin & Win!`,
    }),
  });
}

function withdrawCoins() {
  const amount = parseInt(document.getElementById("withdrawAmount").value);
  if (isNaN(amount) || amount <= 0) return alert("Enter valid amount");
  if (amount > coins) return alert("Not enough coins");
  if (amount < 50) return alert("Minimum 50 Coins to withdraw");
  coins -= amount;
  alert("Withdrawal requested!");
  document.getElementById("userCoins").innerText = `Coins: ${coins}`;
  sendTelegramAlert(`Withdrawal request of ${amount} coins by ${username}`);
}

function updateLeaderboard() {
  const list = document.getElementById("leaderboardList");
  const li = document.createElement("li");
  li.innerText = `${username} - ${coins} Coins`;
  list.appendChild(li);
}

function launchConfetti() {
  // Add confetti canvas effect here if using external library
}

drawWheel();
