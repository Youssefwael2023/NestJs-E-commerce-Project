@echo off
REM Setup Review Microservice - Windows Batch Script

echo.
echo ╔════════════════════════════════════════════╗
echo ║  Review & Rating Microservice Setup       ║
echo ╚════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/3] Installing dependencies...
cd review-microservice
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed

echo.
echo [2/3] Building TypeScript...
call npm run build
if errorlevel 1 (
    echo ❌ Failed to build
    pause
    exit /b 1
)
echo ✅ Build successful

echo.
echo ╔════════════════════════════════════════════╗
echo ║  Setup Complete!                          ║
echo ╚════════════════════════════════════════════╝
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Run: npm run start:dev
echo 3. Microservice will run on port 4006
echo.
pause
