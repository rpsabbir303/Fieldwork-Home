$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)

$email = (Read-Host 'Admin email').Trim().ToLowerInvariant()
if ($email -notmatch '^[^\s@]+@[^\s@]+\.[^\s@]+$') { throw 'Enter a valid email address.' }
$secure = Read-Host 'Admin password (hidden; at least 14 characters)' -AsSecureString
$plain = [System.Net.NetworkCredential]::new('', $secure).Password
try {
  if ($plain.Length -lt 14) { throw 'Password must contain at least 14 characters.' }
  $env:ADMIN_EMAIL = $email
  $env:ADMIN_PASSWORD = $plain
  & node --env-file=.env --import tsx prisma/create-admin.ts
  if ($LASTEXITCODE -ne 0) { throw 'Administrator creation failed.' }
} finally {
  Remove-Item Env:ADMIN_EMAIL, Env:ADMIN_PASSWORD -ErrorAction SilentlyContinue
  $plain = $null
  $secure.Dispose()
}
