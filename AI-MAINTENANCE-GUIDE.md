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
| Obsidian 笔记来源 | Z:\test-ob（网络共享） |
| 框架 | Quartz v4 (https://quartz.jzhao.xyz) |
| 部署方式 | GitHub Actions（推送到 main 自动构建部署） |

---

## 项目结构

> ⚠️ 注意：以下文件结构仅为当前快照，后续可能会因内容增减或配置调整而变化。
> AI 在执行任务时应先通过 `dir` 等命令确认实际目录结构。

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
├── quartz/                   # Quartz 引擎源码
│   ├── components/           # 页面组件（Head.tsx 等）
│   └── plugins/transformers/ # 自定义转换插件
│       ├── tabs.ts           # Tab 缩进保留插件（自定义，见下方说明）
│       └── ...
├── .github/workflows/
│   └── deploy.yml            # GitHub Actions 自动部署
├── quartz.config.ts          # 站点配置（标题、主题、语言、SEO、插件列表）
├── quartz.layout.ts          # 页面布局（侧边栏、导航、页脚）
├── sync-content.ps1          # 从 Obsidian 仓库同步笔记到 content/
├── QUARTZ-DEPLOY-GUIDE.md    # 人类看的部署指南
├── AI-MAINTENANCE-GUIDE.md   # 本文件
└── package.json
```

---

## 已生效的插件配置

### 1. HardLineBreaks（内置插件）

处理 Obsidian 中的单换行问题（当前已生效）。

**问题**: Obsidian 中单换行显示正常，但部署到网站后同一段落的内容会挤成一行。
**解决**: 添加 `Plugin.HardLineBreaks()` 到 transformers 列表，将单换行渲染为 `<br>`。
**配置位置**: `quartz.config.ts` → `plugins.transformers`
**插件源码**: `quartz/plugins/transformers/linebreaks.ts`

### 2. Tabs（自定义插件）

处理 Obsidian 中的 Tab 缩进在网站消失的问题（当前已生效）。

**问题**: Obsidian 中用 Tab 缩进/对齐的内容（如 `【字段】\t值`），部署后缩进消失，HTML 会折叠空白字符。
**解决方案**: 自定义 `textTransform` 插件，在 Markdown 解析前将 Tab 字符替换为 2 个全角空格（`\u3000`），确保缩进可见。

**插件源码**（`quartz/plugins/transformers/tabs.ts`）:

```typescript
import { QuartzTransformerPlugin } from "../types"

export const Tabs: QuartzTransformerPlugin = () => {
  return {
    name: "Tabs",
    textTransform: (_ctx, src) => {
      // Replace tabs with 2 CJK full-width spaces for visual alignment
      return src.replace(/\t/g, "\u3000\u3000")
    },
  }
}
```

**为什么不直接用 CSS white-space: pre-wrap**:
- Markdown 解析器（remark-parse）在解析阶段就会把 Tab 转为空格，CSS 无法干预
- 必须在解析前替换，所以用 `textTransform` 钩子

**为什么用 \u3000（全角空格）而不是 \u00A0（不断行空格）**:
- \u00A0 在中文字体/编码下可能显示为乱码 `�`（在中国用户设备上测试发现）
- \u3000 是全角空格，中文环境所有字体都支持
- 2 个全角空格视觉上相当于 4 个半角空格的对齐效果

**添加方式**: 
1. 在 `quartz/plugins/transformers/` 下创建 `tabs.ts`（文件已存在）
2. 在 `quartz/plugins/transformers/index.ts` 中导出 `export { Tabs } from "./tabs"`（已添加）
3. 在 `quartz.config.ts` 的 transformers 中添加 `Plugin.Tabs()`（已添加）

**当前在 quartz.config.ts 中的配置顺序**:

```typescript
transformers: [
  Plugin.FrontMatter(),
  Plugin.CreatedModifiedDate({ priority: ["frontmatter", "filesystem"] }),
  Plugin.SyntaxHighlighting({ ... }),
  Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
  Plugin.GitHubFlavoredMarkdown(),
  Plugin.HardLineBreaks(),    // ← 单换行 → <br>
  Plugin.Tabs(),              // ← Tab → 全角空格
  Plugin.TableOfContents(),
  Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
  Plugin.Description(),
  Plugin.Latex({ renderEngine: "katex" }),
]
```

---

## 3. FLEXPLORER 排序集成（自定义 Explorer sortFn）

将 Obsidian FLEXPLORER 插件的自定义排序同步到 Quartz 侧边栏 Explorer 组件。

### 问题

Obsidian 中用 FLEXPLORER 插件给文件夹和文件排了自定义顺序（拖拽排序），但网站侧边栏的目录树（Explorer）还是按字母序排列。

### 解决方案

在 Explorer 组件的 `sortFn` 中嵌入 FLEXPLORER 的排序映射数据，通过节点的 slug 推导出父级路径，找到该层级的自定义排序。

**核心逻辑**（`quartz.layout.ts` 中的 `sortFn`）:
1. 读取子节点的 `slug`，推导出其父级路径
2. 根据父级路径查找 FLEXPLORER 排序映射
3. 若找到则按自定义顺序排序，否则回退到字母序

### 文件说明

| 文件 | 说明 |
|------|------|
| `quartz.layout.ts` | Explorer 组件传入自定义 `sortFn`，内嵌 FLEXPLORER 排序数据 |
| `update-flex-order.js` | Node.js 脚本，读取 FLEXPLORER 的 `data.json` 并更新布局文件 |
| `Z:\test-ob\.obsidian\plugins\flexplorer\data.json` | FLEXPLORER 的排序数据源 |

### 更新排序的流程

当用户在 Obsidian FLEXPLORER 中调整排序后，运行同步脚本即可：

```powershell
cd D:\test-ob-site
.\sync-content.ps1
```

`sync-content.ps1` 会自动调用 `update-flex-order.js`，读取最新 FLEXPLORER 数据并更新 `quartz.layout.ts` 中的排序映射，然后提交笔记变更。

### sortFn 工作原理

```typescript
sortFn: (a, b) => {
  // 1. FLEXPLORER 排序映射（嵌在函数体内，序列化成字符串后传到浏览器）
  const FO = {"/": ["产品开发", "产品研发", ...], "产品开发": ["项目管理", ...], ...};

  // 2. 从子节点 slug 推导父级路径
  let s = a.slug;
  if (s.endsWith("/index")) s = s.slice(0, -6);
  const i = s.lastIndexOf("/");
  const p = i >= 0 ? s.slice(0, i) : "/";  // 根路径用 "/"

  // 3. 查找该层级的自定义排序
  const o = FO[p];
  if (o) {
    const ai = o.indexOf(a.displayName);
    const bi = o.indexOf(b.displayName);
    if (ai >= 0 && bi >= 0) return ai - bi;
    if (ai >= 0) return -1;
    if (bi >= 0) return 1;
  }

  // 4. 回退到默认排序（文件夹优先 + 字母序）
  if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
    return a.displayName.localeCompare(b.displayName, undefined, {
      numeric: true, sensitivity: "base",
    });
  }
  return a.isFolder ? -1 : 1;
}
```

### 注意事项

- FLEXPLORER 的排序数据硬编码在 `sortFn` 函数体内（不是外部引用），因为 `Explorer.tsx` 通过 `.toString()` 序列化函数并发送到浏览器执行
- 根路径 FLEXPLORER 用 `"/"`，排序函数中对应 `p = "/"`
- 更新排序时只需运行 `sync-content.ps1`，不需要手动修改 `quartz.layout.ts`
- FLEXPLORER 数据文件路径为 `Z:\test-ob\.obsidian\plugins\flexplorer\data.json`


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
> 或者使用: `git -c http.sslbackend=openssl -c http.proxy="" push`

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
git -c http.sslbackend=openssl -c http.proxy="" push
```

### 3. 更新笔记并推送（完整流程）
```powershell
cd D:\test-ob-site
.\sync-content.ps1
git add .
git commit -m "sync: update notes"
git -c http.sslbackend=openssl -c http.proxy="" push
```

### 4. 添加新插件的步骤
如果需要添加新的 Quartz 自定义插件：

1. 在 `quartz/plugins/transformers/` 下创建 `xxx.ts`
2. 在 `quartz/plugins/transformers/index.ts` 中添加导出
3. 在 `quartz.config.ts` 的 transformers 中添加 `Plugin.Xxx()`
4. 注意文件编码用 UTF-8 **无 BOM**，否则 esbuild 编译会报错

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
4. Node.js Bundle 路径: `C:\Users\it-tanglizhen\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`
5. SSL 证书问题: 国内网络可能需要 `git config --global http.sslverify false`
6. 文件编码: 所有 TypeScript 文件必须用 UTF-8 无 BOM，否则 esbuild 构建会失败
7. Quartz 源码原则上不直接修改，自定义功能通过插件（`quartz/plugins/transformers/`）实现
