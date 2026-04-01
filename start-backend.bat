@echo off
echo Starting GitHub Monitor Backend...
cd /d "%~dp0backend"
uv run uvicorn server:app --host 0.0.0.0 --port 8000 --reload
