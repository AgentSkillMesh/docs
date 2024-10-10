---
title: 技术文档
---

# 技术文档

面向工程师的规格、架构与开发指南。

## Spec 驱动开发

VibeAgent 采用 **Spec-Driven Development**：主规格维护在 MetaRepo 根目录 `spec/`，本站点 `technical/` 下 SPEC、REPOS 等文件由脚本同步发布。

| 文档 | 说明 |
|------|------|
| [技术规格 SPEC](/technical/SPEC) | 功能/非功能需求、数据模型、验收（**规范源**） |
| [仓库关系 REPOS](/technical/REPOS) | 各 GitHub 仓库职责、依赖、变更传播顺序 |
| [需求追溯](/technical/traceability) | FR-* 需求 ID → 实现仓库 |
| [技术路线图 ROADMAP](/technical/ROADMAP) | 版本里程碑 |
| [客户端总览 CLIENTS](/technical/CLIENTS) | wallet / worker / web 分工 |
| [任务系统 TASK_SYSTEM](/technical/TASK_SYSTEM) | Agent/人类双通道、验收 |
| [任务治理 TASK_GOVERNANCE](/technical/TASK_GOVERNANCE) | 发布审批与风控 |
| [等级费率 FEE_TIERS_AA](/technical/FEE_TIERS_AA) | ERC-4337 AA 手续费 |
| [本地端口 PORTS](/technical/PORTS) | API 默认 13008 |
| [物联网 IOT](/technical/IOT) | 车桩/数据/能源/冷链（v0.4–v0.6） |
| [Agent 专用链 AGENT_CHAIN](/technical/AGENT_CHAIN) | L2 + MasterChef（v0.7） |
| [生态策略 ECOSYSTEM](/technical/ECOSYSTEM) | 参与方激励与收入 |
| [MetaDEX](/technical/METADEX) | ve 稳定/蓝筹 DEX（v0.15） |
| [MetaDEX 合约计划](/technical/METADEX_CONTRACTS) | Fork 清单 · Phase A–D（**当前优先级**） |
| [MetaDEX 架构](/technical/METADEX_ARCHITECTURE) | Port/Adapter · TS→Rust |
| [DataLuminary](/technical/DATALUMINARY) | TVL/历史分析外接 |
| [跨链 BRIDGE](/technical/BRIDGE) | 原生 Rollup 桥 + Omnichain |
| [法币 ONRAMP](/technical/ONRAMP) | 第三方合规 Widget |
| [异步支付 ASYNC_PAYMENTS](/technical/ASYNC_PAYMENTS) | Session Key · Receipt · 弃联盟链 |
| [路线图 ROADMAP](/technical/ROADMAP) | M0–M8 里程碑 |
| [钱包规格 WALLET](/technical/WALLET) | 纯粹钱包（发任务） |
| [综合端 WORKER](/technical/WORKER) | 众包 + 社交平台任务 |
| [管理平台 ADMIN](/technical/ADMIN) | 运营审核控制台 |

## 架构与实现

| 文档 | 说明 |
|------|------|
| [系统架构](/technical/architecture/OVERVIEW) | 分层与流程 |
| [智能合约](/technical/architecture/SMART_CONTRACTS) | 合约接口 |
| [P2P 网络](/technical/architecture/P2P_NETWORK) | Beacon 与消息 |
| [开发入门](/technical/development/GETTING_STARTED) | 本地环境 |
| [MetaRepo 工作区](/technical/development/METAREPO_STRUCTURE) | 本地目录与脚本（摘要） |
| [API 规范](/technical/development/API) | REST 接口 |

## 代码仓库（私有，待开源）

| 仓库 | 说明 |
|------|------|
| [contracts](https://github.com/AgentSkillMesh/contracts) | 智能合约 |
| [api](https://github.com/AgentSkillMesh/api) | 索引 API |
| [web](https://github.com/AgentSkillMesh/web) | DApp |
| [wallet](https://github.com/AgentSkillMesh/wallet) | RN 纯粹钱包 |
| [worker](https://github.com/AgentSkillMesh/worker) | RN 综合端 |
| [admin](https://github.com/AgentSkillMesh/admin) | 运营管理 |
| [docs](https://github.com/AgentSkillMesh/docs) | 本仓库（**公开**） |

详见 [仓库关系 REPOS](/technical/REPOS)。

## 产品文档

- [用户赚钱](/users/) · [开发者](/developers/) · [白皮书](/whitepaper/)
