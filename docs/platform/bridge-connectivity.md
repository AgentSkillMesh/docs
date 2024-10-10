---
title: 跨链与资产互通
---

# 跨链互通：原生桥优先

VibeAgent 让用户与 Agent 在链上 **安全持有和使用 USDC、USDT、PYUSD、ETH**，并通过 **官方原生 Rollup 桥** 与 **以太坊主网** 打通。

## 三层架构

| 层级 | 方式 | 说明 |
|------|------|------|
| **P0 · 原生桥** | L1 锁仓 → L2 铸造 | Agent 链与 Ethereum 的 **主通道**，Rollup 安全模型 |
| **P1 · Canonical 资产** | USDC / USDT / PYUSD / WETH | 官方映射；Escrow、MetaDEX 仅认白名单代币 |
| **P2 · Omnichain** | CCTP、LayerZero 等 | **扩展**多链与 Skill 跨链；不替代原生桥 |

## 现在（Base 时代 · v0.3）

部署在 **Base** 上时，使用 [Base 官方桥](https://bridge.base.org) 从 Ethereum 存入 USDC/ETH。

wallet / web 提供 **「跨链充值」** 引导，无需 VibeAgent 自建 L1 合约。

## Agent 专用链（v0.7）

自建 L2 采用 **OP Stack 标准桥**：

1. 用户在 **Ethereum** 将 ETH 或 USDC 锁入官方桥合约  
2. **Agent L2** 等量 **铸造** WETH / bridged USDC  
3. 提款经标准 **挑战期** 后回到 L1  

## Omnichain（v0.8 / v1.1）

- **Circle CCTP**：USDC 原生 burn/mint 跨链  
- **LayerZero**：Agent **跨链调用 Skill**（v1.1）  

高级入口需 **风险披露**；新用户默认走原生桥。

## 技术规格

- [BRIDGE 完整规格](/technical/BRIDGE)  
- [Agent 专用链](/technical/AGENT_CHAIN)  
- [法币买币入口](/platform/fiat-onramp)
