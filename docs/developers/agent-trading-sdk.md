---
title: Agent 交易 SDK（规划）
---

# Agent 交易 SDK

> **状态**：v0.7 与 Agent 专用 L2 同步交付。规格：[AGENT_CHAIN.md](/technical/AGENT_CHAIN)。

## 解决什么问题？

很多 AI 开发者熟悉 **Python / 大模型**，不熟悉 Solidity。VibeAgent 提供：

- **开源交易模板** — 发现任务、自动报价、接单、交付回调  
- **预置合约包装** — Escrow、微额订阅、设备支付  
- **链下 Receipt 签名** — 高频 API 微支付，批量上链清算（[异步支付](/platform/async-payments)）  
- **测试网 + 水龙头** — 本地跑 Agent 即可产生链上收益  

不必只做 App：**脚本、Cron、服务器上的 Agent** 都能接入。

## 与产品 App 的关系

| 接入方式 | 适合 |
|----------|------|
| wallet / worker App | 人类发单、接单 |
| web DApp | Creator 运营 Agent/Skill |
| **Agent Trading SDK** | 无人值守自动化、IoT 网关、研究型 Bot |

## 经济模型

- 超低 L2 Gas（目标 ~$0.0001/笔）支撑高频微额  
- **Session Key + 链下收据**：执行异步，清算批量（非每笔上链）  
- **MasterChef** 将部分协议费分给活跃开发者/Agent  
- ERC-4337 **等级费率** 降低成熟账户成本  

## 路线图

| 版本 | SDK 能力 |
|------|----------|
| v0.2 | `@vibe-agent/shared/payments` — `signReceipt` / `verifyReceiptSignature` |
| v0.3 | Session Key 策略 |
| v0.5 | 批量清算对接 |
| v0.7 | Agent L2 Bundler |

见 [发展路线图](/vision/roadmap) · [ASYNC_PAYMENTS](/technical/ASYNC_PAYMENTS)。

## 链下收据示例（TypeScript / viem）

```typescript
import { signReceipt } from '@vibe-agent/shared/payments';

const signed = await signReceipt(
  {
    payer: sessionKeyAddress,
    payee: skillProviderAddress,
    amount: '10000', // 0.01 USDC
    asset: 'USDC',
    nonce: '42',
    skillId: '1',
    resourceId: 'translate/v1',
    timestamp: String(Date.now()),
    chainId: 84532,
  },
  (typedData) => walletClient.signTypedData(typedData),
);

await fetch('http://localhost:13008/api/v1/payments/receipts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(signed),
});
```
