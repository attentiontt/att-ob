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
    const FO = {"/":["产品开发","产品研发","供应链","品质管理","财务管理","计划管理","Z变更说明","资源文件夹","模板文件"],"Z变更说明":["变更说明.md"],"产品研发":["加工厂变更单","模具管理"],"产品研发/加工厂变更单":["查看加工厂变更单.md"],"产品研发/模具管理":["删除模具.md","变更加工厂.md","导出列表.md","操作日志.md","新建编辑模具.md","查看模具.md"],"产品开发":["项目管理","寻源需求","产品画像需求","开发产品管理","包装设计需求","市场大盘分析","样品需求管理","市场调研需求","知识产权排查"],"产品开发/样品需求管理":["总变更说明.md","样品需求管理全局说明.md","查看列表&筛选.md","新建样品需求.md","操作说明.md","分配打样负责人.md","打样附件下载.md"],"产品开发/项目管理":["全局说明.md","删除项目.md","变更项目.md","启动项目.md","导出项目.md","废弃项目.md","新建&编辑项目.md","查看项目-列表.md","查看项目-基础信息.md"],"财务管理":["Feature01退款单"],"财务管理/Feature01退款单":["Story_01_发起退款.md","Story_02_ 查询退款单.md","Story_03_退款单操作.md","全局说明.md","场景.md"],"计划管理":["产能管理","全球补货规则","变更说明.md","智能补货","计算结果"],"计划管理/智能补货":["补货需求说明1232.md"],"计划管理/计算结果":["计算逻辑.md","平台仓补货结果.md","三方仓补货结果.md"],"资源文件夹":["图片"],"资源文件夹/图片":["eb2ade79001b54a1c752d9d4536d7aba.png","Pasted image 20260603111300.png","Pasted image 20260605191441.png","Pasted image 20260609142439.png","Pasted image 20260609142452.png","Pasted image 20260609142456.png"],"模板文件":["000需求规范.md","产品愿景与目标.md","目标用户与角色定义.md"],"品质管理":["质检用例需求"],"品质管理/质检用例需求":["质检用例全局说明.md","查看列表&筛选项.md","创建质检用例.md","操作说明.md"]};
    let s = a.slug;
    if (s.endsWith("/index")) s = s.slice(0, -6);
    const i = s.lastIndexOf("/");
    const p = i >= 0 ? s.slice(0, i) : "";
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
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
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
      ],
    }),
    Component.Explorer({
    sortFn: (a, b) => {
      const FO = {"/":["产品开发","产品研发","供应链","品质管理","财务管理","计划管理","Z变更说明","资源文件夹","模板文件"],"Z变更说明":["变更说明.md"],"产品研发":["加工厂变更单","模具管理"],"产品研发/加工厂变更单":["查看加工厂变更单.md"],"产品研发/模具管理":["删除模具.md","变更加工厂.md","导出列表.md","操作日志.md","新建编辑模具.md","查看模具.md"],"产品开发":["项目管理","寻源需求","产品画像需求","开发产品管理","包装设计需求","市场大盘分析","样品需求管理","市场调研需求","知识产权排查"],"产品开发/样品需求管理":["总变更说明.md","样品需求管理全局说明.md","查看列表&筛选.md","新建样品需求.md","操作说明.md","分配打样负责人.md","打样附件下载.md"],"产品开发/项目管理":["全局说明.md","删除项目.md","变更项目.md","启动项目.md","导出项目.md","废弃项目.md","新建&编辑项目.md","查看项目-列表.md","查看项目-基础信息.md"],"财务管理":["Feature01退款单"],"财务管理/Feature01退款单":["Story_01_发起退款.md","Story_02_ 查询退款单.md","Story_03_退款单操作.md","全局说明.md","场景.md"],"计划管理":["产能管理","全球补货规则","变更说明.md","智能补货","计算结果"],"计划管理/智能补货":["补货需求说明1232.md"],"计划管理/计算结果":["计算逻辑.md","平台仓补货结果.md","三方仓补货结果.md"],"资源文件夹":["图片"],"资源文件夹/图片":["eb2ade79001b54a1c752d9d4536d7aba.png","Pasted image 20260603111300.png","Pasted image 20260605191441.png","Pasted image 20260609142439.png","Pasted image 20260609142452.png","Pasted image 20260609142456.png"],"模板文件":["000需求规范.md","产品愿景与目标.md","目标用户与角色定义.md"],"品质管理":["质检用例需求"],"品质管理/质检用例需求":["质检用例全局说明.md","查看列表&筛选项.md","创建质检用例.md","操作说明.md"]};
      let s = a.slug;
      if (s.endsWith("/index")) s = s.slice(0, -6);
      const i = s.lastIndexOf("/");
      const p = i >= 0 ? s.slice(0, i) : "";
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
