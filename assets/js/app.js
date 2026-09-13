const KEY = "iso_cafe_roleta_v1";
// Desative ao encerrar os testes para restaurar o bloqueio de participacao.
const TEST_MODE = true;
// Edite aqui o texto da etiqueta. O prêmio e a dedicatória usam a mesma configuração.
const DISCOUNT_TEXT = { value:"R$ 2", caption:"de desconto" };
const discountLabel = `${DISCOUNT_TEXT.value} ${DISCOUNT_TEXT.caption}`;
const prizes = [
  { id:"coffee", label:"Um café por nossa conta", probability:.10 },
  { id:"dessert", label:"Uma sobremesa", probability:.05 },
  { id:"discount", label:discountLabel, probability:.15 },
  { id:"nothing", label:"Não foi dessa vez", probability:.70 }
];

const $ = id => document.getElementById(id);
const screens = ["home","photo","result"];

function show(id) {
  screens.forEach(x => $(x).classList.toggle("hidden", x !== id));
  window.scrollTo(0,0);
}

function weightedRandom(items) {
  const r = Math.random();
  let sum = 0;
  for (const item of items) {
    sum += item.probability;
    if (r < sum) return item;
  }
  return items[items.length-1];
}

function makeCode() {
  return "ISO-" + Math.random().toString(36).slice(2,7).toUpperCase();
}

function celebrate() {
  const box = $("confetti");
  box.innerHTML = "";
  for (let i=0;i<45;i++) {
    const el=document.createElement("i");
    el.style.left=(Math.random()*100)+"%";
    el.style.animationDelay=(Math.random()*0.7)+"s";
    el.style.transform="rotate("+Math.random()*360+"deg)";
    box.appendChild(el);
  }
  setTimeout(()=>box.innerHTML="",2800);
}

function initializeIntro() {
  if (!TEST_MODE && localStorage.getItem(KEY)) {
    show("result");
    $("resultIcon").textContent="✓";
    $("resultEyebrow").textContent="Participação já realizada";
    $("resultTitle").textContent="Você já participou.";
    $("prize").textContent="Esta foto só pode ser revelada uma vez.";
    $("code").classList.add("hidden");
    $("resultNote").textContent="Obrigado por compartilhar seu momento com o Iso Café.";
  } else {
    show("home");
  }

  const intro = $("intro");
  const activeScreen = document.querySelector(".screen:not(#intro):not(.hidden)");
  activeScreen.inert = true;

  intro.querySelector(".shutter").addEventListener("animationend", () => {
    intro.classList.add("hidden");
    activeScreen.inert = false;
    document.body.classList.remove("loading");
  }, { once:true });

  const startOpening = () => {
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 150 : 850;
    setTimeout(() => intro.classList.add("opening"), delay);
  };
  if (document.readyState === "complete") startOpening();
  else window.addEventListener("load", startOpening, { once:true });
}

initializeIntro();

const PHOTO_REVEAL_MIN_MS = 4000;
const PHOTO_TRAVEL_MULTIPLIER = 8.5;
const photoAssets = {
  coffee:{ src:"assets/images/cafe.png", description:"Uma xícara de café com um coração na espuma." },
  dessert:{ src:"assets/images/sobremesa.png", description:"Uma fatia de bolo de chocolate em um prato de cerâmica." },
  discount:{ src:"assets/images/desconto.png", description:`Um café ao lado de uma etiqueta escrita: ${discountLabel}.` },
  nothing:{ src:"assets/images/cafeteria.png", description:"Um cantinho da cafeteria, com mesa junto à janela e um vaso de flores." }
};
let photoGame = null;
const polaroid = $("polaroid");
const photoShell = $("photoShell");
let photoPointer = null, previousPhotoX = 0, originPhotoX = 0, originPhotoY = 0;

function fitPhoto() {
  const stage = $("photoStage");
  if (stage.clientHeight === 0) return;
  const width = Math.min(340, stage.clientWidth - 38, (stage.clientHeight - 22) * .8);
  photoShell.style.width = `${Math.max(100, width)}px`;
}
new ResizeObserver(fitPhoto).observe($("photoStage"));

function resetPhotoPosition() {
  photoShell.classList.remove("dragging");
  photoShell.style.removeProperty("--move-x");
  photoShell.style.removeProperty("--move-y");
  photoShell.style.setProperty("--tilt", photoGame && photoGame.completed ? "0deg" : "-3deg");
}

