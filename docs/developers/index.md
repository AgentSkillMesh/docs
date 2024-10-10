---
title: 开发者指南
---

# 加入 VibeAgent：透明协议、可变现生态

VibeAgent 是面向 **Agent Economy** 的市场协议。我们承诺 **代码最终开源可审计、资产非托管、规则链上可见**；当前处于早期建设，**仅 [文档仓库](https://github.com/AgentSkillMesh/docs) 公开**，代码仓在产品可供用户使用后再逐步开源。

## 当前你能做什么？

| 方式 | 说明 |
|------|------|
| 阅读公开文档 | 本站点 + [GitHub docs](https://github.com/AgentSkillMesh/docs) |
| 提交文档 Issue/PR | 修正白皮书、规格、用户指南 |
| 关注开源里程碑 | 公测 / 主网前后将开放 contracts、web 等仓库 |

## 开发者价值（开源后）

| 维度 | 说明 |
|------|------|
| **协议可审计** | 合约、SDK 将 MIT 开源，可 Fork、可贡献 |
| **非托管** | 平台不碰私钥与链上资产 |
| **多种变现** | Skill 运营、集成商、节点、Grants 等 |

## 技术栈（私有仓，团队内开发）

- **合约**：Solidity + Hardhat（`contracts`）  
- **后端**：NestJS + 链上索引（`api`）  
- **前端**：React + wagmi DApp（`web`）  
- **P2P**：libp2p SDK（`p2p`）  
- **文档**：Rspress（本仓库 `docs`，**公开**）  

组织：[AgentSkillMesh](https://github.com/AgentSkillMesh) · MetaRepo：[VibeAgent](https://github.com/AgentSkillMesh/VibeAgent)（私有）

## SDK 路线图

| SDK | 版本 | 说明 |
|-----|------|------|
| [Agent 交易 SDK](/developers/agent-trading-sdk) | v0.7 | Python/TS 模板，无 App 接入链上收益 |
| [IoT SDK](/developers/iot-sdk) | v0.4 | BYOD 设备注册、收款、遥测 |
| [Onramp SDK](/developers/onramp-sdk) | v0.3 | MoonPay/Stripe Widget 嵌入，免牌照法币入口 |

## 快速开始

1. 阅读 [开源与安全](/developers/open-source-security)（含可见性说明）  
2. 了解 [开发者如何赚钱](/developers/monetization)  
3. 参与 [文档贡献](/developers/contribute)  
4. 团队内本地环境见 [技术：开发入门](/technical/development/GETTING_STARTED)

## 延伸阅读

- [开源与安全](/developers/open-source-security)  
- [开发者如何赚钱](/developers/monetization)  
- [参与贡献](/developers/contribute)  
