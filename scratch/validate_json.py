import json
import os

filepath = r'c:\Users\singa\OneDrive\Desktop\MedicalCare\frontend\package.json'
try:
    with open(filepath, 'r') as f:
        json.load(f)
    print("JSON is valid")
except Exception as e:
    print(f"JSON is invalid: {e}")
