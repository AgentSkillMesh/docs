---
syncSource: VibeAgent MetaRepo spec/
doNotEdit: 请修改 MetaRepo spec/ 后重新运行 scripts/sync-spec-to-docs.sh
---

> **规范源文件**：由 MetaRepo `spec/` 同步，请勿直接编辑本页。

# DoerFlow 技术规格说明书

> **品牌**：[DoerFlow](https://doerflow.dev) · **组织**：[github.com/doerflow](https://github.com/doerflow)（原 AgentSkillMesh / VibeAgent）  
> **定位**：The Liquidity Protocol for Autonomous Agents — 自主执行体的价值流动协议

**版本**: v0.1.0-draft  
**状态**: Draft  
**最后更新**: 2026-08-23

> 历史名称 **VibeAgent** 在本文档中仍可能出现，含义同 **DoerFlow**。品牌决策见 [LuminaryWorks/spec/products/doerflow.md](https://github.com/LuminaryWorks/LuminaryWorks/blob/main/spec/products/doerflow.md)。

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
| **Micro-transaction** | 高频微额支付（如数据流 $0.00001/次）；执行在链下，链上批量清算 |
| **Off-chain Ledger** | 平台链下记账引擎（NestJS + Redis/PG）；A2A 微交互毫秒级加减法 |
| **Merkle Settlement** | 周期余额/收据快照生成 Merkle Root，提交现成 L2；可强制提现 |
| **Vault** | 链上金库：Agent 存入 USDC/USDT 等结算资产，配合账本清算 |
| **MasterChef** | 协议激励与手续费分配合约（Agent/开发者/设备） |
| **Sequencer** | （远期可选）自建 L2 排序器；近中期不依赖，微支付走链下账本 |
| **Native Bridge** | Rollup 官方桥：L1 锁仓 → L2 等量铸造；自建链延期前用 Base 等官方桥 |
| **Canonical Token** | 桥接后在 L2 上唯一认可的 wrapped 资产（USDC/USDT/PYUSD/WETH） |
| **Omnichain** | LayerZero、CCTP、CCIP 等通用跨链协议（扩展，不替代原生桥） |
| **Onramp** | 第三方合规 Widget（Stripe/MoonPay 等）；VibeAgent 不持牌、不碰法币 |
| **MetaRepo** | DoerFlow 根仓库（doerflow/platform），含 `spec/` 与各 `repos/*` 子仓库编排 |

## 3. 系统边界

### 3.1 范围内（In Scope）

- Agent 身份铸造与管理（ERC-725/6551）
- Skill 注册、验证、定价、搜索与调用
- P2P Agent 发现与加密消息传递
- 链上 Escrow 托管与自动结算
- Agent/Skill 的 NFT 化交易（铸造、转让、授权）
- 设备算力出租与 Agent 服务调用
- 人类任务 marketplace（Agent 发单 → 人类接单；人类发单 → Agent 完成）
- **多形态交易**：Agent↔Agent、Agent→云服务、Agent→客户端 App、人机双向任务
- **链下账本 + Merkle 批量结算**（A2A 高频微支付主路径，见 [ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md)）
- **物联网交易**（设备收款、数据微市场、能源/物流契约，v0.4+）
- **协议激励与 Trading SDK**（MasterChef 等可部署在现成 L2，v0.7+）
- Web 前端 DApp + NestJS 索引/中继/链下记账后端
- 以太坊主网及 **现成 L2（Base、Arbitrum）** 部署
- **法币入口**：嵌入持牌第三方 Onramp Widget（不自建汇款，见 [ONRAMP.md](./ONRAMP.md)）
- **跨链**：现阶段 Base/官方桥；自建链原生桥延期；Omnichain 分阶段（见 [BRIDGE.md](./BRIDGE.md)）

### 3.2 范围外 / 分阶段

| 项 | 阶段 |
|----|------|
| 状态通道（1:1 流式微支付拓展） | v0.8+ 可选（非大厅默认，见 ASYNC_PAYMENTS） |
| 定制 Layer 3 / 应用专属 Rollup | **现阶段不做**（过早优化，FR-PAY-011） |
| 自建 Agent L2 + 原生桥 | **规模证明后评估**（非微支付前置，见 AGENT_CHAIN） |
| Omnichain（CCTP / LayerZero Skill 跨链） | v0.8–v1.1 |
| 完全去中心化 Sequencer | 仅随自建链远期 |
| 链下 AI 模型训练平台 | 范围外 |
| 重资产硬件制造 | 范围外（BYOD + SDK） |
| 各国电力现货牌照 | v0.6 仅链上撮合 PoC，合规分地域 |
| 自建法币支付 / 汇款牌照 | 范围外（Onramp 走第三方，见 ONRAMP.md） |
| 联盟链 / 许可链 | **明确不做** |

### 3.3 LuminaryWorks 跨产品生态（可选）

DoerFlow 是 [LuminaryWorks](https://github.com/LuminaryWorks/LuminaryWorks) 五产品中的 **「赚」** 支柱；可与兄弟产品组合，**非单机部署前提**。跨产品仅 OIDC/REST，无运行时 import。

| 兄弟产品 | 集成场景 |
|----------|----------|
| SyncroBrain | 设备 Agent、微额结算（[IOT.md](./IOT.md)） |
| DataLuminary | 交易可视化（[DATALUMINARY.md](./DATALUMINARY.md)） |
| BlockyEdu | Agent / 合约课程 |
| VistaCast | Worker 远程调试 |

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
- 索引解析 `ipfs://`：先读本地 pin；再 `IPFS_GATEWAY`；若仍未命中且配置了 `THIRDWEB_PROJECT_ID`，可选用 `{clientId}.ipfscdn.io`（可选，失败则保留 URI 截断名）。Secret 不得进入 gateway URL
- `/storage/pin` 返回 `backend: "local"` 与 `ipfs://local-…` **即为成功**（未配置 Pinata 时的默认路径）。Studio 不得把 local CID 当成失败
- Creator 工作台铸造进度须在**卡片内**展示四步（不得只依赖顶部 toast）：① 保存元数据 ② 钱包确认 ③ 交易上链 ④ 市场可见
- pin 成功后立即展示 CID/URI，并明确「下一步是钱包弹窗确认」；钱包拒绝后保留 URI，允许再次唤起 `mint` 而不重复 pin
- 出现交易哈希后提供区块浏览器链接；索引到该 Owner 的新 Agent 后提供详情/市场入口

#### FR-ID-002 Agent 管理
- 支持 Agent 信息更新（仅 Owner）
- 支持 Agent NFT 转让
- 支持多 Agent 绑定同一 Owner 钱包

#### FR-ID-003 钱包集成
- 支持 MetaMask、WalletConnect、Coinbase Wallet（Creator DApp 默认 **wagmi injected**，不依赖 thirdweb Connect；连接按钮列出已注入的 EIP-6963 钱包供用户选择）
- 支持 SIWE（Sign-In With Ethereum）登录后端
- **可选 thirdweb**：仅作测试网 / 开发 RPC 入口。配置 `THIRDWEB_PROJECT_ID`（web：`VITE_THIRDWEB_CLIENT_ID`）后，公共网可走 `https://{chainId}.rpc.thirdweb.com/{clientId}`；`THIRDWEB_PROJECT_SECRET` 仅服务端持有，**不得**写入 RPC URL。未配置时继续用 `RPC_URL` / `VITE_BASE_RPC_URL`。`THIRDWEB_RPC=0` 可关闭。Hardhat `31337` 始终本机节点
- **双身份不可合并**：Logto 平台会话负责会员/组织/平台 API，钱包连接与 SIWE 负责地址证明和链上签名；任一状态不得推断另一状态
- 平台账号可显示已链接钱包，但绑定须使用平台 JWT + 新鲜 SIWE 证明；Logto 绝不等价于钱包所有权

#### FR-ID-004 平台会员与商业权益
- 调用顺序固定为 Logto AuthN → Entitlement → Casbin；`401` 登录、`402 ENTITLEMENT_*` 升级/配额、`403` 资源 ACL
- DoerFlow `trialPolicy=disabled`：只展示 Pro / Ultra / Enterprise，不创建 Trial，不显示试用 CTA 或倒计时
- 会员快照来自 `GET /api/v1/platform/membership`，包含 `effectivePlan`、组织上下文与 quota；不得从 JWT 或前端角色推断
- 协议费、Escrow、Gas、链上 Skill 按次价格属于协议经济；平台套餐只控制托管 API/配额，两者不得混称

### 5.2 技能层（Skill Layer）

#### FR-SK-001 Skill 注册
- Creator 将 Skill 元数据（名称、描述、版本、定价模型、能力证明 CID）提交至 Skill Registry 合约
- 定价模型支持：按次调用（pay-per-call）、订阅（subscription）、一次性买断（buyout）
- Studio 注册与铸造相同：`POST /storage/pin` 的 **201 Created**（Nest 对 POST 的默认成功码）与 200 均为成功；pin 后须在卡片内进入「钱包确认」，不得只转圈
- 钱包拒绝后保留 URI，允许再次唤起 `registerSkill` 而不重复 pin；索引到新 Skill 后可复制 skillId

#### FR-SK-002 Skill 验证
- v0.1：Creator 自声明 + 链上 hash 存证
- v0.2：第三方 Validator 链上 attestation（EAS 或自定义）
- v0.3：零知识证明验证（模型/能力证明）

#### FR-SK-003 Skill 绑定
- Agent 可绑定多个 Skill
- Skill 可被多个 Agent 授权使用（License 模式）
- Studio 绑定须在卡片内跟进度（钱包确认 → 上链 → Agent 详情可见绑定），不得只转圈；无 pin 步骤；钱包拒绝后允许再次唤起 `bindSkillToAgent`
- 铸造/注册完成后提供「下一步：绑定」入口，预填最近的 skillId 与 Owner 的 Agent

#### FR-SK-004 Skill 搜索与发现
- 链下索引服务（NestJS + **SQLite**）提供全文搜索、分类筛选、排序
- P2P Beacon 广播实时可用 Skill 及价格

### 5.3 交易与结算层（Settlement Layer）

> 任务型托管用 **Escrow**；Agent 大厅高频微支付用 **链下账本 + Merkle**（[ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md)）。状态通道为可选拓展，非全局默认。

#### FR-ST-001 Escrow 创建
- Consumer 发起雇佣：指定 Agent、Skill、任务描述 CID、金额、超时时间
- 资金锁定至 Escrow 合约
- Agent 详情「雇佣」与铸造相同：`POST /storage/pin` 的 201/200 后进入钱包确认；卡片内跟进度（元数据 → 钱包 → 上链 → 任务中心可见）；索引到新 Escrow 后再进入任务中心，不得 pin 成功后无反馈地跳走
- 钱包拒绝后保留任务 CID，允许再次唤起 `createEscrow` 而不重复 pin
- **平台人类任务（M3）**：接单后 wallet `createEscrow` + `fundEscrow`，API `bind-onchain-escrow`

#### FR-ST-002 任务执行与交付
- Provider Agent 通过 P2P 接收任务
- 完成后提交交付凭证（加密结果 CID + 签名）
- Consumer 或仲裁合约验证后触发放款
- `deliverEscrow` 须发出 `EscrowDelivered`；Indexer 同步该事件与 `EscrowRefunded`
- 已部署合约若无交付事件：Indexer 每轮对 `CREATED` / `FUNDED` / `DELIVERED` 调用 `getEscrow` 刷新状态；`POST /escrows/:id/refresh` 可手动从链拉齐（本地 pin 的任务/交付摘要一并返回）
- 任务中心交付须可填写结果说明再 pin，付款/交付/确认须有明确成功或钱包提示，不得只显示 "OK"
- **平台人类任务（M3）**：worker `deliverEscrow` → wallet `confirmDelivery`（2.5% 协议费）

#### FR-ST-003 争议仲裁
- 超时未交付 → 自动退款 Consumer
- 双方争议 → 进入 DAO/仲裁者投票流程（v0.2+）
- **平台人类任务（M3）**：`assigned|submitted|verifying` 可开争议工单；admin 裁决 `refund_publisher` / `release_worker` / `split`（账本侧结算）
- **链上（M3）**：`Escrow.refundTimedOut` — 截止后 consumer 退回 FUNDED/DELIVERED 托管金；DAO 分账仲裁仍见 v0.4+

#### FR-ST-004 分账
- 平台协议费（默认 2.5%，DAO 可调）
- Skill Creator 版税（NFT 标准 ERC-2981，最高 10%）
- Provider 收入自动结算至 TBA
- 确认收款后，任务卡与工作台收入区须展示锁定额、协议费与 Provider 实收（与 `Escrow.protocolFeeBps` 默认 250 一致）；不得只显示 "OK"

#### FR-ST-005 链下账本与 Merkle 批量清算（主路径）
- Agent 将结算资产存入链上 **Vault**；微交互在 **链下账本** 毫秒级记账（签名 Receipt）
- 周期或阈值触发：余额/收据快照 → **Merkle Root** 提交至 Base/Arbitrum 等现成 L2
- 用户可用 Merkle 证明 **强制提现**（抗平台作恶/宕机）
- **不做**：以定制 L3 作为微支付底座；以状态通道作为大厅全局架构
- 细则与 FR-PAY-*：[ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md)

#### FR-ST-006 交易场景覆盖
- Agent↔Agent、Agent→云服务、Agent→客户端 App、Agent 下单/人类完成、人类下单/Agent 完成
- 高频微额走 FR-ST-005；任务型与争议走 FR-ST-001～004

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
- 公开市场不要求平台会员；连接钱包后仍可直接签名链上交易
- 链上索引的 Agent / Skill / Escrow 列表 API 公开可读，不得要求平台 JWT

#### FR-UI-002 Agent 详情页
- Agent 信息、绑定 Skills、历史交易、评价
- 「雇佣此 Agent」入口；雇佣进度在卡片内展示，不得只依赖顶部 toast
- 未绑定 Skill 时不得假装可雇佣：Owner 引导去工作台绑定，访客提示等待 Creator
- 展示该 Agent 作为 Provider 的托管历史；雇佣完成后带 `escrowId` 进入任务中心
- 雇佣自己的 Agent（consumer = provider）时须提示：付款后仍要在任务中心交付并确认，才能走完闭环

#### FR-UI-003 Creator 工作台
- 铸造 Agent、注册 Skill、管理定价、绑定 Agent
- 铸造、注册 Skill、绑定均在卡片内跟进度；`POST /storage/pin` 返回 201/200 都必须有下一步行动说明，不能进入无反馈状态
- 工作台展示闭环进度（已铸 Agent / 已注册 Skill / 已绑定），完成后引导到下一步 Tab
- 收入仪表盘：该钱包作为 Provider 的已完成托管实收（锁定额 − 协议费）与最近订单入口
- 平台受限能力遇到稳定 `402` 时进入升级流程，不把 `403` ACL 拒绝误报为付费问题
- 连接钱包后展示当前链与原生币余额；钱包停在未配置链（如以太坊主网）时，引导切换到 Hardhat `31337` 或 Base Sepolia `84532`，不得暗示需要购买主网 ETH
- Base Sepolia 原生币不足支付 gas 时展示测试网水龙头；钱包 `insufficient funds` / 用户拒签映射为可读文案
- MetaRepo 提供 `pnpm run use:sepolia` / `use:localhost`，将 api/web 的链与合约地址从 `.env.sepolia` / `.env.localhost` 合并进 `.env`（保留 IdP 等本地密钥）；切换后须重启进程

#### FR-IDX-001 链上事件索引窗口
- Indexer 同步 AgentMinted、SkillRegistered、SkillBound、Escrow 相关事件，供市场与 Studio 展示
- 公共 RPC（含 Base Sepolia）单次 `eth_getLogs` 区间不得超过供应商上限（常见 5 万块；**thirdweb gateway 常见 1000 块**）；按 `INDEXER_MAX_BLOCK_RANGE` 切片推进，遇供应商 cap 错误时自动收缩窗口
- **可选** thirdweb RPC：若配置了 `THIRDWEB_PROJECT_ID` 且未设 `THIRDWEB_RPC=0`，公共网走 `https://{chainId}.rpc.thirdweb.com/{clientId}`；否则 `RPC_URL`。Secret 不进入 RPC 路径。Hardhat 本地仍用本机节点
- 当 live RPC 为 thirdweb 且 `RPC_URL` 不同时，**历史追块**走 `RPC_URL`（更大 `eth_getLogs` 窗口），**链头窗口**仍走 thirdweb；历史 RPC 连续失败则该窗口改用 live。`GET /health` 报告 `catchupRpcProvider` / `catchupPercent` / `catchupMaxRange`
- thirdweb gateway **连续失败**时整条索引回退 `RPC_URL`（若与 gateway 不同）；`GET /health` 报告 `rpcProvider` / `rpcFallback`
- `GET /health` 的 `indexer.rpcUrl` **必须脱敏**（thirdweb URL 中的 secret/clientId 不得明文返回）
- 启动从持久化游标、`INDEXER_START_BLOCK` 或近期 lookback 开始；禁止每次从创世块扫到 latest
- `GET /health` 返回索引游标、是否追块、`rpcOk` / `lastError` / `rpcProvider`；RPC 不可达时市场须提示「链 RPC 未就绪」（如 Hardhat 未启动），不得伪装成「没有 Agent」；追块中展示进度百分比
- 历史追块期间须**同时扫描链头窗口**（`latest − INDEXER_MAX_BLOCK_RANGE`），使新铸造 / 新 Escrow 不必等整段 lookback 追完才可见
- Indexer 在 RPC 连续失败时退避重试，避免刷屏日志

#### FR-UI-004 任务中心
- 进行中的 Escrow 任务；默认突出「待我处理」，可切到全部
- 状态用人话（待付款 / 待交付 / 待确认 / 已完成 / 已退款），并展示任务与交付摘要（解析本地 pin）
- 付款金额默认 Skill 定价；付款 / 交付 / 确认须有明确成功或钱包提示；交付须可填写结果说明
- 后台刷新不得整页转圈；刚创建的订单可用 `?id=` 高亮
- 截止后仍为 FUNDED/DELIVERED 时，Consumer 可调用 `refundTimedOut`
- 同一钱包同时为 consumer 与 provider 时（自雇演示），按状态机展示下一步（付款 → 交付 → 确认），不得因「雇主」角色优先而隐藏交付
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
- **交易**：Escrow（任务型）+ **链下账本 / Merkle**（高频微支付）+ **ERC-4337 AA** 等级协议费（`GET /fees/tiers`）  
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

### 5.10 清算底座、客户端与商业发版顺序

> [ROADMAP.md](./ROADMAP.md) · [ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md) · [AGENT_CHAIN.md](./AGENT_CHAIN.md)

**到 v1.0 的交付顺序（主线）**：

1. **v0.2** — 链下账本 + Vault + Merkle 批量结算  
2. **v0.3** — wallet / worker / admin / web 客户端完善  
3. **v0.4** — 赚钱场景（Agent/云 SDK·API、人类发单接单）  
4. **v1.0** — 商业版本上线（审计 + 主网）  

- Vault / Escrow / Merkle 清算部署在 **Base、Arbitrum** 等现成 L2  
- **定制 L3：不做**；自建 Agent L2 仅 1.0 后规模证明再评估  
- MasterChef / 完整 P2P / IoT 规模化 → **1.0 后或支线**，不阻塞商业发版 

### 5.11 生态壮大

> [ECOSYSTEM.md](./ECOSYSTEM.md) · [ROADMAP.md](./ROADMAP.md)

投资者、开发者、合作方、用户、IoT 厂商五类激励；与任务治理、IoT、链经济协同排期。

### 5.12 MetaDEX · 轻量 ve DEX（v0.15 · **1.0 主线支线**）

> [METADEX.md](./METADEX.md) · **[METADEX_CONTRACTS.md](./METADEX_CONTRACTS.md)** · [METADEX_ARCHITECTURE.md](./METADEX_ARCHITECTURE.md) · [DATALUMINARY.md](./DATALUMINARY.md)

- **与商业主线解耦**：不阻塞 M2–M5（账本 → 客户端 → 场景 → v1.0）  
- **交付顺序**：v0.15.0 合约 → v0.15.1 api → v0.15.2 web；Phase A 未完成前不启动 DEX 前端主路径  

- **Base** 上稳定币/蓝筹 Swap；合约参考 **Aerodrome/Velodrome** 开源 Fork  
- **ve 模型** 捕获手续费与激励投票  
- 链下 **NestJS Port 层**：前期 TS，盈利后 **Rust Sidecar** 替换，业务/API/前端不变  
- **不做** 盈利前全链 Indexer；TVL/套利/历史统计 → **DataLuminary-Platform**

### 5.13 跨链互通 · 官方桥与 Omnichain（v0.3+ · 自建链桥延期）

> [BRIDGE.md](./BRIDGE.md) · [AGENT_CHAIN.md](./AGENT_CHAIN.md)

- **Phase 1（当前）**：Base / Arbitrum 时代 — 引导各 L2 **官方桥**；canonical USDC/USDT/WETH；Vault/Merkle 清算落此  
- **Phase 2（延期）**：仅当自建 Agent L2 立项后 — OP Stack 标准桥（见 AGENT_CHAIN）  
- **Phase 3（v0.8–v1.1）**：Circle **CCTP**、LayerZero **Skill 跨链**（扩展，不替代官方主通道）  
- `CanonicalTokenRegistry`：L2 仅认可官方映射资产；MetaDEX / Escrow / Vault 白名单  

### 5.14 法币入口 · 合规 Onramp（v0.3）

> [ONRAMP.md](./ONRAMP.md)

- **不自建汇款**；嵌入 **Stripe Crypto Onramp、MoonPay、Transak、Alchemy Pay** Widget/SDK  
- Port/Adapter：`IOnrampProvider`；crypto **直达用户自托管钱包**  
- api 仅签发 session、地区路由；**不存 PII**  
- wallet/web「买币」+ 与 [BRIDGE.md](./BRIDGE.md) 链式入金向导（v0.7）  

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
  status: enum          // CREATED | FUNDED | DELIVERED | COMPLETED | REFUNDED | CANCELLED（链上；争议为平台工单）
  deadline: uint256
  createdAt: uint256
}
```

### 7.2 链下索引（SQLite）

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
| Escrows | `/api/v1/escrows` | 交易查询、状态同步；`POST /:id/refresh` 从链刷新（含任务/交付摘要） |
| Devices | `/api/v1/devices` | 设备注册、算力查询 |
| HumanTasks | `/api/v1/human-tasks` | 人类任务 CRUD |
| Storage | `/api/v1/storage` | 元数据 pin（本地 / Pinata → `ipfs://`）。`POST /pin` 返回 **201 Created**（或 200）且 `backend: "local"` 均为成功，客户端应继续链上写入 |
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
| 前端 | React 19, Ant Design 5, Zustand, wagmi/viem, Rsbuild |
| 后端 | NestJS 10, TypeORM, **SQLite**（better-sqlite3） |
| P2P | libp2p (js-libp2p), WebRTC, IPFS (Helia) |
| 存储 | IPFS (Pinata/web3.storage), Arweave (元数据) |
| 索引 | 自建 Indexer（NestJS；分片 `eth_getLogs` + 游标；公共网 RPC 可选用 thirdweb，见 FR-IDX-001） |
| 构建 | MetaRepo + Polyrepo, pnpm, TypeScript |
| CI/CD | GitHub Actions |

## 10. 约束与假设

1. 用户具备基本 Web3 钱包使用能力
2. v1 以 ETH/ERC-20 稳定币（USDC）作为支付代币
3. 链下 AI 推理不在协议范围内，协议只负责发现、雇佣、结算
4. Skill 内容验证在 v1 为信任模型，v2 引入密码学验证
5. 后端为索引/中继/链下记账服务；**不托管**用户主私钥。结算资产在链上 Vault；用户可凭 Merkle 证明强制提现（见 ASYNC_PAYMENTS）

## 11. 验收标准（v0.1 MVP）

- [x] 用户可铸造 Agent NFT 并在市场展示（本地已冒烟：`smoke-mint.ts`）
- [ ] 用户可注册 Skill 并绑定 Agent
- [ ] 用户可通过 Escrow 完成一次完整的雇佣-交付-结算流程
- [ ] P2P Beacon 广播可被其他节点发现（**v0.2**，不在 MVP 本地范围）
- [x] 前端 DApp 可连接钱包并完成上述操作（代码就绪；本地联调）
- [x] 合约部署至 Base Sepolia 测试网（2024-12-24 · 见 `ROADMAP.md` / `deployments/baseSepolia.json`）
- [x] 后端索引服务同步链上事件（本地 Indexer + IPFS 元数据解析）
- [x] 元数据 pin → `ipfs://`（本地 / 可选 Pinata）
---

*本文档随项目迭代持续更新。变更请提交 PR 并标注版本号。*
