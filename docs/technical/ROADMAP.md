---
syncSource: VibeAgent MetaRepo spec/
doNotEdit: 璇蜂慨鏀?MetaRepo spec/ 鍚庨噸鏂拌繍琛?scripts/sync-spec-to-docs.ps1
---

> **瑙勮寖婧愭枃浠?*锛氱敱 MetaRepo `spec/` 鍚屾锛岃鍕跨洿鎺ョ紪杈戞湰椤点€?
# VibeAgent 版本规划与里程碑

**最后更新**: 2026-06-04

---

## 1. 版本策略

采用 **SemVer** 语义化版本，分三层发布节奏：

| 层级 | 命名 | 周期 | 说明 |
|------|------|------|------|
| **Protocol** | v0.x → v1.0 | 按里程碑 | 智能合约 + P2P 协议 |
| **Platform** | v0.x → v1.0 | 2 周一迭代 | 前后端 DApp 功能 |
| **MetaRepo** | workspace version | 持续 | Monorepo 工具链与共享包 |

## 2. 版本总览

```
v0.1 MVP ──▶ v0.15.0 合约 ──▶ v0.15.1 api ──▶ v0.15.2 web
                  │                              │
                  └──────── v0.2 Alpha / v0.3 … ─┴──▶ v1.0
```

**MetaDEX 铁律**：v0.15.0 合约部署验收通过前，DEX 前端不进入主开发路径。

> IoT / Agent 链等同 [ROADMAP](./ROADMAP.md) 完整表。

---

## 3. 里程碑详情

### M0 — 项目启动（2026 Q2）

**目标**: 完成项目基础设施与核心文档

| 交付物 | 状态 |
|--------|------|
| MetaRepo 脚手架（Shell + 多仓库） | ✅ |
| 文档体系（白皮书、Spec、Roadmap） | ✅ |
| CI/CD 流水线（lint/test/build） | 🟡 |
| 开发环境（SQLite，无需 Docker） | ✅ |
| Hardhat 合约项目初始化 | ✅ |

**验收标准**: 新开发者可在 30 分钟内完成环境搭建并运行空项目。

---

### M1 — v0.1 MVP「身份与交易」（2026 Q3）

**主题**: 跑通 Agent 铸造 → Skill 注册 → Escrow 结算的最小闭环

#### 智能合约（本地 MVP ✅）
- [x] `AgentNFT`（铸造 + metadata URI）
- [x] `SkillRegistry`（注册/绑定/查询）
- [x] `Escrow`（创建/付款/交付/确认）
- [ ] 部署 Base Sepolia 测试网

#### 后端（本地 MVP ✅）
- [x] NestJS + SQLite 索引
- [x] 链上事件 Indexer（ethers）
- [x] REST API: Agents, Skills, Escrows, Stats
- [ ] SIWE / IPFS

#### 前端（本地 MVP ✅）
- [x] React + AntD + wagmi
- [x] 市场 / Agent 详情 / 工作台 / 任务中心
- [x] 合约交互 Hooks

#### P2P（v0.2）
- [ ] libp2p 节点 PoC
- [ ] Beacon 广播/接收

**里程碑验收**:
> 两个测试用户可在 Base Sepolia 上完成：User A 铸造 Agent 并注册 Skill → User B 发起 Escrow 雇佣 → User A 交付 → 链上自动结算。

**预计工期**: 8 周

---

### M1b — v0.15 MetaDEX Lite「ve 稳定/蓝筹 DEX」（2026 Q3–Q4）

**主题**: **合约优先** — Fork Aerodrome 核心上 Base；再 api / web；分析外接 DataLuminary

> 详细合约清单见 [METADEX_CONTRACTS.md](./METADEX_CONTRACTS.md)

#### v0.15.0 · Phase A — 合约（**当前优先级 · 阻塞后续**）

| # | 交付 | 仓库 | 状态 |
|---|------|------|------|
| A1 | Factory / Pair / Router + 单测 | contracts | ✅ |
| A2 | VotingEscrow / Voter / Gauge + 单测 | contracts | ✅ |
| A3 | `deploy-metadex` + Base Sepolia 部署 | contracts | 🟡 localhost ✅ · Sepolia 待部署 |
| A4 | `export-abi` → shared / deployments | contracts, shared | ✅ |
| A5 | 集成测试：LP → Swap → Lock → Vote | contracts | ✅ |

