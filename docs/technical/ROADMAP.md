---
syncSource: VibeAgent MetaRepo spec/
doNotEdit: 请修改 MetaRepo spec/ 后重新运行 scripts/sync-spec-to-docs.sh
---

> **规范源文件**：由 MetaRepo `spec/` 同步，请勿直接编辑本页。

# DoerFlow 版本规划与里程碑

**最后更新**: 2026-08-29  
**关联**: [ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md) · [CLIENTS.md](./CLIENTS.md) · [SPEC.md](./SPEC.md)

---

## 1. 商业路径（到 v1.0 的主线）

集中精力按下列顺序交付；**未列入主线的能力不阻塞商业版上线**。

```
M0–M1 基础已齐
      │
      ▼
M2  v0.2  链下账本 + Merkle 批量结算     ← 实验室验收通过（2026-08-25）
      │
      ▼
M3  v0.3  客户端完善：wallet · worker · admin · web     ← 当前主焦点
      │
      ▼
M4  v0.4  赚钱场景：Agent/云 SDK·API · 人类发单接单闭环
      │
      ▼
M5  v1.0  商业版本上线（主网 / 生产就绪）
```

| 阶段 | 版本 | 一句话目标 |
|------|------|------------|
| **M2** | v0.2 | Vault + 链下记账引擎 + Merkle Root 上链 + 强制提现 |
| **M3** | v0.3 | 发单 / 接单 / 运营审核客户端可日常使用 |
| **M4** | v0.4 | 云与 Agent 可 SDK/API 接入；人类可发任务赚钱 |
| **M5** | **v1.0** | 审计 + 主网 + 生产运维，对外商业发布 |

**铁律**：

1. **先清算底座，再客户端，再场景，最后商业发版。**  
2. 高频路径必须走 [ASYNC_PAYMENTS](./ASYNC_PAYMENTS.md)（链下账本 + Merkle）；**不做** 定制 L3 作前置。  
3. MetaDEX / IoT 车桩 / 能源冷链 / 完整 P2P / Omnichain → **1.0 后或并行支线**，不占用主线关键路径。

---

## 2. 版本策略

采用 **SemVer**：

| 层级 | 命名 | 说明 |
|------|------|------|
| **Protocol / Platform** | v0.x → **v1.0** | 合约 + api + 客户端一体里程碑 |
| **MetaRepo** | workspace | 工具链与编排 |

---

## 3. 里程碑详情

### M0 — 项目启动 ✅

脚手架、文档、本地 SQLite 开发环境、Hardhat 初始化。

---

### M1 — v0.1 MVP「身份与交易」🟡

**主题**: Agent 铸造 → Skill 注册 → Escrow 结算最小闭环（已基本达成）

| 域 | 状态摘要 |
|----|----------|
| 合约 | AgentNFT / SkillRegistry / Escrow / SessionKeyRegistry → Base Sepolia ✅ |
| api | NestJS **Fastify** 索引、SIWE、任务治理 API MVP+ |
| web | 市场（可雇佣 Agent + Skill 列表搜索）/ 工作台 waitMined / 任务中心闭环 + 人类任务只读 |
| 客户端 | wallet 发任务 / worker 列表 / admin 审批（MVP 级） |

**Base Sepolia（84532 · 2025-01-08）**:

| 合约 | 地址 |
|------|------|
| AgentNFT | `0xe5C76a46b273418D814e9b98d057c7Ab1c615A9F` |
| SkillRegistry | `0x120cF4c31f2503A2145C9A5D87B4647a9c4c32B4` |
| Escrow | `0x1bB2364fFeA1D747aC41e8A92A2fC78BfE423f50` |
| SessionKeyRegistry | `0xF35E657DD8a57256694666331b5875D7A1B4FF0A` |

**验收**: 双钱包完成铸造 → Escrow → 交付 → 结算。

---

### M2 — v0.2「链下账本 + Merkle 结算」✅

