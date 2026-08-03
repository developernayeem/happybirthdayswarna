/* ============================================================
   CONFIG — edit these to personalize
   ============================================================ */
const PASSKEY = "2002";
const BESTIE_BIRTHDAY = new Date(2002, 10, 14); // Nov 14, 2002 (month is 0-indexed)

/* ============================================================
   HELPERS
   ============================================================ */
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active", "fade-in");
  });
  const target = document.getElementById(id);
  target.classList.add("active", "fade-in");
}

function playSafe(audioEl){
  if(!audioEl) return;
  const p = audioEl.play();
  if(p && p.catch) p.catch(()=>{ /* autoplay blocked or file missing — ignore */ });
}

/* Some GIF exports don't loop forever on their own — periodically restart
   them so they keep playing instead of freezing on the last frame. */
function keepGifLooping(imgEl, intervalMs){
  if(!imgEl || !imgEl.getAttribute("src")) return;
  const originalSrc = imgEl.getAttribute("src").split("?")[0];
  setInterval(() => {
    if(imgEl.style.display === "none") return; // fallback emoji showing, image missing
    imgEl.src = originalSrc + "?r=" + Date.now();
  }, intervalMs);
}
document.querySelectorAll(".gif-plain img, .gif-inner img").forEach(img => keepGifLooping(img, 4500));

/* ============================================================
   LOCK SCREEN + PIN MODAL
   ============================================================ */
const pinModal   = document.getElementById("pinModal");
const lockIconBtn = document.getElementById("lockIconBtn");
const closePinModal = document.getElementById("closePinModal");
const pinDots = document.querySelectorAll("#pinDots .dot");
const keySound = document.getElementById("keySound");
const bgSong1 = document.getElementById("bgSong1");
const bgSong2 = document.getElementById("bgSong2");
const popSound = document.getElementById("popSound");

let enteredPin = "";

function openPinModal(){
  pinModal.classList.add("open");
}
function closePinModalFn(){
  pinModal.classList.remove("open");
  resetPin();
}
function resetPin(){
  enteredPin = "";
  pinDots.forEach(d => d.classList.remove("filled","error"));
}

lockIconBtn.addEventListener("click", openPinModal);
closePinModal.addEventListener("click", closePinModalFn);

const pinImageReveal = document.getElementById("pinImageReveal");
const revealModal = document.getElementById("revealModal");
const closeRevealModal = document.getElementById("closeRevealModal");
pinImageReveal.addEventListener("click", () => {
  revealModal.classList.add("open");
});
closeRevealModal.addEventListener("click", () => {
  revealModal.classList.remove("open");
});

const cakeIconReveal = document.getElementById("cakeIconReveal");
const cakeImageModal = document.getElementById("cakeImageModal");
const closeCakeImageModal = document.getElementById("closeCakeImageModal");
cakeIconReveal.addEventListener("click", () => {
  cakeImageModal.classList.add("open");
});
closeCakeImageModal.addEventListener("click", () => {
  cakeImageModal.classList.remove("open");
});

document.querySelectorAll(".key[data-key]").forEach(keyBtn => {
  keyBtn.addEventListener("click", () => {
    keySound.currentTime = 0;
    playSafe(keySound);

    if(enteredPin.length >= 4) return;
    enteredPin += keyBtn.dataset.key;
    pinDots[enteredPin.length - 1].classList.add("filled");

    if(enteredPin.length === 4){
      setTimeout(checkPin, 180);
    }
  });
});

document.getElementById("pinDelete").addEventListener("click", () => {
  if(enteredPin.length === 0) return;
  pinDots[enteredPin.length - 1].classList.remove("filled");
  enteredPin = enteredPin.slice(0, -1);
});

function checkPin(){
  if(enteredPin === PASSKEY){
    // last digit typed acts as the unlock + song trigger
    playSafe(bgSong1);
    setTimeout(() => {
      closePinModalFn();
      showScreen("screen-loading");
      startLoadingSequence();
    }, 220);
  } else {
    const card = document.querySelector(".pin-card");
    pinDots.forEach(d => d.classList.add("error"));
    card.classList.add("shake");
    setTimeout(() => {
      card.classList.remove("shake");
      resetPin();
    }, 500);
  }
}

