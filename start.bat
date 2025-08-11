@echo off
chcp 65001 > nul
title Servidor HTTP local - Puerto 8000

echo ================================
echo  INICIANDO SERVIDOR LOCAL
echo ================================
echo.

echo Iniciando servidor en http://localhost:8000 ...
start /B python -m http.server 8000

timeout /t 2 > nul

echo Abriendo navegador en http://localhost:8000 ...
start "" "http://localhost:8000/index.html"

echo.
echo Servidor ejecutándose. Presiona CTRL+C para detenerlo desde la terminal de Python.