**主题**: 把 A2A / API 高频微支付从「每笔上链幻想」落到可上线的清算底座  
**规范**: [ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md) · FR-PAY-006 / 012 / 013

| 模块 | 交付 | 状态（2026-08-25） |
|------|------|-------------------|
| **contracts** | `PaymentVault` 充提；`MicroPaymentSettler` commitRoot + forceWithdraw | ✅ Hardhat 任意账户 `forceWithdraw`（含奇数叶）；**Base Sepolia 已部署**（未重部） |
| **api** | 链下记账；Receipt 验签；周期快照与 Root；披露 | ✅ Fastify；`credit-batch` ≤1 万；**10 万笔 → 1 Root**（memory 实验室）；`POST /ledger/snapshot` 用 PaymentServiceGuard；PG + BullMQ 仍可选 |
| **shared** | EIP-712 Receipt；`buildBalanceMerkle` / proof 工具 | ✅ Merkle leaf 与合约对齐 + 单测（含 256 叶任意下标） |
| **链** | Base Sepolia → Base Mainnet 准备 | 🟡 Vault Sepolia ✅；主网仍属 M5 |
| **披露** | `/payments/disclosure` | ✅ latestEpoch / forceWithdraw / `m2Acceptance` |

**已有可复用**: Receipt Vault PoC、Session Key 合约（M1）。

**Base Sepolia Vault（84532 · 2025-01-13）**:

| 合约 | 地址 |
|------|------|
| Mock USDC（Vault asset） | `0x3d8893Ab039e32330a6e80F4baed34EC194f603F` |
| PaymentVault | `0xcce2aeeA7e46941eaFC62c4d8f02D357B75AcdBc` |
| MicroPaymentSettler | `0x20fC7000eb52ef53980E00F12AA64df941f1042C` |

**验收**（实验室，2026-08-25）:

> 1 万笔/分链下记账零单笔链上 tx；模拟 ≥10 万笔 → **1 笔 Root**；任意账户可用 Merkle 证明从 Vault **强制提现**。

| 条 | 证据 |
|----|------|
| 1 万笔/分、零链上 tx | `memory-ledger.m2-acceptance.spec.ts` / `creditMany`（无 RPC） |
| ≥10 万笔 → 1 Root | 10×`credit-batch`(1 万) 后一次 `snapshot()`，`leafCount=100000`，单一 `root` |
| 强制提现 | `PaymentVault.t.ts`：奇数叶 + 10 个存款人同一 Root，下标 0/4/9 `forceWithdraw` |

未纳入本验收（不阻塞 M2 关闭）：`LEDGER_STORE=postgres` 作为默认、Sepolia 再发一笔真实 `commitRoot`/`forceWithdraw`、FR-PAY-007 轧差、主网。

**预计工期**: 8–10 周（实验室验收已完成）  
**依赖**: M1 核心合约与 api 支付模块骨架  

---

### M3 — v0.3「客户端完善」🟡

**主题**: 在清算底座之上，把日常使用的客户端做完整  
**规范**: [WALLET.md](./WALLET.md) · [WORKER.md](./WORKER.md) · [ADMIN.md](./ADMIN.md) · [CLIENTS.md](./CLIENTS.md)

