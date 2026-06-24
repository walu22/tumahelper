@echo off
title TumaHelper E2E Tests (Watch Mode)
echo.
echo  ========================================
echo   TumaHelper - New Booking Flow Tests
echo   Running in HEADED mode (watch mode)
echo  ========================================
echo.
echo  Tests: Cooking, Laundry, Garden, Handyman
echo  Browser: Chromium (visible)
echo.

cd /d "%~dp0"

npx playwright test e2e/cooking-booking.spec.ts e2e/laundry-booking.spec.ts e2e/garden-booking.spec.ts e2e/handyman-booking.spec.ts --headed --project=chromium

echo.
if %ERRORLEVEL% EQU 0 (
    echo  [PASS] All tests passed!
) else (
    echo  [FAIL] Some tests failed. Opening report...
    npx playwright show-report
)
echo.
pause
