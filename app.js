/* ==========================================================================
   SHAKTI SAFETY APP — MAIN APPLICATION LOGIC
   ========================================================================== */

// --- Global Application State ---
const state = {
  currentLanguage: 'en', // 'en' or 'hi'
  activeScreen: 'screen-home',
  contacts: [],
  sirenActive: false,
  sosActive: false,
  sosCountdownTimer: null,
  sosHoldProgress: 0,
  sosHoldInterval: null,
  fakeCallTimer: null,
  fakeCallCountdownInterval: null,
  fakeCallActive: false,
  fakeCallSpeakerOn: false,
  mapRouteActive: false,
  mapWalkActive: false,
  mapWalkProgress: 0, // 0 to 1
  mapFilter: 'all', // 'all', 'police', 'safehouse'
  recordingActive: false,
  recordingTime: 0,
  recordingInterval: null,
  recordingsLog: [],
  microphoneStream: null,
  audioContext: null,
  speechSynthUtterance: null,
  
  // Custom Settings (Saved to LocalStorage)
  userName: "Nisha Sharma",
  safetyPin: "1234",
  enteredPin: "",
  batteryLevel: 85,
  lastKnownLat: null,
  lastKnownLng: null
};

// --- Daily Safety Tips Database ---
const safetyTips = [
  {
    en: "When walking alone at night, keep your head up and dynamic posture. Avoid staring down at your mobile phone.",
    hi: "रात में अकेले चलते समय, अपना सिर ऊंचा रखें और सतर्क रहें। मोबाइल फोन में लगातार देखने से बचें।"
  },
  {
    en: "If you feel you are being followed, change direction immediately or cross the street. Head towards a lit shop or crowd.",
    hi: "यदि आपको लगे कि कोई आपका पीछा कर रहा है, तो तुरंत दिशा बदलें या सड़क पार करें। किसी रोशनी वाली दुकान या भीड़ की ओर जाएं।"
  },
  {
    en: "Always keep your phone in your hand or outer pocket in suspicious areas, rather than deep in a backpack.",
    hi: "संदेहास्पद क्षेत्रों में अपने फोन को बैग में अंदर रखने के बजाय हमेशा अपने हाथ में या बाहरी जेब में रखें।"
  },
  {
    en: "Fake Call can act as an immediate deterrent. Speak loudly: 'Yes, I am reaching in 2 minutes, police station is right ahead.'",
    hi: "आभासी (नकली) कॉल एक त्वरित बचाव हो सकता है। ज़ोर से बोलें: 'हाँ, मैं २ मिनट में पहुँच रही हूँ, पुलिस स्टेशन ठीक आगे है।'"
  }
];

// --- Helplines Directory Database ---
const helplines = [
  { nameEn: "National Emergency Number", nameHi: "राष्ट्रीय आपातकालीन नंबर", number: "112", descEn: "All-in-one emergency response system", descHi: "सभी आपातकालीन सेवाओं के लिए एकल नंबर" },
  { nameEn: "Women Helpline (National)", nameHi: "महिला हेल्पलाइन (राष्ट्रीय)", number: "1091", descEn: "Dedicated 24/7 support for women in distress", descHi: "संकट में महिलाओं के लिए २४/७ समर्पित सेवा" },
  { nameEn: "Women Distress Helpline", nameHi: "महिला संकट शिकायत सेवा", number: "181", descEn: "Direct counseling and support line", descHi: "परामर्श और सहायता के लिए सीधा नंबर" },
  { nameEn: "Police Control Room (PCR)", nameHi: "पुलिस नियंत्रण कक्ष", number: "100", descEn: "Immediate local police assistance", descHi: "तत्काल स्थानीय पुलिस सहायता" },
  { nameEn: "Ambulance Services", nameHi: "एम्बुलेंस सेवा", number: "102", descEn: "Medical emergency hospital dispatch", descHi: "चिकित्सा आपातकाल और एम्बुलेंस सहायता" },
  { nameEn: "Cyber Crime Helpline", nameHi: "साइबर अपराध शिकायत", number: "1930", descEn: "Report online harassment and safety issues", descHi: "ऑनलाइन उत्पीड़न और वित्तीय धोखाधड़ी रिपोर्ट" },
  { nameEn: "Domestic Abuse Helpline", nameHi: "घरेलू हिंसा निवारण", number: "181", descEn: "Support against domestic violence", descHi: "घरेलू हिंसा के खिलाफ तत्काल सहायता" },
  { nameEn: "Student Safety Line", nameHi: "छात्र सुरक्षा हेल्पलाइन", number: "1098", descEn: "Child/Student safety and harassment support", descHi: "बच्चों और छात्राओं की सुरक्षा व सहायता" }
];

// --- Self Defense Guides Database ---
const defenseGuides = [
  {
    category: "physical",
    titleEn: "The Palm Strike (Stun Move)",
    titleHi: "हथेली का प्रहार (अचेत करने वाली चाल)",
    descEn: "Use the heel of your palm to strike upward under the attacker's nose or chin. This forces their head back and causes intense disorientation, giving you time to run.",
    descHi: "हमलावर की नाक या ठुड्डी के नीचे ऊपर की ओर वार करने के लिए अपनी हथेली के पिछले हिस्से का उपयोग करें। यह उनके सिर को पीछे की ओर धकेलता है और भ्रम पैदा करता है।"
  },
  {
    category: "physical",
    titleEn: "The Groin Kick",
    titleHi: "कमर के नीचे वार (ग्रोइन किक)",
    descEn: "Deliver a swift, hard kick to the groin using your shin or shoelaces. This is highly effective at disabling attackers of any size instantly.",
    descHi: "अपने पैर की पिंडली या जूते के फीते वाले हिस्से का उपयोग करके हमलावर के अंगों पर तेज़, ज़ोरदार प्रहार करें। यह किसी भी हमलावर को तुरंत बेअसर करने में प्रभावी है।"
  },
  {
    category: "physical",
    titleEn: "Escape Wrist Grabs",
    titleHi: "कलाई की पकड़ से बाहर निकलना",
    descEn: "Do not pull backward. Rotate your hand towards the attacker's thumb, where their grip is weakest, and yank your arm out with force.",
    descHi: "पीछे की ओर न खींचें। अपनी कलाई को हमलावर के अंगूठे की ओर घुमाएं, जहां उनकी पकड़ सबसे कमजोर होती है, और अपने हाथ को झटके से बाहर खींचें।"
  },
  {
    category: "mental",
    titleEn: "Maintain Situational Awareness",
    titleHi: "परिस्थिति के प्रति जागरूकता",
    descEn: "Keep one earbud out if listening to music. Regularly scan 360 degrees. Make brief eye contact with people nearby so they know you notice them.",
    descHi: "संगीत सुनते समय एक कान से ईयरबड बाहर रखें। समय-समय पर ३६० डिग्री चारों ओर नजर डालें। आस-पास के लोगों से नजरें मिलाएं ताकि उन्हें पता चले कि आप सतर्क हैं।"
  },
  {
    category: "mental",
    titleEn: "Use the 'Vocal Shield'",
    titleHi: "कंठ सुरक्षा का उपयोग ('चिल्लाना')",
    descEn: "If approached, shout clear instructions like 'STOP!' or 'BACK OFF!' instead of screaming. Screaming sounds like panic, shouting commands shows control.",
    descHi: "यदि कोई पास आए, तो डरकर रोने के बजाय ज़ोर से चिल्लाएं: 'रुको!' या 'पीछे हटो!'। चिल्लाना आदेश देने जैसा होना चाहिए, भय जैसा नहीं।"
  },
  {
    category: "legal",
    titleEn: "Right to Zero FIR",
    titleHi: "जीरो एफआईआर (Zero FIR) का अधिकार",
    descEn: "A woman can file an FIR at ANY police station, irrespective of where the crime took place. The police must register it and transfer it to the correct precinct later.",
    descHi: "एक महिला किसी भी पुलिस स्टेशन में प्राथमिकी (FIR) दर्ज करा सकती है, चाहे अपराध कहीं भी हुआ हो। पुलिस को इसे दर्ज करना ही होगा।"
  },
  {
    category: "legal",
    titleEn: "Right to Safe Detention",
    titleHi: "सुरक्षित हिरासत का अधिकार",
    descEn: "Under Section 46(4) of CrPC, women cannot be arrested after sunset and before sunrise, except in exceptional circumstances by a female officer with magistrate approval.",
    descHi: "CrPC की धारा 46(4) के तहत, असाधारण परिस्थितियों को छोड़कर, किसी भी महिला को सूर्यास्त के बाद और सूर्योदय से पहले गिरफ्तार नहीं किया जा सकता।"
  }
];

// --- Simulated Map Markers (Safety Radar) ---
let radarPoints = [];

// DTMF key frequencies
const dtmfFreqs = {
  '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
  '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
  '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
  '0': [941, 1336]
};

// --- Siren Web Audio Synthesizer ---
let sirenOsc1 = null;
let sirenOsc2 = null;
let sirenGain = null;
let sirenInterval = null;

