with open('app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

results = []
for i, line in enumerate(lines):
    if 'initializeRealMap' in line or 'initialise' in line.lower():
        results.append(f'{i+1}: {line.rstrip()}')

with open('realmap_results.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(results))

print(f'Found {len(results)} results')
