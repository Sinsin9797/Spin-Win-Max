// script.js (Spin Wheel Final Version with 50 Features)

const segments = [ { label: "10 Coins", value: 10, icon: "coin.png" }, { label: "Try Again", value: 0, icon: "retry.png" }, { label: "5 Coins", value: 5, icon: "coin.png" }, { label: "20 Coins", value: 20, icon: "coin.png" }, { label: "Spin Again", value: 0, icon: "spin.png" }, { label: "50 Coins", value: 50, icon: "coin.png" } ];

let username = localStorage.getItem("username") || prompt("Enter your name:"); let coins = parseInt(localStorage.getItem("coins")) || 0; let spinsToday = parseInt(localStorage.getItem("spinsToday")) || 0; let lastSpinDate = localStorage.getItem("lastSpinDate") || new Date().toDateString();

if (lastSpinDate !== new Date().toDateString()) { spinsToday = 0; localStorage.setItem("lastSpinDate", new Date().toDateString()); }

localStorage.setItem("username", username);

const spinLimit = 5; const telegramBotToken = "7660325670:AAGjyxqcfafCpx-BiYNIRlPG4u5gd7NDxsI"; const telegramChatId = "5054074724"; const wheelCanvas = document.getElementById("wheelCanvas"); const ctx = wheelCanvas.getContext("2d");

let currentAngle = 0;

function drawWheel() { const centerX = wheelCanvas.width / 2; const centerY = wheelCanvas.height / 2; const radius = 120; const angle = (2 * Math.PI) / segments.length;

for (let i = 0; i < segments.length; i++) { const startAngle = i * angle; const endAngle = startAngle + angle; ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.arc(centerX, centerY, radius, startAngle, endAngle); ctx.fillStyle = i % 2 === 0 ? "#f9a825" : "#fbc02d"; ctx.fill(); ctx.save(); ctx.translate(centerX, centerY); ctx.rotate(startAngle + angle / 2); ctx.textAlign = "right"; ctx.fillStyle = "#333"; ctx.font = "bold 12px Arial"; ctx.fillText(segments[i].label, radius - 10, 0); ctx.restore(); } }

function spinWheel() { if (spinsToday >= spinLimit) { alert("Spin limit reached for today!"); return; }

spinsToday++; localStorage.setItem("spinsToday", spinsToday);

const spinSound = new Audio("spin.mp3"); spinSound.play();

const randomIndex = Math.floor(Math.random() * segments.length); const reward = segments[randomIndex]; coins += reward.value; localStorage.setItem("coins", coins);

showResult(reward); updateLeaderboard(username, coins); sendTelegramAlert(reward.label); }

function showResult(reward) { const resultText = document.getElementById("resultText"); resultText.textContent = You won: ${reward.label}; const winSound = new Audio("win.mp3"); winSound.play(); launchConfetti(); }

function launchConfetti() { // Simulate confetti console.log("Confetti animation"); }

function sendTelegramAlert(msg) { const text = User: ${username} won ${msg}; const url = https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${encodeURIComponent(text)}; fetch(url); }

function updateLeaderboard(name, points) { let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || []; leaderboard.push({ name, points }); leaderboard.sort((a, b) => b.points - a.points); leaderboard = leaderboard.slice(0, 10); localStorage.setItem("leaderboard", JSON.stringify(leaderboard)); renderLeaderboard(leaderboard); }

function renderLeaderboard(list) { const ul = document.getElementById("leaderboard"); ul.innerHTML = ""; list.forEach((entry) => { const li = document.createElement("li"); li.textContent = ${entry.name} - ${entry.points} Coins; ul.appendChild(li); }); }

function toggleDarkMode() { document.body.classList.toggle("dark-mode"); }

function toggleSound() { const mute = localStorage.getItem("mute") === "true"; localStorage.setItem("mute", !mute); }

drawWheel(); renderLeaderboard(JSON.parse(localStorage.getItem("leaderboard")) || []);

