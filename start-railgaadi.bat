@echo off
setlocal
cd /d "%~dp0"
title RailGaadi Full-Stack Server
echo ========================================================
echo Starting RailGaadi Backend (3001) and Frontend (5173)...
echo The backend will restart automatically if it ever stops.
echo ========================================================
echo.

where docker.exe >nul 2>nul
if %errorlevel% equ 0 (
  echo Starting PostgreSQL and Redis...
  docker compose up -d
  if %errorlevel% neq 0 (
    echo WARNING: Docker services could not be started.
    echo Train tracking will still work, but database features may not.
  )
) else (
  echo INFO: Docker CLI was not found. Skipping PostgreSQL and Redis startup.
  echo Train tracking does not require them; saved-share features do.
)

echo.
npm.cmd run start
if %errorlevel% neq 0 echo RailGaadi stopped with an error. Review the messages above.
pause
endlocal
