import requests

url = "https://api.elevenlabs.io/v1/text-to-speech/nPczCjzI2devNBz1zQrb"
headers = {
    "xi-api-key": "128c3bf75d5ccb4d0b18af829bc9d763",
    "Content-Type": "application/json"
}
data = {
    "text": "Hello, I am Goku.",
    "model_id": "eleven_multilingual_v2"
}

try:
    response = requests.post(url, headers=headers, json=data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("Success! ElevenLabs is working.")
    else:
        print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
