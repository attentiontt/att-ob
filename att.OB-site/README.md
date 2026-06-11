# att.OB Quartz Site

将 Obsidian 笔记发布为静态网站，基于 [Quartz v4](https://quartz.jzhao.xyz/)。

**站点地址：** https://attentiontt.github.io/att-ob

## 快速开始

### 前置条件
- [Node.js](https://nodejs.org/) >= 22
- Git
- GitHub 账号

### 1. 复制项目到稳定位置
```powershell
Copy-Item "C:\Users\IT-TAN~1\AppData\Local\Temp\att.OB-site" "D:\att.OB-site" -Recurse
cd D:\att.OB-site
```

### 2. 安装依赖并构建
```powershell
npm install
.\sync-content.ps1   # 从 D:\att.OB 同步最新笔记
npx quartz build     # 构建站点 → public/
```

### 3. 推送到 GitHub
```powershell
git init
git add .
git commit -m "Initial Quartz site"
git branch -M main
git remote add origin https://github.com/attentiontt/att-ob.git
git push -u origin main
```

### 4. 配置 GitHub Pages
在 `https://github.com/attentiontt/att-ob/settings/pages` 中，Source 选择 **GitHub Actions**。

之后每次推送，GitHub Actions 会自动构建部署到 https://attentiontt.github.io/att-ob

## 项目结构
```
├── content/          # Obsidian 笔记（由 sync-content.ps1 同步）
├── public/           # 构建产物（HTML 站点）
├── quartz/           # Quartz 引擎源码
├── quartz.config.ts  # 站点配置（已配置中文、主题）
├── quartz.layout.ts  # 页面布局配置
├── deploy.ps1        # 一键构建部署脚本
└── sync-content.ps1  # 同步笔记脚本
```
