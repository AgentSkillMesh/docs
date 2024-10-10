---
syncSource: VibeAgent MetaRepo spec/
doNotEdit: 璇蜂慨鏀?MetaRepo spec/ 鍚庨噸鏂拌繍琛?scripts/sync-spec-to-docs.ps1
---

> **瑙勮寖婧愭枃浠?*锛氱敱 MetaRepo `spec/` 鍚屾锛岃鍕跨洿鎺ョ紪杈戞湰椤点€?
# 钱包 App 规格（纯粹钱包 · React Native）

**版本**: v0.2-draft  
**仓库**: `repos/wallet` → `AgentSkillMesh/wallet`（私有）

---

## 1. 定位

**轻量非托管钱包**，面向 **发单方、持币用户、轻量 Creator**：

| 能力 | 说明 |
|------|------|
| **币交易** | 转账、收款、历史记录（ETH / USDC） |
| **查看收益** | Escrow 入账、任务支出、协议费明细 |
| **发布任务** | 创建任务草稿 → 确认清单 → 提交审批 → 跟踪状态 |

**不包含**：接单大厅、拍照交付、社交平台自动化 — 见 [WORKER.md](./WORKER.md)。

## 2. 与综合端分工

| | wallet（本 App） | worker |
|--|------------------|--------|
| 用户 | 付钱发任务的人 | 接单赚钱的人 |
| 发布 | ✅ | ❌ |
| 接单 | ❌ | ✅ |
| 转账 | ✅ | 收款为主 |

## 3. 功能需求

### FR-WLT-001 钱包账户
- 助记词 / WalletConnect  
- 多链余额（Base 优先）  
- 生物识别解锁  

### FR-WLT-002 转账交易
- 扫码/地址转账  
- Gas 估算  
- 交易状态跟踪  

### FR-WLT-003 收益与账单
- Escrow 收入/支出流水  
- 按任务 ID 聚合  
- 导出（v0.4）  

### FR-WLT-004 发布任务
- 选择任务类型：`human` | `social`（社交类标记高风险）  
- 模板表单 + 报酬 + 截止时间  
- **发单方确认清单**（见 [TASK_GOVERNANCE.md](./TASK_GOVERNANCE.md)）  
- 提交 → `pending_review` → 展示审批状态  
- `published` 后显示接单进度（只读）  

### FR-WLT-005 通知
- 审批通过/驳回、Escrow 锁定、任务完成结算  

### FR-WLT-006 买币（Onramp）
- 「买币」入口 → 第三方 Widget（MoonPay / Stripe Crypto Onramp）  
- crypto 直达 **用户钱包地址**；平台不碰法币/KYC  
- 见 [ONRAMP.md](./ONRAMP.md)

### FR-WLT-007 跨链充值
- Phase 1：deep link [Base Bridge](https://bridge.base.org)（Ethereum ↔ Base）  
- Phase 2（v0.7）：Agent L2 **原生桥** 存取款 UI  
- 见 [BRIDGE.md](./BRIDGE.md)

## 4. 技术栈

React Native · Expo · expo-router · viem · Biome · 依赖 `api` 任务治理接口。

## 5. 里程碑

| 版本 | 交付 |
|------|------|
| v0.3 | 钱包 + 发任务 + 审批状态查询 + **买币 Onramp** + Base 桥引导 |
| v0.4 | WalletConnect、账单导出、Transak/Alchemy Pay |
| v0.7 | Agent L2 原生桥 UI + 入金向导 |

---

*原 v0.1「wallet=接单」描述已迁移至 WORKER.md。*