// --- Ringer Web Audio Synthesizer ---
let ringerOsc = null;
let ringerGain = null;
let ringerInterval = null;

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", () => {
  initDateTime();
  initLanguages();
  loadContacts();
  initSOSButton();
  initFakeCall();
  initRadarMap();
  initAudioWitness();
  initHelplines();
  initSelfDefense();
  initNavFooter();
  initSettings();
  initPinKeypad();
  initBattery();
  initShakeSensor();
  
  // Pre-fetch location to request permission early
  prefetchLocation();
  
  // Set random safety tip of the day
  setDailyTip();

  // Create customized toast notifications system
  showToast("System Active & Secured", "कवच सक्रिय और सुरक्षित");

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker Registered!', reg))
      .catch(err => console.error('Service Worker Registration Failed!', err));
  }
});

// Pre-fetch location to ask for permission early and cache coordinates
function prefetchLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("Pre-fetched location successfully:", pos.coords.latitude, pos.coords.longitude);
        state.lastKnownLat = pos.coords.latitude;
        state.lastKnownLng = pos.coords.longitude;
      },
      (err) => {
        console.warn("Pre-fetch geolocation failed/ignored:", err);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 } // cache up to 10 mins
    );
  }
}

// Update Simulated Device Clock
function initDateTime() {
  const timeDisplay = document.getElementById("status-time");
  const updateClock = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    timeDisplay.textContent = `${hours}:${minutes}`;
  };
  updateClock();
  setInterval(updateClock, 1000);
}

// Battery Consumption Simulation
function initBattery() {
  const batLevel = document.getElementById("battery-level");
  const batText = document.getElementById("battery-text");
  
  setInterval(() => {
    // Sirens, flash, active recording consumes battery faster
    let drain = 0.02;
    if (state.sirenActive) drain += 0.2;
    if (state.recordingActive) drain += 0.1;
    
    state.batteryLevel = Math.max(2, state.batteryLevel - drain);
    const rounded = Math.round(state.batteryLevel);
    batLevel.style.width = rounded + "%";
    batText.textContent = rounded + "%";
    
    // Low battery warning
    if (rounded < 15) {
      batLevel.style.backgroundColor = "var(--neon-red)";
    } else {
      batLevel.style.backgroundColor = "var(--text-secondary)";
    }
  }, 3000);
}

// Set Daily Tip
function setDailyTip() {
  const index = Math.floor(Math.random() * safetyTips.length);
  document.getElementById("daily-tip-text").innerText = safetyTips[index].en;
  document.getElementById("daily-tip-text-hi").innerText = safetyTips[index].hi;
}

// ==================== CONFIGURATION & PROFILE SETTINGS ====================
function initSettings() {
  // Load configuration from local storage
  const savedPin = localStorage.getItem("shakti_settings_pin");
  const savedName = localStorage.getItem("shakti_settings_name");
  
  // Robust check: Ensure stored pin is valid, else fallback and force reset to default "1234"
  if (savedPin && savedPin.length === 4 && !isNaN(savedPin) && Number.isInteger(Number(savedPin)) && Number(savedPin) >= 0) {
    state.safetyPin = savedPin;
  } else {
    state.safetyPin = "1234";
    localStorage.setItem("shakti_settings_pin", "1234");
  }
  
  if (savedName) {
    state.userName = savedName;
  } else {
    state.userName = "Nisha Sharma";
    localStorage.setItem("shakti_settings_name", "Nisha Sharma");
  }
  
  document.getElementById("settings-pin").value = state.safetyPin;
  document.getElementById("settings-user-name").value = state.userName;
  
  document.getElementById("save-settings-btn").addEventListener("click", () => {
    const pinVal = document.getElementById("settings-pin").value.trim();
    const nameVal = document.getElementById("settings-user-name").value.trim();
    
    if (pinVal.length !== 4 || isNaN(pinVal) || !Number.isInteger(Number(pinVal)) || Number(pinVal) < 0) {
      showToast("PIN must be exactly 4 digits!", "पिन ठीक ४ अंकों का होना चाहिए!");
      return;
    }
    
    state.safetyPin = pinVal;
    state.userName = nameVal;
    
    localStorage.setItem("shakti_settings_pin", pinVal);
    localStorage.setItem("shakti_settings_name", nameVal);
    
    showToast("Settings Updated", "सेटिंग्स सेव हो गई हैं");
    switchScreen("screen-home");
  });
}

// ==================== TRANSLATIONS (EN / HI) ====================
function initLanguages() {
  const langBtn = document.getElementById("lang-btn");
  langBtn.addEventListener("click", () => {
    state.currentLanguage = state.currentLanguage === 'en' ? 'hi' : 'en';
    
    // Toggle active label styles
    const labels = langBtn.querySelectorAll(".lang-lbl");
    labels.forEach(lbl => lbl.classList.toggle("active"));

    // Trigger page-wide translations
    translateApp();
  });
}

function translateApp() {
  const lang = state.currentLanguage;
  
  // Find all elements with classes ending in -en and -hi
  const englishEls = document.querySelectorAll("[class*='-en']");
  const hindiEls = document.querySelectorAll("[class*='-hi']");
  
  if (lang === 'hi') {
    englishEls.forEach(el => {
      if (el.tagName === 'SPAN' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'P' || el.tagName === 'LABEL' || el.tagName === 'DIV' || el.tagName === 'STRONG') {
        el.classList.add("hide");
      }
    });
    hindiEls.forEach(el => {
      el.classList.remove("hide");
    });
    // Form Inputs
    document.getElementById("contact-name").placeholder = "जैसे: बहन, माताजी, सहेली";
    document.getElementById("contact-phone").placeholder = "१० अंकों का मोबाइल नंबर";
    document.getElementById("fake-caller-name").placeholder = "जैसे: पुलिस, पापा, बॉस";
    document.getElementById("helpline-search").placeholder = "हेल्पलाइन खोजें...";
  } else {
    englishEls.forEach(el => {
      el.classList.remove("hide");
    });
    hindiEls.forEach(el => {
      if (el.tagName === 'SPAN' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'P' || el.tagName === 'LABEL' || el.tagName === 'DIV' || el.tagName === 'STRONG') {
        el.classList.add("hide");
      }
    });
    // Form Inputs
    document.getElementById("contact-name").placeholder = "e.g. Sister, Mom, Friend";
    document.getElementById("contact-phone").placeholder = "10 Digit Mobile No.";
    document.getElementById("fake-caller-name").placeholder = "Mom 💖";
    document.getElementById("helpline-search").placeholder = "Search helpline / खोजें...";
  }

  // Redraw elements that depend on active language
  renderRecordingsList();
  renderHelplinesList();
  renderDefenseAcademy();
  drawRadarMap();
}

// ==================== SCREEN NAVIGATION ====================
function switchScreen(screenId) {
  // Hide active screen
  const activeScreenEl = document.getElementById(state.activeScreen);
  if (activeScreenEl) activeScreenEl.classList.remove("active");
  
  // Show new screen
  const targetScreenEl = document.getElementById(screenId);
  if (targetScreenEl) targetScreenEl.classList.add("active");
  
  state.activeScreen = screenId;

  // Sync Footer active tab if the screen matches a footer tab ID
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    if (item.getAttribute("data-screen") === screenId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Screen Specific Actions
  if (screenId === 'screen-safemap') {
    setTimeout(() => {
      initializeRealMap();
    }, 100);
  }
}

function initNavFooter() {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const screenId = item.getAttribute("data-screen");
      switchScreen(screenId);
    });
  });
}

// ==================== EMERGENCY CONTACTS (CRUD) ====================
function loadContacts() {
  const localData = localStorage.getItem("shakti_emergency_contacts");
  if (localData) {
    state.contacts = JSON.parse(localData);
  } else {
    // Seed default emergency contacts for initial run
    state.contacts = [
      { id: 1, name: "Police Patrol Hub", phone: "112" },
      { id: 2, name: "Women Cell Emergency", phone: "1091" }
    ];
    saveContactsToLocal();
  }
  renderContactsList();
}

function saveContactsToLocal() {
  localStorage.setItem("shakti_emergency_contacts", JSON.stringify(state.contacts));
}

function renderContactsList() {
  const listContainer = document.getElementById("contacts-list");
  listContainer.innerHTML = "";
  
  if (state.contacts.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state-contacts">
        <i class="fa-solid fa-users-slash"></i>
        <p class="empty-text-en">No emergency contacts added yet.</p>
        <p class="empty-text-hi hide">अभी तक कोई आपातकालीन संपर्क नहीं जोड़ा गया है।</p>
      </div>
    `;
    translateApp();
    return;
  }
  
  state.contacts.forEach(c => {
    const card = document.createElement("div");
    card.className = "contact-card";
    card.innerHTML = `
      <div class="contact-main">
        <div class="contact-avatar">
          <i class="fa-solid fa-user-shield"></i>
        </div>
        <div class="contact-details">
          <h4>${c.name}</h4>
          <p>${c.phone}</p>
        </div>
      </div>
      <button class="delete-contact-btn" onclick="deleteContact(${c.id})" aria-label="Delete Contact">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    listContainer.appendChild(card);
  });
  
  // Re-apply current language settings
  translateApp();
}

// Form Submission Add Contact
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("contact-name");
  const phoneInput = document.getElementById("contact-phone");
  
  const newContact = {
    id: Date.now(),
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim()
  };
  
  state.contacts.push(newContact);
  saveContactsToLocal();
  renderContactsList();
  
  nameInput.value = "";
  phoneInput.value = "";
  
  showToast("Contact Added Successfully", "संपर्क सफलतापूर्वक जोड़ा गया");
});

