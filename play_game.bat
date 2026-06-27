@echo off
title Pokémon Kingdom Launcher
echo ===================================================
echo   Starting Pokémon Kingdom Battle Arena (Offline)
echo ===================================================
cd /d "%~dp0"

:: Start the Django server in a minimized or separate window listening on all network cards
start "Pokemon Server" /min venv\Scripts\python.exe manage.py runserver 0.0.0.0:8000

:: Wait 3 seconds for the server to spin up
echo Waiting for server to initialize...
timeout /t 3 /nobreak >nul

:: Open the game URL in the default browser
echo Opening game in your browser...
start "" "http://127.0.0.1:8000/"

echo ===================================================
echo   GAME LUNCHED SUCCESSFUL!
echo   Share this link with others on the same Wi-Fi:
echo   👉 http://10.18.44.229:8000/
echo ===================================================
echo Ready! Close the "Pokemon Server" command window when you are done playing to stop the server.
pause
exit
