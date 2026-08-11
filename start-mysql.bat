@echo off
REM =============================================================
REM TaskMaster - Start MySQL 8.4 (background process, no admin)
REM MySQL runs as a regular background process (not a Windows
REM service), so run this after every reboot before starting the
REM server. Safe to run repeatedly - skips if already running.
REM =============================================================

set "MYSQLD=C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe"
set "DATADIR=C:\ProgramData\MySQL\MySQL Server 8.4\Data"

REM Already running?
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I "mysqld.exe" >NUL
if %ERRORLEVEL%==0 (
    echo MySQL is already running.
    exit /b 0
)

if not exist "%MYSQLD%" (
    echo MySQL binary not found: %MYSQLD%
    exit /b 1
)

echo Starting MySQL...
start "" "%MYSQLD%" "--datadir=%DATADIR%"

REM Give it a moment, then confirm (ping delay works without a console)
ping -n 4 127.0.0.1 >NUL
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I "mysqld.exe" >NUL
if %ERRORLEVEL%==0 (
    echo MySQL started successfully.
) else (
    echo MySQL failed to start - check the error log.
    exit /b 1
)
