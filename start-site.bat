@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install the LTS version from https://nodejs.org then run this file again.
  pause
  exit /b 1
)
echo Checking packages (the first run takes about a minute)...
call npm install --no-audit --no-fund
echo Starting the site. It will open at http://localhost:5173
call npm run dev -- --open
pause
