@echo off
title RailGaadi — Startup
cd /d "D:\RailGaadi"

echo.
echo ============================================
echo   RailGaadi — Starting All Services
echo ============================================
echo.

REM Step 1: Kill any existing servers on ports 3001 and 5173 (clean start)
echo [1/3] Stopping any old server processes...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3001 " ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5173 " ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a 2>nul
)
timeout /t 2 /nobreak >nul
echo       Done.
echo.

REM Step 2: Build the backend (compile TypeScript)
echo [2/3] Building backend (TypeScript compile)...
call npm run build:backend
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo   ERROR: Backend build failed!
    echo   Check your terminal for TypeScript errors.
    pause
    exit /b 1
)
echo       Backend build OK.
echo.

REM Step 3: Start both servers in background windows
echo [3/3] Starting backend and frontend servers...
start "RailGaadi Backend (Port 3001)" /min cmd /c "cd /d D:\RailGaadi && npm run dev:backend && pause"
timeout /t 3 /nobreak >nul
start "RailGaadi Frontend (Port 5173)" /min cmd /c "cd /d D:\RailGaadi && npm run dev:frontend && pause"

echo.
echo ============================================
echo   RailGaadi is RUNNING!
echo ============================================
echo.
echo   Backend API:  http://localhost:3001/api/health
echo   Frontend App: http://localhost:5173
echo.
echo   Two background windows have been opened:
echo     - "RailGaadi Backend (Port 3001)"
echo     - "RailGaadi Frontend (Port 5173)"
echo.
echo   IMPORTANT: Keep those windows open while using RailGaadi.
echo   Closing them will stop the servers.
echo.
echo   To restart: double-click start-railgaadi.bat again.
echo.
timeout /t 5 /nobreak >nul
start "" http://localhost:5173
echo   Opening browser...
echo.
pause