| 客户端 | 交付 | 状态 |
|--------|------|------|
| **wallet** | 发任务 UX 完整；转账 / 收益流水；Vault 充提；Onramp 买币；官方桥入金引导 | 🟡 transfer · vault · onramp · session · Escrow fund/release · **SIWE 任务写** · **dispute / refundTimedOut** · 驳回/修改 · **`submitted` 验收** · **发单说明 / 线下地点** · **客户端 en+zh** |
| **worker** | 众包接单 / 交付 / 收款闭环；**社交任务（清单+截图）要做**；任务仅展示 `published` | 🟡 **Expo 大厅 + accept + deliverEscrow** · **相机/GPS/问卷 + proofCid** · **社交 Tab / 打开目标首页 / 清单 / 截图** · published 门禁 · Vault · 账本余额 · **收益页原生 ETH** · escrowId · **open dispute** · **en+zh** · **Sepolia 独立 demo 钥（非 Hardhat #1）** |
| **admin** | 审批队列、L0–L3 风控、告警、费率与支付运维只读面板 | 🟡 review · **batch-approve** · auto-approval · tasks · **社交 App/步骤回显** · governance · publishers · audit · disputes · alerts · **仪表盘真实 GMV + 待审队列** · commits · fees · **CORS :13011** · **en+zh-CN locale** |
| **web** | Creator 工作台与市场体验 hardening；与 Vault / Escrow 状态一致 | 🟡 `/payments` Vault + fees；Escrow UX；测试网 gas 引导；**公开市场（无需平台登录）**；`use:sepolia` / `use:localhost` 链配置切换 · **en+zh locale** |
| **api** | 任务治理与客户端 API 稳定；推送 / WebSocket 通知（按需） | 🟡 治理 · publishers flag · onChainEscrowId · 预留 · ledger · fees · auto-decisions；Indexer 分片 + **链头窗口**；health 含 indexer 游标；链 profile 与 web/wallet/worker 对齐；**`deliver` → `submitted`**；**`pnpm run smoke:m3`**（链下）· **`pnpm run smoke:escrow`**（Sepolia 真锁仓） |

**验收**:

> 发单方仅用 wallet、接单方仅用 worker、运营仅用 admin，可在测试网完成「发布 → 审批 → 接单 → 交付 → 放款」全流程，无需运维手工改库。

**前期不做**：面向听障、视障、言语障碍等特殊人群的残障无障碍（读屏 / 字幕 / WCAG）。**社交任务本身是 M3 交付**（清单+截图）。Android Accessibility Service 打开目标 App 为 v0.4 可选项，与残障无障碍不是同一件事。

**预计工期**: 8–10 周  
**依赖**: M2 Vault/账本可用（充提与余额展示）  

---

### M4 — v0.4「赚钱场景落地」⚪

**主题**: 把文档里的赚钱方式做成可接入、可交易的产品能力

| 场景 | 交付 |
|------|------|
| **Agent / 云服务接入** | Agent Trading SDK（Python/TS）：发现、报价、`signReceipt`、接单回调；对外 REST/WebSocket API |
| **Skill / 企业 API** | Skill 注册定价 → 调用计费走账本或 Escrow；企业回调网关文档 |
| **人类发单** | wallet 任务发布（Agent 受众 + 人类受众）生产可用；确认清单与治理强制生效 |
| **人类接单赚钱** | worker 众包闭环稳定；凭证与 Escrow/放款一致 |
| **（可选同里程碑）** | Device Node 最小注册与心跳；不阻塞 1.0 若进度不足可延后 |

**验收**:

> ① 第三方用 SDK 在无 App 情况下完成至少一笔链下微支付记账并参与一次 Merkle 清算；  
> ② 人类用户完成「发单 → 审批 → 接单 → 结算」；  
> ③ 公开开发者文档可按步骤复现。

**预计工期**: 8–12 周  
**依赖**: M2 + M3  

---

### M5 — v1.0「商业版本上线」⚪

**主题**: 生产就绪与对外商业发布（主线终点）

> **不能用 Creator DApp 迭代代替。** 下列交付依赖 M2–M4 验收、密钥/主网资金、外部审计与 SRE，单次编码无法完成。

| 域 | 交付 |
|----|------|
| **安全** | 外部审计（Vault / Settler / Escrow 优先）；Bug Bounty 启动 |
| **主网** | Base Mainnet（及规划中的 Arbitrum）合约部署；生产 Indexer / 账本 / 高可用 |
| **运维** | 监控告警、备份、Root 提交值班、强制提现演练 |
| **产品** | wallet / worker / admin / web 生产构建；合规披露（Onramp、风险） |
| **生态** | SDK + API 正式文档；ABI / 部署地址发布 |

**验收**:

> 主网可完成：Vault 充值 → 链下微支付 → Root 清算 → 提现；以及人类任务 Escrow 全流程；审计报告公开；达到对外宣布 **商业版 1.0** 的标准。

