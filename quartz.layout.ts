import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
    sortFn: (a, b) => {
                  const FO = {"/":["产品开发","产品研发","品质管理","供应链","计划管理","财务管理","模板文件","草稿用","资源文件夹"],"产品研发":["加工厂变更单","模具管理"],"产品研发/加工厂变更单":["查看加工厂变更单"],"产品研发/模具管理":["删除模具","变更加工厂","导出列表","操作日志","新建编辑模具","查看模具"],"产品开发":["产品画像需求","包装设计需求","寻源需求","市场大盘分析","市场调研需求","开发产品管理","项目管理","样品需求管理","知识产权排查"],"产品开发/项目管理":["全局说明","删除项目","变更项目","启动项目","导出项目","废弃项目","新建&编辑项目","查看项目-列表","查看项目-基础信息"],"品质管理":["样品评估管理","质检用例","质检标准需求"],"模板文件":["000需求规范","产品愿景与目标","目标用户与角色定义"],"草稿用":["【0194】同MSKU多配送方式，支持在推广商品管理同时请购","【1406】采购退款单","手板&T0样&模具T0&竞品样品线上化"],"计划管理":["变更说明","全球补货规则","产能管理","智能补货","计算结果"],"计划管理/智能补货":["补货需求说明1232"],"计划管理/计算结果":["三方仓补货结果","平台仓补货结果","计算逻辑"],"财务管理":["Feature01退款单"],"财务管理/Feature01退款单":["Story_01_发起退款","Story_02_ 查询退款单","Story_03_退款单操作","全局说明","场景"],"资源文件夹":["图片"],"资源文件夹/图片":["eb2ade79001b54a1c752d9d4536d7aba","Pasted image 20260603111300","Pasted image 20260605191441","Pasted image 20260609142439","Pasted image 20260609142452","Pasted image 20260609142456"],"产品开发/样品需求管理":["样品需求管理全局说明","变更记录","样品需求 — 创建","样品需求 — 列表","样品需求 — 操作","样品需求 — 批量操作","样品需求 — 导出"],"品质管理/质检用例":["变更记录","质检用例-列表","质检用例 -创建&维护"],"品质管理/质检标准需求":["质检用例全局说明","变更记录","质检标准列表 -创建","质检标准需求-列表","质检标准需求 -流程操作","质检标准需求 -批量操作"],"品质管理/质检标准需求/质检标准需求-列表":["查看质检标准需求列表&筛选项"],"品质管理/质检标准需求/质检标准列表 -创建":["新品项目创建质检用例","变更项目自动创建质检用例"],"品质管理/质检标准需求/质检标准需求 -流程操作":["新品项目-质检标准事件开始","提交","完善"],"品质管理/质检标准需求/质检标准需求 -批量操作":["QE分配","批量操作"],"品质管理/质检标准需求/变更记录":["质检标准需求1.0.1"],"品质管理/质检用例/质检用例-列表":["查看列表"],"品质管理/质检用例/质检用例 -创建&维护":["新建&编辑 质检用例","导入质检用例","删除质检用例"],"品质管理/质检用例/变更记录":["质检用例V1.0.1"],"产品开发/样品需求管理/变更记录":["样品需求管理变更记录"],"品质管理/样品评估管理":["样品评估需求全局说明","样品评估-创建","样品评估-查看","样品评估-流程操作","样品评估-导出"],"产品开发/样品需求管理/样品需求 — 创建":["手动新建样品需求","自动创建T0样品需求","自动创建手板样需求","自动创建试模T0样品需求","自动新建T1样品需求","自动新建变更样品需求"],"产品开发/样品需求管理/样品需求 — 列表":["查看样品需求列表","Story 查看打样明细","Story 筛选与排序"],"产品开发/样品需求管理/样品需求 — 批量操作":["Story 分配打样负责人"],"产品开发/样品需求管理/样品需求 — 导出":["列表导出","Story 打样附件下载"],"品质管理/样品评估管理/样品评估-流程操作":["提交样品评估","审核","复核"],"品质管理/样品评估管理/样品评估-创建":["样品评估-创建"],"品质管理/样品评估管理/样品评估-导出":["导出列表","打印"],"品质管理/样品评估管理/样品评估-查看":["查看列表"],"产品开发/样品需求管理/样品需求 — 操作":["Story 打样","Story 到样","Story 初样确认","Story 复核","Story 签样","Story 废弃样品需求"]};;
      let s = a.slug;
      if (s.endsWith("/index")) s = s.slice(0, -6);
      const i = s.lastIndexOf("/");
      const p = i >= 0 ? s.slice(0, i) : "/";
      const o = FO[p];
      if (o) {
        const ai = o.indexOf(a.displayName);
        const bi = o.indexOf(b.displayName);
        if (ai >= 0 && bi >= 0) return ai - bi;
        if (ai >= 0) return -1;
        if (bi >= 0) return 1;
      }
      if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
        return a.displayName.localeCompare(b.displayName, undefined, {
          numeric: true, sensitivity: "base",
        });
      }
      return a.isFolder ? -1 : 1;
    },
  }),
  ],
  right: [],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      sortFn: (a, b) => {
        const FO = {"/":["产品开发","产品研发","品质管理","供应链","计划管理","财务管理","模板文件","草稿用","资源文件夹"],"产品研发":["加工厂变更单","模具管理"],"产品研发/加工厂变更单":["查看加工厂变更单"],"产品研发/模具管理":["删除模具","变更加工厂","导出列表","操作日志","新建编辑模具","查看模具"],"产品开发":["产品画像需求","包装设计需求","寻源需求","市场大盘分析","市场调研需求","开发产品管理","项目管理","样品需求管理","知识产权排查"],"产品开发/项目管理":["全局说明","删除项目","变更项目","启动项目","导出项目","废弃项目","新建&编辑项目","查看项目-列表","查看项目-基础信息"],"品质管理":["样品评估管理","质检用例","质检标准需求"],"模板文件":["000需求规范","产品愿景与目标","目标用户与角色定义"],"草稿用":["【0194】同MSKU多配送方式，支持在推广商品管理同时请购","【1406】采购退款单","手板&T0样&模具T0&竞品样品线上化"],"计划管理":["变更说明","全球补货规则","产能管理","智能补货","计算结果"],"计划管理/智能补货":["补货需求说明1232"],"计划管理/计算结果":["三方仓补货结果","平台仓补货结果","计算逻辑"],"财务管理":["Feature01退款单"],"财务管理/Feature01退款单":["Story_01_发起退款","Story_02_ 查询退款单","Story_03_退款单操作","全局说明","场景"],"资源文件夹":["图片"],"资源文件夹/图片":["eb2ade79001b54a1c752d9d4536d7aba","Pasted image 20260603111300","Pasted image 20260605191441","Pasted image 20260609142439","Pasted image 20260609142452","Pasted image 20260609142456"],"产品开发/样品需求管理":["样品需求管理全局说明","变更记录","样品需求 — 创建","样品需求 — 列表","样品需求 — 操作","样品需求 — 批量操作","样品需求 — 导出"],"品质管理/质检用例":["变更记录","质检用例-列表","质检用例 -创建&维护"],"品质管理/质检标准需求":["质检用例全局说明","变更记录","质检标准列表 -创建","质检标准需求-列表","质检标准需求 -流程操作","质检标准需求 -批量操作"],"品质管理/质检标准需求/质检标准需求-列表":["查看质检标准需求列表&筛选项"],"品质管理/质检标准需求/质检标准列表 -创建":["新品项目创建质检用例","变更项目自动创建质检用例"],"品质管理/质检标准需求/质检标准需求 -流程操作":["新品项目-质检标准事件开始","提交","完善"],"品质管理/质检标准需求/质检标准需求 -批量操作":["QE分配","批量操作"],"品质管理/质检标准需求/变更记录":["质检标准需求1.0.1"],"品质管理/质检用例/质检用例-列表":["查看列表"],"品质管理/质检用例/质检用例 -创建&维护":["新建&编辑 质检用例","导入质检用例","删除质检用例"],"品质管理/质检用例/变更记录":["质检用例V1.0.1"],"产品开发/样品需求管理/变更记录":["样品需求管理变更记录"],"品质管理/样品评估管理":["样品评估需求全局说明","样品评估-创建","样品评估-查看","样品评估-流程操作","样品评估-导出"],"产品开发/样品需求管理/样品需求 — 创建":["手动新建样品需求","自动创建T0样品需求","自动创建手板样需求","自动创建试模T0样品需求","自动新建T1样品需求","自动新建变更样品需求"],"产品开发/样品需求管理/样品需求 — 列表":["查看样品需求列表","Story 查看打样明细","Story 筛选与排序"],"产品开发/样品需求管理/样品需求 — 批量操作":["Story 分配打样负责人"],"产品开发/样品需求管理/样品需求 — 导出":["列表导出","Story 打样附件下载"],"品质管理/样品评估管理/样品评估-流程操作":["提交样品评估","审核","复核"],"品质管理/样品评估管理/样品评估-创建":["样品评估-创建"],"品质管理/样品评估管理/样品评估-导出":["导出列表","打印"],"品质管理/样品评估管理/样品评估-查看":["查看列表"],"产品开发/样品需求管理/样品需求 — 操作":["Story 打样","Story 到样","Story 初样确认","Story 复核","Story 签样","Story 废弃样品需求"]};
        let s = a.slug;
        if (s.endsWith("/index")) s = s.slice(0, -6);
        const i = s.lastIndexOf("/");
        const p = i >= 0 ? s.slice(0, i) : "/";
        const o = FO[p];
        if (o) {
          const ai = o.indexOf(a.displayName);
          const bi = o.indexOf(b.displayName);
          if (ai >= 0 && bi >= 0) return ai - bi;
          if (ai >= 0) return -1;
          if (bi >= 0) return 1;
        }
        if ((!a.isFolder && !b.isFolder) || (a.isFolder && b.isFolder)) {
          return a.displayName.localeCompare(b.displayName, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        }
        return a.isFolder ? -1 : 1;
      },
    }),
  ],
  right: [],
}

