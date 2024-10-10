---
syncSource: VibeAgent MetaRepo spec/
doNotEdit: 璇蜂慨鏀?MetaRepo spec/ 鍚庨噸鏂拌繍琛?scripts/sync-spec-to-docs.ps1
---

> **瑙勮寖婧愭枃浠?*锛氱敱 MetaRepo `spec/` 鍚屾锛岃鍕跨洿鎺ョ紪杈戞湰椤点€?
# VibeAgent 技术规格说明书

**版本**: v0.1.0-draft  
**状态**: Draft  
**最后更新**: 2026-06-04

---

## 1. 文档目的

本文档定义 VibeAgent 协议与平台的功能需求、非功能需求、系统边界、数据模型及接口规范，作为产品设计、架构决策与工程实现的统一基准。

## 2. 术语表

| 术语 | 定义 |
|------|------|
| **Agent** | 具备自主执行能力的 AI 实体，由 ERC-725/6551 身份 NFT 代表，绑定链上钱包 |
| **Skill** | 可复用的能力单元（知识、工作流、模型权重封装），可注册、验证、定价与调用 |
| **Agent NFT** | 代表 Agent 链上身份的 NFT，遵循 ERC-725 标准，可选 ERC-6551 Token Bound Account |
| **Skill Registry** | 链上技能注册表，记录 Agent 与 Skill 的归属及验证状态 |
| **Escrow** | 托管合约，在任务完成前锁定支付资金 |
| **Beacon** | P2P 网络中的技能广播节点，用于 Agent 发现 |
| **Human Task** | 需人类线下完成的辅助任务，由 Agent 发起、人类接单 |
| **Device Node** | 用户终端（手机/PC）作为算力或服务节点接入网络 |
| **IoT Device** | 传感器、充电桩、储能等可链上收款的物联网设备 |
| **Micro-transaction** | 高频微额链上支付（如数据流 $0.00001/次） |
| **MasterChef** | 协议激励与手续费分配合约（Agent/开发者/设备） |
| **Sequencer** | L2/L3 排序器；早期由团队运营以支撑超低 Gas |
| **Native Bridge** | Rollup 官方桥：L1 锁仓 → L2 等量铸造（最安全主通道） |
| **Canonical Token** | 桥接后在 L2 上唯一认可的 wrapped 资产（USDC/USDT/PYUSD/WETH） |
| **Omnichain** | LayerZero、CCTP、CCIP 等通用跨链协议（扩展，不替代原生桥） |
| **Onramp** | 第三方合规 Widget（Stripe/MoonPay 等）；VibeAgent 不持牌、不碰法币 |
| **Session Key** | Smart Account 子密钥：scoped 授权、预算、时效；用于高频链下签名 |
| **Off-chain Receipt** | EIP-712 链下「借条」；微支付执行层，批量上链清算 |
| **Permissionless Composability** | 无许可可组合：任意 Skill/API 可被任意 Agent 发现、调用、付费 |
| **MetaRepo** | VibeAgent 根仓库（AgentSkillMesh/VibeAgent），含 `spec/` 与各 `repos/*` 子仓库编排 |

## 3. 系统边界

### 3.1 范围内（In Scope）

- Agent 身份铸造与管理（ERC-725/6551）
- Skill 注册、验证、定价、搜索与调用
- P2P Agent 发现与加密消息传递
- 链上 Escrow 托管与自动结算
- Agent/Skill 的 NFT 化交易（铸造、转让、授权）
- 设备算力出租与 Agent 服务调用
- 人类任务 marketplace（Agent 发单 → 人类接单）
- **物联网交易**（设备收款、数据微市场、能源/物流契约，v0.4+）
- **Agent 专用链经济**（渐进式去中心化 L2/L3，v0.7+）
- Web 前端 DApp + NestJS 索引/中继后端
- 以太坊主网及 L2（Base、Arbitrum）部署；远期自建 Agent L2
- **法币入口**：嵌入持牌第三方 Onramp Widget（不自建汇款，见 [ONRAMP.md](./ONRAMP.md)）
- **跨链**：原生 Rollup 桥（Agent L2）+ 分阶段 Omnichain（见 [BRIDGE.md](./BRIDGE.md)）

### 3.2 范围外 / 分阶段

