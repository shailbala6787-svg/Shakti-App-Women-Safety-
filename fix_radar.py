import sys
import re

file_path = r'f:\4. Other\Shail\AI Training\Training Session\Shakti-App-Women-Safety-\app.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix Conflict 1
content = content.replace('''<<<<<<< HEAD
let leafletMap = null;
let userMarker = null;
let mapMarkers = [];
=======
let radarAngle = 0;
let radarAnimationId = null;
let selectedRadarPoint = null; // Currently selected safe point
>>>>>>> 30295c86b0e8b7885b67691cd1ad6438908c7b0b''', '''let leafletMap = null;
let userMarker = null;
let mapMarkers = [];
let selectedRadarPoint = null; // Currently selected safe point''')

# Fix Conflict 2
pattern2 = re.compile(r'<<<<<<< HEAD\n(    const icon = L\.divIcon\(\{\n      className: \'custom-leaflet-marker\',\n      html: `<div style="background:\$\{color\}; width:10px; height:10px; border-radius:50%; box-shadow: 0 0 8px \$\{color\};"></div>\n             <div style="color:#fff; font-size:10px; margin-top:2px; white-space:nowrap; text-shadow:1px 1px 2px #000;">\$\{label\}</div>`,\n      iconSize: \[10, 10\],\n      iconAnchor: \[5, 5\]\n    \}\);)\n=======(.*?)\n>>>>>>> 30295c86b0e8b7885b67691cd1ad6438908c7b0b', re.DOTALL)

content = pattern2.sub(r'\1', content)

# Fix event listener addition in drawRadarMap
content = content.replace('''    let marker = L.marker([p.lat, p.lng], { icon: icon }).addTo(leafletMap);
    mapMarkers.push(marker);''', '''    let marker = L.marker([p.lat, p.lng], { icon: icon }).addTo(leafletMap);
    marker.on("click", () => {
      selectedRadarPoint = p;
      showRadarPointInfo(p);
    });
    mapMarkers.push(marker);''')

# Fix initRadarMap (remove canvas listener)
canvas_pattern = re.compile(r'  // Canvas click/tap to select a point and show info card\n  const canvas = document.getElementById\(\'safety-radar-canvas\'\);\n  if \(canvas\) \{.*?\n  \}\n', re.DOTALL)
content = canvas_pattern.sub('  // Canvas click/tap handled by Leaflet marker click events\n', content)

# Fix showRadarPointInfo
old_info = '''function showRadarPointInfo(point) {
  const card = document.getElementById('radar-point-info-card');
  if (!card) return;

  if (!point) {
    card.classList.add('hide');
    return;
  }

  const dx = point.x - USER_POINT.x;
  const dy = point.y - USER_POINT.y;
  const pxDist = Math.sqrt(dx*dx + dy*dy);
  const meters = Math.round(pxDist * RADAR_SCALE_M_PER_PX);
  const walkMins = Math.max(1, Math.round(meters / 80)); // avg 80m/min walking speed
  const direction = getDirection(dx, dy);'''

new_info = '''function showRadarPointInfo(point) {
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
  const direction = getDirection(dx, -dy);'''

content = content.replace(old_info, new_info)

# Fix setupMapForLocation
old_setup = '''function setupMapForLocation(lat, lng) {
  if (!leafletMap) return;
  leafletMap.setView([lat, lng], 14);'''

new_setup = '''function setupMapForLocation(lat, lng) {
  if (!leafletMap) return;
  state.lastKnownLat = lat;
  state.lastKnownLng = lng;
  leafletMap.setView([lat, lng], 14);'''

content = content.replace(old_setup, new_setup)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
