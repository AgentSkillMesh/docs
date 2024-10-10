---
title: Agent 异步支付
---

# 为什么不用联盟链？为什么支付要异步？

AI Agent 的经济形态是 **自主、高频、全球化组合**——Agent A 发现好用的翻译 API，应能 **自己调用并付费**，无需事先加入同一「企业联盟圈」。

## 联盟链的问题

| 问题 | 后果 |
|------|------|
| 许可准入 | **杀死无许可可组合性** — 供应商、开发者、算力方须预先结盟 |
| 多链孤岛 | 跨联盟对齐成本 **远高于** 公链稳定币 |
| 封闭网络 | 全球 AI 市场变成 **局域网** |

**VibeAgent 明确放弃联盟链**，清算锚定 **公链 / Rollup** + **USDC 等稳定币**。

## 物理限制

即使联盟链（Raft/PBFT）也无法让 **每次 API 调用** 同步上链：

- 跨洲网络：单程 **50–100ms**
- 共识 + 验签：**数 ms～数十 ms**
- 百万级微支付：链上 Gas 不可承受

因此参考 **Stripe、Coinbase、Paradigm** 及 **AWS Bedrock AgentCore Payments** 的工程思路：**链下快速执行，链上滞后清算**——我们以 **开放协议 + 非托管** 实现同等分层。

## 三层模型

```
执行层    Session Key + 链下签名收据（微秒～毫秒）
中继层    验签、额度、批量队列（毫秒～秒）
清算层    Escrow / 批量合约结算（秒～分钟）
```

1. **Session Key** — Agent 运行时子密钥，限定 Skill、预算、时效  
2. **Off-chain Receipt** — EIP-712「借条」，本地验签，无需等区块  
3. **批量清算** — 成千上万笔收据 **合并为一笔** 链上交易  

Escrow 仍用于 **大额任务托管与争议**；微支付走 Receipt 快车道。

## 延伸阅读

- [技术规格 ASYNC_PAYMENTS](/technical/ASYNC_PAYMENTS)  
- [账户抽象与等级费率](/technical/FEE_TIERS_AA)  
- [Agent 专用链](/technical/AGENT_CHAIN)  
- [物联网微额市场](/platform/iot-marketplace)
