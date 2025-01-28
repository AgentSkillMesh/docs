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
| **争议仲裁** | Escrow / 平台争议工单（**M3 工单**；链上仲裁 v0.4+） |
| **参数配置** | 自动审批阈值、敏感词、模板白名单 |

用户：**平台运营、风控、客服**（RBAC，非普通 C 端用户）。

## 2. 功能需求

### FR-ADM-001 登录与权限
- 运营账号 + 2FA（v0.4）  
- 角色：`viewer` | `reviewer` | `risk` | `admin`  

### FR-ADM-002 任务列表
- 列：ID、类型、发单方、金额、风险分、状态、创建时间  
- 筛选：`pending_review` | `published` | `rejected` | 告警中  
- **实现（M3）**：`/tasks` ← `GET /admin/tasks`；行内 approve/reject；批量通过待审  

### FR-ADM-003 审批工作台
- 任务详情：描述、附件、发单方历史、风控命中规则  
- 操作：通过（→ `published` + **绑定 Escrow 预留** `escrowId`）、驳回、要求修改（→ `needs_revision`）  
- 批量通过（仅 L1 且符合规则，可选）  
- **实现（M3）**：`/review` → `approve|reject|request-revision`；approve 写入平台 Escrow 预留记录  

### FR-ADM-004 自动审批监控
- 展示规则引擎决策日志  
- L0/L1 通过率、误放抽检标记  
- **实现（M3）**：`/auto-approval` ← `GET /admin/tasks/auto-decisions`（`autoDecision` + 规则回放）  
  - 抽检标记已处理 → `POST .../mark-auto-reviewed`  
  - 升级人工 → `POST .../escalate-auto`（`published` 且未接单 → `pending_review`）  

### FR-ADM-005 危险任务告警
- 实时列表（WebSocket 或轮询）  
- 级别：高 / 中  
- 操作：拦截、升级人工、加入黑名单  
- **实现（M3）**：`/risk-alerts` ← `GET /admin/tasks/alerts`；拦截 → reject；标记已处理 → `POST .../clear-alert`  

### FR-ADM-006 仪表盘
- 今日发布/完成/GMV、待审数量、告警数  
- **实现（M3）**：KPI 条接 `GET /admin/stats/overview`（图表仍可 mock，完整仪表盘 v0.4）  

### FR-ADM-007 支付清算运维（M3）
- 只读面板：`GET /payments/ledger/commits`  
- 列：epoch · status · root · txHash（Basescan）· error · updatedAt  
- 展示账本引擎 / 队列模式（disclosure）  
- 路由：`/payments/commits`  

### FR-ADM-008 费率等级只读（M3）
- 面板：`GET /fees/tiers`（ERC-4337 等级协议费 bps）  
- 路由：`/payments/fees`  
- 与 FEE_TIERS_AA 文档一致；配置写入链上 FeeTierRegistry 见后续版本  

### FR-ADM-009 治理参数（M3）
- 路由：`/governance`  
- `GET|PUT /admin/governance/config`：自动审批 ETH 阈值、硬拒/风控关键词、发单限流、L0–L3 开关  
- 保存后立即作用于新提交任务的规则引擎（不回溯已决策任务）  

### FR-ADM-010 发单方治理（M3）
- 路由：`/publishers` ← `GET /admin/publishers`（任务聚合 + 观察/黑名单）  
- `POST /admin/publishers/flag`：`watchlist` / `blacklist`（持久化于 governance config）  
- 黑名单地址 `POST /tasks` 拒绝（`PUBLISHER_BLACKLISTED`）  

### FR-ADM-011 审计日志（M3）
- 路由：`/audit` ← `GET /admin/audit`  
- 记录：审批通过/驳回/要求修改、清告警、自动决策抽检、治理配置变更、发单方拉黑/观察、争议裁决  
- 支持按 action / 关键词筛选与 CSV 导出  

### FR-ADM-012 争议仲裁工单（M3）
- 路由：`/disputes` ← `GET /admin/disputes`  
- 开单：`POST /tasks/:id/dispute`（发单方 / 接单方 / 运营），状态限于 `assigned|submitted|verifying`  
- 运营：`POST /admin/disputes/:id/claim`（→ reviewing）、`POST /admin/disputes/:id/resolve`  
  - `refund_publisher` → 任务 `cancelled`，平台 Escrow `Refunded`  
  - `release_worker` → 任务 `completed` + 账本结算（链上已锁定则要求已有 `releaseTxHash` 或仅结案标注）  
  - `split` → 按 `splitBps` 账本部分打款后 `completed`  
- 裁决写入审计 `DISPUTE_RESOLVED`  

## 3. 技术栈

| 项 | 选型 |
|----|------|
| 框架 | React 19 + **Next.js** + Ant Design 6 |
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
| v0.3 | 登录、待审列表、单条审批、告警列表、**支付 Commits 运维**、**治理参数**、**任务总览**、**发单方治理**、**审计日志**、**争议工单** |
| v0.4 | 仪表盘、批量操作、Webhook 告警、链上争议结算 |
| v1.0 | 完整 RBAC + 审计留存策略 |

## 6. 验收

- [x] `pending_review` 任务可在后台通过并出现在 worker 列表（API 联调；E2E 冒烟 2025-01-14 ✅）  
- [x] L3 告警任务默认不在 worker 可见（`alertFlag` 过滤；审批通过后清 flag）  
- [x] 驳回任务发单方 wallet 可见原因（`alertReason` → 收益「我发布的任务」）  

---

*审批规则见 [TASK_GOVERNANCE.md](./TASK_GOVERNANCE.md)。*

