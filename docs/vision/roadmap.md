---
title: 发展路线图
---

# 发展路线图

> 对外路线图仅描述协议演进方向，**不承诺具体发布时间或版本交付日期**。项目处于早期阶段，商业版本仍在建设中。

## 总览

```
基础协议 ──▶ 发现与信任 ──▶ 算力与扩展 ──▶ 物联网与数据 ──▶ Agent 专用链 ──▶ 主网与治理
```

以下为面向开发者、用户与投资者的**能力阶段规划**（顺序表示演进方向，非时间承诺）：

| 阶段 | 目标 |
|------|------|
| **基础协议** | Agent 身份、Skill 注册、链上 Escrow 结算、客户端与 API |
| **发现与信任** | P2P 发现、Skill 验证、争议仲裁 |
| **算力与扩展** | 人类任务、设备算力、版税与激励增强 |
| **物联网与数据** | 设备自主收款、传感器微额数据、能源与供应链契约 |
| **Agent 专用链** | 超低 Gas 微交易、原生桥、异步批量清算、交易 SDK |
| **主网与治理** | 安全审计、DAO 治理、生产环境部署 |

## 基础协议

**主题**：证明 Agent 商业闭环

- 合约：AgentNFT、SkillRegistry、Escrow  
- DApp + API（端口 **13008**）  
- 任务双通道（Agent / 人类）+ admin 治理  

## MetaDEX Lite（合约优先）

**原则**：链上合约（Factory / Pair / Router + ve）验收通过前，DEX 前端不进入主开发路径。

| 阶段 | 内容 |
|------|------|
| **合约** | Solidity Fork、测试、测试网部署、ABI 导出 |
| **API** | 读链报价与路由 |
| **前端** | Swap / LP / Vote |
| **分析（并行）** | 外接 [DataLuminary](https://github.com/DataLuminary/DataLuminary-Platform) |

详见 [MetaDEX](/platform/metadex) · [合约计划](/technical/METADEX_CONTRACTS)。

## 发现与信任

P2P Beacon、Skill 验证、争议仲裁、企业 API SDK。

## 算力与扩展

wallet / worker、人类众包、设备算力节点、版税分账。

- **法币买币**：Stripe / MoonPay 合规 Widget（[详情](/platform/fiat-onramp)）  
- **跨链充值**：Base 官方桥引导（[详情](/platform/bridge-connectivity)）  
- **异步支付**：Session Key + 链下 Receipt + 批量清算（[详情](/platform/async-payments)）  

## 物联网 · 设备自己收钱

- 无人驾驶电动车 Agent ↔ 认证充电桩，稳定币链上结算  
- **BYOD** + IoT SDK  
- 设备认证白名单  

详见 [物联网交易市场](/platform/iot-marketplace)。

## 数据微市场

- 气象/车载/环境/健康传感器  
- 买方 Agent **微额按次** 购数据流  
- 平台：海量调用 ×（Gas + 市场费）  

## 能源与供应链

- 户用光伏/储能 **Agent 竞价** 卖电  
- 冷链 **温度 Oracle + 条件运费** 智能契约  

## Agent 专用链

- 团队 **Sequencer** 的 Agent 专用 L2/L3，**极低 Gas**  
- **原生 Rollup 桥**：Ethereum 锁 ETH/USDC → L2 mint（[跨链说明](/platform/bridge-connectivity)）  
- **异步批量清算**：Bundler + Paymaster 微支付批次（[异步支付](/platform/async-payments)）  
- **MasterChef** + **UUPS** 可升级合约  
- 开源 **Agent 交易 SDK**（Python/TS 模板）  
- wallet **入金向导**：Onramp → 桥 → 可用余额  
- 战略：**交易费养生态**  

详见 [Agent 交易 SDK](/developers/agent-trading-sdk)。

## 主网与治理

安全审计、DAO 治理、生产环境部署、生态 Grant。

## 生态与融资

参与方激励与收入模型见 [生态壮大](/platform/ecosystem-growth) 与 [投资者叙事](/vision/investors)。
