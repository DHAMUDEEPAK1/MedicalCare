# MedicalCare Development Starter
# This script ensures the backend is running and then starts the frontend.

Write-Host "--- MedicalCare Starter ---" -ForegroundColor Green

# 1. Start Backend
Write-Host "[1/3] Checking Backend (Internet Computer)..." -ForegroundColor Cyan
$ping = wsl /home/deepu/.local/share/dfx/bin/dfx ping 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend is not running. Starting it now..." -ForegroundColor Yellow
    wsl /home/deepu/.local/share/dfx/bin/dfx start --background
    Write-Host "Waiting for replica to initialize..." -ForegroundColor DarkGray
    Start-Sleep -Seconds 10
}
else {
    Write-Host "Backend is already running." -ForegroundColor Gray
}

# 2. Deploy Backend (Update code)
Write-Host "[2/3] Deploying Backend Canisters..." -ForegroundColor Cyan
wsl /home/deepu/.local/share/dfx/bin/dfx deploy backend
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend deployment failed. Please check for errors above." -ForegroundColor Red
}

# 3. Start Frontend
Write-Host "[3/3] Starting Frontend Server (Vite) via pnpm..." -ForegroundColor Cyan
Set-Location frontend
pnpm run dev
