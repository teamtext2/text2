@echo off
echo ========================================
echo   Cap nhat bai viet tu dong
echo ========================================
echo.
cd /d "%~dp0"
node update-posts.js
echo.
pause

