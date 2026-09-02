# test-ob 技术部知识库站点

公司技术部内部知识库网站，基于 [Quartz v4](https://quartz.jzhao.xyz/) 搭建，将 Obsidian 笔记发布为静态站点。

涵盖模块：**产品研发** · **产品开发** · **供应链** · **品质管理** · **财务管理** · **计划管理**

**站点地址：** [https://attentiontt.github.io/att-ob](https://attentiontt.github.io/att-ob)

---

## 目录结构

```
D:\test-ob-site
├── content/             # 笔记源文件（由 deploy.ps1 从共享盘同步）
├── public/              # 构建产物（HTML 静态站点）
├── quartz/              # Quartz 引擎源码
├── quartz.config.ts     # 站点配置（中文、主题、插件）
├── quartz.layout.ts     # 页面布局配置
├── deploy.ps1           # 一键部署脚本（同步 → 排序 → 构建 → 推送）
├── update-flex-order.cjs
└── README.md
```

## 快速使用

只需运行 `deploy.ps1`，它会自动完成全部流程。

### 前置条件

- [Node.js](https://nodejs.org/) >= 22
- Git
- 有权限访问 `\\192.168.100.253\10技术部\临时`（共享盘）

### 一键部署

```powershell
cd D:\test-ob-site
.\deploy.ps1
```

`deploy.ps1` 会依次执行：

1. **挂载 Z:** — 将 `\\192.168.100.253\10技术部\临时` 映射为 Z 盘
2. **增量同步笔记** — 从 `Z:\test-ob` 仅复制新增或有变化的文件到 `content/`
3. **更新排序** — 运行 `update-flex-order.cjs`，让侧边栏与文件夹页面共用 FLEXPLORER 顺序
4. **快速校验** — 在临时目录完成本地构建，校验后自动清理，不提交 `public/`
5. **推送 GitHub** — 只提交源文件，触发 GitHub Actions 完成唯一一次正式构建和部署

> 站点使用统一的社交分享预览图。这样可以避免每次发布都为近千篇文档重新生成 WebP 图片。

### 手动构建（仅本地预览）

```powershell
cd D:\test-ob-site
npm install
npx quartz build --serve   # 本地预览
```

## 技术栈

| 层       | 技术                                   |
| -------- | -------------------------------------- |
| 笔记格式 | Markdown（Obsidian 方言）              |
| 站点框架 | [Quartz v4](https://quartz.jzhao.xyz/) |
| 构建引擎 | esbuild                                |
| 部署     | GitHub Pages（GitHub Actions）         |
| 域名     | https://attentiontt.github.io/att-ob   |

## GitHub 仓库

[attentiontt/att-ob](https://github.com/attentiontt/att-ob)

GitHub Actions 配置了自动部署流程，推送 `main` 分支后约 2 分钟站点自动更新。可在 [Actions 页面](https://github.com/attentiontt/att-ob/actions) 查看部署状态。
