param(
    [string]$DB_HOST = $env:DB_HOST,
    [string]$DB_PORT = $env:DB_PORT,
    [string]$DB_USER = $env:DB_USER,
    [string]$DB_PASSWORD = $env:DB_PASSWORD,
    [string]$DB_NAME = $env:DB_NAME,
    [string]$JWT_SECRET = $env:JWT_SECRET
)

$ErrorActionPreference = 'Stop'
$key = $env:RENDER_API_KEY
if (-not $key) { Write-Error 'Set RENDER_API_KEY (Render dashboard: Account Settings > API Keys).'; exit 1 }
if (-not $DB_HOST) { Write-Error 'DB_HOST is required.'; exit 1 }
if (-not $DB_USER) { Write-Error 'DB_USER is required.'; exit 1 }
if (-not $DB_PASSWORD) { Write-Error 'DB_PASSWORD is required.'; exit 1 }
if (-not $DB_NAME) { Write-Error 'DB_NAME is required.'; exit 1 }
if (-not $JWT_SECRET) {
    $chars = 'abcdef0123456789'
    $JWT_SECRET = -join (1..64 | ForEach-Object { $chars[(Get-Random) % $chars.Length] })
    Write-Output "Generated JWT_SECRET (save it): $JWT_SECRET"
}
if (-not $DB_PORT) { $DB_PORT = '3306' }

$headers = @{ Authorization = "Bearer $key" }

$existing = Invoke-RestMethod -Method Get -Uri 'https://api.render.com/v1/services?limit=100' -Headers $headers
$dup = $existing | Where-Object { $_.service.name -eq 'task-master' }
if ($dup) {
    Write-Output "Service already exists: https://api.render.com/v1/services/$($dup.service.id)"
    exit 0
}

$body = @{
    type          = 'web_service'
    name          = 'task-master'
    env           = 'node'
    plan          = 'free'
    region        = 'oregon'
    branch        = 'main'
    repo          = 'https://github.com/salam2156/task-MASTER'
    buildCommand  = 'npm install'
    startCommand  = 'node server.js'
    healthCheckPath = '/api/health'
    autoDeploy    = $true
    envVars       = @(
        @{ key = 'PORT';         value = '10000' },
        @{ key = 'DB_HOST';      value = $DB_HOST },
        @{ key = 'DB_PORT';      value = $DB_PORT },
        @{ key = 'DB_USER';      value = $DB_USER },
        @{ key = 'DB_PASSWORD';  value = $DB_PASSWORD },
        @{ key = 'DB_NAME';      value = $DB_NAME },
        @{ key = 'DB_SSL';       value = 'true' },
        @{ key = 'JWT_SECRET';   value = $JWT_SECRET }
    )
} | ConvertTo-Json -Depth 5

$service = Invoke-RestMethod -Method Post -Uri 'https://api.render.com/v1/services' -Headers $headers -ContentType 'application/json' -Body $body
Write-Output "Service created: $($service.id)"
Write-Output "Dashboard: https://dashboard.render.com/web/$($service.id)"
Write-Output "URL: https://task-master.onrender.com"

Start-Sleep -Seconds 8
$deploys = Invoke-RestMethod -Method Get -Uri "https://api.render.com/v1/services/$($service.id)/deploys?limit=1" -Headers $headers
Write-Output "Deploy status: $($deploys[0].status) ($($deploys[0].commit.message))"