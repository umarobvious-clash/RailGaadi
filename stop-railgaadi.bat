@echo off
title RailGaadi — Stop All Services
echo.
echo Stopping all RailGaadi servers...
echo.
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":3001 " ^| findstr "LISTENING"') do (
    echo Stopping backend process %%a on port 3001...
    taskkill /F /PID %%a 2>nul
)
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5173 " ^| findstr "LISTENING"') do (
    echo Stopping frontend process %%a on port 5173...
    taskkill /F /PID %%a 2>nul
)
echo.
echo   All RailGaadi servers stopped.
echo   Run start-railgaadi.bat to start again.
echo.
pause
