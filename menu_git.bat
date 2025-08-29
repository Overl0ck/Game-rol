@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: Verificar si git está disponible
git --version >nul 2>&1
if errorlevel 1 (
    echo Git no está instalado o no está en el PATH.
    pause
    exit /b
)

set "LOGFILE=git_commit_log.txt"

:MENU
cls
echo ====================================
echo         MENÚ GIT BÁSICO
echo ====================================
echo 1. Ver estado del repositorio (git status)
echo 2. Actualizar desde remoto (git pull)
echo 3. Añadir cambios (git add .)
echo 4. Hacer commit
echo 5. Subir cambios al repositorio (git push)
echo 6. Ver historial de commits (git log)
echo 7. Salir
echo.

set /p option=Selecciona una opción [1-7]: 

if "%option%"=="1" goto STATUS
if "%option%"=="2" goto PULL
if "%option%"=="3" goto ADD
if "%option%"=="4" goto COMMIT
if "%option%"=="5" goto PUSH
if "%option%"=="6" goto LOG
if "%option%"=="7" goto FIN

echo.
echo Opción inválida. Intenta de nuevo.
pause
goto MENU

:STATUS
echo.
git status
pause
goto MENU

:PULL
echo.
echo Actualizando desde remoto...
git pull origin main
pause
goto MENU

:ADD
echo.
echo Añadiendo todos los cambios...
git add .
pause
goto MENU

:COMMIT
echo.
set /p commitmsg=Escribe el mensaje del commit: 
if "%commitmsg%"=="" (
    echo.
    echo [X] Commit cancelado: mensaje vacío.
) else (
    echo.
    git commit -m "%commitmsg%"
    if not errorlevel 1 (
        echo [%DATE% %TIME%] Usuario: %USERNAME% >> %LOGFILE%
        echo Mensaje: %commitmsg% >> %LOGFILE%
        for /f "delims=* " %%B in ('git branch ^| find "*"') do set BRANCH=%%B
        echo Rama: !BRANCH! >> %LOGFILE%
        echo Archivos modificados: >> %LOGFILE%
        git status -s >> %LOGFILE%
        echo ----------------------------- >> %LOGFILE%
        echo Log guardado correctamente.
    )
)
pause
goto MENU

:PUSH
echo.
echo Subiendo cambios al repositorio remoto...
git push origin main
pause
goto MENU

:LOG
echo.
git log --oneline --graph --decorate --all
pause
goto MENU

:FIN
cls
echo ====================================
echo        ¡Hasta luego, desarrollador!
echo   Código limpio, commits seguros.
echo ====================================
echo.
echo [%DATE% %TIME%] Usuario: %USERNAME% salió del menú Git >> %LOGFILE%
echo ----------------------------- >> %LOGFILE%
pause
exit /b