function startPhotoGame() {
  stopPhoneMotion();
  // O sorteio continua idêntico à versão A; os gestos só revelam o resultado.
  photoGame = { prize:weightedRandom(prizes), progress:0, completed:false, announced:-1, startedAt:null, flipped:false, written:false, code:"", date:new Date() };
  if (photoPointer !== null && polaroid.hasPointerCapture(photoPointer)) polaroid.releasePointerCapture(photoPointer);
  photoPointer = null;
  polaroid.classList.remove("developed");
  polaroid.removeAttribute("aria-disabled");
  polaroid.removeAttribute("aria-hidden");
  polaroid.inert = false;
  polaroid.setAttribute("aria-label", "Foto para revelar. Arraste para os lados ou pressione as setas, Enter ou espaço repetidamente.");
  photoShell.classList.remove("flipped");
  $("photoBack").classList.remove("writing");
  $("photoBack").setAttribute("aria-hidden", "true");
  $("photoBack").inert = true;
  $("photoBack").querySelectorAll(".handwritten").forEach(line => line.replaceChildren());
  $("flipPhotoBtn").classList.add("hidden");
  $("flipPhotoBtn").textContent = "Virar foto";
  $("photoProgress").classList.remove("hidden");
  $("photoImage").src = photoAssets[photoGame.prize.id].src;
  $("discountInk").classList.toggle("hidden", photoGame.prize.id !== "discount");
  $("discountInkValue").textContent = DISCOUNT_TEXT.value;
  $("discountInkCaption").textContent = DISCOUNT_TEXT.caption;
  $("photoCaption").textContent = "Um instante de carinho.";
  $("photoInstructions").innerHTML = "Segure a foto e mova para os lados.<br>Deixe a lembrança aparecer, aos poucos.";
  $("confetti").innerHTML = "";
  resetPhotoPosition();
  renderPhoto();
  show("photo");
  fitPhoto();
  configurePhoneMotion();
  polaroid.focus({ preventScroll:true });
}

function renderPhoto() {
  const p = photoGame.progress;
  $("photoEmulsion").style.filter = `blur(${16 * (1-p)}px) saturate(${.2 + .8*p}) contrast(${.6 + .4*p})`;
  $("photoFog").style.opacity = String(1 - Math.pow(p, .85));
  $("photoProgress").value = Math.round(p * 100);
  const step = Math.floor(p * 10);
  if (step !== photoGame.announced) {
    photoGame.announced = step;
    $("photoStatus").textContent = p === 0 ? "Mova a foto para começar · 0%" : `A lembrança está aparecendo · ${step * 10}%`;
  }
}

function updatePhoto(amount) {
  if (!photoGame || photoGame.completed || amount <= 0) return;
  const now = performance.now();
  if (photoGame.startedAt === null) photoGame.startedAt = now;
  const timeLimit = Math.min(1, (now - photoGame.startedAt) / PHOTO_REVEAL_MIN_MS);
  photoGame.progress = Math.min(1, photoGame.progress + amount, timeLimit);
  renderPhoto();
  if (photoGame.progress >= 1) completePhoto();
}

function prepareDedication() {
  const result = photoGame.prize;
  const won = result.id !== "nothing";
  const messages = {
    coffee:"Seu momento ganhou um carinho da casa: um café por nossa conta.",
    dessert:"Seu momento ficou mais doce: você ganhou uma sobremesa da casa.",
    discount:`Um carinho para o seu café: você ganhou ${result.label}.`,
    nothing:"Desta vez não houve prêmio, mas seu momento já faz parte da nossa história. Obrigado por compartilhar."
  };
  const date = new Intl.DateTimeFormat("pt-BR", { day:"2-digit", month:"long", year:"numeric", timeZone:"America/Sao_Paulo" }).format(photoGame.date);
  const lines = [
    ["dedicationDate", date],
    ["dedicationGreeting", "Para guardar com carinho,"],
    ["dedicationMessage", messages[result.id]],
    ["dedicationCode", photoGame.code],
    ["dedicationNote", won ? "Mostre esta foto e o código no balcão para resgatar seu prêmio." : "Que venham muitos outros cafés e boas lembranças."],
    ["dedicationSignature", "Com carinho, Iso Café"]
  ];
  $("dedicationCode").classList.toggle("hidden", !won);
  let index = 0;
  for (const [id, text] of lines) {
    const line = $(id);
    const accessible = document.createElement("span");
    accessible.className = "sr-only";
    accessible.textContent = text;
    const visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");
    for (const character of Array.from(text)) {
      const ink = document.createElement("span");
      ink.className = "ink-char";
      ink.textContent = character;
      ink.style.setProperty("--ink-delay", `${.4 + index++ * .012}s`);
      visual.appendChild(ink);
    }
    line.replaceChildren(accessible, visual);
  }
}

