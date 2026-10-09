@echo off
echo ======================================================================
echo    AGRIVALUE AI - AI-POWERED AGRICULTURAL WASTE-TO-VALUE PLATFORM
echo    B.Tech Major Project - MERN Stack + Python FastAPI Microservice
echo ======================================================================
echo.

echo Starting Node.js Express REST Backend (Port 5000)...
start "AgriValue AI - Node.js Backend" cmd /k "cd /d %~dp0server && npm run dev"

timeout /t 2 >nul

echo Starting Python FastAPI AI Microservice (Port 8008)...
start "AgriValue AI - FastAPI AI Engine" cmd /k "cd /d %~dp0ai-service && python -m uvicorn main:app --host 127.0.0.1 --port 8008 --reload"

timeout /t 2 >nul

echo Starting React Frontend Dashboard (Port 5173)...
start "AgriValue AI - React Client" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ======================================================================
echo  AgriValue AI is now running!
echo  Frontend URL: http://localhost:5173
echo  Backend API:  http://localhost:5000/api/health
echo  AI Service:   http://127.0.0.1:8008/docs
echo ======================================================================
pause
