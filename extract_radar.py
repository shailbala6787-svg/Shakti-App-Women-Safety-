import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find drawRadarMap function
m = re.search(r'(function drawRadarMap\s*\(\s*\)[\s\S]*?)(?=\nfunction |\nconst |\nlet |\nvar |$)', content)
if m:
    code = m.group(1)
    with open('radar_func.txt', 'w', encoding='utf-8') as f:
        f.write(code[:3000])
    print('Found! Length:', len(code))
else:
    print('NOT FOUND')
    # Search for the word drawRadar
    matches = [(m.start(), m.group()) for m in re.finditer(r'.{0,30}drawRadar.{0,30}', content)]
    for s, g in matches[:10]:
        print(f'  pos={s}: {g}')