function completePhoto() {
  if (!photoGame || photoGame.completed || photoGame.progress < 1) return;
  photoGame.completed = true;
  stopPhoneMotion();
  $("enableMotionBtn").classList.add("hidden");
  photoGame.code = photoGame.prize.id !== "nothing" ? makeCode() : "";
  polaroid.classList.add("developed");
  polaroid.setAttribute("aria-disabled", "true");
  polaroid.setAttribute("aria-label", "Foto revelada. " + photoAssets[photoGame.prize.id].description + " Use Virar foto para ler o recado.");
  resetPhotoPosition();
  prepareDedication();
  $("photoCaption").textContent = "Tem um recado no verso.";
  $("photoInstructions").innerHTML = "Sua lembrança está pronta.<br>Vire a foto para ler o que escrevemos para você.";
  $("photoStatus").textContent = "Foto revelada · seu recado está no verso";
  $("photoProgress").classList.add("hidden");
  $("flipPhotoBtn").classList.remove("hidden");
  if (document.activeElement === polaroid) $("flipPhotoBtn").focus({ preventScroll:true });
}

$("flipPhotoBtn").addEventListener("click", () => {
  if (!photoGame || !photoGame.completed) return;
  photoGame.flipped = !photoGame.flipped;
  photoShell.classList.toggle("flipped", photoGame.flipped);
  polaroid.inert = photoGame.flipped;
  polaroid.setAttribute("aria-hidden", String(photoGame.flipped));
  $("photoBack").inert = !photoGame.flipped;
  $("photoBack").setAttribute("aria-hidden", String(!photoGame.flipped));
  $("flipPhotoBtn").textContent = photoGame.flipped ? "Ver foto" : "Virar foto";
  $("photoStatus").textContent = photoGame.flipped ? "Uma dedicatória para guardar com você." : "Sua lembrança do Iso Café.";
  if (photoGame.flipped && !photoGame.written) {
    photoGame.written = true;
    $("photoBack").classList.add("writing");
  }
});

polaroid.addEventListener("pointerdown", event => {
  if (!photoGame || photoGame.completed || photoPointer !== null || event.button !== 0) return;
  photoPointer = event.pointerId;
  previousPhotoX = originPhotoX = event.clientX;
  originPhotoY = event.clientY;
  polaroid.setPointerCapture(photoPointer);
  photoShell.classList.add("dragging");
});
polaroid.addEventListener("pointermove", event => {
  if (event.pointerId !== photoPointer || !photoGame || photoGame.completed) return;
  const travel = Math.min(Math.abs(event.clientX - previousPhotoX), 48);
  previousPhotoX = event.clientX;
  if (travel < 1) return;
  const x = Math.max(-20, Math.min(20, (event.clientX - originPhotoX) * .15));
  const y = Math.max(-4, Math.min(4, (event.clientY - originPhotoY) * .03));
  photoShell.style.setProperty("--move-x", `${x}px`);
  photoShell.style.setProperty("--move-y", `${y}px`);
  photoShell.style.setProperty("--tilt", `${-3 + x * .2}deg`);
  updatePhoto(travel / (polaroid.offsetWidth * PHOTO_TRAVEL_MULTIPLIER));
});
function endPhotoMovement(event) {
  if (event.pointerId !== photoPointer) return;
  const pointer = photoPointer;
  photoPointer = null;
  if (polaroid.hasPointerCapture(pointer)) polaroid.releasePointerCapture(pointer);
  resetPhotoPosition();
}
polaroid.addEventListener("pointerup", endPhotoMovement);
polaroid.addEventListener("pointercancel", endPhotoMovement);
polaroid.addEventListener("lostpointercapture", endPhotoMovement);
polaroid.addEventListener("keydown", event => {
  if (["ArrowLeft", "ArrowRight", "Enter", " "].includes(event.key)) {
    event.preventDefault();
    updatePhoto(.06);
  }
});
polaroid.addEventListener("click", event => {
  if (event.detail === 0) updatePhoto(.06);
});
$("publishedBtn").addEventListener("click", () => {
  if (!TEST_MODE && localStorage.getItem(KEY)) return;
  if (!TEST_MODE) localStorage.setItem(KEY, JSON.stringify({ timestamp:Date.now() }));
  startPhotoGame();
});


const MOTION_SHAKE_THRESHOLD = 3;
const MOTION_SAMPLE_MS = 50;
const MOTION_COOLDOWN_MS = 160;
const motionState = { enabled:false, pending:false, granted:false, requestId:0, previous:null, lastSample:null, lastShake:-Infinity, probeTimer:null, settleTimer:null };

function canUsePhoneMotion() {
  return window.isSecureContext && typeof window.DeviceMotionEvent !== "undefined" &&
    (navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches);
}

function stopPhoneMotion() {
  motionState.requestId++;
  motionState.enabled = false;
  motionState.pending = false;
  motionState.previous = null;
  motionState.lastSample = null;
  motionState.lastShake = -Infinity;
  clearTimeout(motionState.probeTimer);
  clearTimeout(motionState.settleTimer);
  window.removeEventListener("devicemotion", handlePhoneMotion);
  $("enableMotionBtn").disabled = false;
  $("enableMotionBtn").setAttribute("aria-pressed", "false");
  $("enableMotionBtn").textContent = "Ativar movimento do celular";
}

