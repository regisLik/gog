@echo off
echo Lancement du serveur FastAPI...
call venv\Scripts\activate.bat
uvicorn main:app --reload
pause
