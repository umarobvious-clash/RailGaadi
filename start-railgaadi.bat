@echo off
title RailGaadi — Starting...
cd /d "D:\RailGaadi"

echo.
echo  ==========================================
echo    RailGaadi — Starting All Services
echo  ==========================================
echo.

REM Stop any existing node processes on those ports
echo  Stopping any old RailGaadi processes...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3001 " ^| findstr "LISTENING"') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5173 " ^| findstr "LISTENING"') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul

REM Launch via Windows Task Scheduler (the correct permanent method)
echo  Starting RailGaadi via Windows Task Scheduler...
schtasks /Run /TN "RailGaadi"

echo  Waiting for servers to start (~12 seconds)...
timeout /t 12 /nobreak >nul

echo.
echo  Checking servers...
curl -s -o nul -w "  Backend  (port 3001): HTTP %%{http_code}" http://localhost:3001/api/health
echo.
curl -s -o nul -w "  Frontend (port 5173): HTTP %%{http_code}" http://localhost:5173/
echo.
echo.
echo  ==========================================
echo    RailGaadi is RUNNING!
echo  ==========================================
echo.
echo    Open:  http://localhost:5173
echo.
echo    Servers run silently in the background.
echo    They restart automatically if they crash.
echo    They also auto-start when Windows boots.
echo.
timeout /t 3 /nobreak >nul
start "" http://localhost:5173
