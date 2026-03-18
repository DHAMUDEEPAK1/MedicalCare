import json

try:
    with open('voices_list.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        for voice in data.get('voices', []):
            print(f"Name: {voice.get('name')}, ID: {voice.get('voice_id')}, Category: {voice.get('category')}")
except Exception as e:
    print(f"Error: {e}")
