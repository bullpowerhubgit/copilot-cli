@echo off
echo Starte Omni Control Suite...
cd /d "%~dp0omni-control"

echo Starte Gateway...
start "Omni Gateway" cmd /k "node ./services/gateway/dist/index.js"

timeout /t 3 /nobreak > nul

echo Starte Agent...
start "Omni Agent" cmd /k "node ./services/agent/dist/index.js"

timeout /t 3 /nobreak > nul

echo Starte Console...
start "Omni Console" cmd /k "pnpm --filter @omni/console preview"

echo Warte auf Console-Start...
timeout /t 5 /nobreak > nul

echo Oeffne Browser...
start http://localhost:4173

echo.
echo Omni Control Suite ist bereit!
echo Gateway: http://localhost:9443
echo Console: http://localhost:4173
echo.
pause