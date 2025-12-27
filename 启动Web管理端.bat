@echo off
chcp 65001 >nul
title 医院管理系统 - Web管理端
echo ========================================
echo   医院管理系统 - 启动Web管理端
echo ========================================
echo.

cd /d "%~dp0web-admin"

echo 正在启动Web管理端开发服务器...
echo Web管理端地址: http://localhost:5173
echo.
echo 按 Ctrl+C 可以停止服务
echo.

call npm run dev

pause

