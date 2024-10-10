---
title: 发展路线图
---

# 发展路线图

> 工程排期以 MetaRepo 同步文档 [ROADMAP](/technical/ROADMAP) 为准。

## 总览

```
2026 Q3    v0.1 MVP        身份 + Skill + Escrow + DApp + 任务治理
           v0.15.0         MetaDEX 合约（Fork + Sepolia）← 当前并行优先级
2026 Q3–Q4 v0.15.1–.2     MetaDEX api → web（阻塞于合约）
2026 Q4    v0.2 Alpha      P2P + 验证 + 争议
2027 Q1    v0.3 Beta       人类任务 + wallet/worker + 算力
2027 Q2    v0.4 IoT        车桩支付 + 设备 SDK + 认证白名单
2027 Q3    v0.5 Data µ     传感器微额数据市场
2027 Q4    v0.6 Energy     分布式能源 + 冷链 SLA 契约
2028 Q1    v0.7 Agent链    L2 超低 Gas + MasterChef + 交易模板
2028 Q2    v1.0 Mainnet    审计 + DAO + 生产部署
2028+      v1.x            跨链、IoT 规模化、AgentFi
```

## v0.1 MVP（当前）

**主题**：证明 Agent 商业闭环

- 合约：AgentNFT、SkillRegistry、Escrow  
- DApp + API（端口 **13008**）  
- 任务双通道（Agent / 人类）+ admin 治理  

## v0.15 MetaDEX Lite（合约优先 · 可与 MVP 并行）

**铁律**：v0.15.0 合约部署验收通过前，DEX 前端不进入主开发路径。

| 子版本 | 主题 | 阻塞 |
|--------|------|------|
| **v0.15.0** | Fork Aerodrome AMM + ve；Sepolia 部署；export-abi | — |
| v0.15.1 | api Port 读 Router/Pair 报价 | 依赖 .0 |
| v0.15.2 | web Swap / LP / Vote | 依赖 .1 |

- 分析外接 **[DataLuminary](https://github.com/DataLuminary/DataLuminary-Platform)**（并行、非阻塞）  
- 链下 **Port/Adapter**：TS → 盈利后 Rust Sidecar  

详见 [MetaDEX](/platform/metadex) · [合约计划](/technical/METADEX_CONTRACTS)。

## v0.2 Alpha

P2P Beacon、Skill 验证、争议仲裁、企业 API SDK。

## v0.3 Beta

wallet / worker、人类众包、设备算力节点、版税分账。

- **法币买币**：Stripe / MoonPay 合规 Widget（[详情](/platform/fiat-onramp)）  
- **跨链充值**：Base 官方桥引导（[详情](/platform/bridge-connectivity)）  
- **异步支付**：Session Key + 链下 Receipt + 批量清算（[详情](/platform/async-payments)）  

## v0.4 IoT Alpha · 设备自己收钱

- 无人驾驶电动车 Agent ↔ 认证充电桩，稳定币链上结算  
- **BYOD** + IoT SDK PoC  
- 设备认证白名单  

详见 [物联网交易市场](/platform/iot-marketplace)。

## v0.5 Data Micro-Market

- 气象/车载/环境/健康传感器  
- 买方 Agent **微额按秒** 购数据流  
- 平台：海量调用 ×（Gas + 市场费）  

## v0.6 Energy & Logistics

- 户用光伏/储能 **Agent 竞价** 卖电  
- 冷链 **温度 Oracle + 条件运费** 智能契约  

## v0.7 Agent Chain

- 团队 **Sequencer** 的 Agent 专用 L2/L3，**极低 Gas**  
- **原生 Rollup 桥**：Ethereum 锁 ETH/USDC → L2 mint（[跨链说明](/platform/bridge-connectivity)）  
- **异步批量清算**：Bundler + Paymaster 微支付批次（[异步支付](/platform/async-payments)）  
- **MasterChef** + **UUPS** 可升级合约  
- 开源 **Agent 交易 SDK**（Python/TS 模板）  
- wallet **入金向导**：Onramp → 桥 → 可用余额  
- 战略：**交易费养生态**  

详见 [Agent 交易 SDK](/developers/agent-trading-sdk)。

## v1.0 Mainnet

安全审计、DAO 治理、Base/自建 L2 生产环境、生态 Grant。

## 生态与融资

参与方激励与收入模型见 [生态壮大](/platform/ecosystem-growth) 与 [投资者叙事](/vision/investors)。