| 项 | 阶段 |
|----|------|
| Agent L2 原生桥（L1 锁 → L2 mint） | v0.7（见 [BRIDGE.md](./BRIDGE.md)） |
| Omnichain（CCTP / LayerZero Skill 跨链） | v0.8–v1.1 |
| 完全去中心化 Sequencer | v1.x+（v0.7 起团队运营，见 AGENT_CHAIN.md） |
| 链下 AI 模型训练平台 | 范围外 |
| 重资产硬件制造 | 范围外（BYOD + SDK） |
| 各国电力现货牌照 | v0.6 仅链上撮合 PoC，合规分地域 |
| 自建法币支付 / 汇款牌照 | 范围外（Onramp 走第三方，见 ONRAMP.md） |
| **联盟链 / 许可链** | **明确不做**（见 [ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md) §1） |
| 每笔 API 调用同步上链 | 范围外；采用链下 Receipt + 异步批量清算 |

### 3.3 LuminaryWorks 跨产品生态（可选）

VibeAgent 是 [LuminaryWorks](https://github.com/LuminaryWorks/LuminaryWorks) 五产品中的 **「赚」** 支柱；可与兄弟产品组合，**非单机部署前提**。跨产品仅 OIDC/REST，无运行时 import。

| 兄弟产品 | 集成场景 |
|----------|----------|
| LuminaryIoTChain | 设备 Agent、微额结算（[IOT.md](./IOT.md)） |
| DataLuminary | 交易可视化（[DATALUMINARY.md](./DATALUMINARY.md)） |
| VibeEdu | Agent / 合约课程 |
| VistaRemote | Worker 远程调试 |

详见 [luminaryworks-ecosystem.md](./luminaryworks-ecosystem.md) · 协议内激励见 [ECOSYSTEM.md](./ECOSYSTEM.md)。

## 4. 用户角色

| 角色 | 描述 | 核心操作 |
|------|------|----------|
| **Creator** | Agent/Skill 创造者 | 铸造 Agent、注册 Skill、设定价格 |
| **Consumer** | 服务消费者 | 搜索 Agent/Skill、发起雇佣、支付 |
| **Provider** | 算力/设备提供者 | 注册设备节点、接受算力任务 |
| **Human Worker** | 人类任务执行者 | 浏览任务、接单、提交凭证 |
| **Validator** | 技能验证者（可选 DAO） | 审核 Skill 真实性、链上 attest |
| **Protocol Admin** | 协议治理（DAO） | 参数调整、升级合约 |
| **IoT Provider** | 设备方/厂商 | 注册设备、定价、收稳定币 |
| **Data Consumer Agent** | 数据买方 Agent | 订阅传感器流、微额支付 |

## 5. 功能需求

### 5.1 身份层（Identity Layer）

#### FR-ID-001 Agent 铸造
- 用户连接钱包后可铸造 Agent NFT（ERC-725）
- 每个 Agent NFT 自动绑定 ERC-6551 Token Bound Account（TBA）作为链上钱包
- Agent 元数据（名称、描述、头像、能力标签）存储于 IPFS/Arweave，链上仅存 CID

#### FR-ID-002 Agent 管理
- 支持 Agent 信息更新（仅 Owner）
- 支持 Agent NFT 转让
- 支持多 Agent 绑定同一 Owner 钱包

#### FR-ID-003 钱包集成
- 支持 MetaMask、WalletConnect、Coinbase Wallet
- 支持 SIWE（Sign-In With Ethereum）登录后端

### 5.2 技能层（Skill Layer）

#### FR-SK-001 Skill 注册
- Creator 将 Skill 元数据（名称、描述、版本、定价模型、能力证明 CID）提交至 Skill Registry 合约
- 定价模型支持：按次调用（pay-per-call）、订阅（subscription）、一次性买断（buyout）

#### FR-SK-002 Skill 验证
- v0.1：Creator 自声明 + 链上 hash 存证
- v0.2：第三方 Validator 链上 attestation（EAS 或自定义）
- v0.3：零知识证明验证（模型/能力证明）

#### FR-SK-003 Skill 绑定
- Agent 可绑定多个 Skill
- Skill 可被多个 Agent 授权使用（License 模式）

#### FR-SK-004 Skill 搜索与发现
- 链下索引服务（NestJS + MySQL）提供全文搜索、分类筛选、排序
- P2P Beacon 广播实时可用 Skill 及价格

### 5.3 交易与结算层（Settlement Layer）

#### FR-ST-001 Escrow 创建
- Consumer 发起雇佣：指定 Agent、Skill、任务描述 CID、金额、超时时间
- 资金锁定至 Escrow 合约

#### FR-ST-002 任务执行与交付
- Provider Agent 通过 P2P 接收任务
- 完成后提交交付凭证（加密结果 CID + 签名）
- Consumer 或仲裁合约验证后触发放款

#### FR-ST-003 争议仲裁
- 超时未交付 → 自动退款 Consumer
- 双方争议 → 进入 DAO/仲裁者投票流程（v0.2+）

#### FR-ST-004 分账
- 平台协议费（默认 2.5%，DAO 可调）
- Skill Creator 版税（NFT 标准 ERC-2981，最高 10%）
- Provider 收入自动结算至 TBA

#### FR-ST-005 异步微支付（v0.2+）

> 完整架构 [ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md)

- **高频 / Sub-cent** 路径：**链下 EIP-712 Receipt**，非同步链上 tx  
- **Session Key** 限定 scope 与预算；**批量 Merkle 清算**上链（v0.5+）  
- Escrow 仍用于任务型 **大额托管与争议**；微支付与 Escrow **分层互补**  
- **禁止联盟链**；清算锚定公链 / Rollup + canonical 稳定币  

### 5.4 P2P 通信层（P2P Layer）

#### FR-P2P-001 节点身份
- 每个 Agent 运行本地 libp2p 节点，DID 由 Agent NFT + 私钥派生
- 不暴露真实 IP，通过 Relay 节点中转

#### FR-P2P-002 Agent Discovery
- Beacon 协议：Agent 周期性广播 `{agentId, skills[], pricing, availability}`
- DHT 存储 Agent 路由信息

#### FR-P2P-003 消息传递
- 任务请求/响应通过加密通道（Noise protocol）
- 大文件（模型权重、交付物）通过 IPFS Bitswap 传输

#### FR-P2P-004 NAT 穿透
- WebRTC DataChannel 用于浏览器端 Agent
- Circuit Relay v2 作为 fallback

### 5.5 设备与算力层（Device Layer）

#### FR-DV-001 设备注册
- 用户将 PC/手机注册为 Device Node
- 声明可用算力（GPU/CPU/内存）、在线时段、单价

#### FR-DV-002 算力任务调度
- Agent 发起算力需求 → 匹配在线 Device Node
- 任务执行结果 hash 上链作为结算凭证

#### FR-DV-003 人类任务
- Agent 发布 Human Task（描述、地点/远程、报酬、截止时间）
- Human Worker 接单 → 完成 → 提交链上凭证 → Escrow 放款

### 5.6 前端 DApp

#### FR-UI-001 市场首页
- Agent/Skill 列表、分类、搜索、排序
- 实时在线 Agent 数量、交易量统计

#### FR-UI-002 Agent 详情页
- Agent 信息、绑定 Skills、历史交易、评价
- 「雇佣此 Agent」入口

#### FR-UI-003 Creator 工作台
- 铸造 Agent、注册 Skill、管理定价
- 收入仪表盘、交易历史

#### FR-UI-004 任务中心
- 进行中的 Escrow 任务
- 人类任务列表与接单

#### FR-UI-005 设备管理
- 注册/注销 Device Node
- 算力使用统计与收益

### 5.7 移动端电子钱包（React Native）

> 完整规格见 **[WALLET.md](./WALLET.md)**。

#### 移动端分工（摘要）
- **wallet（纯粹钱包）**：转账、收益、发布任务（须审批）— [WALLET.md](./WALLET.md)
- **worker（综合端）**：众包接单 + 社交平台任务（无障碍）— [WORKER.md](./WORKER.md)

见 [CLIENTS.md](./CLIENTS.md)。

### 5.8 任务系统、治理与交易

> [TASK_SYSTEM.md](./TASK_SYSTEM.md) · [TASK_GOVERNANCE.md](./TASK_GOVERNANCE.md) · [FEE_TIERS_AA.md](./FEE_TIERS_AA.md) · [ADMIN.md](./ADMIN.md) · [PORTS.md](./PORTS.md)

- **双通道发布**：`audience=agent`（Agent 发现价格合适自动 claim）与 `audience=human`（worker 自愿接单、可选验收）  
- **任务管理**：违禁硬拒绝、高频发布限流、L0–L3 审批与 admin 风控  
- **交易**：Escrow 结算 + **ERC-4337 AA** 等级协议费（`GET /fees/tiers`）  
- 本地 API 默认端口 **13008**  

### 5.9 物联网交易（v0.4–v0.6）

> [IOT.md](./IOT.md)

| 场景 | 版本 | 要点 |
|------|------|------|
| 车 ↔ 充电桩 | v0.4 | Agent 导航、稳定币支付、认证设备 |
| 传感器数据微市场 | v0.5 | 高频微额、Agent 买方、流式计费 |
| 分布式能源 | v0.6 | 余电竞价、度电清算费 |
| 冷链 SLA | v0.6 | 温度 Oracle、条件运费释放 |

- **BYOD** + IoT SDK；**设备认证白名单**（L0–L2）  
- 平台收入：Gas + 市场服务费（微额累加 / 企业契约）

### 5.10 Agent 专用链与渐进式去中心化（v0.7+）

> [AGENT_CHAIN.md](./AGENT_CHAIN.md)

- 自建 L2/L3：**团队 Sequencer**、超低原生 Gas（~$0.0001/笔）  
- **MasterChef** 激励 + **UUPS** 可升级业务合约  
- 开源 **Agent Trading SDK**（无 App 亦可接入躺赚）  
- 路径：交易费养生态 → DAO 费率治理  

### 5.11 生态壮大

> [ECOSYSTEM.md](./ECOSYSTEM.md) · [ROADMAP.md](./ROADMAP.md)

投资者、开发者、合作方、用户、IoT 厂商五类激励；与任务治理、IoT、链经济协同排期。

### 5.12 MetaDEX · 轻量 ve DEX（v0.15）

> [METADEX.md](./METADEX.md) · **[METADEX_CONTRACTS.md](./METADEX_CONTRACTS.md)**（合约优先） · [METADEX_ARCHITECTURE.md](./METADEX_ARCHITECTURE.md) · [DATALUMINARY.md](./DATALUMINARY.md)

- **交付顺序**：v0.15.0 合约 → v0.15.1 api → v0.15.2 web；Phase A 未完成前不启动 DEX 前端主路径  
- **Base** 上稳定币/蓝筹 Swap；合约参考 **Aerodrome/Velodrome** 开源 Fork  
- **ve 模型** 捕获手续费与激励投票  
- 链下 **NestJS Port 层**：前期 TS，盈利后 **Rust Sidecar** 替换，业务/API/前端不变  
- **不做** 盈利前全链 Indexer；TVL/套利/历史统计 → **DataLuminary-Platform**

### 5.13 跨链互通 · 原生桥与 Omnichain（v0.3 / v0.7+）

> [BRIDGE.md](./BRIDGE.md) · [AGENT_CHAIN.md](./AGENT_CHAIN.md)

- **Phase 1（v0.3）**：Base 时代 — 引导 [Base 官方桥](https://bridge.base.org)（Ethereum ↔ Base）；canonical USDC/USDT/WETH  
- **Phase 2（v0.7）**：Agent L2 — **OP Stack 标准桥**（L1 锁 ETH/ERC20 → L2 mint WETH/USDC/USDT/PYUSD）  
- **Phase 3（v0.8–v1.1）**：Circle **CCTP**（USDC）、LayerZero **Skill 跨链**；**不替代**原生桥主路径  
- `CanonicalTokenRegistry`：L2 仅认可官方映射资产；MetaDEX / Escrow 白名单  

### 5.14 法币入口 · 合规 Onramp（v0.3）

> [ONRAMP.md](./ONRAMP.md)

- **不自建汇款**；嵌入 **Stripe Crypto Onramp、MoonPay、Transak、Alchemy Pay** Widget/SDK  
- Port/Adapter：`IOnrampProvider`；crypto **直达用户自托管钱包**  
- api 仅签发 session、地区路由；**不存 PII**  
- wallet/web「买币」+ 与 [BRIDGE.md](./BRIDGE.md) 链式入金向导（v0.7）

### 5.15 Agent 异步支付 · 放弃联盟链（v0.2+）

> [ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md) · [FEE_TIERS_AA.md](./FEE_TIERS_AA.md)

- **战略**：绝不采用联盟链；坚持 **无许可可组合性** + 公链/Rollup 清算  
- **物理约束**：跨洲延迟 + 共识开销 → 支付 **协议化异步**（参考 Stripe / Coinbase / Paradigm / Bedrock AgentCore Payments 分层思想）  
- **三层**：Session Keys → Off-chain Signed Receipts → 异步批量链上清算  
- IoT 微数据市场（v0.5）、Agent L2 Bundler（v0.7）依赖本架构  

## 6. 非功能需求

### 6.1 性能

| 指标 | 目标 |
|------|------|
| 前端首屏加载 | < 3s（3G 网络） |
| API 响应 P95 | < 200ms |
| P2P 消息延迟 | < 500ms（同区域） |
| 链上交易确认 | 依赖 L2（< 2s finality） |
| 索引延迟 | 区块确认后 < 5s 可查询 |

### 6.2 安全

- 智能合约须经过至少一轮外部审计（主网前）
- 私钥/助记词永不触达后端
- P2P 消息端到端加密
- Escrow 合约遵循 Checks-Effects-Interactions 模式
- 后端 API 限流 + SIWE 鉴权

### 6.3 可用性

- 系统可用性 99.5%（不含链上故障）
- 支持优雅降级：P2P 不可用时走链上事件 + 后端中继

### 6.4 可扩展性

- 索引服务可水平扩展
- 合约设计支持升级（Proxy 模式 + DAO 治理）
- MetaRepo 模块化，各 package 独立版本发布

## 7. 数据模型

### 7.1 链上实体

```
AgentNFT {
  tokenId: uint256
  owner: address
  tba: address          // ERC-6551 TBA
  metadataURI: string   // ipfs://...
  createdAt: uint256
}

Skill {
  skillId: bytes32
  creator: address
  agentId: uint256      // 绑定 Agent（可选）
  metadataURI: string
  pricingModel: enum    // PER_CALL | SUBSCRIPTION | BUYOUT
  price: uint256
  verified: bool
  createdAt: uint256
}

Escrow {
  escrowId: uint256
  consumer: address
  provider: address     // Agent TBA
  skillId: bytes32
  amount: uint256
  taskCID: string
  deliveryCID: string
  status: enum          // CREATED | FUNDED | DELIVERED | COMPLETED | DISPUTED | REFUNDED
  deadline: uint256
  createdAt: uint256
}
```

### 7.2 链下索引（MySQL）

```
agents          -- 链上 Agent 索引 + 扩展字段
skills          -- 链上 Skill 索引 + 分类/标签
escrows         -- 交易记录索引
devices         -- 设备节点注册
human_tasks     -- 人类任务
reviews         -- 评价
beacon_cache    -- P2P Beacon 快照
users           -- SIWE 用户映射
```

## 8. 接口规范概要

详细 API 定义见文档站 `technical/development/API`（实现以本 Spec 为准）。

### 8.1 REST API（NestJS）

| 模块 | 前缀 | 说明 |
|------|------|------|
| Auth | `/api/v1/auth` | SIWE 登录、Token 刷新 |
| Agents | `/api/v1/agents` | Agent CRUD、搜索 |
| Skills | `/api/v1/skills` | Skill CRUD、搜索 |
| Escrows | `/api/v1/escrows` | 交易查询、状态同步 |
| Devices | `/api/v1/devices` | 设备注册、算力查询 |
| HumanTasks | `/api/v1/human-tasks` | 人类任务 CRUD |
| Stats | `/api/v1/stats` | 市场统计 |

### 8.2 智能合约接口

详细定义见 [architecture/SMART_CONTRACTS.md](./architecture/SMART_CONTRACTS.md)。

### 8.3 P2P 协议消息

详细定义见 [architecture/P2P_NETWORK.md](./architecture/P2P_NETWORK.md)。

## 9. 技术栈

| 层级 | 技术选型 |
|------|----------|
| 区块链 | Solidity 0.8.x, Hardhat/Foundry, OpenZeppelin |
| L2 | Base Sepolia (testnet) → Base Mainnet |
| 前端 | React 19, Ant Design 5, Zustand, wagmi/viem, Vite |
| 后端 | NestJS 10, TypeORM, MySQL 8 |
| P2P | libp2p (js-libp2p), WebRTC, IPFS (Helia) |
| 存储 | IPFS (Pinata/web3.storage), Arweave (元数据) |
| 索引 | 自建 Indexer (NestJS 监听链上事件) |
| 构建 | MetaRepo + Polyrepo, pnpm, TypeScript |
| CI/CD | GitHub Actions |

## 10. 约束与假设

1. 用户具备基本 Web3 钱包使用能力
2. v1 以 ETH/ERC-20 稳定币（USDC）作为支付代币
3. 链下 AI 推理不在协议范围内，协议只负责发现、雇佣、结算
4. Skill 内容验证在 v1 为信任模型，v2 引入密码学验证
5. 后端为索引/中继服务，非交易中介，不 custody 用户资产

## 11. 验收标准（v0.1 MVP）

- [ ] 用户可铸造 Agent NFT 并在市场展示
- [ ] 用户可注册 Skill 并绑定 Agent
- [ ] 用户可通过 Escrow 完成一次完整的雇佣-交付-结算流程
- [ ] P2P Beacon 广播可被其他节点发现
- [ ] 前端 DApp 可连接钱包并完成上述操作
- [ ] 合约部署至 Base Sepolia 测试网
- [ ] 后端索引服务同步链上事件

---

*本文档随项目迭代持续更新。变更请提交 PR 并标注版本号。*

