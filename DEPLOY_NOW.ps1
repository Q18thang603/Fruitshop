# Fruitshop Deploy Script
# Double-click or right-click -> Run with PowerShell

Set-Location "C:\Users\dell\OneDrive\Máy tính\Fruitshop"

Write-Host "=== Fruitshop Deploy Script ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "[Step 1] Git Status..." -ForegroundColor Yellow
git status --short
Write-Host ""

Write-Host "[Step 2] Git Add All..." -ForegroundColor Yellow  
git add -A
Write-Host ""

Write-Host "[Step 3] Git Commit..." -ForegroundColor Yellow
git commit -m "fix: restore complete SecurityConfig and application.properties for Railway deploy"
Write-Host ""

Write-Host "[Step 4] Git Push..." -ForegroundColor Yellow
git push origin main
Write-Host ""

Write-Host "=== DONE! ===" -ForegroundColor Green
Write-Host "Railway will auto-deploy in 3-5 minutes." -ForegroundColor Green
Write-Host ""
Write-Host "Test URLs:" -ForegroundColor Cyan
Write-Host "  https://green-go-production.up.railway.app/actuator/health" -ForegroundColor White
Write-Host "  https://green-go-production.up.railway.app/api/products" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
