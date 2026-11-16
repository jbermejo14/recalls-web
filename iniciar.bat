@echo off
title RECALLSCOPE - Consultor de Campañas & Fiabilidad (XML Database)
echo ======================================================================
echo  Iniciando RECALLSCOPE...
echo  Consultor de Campañas de Llamada a Revision (Recalls) & Fiabilidad
echo ======================================================================
echo.
cd /d "%~dp0"
node server.js
pause
