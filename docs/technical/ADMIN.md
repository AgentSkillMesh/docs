---
syncSource: VibeAgent MetaRepo spec/
doNotEdit: 璇蜂慨鏀?MetaRepo spec/ 鍚庨噸鏂拌繍琛?scripts/sync-spec-to-docs.ps1
---

> **瑙勮寖婧愭枃浠?*锛氱敱 MetaRepo `spec/` 鍚屾锛岃鍕跨洿鎺ョ紪杈戞湰椤点€?
# 管理平台规格

**版本**: v0.1-draft  
**仓库**: `repos/admin` → `AgentSkillMesh/admin`（私有）

---

## 1. 定位

**平台运营后台**（Web），对全平台 **任务订单** 进行治理：

| 能力 | 说明 |
|------|------|
| **订单总览** | 全状态筛选、搜索、导出 |
| **审批发布** | L2 复杂任务人工通过/驳回 |
| **自动审批监控** | L0/L1 规则命中日志、异常回放 |
| **风控告警** | L3 危险任务红色队列、实时刷新 |
| **争议仲裁** | Escrow 争议工单（v0.4） |
| **参数配置** | 自动审批阈值、敏感词、模板白名单 |

用户：**平台运营、风控、客服**（RBAC，非普通 C 端用户）。

## 2. 功能需求

### FR-ADM-001 登录与权限
- 运营账号 + 2FA（v0.4）  
- 角色：`viewer` | `reviewer` | `risk` | `admin`  

### FR-ADM-002 任务列表
- 列：ID、类型、发单方、金额、风险分、状态、创建时间  
- 筛选：`pending_review` | `published` | `rejected` | 告警中  

### FR-ADM-003 审批工作台
- 任务详情：描述、附件、发单方历史、风控命中规则  
- 操作：通过（→ `published` + 触发 Escrow 绑定）、驳回、要求修改  
- 批量通过（仅 L1 且符合规则，可选）  

### FR-ADM-004 自动审批监控
- 展示规则引擎决策日志  
- L0/L1 通过率、误放抽检标记  

### FR-ADM-005 危险任务告警
- 实时列表（WebSocket 或轮询）  
- 级别：高 / 中  
- 操作：拦截、升级人工、加入黑名单  

### FR-ADM-006 仪表盘
- 今日发布/完成/GMV、待审数量、告警数  

## 3. 技术栈

| 项 | 选型 |
|----|------|
| 框架 | React 19 + **Rsbuild** + Ant Design 5 |
| 状态 | TanStack Query + Zustand |
| 鉴权 | JWT / SIWE（运营钱包可选） |
| 规范 | Biome |
| API | `api` 模块 `/admin/*` |

与 `web` DApp 分离：**web** 面向链上 Creator，**admin** 面向平台内部。

## 4. 依赖

```
admin → api（admin 模块）
api → contracts（索引）
admin → shared（类型）
```

## 5. 里程碑

| 版本 | 交付 |
|------|------|
| v0.3 | 登录、待审列表、单条审批、告警列表 |
| v0.4 | 仪表盘、批量操作、Webhook 告警 |
| v1.0 | 完整 RBAC + 审计日志 |

## 6. 验收

- [ ] `pending_review` 任务可在后台通过并出现在 worker 列表  
- [ ] L3 告警任务默认不在 worker 可见  
- [ ] 驳回任务发单方 wallet 可见原因  

---

*审批规则见 [TASK_GOVERNANCE.md](./TASK_GOVERNANCE.md)。*

