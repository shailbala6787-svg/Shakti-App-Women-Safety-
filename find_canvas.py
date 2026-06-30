with open('app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

results = []
for i, line in enumerate(lines):
    if 'canvas' in line.lower() or 'ctx.' in line or 'getContext' in line:
        results.append(f'{i+1}: {line.rstrip()}')

with open('canvas_results.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(results[:80]))

print(f'Found {len(results)} canvas references')
