# PowerShell Script to Start All Services
# Run this script from the project root directory

Write-Host "`n🚀 Playwright Automation Engine - Starting All Services" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Function to check if a directory exists and has package.json
function Test-Project {
    param($Path)
    return Test-Path (Join-Path $Path "package.json")
}

# Function to check if node_modules exists
function Test-Dependencies {
    param($Path)
    return Test-Path (Join-Path $Path "node_modules")
}

# Function to log with timestamp
function Write-Log {
    param($Message, $Color = "White")
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

# Check project structure
Write-Log "📁 Checking project structure..." "Blue"

$projectRoot = Get-Location
$checks = @(
    @{ Name = "Main Project"; Path = $projectRoot; Required = $true },
    @{ Name = "API Server"; Path = Join-Path $projectRoot "api"; Required = $true },
    @{ Name = "Angular UI"; Path = Join-Path $projectRoot "autobot-ui"; Required = $true }
)

foreach ($check in $checks) {
    if (-not (Test-Project $check.Path)) {
        Write-Log "❌ $($check.Name) not found at $($check.Path)" "Red"
        if ($check.Required) {
            Write-Log "💡 Make sure you're running this script from the project root directory" "Yellow"
            exit 1
        }
    } else {
        Write-Log "✅ $($check.Name) found" "Green"
    }
}

# Check dependencies
Write-Log "`n📦 Checking dependencies..." "Blue"

$dependencyChecks = @(
    @{ Name = "Main Project"; Path = $projectRoot },
    @{ Name = "API Server"; Path = Join-Path $projectRoot "api" },
    @{ Name = "Angular UI"; Path = Join-Path $projectRoot "autobot-ui" }
)

foreach ($check in $dependencyChecks) {
    if (-not (Test-Dependencies $check.Path)) {
        Write-Log "⚠️  $($check.Name) dependencies not installed" "Yellow"
        $relativePath = [System.IO.Path]::GetRelativePath($projectRoot, $check.Path)
        Write-Log "   Run: Set-Location $relativePath; npm install" "Yellow"
    } else {
        Write-Log "✅ $($check.Name) dependencies installed" "Green"
    }
}

# Check Playwright browsers
Write-Log "`n🌐 Checking Playwright browsers..." "Blue"

try {
    $playwrightVersion = npx playwright --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Log "✅ Playwright installed: $playwrightVersion" "Green"
    } else {
        throw "Playwright not found"
    }
} catch {
    Write-Log "⚠️  Playwright not found or browsers not installed" "Yellow"
    Write-Log "   Run: npm run install-browsers" "Yellow"
}

Write-Host "`n🎯 Starting Services..." -ForegroundColor Magenta
Write-Host "=" * 40 -ForegroundColor Magenta

# Start API Server
Write-Log "🚀 Starting API Server (Port 3000)..." "Blue"

$apiJob = Start-Job -ScriptBlock {
    Set-Location $using:projectRoot\api
    npm start
}

# Wait for API server to start
Start-Sleep -Seconds 3

# Start Angular UI
Write-Log "`n🎨 Starting Angular UI (Port 4200)..." "Blue"

$angularJob = Start-Job -ScriptBlock {
    Set-Location $using:projectRoot\autobot-ui
    ng serve
}

# Wait for Angular to start
Start-Sleep -Seconds 10

# Success message
Write-Host "`n🎉 All Services Started Successfully!" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Green

Write-Log "📱 Angular UI: http://localhost:4200" "White"
Write-Log "🔌 API Server: http://localhost:3000" "White"
Write-Log "📡 WebSocket: ws://localhost:8081" "White"

Write-Host "`n📋 Available Commands:" -ForegroundColor Yellow
Write-Log "• Create automation rules: Use the Rule Builder in Angular UI" "Yellow"
Write-Log "• Run existing rules: Click 'Run' in the Dashboard" "Yellow"
Write-Log "• View logs: Real-time logs in the Dashboard" "Yellow"
Write-Log "• Download logs: Click 'Download Logs' button" "Yellow"

Write-Host "`n🛑 To stop all services: Press Ctrl+C" -ForegroundColor Red

# Handle Ctrl+C
try {
    # Keep the script running and show job output
    while ($true) {
        # Check if jobs are still running
        if ($apiJob.State -ne "Running" -and $angularJob.State -ne "Running") {
            Write-Log "❌ One or more services stopped unexpectedly" "Red"
            break
        }
        
        # Show any output from jobs
        Receive-Job $apiJob -ErrorAction SilentlyContinue | ForEach-Object {
            if ($_ -match "API server running") {
                Write-Log "✅ API Server started successfully!" "Green"
            } elseif ($_ -match "WebSocket server running") {
                Write-Log "✅ WebSocket server started!" "Green"
            } elseif ($_) {
                Write-Log "[API] $_" "Cyan"
            }
        }
        
        Receive-Job $angularJob -ErrorAction SilentlyContinue | ForEach-Object {
            if ($_ -match "Local:") {
                Write-Log "✅ Angular UI started successfully!" "Green"
            } elseif ($_ -match "webpack compiled") {
                Write-Log "✅ Angular compilation completed!" "Green"
            } elseif ($_) {
                Write-Log "[Angular] $_" "Cyan"
            }
        }
        
        Start-Sleep -Seconds 2
    }
} finally {
    # Cleanup
    Write-Log "`n🛑 Shutting down all services..." "Yellow"
    
    Stop-Job $apiJob -ErrorAction SilentlyContinue
    Stop-Job $angularJob -ErrorAction SilentlyContinue
    
    Remove-Job $apiJob -ErrorAction SilentlyContinue
    Remove-Job $angularJob -ErrorAction SilentlyContinue
    
    Write-Log "✅ All services stopped. Goodbye! 👋" "Green"
}
