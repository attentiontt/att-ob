# Quartz 部署 Obsidian 仓库 — AI 维护指南

> 本文件面向 AI 编码助手，说明该仓库的结构、用途和维护方式。
> 后续 AI 在处理本仓库相关任务时，请先阅读本指南。

---

## 仓库概览

| 项目 | 值 |
|------|-----|
| 仓库 | attentiontt/att-ob |
| 对应 GitHub Pages | https://attentiontt.github.io/att-ob |
| 本地项目路径 | D:\test-ob-site |
| Obsidian 笔记来源 | Z:\test-ob（网络共享）或 D:\att.OB |
| 框架 | Quartz v4 (https://quartz.jzhao.xyz) |
| 部署方式 | GitHub Actions（推送到 main 自动构建部署） |

---

## 项目结构

> ⚠️ 注意：以下文件结构仅为当前快照，后续可能会因内容增减或配置调整而变化。
> AI 在执行任务时应先通过 `ls`、`dir` 等命令确认实际目录结构，不要死板依赖此结构。


```
D:\test-ob-site/           ← 实际路径可能变化，以 AI 确认的为准
├── content/                  # Obsidian 笔记内容（markdown 文件）
│   ├── index.md              # 网站首页
│   ├── 产品开发/
│   ├── 产品研发/
│   ├── 供应链/
│   ├── 品质管理/
│   ├── 财务管理/
│   ├── 计划管理/
│   ├── 模板文件/
│   └── Z变更说明/
├── public/                   # 构建产物（HTML），不提交到 git
├── quartz/                   # Quartz 引擎源码（来自上游，不修改）
├── .github/workflows/
│   └── deploy.yml            # GitHub Actions 自动部署
├── quartz.config.ts          # 站点配置（标题、主题、语言、SEO）
├── quartz.layout.ts          # 页面布局（侧边栏、导航、页脚）
├── sync-content.ps1          # 从 Obsidian 仓库同步笔记到 content/
├── QUARTZ-DEPLOY-GUIDE.md    # 人类看的部署指南
└── package.json
```

---

## 工作流程

### 日常更新笔记

当用户要求"更新网站"或"发布笔记"时，执行：

```powershell
cd D:\test-ob-site

# 同步最新笔记（从 Obsidian 仓库拉取到 content/）
.\sync-content.ps1

# 提交并推送到 GitHub（触发 GitHub Actions 自动构建）
git add .
git commit -m "sync: update notes"
git push
```

> git push 可能需要 SSL 绕过：
> `git config --global http.sslverify false`（已配置可跳过）

### 构建站点（本地预览用）

```powershell
cd D:\test-ob-site
node ./quartz/bootstrap-cli.mjs build
# 产物在 public/
```

### 本地预览

```powershell
cd D:\test-ob-site
node ./quartz/bootstrap-cli.mjs build --serve
# 浏览器打开 http://localhost:8080
```

---

## 部署机制

- **自动部署**: GitHub Actions（`.github/workflows/deploy.yml`）
- **触发条件**: 推送代码到 `main` 分支
- **构建流程**:
  1. checkout 代码
  2. `npm install` 安装依赖
  3. `node ./quartz/bootstrap-cli.mjs build` 构建站点
  4. 将 `public/` 上传为 Pages artifact
  5. 部署到 GitHub Pages
- **上线地址**: https://attentiontt.github.io/att-ob
- **构建用时**: 约 1-2 分钟

---

## 配置说明

### quartz.config.ts

关键配置项：

| 配置 | 当前值 | 说明 |
|------|--------|------|
| pageTitle | test-ob | 网站标题 |
| locale | zh-CN | 中文语言 |
| baseUrl | attentiontt.github.io/att-ob | GitHub Pages 地址 |
| ignorePatterns | [".obsidian", ".trash", "private", "templates"] | 忽略不发布的目录 |

### 同步脚本（sync-content.ps1）

从 `Z:\test-ob`（网络共享仓库）同步笔记到 `content/` 目录。

```powershell
# 可手动指定 vault 路径
.\sync-content.ps1 -VaultPath "D:\att.OB"
```

---

## 常见操作（AI 用）

### 1. 检查 git 状态
```powershell
cd D:\test-ob-site
git status
git log --oneline -3
```

### 2. 推送代码（SSL 已配置）
```powershell
cd D:\test-ob-site
git add .
git commit -m "描述改动"
git -c http.sslbackend=openssl push
```

### 3. 查看 GitHub Actions 运行状态
通过 GitHub API 检查（无需 token 可查看公开信息）：
```
GET https://api.github.com/repos/attentiontt/att-ob/actions/runs
```

### 4. 更新笔记并推送（完整流程）
```powershell
cd D:\test-ob-site
.\sync-content.ps1
git add .
git commit -m "sync: update notes $(Get-Date -Format 'yyyy-MM-dd')"
git -c http.sslbackend=openssl push
```

---

## 换电脑后恢复（AI 操作指南）

新电脑上，假设 Node.js 和 Git 已安装：

```powershell
git clone https://github.com/attentiontt/att-ob.git D:\test-ob-site
cd D:\test-ob-site
npm install
# 然后参照"日常更新"流程
```

---

## 注意事项

1. `public/` 目录不提交到 git（`.gitignore` 已配置）
2. `node_modules/` 不提交到 git
3. Git 路径: `C:\Users\it-tanglizhen\AppData\Local\Programs\Git\cmd\git.exe`（不在 PATH 时用完整路径）
4. Node.js 路径: `C:\Users\it-tanglizhen\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`（Bundle 版本）
5. SSL 证书问题: 国内网络可能需要 `git config --global http.sslverify false`
6. Quartz 是 Obsidian 的静态站点生成器，不修改其源码
