---
title: 跨链与资产互通
---

# 跨链互通：现成 L2 官方桥优先

DoerFlow 让用户与 Agent 在链上 **安全持有和使用 USDC、USDT、PYUSD、ETH**，并通过 **现成 L2 官方桥** 与以太坊生态打通。高频微支付走 [链下账本 + Merkle](/platform/async-payments)，**不依赖** 自建应用链。

## 分层策略

| 层级 | 方式 | 说明 |
|------|------|------|
| **P0 · 现成 L2 官方桥** | Base / Arbitrum 等 | **当前主通道**；Vault / Escrow / Merkle 清算落此 |
| **P1 · Canonical 资产** | USDC / USDT / PYUSD / WETH | 官方映射；Escrow、MetaDEX、Vault 仅认白名单 |
| **P2 · Omnichain** | CCTP、LayerZero 等 | **扩展**多链与 Skill 跨链；不替代官方桥 |
| **P3 · 自建链原生桥** | L1 锁 → 自建 L2 mint | **延期**；仅规模证明后评估 |

## 现在（Base / Arbitrum 时代）

部署在 **Base**（以及 Arbitrum 等现成 L2）时，使用各链 **官方桥** 存入 USDC/ETH。

wallet / web 提供 **「跨链充值」** 引导；**不做定制 L3**；不自建 L1 桥合约。

## 自建链（远期可选）

仅当业务规模证明需要时，才评估 OP Stack 等自建 L2 与原生桥——**不是** 微支付主路径的前置条件。详见 [AGENT_CHAIN](/technical/AGENT_CHAIN)。

## Omnichain（后续扩展）

- **Circle CCTP**：USDC 原生 burn/mint 跨链  
- **LayerZero**：Agent **跨链调用 Skill**

高级入口需 **风险披露**；新用户默认走官方桥。

## 技术规格

- [BRIDGE 完整规格](/technical/BRIDGE)  
- [异步支付 / 链下账本](/platform/async-payments)  
- [Onramp 法币入口](/platform/fiat-onramp)
