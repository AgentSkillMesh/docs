---
title: Onramp SDK（规划）
---

# Onramp SDK · 嵌入合规买币

**目标版本**: v0.3 · 规范源：[ONRAMP](/technical/ONRAMP)

## 设计原则

- VibeAgent **不自建汇款**；SDK 仅封装 **第三方 Widget** 与 **地区路由**  
- crypto 必须 **直达用户 walletAddress**  
- **禁止** 在 VibeAgent 后端存储姓名、证件、银行卡  

## 包结构（规划）

```
@vibe-agent/onramp          # shared
├── ports/IOnrampProvider
├── adapters/moonpay.ts
├── adapters/stripe-onramp.ts
└── OnrampService.selectProvider(geo)

wallet / web                # 消费方
└── BuyCryptoScreen / BuyCryptoModal
```

## api 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/onramp/health` | 模块健康检查 |
| GET | `/api/v1/onramp/disclosure` | 合规披露（非托管、无 PII） |
| GET | `/api/v1/onramp/providers?country=US` | 按地区返回可用伙伴 |
| POST | `/api/v1/onramp/session` | 签发 Widget session（body 见 `CreateOnrampSessionDto`） |

实现路径：`repos/api/src/modules/onramp/` · 类型：`repos/shared/src/onramp/`

## 集成示例（wallet · 概念）

```typescript
import { OnrampService } from '@vibe-agent/onramp';

const provider = await onramp.selectProvider({ country: 'US' });
const config = await provider.getWidgetConfig({
  walletAddress: userAddress,
  chainId: 8453, // Base
  defaultAsset: 'USDC',
});
// → 打开 WebView / 原生 SDK
```

## 与跨链配合

买币完成后，引导用户：

1. 已在 Base → 直接使用  
2. 在 Ethereum → [Base Bridge](https://bridge.base.org) 或 v0.7 **Agent 原生桥**  

## 延伸阅读

- [法币买币（用户向）](/platform/fiat-onramp)  
- [跨链互通](/platform/bridge-connectivity)  
- [ONRAMP 规格](/technical/ONRAMP)
