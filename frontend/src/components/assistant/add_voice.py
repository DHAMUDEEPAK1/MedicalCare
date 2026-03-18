import requests
import os

API_KEY = "128c3bf75d5ccb4d0b18af829bc9d763"
VOICE_NAME = "Goku Custom Voice"
FILE_PATH = r"C:\Users\HP\Music\WhatsApp Audio 2026-03-05 at 12.16.15 PM.mpeg"

url = "https://api.elevenlabs.io/v1/voices/add"

headers = {
    "xi-api-key": API_KEY
}

files = [
    ("files", (os.path.basename(FILE_PATH), open(FILE_PATH, "rb"), "audio/mpeg"))
]

data = {
    "name": VOICE_NAME,
    "description": "Cloned voice from WhatsApp audio"
}

try:
    response = requests.post(url, headers=headers, data=data, files=files)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
