---
title: MetaDEX · ve 稳定币交易
---

# MetaDEX：轻量 ve 模型 DEX

VibeAgent 在 **Base** 上提供专注的 **稳定币 / 蓝筹** 交易与流动性，用 **ve（vote-escrowed）** 模型对齐 LP 与协议长期价值——参考 [Aerodrome](https://aerodrome.finance) / Velodrome 开源架构。

## 合约优先（核心）

MetaDEX 的价值在链上：**Factory / Pair / Router + ve 投票** 必须先于 api 与前端完成。

| 阶段 | 版本 | 内容 |
|------|------|------|
| **A** | v0.15.0 | Solidity Fork、测试、Sepolia 部署、export-abi |
| B | v0.15.1 | api Port 读链报价 |
| C | v0.15.2 | web `/dex` Swap / LP / Vote |
| D | 并行 | DataLuminary 分析（不阻塞 A） |

Phase A 未完成前，**不启动 DEX 前端主路径**。

## 做什么 / 不做什么

| ✅ v0.15 | ❌ 盈利前不做 |
|----------|----------------|
| 精选 Pool Swap / LP | 全链实时扫块 |
| Lock LP → ve → 投票 Gauge | 上万 Pool 日志引擎 |
| NestJS 轻量报价 API | 毫秒级重组回滚 |
| web Swap / Vote 页 | 自建 TVL/套利分析 |

**历史 TVL、手续费、套利研究** → 外接 [DataLuminary-Platform](https://github.com/DataLuminary/DataLuminary-Platform)。

## 架构亮点

- **仅 Solidity** 上链（Fork 开源合约）  
- 链下 **Port/Adapter**：现在 TypeScript，盈利后换 **Rust Sidecar**，**业务 API 与前端不改**  
- 与 Agent 任务、IoT 结算、Escrow 共用稳定币流动性  

## 技术规格

- [METADEX](/technical/METADEX) · **[MetaDEX 合约计划](/technical/METADEX_CONTRACTS)** · [架构 Port 层](/technical/METADEX_ARCHITECTURE) · [DataLuminary 集成](/technical/DATALUMINARY)  
- [路线图 v0.15](/vision/roadmap)