/* ============================================================
   LOADING SCREEN
   ============================================================ */
function startLoadingSequence(){
  const fill = document.getElementById("progressFill");
  fill.style.width = "0%";
  let pct = 0;
  const timer = setInterval(() => {
    pct += 4;
    fill.style.width = Math.min(pct, 100) + "%";
    if(pct >= 100){
      clearInterval(timer);
      setTimeout(() => showScreen("screen-welcome"), 400);
    }
  }, 90);
}

/* ============================================================
   WELCOME -> AGE SCREEN
   ============================================================ */
document.getElementById("startBtn").addEventListener("click", () => {
  calculateAge();
  showScreen("screen-age");
});

function calculateAge(){
  const now = new Date();
  let years = now.getFullYear() - BESTIE_BIRTHDAY.getFullYear();
  let months = now.getMonth() - BESTIE_BIRTHDAY.getMonth();
  let days = now.getDate() - BESTIE_BIRTHDAY.getDate();

  if(days < 0){
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if(months < 0){
    years -= 1;
    months += 12;
  }

  countUp("ageYears", years);
  countUp("ageMonths", months);
  countUp("ageDays", days);
}

function countUp(elId, target){
  const el = document.getElementById(elId);
  const duration = 900;
  const startTime = performance.now();
  function tick(now){
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if(progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ============================================================
   AGE -> MEMORIES -> LETTER
   ============================================================ */
document.getElementById("toMemoriesBtn").addEventListener("click", () => {
  showScreen("screen-memories");
});
document.getElementById("toLetterBtn").addEventListener("click", () => {
  showScreen("screen-letter");
});

/* ============================================================
   ENVELOPE + LETTER MODAL
   ============================================================ */
const envelopeBtn = document.getElementById("envelopeBtn");
const letterModal = document.getElementById("letterModal");
const closeLetterModal = document.getElementById("closeLetterModal");
const letterTyped = document.getElementById("letterTyped");
const envelopeSound = document.getElementById("envelopeSound");

const LETTER_MESSAGE = [
  "Happy Birthday to my best friend.",
  "Among all the people in life, some become more than just friends — they become family. You are one of those special people in my life. Thank you for always being there through my happiness, sadness, and every unforgettable moment.",
  "I pray that your life is always filled with happiness, success, and endless blessings. May all your dreams come true. Stay happy and keep smiling always.",
  "Happy Birthday, my best friend."
].join("\n\n");

let typingTimer = null;

function typeLetter(){
  clearTimeout(typingTimer);
  letterTyped.textContent = "";
  let i = 0;
  function step(){
    if(i <= LETTER_MESSAGE.length){
      letterTyped.textContent = LETTER_MESSAGE.slice(0, i);
      i += 2;
      typingTimer = setTimeout(step, 18);
    }
  }
  step();
}

envelopeBtn.addEventListener("click", () => {
  if(envelopeBtn.classList.contains("opened")) return;
  envelopeBtn.classList.add("opened");
  playSafe(envelopeSound);
  setTimeout(() => {
    letterModal.classList.add("open");
    typeLetter();
  }, 650);
});
closeLetterModal.addEventListener("click", () => {
  letterModal.classList.remove("open");
  envelopeBtn.classList.remove("opened");
  clearTimeout(typingTimer);
});

document.getElementById("toCakeBtn").addEventListener("click", () => {
  letterModal.classList.remove("open");
  showScreen("screen-cake");
  replayCakeBuild();
});

const cakeEl = document.getElementById("cakeEl");
function replayCakeBuild(){
  cakeEl.classList.remove("build");
  // force reflow so the animation can restart
  void cakeEl.offsetWidth;
  cakeEl.classList.add("build");
}

/* ============================================================
   CAKE SCREEN — cut cake, confetti, song swap, restart
   ============================================================ */
const cutCakeBtn = document.getElementById("cutCakeBtn");
const knifeEl = document.getElementById("knifeEl");
const candleRow = document.getElementById("candleRow");
const cakeSlice = document.getElementById("cakeSlice");
let cakeCut = false;

cutCakeBtn.addEventListener("click", () => {
  // confetti + pop fire every single click
  playSafe(popSound);
  fireConfetti();

  if(!cakeCut){
    cakeCut = true;
    knifeEl.classList.add("cutting");
    candleRow.classList.add("blown");
    setTimeout(() => cakeSlice.classList.add("popped"), 350);

    // swap background music: stop song1, play song2 on loop
    bgSong1.pause();
    bgSong1.currentTime = 0;
    playSafe(bgSong2);

    cutCakeBtn.textContent = "🎉 Enjoy! (tap for more confetti)";
  } else {
    // little knife wiggle for extra feedback on repeat clicks
    knifeEl.classList.remove("cutting");
    void knifeEl.offsetWidth;
    knifeEl.classList.add("cutting");
  }
});

document.getElementById("restartBtn").addEventListener("click", () => {
  // reset state
  cakeCut = false;
  knifeEl.classList.remove("cutting");
  candleRow.classList.remove("blown");
  cakeSlice.classList.remove("popped");
  cutCakeBtn.textContent = "Cut the Cake 🎂";
  cakeEl.classList.remove("build");

  envelopeBtn.classList.remove("opened");
  letterModal.classList.remove("open");
  clearTimeout(typingTimer);

  bgSong2.pause();
  bgSong2.currentTime = 0;
  bgSong1.pause();
  bgSong1.currentTime = 0;

  resetPin();
  showScreen("screen-lock");
});

/* ============================================================
   LIGHTWEIGHT CANVAS CONFETTI (no external library needed)
   ============================================================ */
const CONFETTI_COLORS = ["#CDB4DB", "#FFC8DD", "#FFAFCC", "#BDE0FE", "#A2D2FF", "#FFD700", "#FFFFFF", "#6A4C93"];
let confettiPieces = [];
let confettiRunning = false;

function fireConfetti(){
  const canvas = document.getElementById("confettiCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const W = canvas.width;
  const H = canvas.height;

  function spawnBurst(originX, originY, angleMin, angleMax, speedMin, speedMax, count){
    for(let i = 0; i < count; i++){
      const angle = (angleMin + Math.random() * (angleMax - angleMin)) * (Math.PI / 180);
      const speed = speedMin + Math.random() * (speedMax - speedMin);
      confettiPieces.push({
        x: originX + (Math.random() - 0.5) * 30,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        size: Math.random() * 9 + 5,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 16,
        gravity: 0.4 + Math.random() * 0.2,
        settled: false,
        life: 0
      });
    }
  }

  // wide burst from the cut-cake button's position, scattering upward in many directions
  const btnRect = document.getElementById("cutCakeBtn").getBoundingClientRect();
  const btnX = btnRect.left + btnRect.width / 2;
  const btnY = btnRect.top + btnRect.height / 2;
  spawnBurst(btnX, btnY, 55, 125, 11, 22, 120);
  // side cannon: bottom-left corner shooting straight toward the top-right corner
  spawnBurst(W * 0.02, H * 0.98, 35, 60, 18, 30, 80);
  // side cannon: bottom-right corner shooting straight toward the top-left corner
  spawnBurst(W * 0.98, H * 0.98, 120, 145, 18, 30, 80);

  if(!confettiRunning){
    confettiRunning = true;
    requestAnimationFrame(confettiLoop);
  }
}

function confettiLoop(){
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  const floorY = canvas.height * 0.97;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiPieces.forEach(p => {
    p.life++;
    if(!p.settled){
      p.vy += p.gravity * 0.18;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.vx *= 0.995;

      if(p.y >= floorY){
        p.y = floorY;
        p.vy *= -0.35;
        if(Math.abs(p.vy) < 1.5) p.settled = true;
      }
    }

    const fadeStart = 260;
    const alpha = p.life > fadeStart ? Math.max(0, 1 - (p.life - fadeStart) / 40) : 1;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  });

  // drop fully-faded pieces so the array doesn't grow forever
  confettiPieces = confettiPieces.filter(p => p.life <= 300);

  if(confettiPieces.length > 0){
    requestAnimationFrame(confettiLoop);
  } else {
    confettiRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/* Keep confetti canvas sized correctly on resize */
window.addEventListener("resize", () => {
  const canvas = document.getElementById("confettiCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
