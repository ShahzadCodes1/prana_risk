# Downloads the carrier logos and the real photos from the old prana-risk.com site into raw/old-site
# Run from the project folder:  powershell -ExecutionPolicy Bypass -File scripts/get-old-site-images.ps1
$ErrorActionPreference = 'Continue'
$ProgressPreference = 'SilentlyContinue'
$out = Join-Path $PSScriptRoot '..\raw\old-site'
New-Item -ItemType Directory -Force -Path "$out\logos" | Out-Null

$up = 'https://www.prana-risk.com/wp-content/uploads'
$logos = '1.Chubb_','2.AIG_','3.Hartford','4.MassMutual','5.Travellers','6.Markel','7.Markel','8.Principal','9.Progressive',
  '10.Liberty-Mutual','11.safeco','12.Allianz','13.HISCOX','14.CannGen','15.Pure_','16.Zurich','17.NatGen','18.John-Hancock',
  '19.Beazley','20.Bowhead','21.Bowhead','22.CNA_','23.Munich-Re','24.Munich-Re','25.Munich-Re','26.Munich-Re','27.Munich-Re',
  '28.foremost_insurance_logos_guidelines-1','29.Group_','30.usli-vector-logo-1'
foreach ($l in $logos) {
  try { Invoke-WebRequest "$up/2026/02/$l.png" -OutFile "$out\logos\$l.png" -UseBasicParsing; Write-Host "ok  $l" }
  catch { Write-Host "MISSING  $l" }
}

$photos = @{
  'old-personal'       = "$up/2025/12/Rectangle-65-1.png"
  'old-business'       = "$up/2025/12/Rectangle-65-2.png"
  'old-life'           = "$up/2025/12/Rectangle-65-3.png"
  'old-section'        = "$up/2026/01/section-img-scaled.jpg"
  'old-choose'         = "$up/2026/01/choose-section-scaled.jpg"
  'old-services'       = "$up/2025/11/fc6c063a68e85ef87de8fcf76f458f429c12850f.jpg"
  'old-liability'      = "$up/2025/12/The-Importance-of-Liability-Insurance.webp"
  'old-water'          = "$up/2025/12/Insurance-for-Water-Damage.webp"
  'old-replacement'    = "$up/2025/12/Replacement-Cost-Coverage_.webp"
}
foreach ($k in $photos.Keys) {
  $u = $photos[$k]; $ext = [IO.Path]::GetExtension($u)
  try { Invoke-WebRequest $u -OutFile "$out\$k$ext" -UseBasicParsing; Write-Host "ok  $k" } catch { Write-Host "MISSING  $k" }
}

# the product pages' own share images (co-op, brownstone, condo, home)
$pages = @{
  'og-coop'       = 'https://www.prana-risk.com/property-insurance/co-op-insurance-nyc/'
  'og-brownstone' = 'https://www.prana-risk.com/property-insurance/brownstone-nyc/'
  'og-condo'      = 'https://www.prana-risk.com/property-insurance/condo-nyc/'
  'og-home'       = 'https://www.prana-risk.com/property-insurance/home-nyc/'
}
foreach ($k in $pages.Keys) {
  try {
    $html = (Invoke-WebRequest $pages[$k] -UseBasicParsing).Content
    if ($html -match '<meta[^>]+property="og:image"[^>]+content="([^"]+)"') {
      $u = $Matches[1]; $ext = [IO.Path]::GetExtension(($u -split '\?')[0])
      Invoke-WebRequest $u -OutFile "$out\$k$ext" -UseBasicParsing; Write-Host "ok  $k  ($u)"
    } else { Write-Host "no share image  $k" }
  } catch { Write-Host "MISSING  $k" }
}
Write-Host "`nDone. Files are in raw\old-site"
