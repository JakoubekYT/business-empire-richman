import urllib.request
import json
import urllib.parse
import os

def search_wiki(query):
    q = urllib.parse.quote(query)
    url = f"https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch={q}&gsrnamespace=0&gsrlimit=3&prop=pageimages&pithumbsize=600&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            pages = data.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                if 'thumbnail' in pdata:
                    return pdata['thumbnail']['source']
    except Exception as e:
        print(f"Error searching {query}: {e}")
    return None

def main():
    json_path = 'src/data/images.json'
    if not os.path.exists(json_path):
        print("images.json not found!")
        return
        
    with open(json_path, 'r', encoding='utf-8') as f:
        results = json.load(f)

    # Specific highly contextual queries
    img_cloth = search_wiki("clothing store interior layout")
    img_lux = search_wiki("luxury boutique interior jewelry")
    
    if not img_cloth:
        img_cloth = search_wiki("boutique interior")
    if not img_lux:
        img_lux = search_wiki("Louis Vuitton store")

    print(f"Clothing found: {img_cloth}")
    print(f"Luxury found: {img_lux}")

    updated = False
    if img_cloth:
        results['store_clothing'] = img_cloth
        updated = True
    if img_lux:
        results['store_luxury'] = img_lux
        updated = True

    if updated:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2)
        print("images.json updated successfully.")

if __name__ == "__main__":
    main()
