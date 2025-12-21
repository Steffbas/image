@echo off
echo [1/2] Synchronisation des photos et descriptions...
python sync.py
echo [2/2] Lancement du site...
start index.html
echo Termine !
pause
