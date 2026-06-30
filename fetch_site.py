import urllib.request
import re
import os

url_base = 'https://shakti.shailbala-uppolice.shop'
req = urllib.request.Request(url_base, headers={'User-Agent': 'Mozilla/5.0'})
try:
    print('Fetching index.html...')
    html = urllib.request.urlopen(req).read().decode('utf-8')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    
    # Extract CSS and JS
    css_files = re.findall(r'href=[\"\']([^\"\']+\.css(?:.*?)?)[\"\']', html)
    js_files = re.findall(r'src=[\"\']([^\"\']+\.js(?:.*?)?)[\"\']', html)
    
    for css in css_files:
        if css.startswith('http'): continue
        css_url = f"{url_base}/{css.split('?')[0].lstrip('/')}"
        print(f"Fetching {css_url}...")
        css_content = urllib.request.urlopen(urllib.request.Request(css_url, headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf-8')
        css_name = css.split('?')[0].lstrip('/')
        with open(css_name, 'w', encoding='utf-8') as f:
            f.write(css_content)
            
    for js in js_files:
        if js.startswith('http'): continue
        js_url = f"{url_base}/{js.split('?')[0].lstrip('/')}"
        print(f"Fetching {js_url}...")
        js_content = urllib.request.urlopen(urllib.request.Request(js_url, headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf-8')
        js_name = js.split('?')[0].lstrip('/')
        with open(js_name, 'w', encoding='utf-8') as f:
            f.write(js_content)

    print("Success!")
except Exception as e:
    print('Error:', e)
