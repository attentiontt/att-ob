# 产品管理-Modelnumber-系统-自动触发-联动Model No.状态

### 业务规则

当名下 SKU 被禁用、启用或删除时，系统自动重新计算 Model No. 状态。

触发条件：
SKU 状态从「启用」变为「停用」或从「停用」变为「启用」
SKU 被删除，且该 SKU 归属于某个 Model No.

取值逻辑：
【Model No.】取被操作 SKU 归属的 Model No.
【未删除SKU集合】查询该 Model No. 名下所有未删除 SKU
【Model No.状态】当【未删除SKU集合】中任意一条 SKU 为「启用」时更新为「启用」
【Model No.状态】当【未删除SKU集合】中所有 SKU 均为「停用」时更新为「停用」
【Model No.状态】当【未删除SKU集合】为空时取值待确定

### 异常场景

SKU 未归属 Model No.：不触发 Model No. 状态联动
未删除 SKU 集合为空：Model No. 状态是否置为「停用」或保留原状态待确定
存在多个归属关系：是否逐个 Model No. 重新计算待确定
重复触发：同一 SKU 操作只执行一次状态重算，具体幂等规则待确定

### 通过校验后执行

执行1：查询被操作 SKU 归属的 Model No.
执行2：重新计算 Model No. 状态
执行3：更新 Model No. 列表【状态】
执行4：是否记录 Model No. 操作日志待确定

### 不在范围内

SKU 禁用、启用和删除本身的操作规则不在本目录定义
