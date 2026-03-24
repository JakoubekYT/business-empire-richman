import re
import json
import urllib.parse

def main():
    try:
        with open('src/data/gameData.ts', 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading gameData.ts: {e}")
        return

    # Find all image objects in the TypeScript file
    pattern = r'image:\s*\{\s*id:\s*"([^"]+)",\s*description:\s*"([^"]+)"'
    matches = re.findall(pattern, content)

    results = {}
    for doc_id, desc in matches:
        # Enhance the prompt with words that guarantee a good game UI visual
        prompt = f"{desc}, highly detailed, 4k, realistic texture, well lit"
        q = urllib.parse.quote(prompt)
        
        # We use a fixed seed based on the doc_id length or hash so it's consistent 
        # but varies gracefully between different items.
        seed = sum(ord(c) for c in doc_id)
        
        # Build the Pollinations AI URL
        url = f"https://image.pollinations.ai/prompt/{q}?width=400&height=300&nologo=true&seed={seed}"
        results[doc_id] = url

    try:
        with open('src/data/images.json', 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2)
        print(f"Successfully generated {len(results)} AI image links and saved to images.json.")
    except Exception as e:
        print(f"Error writing images.json: {e}")

if __name__ == "__main__":
    main()
