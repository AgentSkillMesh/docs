---
title: 法币买币 · 合规 Onramp
---

# 法币入口：第三方合规 Widget

VibeAgent **不申请支付牌照、不托管法币、不收集 KYC**。用户通过 **持牌合作伙伴** 用法币购买 crypto，资产 **直接进入自托管钱包**。

## 为什么这样设计？

| 优势 | 说明 |
|------|------|
| **免牌照烦恼** | 汇款/KYC 由 Stripe、MoonPay 等持牌方承担 |
| **非托管** | 平台 never 碰银行卡与身份证件 |
| **全球覆盖** | 多合作伙伴按地区自动路由 |

## 合作伙伴

| 伙伴 | 场景 |
|------|------|
| **Stripe Crypto Onramp** | 美国等 Stripe 覆盖区 |
| **MoonPay** | 全球 fallback |
| **Transak** | 多地区、多资产 |
| **Alchemy Pay** | 亚太、欧洲本地法币 |

## 用户流程

1. wallet / web 点击 **「买币」**  
2. 打开合作伙伴 Widget（KYC 在 **对方网站** 完成）  
3. 法币支付 → **USDC/ETH 打到你的钱包地址**  
4. 可选：通过 [跨链引导](/platform/bridge-connectivity) 转入 Base 或 Agent 链  

## 合规披露

- 法币交易合同主体为 **合作伙伴**，非 VibeAgent  
- 不可用地区将显示 **交易所 / 跨链桥** 替代引导  
- 详见 [ONRAMP 技术规格](/technical/ONRAMP)

## 技术规格

- [ONRAMP](/technical/ONRAMP) · [WALLET 钱包](/technical/WALLET)
