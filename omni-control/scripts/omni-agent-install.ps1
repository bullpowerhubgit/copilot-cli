param(
    [Parameter(Mandatory = $true)][string]$ServerUrl,
    [Parameter(Mandatory = $true)][string]$AuthToken,
    [string]$InstallPath = "$Env:ProgramFiles\OmniControlAgent"
)

Write-Host "Installiere Omni Control Agent in $InstallPath" -ForegroundColor Cyan

if (-not (Test-Path $InstallPath)) {
    New-Item -ItemType Directory -Path $InstallPath | Out-Null
}

$agentArchive = Join-Path $InstallPath "agent.zip"
$agentDownload = "https://example.com/releases/agent/latest.zip"

Invoke-WebRequest -Uri $agentDownload -OutFile $agentArchive
Expand-Archive -Path $agentArchive -DestinationPath $InstallPath -Force
Remove-Item $agentArchive

Copy-Item "$PSScriptRoot\..\services\agent\dist\*" -Destination $InstallPath -Recurse -Force

$envFile = @"NODE_ENV=production
CONTROLHUB_URL=$ServerUrl
AGENT_TOKEN=$AuthToken
"@

$envFile | Set-Content -Path (Join-Path $InstallPath ".env") -Encoding UTF8

Write-Host "Registriere Windows Service" -ForegroundColor Yellow

$serviceName = "OmniControlAgent"
if (Get-Service -Name $serviceName -ErrorAction SilentlyContinue) {
    Stop-Service -Name $serviceName -Force
    sc.exe delete $serviceName | Out-Null
}

New-Service -Name $serviceName -BinaryPathName "node `"$InstallPath\dist\index.js`"" -DisplayName "Omni Control Agent" -Description "Agent für Omni Control Remote Automation" -StartupType Automatic

Start-Service -Name $serviceName

Write-Host "Installation abgeschlossen" -ForegroundColor Green
