@echo off
echo ========================================
echo  Fruitshop - Git Push Deploy Script
echo ========================================
echo.

cd /d "C:\Users\dell\OneDrive\Máy tính\Fruitshop"

echo [1/4] Checking git status...
git status --short
echo.

echo [2/4] Adding all changes...
git add -A
echo.

echo [3/4] Committing...
git commit -m "fix: CORS production URL, server.port, JWT 7d, actuator health, truncated file fix"
echo.

echo [4/4] Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo  DONE! Railway will auto-deploy in 3-5 min
echo  Test: https://green-go-production.up.railway.app/actuator/health
echo ========================================
pause