**预计工期**: 8–10 周  
**依赖**: M2–M4 验收通过  

---

## 4. 支线与 1.0 之后（不阻塞商业发版）

以下能力 **可与主线并行**，但 **不得抢占 M2–M5 关键资源**，除非单独立项。

### 4.1 MetaDEX Lite（支线）

合约优先的 ve DEX（见 [METADEX_CONTRACTS.md](./METADEX_CONTRACTS.md)）。  
**与 1.0 主线解耦**：账本 / 客户端 / 赚钱场景不依赖 MetaDEX 上线。

| 子阶段 | 内容 | 相对主线 |
|--------|------|----------|
| v0.15.0 合约 | Factory / Pair / Router / ve | 可并行 |
| v0.15.1 api | `/dex/*` 读链 | 可并行 |
| v0.15.2 web | Swap / LP / Vote | 可并行 |

### 4.2 v1.0 之后展望

| 版本 | 主题 |
|------|------|
| v1.1 | 完整 P2P Beacon、争议仲裁增强、信誉 |
| v1.2 | IoT 设备收款 / 数据微市场规模化（复用 M2 账本） |
| v1.3 | 能源与冷链 SLA 契约 |
| v1.4 | Omnichain（CCTP / LayerZero）；状态通道 1:1 拓展 |
| v1.x+ | MasterChef / DAO 治理扩大；自建 L2 **仅规模证明后评估** |

---

## 5. 团队与资源倾斜

| 阶段 | 资源重心 |
|------|----------|
| **M2** | 合约结算 + api 账本引擎（实验室已验收） |
| **M3** | 移动端 + admin + 任务治理体验（最高优先级） |
| **M4** | SDK / 对外 API + 场景联调 |
| **M5** | 安全审计 + SRE + 发版 |

建议规模：M2 起 5–8 人；M3–M4 扩至含移动端；M5 加安全与运维。

---

## 6. 风险与缓冲

| 风险 | 影响 | 缓解 |
|------|------|------|
| Merkle / Vault 审计延迟 | M5 推迟 | M2 结束即启动审计预审 |
| 客户端跨端进度不及预期 | M3 拉长 | 先保 wallet 发单 + worker 接单 + admin 审批三角 |
| SDK 生态冷启动 | M4 验收弱 | 先官方示例 Agent + 沙箱水龙头 |
| 过早投入 MetaDEX / IoT / 自建链 | 主线失血 | 支线隔离；定制 L3 不做 |

每个主线里程碑预留 **约 15% 时间缓冲**。

---

## 7. 进度追踪

**当前阶段: M3 — v0.3 客户端完善（主焦点）**

M2 实验室验收已通过（2026-08-25）。M1 Creator DApp 测试网闭环可持续 hardening。顺序仍是 **先清算底座（已验收）→ 客户端 → 场景 → M5 商业 1.0**；继续留在 Base Sepolia 打磨，不进入主网。

| 里程碑 | 版本 | 状态 |
|--------|------|------|
| M0 项目启动 | — | ✅ |
| M1 身份与交易 | v0.1 | 🟡 |
| **M2 链下账本 + Merkle** | **v0.2** | **✅ 实验室验收（10 万笔 → 1 Root · Hardhat 强制提现）** |
| M3 客户端完善 | v0.3 | 🟡 **当前主焦点** |
| M4 赚钱场景落地 | v0.4 | ⚪ |
| **M5 商业版上线** | **v1.0** | ⚪ |
| 支线 MetaDEX | v0.15.x | 🟡 合约进度另计 |
| 支线 IoT / 能源 / Omnichain | v1.1+ | ⚪ |

*状态: ✅ 完成 | 🟡 进行中 | ⚪ 未开始 | 🔴 阻塞*

---

*主线规范入口：[ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md) · [CLIENTS.md](./CLIENTS.md) · [TASK_GOVERNANCE.md](./TASK_GOVERNANCE.md)*
