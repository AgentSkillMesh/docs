---
syncSource: VibeAgent MetaRepo spec/
doNotEdit: 璇蜂慨鏀?MetaRepo spec/ 鍚庨噸鏂拌繍琛?scripts/sync-spec-to-docs.ps1
---

> **瑙勮寖婧愭枃浠?*锛氱敱 MetaRepo `spec/` 鍚屾锛岃鍕跨洿鎺ョ紪杈戞湰椤点€?
# 需求追溯矩阵

将 `SPEC.md` 中的需求 ID 映射到实现仓库与模块，用于 Spec 驱动开发与 Code Review。

**最后更新**: 2025-02-10

| 需求 ID | 简述 | 主仓库 | 模块/路径 | 版本 |
|---------|------|--------|-----------|------|
| FR-ID-001 | Agent 铸造 | contracts | `AgentNFT.sol` | v0.1 |
| FR-ID-002 | Agent 管理 | contracts + api | 合约 + `agents` 模块 | v0.1 |
| FR-ID-003 | 钱包集成 | web | `wagmi`、连接组件 | v0.1 |
| FR-ID-003b | SIWE 登录 | api + web | `auth` 模块、`/account` | v0.1 🟡 |
| FR-SK-001 | Skill 注册 | contracts | `SkillRegistry.sol` | v0.1 |
| FR-SK-002 | Skill 验证 | contracts | v0.2 EAS | v0.2 |
| FR-SK-003 | Skill 绑定 | contracts + web | 注册 + Studio UI | v0.1 |
| FR-SK-004 | Skill 搜索 | api + web | `skills` 模块、市场页 | v0.1 |
| FR-ST-001 | Escrow 创建 | contracts + web | `Escrow.sol`、雇佣流 | v0.1 |
| FR-ST-002 | 交付 | contracts + api | Escrow 状态、索引 | v0.1 |
| FR-ST-003 | 争议仲裁 | contracts, api, admin | v0.2+；**M3 平台工单** | **M3** 🟡 |
| FR-ST-004 | 分账 | contracts | 协议费 + AA 等级 | v0.1+ |
| FR-IPFS-001 | 元数据 / 任务 CID pin | api + web | `storage` 模块、`pinMetadata` | v0.1 ✅ |
| FR-P2P-001~004 | P2P | p2p | Beacon 等 | v0.2 |
| FR-DV-001~003 | 设备/人类任务 | api + wallet + worker | v0.3 | v0.3 |
| FR-WLT-* | 纯粹钱包 RN | wallet | 发任务、转账 | v0.3 |
| FR-WRK-* | 综合端 RN | worker | 众包 + 社交 | v0.3+ |
| FR-ADM-* | 管理平台 | admin | 审批、告警 | v0.3+ |
| FR-GOV-* | 任务治理 | api | `tasks` 模块 | MVP+ |
| FR-UI-* | DApp 页面 | web | `pages/*` | v0.1 |
| FR-IOT-001 | 设备注册认证 | contracts + api | `DeviceRegistry` | v0.4 |
| FR-IOT-002 | 车桩支付 | contracts | `IoTEscrow` | v0.4 |
| FR-IOT-003 | IoT SDK BYOD | shared / iot-sdk | 设备 SDK | v0.4 |
| FR-IOT-004 | 数据流微额 | contracts + api | `MicroPaymentStream` | v0.5 |
| FR-IOT-005 | 能源市场 | contracts | `EnergyMarket` | v0.6 |
| FR-IOT-006 | 冷链 SLA | contracts | `ConditionalFreight` | v0.6 |
| FR-CHAIN-001~006 | 激励/SDK（现成 L2）；自建链延期 | contracts | 见 AGENT_CHAIN.md | v0.7 / 远期 |
| FR-ECO-* | 生态激励 | contracts + docs | MasterChef、Grant | v0.7+ |
| FR-DEX-001a | AMM Factory/Pair/Router | contracts | `metadex/amm` | v0.15.0 ✅ |
| FR-DEX-001b | ve VotingEscrow/Voter/Gauge | contracts | `metadex/ve` | v0.15.0 ✅ |
| FR-DEX-001c | 部署 + export-abi | contracts, shared | `deploy-metadex` | v0.15.0 🟡 localhost ✅ · Sepolia 核心合约 ✅ MetaDEX 待部署 |
| FR-DEX-002 | Swap/Router API | api | `dex` Port 层 | v0.15.1 |
| FR-DEX-003 | 轻量 Pool 同步 | api | `TsDexPoolSync` | v0.15.1 |
| FR-DEX-004 | Rust Sidecar 替换 | api + dex-engine | `RustDexSidecar` | 盈利后 |
| FR-DEX-005 | 分析外接 | api | DataLuminary Adapter | v0.15.x |
| FR-DEX-UI-001 | Swap/LP/Vote UI | web | `/dex` | v0.15.2 |
| FR-BRIDGE-001 | Base 官方桥引导 | wallet, web | deep link | v0.3 |
| FR-BRIDGE-002 | OP Stack + Standard Bridge | infrastructure, contracts | v0.7 | v0.7 |
| FR-BRIDGE-003 | CanonicalTokenRegistry | contracts | `bridge/` | v0.7 |
| FR-BRIDGE-004 | 桥状态 API Port | api | `bridge` 模块 | v0.7 |
| FR-BRIDGE-005 | 原生桥 UI | wallet, web | 存取款 | v0.7 |
| FR-BRIDGE-006 | Circle CCTP USDC | contracts, api | v0.8 | v0.8 |
| FR-BRIDGE-007 | LayerZero Skill 跨链 | contracts, api | v1.1 | v1.1 |
| FR-ONRAMP-001 | Onramp Port + shared | shared | `@vibe-agent/onramp` | v0.3 |
| FR-ONRAMP-002 | MoonPay + Stripe Adapter | wallet, web, api | Widget | v0.3 |
| FR-ONRAMP-003 | wallet 买币页 | wallet | WebView | v0.3 |
| FR-ONRAMP-005 | 地区路由 + 披露 | api, docs | v0.3 | v0.3 |
| FR-ONRAMP-007 | 入金向导 Onramp+Bridge | wallet | v0.7 | v0.7 |
| FR-PAY-001 | 公链/现成 L2 only（弃联盟链） | spec, docs | **已定** | **已定** |
| FR-PAY-002 | EIP-712 Receipt schema | shared, api | v0.2 | v0.2 |
| FR-PAY-003 | Receipt Vault | api | `payments` | v0.2 ✅ |
| FR-PAY-004 | Session Key 授权 | contracts, wallet, api | v0.3 ✅ |
| FR-PAY-005 | Session 预算与撤销 | contracts, api | v0.3 ✅ |
| FR-PAY-009 | signReceipt SDK | shared, api/scripts | v0.3 ✅ |
| FR-PAY-006 | Merkle Root 批量清算 | contracts, api, shared | `MicroPaymentSettler` + `/ledger/snapshot` | **v0.2 / M2** 🟡 |
| FR-PAY-007 | 双向轧差净额 | contracts | v0.2–v0.4 | v0.2–v0.4 |
| FR-PAY-008 | Bundler 微支付批次 | contracts, api | v1.0 | v1.0 |
| FR-PAY-010 | 状态通道拓展（非大厅默认） | contracts, p2p | v1.1+ | v1.1+ |
| FR-PAY-011 | 不做定制 L3 作微支付主路径 | spec | **已定** | **已定** |
| FR-PAY-012 | 链下记账引擎 + Vault 充提 | api, contracts | `PaymentVault` Sepolia ✅ · PG 账本 + Redis/BullMQ Root 队列（memory 回退） | **v0.2 / M2** 🟡 |
| FR-PAY-013 | Merkle 强制提现 | contracts, shared | `forceWithdraw` Sepolia 已部署 + proof 工具 | **v0.2 / M2** 🟡 |
| FR-WLT-002 | wallet ETH 转账（去演示化） | wallet | `/transfer` gas 估算 + 回执 + explorer | **v0.3 / M3** 🟡 |
| FR-WLT-004 | wallet 发任务 + 驳回原因回显 | wallet, api | `earnings` 展示 `alertReason`；发布即时 Alert | **v0.3 / M3** 🟡 |
| FR-WLT-005 | 审批状态应用内通知 | wallet | `notifyStore` 轮询 mine；系统 Push → v0.4 | **v0.3 / M3** 🟡 |
| FR-WLT-006 / FR-ONRAMP-003 | wallet 买币 Onramp | wallet, api | `/onramp` + `POST /onramp/session` | **v0.3 / M3** 🟡 |
| FR-ST-001/002 | 链上 Escrow fund/release（平台任务） | wallet, worker, api, contracts | bind-onchain-escrow · create/fund · deliver · confirm | **v0.3 / M3** 🟡 |
| FR-WLT-008 | wallet Vault 充提 | wallet | `app/vault.tsx` + disclosure | **v0.3 / M3** 🟡 |
| FR-ADM-003 | admin 审批工作台 | admin, api | approve 绑 Escrow 预留；request-revision → needs_revision | **v0.3 / M3** 🟡 |
| FR-ADM-004 | admin 自动审批监控 | admin, api | `/auto-approval` ← auto-decisions / escalate / mark-reviewed | **v0.3 / M3** 🟡 |
| FR-ADM-009 | admin 治理参数 | admin, api | `/governance` ← GET/PUT governance/config；驱动 scoreTask | **v0.3 / M3** 🟡 |
| FR-ADM-010 | admin 发单方观察/黑名单 | admin, api | `/publishers` ← aggregate + flag；黑名单禁发 | **v0.3 / M3** 🟡 |
| FR-ADM-011 | admin 审计日志 | admin, api | `/audit` ← `GET /admin/audit`；审批/治理/拉黑落库 | **v0.3 / M3** 🟡 |
| FR-ADM-012 | admin 争议仲裁工单 | admin, api | `/disputes` ← list/claim/resolve；`POST /tasks/:id/dispute` | **v0.3 / M3** 🟡 |
| FR-ADM-002 | admin 任务列表 | admin, api | `/tasks` ← GET /admin/tasks + 行内审批 | **v0.3 / M3** 🟡 |
| FR-ADM-005 | admin 风控告警 | admin, api | `/risk-alerts` ← alerts + clear-alert | **v0.3 / M3** 🟡 |
| FR-ADM-006 | admin 仪表盘 KPI | admin, api | `/dashboard` ← stats/overview | **v0.3 / M3** 🟡 |
| FR-ADM-007 | admin 支付 Commits 运维 | admin | `/payments/commits` | **v0.3 / M3** 🟡 |
| FR-ADM-008 | admin 费率等级只读 | admin, api | `/payments/fees` ← `GET /fees/tiers` | **v0.3 / M3** 🟡 |
| FR-WRK-002/003/005 | worker published 大厅 + 接单门禁 + Vault/账本 | worker, api | earnings Vault + ledger；完成入账 stub；展示 escrowId | **v0.3 / M3** 🟡 |
| FR-PAY-SETTLE | 任务完成链下放款 stub | api | `ledgerSettled` + LEDGER.credit(WETH wei) | **v0.3 / M3** 🟡 |
| FR-ST-005/006 | 账本清算主路径 + 场景矩阵 | spec, api, contracts | ASYNC_PAYMENTS | **v0.2 / M2** 🟡 |

## MVP v0.1 验收对照

| SPEC §11 条目 | 仓库 | 状态 |
|---------------|------|------|
| Agent 铸造与市场展示 | contracts, api, web | 进行中 |
| Skill 注册与绑定 | contracts, web | 进行中 |
| Escrow 全流程 | contracts, api, web | 进行中 |
| 任务治理双通道 | api, wallet, worker, admin | MVP+ |
| P2P Beacon | p2p | 未开始 |
| IoT 设备支付 | contracts, sdk | v0.4 |
| 链下账本 + Merkle（主线 M2） | api, contracts, shared | **v0.2** 🟡 PoC |
| 客户端 wallet/worker/admin（主线 M3） | wallet, worker, admin, web | **v0.3** |
| 赚钱场景 SDK/API/人类任务（主线 M4） | shared, api, clients | **v0.4** |
| 商业版上线（主线 M5） | 全仓 | **v1.0** |

变更需求时：**先改 SPEC.md 与本表，再改代码**。

