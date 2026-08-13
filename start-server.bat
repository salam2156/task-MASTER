@echo off
REM =============================================================
REM TaskMaster - One-command startup: MySQL (if needed) + server
REM Run after every reboot. Safe to run repeatedly - skips if
REM things are already running.
REM =============================================================

set "ROOT=%~dp0"

call "%ROOT%start-mysql.bat"
if %ERRORLEVEL% NEQ 0 exit /b 1

REM Probe: is the API already up?
powershell -NoProfile -Command "try { (Invoke-WebRequest -UseBasicParsing -Uri http://localhost:3000/ -TimeoutSec 2).StatusCode } catch { 0 }" >"%TEMP%\tms-probe.txt"
set /p PROBE=<"%TEMP%\tms-probe.txt"
del "%TEMP%\tms-probe.txt" >NUL 2>&1
if "%PROBE%"=="200" (
    echo Server is already running at http://localhost:3000
    exit /b 0
)

echo Starting TaskMaster server...
pushd "%ROOT%"
start "TaskMaster Server" cmd /c "node server.js"
popd
ping -n 3 127.0.0.1 >NUL
echo TaskMaster running at http://localhost:3000
exit /b 0