function deleteContact(id) {
  state.contacts = state.contacts.filter(c => c.id !== id);
  saveContactsToLocal();
  renderContactsList();
  showToast("Contact Deleted", "संपर्क हटा दिया गया");
}

// ==================== WEB AUDIO SIREN GENERATOR ====================
function startAudioContext() {
  if (!state.audioContext) {
    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (state.audioContext.state === 'suspended') {
    state.audioContext.resume();
  }
}

function startSirenAlarm() {
  try {
    startAudioContext();
    
    if (state.sirenActive) return;

    const ctx = state.audioContext;
    if (!ctx) return;
    sirenGain = ctx.createGain();
    sirenGain.gain.setValueAtTime(0, ctx.currentTime);
    sirenGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.1);
    sirenGain.connect(ctx.destination);

    // Twin oscillators for oscillating warning sound
    sirenOsc1 = ctx.createOscillator();
    sirenOsc1.type = 'sawtooth';
    sirenOsc1.frequency.setValueAtTime(400, ctx.currentTime);
    sirenOsc1.connect(sirenGain);
    sirenOsc1.start();

    sirenOsc2 = ctx.createOscillator();
    sirenOsc2.type = 'sine';
    sirenOsc2.frequency.setValueAtTime(600, ctx.currentTime);
    sirenOsc2.connect(sirenGain);
    sirenOsc2.start();

    // Modulate siren frequencies up and down
    let highFrequency = true;
    sirenInterval = setInterval(() => {
      try {
        const time = ctx.currentTime;
        if (highFrequency) {
          sirenOsc1.frequency.exponentialRampToValueAtTime(1000, time + 0.35);
          sirenOsc2.frequency.exponentialRampToValueAtTime(800, time + 0.35);
        } else {
          sirenOsc1.frequency.exponentialRampToValueAtTime(400, time + 0.35);
          sirenOsc2.frequency.exponentialRampToValueAtTime(500, time + 0.35);
        }
        highFrequency = !highFrequency;
      } catch (err) {
        console.warn("Error modulating siren:", err);
      }
    }, 400);

    state.sirenActive = true;
    updateSirenUI();
  } catch (err) {
    console.error("Failed to start siren alarm:", err);
    state.sirenActive = true;
    updateSirenUI();
  }
}

function stopSirenAlarm() {
  if (!state.sirenActive) return;

  clearInterval(sirenInterval);
  
  if (sirenOsc1) {
    sirenOsc1.stop();
    sirenOsc1.disconnect();
    sirenOsc1 = null;
  }
  if (sirenOsc2) {
    sirenOsc2.stop();
    sirenOsc2.disconnect();
    sirenOsc2 = null;
  }
  if (sirenGain) {
    sirenGain.disconnect();
    sirenGain = null;
  }

  state.sirenActive = false;
  updateSirenUI();
}

function updateSirenUI() {
  const sirenBadge = document.getElementById("siren-status-badge");
  const quickCard = document.getElementById("quick-siren-card");
  
  if (state.sirenActive) {
    sirenBadge.textContent = "ON";
    sirenBadge.classList.add("siren-active");
    quickCard.style.borderColor = "var(--neon-red)";
  } else {
    sirenBadge.textContent = "OFF";
    sirenBadge.classList.remove("siren-active");
    quickCard.style.borderColor = "var(--border-color)";
  }
}

// Click card helper for quick siren toggle
document.getElementById("quick-siren-card").addEventListener("click", () => {
  if (state.sirenActive) {
    stopSirenAlarm();
    showToast("Siren Silenced", "साइरन बंद किया गया");
  } else {
    startSirenAlarm();
    showToast("Loud Siren Active", "तेज़ साइरन सक्रिय");
  }
});

// ==================== SOS ALARM EMULATOR CONTROLS ====================
function initSOSButton() {
  const sosBtn = document.getElementById("sos-button");
  const progressBar = document.getElementById("sos-progress-bar");
  const countdownOverlay = document.getElementById("sos-countdown-overlay");
  const countdownNumber = document.getElementById("countdown-number");

  let maxHoldMs = 3000;
  let progressStepMs = 100;

  const startHold = (e) => {
    e.preventDefault();
    if (state.sosHoldInterval) return; // Prevent multiple intervals
    startAudioContext();
    
    state.sosHoldProgress = 0;
    countdownOverlay.classList.remove("hide");
    countdownNumber.textContent = "3";
    
    const helperEn = countdownOverlay.querySelector('.countdown-helper-en');
    const helperHi = countdownOverlay.querySelector('.countdown-helper-hi');
    if (helperEn) helperEn.textContent = "Release to Cancel";
    if (helperHi) helperHi.textContent = "रद्द करने के लिए छोड़ें";
    
    playTickSound();
    if (navigator.vibrate) navigator.vibrate(50);

    // Track mouseup and touchend globally to handle mouse drift
    document.addEventListener("mouseup", endHold);
    document.addEventListener("touchend", endHold);

    state.sosHoldInterval = setInterval(() => {
      state.sosHoldProgress += progressStepMs;
      
      // Calculate progress svg offset (max 283)
      const ratio = Math.min(1, state.sosHoldProgress / maxHoldMs);
      const offset = 283 - (283 * ratio);
      progressBar.style.strokeDashoffset = offset;

      const secRemaining = Math.ceil((maxHoldMs - state.sosHoldProgress) / 1000);
      countdownNumber.textContent = secRemaining > 0 ? secRemaining : "0";

      if (state.sosHoldProgress >= maxHoldMs) {
        if (helperEn) helperEn.textContent = "RELEASE TO SEND SOS NOW";
        if (helperHi) helperHi.textContent = "अभी भेजने के लिए छोड़ें!";
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      } else {
        if (navigator.vibrate) navigator.vibrate(50);
      }
    }, progressStepMs);
  };

  const endHold = (e) => {
    // Clean up global listeners
    document.removeEventListener("mouseup", endHold);
    document.removeEventListener("touchend", endHold);

    if (state.sosHoldInterval) {
      clearInterval(state.sosHoldInterval);
      state.sosHoldInterval = null;
    }
    progressBar.style.strokeDashoffset = 283;
    countdownOverlay.classList.add("hide");

    // Check if the hold reached 3 seconds, and trigger SOS synchronously on release
    if (state.sosHoldProgress >= maxHoldMs) {
      state.sosHoldProgress = 0;
      triggerSOSAlert();
    } else {
      state.sosHoldProgress = 0;
    }
  };

  sosBtn.addEventListener("mousedown", startHold);
  sosBtn.addEventListener("touchstart", startHold);
  
  sosBtn.addEventListener("touchcancel", () => {
    document.removeEventListener("touchend", endHold);
    if (state.sosHoldInterval) {
      clearInterval(state.sosHoldInterval);
      state.sosHoldInterval = null;
    }
    progressBar.style.strokeDashoffset = 283;
    countdownOverlay.classList.add("hide");
    state.sosHoldProgress = 0;
  });

  // Deactivate Overlay SOS button trigger PIN input modal
  document.getElementById("deactivate-sos-btn").addEventListener("click", () => {
    openPinLockModal();
  });

  // Manual WhatsApp trigger button on overlay
  const manualWhatsAppBtn = document.getElementById("manual-whatsapp-btn");
  if (manualWhatsAppBtn) {
    manualWhatsAppBtn.addEventListener("click", () => {
      sendLocationToSister();
    });
  }
}

