import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find where leafletMap is initialized/created
lines = content.split('\n')
for i, line in enumerate(lines):
    if 'L.map(' in line or 'leafletMap =' in line or 'leafletMap=' in line:
        start = max(0, i-2)
        end = min(len(lines), i+10)
        print(f'== Line {i+1} ==')
        for j in range(start, end):
            print(f'{j+1}: {lines[j]}')
        print()
