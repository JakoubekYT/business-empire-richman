import re
import json
import time
import urllib.request
import urllib.parse

def search_wiki(query):
    # take the first part of the description or the ID if description is too long
    # e.g. "Yellow Renolt Logon taxi cab, realistic studio side view" -> "Renault Logan taxi"
    # To keep it simple, we search the first 3 words of the description
    words = query.split()
    short_query = " ".join(words[:4])
    
    q = urllib.parse.quote(short_query)
    url = f"https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch={q}&gsrnamespace=0&gsrlimit=3&prop=pageimages&pithumbsize=600&format=json"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            pages = data.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                if 'thumbnail' in pdata:
                    return pdata['thumbnail']['source']
    except Exception as e:
        print(f"Error on {short_query}: {e}")
    return None

with open('src/data/gameData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'image:\s*{\s*id:\s*"([^"]+)",\s*description:\s*"([^"]+)"'
matches = re.findall(pattern, content)

try:
    with open('src/data/images.json', 'r', encoding='utf-8') as f:
        results = json.load(f)
except:
    results = {}

for doc_id, desc in matches:
    if not desc or doc_id in results:
        continue
    
    # Try with first 4 words
    url = search_wiki(desc.replace(',', ''))
    
    if not url:
        # Fallback to general concept using ID
        clean_id = doc_id.replace('_', ' ')
        url = search_wiki(clean_id)
        
    if url:
        print(f"Found for {doc_id}: {url}")
        results[doc_id] = url
    else:
        print(f"Not found: {doc_id}")
        # fallback to a placeholder site so it's not totally empty
        # LoremFlickr or similar
        query = doc_id.split('_')[-1]
        results[doc_id] = f"https://loremflickr.com/400/300/{query}"
        
    time.sleep(0.1)

with open('src/data/images.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print("Saved to src/data/images.json")
