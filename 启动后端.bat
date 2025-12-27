@echo off
chcp 65001 >nul
title 医院管理系统 - 后端服务
echo ========================================
echo   医院管理系统 - 启动后端服务
echo ========================================
echo.

cd /d "%~dp0backend"

echo 正在启动后端服务...
echo 后端服务地址: http://localhost:8080/api
echo.
echo 按 Ctrl+C 可以停止服务
echo.

mvn spring-boot:run

pause

