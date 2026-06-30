import re
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

m = re.search(r'<nav[^>]*>.*?</nav>', html, re.DOTALL | re.IGNORECASE)
if not m:
    m = re.search(r'<footer[^>]*>.*?</footer>', html, re.DOTALL | re.IGNORECASE)
if not m:
    m = re.search(r'<div class="app-nav"[^>]*>.*?</div>', html, re.DOTALL | re.IGNORECASE)

if m:
    with open('nav.txt', 'w', encoding='utf-8') as f:
        f.write(m.group(0))
