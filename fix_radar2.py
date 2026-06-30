import sys
import re

file_path = r'f:\4. Other\Shail\AI Training\Training Session\Shakti-App-Women-Safety-\app.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

def replace_function(content, func_name, new_func_code):
    pattern = re.compile(rf'function {func_name}\(\) \{{.*?\n\}\n', re.DOTALL)
    if pattern.search(content):
        return pattern.sub(new_func_code + '\n', content)
    return content

new_draw_radar = '''function drawRadarMap() {
  if (!leafletMap) return;
  
  mapMarkers.forEach(m => leafletMap.removeLayer(m));
  mapMarkers = [];
  
  radarPoints.forEach(p => {
    if (state.mapFilter !== 'all' && p.type !== state.mapFilter) {
      return;
    }
    
    let label = state.currentLanguage === 'en' ? p.name : (p.nameHi || p.name);
    let color = (p.type === 'police') ? '#2979ff' : '#39ff14';
    
    const icon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div style="background:${color}; width:10px; height:10px; border-radius:50%; box-shadow: 0 0 8px ${color};"></div>
             <div style="color:#fff; font-size:10px; margin-top:2px; white-space:nowrap; text-shadow:1px 1px 2px #000;">${label}</div>`,
      iconSize: [10, 10],
      iconAnchor: [5, 5]
    });
    
    let marker = L.marker([p.lat, p.lng], { icon: icon }).addTo(leafletMap);
    marker.on('click', () => {
      selectedRadarPoint = p;
      showRadarPointInfo(p);
    });
    mapMarkers.push(marker);
  });
}'''

content = replace_function(content, 'drawRadarMap', new_draw_radar)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