function configurePhoneMotion() {
  $("enableMotionBtn").classList.toggle("hidden", !canUsePhoneMotion());
}

function motionFallback(message) {
  stopPhoneMotion();
  resetPhotoPosition();
  if (photoGame && !photoGame.completed) {
    $("photoInstructions").innerHTML = message + "<br>Você pode continuar arrastando a foto.";
    $("enableMotionBtn").textContent = "Tentar ativar movimento";
  }
}

function motionVector(event) {
  for (const source of ["acceleration", "accelerationIncludingGravity"]) {
    const value = event[source];
    if (value && [value.x, value.y, value.z].every(Number.isFinite)) {
      return { x:value.x, y:value.y, z:value.z, source:source };
    }
  }
  return null;
}

function handlePhoneMotion(event) {
  if (!motionState.enabled || !photoGame || photoGame.completed || document.hidden || $("photo").classList.contains("hidden")) return;
  const vector = motionVector(event);
  if (!vector) return;
  clearTimeout(motionState.probeTimer);
  const now = performance.now();
  const elapsed = motionState.lastSample === null ? Infinity : now - motionState.lastSample;
  if (elapsed < MOTION_SAMPLE_MS) return;
  const previous = motionState.previous;
  motionState.previous = vector;
  motionState.lastSample = now;
  // A primeira amostra e pausas longas só estabelecem a referência.
  if (!previous || previous.source !== vector.source || elapsed > 500) return;
  const delta = Math.hypot(vector.x - previous.x, vector.y - previous.y, vector.z - previous.z);
  // Diferenças entre amostras evitam contar a gravidade de um aparelho parado.
  if (delta < MOTION_SHAKE_THRESHOLD || now - motionState.lastShake < MOTION_COOLDOWN_MS || photoPointer !== null) return;
  motionState.lastShake = now;
  updatePhoto(Math.min(.075, delta * .008));
  if (!photoGame.completed && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    photoShell.style.setProperty("--tilt", (vector.x >= previous.x ? 2 : -6) + "deg");
    clearTimeout(motionState.settleTimer);
    motionState.settleTimer = setTimeout(resetPhotoPosition, 180);
  }
}

$("enableMotionBtn").addEventListener("click", async () => {
  if (!photoGame || photoGame.completed || motionState.pending || !canUsePhoneMotion()) return;
  if (motionState.enabled) {
    stopPhoneMotion();
    resetPhotoPosition();
    $("photoInstructions").innerHTML = "Segure a foto e mova para os lados.<br>Deixe a lembrança aparecer, aos poucos.";
    return;
  }
  motionState.pending = true;
  const requestId = ++motionState.requestId;
  $("enableMotionBtn").disabled = true;
  $("enableMotionBtn").textContent = "Aguardando permissão...";
  try {
    // O pedido é iniciado diretamente pelo toque, como exigido no iOS.
    if (!motionState.granted && typeof window.DeviceMotionEvent.requestPermission === "function") {
      const permission = await window.DeviceMotionEvent.requestPermission();
      if (requestId !== motionState.requestId) return;
      if (permission !== "granted") {
        motionFallback("Movimento não autorizado.");
        return;
      }
      motionState.granted = true;
    }
    if (requestId !== motionState.requestId || photoGame.completed || document.hidden) return;
    motionState.pending = false;
    motionState.enabled = true;
    motionState.previous = null;
    motionState.lastSample = null;
    motionState.lastShake = -Infinity;
    $("enableMotionBtn").disabled = false;
    $("enableMotionBtn").setAttribute("aria-pressed", "true");
    $("enableMotionBtn").textContent = "Movimento ativado · desativar";
    $("photoInstructions").innerHTML = "Balance suavemente o celular.<br>Você também pode arrastar a foto.";
    window.addEventListener("devicemotion", handlePhoneMotion, { passive:true });
    motionState.probeTimer = setTimeout(() => {
      if (motionState.enabled) motionFallback("Não recebemos dados do sensor.");
    }, 3500);
  } catch (error) {
    if (requestId === motionState.requestId) motionFallback("Não foi possível ativar o movimento.");
  } finally {
    if (requestId === motionState.requestId) {
      motionState.pending = false;
      $("enableMotionBtn").disabled = false;
    }
  }
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) return;
  const wasActive = motionState.enabled || motionState.pending;
  stopPhoneMotion();
  resetPhotoPosition();
  if (wasActive && photoGame && !photoGame.completed) {
    $("photoInstructions").innerHTML = "Movimento pausado.<br>Ative novamente ou arraste a foto.";
  }
});
window.addEventListener("pagehide", stopPhoneMotion);
