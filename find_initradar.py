import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find initRadarMap function
m = re.search(r'(function initRadarMap[\s\S]*?)(?=\nfunction |$)', content)
if m:
    code = m.group(1)
    with open('init_radar.txt', 'w', encoding='utf-8') as f:
        f.write(code[:5000])
    print('Found initRadarMap! Length:', len(code))
else:
    print('initRadarMap not found')
    # Try leafletMap
    m2 = re.search(r'(leafletMap[\s\S]{0,200})', content)
    if m2:
        with open('init_radar.txt', 'w', encoding='utf-8') as f:
            f.write(m2.group(0))
        print('Found leafletMap usage')
