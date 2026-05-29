# 📱 Shakti — Women Safety Super App (Bilingual)

**Shakti** (शक्ति) is a high-fidelity, high-impact Women Safety Web Application designed with a sleek, premium mobile-first dashboard. The app is fully bilingual, offering immediate toggling between **English** and **Hindi (हिंदी)** across the entire UI.

It provides simulated emergency safety utilities, synthesizes distress signals natively in the browser using the **Web Audio API**, manages contacts dynamically, and offers educational training cards.

---

## 🚀 Key Features

### 1. 🚨 Dynamic SOS Emergency Button
- **Hold 3s to Trigger:** Prevents accidental triggers by requiring the user to hold the central SOS console button for 3 seconds. An interactive radial SVG shows hold progress.
- **Cancel Anytime:** Releasing the button during the 3-second countdown immediately halts the alert.
- **Strobe & Alarm Screen:** On activation, triggers a fullscreen warning overlay with flashing strobe lights (neon red/blue) to disorient attackers or attract crowd attention.
- **Emergency Dispatch:** Displays a simulated SMS dispatch summary, pulling coordinates (New Delhi fallback) and transmitting them to active trusted guardians.

### 2. 📞 Fake Call Simulator (Excuse Planner)
- **Custom Caller Identity:** Program any name (e.g., "Papa", "Police Control Room", "Mom 💖").
- **Countdown Delay:** Select a delay timer (5s, 15s, 60s, or 300s) to trigger the call.
- **Real Call Ringer:** Plays a realistic synthetic phone ringtone using Web Audio API nodes.
- **Full Screen Calling Modals:** Displays a full screen incoming call screen with realistic Decline/Accept actions.
- **Interactive Call State:** Once accepted, displays call durations, keypads (Speaker toggle), and active text-to-speech audio of standard deterrent scripts (like a parent asking you to head back, or an Uber driver waiting at the gate).

### 3. 🗺️ Safe Radar Navigator (Interactive Simulated Map)
- **Animated Sweep Radar:** Renders a gorgeous neon safety radar on HTML5 Canvas.
- **Proximity Safety Checkpoints:** Maps simulated Police Stations, hospitals, and designated active Safe Zones.
- **Filter Controls:** Filter map pins on the fly.
- **Safe Path Planner:** Computes and highlights a neon path representing the safest, well-lit, and crowded route to the nearest safe shelter.

### 4. 🎙️ Audio Witness Evidence Collector
- **Microphone Integration:** Obtains real-time microphone stream input using the Web MediaDevices API and maps dynamic voice frequencies onto a glowing canvas soundwave visualizer.
- **Simulated Cloud Vault:** Once recording terminates, the system compiles a simulated `.wav` audio log with exact time stamps, indicating backup transfer to secure servers.

### 5. 🛡️ Trusted Guardians Manager (LocalStorage CRUD)
- Add, read, and delete emergency contacts.
- Data is stored locally within the browser, persisting across refreshes.

### 6. 📖 Self-Defense Academy & 📞 Helpline Directory
- **Academy:** Learn vital physical escape moves (The Palm Strike, Groin Kick, Wrist Grab escapes), mental situational tips, and crucial legal rights (Zero FIR, detention limits) categorised and translated.
- **Directory:** Searchable list of Indian national safety lines (112, 1091, 181, 100, 102, 1930) with one-click simulation dialing.

---

## 🛠️ Technology Stack & APIs

- **Layout & Structure:** Semantic HTML5
- **Styling:** Custom responsive CSS3 with glassmorphism panels, CSS gradients, neon strobe keyframes, flex layouts, and viewport framing.
- **Icons:** FontAwesome v6
- **Typography:** Google Fonts ("Outfit" for Latin texts, custom traditional styling elements)
- **Synthesizers:** Web Audio API (dual oscillator tones for siren warning loops and telephone rings)
- **Speech System:** Web Speech API (`SpeechSynthesisUtterance` for speaking simulated caller dialogs bilingual-style)
- **Visualizers:** HTML5 Canvas (Radar navigator sweeps and microphone audio wave visualizers)
- **Storage:** LocalStorage API

---

## 📂 Project Structure

```bash
Shakti-App-Women-Safety-/
├── index.html       # Single Page Application core markup structure
├── style.css        # Premium CSS theme variables, notch mockups, animations, overlays
├── app.js           # Bilingual dictionary, SOS trigger, map drawers, voice, audio nodes
└── README.md        # Documentation and operations manual
```

---

## 🚦 How to Launch

1. Clone or download the directory.
2. Double-click or open `index.html` in any modern web browser (Google Chrome, Firefox, Microsoft Edge, or Safari).
3. Switch language using the **EN | हिं** button in the header top right.
4. *Tip:* Open the browser in "Mobile Inspect Mode" (F12 -> Toggle Device Toolbar) to view the app as a true native smartphone interface!
