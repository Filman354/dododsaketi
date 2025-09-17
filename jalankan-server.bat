@echo off
echo.
echo ===============================================
echo    🌿 DODOD SAKETI WEBSITE SERVER 🌿
echo ===============================================
echo.
echo 📂 Memulai server untuk website Dodod Saketi...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python tidak ditemukan!
    echo 💡 Silakan install Python terlebih dahulu dari https://python.org
    echo.
    pause
    exit /b 1
)

echo ✅ Python ditemukan
echo 🚀 Memulai server...
echo.

REM Start the Python server
python server.py

echo.
echo 👋 Server telah dihentikan
pause
