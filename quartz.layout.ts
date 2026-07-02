import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [Component.CollapsibleHeadings(), Component.ImageZoom()],
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
                  const FO = {"/":["产品开发","产品研发","品质管理","供应链","物流管理","计划管理","财务管理","审批中心","三方仓","Project","资源文件夹"],"产品研发":["加工厂变更单","模具管理"],"产品研发/加工厂变更单":["查看加工厂变更单"],"产品研发/模具管理":["删除模具","变更加工厂","导出列表","操作日志","新建编辑模具","查看模具"],"产品开发":["财年目标看板","项目管理","样品需求管理"],"产品开发/项目管理":["全局说明","删除项目","变更项目","启动项目","导出项目","废弃项目","新建&编辑项目","查看项目-列表","查看项目-基础信息"],"品质管理":["质检单","质检异常跟进单","样品评估管理","质检用例","质检标准需求"],"计划管理":["变更说明","全球补货规则","产能管理","智能补货","计算结果"],"计划管理/智能补货":["补货需求说明1232"],"计划管理/计算结果":["三方仓补货结果","平台仓补货结果","计算逻辑"],"财务管理":["公司主体","请款池","请款单","退款单"],"资源文件夹":["模板文件","图片","草稿"],"资源文件夹/图片":["Pasted image 20260702105159","Pasted image 20260702105147","Pasted image 20260630152215","Pasted image 20260630151921","Pasted image 20260630150455","Pasted image 20260630150202","Pasted image 20260630114729","Pasted image 20260630111216","Pasted image 20260630111145","Pasted image 20260630110659","Pasted image 20260630110646","Pasted image 20260630105429","594540e1bbdb7e8948f6af3596ba156f","Pasted image 20260626161037","Pasted image 20260625140454","Pasted image 20260625140439","Pasted image 20260624173531","Pasted image 20260624173520","Pasted image 20260624140611","Pasted image 20260623175301","Pasted image 20260623163306","Pasted image 20260623145148","Pasted image 20260623145018","Pasted image 20260623144918","Pasted image 20260623144719","Pasted image 20260623144543","Pasted image 20260623144506","Pasted image 20260623144503","Pasted image 20260623144414","Pasted image 20260623144411","Pasted image 20260623135227","Pasted image 20260623134822","Pasted image 20260623103841","Pasted image 20260622210317","Pasted image 20260622105418","Pasted image 20260622105325","Pasted image 20260622104523","82205b69e21d7072bc21cb7680771d6f","Pasted image 20260618193651","Pasted image 20260618161054","Pasted image 20260603111300","Pasted image 20260605191441","Pasted image 20260609142439","Pasted image 20260609142452","Pasted image 20260609142456"],"产品开发/样品需求管理":["样品需求管理全局说明","样品需求管理变更记录","样品需求 — 创建","样品需求 — 列表","样品需求 — 操作","样品需求 — 批量操作","样品需求 — 导出"],"品质管理/质检用例":["变更记录","查看列表","新建&编辑 质检用例","导入质检用例","删除质检用例"],"品质管理/质检标准需求":["质检用例全局说明","变更记录","新品项目创建质检用例","变更项目自动创建质检用例","查看质检标准需求列表&筛选项","新品项目-质检标准事件开始","提交质检标准需求","完善质检标准需求","批量操作-QE分配"],"品质管理/质检标准需求/变更记录":["质检标准需求1.0.1"],"品质管理/质检用例/变更记录":["质检用例变更记录"],"品质管理/样品评估管理":["样品评估需求全局说明","样品评估需求变更记录","样品评估-创建","查看列表","提交样品评估","审核","复核","导出列表","打印"],"产品开发/样品需求管理/样品需求-—-创建":["手动新建样品需求","自动创建T0样品需求","自动创建手板样需求","自动创建试模T0样品需求","自动新建变更样品需求","自动新建T1样品需求"],"产品开发/样品需求管理/样品需求-—-列表":["查看样品需求列表"],"产品开发/样品需求管理/样品需求-—-批量操作":["打样、到样、初样确认","分配打样负责人"],"产品开发/样品需求管理/样品需求-—-导出":["列表导出","打样附件下载"],"产品开发/样品需求管理/样品需求-—-操作":["打样","到样","初样确认","签样","废弃样品需求"],"财务管理/退款单":["全局说明","退款单变更记录","新建退款单","查询退款单","审批&撤回审批","确认退款","删除退款单","废弃退款单"],"财务管理/请款池":["请款池变更记录","预付单","采购单","费用单","模具采购单","头程发货单","调度单"],"财务管理/请款单":["发起请款单退款"],"财务管理/请款池/预付单":["发起预付单退款","查看预付单列表"],"Project":["V1.10.0","v1.11.0"],"Project/v1.11.0":["ERP-10010","供应商质量跟进","0181三方仓费用","0182三方仓库核对"],"Project/V1.10.0":["0196","0184","0194","0185","0181","0186","采购退款单","手板&T0样&模具T0&竞品样品线上化"],"财务管理/请款池/头程发货单":["头程发货单"],"财务管理/请款池/采购单":["发起采购应付单退款","创建采购应付单（待补充）","采购单"],"财务管理/请款池/调度单":["调度单"],"物流管理":["头程发货单"],"物流管理/头程发货单":["头程发货单 - 流程操作","提货"],"财务管理/请款池/费用单":["发起费用单退款"],"财务管理/公司主体":["查看公司主体列表","新建、编辑公司主体"],"资源文件夹/模板文件":["000需求调研模板","001需求规范","002需求优先级评估模版","003调研问题知识库"],"资源文件夹/草稿":["未命名","系统标签体系搭建","仓库提货单","ERP-10012","发货单发巴西的付款"],"产品开发/财年目标看板":["导入更新","查看详情","查看列表"],"品质管理/质检单":["导出验货异常跟进表","导出排期日志","全局说明","查看列表","质检单-流程操作","质检单-维护操作"],"品质管理/质检单/质检单-流程操作":["质检","审批","提交评估意见","废弃"],"审批中心":["质检单审批页"],"品质管理/质检单/质检单-维护操作":["质检方式调整","修改质检排期","QE分配","QA分配"]};;
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
  right: [Component.TableOfContents({ layout: "legacy" })],
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
        const FO = {"/":["产品开发","产品研发","品质管理","供应链","物流管理","计划管理","财务管理","审批中心","三方仓","Project","资源文件夹"],"产品研发":["加工厂变更单","模具管理"],"产品研发/加工厂变更单":["查看加工厂变更单"],"产品研发/模具管理":["删除模具","变更加工厂","导出列表","操作日志","新建编辑模具","查看模具"],"产品开发":["财年目标看板","项目管理","样品需求管理"],"产品开发/项目管理":["全局说明","删除项目","变更项目","启动项目","导出项目","废弃项目","新建&编辑项目","查看项目-列表","查看项目-基础信息"],"品质管理":["质检单","质检异常跟进单","样品评估管理","质检用例","质检标准需求"],"计划管理":["变更说明","全球补货规则","产能管理","智能补货","计算结果"],"计划管理/智能补货":["补货需求说明1232"],"计划管理/计算结果":["三方仓补货结果","平台仓补货结果","计算逻辑"],"财务管理":["公司主体","请款池","请款单","退款单"],"资源文件夹":["模板文件","图片","草稿"],"资源文件夹/图片":["Pasted image 20260702105159","Pasted image 20260702105147","Pasted image 20260630152215","Pasted image 20260630151921","Pasted image 20260630150455","Pasted image 20260630150202","Pasted image 20260630114729","Pasted image 20260630111216","Pasted image 20260630111145","Pasted image 20260630110659","Pasted image 20260630110646","Pasted image 20260630105429","594540e1bbdb7e8948f6af3596ba156f","Pasted image 20260626161037","Pasted image 20260625140454","Pasted image 20260625140439","Pasted image 20260624173531","Pasted image 20260624173520","Pasted image 20260624140611","Pasted image 20260623175301","Pasted image 20260623163306","Pasted image 20260623145148","Pasted image 20260623145018","Pasted image 20260623144918","Pasted image 20260623144719","Pasted image 20260623144543","Pasted image 20260623144506","Pasted image 20260623144503","Pasted image 20260623144414","Pasted image 20260623144411","Pasted image 20260623135227","Pasted image 20260623134822","Pasted image 20260623103841","Pasted image 20260622210317","Pasted image 20260622105418","Pasted image 20260622105325","Pasted image 20260622104523","82205b69e21d7072bc21cb7680771d6f","Pasted image 20260618193651","Pasted image 20260618161054","Pasted image 20260603111300","Pasted image 20260605191441","Pasted image 20260609142439","Pasted image 20260609142452","Pasted image 20260609142456"],"产品开发/样品需求管理":["样品需求管理全局说明","样品需求管理变更记录","样品需求 — 创建","样品需求 — 列表","样品需求 — 操作","样品需求 — 批量操作","样品需求 — 导出"],"品质管理/质检用例":["变更记录","查看列表","新建&编辑 质检用例","导入质检用例","删除质检用例"],"品质管理/质检标准需求":["质检用例全局说明","变更记录","新品项目创建质检用例","变更项目自动创建质检用例","查看质检标准需求列表&筛选项","新品项目-质检标准事件开始","提交质检标准需求","完善质检标准需求","批量操作-QE分配"],"品质管理/质检标准需求/变更记录":["质检标准需求1.0.1"],"品质管理/质检用例/变更记录":["质检用例变更记录"],"品质管理/样品评估管理":["样品评估需求全局说明","样品评估需求变更记录","样品评估-创建","查看列表","提交样品评估","审核","复核","导出列表","打印"],"产品开发/样品需求管理/样品需求-—-创建":["手动新建样品需求","自动创建T0样品需求","自动创建手板样需求","自动创建试模T0样品需求","自动新建变更样品需求","自动新建T1样品需求"],"产品开发/样品需求管理/样品需求-—-列表":["查看样品需求列表"],"产品开发/样品需求管理/样品需求-—-批量操作":["打样、到样、初样确认","分配打样负责人"],"产品开发/样品需求管理/样品需求-—-导出":["列表导出","打样附件下载"],"产品开发/样品需求管理/样品需求-—-操作":["打样","到样","初样确认","签样","废弃样品需求"],"财务管理/退款单":["全局说明","退款单变更记录","新建退款单","查询退款单","审批&撤回审批","确认退款","删除退款单","废弃退款单"],"财务管理/请款池":["请款池变更记录","预付单","采购单","费用单","模具采购单","头程发货单","调度单"],"财务管理/请款单":["发起请款单退款"],"财务管理/请款池/预付单":["发起预付单退款","查看预付单列表"],"Project":["V1.10.0","v1.11.0"],"Project/v1.11.0":["ERP-10010","供应商质量跟进","0181三方仓费用","0182三方仓库核对"],"Project/V1.10.0":["0196","0184","0194","0185","0181","0186","采购退款单","手板&T0样&模具T0&竞品样品线上化"],"财务管理/请款池/头程发货单":["头程发货单"],"财务管理/请款池/采购单":["发起采购应付单退款","创建采购应付单（待补充）","采购单"],"财务管理/请款池/调度单":["调度单"],"物流管理":["头程发货单"],"物流管理/头程发货单":["头程发货单 - 流程操作","提货"],"财务管理/请款池/费用单":["发起费用单退款"],"财务管理/公司主体":["查看公司主体列表","新建、编辑公司主体"],"资源文件夹/模板文件":["000需求调研模板","001需求规范","002需求优先级评估模版","003调研问题知识库"],"资源文件夹/草稿":["未命名","系统标签体系搭建","仓库提货单","ERP-10012","发货单发巴西的付款"],"产品开发/财年目标看板":["导入更新","查看详情","查看列表"],"品质管理/质检单":["导出验货异常跟进表","导出排期日志","全局说明","查看列表","质检单-流程操作","质检单-维护操作"],"品质管理/质检单/质检单-流程操作":["质检","审批","提交评估意见","废弃"],"审批中心":["质检单审批页"],"品质管理/质检单/质检单-维护操作":["质检方式调整","修改质检排期","QE分配","QA分配"]};
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
  right: [Component.TableOfContents({ layout: "legacy" })],
}
