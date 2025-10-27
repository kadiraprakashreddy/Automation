# PowerShell script to stop all Node.js and Angular CLI services

Write-Host "Stopping all Node.js and Angular CLI services..." -ForegroundColor Yellow

Write-Host ""
Write-Host "Terminating Node.js processes..." -ForegroundColor Cyan
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "Node.js processes terminated." -ForegroundColor Green
} else {
    Write-Host "No Node.js processes found or already stopped." -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "Terminating Angular CLI processes..." -ForegroundColor Cyan
$ngProcesses = Get-Process ng -ErrorAction SilentlyContinue
if ($ngProcesses) {
    $ngProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "Angular CLI processes terminated." -ForegroundColor Green
} else {
    Write-Host "No Angular CLI processes found or already stopped." -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "Checking for processes using ports 3000, 4200, 8081..." -ForegroundColor Cyan
$ports = @(3000, 4200, 8081)
foreach ($port in $ports) {
    $processIds = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess | Select-Object -Unique
    if ($processIds) {
        foreach ($pid in $processIds) {
            try {
                $process = Get-Process -Id $pid -ErrorAction Stop
                Write-Host "Killing process $($process.ProcessName) (PID: $pid) using port $port..." -ForegroundColor Yellow
                Stop-Process -Id $pid -Force -ErrorAction Stop
                Write-Host "Process $pid on port $port terminated." -ForegroundColor Green
            } catch {
                Write-Host "Failed to terminate process $pid on port $port. Error: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "No process found using port $port." -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "All known services stopped. Ports should now be free." -ForegroundColor Green
Write-Host ""
Write-Host "Script completed successfully!" -ForegroundColor Green