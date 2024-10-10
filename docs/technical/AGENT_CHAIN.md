---
syncSource: VibeAgent MetaRepo spec/
doNotEdit: 璇蜂慨鏀?MetaRepo spec/ 鍚庨噸鏂拌繍琛?scripts/sync-spec-to-docs.ps1
---

> **瑙勮寖婧愭枃浠?*锛氱敱 MetaRepo `spec/` 鍚屾锛岃鍕跨洿鎺ョ紪杈戞湰椤点€?
# Agent 专用链经济与渐进式去中心化

**版本**: v0.1-draft · **最后更新**: 2026-06-04  
**路线图**: v0.7 Alpha Chain（见 [ROADMAP.md](./ROADMAP.md)）

## 1. 背景与挑战

Agent 交易特征：**高频、微额、自动化、对 Gas 极度敏感**。

小团队既要：

- 给 Agent **极低手续费** 吸引流量（尤其 IoT 数据微市场，见 [IOT.md](./IOT.md)）  
- **保留平台控制权**与可持续盈利  
- 支持未来 **渐进式去中心化**（Progressive Decentralization）
- **拒绝联盟链**；高频路径走 **异步支付**（见 [ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md)）

## 2. 战略：从「代币买流动性」→「交易费养生态」

| 阶段 | 流动性来源 | 平台收入 |
|------|------------|----------|
| 早期 | 产品体验 + SDK 模板 + 低 Gas | Sequencer 控制的链上 Gas + 市场抽成 |
| 中期 | 开发者躺赚模版、设备入网 | 微额累加 + 企业契约费 |
| 后期 | DAO 治理费率、多 Sequencer | 协议国库 + 验证者经济 |

## 3. 架构：MasterChef + UUPS

### 3.1 合约层

| 组件 | 模式 | 作用 |
|------|------|------|
| **MasterChef** | 可配置激励池 | Agent/开发者/设备质押与分成；路由协议费分配 |
| **业务合约** | **UUPS** 可升级代理 | Escrow、IoT 市场、费率模块可升级，保留治理闸口 |
| **FeeModule** | 链上 | 与 [FEE_TIERS_AA.md](./FEE_TIERS_AA.md) AA 等级联动 |

团队早期通过 **Proxy Admin / Timelock** 掌握升级权；路线图后期移交 DAO。

### 3.2 链层（自建 L2/L3）

| 能力 | 早期（v0.7） | 说明 |
|------|--------------|------|
| **Sequencer** | 团队运营 | 排序、打包权；链上交易顺序可控 |
| **原生 Gas** | 极低（目标 ~$0.0001/笔） | 满足 Agent 高频微额 |
| **结算** | 定期锚定 L1 | 标准 Rollup 安全模型 |
| **原生桥** | OP Stack Standard Bridge | L1 锁 → L2 mint；见 [BRIDGE.md](./BRIDGE.md) |
| **Canonical 资产** | USDC / USDT / PYUSD / WETH | 桥接映射；Escrow/MetaDEX 白名单 |

**非目标（v0.7）**：完全去中心化 Sequencer；主网前须披露中心化风险与迁移计划。

## 4. 费率与盈利

| 来源 | 说明 |
|------|------|
| **L2 Gas** | 每笔交易原生费用 → 团队/国库钱包 |
| **市场抽成** | Escrow、数据流、能源、物流契约协议费（bps） |
| **AA Paymaster** | 可为高等级账户补贴 Gas，差额由协议费覆盖 |

微额场景：单笔极低，但 **QPS × 设备数** 形成规模收入。

链上 Gas 仅用于 **批量清算批次**；单笔微支付在链下 Receipt 完成（[ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md)）。

## 5. 开发者：开源 Agent 交易模板

**目标**：AI 开发者懂 Python/大模型，不一定懂 Solidity。

| 交付 | 说明 |
|------|------|
| **Agent Trading SDK** | Python/TS：发现任务、报价、签单、回调 |
| **合约模板** | 一键部署 Escrow/订阅计费包装 |
| **CLI / Cursor Skill** | 本地跑 Agent 即可接入测试网赚钱 |

App（wallet/worker）与 **纯 SDK 接入** 并列——同一协议、同一结算层。

## 6. 渐进式去中心化路线

```
v0.7  团队 Sequencer + UUPS 升级权 + MasterChef 激励
  ↓
v0.8  费率/参数 DAO 提案；多签 → Timelock
  ↓
v1.0  安全审计；可选外部 Sequencer 席位拍卖
  ↓
v1.x  链上治理扩大；团队仅保留紧急暂停多签
```

## 7. 需求 ID（追溯）

| ID | 简述 | 目标版本 |
|----|------|----------|
| FR-CHAIN-001 | 超低 Gas L2 测试网 | v0.7 |
| FR-CHAIN-002 | MasterChef 激励分配 | v0.7 |
| FR-CHAIN-003 | UUPS 可升级 Escrow/费率 | v0.7 |
| FR-CHAIN-004 | 团队 Sequencer 运维 | v0.7 |
| FR-CHAIN-005 | Agent Trading SDK 模板 | v0.7 |
| FR-CHAIN-006 | DAO 费率治理 | v1.0 |
| FR-BRIDGE-002~005 | 原生桥部署与 UI | v0.7（见 [BRIDGE.md](./BRIDGE.md)） |
| FR-PAY-008 | Bundler 微支付批次 | v0.7（见 [ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md)） |

## 8. 风险披露

- 早期 Sequencer 中心化 → 需白皮书与 docs 明确  
- 微额支付与监管：按司法辖区合规设计（数据、支付牌照）  
- UUPS 升级权滥用 → Timelock + 审计 + 社区监督  

---

*与 [ECOSYSTEM.md](./ECOSYSTEM.md)、[IOT.md](./IOT.md) 配套阅读。*

