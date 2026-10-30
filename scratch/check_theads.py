
import urllib.request, re
url = 'https://theads.io/publisher/'
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as resp:
        content = resp.read().decode('utf-8', errors='ignore')
        clean = re.sub(r'<script.*?</script>', '', content, flags=re.DOTALL)
        clean = re.sub(r'</?(h1|h2|h3|p|li)[^>]*>', '\n', clean)
        clean = re.sub(r'<[^>]+>', ' ', clean)
        lines = [re.sub(r'\s+', ' ', l).strip() for l in clean.splitlines() if l.strip()]
        print('=== PUBLISHER PAGE ===')
        for l in lines[10:35]:
            print(' *', l)
except Exception as e:
    print('Publisher error:', e)
