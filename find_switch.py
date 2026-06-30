with open('app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

results = []
for i, line in enumerate(lines):
    low = line.lower()
    if 'safemap' in low or 'initradarmap' in low or 'initleafletmap' in low or 'switchscreen' in low:
        results.append(f'{i+1}: {line.rstrip()}')

with open('switchscreen_results.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(results[:60]))

print(f'Found {len(results)} results')
