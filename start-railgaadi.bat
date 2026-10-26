@echo off
title RailGaadi Server Launcher
cd /d "D:\RailGaadi"

echo.
echo ===================================================
echo           RailGaadi - Starting Servers
echo ===================================================
echo.

REM 1. Stop any existing processes on ports 3001 and 5173
echo [1/3] Clearing ports 3001 and 5173...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3001 " ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5173 " ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 /nobreak >nul
echo       Ports cleared.
echo.

REM 2. Start Backend Fastify Server on Port 3001
echo [2/3] Launching RailGaadi Backend (port 3001)...
start "RailGaadi Backend" /min "D:\Program Files\nodejs\node.exe" "D:\RailGaadi\backend\dist\index.js"
timeout /t 3 /nobreak >nul
echo       Backend launched.
echo.

REM 3. Start Frontend Vite Server on Port 5173
echo [3/3] Launching RailGaadi Frontend (port 5173)...
start "RailGaadi Frontend" /min cmd /c "cd /d D:\RailGaadi\frontend && npm run dev"
timeout /t 4 /nobreak >nul
echo       Frontend launched.
echo.

echo ===================================================
echo            RailGaadi is now RUNNING!
echo ===================================================
echo.
echo   - App URL:          http://localhost:5173
echo   - Backup / Direct:  http://localhost:3001
echo.
echo   Keep this window or the minimized icons open while using.
echo   Opening browser in 3 seconds...
echo.
timeout /t 3 /nobreak >nul
start "" http://localhost:5173
