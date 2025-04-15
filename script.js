const spinBtn = document.getElementById("spinBtn");
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const resultText = document.getElementById("result");
const usernameInput = document.getElementById("username");
const toggleThemeBtn = document.getElementById("toggleTheme");
const toggleSoundBtn = document.getElementById("toggleSound");
const spinSound = document.getElementById("spinSound");
const winSound = document.getElementById("winSound");

let isMuted = false;
let angle = 0;
let spinning = false;

const segments = [
  "10 Coins", "Try Again", "20 Coins", "Try Again",
  "50 Coins", "Try Again", "5 Coins", "100 Coins"
];
const colors = ["#f44336", "#4caf50", "#2196f3", "#ff9800", "#9c27b0", "#03a9f4", "#e91e63", "#8bc34a"];

function drawWheel() {
  const radius = canvas.width / 2;
  const anglePerSegment = (2 * Math.PI) / segments.length;

  for (let i = 0; i < segments.length; i++) {
    const startAngle = anglePerSegment * i + angle;
    const endAngle = startAngle + anglePerSegment;

    ctx.beginPath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, startAngle, endAngle);
    ctx.fill();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(startAngle + anglePerSegment / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "14px Arial";
    ctx.fillText(segments[i], radius - 10, 5);
    ctx.restore();
  }
}

function spinWheel() {
  if (spinning) return;
  if (!usernameInput.value.trim()) {
    alert("Enter your name first!");
    return;
  }

  spinning = true;
  if (!isMuted) spinSound.play();

  let spinAngle = Math.random() * 360 + 720; // 2+ rotations
  let duration = 3000;
  let start = performance.now();

  function animate(time) {
    let elapsed = time - start;
    let progress = Math.min(elapsed / duration, 1);
    angle = (spinAngle * progress * Math.PI) / 180;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      let winningIndex = segments.length - Math.floor(((angle * 180) / Math.PI) % 360 / (360 / segments.length)) - 1;
      let reward = segments[winningIndex];
      resultText.textContent = `${usernameInput.value} won: ${reward}`;
      if (!isMuted) winSound.play();

      // Telegram or Google Sheets logging code goes here
    }
  }

  requestAnimationFrame(animate);
}

spinBtn.addEventListener("click", spinWheel);
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
toggleSoundBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  toggleSoundBtn.textContent = isMuted ? "Unmute" : "Mute";
});

drawWheel();
