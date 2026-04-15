/* -------------------------------------------------------
   KNOBS (TOP + SYNTH)
------------------------------------------------------- */
document.querySelectorAll("[data-knob]").forEach(knob => {
  let isDragging = false;
  let value = 0.5;
  const indicator = knob.querySelector(".knob-indicator");
  const valueLabel = knob.parentElement.querySelector(".knob-value");

  const setAngle = () => {
    const angle = -135 + value * 270;
    indicator.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    if (valueLabel) valueLabel.textContent = Math.round(value * 100) + "%";
  };

  const update = e => {
    const rect = knob.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - cx;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - cy;
    const angle = Math.atan2(y, x) * 180 / Math.PI;
    let deg = angle - 90;
    if (deg < -180) deg += 360;
    deg = Math.max(-135, Math.min(135, deg));
    value = (deg + 135) / 270;
    setAngle();
  };

  knob.addEventListener("mousedown", e => { isDragging = true; update(e); });
  window.addEventListener("mousemove", e => { if (isDragging) update(e); });
  window.addEventListener("mouseup", () => isDragging = false);

  knob.addEventListener("touchstart", e => { isDragging = true; update(e); }, { passive: false });
  window.addEventListener("touchmove", e => { if (isDragging) update(e); }, { passive: false });
  window.addEventListener("touchend", () => isDragging = false);

  setAngle();
});

/* -------------------------------------------------------
   MODE SELECTION
------------------------------------------------------- */
document.querySelectorAll("[data-mode-group]").forEach(group => {
  group.querySelectorAll(".mode-item").forEach(item => {
    item.addEventListener("click", () => {
      group.querySelectorAll(".mode-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
  });
});

/* -------------------------------------------------------
   PRESETS (BYPASS FOOTSWITCH)
------------------------------------------------------- */
const presetIndicator = document.getElementById("preset-indicator");
const presets = ["A01", "A02", "A03", "B01", "B02", "C01"];
let presetIndex = 0;

document.querySelector('[data-foot="bypass"]').addEventListener("click", () => {
  presetIndex = (presetIndex + 1) % presets.length;
  presetIndicator.textContent = "Preset: " + presets[presetIndex];
});

/* -------------------------------------------------------
   AUDIO ENGINE (SYNTH + FX)
------------------------------------------------------- */
const audio = new (window.AudioContext || window.webkitAudioContext)();

const osc = audio.createOscillator();
const gain = audio.createGain();
const filter = audio.createBiquadFilter();
const lfo = audio.createOscillator();
const lfoGain = audio.createGain();

const delay = audio.createDelay(1.0);
const delayGain = audio.createGain();

const analyser = audio.createAnalyser();

/* Routing */
osc.connect(filter);
filter.connect(gain);
gain.connect(delay);
delay.connect(delayGain);
delayGain.connect(analyser);
analyser.connect(audio.destination);

/* LFO routing */
lfo.connect(lfoGain);
lfoGain.connect(filter.frequency);

/* Defaults */
osc.type = "sine";
gain.gain.value = 0;
filter.type = "lowpass";
filter.frequency.value = 800;

delay.delayTime.value = 0.18;
delayGain.gain.value = 0.25;

lfo.frequency.value = 2;
lfoGain.gain.value = 120;

osc.start();
lfo.start();

let envAttack = 0.05;

/* -------------------------------------------------------
   SYNTH CONTROLS
------------------------------------------------------- */
document.getElementById("osc-wave").addEventListener("change", e => {
  osc.type = e.target.value;
});

const synthKnobs = {
  cutoff: v => filter.frequency.value = 200 + v * 8000,
  attack: v => envAttack = 0.005 + v * 0.8,
  lfoRate: v => lfo.frequency.value = 0.1 + v * 10
};

document.querySelectorAll("[data-synth-knob]").forEach(knob => {
  let value = 0.5;
  const indicator = knob.querySelector(".knob-indicator");

  const update = () => {
    const angle = -135 + value * 270;
    indicator.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    const param = knob.getAttribute("data-synth-knob");
    synthKnobs[param](value);
  };

  knob.addEventListener("mousedown", e => {
    const move = ev => {
      const rect = knob.getBoundingClientRect();
      const y = ev.clientY - rect.top;
      value = 1 - Math.min(1, Math.max(0, y / rect.height));
      update();
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", () => {
      window.removeEventListener("mousemove", move);
    }, { once: true });
  });

  update();
});

/* -------------------------------------------------------
   TAP FOOTSWITCH = TRIGGER NOTE
------------------------------------------------------- */
document.querySelector('[data-foot="tap"]').addEventListener("click", async () => {
  if (audio.state === "suspended") await audio.resume();
  const now = audio.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.8, now + envAttack);
  gain.gain.linearRampToValueAtTime(0, now + envAttack + 0.4);
});

/* -------------------------------------------------------
   WAVEFORM VISUALIZER
------------------------------------------------------- */
const canvas = document.getElementById("waveform");
const ctx = canvas.getContext("2d");

const resizeCanvas = () => {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
};
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

analyser.fftSize = 2048;
const bufferLength = analyser.fftSize;
const dataArray = new Uint8Array(bufferLength);

function drawWaveform() {
  requestAnimationFrame(drawWaveform);
  analyser.getByteTimeDomainData(dataArray);

  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, w, h);

  ctx.lineWidth = 2 * window.devicePixelRatio;
  ctx.strokeStyle = "#3c7bd6";
  ctx.beginPath();

  const sliceWidth = w / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = v * h / 2;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    x += sliceWidth;
  }

  ctx.lineTo(w, h / 2);
  ctx.stroke();
}

drawWaveform();
