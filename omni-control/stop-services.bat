@echo off
echo Stoppe alle Omni Control Dienste...
taskkill /f /im node.exe 2>nul
taskkill /f /im pnpm.exe 2>nul
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq Omni*" 2>nul
echo Alle Dienste gestoppt.
pause