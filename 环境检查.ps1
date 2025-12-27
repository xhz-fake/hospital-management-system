param(
    [string]$ProjectPath = "C:\hospital-management-system"
)

# 医院管理系统 - 环境检查脚本
# 此脚本用于检查部署所需的环境是否正确安装

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  医院管理系统 - 环境检查" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allOk = $true

# 检查 Java
Write-Host "[1/5] 检查 Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    if ($javaVersion -match "version") {
        Write-Host "  ✓ Java 已安装" -ForegroundColor Green
        Write-Host "    $javaVersion" -ForegroundColor Gray
    } else {
        Write-Host "  ✗ Java 未正确安装" -ForegroundColor Red
        $allOk = $false
    }
} catch {
    Write-Host "  ✗ Java 未安装" -ForegroundColor Red
    Write-Host "    请安装 JDK 17 或更高版本" -ForegroundColor Yellow
    $allOk = $false
}

Write-Host ""

# 检查 Node.js
Write-Host "[2/5] 检查 Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    $npmVersion = npm -v
    if ($nodeVersion) {
        Write-Host "  ✓ Node.js 已安装" -ForegroundColor Green
        Write-Host "    Node.js: $nodeVersion" -ForegroundColor Gray
        Write-Host "    npm: $npmVersion" -ForegroundColor Gray
    } else {
        Write-Host "  ✗ Node.js 未正确安装" -ForegroundColor Red
        $allOk = $false
    }
} catch {
    Write-Host "  ✗ Node.js 未安装" -ForegroundColor Red
    Write-Host "    请安装 Node.js 16 或更高版本" -ForegroundColor Yellow
    $allOk = $false
}

Write-Host ""

# 检查 MySQL
Write-Host "[3/5] 检查 MySQL..." -ForegroundColor Yellow
try {
    $mysqlVersion = mysql --version 2>&1
    if ($mysqlVersion -match "Ver") {
        Write-Host "  ✓ MySQL 已安装" -ForegroundColor Green
        Write-Host "    $mysqlVersion" -ForegroundColor Gray
    } else {
        Write-Host "  ✗ MySQL 未正确安装" -ForegroundColor Red
        $allOk = $false
    }
} catch {
    Write-Host "  ✗ MySQL 未安装或未添加到 PATH" -ForegroundColor Red
    Write-Host "    请安装 MySQL 8.0 或更高版本" -ForegroundColor Yellow
    Write-Host "    或者将 MySQL bin 目录添加到系统 PATH" -ForegroundColor Yellow
    $allOk = $false
}

Write-Host ""

# 检查 Maven
Write-Host "[4/5] 检查 Maven..." -ForegroundColor Yellow
try {
    $mavenVersion = mvn -version 2>&1 | Select-Object -First 1
    if ($mavenVersion -match "Apache Maven") {
        Write-Host "  ✓ Maven 已安装" -ForegroundColor Green
        Write-Host "    $mavenVersion" -ForegroundColor Gray
    } else {
        Write-Host "  ✗ Maven 未正确安装" -ForegroundColor Red
        $allOk = $false
    }
} catch {
    Write-Host "  ✗ Maven 未安装或未添加到 PATH" -ForegroundColor Red
    Write-Host "    请安装 Maven 3.6 或更高版本" -ForegroundColor Yellow
    Write-Host "    或者将 Maven bin 目录添加到系统 PATH" -ForegroundColor Yellow
    $allOk = $false
}

Write-Host ""

# 检查项目文件
Write-Host "[5/5] 检查项目文件..." -ForegroundColor Yellow

# 解析项目根目录：优先外部参数，其次脚本目录，再次命令路径，最后当前目录
$projectPath = "C:\hospital-management-system"
if (-not [string]::IsNullOrWhiteSpace($ProjectPath)) {
    $projectPath = $ProjectPath
}
if ([string]::IsNullOrWhiteSpace($projectPath) -and -not [string]::IsNullOrWhiteSpace($PSScriptRoot)) {
    $projectPath = $PSScriptRoot
}
if ([string]::IsNullOrWhiteSpace($projectPath) -and -not [string]::IsNullOrWhiteSpace($PSCommandPath)) {
    try {
        $projectPath = Split-Path -Parent $PSCommandPath
    } catch {
        # ignore
    }
}
if ([string]::IsNullOrWhiteSpace($projectPath) -and $MyInvocation -and $MyInvocation.MyCommand -and $MyInvocation.MyCommand.Path) {
    try {
        $projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
    } catch {
        # ignore
    }
}
if ([string]::IsNullOrWhiteSpace($projectPath)) {
    $projectPath = (Get-Location).Path
}

# 规范化路径并验证
try {
    $projectPath = (Resolve-Path -LiteralPath $projectPath).Path
} catch {
    # ignore
}

Write-Host ("  使用项目根目录: " + $projectPath) -ForegroundColor Gray

$requiredDirs = @("HospitalManagementSystem_backend", "hms_miniprogram", "web-admin", "database") | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
$allFilesExist = $true

foreach ($dir in $requiredDirs) {
    $dirPath = Join-Path -Path $projectPath -ChildPath $dir
    if (Test-Path -LiteralPath $dirPath) {
        Write-Host "  ✓ $dir/ 目录存在" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $dir/ 目录不存在" -ForegroundColor Red
        $allFilesExist = $false
    }
}

$dbDir = Join-Path -Path $projectPath -ChildPath "database"
$dbInit = Join-Path -Path $dbDir -ChildPath "init.sql"
if (Test-Path -LiteralPath $dbInit) {
    Write-Host "  ✓ database/init.sql 存在" -ForegroundColor Green
} else {
    Write-Host "  ✗ database/init.sql 不存在" -ForegroundColor Red
    $allFilesExist = $false
}

if (-not $allFilesExist) {
    $allOk = $false
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allOk) {
    Write-Host "✓ 环境检查通过！可以开始部署项目了。" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步：" -ForegroundColor Yellow
    Write-Host "1. 查看 '部署指南.md' 获取详细的部署步骤" -ForegroundColor White
    Write-Host "2. 按照指南一步步完成部署" -ForegroundColor White
} else {
    Write-Host "✗ 环境检查未完全通过，请先安装缺失的软件。" -ForegroundColor Red
    Write-Host ""
    Write-Host "需要安装的软件：" -ForegroundColor Yellow
    Write-Host "- JDK 17+: https://www.oracle.com/java/technologies/downloads/" -ForegroundColor White
    Write-Host "- Node.js 16+: https://nodejs.org/" -ForegroundColor White
    Write-Host "- MySQL 8.0+: https://dev.mysql.com/downloads/" -ForegroundColor White
    Write-Host "- Maven 3.6+: https://maven.apache.org/download.cgi" -ForegroundColor White
    Write-Host "- 微信开发者工具: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html" -ForegroundColor White
}

Write-Host ""
Write-Host "按任意键退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