**Phase A 验收**（**不依赖 api/web**）：

> Base Sepolia 部署可验证；Hardhat 集成测试绿；`deployments.json` 含 `metadex.*`；≥2 个稳定/蓝筹 Pool 已初始化。

**预计工期**: 4–5 周

#### v0.15.1 · Phase B — api 读链

| # | 交付 | 依赖 |
|---|------|------|
| B1 | Port Adapter 读 Pair / Router 报价 | A4 |
| B2 | allowlist Pool 轻量 sync | A3 |
| B3 | `/dex/*` API 对接真实地址 | A4 |

**预计工期**: 1–2 周（Phase A 完成后）

#### v0.15.2 · Phase C — web DEX 页

| # | 交付 | 依赖 |
|---|------|------|
| C1 | `/dex` Swap | B1 |
| C2 | LP + Lock ve + Vote | A2, B1 |

**预计工期**: 2 周

#### v0.15.x · Phase D — 分析（并行、非阻塞）

- [DataLuminary](https://github.com/DataLuminary/DataLuminary-Platform) TVL/历史/套利  
- api `IDexAnalytics` 已预留 Adapter  

#### 明确不做（v0.15）

全链 Indexer、万级 Pool、ms 重组回滚、Bribe 市场（Phase 2）

**M1b 总体验收**: Phase A + B + C 完成；测试网端到端 Swap + ve 投票。

---

### M2 — v0.2 Alpha「发现与信任」（2026 Q4）

**主题**: P2P Agent 发现、Skill 验证、争议处理

#### 智能合约
- [ ] `SkillVerifier` (EAS attestation 集成)
- [ ] `DisputeResolver` (超时退款 + 仲裁投票)
- [ ] `ReviewRegistry` (链上评价 hash)
- [ ] 合约升级 Proxy 部署

#### P2P
- [ ] 完整 Beacon 协议实现
- [ ] DHT Agent 路由
- [ ] WebRTC 浏览器节点
- [ ] 加密消息通道（Noise）

#### 后端
- [ ] Beacon 快照缓存服务
- [ ] Skill 验证工作流 API
- [ ] 争议仲裁 API
- [ ] 全文搜索（Elasticsearch 可选）
- [ ] **Receipt Vault**：EIP-712 链下收据验签 + nonce 去重（见 [ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md)）

#### 前端
- [ ] 实时在线 Agent 地图/列表
- [ ] Skill 验证状态展示
- [ ] 争议发起与跟踪 UI
- [ ] 评价与信誉分

**里程碑验收**:
> Agent 可通过 P2P Beacon 被远程发现；一笔争议交易可完成仲裁流程；Skill 具有链上验证标记；**1 万笔/分链下 Receipt 验签零链上 tx**。

**预计工期**: 10 周

---

### M3 — v0.3 Beta「算力与人力」（2027 Q1）

**主题**: 设备算力出租、人类任务 marketplace

#### 智能合约
- [ ] `DeviceRegistry` (设备注册/质押)
- [ ] `HumanTaskEscrow` (人类任务专用 Escrow)
- [ ] `RoyaltySplitter` (ERC-2981 + 协议费分账)
- [ ] 多代币支付（USDC）
- [ ] `SessionKeyRegistry` + Smart Account 策略（见 [ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md)）

#### 设备层
- [ ] Device Node SDK（Node.js/Electron）
- [ ] 算力任务调度器
- [ ] 设备心跳与状态上报

#### 后端
- [ ] Device 管理 API
- [ ] Human Task API
- [ ] 算力匹配引擎
- [ ] 通知服务（WebSocket）
- [ ] **Onramp** Port + MoonPay/Stripe Adapter（见 [ONRAMP.md](./ONRAMP.md)）
- [ ] `GET /onramp/providers` 地区路由

#### 前端
- [ ] 设备管理面板
- [ ] 人类任务 marketplace
- [ ] 收益仪表盘（Agent/Skill/设备/人力 四象限）
- [ ] PWA 支持（移动端基础体验）

#### 移动端（wallet / worker）
- [ ] wallet **「买币」** Onramp WebView（MoonPay + Stripe）
- [ ] wallet **「充值」** Base 官方桥 deep link（见 [BRIDGE.md](./BRIDGE.md) Phase 1）
- [ ] 入金合规披露页

**里程碑验收**:
> 用户可将 PC 注册为算力节点并获得收益；Agent 可发布人类任务并由真人接单完成；**wallet 可通过 MoonPay sandbox 买币至自托管地址**。

**预计工期**: 10 周

---

### M4 — v0.4 IoT Alpha「设备自己收钱」（2027 Q2）

**主题**: 物联网直连支付、设备 SDK、认证白名单

| 模块 | 交付 |
|------|------|
| 合约 | `DeviceRegistry`、`IoTEscrow`（充电桩场景） |
| SDK | IoT SDK PoC（BYOD 注册、稳定币收款） |
| 场景 | 车载 Agent → 认证充电桩：导航、锁款、充电、结算 |
| 认证 | L0 质押注册 + L1 厂商白名单 |
| API | 设备索引、地理发现、认证状态 |

**验收**: 测试网上完成一笔「模拟电动车 Agent ↔ 充电桩」稳定币支付。

**预计工期**: 8 周

---

### M5 — v0.5 Data Micro-Market「高频微额数据」（2027 Q3）

**主题**: 传感器数据流 × Agent 买方，微额按次计费

| 模块 | 交付 |
|------|------|
| 合约 | `DataStreamSubscription`、`MicroPaymentSettler`（Merkle 批量清算） |
| 场景 | 气象/车载/环境/健康数据；买方 Agent 秒级调用 |
| 经济 | ~$0.00001/次；**链下 Receipt** + 批量上链（[ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md)） |
| 依赖 | Receipt Vault（v0.2）、Session Key（v0.3）；Agent L2 预研（v0.7） |

**验收**: 演示 100+ 模拟传感器 + 1 Agent 买方，持续微额扣费 1 小时；**10 万条 Receipt → 1 笔 batch 清算**。

**预计工期**: 10 周

---

### M6 — v0.6 Energy & Logistics「能源与供应链」（2027 Q4）

**主题**: 分布式能源竞价 + 冷链 SLA 智能契约

| 模块 | 交付 |
|------|------|
| 合约 | `EnergyMarket`、`ConditionalFreight`（温度 Oracle） |
| 场景 | 户用光伏余电撮合；冷链运费按 SLA 自动分账/理赔触发 |
| 收入 | 度电清算费 + 企业级契约执行 Gas |

**验收**: 能源竞价 PoC + 冷链合约在测试网跑通一条完整运费释放/扣款路径。

**预计工期**: 10 周

---

### M7 — v0.7 Agent Chain「渐进式去中心化链」（2028 Q1）

**主题**: Agent 专用 L2/L3、MasterChef、开源交易模板

| 模块 | 交付 |
|------|------|
| 链 | 团队运营 Sequencer；原生 Gas ~$0.0001 级 |
| **原生桥** | OP Stack Standard Bridge；L1 ETH/USDC/USDT/PYUSD → L2 canonical |
| 合约 | MasterChef 激励、UUPS 费率/Escrow 升级、`CanonicalTokenRegistry` |
| SDK | Agent Trading 模板（Python/TS） |
| 客户端 | wallet/web **Agent 桥** 存取款 UI |
| 战略 | 交易费养生态；披露中心化阶段与 DAO 迁移路线 |

**验收**: 在自建 L2 上完成 10 万笔/日级微额模拟；**Sepolia 存 USDC → L2 到账**；第三方开发者用模板接入并分成。

**预计工期**: 12 周

#### v0.8 · Omnichain 扩展（M7 后 · 可选）

| 模块 | 交付 |
|------|------|
| CCTP | Circle USDC burn/mint（Base/Ethereum ↔ Agent L2） |
| api | `IOmnichainRouter` Port |
| docs | 与原生桥并列的风险披露 |

**预计工期**: 4 周（可与 M8 部分并行）

---

### M8 — v1.0 Mainnet「生产就绪」（2028 Q2）

**主题**: 主网部署、安全审计、DAO 治理、生态开放

#### 安全与治理
- [ ] 外部安全审计（至少 1 家）
- [ ] Bug Bounty 计划
- [ ] `VibeGovernor` DAO 合约
- [ ] 协议参数链上治理

#### 主网部署
- [ ] Base Mainnet 合约部署
- [ ] 生产级 Indexer + 后端
- [ ] CDN + 高可用部署
- [ ] 监控告警（Datadog/Grafana）

#### 生态
- [ ] 开发者 SDK（TypeScript）
- [ ] 合约 ABI + Subgraph 发布
- [ ] 第三方 Agent 接入文档
- [ ] 合作伙伴集成（Wallet、IPFS Pin）

#### 前端
- [ ] 性能优化（首屏 < 2s）
- [ ] 国际化（中/英）
- [ ] 无障碍（WCAG 2.1 AA）

**里程碑验收**:
> 协议在 Base Mainnet 上线；通过安全审计；至少 100 个 Agent 注册、1000 笔 Escrow 结算；SDK 文档可供第三方集成。

**预计工期**: 8 周

---

## 4. v1.0 之后展望

| 版本 | 主题 | 关键特性 |
|------|------|----------|
| v1.1 | Omnichain Skill | LayerZero 跨链 Skill + CCIP 评估（见 [BRIDGE.md](./BRIDGE.md)） |
| v1.2 | IoT 规模化 | 百万传感器接入、联邦批量结算 |
| v1.3 | ZK 验证 | 零知识 Skill / 数据质量证明 |
| v1.4 | AgentFi | Skill 抵押借贷、收入 Token 化 |
| v2.0 | 自主 Agent 经济 | 多 Sequencer、完全链上治理 |

---

## 5. 团队阶段规划

| 阶段 | 团队规模 | 角色 |
|------|----------|------|
| M0-M1 | 3-5 人 | 全栈 ×2, 合约 ×1, 产品 ×1 |
| M2 | 5-8 人 | +P2P, +前端, +QA |
| M3 | 8-12 人 | +移动端, +任务治理 |
| M4-M6 | 10-14 人 | +IoT/嵌入式, +Oracle, +BD |
| M7-M8 | 12-18 人 | +链工程/Sequencer, +安全/审计 |

---

## 6. 风险与缓冲

| 风险 | 影响 | 缓解 | 时间缓冲 |
|------|------|------|----------|
| 合约审计延迟 | M4 推迟 | 提前 2 个月提交审计 | +4 周 |
| P2P NAT 穿透困难 | M2 功能降级 | Relay 兜底方案 | +2 周 |
| L2 网络不稳定 | 交易体验差 | 多 L2 部署 | +2 周 |
| 监管不确定性 | 主网策略调整 | 法律咨询 + 地理限制 | 待定 |

每个里程碑预留 **15% 时间缓冲**。

---

## 7. 进度追踪

当前阶段: **M1 — v0.1 MVP（本地）**

| 里程碑 | 版本 | 计划 | 状态 |
|--------|------|------|------|
| M0 项目启动 | — | 2026-06 | ✅ |
| M1 身份与交易 | v0.1 | 2026 Q3 | 🟡 |
| M1b-A MetaDEX 合约 | v0.15.0 | 2026 Q3 | ⚪ **当前** |
| M1b-B MetaDEX api | v0.15.1 | 2026 Q3–Q4 | ⚪ 阻塞于 A |
| M1b-C MetaDEX web | v0.15.2 | 2026 Q4 | ⚪ 阻塞于 B |
| M2 发现与信任 | v0.2 | 2026 Q4 | ⚪ |
| M2b 链下 Receipt | v0.2 | 2026 Q4 | ⚪ |
| M3 算力与人力 | v0.3 | 2027 Q1 | 🟡 任务治理 MVP+ |
| M3b Onramp + Base 桥引导 | v0.3 | 2027 Q1 | ⚪ |
| M4 IoT 设备支付 | v0.4 | 2027 Q2 | ⚪ |
| M5 数据微市场 | v0.5 | 2027 Q3 | ⚪ |
| M6 能源与物流 | v0.6 | 2027 Q4 | ⚪ |
| M7 Agent 专用链 | v0.7 | 2028 Q1 | ⚪ |
| M7b Omnichain CCTP | v0.8 | 2028 Q1–Q2 | ⚪ |
| M8 主网就绪 | v1.0 | 2028 Q2 | ⚪ |

---

*里程碑状态: ✅ 完成 | 🟡 进行中 | ⚪ 未开始 | 🔴 阻塞*