function initShakeSensor() {
  let lastX, lastY, lastZ;
  let lastUpdate = 0;
  const shakeThreshold = 20; // threshold for vigorous shake

  window.addEventListener('devicemotion', (event) => {
    if (state.sosActive) return; // Ignore if already active

    const current = event.accelerationIncludingGravity;
    if (!current || current.x === null) return;

    const currentTime = Date.now();
    if ((currentTime - lastUpdate) > 100) {
      const diffTime = (currentTime - lastUpdate);
      lastUpdate = currentTime;

      const x = current.x;
      const y = current.y;
      const z = current.z;

      if (lastX !== undefined) {
        const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
        if (speed > shakeThreshold * 100) {
          console.log("Shake detected!");
          // Trigger SOS directly
          triggerSOSAlert();
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    }
  });
}

function playTickSound() {
  try {
    if (!state.audioContext) return;
    const ctx = state.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (err) {
    console.warn("Failed to play tick sound:", err);
  }
}

function triggerSOSAlert() {
  state.sosActive = true;
  
  // Show full strobe lights warning screen
  document.getElementById("strobe-siren-overlay").classList.remove("hide");
  
  // Update status banner to red alert mode
  const banner = document.getElementById("home-status-banner");
  banner.classList.remove("safe");
  banner.classList.add("alert-active");
  banner.querySelector(".status-text-en").textContent = "SOS ALARM DISPATCHED • HELP IN ROUTE";
  banner.querySelector(".status-text-hi").textContent = "आपातकालीन संदेश भेजा गया • सहायता आ रही है";

  // Sound highest siren
  startSirenAlarm();
  if (navigator.vibrate) navigator.vibrate([400, 200, 400, 200, 400, 200, 400]);

  // Speak out voice warning script via browser SpeechSynthesis
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const speakText = state.currentLanguage === 'en' 
      ? "Emergency SOS activated! Alerting your safety guardians."
      : "आपातकालीन एसओएस सक्रिय! आपके संरक्षकों को सूचित किया जा रहा है।";
    const utterance = new SpeechSynthesisUtterance(speakText);
    utterance.lang = state.currentLanguage === 'en' ? 'en-US' : 'hi-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  // Create simulated notification to user about SMS being dispatched
  let contactsListText = state.contacts.map(c => `${c.name} (${c.phone})`).join(", ");
  if (!contactsListText) contactsListText = "No guardians listed";
  
  showToast("SOS Alert Dispatched!", "आपातकालीन संदेश भेजा गया!");
  
  // Removed blocking browser alert. Redirect directly to WhatsApp.
  setTimeout(() => {
    if (state.sosActive) {
      sendLocationToSister();
      
      // Start continuous location pings
      if (state.sosLocationInterval) clearInterval(state.sosLocationInterval);
      state.sosLocationInterval = setInterval(() => {
        if (!state.sosActive) {
          clearInterval(state.sosLocationInterval);
          return;
        }
        showToast("Live Location Ping Sent", "लाइव लोकेशन गार्जियन को भेजी गई");
      }, 10000);
    }
  }, 500);
}

function sendLocationToSister() {
  if (state.contacts.length === 0) {
    showToast("No guardians found! Add contacts first.", "कोई संरक्षक नहीं मिला! पहले संपर्क जोड़ें!");
    return;
  }

  showToast("Locating... WhatsApp buttons ready below!", "लोकेशन मिल रही है...");

  const doSend = (lat, lng) => {
    const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;

    // Update location link in overlay
    const linkEn = document.getElementById("sos-location-link-en");
    const linkHi = document.getElementById("sos-location-link-hi");
    if (linkEn) linkEn.textContent = mapsLink;
    if (linkHi) linkHi.textContent = mapsLink;

    // Build WhatsApp buttons panel inside the SOS overlay
    buildWhatsAppPanel(mapsLink);
  };

  // If we have a cached location from prefetch, use it immediately first
  if (state.lastKnownLat && state.lastKnownLng) {
    doSend(state.lastKnownLat, state.lastKnownLng);
  }

  // Request fresh location (high accuracy) to update the map link dynamically
  if (navigator.geolocation) {
    const geoSuccess = (pos) => openWhatsApp(phone, originalPhone, pos.coords.latitude, pos.coords.longitude, targetContact.name);
    
    // First try with high accuracy
    navigator.geolocation.getCurrentPosition(
    geoSuccess,
      (err) => {
        console.warn("High accuracy failed, trying low accuracy...", err);
        // Fallback to low accuracy
        navigator.geolocation.getCurrentPosition(
          geoSuccess,
          (err2) => {
            console.warn("Low accuracy failed too. Using fallback.", err2);
            openWhatsApp(phone, originalPhone, 28.6139, 77.2090, targetContact.name);
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
b
    );
  } else {
    // Geolocation not supported, fall back to IP
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.latitude && data.longitude) {
          doSend(data.latitude, data.longitude);
        } else {
          doSend(28.6139, 77.2090);
        }
      })
      .catch(() => {
        doSend(28.6139, 77.2090);
      });
  }
}

function cleanPhoneForWa(rawPhone) {
  let phone = rawPhone.trim().replace(/\D/g, '');
  if (phone.startsWith('00')) phone = phone.slice(2);
  if (phone.length === 10) phone = '91' + phone;
  else if (phone.length === 11 && phone.startsWith('0')) phone = '91' + phone.slice(1);
  return phone;
}

function buildWhatsAppPanel(mapsLink) {
  const messageEn = `*🚨 SOS EMERGENCY!* I need help immediately!%0AMy live location: ${mapsLink}%0APlease respond ASAP!`;
  const messageHi = `*🚨 आपातकाल (SOS)!* मुझे अभी तुरंत मदद चाहिए!%0Aलाइव लोकेशन: ${mapsLink}%0Aकृपया तुरंत संपर्क करें!`;
  const finalMsg = state.currentLanguage === 'en' ? messageEn : messageHi;

  // Remove old panel if exists
  const existing = document.getElementById('wa-dispatch-panel');
  if (existing) existing.remove();

  // Build panel
  const panel = document.createElement('div');
  panel.id = 'wa-dispatch-panel';
  panel.style.cssText = `
    background: rgba(0,0,0,0.7);
    border: 1px solid rgba(37,211,102,0.4);
    border-radius: 14px;
    padding: 12px;
    margin: 10px 0;
    width: 100%;
  `;

  const title = document.createElement('p');
  title.style.cssText = 'color:#25d366; font-size:11px; font-weight:700; margin-bottom:8px; text-align:center; letter-spacing:0.5px;';
  title.textContent = state.currentLanguage === 'en' ? '📲 TAP TO SEND WHATSAPP TO GUARDIANS' : '📲 गार्डियन को व्हाट्सएप भेजें';
  panel.appendChild(title);

  state.contacts.forEach(contact => {
    const cleanPhone = cleanPhoneForWa(contact.phone);
    // wa.me URL with pre-filled message
    const waUrl = `https://wa.me/${cleanPhone}?text=${finalMsg}`;

    const btn = document.createElement('a');
    btn.href = waUrl;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      background: #25d366;
      color: white;
      text-decoration: none;
      padding: 10px 14px;
      border-radius: 10px;
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: 700;
    `;
    btn.innerHTML = `
      <i class="fa-brands fa-whatsapp" style="font-size:18px;"></i>
      <div>
        <div>${contact.name}</div>
        <div style="font-size:10px; opacity:0.85;">+${cleanPhone}</div>
      </div>
      <i class="fa-solid fa-arrow-right" style="margin-left:auto;"></i>
    `;
    panel.appendChild(btn);
  });

  // Insert into the SOS overlay before the existing WhatsApp button
  const manualBtn = document.getElementById('manual-whatsapp-btn');
  if (manualBtn && manualBtn.parentNode) {
    manualBtn.parentNode.insertBefore(panel, manualBtn);
    // Hide the old manual button to avoid confusion
    manualBtn.style.display = 'none';
  }

  showToast("Tap a guardian button to send WhatsApp!", "गार्डियन बटन दबाएं!");
}

function openWhatsApp(phone, originalPhone, lat, lng, name) {
  // Legacy function kept for compatibility — now handled by buildWhatsAppPanel
  const cleanPhone = cleanPhoneForWa(originalPhone);
  const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
  const msg = `*SOS EMERGENCY!* I need help! Live location: ${mapsLink}`;
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
}

function deactivateSOSAlert() {
  state.sosActive = false;
  document.getElementById("strobe-siren-overlay").classList.add("hide");
  document.getElementById("pin-entry-overlay").classList.add("hide");
  
  // Reset home status banner
  const banner = document.getElementById("home-status-banner");
  banner.classList.remove("alert-active");
  banner.classList.add("safe");
  banner.querySelector(".status-text-en").textContent = "SHIELD ACTIVE • WE HAVE YOUR BACK";
  banner.querySelector(".status-text-hi").textContent = "कवच सक्रिय • हम आपके साथ हैं";

  stopSirenAlarm();
  if (navigator.vibrate) navigator.vibrate(0);
  
  // Cancel active voice alarm
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  
  if (state.sosLocationInterval) {
    clearInterval(state.sosLocationInterval);
    state.sosLocationInterval = null;
  }
  
  showToast("SOS Alert Deactivated", "आपातकालीन अलार्म बंद किया गया");
}

// ==================== SECURE PIN DEACTIVATION SYSTEM ====================
function openPinLockModal() {
  state.enteredPin = "";
  updatePinDotsDisplay();
  
  // Dynamically present active PIN in modal subtitle to guide the user
  const subtitleEn = document.querySelector(".pin-subtitle-en");
  const subtitleHi = document.querySelector(".pin-subtitle-hi");
  if (subtitleEn) {
    subtitleEn.innerHTML = `Deactivation requires authorization (Active PIN: <strong>${state.safetyPin}</strong>)`;
  }
  if (subtitleHi) {
    subtitleHi.innerHTML = `अलार्म बंद करने के लिए पिन चाहिए (सक्रिय पिन: <strong>${state.safetyPin}</strong>)`;
  }
  
  document.getElementById("pin-entry-overlay").classList.remove("hide");
}

function initPinKeypad() {
  const keys = document.querySelectorAll(".pin-key");
  keys.forEach(k => {
    k.addEventListener("click", () => {
      const val = k.getAttribute("data-val");
      playKeyTone(440); // Sound generic beep
      
      if (val === 'clear') {
        state.enteredPin = "";
      } else if (val === 'back') {
        state.enteredPin = state.enteredPin.slice(0, -1);
      } else if (state.enteredPin.length < 4) {
        state.enteredPin += val;
      }
      
      updatePinDotsDisplay();
      
      // Verify pin when it reaches length 4
      if (state.enteredPin.length === 4) {
        setTimeout(verifyDeactivationPin, 200);
      }
    });
  });
  
  // Add physical keyboard support for PIN pad deactivation
  window.addEventListener("keydown", (e) => {
    const pinOverlay = document.getElementById("pin-entry-overlay");
    if (!pinOverlay || pinOverlay.classList.contains("hide")) return;

    const key = e.key;
    if (key >= "0" && key <= "9") {
      playKeyTone(440);
      if (state.enteredPin.length < 4) {
        state.enteredPin += key;
        updatePinDotsDisplay();
        if (state.enteredPin.length === 4) {
          setTimeout(verifyDeactivationPin, 200);
        }
      }
    } else if (key === "Backspace") {
      playKeyTone(440);
      state.enteredPin = state.enteredPin.slice(0, -1);
      updatePinDotsDisplay();
    } else if (key === "Escape" || key === "Delete") {
      playKeyTone(440);
      state.enteredPin = "";
      updatePinDotsDisplay();
    }
  });
  
  document.getElementById("pin-cancel-btn").addEventListener("click", () => {
    document.getElementById("pin-entry-overlay").classList.add("hide");
    state.enteredPin = "";
  });
}

function updatePinDotsDisplay() {
  const dots = document.querySelectorAll(".pin-dot");
  dots.forEach((d, idx) => {
    if (idx < state.enteredPin.length) {
      d.classList.add("filled");
    } else {
      d.classList.remove("filled");
    }
  });
}

function verifyDeactivationPin() {
  console.log("Verifying deactivation PIN - Entered:", state.enteredPin, "Expected:", state.safetyPin);
  if (state.enteredPin === state.safetyPin) {
    deactivateSOSAlert();
  } else {
    // Wrong PIN shake feedback
    const box = document.getElementById("pin-entry-box");
    box.classList.add("shake");
    playKeyTone(220, 0.4); // Deep buzzer tone
    showToast("Incorrect Safety PIN!", "गलत सुरक्षा पिन दर्ज किया!");
    
    setTimeout(() => {
      box.classList.remove("shake");
      state.enteredPin = "";
      updatePinDotsDisplay();
    }, 450);
  }
}

function playKeyTone(freq, duration = 0.15) {
  try {
    if (!state.audioContext) return;
    const ctx = state.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.warn("Failed to play key tone:", err);
  }
}

// ==================== FAKE CALL SIMULATOR & DTMF DIALER ====================
function initFakeCall() {
  const presets = document.querySelectorAll(".preset-btn");
  let selectedSeconds = 5;

  presets.forEach(p => {
    p.addEventListener("click", () => {
      presets.forEach(btn => btn.classList.remove("active"));
      p.classList.add("active");
      selectedSeconds = parseInt(p.getAttribute("data-seconds"));
    });
  });

  const triggerBtn = document.getElementById("trigger-fake-call-btn");
  const cancelBtn = document.getElementById("cancel-fakecall-btn");
  const statusDisplay = document.getElementById("fakecall-countdown-display");
  const countdownSec = document.getElementById("fakecall-sec-left");

  triggerBtn.addEventListener("click", () => {
    startAudioContext();
    triggerBtn.disabled = true;
    statusDisplay.classList.remove("hide");
    
    let timeRemaining = selectedSeconds;
    countdownSec.textContent = timeRemaining;

    state.fakeCallCountdownInterval = setInterval(() => {
      timeRemaining--;
      countdownSec.textContent = timeRemaining;
      
      if (timeRemaining <= 0) {
        clearInterval(state.fakeCallCountdownInterval);
        statusDisplay.classList.add("hide");
        triggerBtn.disabled = false;
        incomingFakeCallTrigger();
      }
    }, 1000);
  });

  cancelBtn.addEventListener("click", () => {
    clearInterval(state.fakeCallCountdownInterval);
    statusDisplay.classList.add("hide");
    triggerBtn.disabled = false;
    showToast("Fake Call Cancelled", "आभासी कॉल रद्द की गई");
  });

  // Call Actions setup
  document.getElementById("decline-fakecall-btn").addEventListener("click", endIncomingRing);
  document.getElementById("accept-fakecall-btn").addEventListener("click", acceptIncomingCall);
  document.getElementById("end-fakecall-btn").addEventListener("click", terminateActiveCall);
  
  // Speaker Toggle
  const speakerBtn = document.getElementById("fakecall-speaker-btn");
  speakerBtn.addEventListener("click", () => {
    state.fakeCallSpeakerOn = !state.fakeCallSpeakerOn;
    speakerBtn.classList.toggle("active");
    if (state.fakeCallSpeakerOn) {
      showToast("Speaker On", "स्पीकर चालू");
    } else {
      showToast("Speaker Off", "स्पीकर बंद");
    }
  });

  // Keypad DTMF bindings
  const digitButtons = document.querySelectorAll(".call-digit");
  digitButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const digit = btn.getAttribute("data-digit");
      playDTMFTone(digit);
    });
  });
}

function playDTMFTone(digit) {
  if (!state.audioContext || !dtmfFreqs[digit]) return;
  const ctx = state.audioContext;
  
  const [f1, f2] = dtmfFreqs[digit];
  
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc1.frequency.value = f1;
  osc2.frequency.value = f2;
  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  
  osc1.start();
  osc2.start();
  
  osc1.stop(ctx.currentTime + 0.2);
  osc2.stop(ctx.currentTime + 0.2);
}

function startSimulatedRingTone() {
  if (!state.audioContext) return;
  const ctx = state.audioContext;
  
  ringerGain = ctx.createGain();
  ringerGain.gain.setValueAtTime(0, ctx.currentTime);
  ringerGain.connect(ctx.destination);
  
  let ringCycle = true;
  ringerInterval = setInterval(() => {
    if (ringCycle) {
      ringerOsc = ctx.createOscillator();
      ringerOsc.type = 'sine';
      ringerOsc.frequency.setValueAtTime(853, ctx.currentTime);
      ringerOsc.connect(ringerGain);
      
      ringerGain.gain.setValueAtTime(0.15, ctx.currentTime);
      ringerOsc.start();
      
      const oscToStop = ringerOsc;
      setTimeout(() => {
        try {
          oscToStop.stop();
          oscToStop.disconnect();
        } catch(e) {}
      }, 1500);
    }
    ringCycle = !ringCycle;
  }, 1000);
}

function stopSimulatedRingTone() {
  clearInterval(ringerInterval);
  if (ringerGain) {
    ringerGain.disconnect();
    ringerGain = null;
  }
}

function incomingFakeCallTrigger() {
  state.fakeCallActive = true;
  
  const callerInput = document.getElementById("fake-caller-name").value.trim();
  const callerName = callerInput || "Mom 💖";
  
  document.getElementById("ring-caller-name").textContent = callerName;
  document.getElementById("active-caller-name").textContent = callerName;
  
  document.getElementById("fakecall-ring-overlay").classList.remove("hide");
  translateApp();
  startSimulatedRingTone();
}

function endIncomingRing() {
  stopSimulatedRingTone();
  document.getElementById("fakecall-ring-overlay").classList.add("hide");
  state.fakeCallActive = false;
  showToast("Call Ignored", "कॉल नामंजूर की गई");
}

let activeCallSeconds = 0;
let activeCallTimerInterval = null;

function acceptIncomingCall() {
  stopSimulatedRingTone();
  document.getElementById("fakecall-ring-overlay").classList.add("hide");
  document.getElementById("fakecall-active-overlay").classList.remove("hide");
  
  activeCallSeconds = 0;
  document.getElementById("active-call-timer").textContent = "00:00";
  
  activeCallTimerInterval = setInterval(() => {
    activeCallSeconds++;
    let mm = Math.floor(activeCallSeconds / 60);
    let ss = activeCallSeconds % 60;
    mm = mm < 10 ? '0' + mm : mm;
    ss = ss < 10 ? '0' + ss : ss;
    document.getElementById("active-call-timer").textContent = `${mm}:${ss}`;
  }, 1000);

  playCallerVoiceSpeech();
}

function playCallerVoiceSpeech() {
  const voiceSelect = document.getElementById("fake-call-voice").value;
  let speakText = "";
  
  switch(voiceSelect) {
    case 'voice-mom-en':
      speakText = "Hey! Where are you? I'm waiting for you at the market entrance. Let's walk home together.";
      document.getElementById("speaker-caption-en").innerText = `Voice Playing: "${speakText}"`;
      document.getElementById("speaker-caption-hi").innerText = `आवाज चल रही है: "अरे! तुम कहाँ हो? मैं बाज़ार के प्रवेश द्वार पर इंतज़ार कर रही हूँ।"`;
      break;
    case 'voice-mom-hi':
      speakText = "बेटा तुम कहाँ हो? मैं चौराहे पर खड़ी हूँ। तुम जल्दी यहाँ आओ ताकि हम साथ चल सकें।";
      document.getElementById("speaker-caption-en").innerText = `Voice Playing: "Child, where are you? I am waiting at the crossing. Come here quickly."`;
      document.getElementById("speaker-caption-hi").innerText = `आवाज चल रही है: "${speakText}"`;
      break;
    case 'voice-police-en':
      speakText = "This is Inspector Sharma. We received your report. Can you verify your current location immediately?";
      document.getElementById("speaker-caption-en").innerText = `Voice Playing: "${speakText}"`;
      document.getElementById("speaker-caption-hi").innerText = `आवाज चल रही है: "मैं इंस्पेक्टर शर्मा हूँ। रिपोर्ट मिल गई है, अपनी लोकेशन बताओ।"`;
      break;
    case 'voice-uber-en':
      speakText = "Hello Ma'am, I have arrived with your ride at the main gate. Please hurry up as parking is not allowed here.";
      document.getElementById("speaker-caption-en").innerText = `Voice Playing: "${speakText}"`;
      document.getElementById("speaker-caption-hi").innerText = `आवाज चल रही है: "नमस्ते मैम, मैं कैब ड्राइवर हूँ। आपकी कार बाहर आ गई है।"`;
      break;
  }

  // Speak out voice script via browser SpeechSynthesis
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    state.speechSynthUtterance = new SpeechSynthesisUtterance(speakText);
    
    if (voiceSelect === 'voice-mom-hi') {
      state.speechSynthUtterance.lang = 'hi-IN';
    } else {
      state.speechSynthUtterance.lang = 'en-US';
    }
    
    state.speechSynthUtterance.rate = 0.95;
    window.speechSynthesis.speak(state.speechSynthUtterance);
  }
}

function terminateActiveCall() {
  clearInterval(activeCallTimerInterval);
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  document.getElementById("fakecall-active-overlay").classList.add("hide");
  state.fakeCallActive = false;
  showToast("Fake Call Ended", "कॉल समाप्त की गई");
}

// ==================== SAFETY RADAR MAP SIMULATOR ====================
let leafletMap = null;
let userMarker = null;
let mapMarkers = [];
let selectedRadarPoint = null; // Currently selected safe point

function initRadarMap() {
  // Set up Filter Click Listeners
  document.getElementById("radar-filter-all").addEventListener("click", (e) => setRadarFilter('all', e));
  document.getElementById("radar-filter-police").addEventListener("click", (e) => setRadarFilter('police', e));
  document.getElementById("radar-filter-safehouse").addEventListener("click", (e) => setRadarFilter('safehouse', e));

  // Canvas click/tap handled by Leaflet marker click events
  
  // Set up Navigation Path Clicker
  document.getElementById("radar-route-btn").addEventListener("click", () => {
    state.mapRouteActive = !state.mapRouteActive;
    const btn = document.getElementById("radar-route-btn");
    const walkBtn = document.getElementById("radar-walk-btn");
    const metricsBar = document.getElementById("map-metrics-bar");
    
    if (state.mapRouteActive) {
      btn.classList.add("active");
      walkBtn.classList.remove("hide");
      metricsBar.classList.remove("hide");
      
      // Reset metrics labels
      document.getElementById("metric-dist").textContent = "400m";
      document.getElementById("metric-eta").textContent = "4 mins";
      
      showToast("Calculating safest illuminated route...", "सुरक्षित मार्ग खोजा जा रहा है...");
    } else {
      btn.classList.remove("active");
      walkBtn.classList.add("hide");
      metricsBar.classList.add("hide");
      
      // Stop walking if active
      state.mapWalkActive = false;
      state.mapWalkProgress = 0;
      walkBtn.classList.remove("active");
    }
  });

  // Active walk simulator triggers walking dot
  document.getElementById("radar-walk-btn").addEventListener("click", () => {
    startAudioContext();
    state.mapWalkActive = !state.mapWalkActive;
    const walkBtn = document.getElementById("radar-walk-btn");
    
    if (state.mapWalkActive) {
      walkBtn.classList.add("active");
      showToast("Walk simulation started. Monitoring location...", "यात्रा सुरक्षा ट्रैकिंग शुरू की गई...");
      simulateWalkMovement();
    } else {
      walkBtn.classList.remove("active");
    }
  });
}

function initializeRealMap() {
  if (leafletMap) return;
  
  const mapContainer = document.getElementById('safety-radar-map');
  if (!mapContainer) return;
  
  leafletMap = L.map('safety-radar-map', {
    zoomControl: false,
    attributionControl: false
  }).setView([28.6139, 77.2090], 14);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(leafletMap);

  showToast("Locating you...", "आपकी लोकेशन खोजी जा रही है...");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setupMapForLocation(lat, lng);
    }, (err) => {
      console.warn("Geolocation failed on map init, using fallback.", err);
      navigator.geolocation.getCurrentPosition((pos2) => {
          setupMapForLocation(pos2.coords.latitude, pos2.coords.longitude);
      }, (err2) => {
          setupMapForLocation(28.6139, 77.2090);
      }, { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 });
    }, { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 });
  } else {
    setupMapForLocation(28.6139, 77.2090);
  }
}

function setupMapForLocation(lat, lng) {
  if (!leafletMap) return;
  state.lastKnownLat = lat;
  state.lastKnownLng = lng;
  leafletMap.setView([lat, lng], 14);

  const userIcon = L.divIcon({
    className: 'custom-leaflet-marker',
    html: '<div style="background:#00e5ff; width:14px; height:14px; border-radius:50%; box-shadow: 0 0 12px #00e5ff; border: 2px solid #fff;"></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
  
  if (userMarker) leafletMap.removeLayer(userMarker);
  userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(leafletMap);
  userMarker.bindPopup(state.currentLanguage === 'en' ? "You / आप" : "आप");

  fetchSafetyPointsFromOverpass(lat, lng);
}

function fetchSafetyPointsFromOverpass(lat, lng) {
  const query = `
    [out:json];
    (
      node["amenity"="police"](around:5000, ${lat}, ${lng});
      node["amenity"="hospital"](around:5000, ${lat}, ${lng});
    );
    out body 20;
  `;
  
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      radarPoints = [];
      if (data.elements && data.elements.length > 0) {
        data.elements.forEach(el => {
          let type = (el.tags.amenity === 'police') ? 'police' : 'safehouse';
          let nameEn = el.tags.name || (type === 'police' ? "Police Station" : "Medical Center");
          let nameHi = (type === 'police' ? "पुलिस स्टेशन" : "अस्पताल");
          
          radarPoints.push({
            lat: el.lat,
            lng: el.lon,
            type: type,
            name: nameEn,
            nameHi: nameHi
          });
        });
      }
      drawRadarMap();
    })
    .catch(err => {
      console.warn("Overpass API failed, using fallback simulated points.", err);
      radarPoints = [
        { lat: lat + 0.01, lng: lng + 0.01, type: 'police', name: 'Police Precinct No. 4', nameHi: 'पुलिस स्टेशन नं. ४' },
        { lat: lat - 0.01, lng: lng + 0.015, type: 'police', name: 'Patrol Car #102', nameHi: 'पुलिस गश्ती वाहन #१०२' },
        { lat: lat + 0.015, lng: lng - 0.01, type: 'safehouse', name: 'Metro Station Security Hub', nameHi: 'मेट्रो स्टेशन सुरक्षा हब' },
        { lat: lat - 0.01, lng: lng - 0.01, type: 'safehouse', name: '24/7 Open Medical Center', nameHi: 'चौबीसों घंटे खुला अस्पताल' }
      ];
      drawRadarMap();
    });
}

function simulateWalkMovement() {
  if (!state.mapWalkActive) return;
  
  let stepInterval = setInterval(() => {
    if (!state.mapWalkActive || state.mapWalkProgress >= 1) {
      clearInterval(stepInterval);
      return;
    }
    
    state.mapWalkProgress += 0.05;
    
    // Update metric details dynamically
    const distRemaining = Math.max(0, Math.round(400 * (1 - state.mapWalkProgress)));
    const timeRemaining = Math.max(0, Math.ceil(4 * (1 - state.mapWalkProgress)));
    
    document.getElementById("metric-dist").textContent = distRemaining + "m";
    document.getElementById("metric-eta").textContent = timeRemaining + (timeRemaining === 1 ? " min" : " mins");
    
    // Play subtle check tick tone
    playTickSound();

    if (state.mapWalkProgress >= 1) {
      state.mapWalkActive = false;
      state.mapWalkProgress = 0;
      document.getElementById("radar-walk-btn").classList.remove("active");
      document.getElementById("radar-walk-btn").classList.add("hide");
      document.getElementById("radar-route-btn").classList.remove("active");
      document.getElementById("map-metrics-bar").classList.add("hide");
      
      showToast("Arrived Safely at Safehouse Node", "सुरक्षित आश्रय स्थल पर पहुँच गए हैं");
    }
  }, 1000);
}


// Pixel → meters scale: canvas is 340px wide ≈ 600m real-world equivalent
const RADAR_SCALE_M_PER_PX = 600 / 340;
const USER_POINT = { x: 170, y: 140 }; // user dot position

function getDirection(dx, dy) {
  const angle = Math.atan2(-dy, dx) * 180 / Math.PI; // flip Y axis
  const dirs = ['East','NE','North','NW','West','SW','South','SE'];
  const dirsHi = ['पूर्व','उत्तर-पूर्व','उत्तर','उत्तर-पश्चिम','पश्चिम','दक्षिण-पश्चिम','दक्षिण','दक्षिण-पूर्व'];
  const idx = Math.round(((angle % 360) + 360) / 45) % 8;
  return { en: dirs[idx], hi: dirsHi[idx] };
}

function showRadarPointInfo(point) {
  const card = document.getElementById('radar-point-info-card');
  if (!card) return;

  if (!point) {
    card.classList.add('hide');
    return;
  }

  let meters = 0;
  if (leafletMap && state.lastKnownLat && state.lastKnownLng) {
    meters = Math.round(leafletMap.distance([state.lastKnownLat, state.lastKnownLng], [point.lat, point.lng]));
  }
  const walkMins = Math.max(1, Math.round(meters / 80)); // avg 80m/min walking speed
  
  const dx = point.lng - state.lastKnownLng;
  const dy = point.lat - state.lastKnownLat;
  const direction = getDirection(dx, -dy);

  const isEn = state.currentLanguage === 'en';
  const name = isEn ? point.name : (point.nameHi || point.name);
  const typeLabel = point.type === 'police'
    ? (isEn ? '🚔 Police' : '🚔 पुलिस')
    : (isEn ? '🏥 Safe Zone' : '🏥 सुरक्षित स्थान');
  const distText = meters >= 1000 ? (meters/1000).toFixed(1)+'km' : meters+'m';
  const dir = isEn ? direction.en : direction.hi;

  document.getElementById('rpi-name').textContent = name;
  document.getElementById('rpi-type').textContent = typeLabel;
  document.getElementById('rpi-dist').textContent = distText;
  document.getElementById('rpi-time').textContent = walkMins + (isEn ? ' min walk' : ' मिनट पैदल');
  document.getElementById('rpi-dir').textContent = dir;
  document.getElementById('rpi-phone').textContent = point.phone || '-';
  document.getElementById('rpi-call-btn').href = `tel:${point.phone || ''}`;

  card.classList.remove('hide');
}

function setRadarFilter(filter, event) {
  state.mapFilter = filter;
  const buttons = document.querySelectorAll(".map-ctrl-btn");
  buttons.forEach(b => b.classList.remove("active"));
  event.currentTarget.classList.add("active");
  drawRadarMap();
}

function drawRadarMap() {
  if (!leafletMap) return;
  
  mapMarkers.forEach(m => leafletMap.removeLayer(m));
  mapMarkers = [];
  
  radarPoints.forEach(p => {
    if (state.mapFilter !== 'all' && p.type !== state.mapFilter) {
      return;
    }
    
    let label = state.currentLanguage === 'en' ? p.name : (p.nameHi || p.name);
    let color = (p.type === 'police') ? '#2979ff' : '#39ff14';
    
<<<<<<< HEAD
    const icon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: \`<div style="background:\${color}; width:10px; height:10px; border-radius:50%; box-shadow: 0 0 8px \${color};"></div>
             <div style="color:#fff; font-size:10px; margin-top:2px; white-space:nowrap; text-shadow:1px 1px 2px #000;">\${label}</div>\`,
      iconSize: [10, 10],
      iconAnchor: [5, 5]
=======
    // Draw rotating sweep line
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(radarAngle);
    
    let sweepGrad = ctx.createLinearGradient(0, 0, 160, 0);
    sweepGrad.addColorStop(0, 'rgba(0, 229, 255, 0.4)');
    sweepGrad.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.strokeStyle = sweepGrad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(150, 0);
    ctx.stroke();
    ctx.restore();
    
    radarAngle += 0.015;
    if (radarAngle > Math.PI * 2) radarAngle = 0;
    
    // Render nearest route path overlay if route computed
    let pathStart = { x: 170, y: 140 }; // Start User Node
    let pathEnd = { x: 280, y: 200 }; // End Safehouse Hub
    
    if (state.mapRouteActive) {
      ctx.strokeStyle = '#39ff14';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#39ff14';
      ctx.beginPath();
      ctx.moveTo(pathStart.x, pathStart.y);
      ctx.bezierCurveTo(200, 120, 240, 170, pathEnd.x, pathEnd.y);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    
    // Draw Markers
    radarPoints.forEach(p => {
      if (state.mapFilter !== 'all' && p.type !== 'user' && p.type !== state.mapFilter) {
        return;
      }
      
      let markerX = p.x;
      let markerY = p.y;
      
      let label = state.currentLanguage === 'en' ? p.name : (p.nameHi || p.name);
      
      if (p.type === 'user') {
        // If walking simulation active, animate dot along path bezier
        if (state.mapRouteActive && state.mapWalkActive) {
          const t = state.mapWalkProgress;
          // Interpolate bezier coordinates
          // P = (1-t)^3*P0 + 3(1-t)^2*t*P1 + 3(1-t)*t^2*P2 + t^3*P3
          // For simplicity, linear curve interpolation between 170,140 -> 200,120 -> 240,170 -> 280,200
          const x1 = 170, y1 = 140;
          const x2 = 200, y2 = 120;
          const x3 = 240, y3 = 170;
          const x4 = 280, y4 = 200;
          
          markerX = Math.pow(1-t, 3)*x1 + 3*Math.pow(1-t, 2)*t*x2 + 3*(1-t)*Math.pow(t, 2)*x3 + Math.pow(t, 3)*x4;
          markerY = Math.pow(1-t, 3)*y1 + 3*Math.pow(1-t, 2)*t*y2 + 3*(1-t)*Math.pow(t, 2)*y3 + Math.pow(t, 3)*y4;
        }
        
        ctx.beginPath();
        ctx.arc(markerX, markerY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#00e5ff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00e5ff';
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(markerX, markerY, 10 + Math.sin(Date.now() * 0.005) * 4, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Choose color by type
        const dotColor = p.type === 'police' ? '#2979ff' : '#39ff14';
        const bgColor  = p.type === 'police' ? 'rgba(41,121,255,0.75)' : 'rgba(57,255,20,0.75)';
        const icon     = p.type === 'police' ? '🚔' : '🏥';

        // Draw glowing dot
        ctx.shadowBlur = 12;
        ctx.shadowColor = dotColor;
        ctx.beginPath();
        ctx.arc(markerX, markerY, 6, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Pulse ring
        ctx.strokeStyle = dotColor + '55';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(markerX, markerY, 10 + Math.sin(Date.now() * 0.004 + markerX) * 3, 0, Math.PI * 2);
        ctx.stroke();

        // Selection highlight ring (if this point is selected)
        if (selectedRadarPoint && selectedRadarPoint.name === p.name) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([4, 3]);
          ctx.beginPath();
          ctx.arc(markerX, markerY, 16, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Name label with background pill
        const shortLabel = label.length > 18 ? label.slice(0, 16) + '…' : label;
        ctx.font = 'bold 9px Outfit, sans-serif';
        const tw = ctx.measureText(shortLabel).width;
        const lx = markerX - tw / 2 - 4;
        const ly = markerY - 22;
        const lw = tw + 8;
        const lh = 14;

        // Pill background
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.roundRect(lx, ly, lw, lh, 4);
        ctx.fill();

        // Label text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(shortLabel, markerX, ly + 10);
        ctx.textAlign = 'left';
      }
>>>>>>> 30295c86b0e8b7885b67691cd1ad6438908c7b0b
    });
    
    let marker = L.marker([p.lat, p.lng], { icon: icon }).addTo(leafletMap);
    marker.on("click", () => {
      selectedRadarPoint = p;
      showRadarPointInfo(p);
    });
    mapMarkers.push(marker);
  });
}

// ==================== AUDIO WITNESS EVIDENCE COLLECTION ====================
let waveformAnimationId = null;

function initAudioWitness() {
  const recordBtn = document.getElementById("record-btn");
  
  recordBtn.addEventListener("click", () => {
    startAudioContext();
    if (state.recordingActive) {
      stopAudioRecording();
    } else {
      startAudioRecording();
    }
  });
  
  drawStaticWaveform();
}

function startAudioRecording() {
  state.recordingActive = true;
  state.recordingTime = 0;
  
  const recordBtn = document.getElementById("record-btn");
  const recDot = document.getElementById("recorder-dot");
  const recTextEn = document.getElementById("recorder-text-en");
  const recTextHi = document.getElementById("recorder-text-hi");
  
  recordBtn.classList.add("recording");
  recDot.classList.add("active");
  recTextEn.textContent = "RECORDING EVIDENCE...";
  recTextHi.textContent = "साक्ष्य रिकॉर्ड हो रहा है...";
  
  document.getElementById("recorder-timer").textContent = "00:00";
  state.recordingInterval = setInterval(() => {
    state.recordingTime++;
    let mm = Math.floor(state.recordingTime / 60);
    let ss = state.recordingTime % 60;
    mm = mm < 10 ? '0' + mm : mm;
    ss = ss < 10 ? '0' + ss : ss;
    document.getElementById("recorder-timer").textContent = `${mm}:${ss}`;
  }, 1000);

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        state.microphoneStream = stream;
        drawLiveWaveform();
      })
      .catch(() => {
        drawLiveWaveform(true); // Fallback simulated waveform
      });
  } else {
    drawLiveWaveform(true);
  }
  
  showToast("Audio Witness Recording Started", "ऑडियो रिकॉर्डिंग शुरू");
}

function stopAudioRecording() {
  state.recordingActive = false;
  clearInterval(state.recordingInterval);
  
  const recordBtn = document.getElementById("record-btn");
  const recDot = document.getElementById("recorder-dot");
  const recTextEn = document.getElementById("recorder-text-en");
  const recTextHi = document.getElementById("recorder-text-hi");
  
  recordBtn.classList.remove("recording");
  recDot.classList.remove("active");
  recTextEn.textContent = "Processing Evidence...";
  recTextHi.textContent = "साक्ष्य प्रोसेस हो रहा है...";
  
  if (state.microphoneStream) {
    state.microphoneStream.getTracks().forEach(track => track.stop());
    state.microphoneStream = null;
  }
  
  if (waveformAnimationId) {
    cancelAnimationFrame(waveformAnimationId);
  }
  drawStaticWaveform();

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const duration = document.getElementById("recorder-timer").textContent;
  
  // Cloud upload simulation
  const uploadContainer = document.getElementById("cloud-upload-container");
  const uploadBar = document.getElementById("cloud-upload-bar");
  
  if (uploadContainer && uploadBar) {
    uploadContainer.classList.remove("hide");
    uploadBar.style.width = "0%";
    
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += (Math.random() * 15 + 5); // Add random chunk
      if (progress >= 100) progress = 100;
      uploadBar.style.width = progress + "%";
      
      if (progress === 100) {
        clearInterval(uploadInterval);
        setTimeout(() => {
          uploadContainer.classList.add("hide");
          uploadBar.style.width = "0%";
          recTextEn.textContent = "Evidence Auto-Uploaded";
          recTextHi.textContent = "साक्ष्य सुरक्षित स्टोर किया गया";
          
          state.recordingsLog.unshift({
            id: Date.now(),
            title: `Evidence_Sec_${state.recordingsLog.length + 1}.wav`,
            time: `${timeStr} (Cloud Encrypted)`,
            duration: duration
          });
          
          renderRecordingsList();
          showToast("Evidence Uploaded to Secure Cloud", "साक्ष्य सुरक्षित सर्वर पर अपलोड");
        }, 600);
      }
    }, 150);
  } else {
    recTextEn.textContent = "Evidence Auto-Uploaded";
    recTextHi.textContent = "साक्ष्य सुरक्षित स्टोर किया गया";
    
    state.recordingsLog.unshift({
      id: Date.now(),
      title: `Evidence_Sec_${state.recordingsLog.length + 1}.wav`,
      time: `${timeStr} (Cloud Encrypted)`,
      duration: duration
    });
    renderRecordingsList();
    showToast("Evidence Uploaded to Secure Cloud", "साक्ष्य सुरक्षित सर्वर पर अपलोड");
  }
}

function drawStaticWaveform() {
  const canvas = document.getElementById("waveform-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  ctx.fillStyle = '#06080e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.strokeStyle = 'var(--text-muted)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
}

function drawLiveWaveform(isSimulated = false) {
  const canvas = document.getElementById("waveform-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  let analyser = null;
  let dataArray = null;
  let bufferLength = 0;
  
  if (!isSimulated && state.microphoneStream && state.audioContext) {
    try {
      const source = state.audioContext.createMediaStreamSource(state.microphoneStream);
      analyser = state.audioContext.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    } catch(e) {
      isSimulated = true;
    }
  } else {
    isSimulated = true;
  }

  const draw = () => {
    if (!state.recordingActive) return;
    
    ctx.fillStyle = '#06080e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw reflective neon gradient waveform visualizer
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#ff007f'); // Neon magenta
    gradient.addColorStop(0.5, '#00f2fe'); // Electric cyan
    gradient.addColorStop(1, '#4facfe'); // Cyan blue
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0, 242, 254, 0.4)';
    
    ctx.beginPath();
    
    if (isSimulated) {
      const sliceWidth = canvas.width / 40;
      let x = 0;
      for (let i = 0; i < 40; i++) {
        const amplitude = 8 + Math.random() * 26;
        // Primary Wave
        const y = (canvas.height / 3) + Math.sin(i * 0.4 + Date.now() * 0.02) * amplitude;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.stroke();
      
      // Draw reflective shadow wave underneath
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      x = 0;
      for (let i = 0; i < 40; i++) {
        const amplitude = 5 + Math.random() * 15;
        const y = (canvas.height * 0.75) - Math.sin(i * 0.4 + Date.now() * 0.02) * amplitude;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.stroke();
      
    } else if (analyser) {
      analyser.getByteTimeDomainData(dataArray);
      const sliceWidth = canvas.width / bufferLength;
      
      // Main Wave
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 3;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.stroke();
      
      // Reflective wave
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = canvas.height - (v * canvas.height / 3);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.stroke();
    }
    
    waveformAnimationId = requestAnimationFrame(draw);
  };
  
  draw();
}

function renderRecordingsList() {
  const container = document.getElementById("recordings-list");
  container.innerHTML = "";
  
  const hideEn = state.currentLanguage === 'hi' ? 'hide' : '';
  const hideHi = state.currentLanguage === 'en' ? 'hide' : '';
  
  if (state.recordingsLog.length === 0) {
    container.innerHTML = `
      <div class="empty-state-recordings">
        <i class="fa-solid fa-folder-open"></i>
        <p class="empty-text-en ${hideEn}">No audio clips recorded yet.</p>
        <p class="empty-text-hi ${hideHi}">अभी तक कोई रिकॉर्डिंग नहीं की गई है।</p>
      </div>
    `;
    return;
  }
  
  state.recordingsLog.forEach(r => {
    const card = document.createElement("div");
    card.className = "recording-card";
    card.innerHTML = `
      <div class="rec-info-left">
        <h4>${r.title}</h4>
        <span>${r.time} • ${r.duration}</span>
      </div>
      <div class="rec-actions-right">
        <button class="rec-btn-mini" onclick="playSimulatedRecordingAlert()" title="Listen"><i class="fa-solid fa-play"></i></button>
        <button class="rec-btn-mini" onclick="deleteSimulatedRecording(${r.id})" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    container.appendChild(card);
  });
}

function playSimulatedRecordingAlert() {
  showToast("Streaming secured evidence audio...", "साक्ष्य ऑडियो स्ट्रीम किया जा रहा है...");
}

function deleteSimulatedRecording(id) {
  state.recordingsLog = state.recordingsLog.filter(r => r.id !== id);
  renderRecordingsList();
  showToast("Evidence Log Removed", "साक्ष्य रिकॉर्ड हटा दिया गया");
}

// ==================== HELPLINES DIRECTORY SEARCH ====================
function initHelplines() {
  const searchInput = document.getElementById("helpline-search");
  searchInput.addEventListener("input", () => {
    renderHelplinesList(searchInput.value.trim().toLowerCase());
  });
  
  renderHelplinesList();
}

function renderHelplinesList(filterText = "") {
  const container = document.getElementById("helpline-grid-container");
  container.innerHTML = "";
  
  const filtered = helplines.filter(h => {
    const textEn = h.nameEn.toLowerCase() + h.number;
    const textHi = h.nameHi.toLowerCase() + h.number;
    return textEn.includes(filterText) || textHi.includes(filterText);
  });
  
  filtered.forEach(h => {
    const title = state.currentLanguage === 'en' ? h.nameEn : h.nameHi;
    const desc = state.currentLanguage === 'en' ? h.descEn : h.descHi;
    
    const card = document.createElement("div");
    card.className = "helpline-card";
    card.innerHTML = `
      <div class="hl-left">
        <div class="hl-title-en">${title}</div>
        <div class="hl-desc-en">${desc}</div>
        <div class="hl-number">${h.number}</div>
      </div>
      <a href="tel:${h.number}" class="hl-dial-btn" onclick="simulateDialEvent(event, '${h.number}')" aria-label="Call Helpline">
        <i class="fa-solid fa-phone"></i>
      </a>
    `;
    container.appendChild(card);
  });
}

function simulateDialEvent(e, number) {
  e.preventDefault();
  showToast(`Simulating Dialing ${number}...`, `हेल्पलाइन नंबर ${number} डायल किया जा रहा है...`);
}

// ==================== SELF DEFENSE ACADEMY CATEGORIES ====================
function initSelfDefense() {
  const tabs = document.querySelectorAll(".defense-tab");
  tabs.forEach(t => {
    t.addEventListener("click", () => {
      tabs.forEach(tab => tab.classList.remove("active"));
      t.classList.add("active");
      
      const category = t.getAttribute("data-category");
      renderDefenseAcademy(category);
    });
  });
  
  renderDefenseAcademy("physical");
}

function renderDefenseAcademy(category = "physical") {
  const container = document.getElementById("defense-cards-container");
  container.innerHTML = "";
  
  const filtered = defenseGuides.filter(g => g.category === category);
  
  filtered.forEach(g => {
    const title = state.currentLanguage === 'en' ? g.titleEn : g.titleHi;
    const desc = state.currentLanguage === 'en' ? g.descEn : g.descHi;
    
    let tagText = category;
    if (category === 'physical') tagText = state.currentLanguage === 'en' ? 'Move' : 'तकनीक';
    else if (category === 'mental') tagText = state.currentLanguage === 'en' ? 'Tip' : 'सुझाव';
    else if (category === 'legal') tagText = state.currentLanguage === 'en' ? 'Right' : 'अधिकार';
    
    const card = document.createElement("div");
    card.className = "defense-card";
    card.innerHTML = `
      <div class="defense-card-header">
        <div class="def-icon-box">
          <i class="${getDefenseIcon(category)}"></i>
        </div>
        <h4 class="def-title-en">${title}</h4>
        <span class="def-tag">${tagText}</span>
      </div>
      <p class="def-desc-en">${desc}</p>
    `;
    container.appendChild(card);
  });
}

function getDefenseIcon(category) {
  switch(category) {
    case 'physical': return 'fa-solid fa-hand-fist';
    case 'mental': return 'fa-solid fa-brain';
    case 'legal': return 'fa-solid fa-scale-balanced';
    default: return 'fa-solid fa-graduation-cap';
  }
}

// ==================== CUSTOM ALERT SYSTEM ====================
let toastTimeout = null;

function showToast(msgEn, msgHi) {
  const toast = document.getElementById("custom-toast");
  const textSpan = document.getElementById("toast-message");
  
  textSpan.textContent = state.currentLanguage === 'en' ? msgEn : (msgHi || msgEn);
  
  toast.classList.remove("hide");
  toast.offsetWidth; // Force reflow
  toast.classList.add("show");
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.classList.add("hide");
    }, 300);
  }, 2500);
}
