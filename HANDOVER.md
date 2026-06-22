# 项目状态 & AI 交接文档

## 仓库信息
- GitHub: https://github.com/attentiontt/att-ob
- Pages 站点: https://attentiontt.github.io/att-ob（当前 404/构建失败）
- 本地路径: D:\test-ob-site
- Obsidian 仓库: Z:\test-ob（网络共享盘，需 net use Z: \\192.168.100.253\10技术部\需求文档 登录）
- Node.js: v24.14.0（Codex 绑定版）
- Git: C:\Users\it-tanglizhen\AppData\Local\Programs\Git\cmd\git.exe
- SSH 推送: 国内网络 git config --global http.sslverify false 或 git -c http.sslbackend=openssl -c http.proxy="" push

## 已完成的功能

### 1. HardLineBreaks 插件（换行问题 ✅）
- 文件: quartz/plugins/transformers/linebreaks.ts
- 配置: quartz.config.ts → Plugin.HardLineBreaks()
- 解决: Obsidian 中单换行正常，部署后挤成一行的问题

### 2. Tabs 插件（Tab 缩进问题 ✅）
- 文件: quartz/plugins/transformers/tabs.ts
- 原理: textTransform 钩子，在 Markdown 解析前把 Tab 替换为 2 个全角空格（\u3000）
- 用 \u3000 而非 \u00A0 的原因: \u00A0 在中文环境下可能显示为乱码
- 配置: quartz.config.ts → Plugin.Tabs()

### 3. FLEXPLORER 排序集成（✅ 已修复）
- 文件: quartz.layout.ts
- 内容页（defaultContentPageLayout）和列表页（defaultListPageLayout）各有一个 Explorer 组件
- 两个 Explorer 都绑定了自定义 sortFn，通过 const FO = {...} 映射表实现排序
- sortFn 原理: 从子节点 slug 推导父级路径 → 查找 FLEXPLORER 排序映射 → 按自定义顺序排序
- 注意: FLEXPLORER 的 data.json 在 Z:\.obsidian\plugins\flexplorer\data.json
- 更新脚本: update-flex-order.cjs（运行 
ode update-flex-order.cjs 即可更新排序数据到 layout.ts 和 flex-order.js）

## ✅ 修复内容（2026-06-12）

本地构建验证通过（23 plugins loaded, 54 files parsed, 148 files emitted to public）

### Build 失败根因（共 6 个问题）
1. **UTF-8 BOM**：文件头有 UTF-8 BOM 字节 → esbuild 解析 TS 时失败
2. **中文编码损坏**：FLEXPLORER 排序数据（const FO = {...}）中的中文字段因编码转换错误变成乱码
3. **换行符不兼容**：文件使用 CR（\r）而非 LF（\n）换行
4. **语法错误**：第一个 Component.Explorer({ 用 ), 而非 }), 闭合对象字面量
5. **缺少 defaultListPageLayout**：tagPage.tsx / folderPage.tsx 需要此导出但不存在
6. **重复 Explorer**：两个 Explorer 都塞在 defaultContentPageLayout.left 里

### GitHub Actions 调整
- 移除全局 FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true
- Node 版本保持 22

### 脚本修复
- update-flex-order.cjs：增加写回 quartz.layout.ts 的逻辑
- update-flex-order.js：改为 ESM 语法，修复正则 lastIndex bug，增加写回布局文件

## 项目文件速查

| 文件 | 用途 |
|------|------|
| quartz.config.ts | 站点配置（插件列表、主题、语言、SEO） |
| quartz.layout.ts | 页面布局（内容页 + 列表页各一个 Explorer，绑定 FLEXPLORER 排序） |
| quartz/plugins/transformers/tabs.ts | Tab 转全角空格插件 |
| quartz/plugins/transformers/linebreaks.ts | 单换行转 <br> 插件 |
| update-flex-order.cjs | FLEXPLORER 排序数据更新脚本 |
| sync-content.ps1 | 从 Z:\test-ob 同步笔记到 content/ |
| publish.ps1 | 一键发布脚本（同步+提交+推送） |
| deploy.ps1 | 部署脚本 |
| .github/workflows/deploy.yml | GitHub Actions 自动构建部署 |

## 后续需要做的事
1. **推送到 GitHub 验证 Actions 能否通过**：本地构建已通过，提交后去 Actions 页面确认
2. **确认 FLEXPLORER 排序是否真正生效**：部署后检查页面 Explorer 排序是否符合自定义顺序
3. 更新 AI-MAINTENANCE-GUIDE.md 反映最终状态
4. 更新 FLEXPLORER 数据后运行 
ode update-flex-order.cjs

## 关键注意事项
- 文件编码必须用 UTF-8 无 BOM，否则 esbuild 编译报错
- pull/push 需要 http.sslbackend=openssl
- 同步前需先 net use Z: \\192.168.100.253\10技术部\需求文档
- 项目 package.json 有 "type": "module"，.js 文件用 ESM，require() 需改为 .cjs

