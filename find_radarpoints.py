import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the radarPoints array
m = re.search(r'(let radarPoints|var radarPoints|const radarPoints|radarPoints\s*=)\s*\[[\s\S]*?\];', content)
if m:
    code = m.group(0)
    with open('radar_points.txt', 'w', encoding='utf-8') as f:
        f.write(code[:4000])
    print('Found! Length:', len(code))
else:
    # try to find where radarPoints is defined differently
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'radarPoints' in line:
            start = max(0, i-1)
            end = min(len(lines), i+3)
            print(f'Line {i+1}:', lines[i][:100])
