---
syncSource: VibeAgent MetaRepo spec/
doNotEdit: 璇蜂慨鏀?MetaRepo spec/ 鍚庨噸鏂拌繍琛?scripts/sync-spec-to-docs.ps1
---

> **瑙勮寖婧愭枃浠?*锛氱敱 MetaRepo `spec/` 鍚屾锛岃鍕跨洿鎺ョ紪杈戞湰椤点€?
# 需求追溯矩阵

将 `SPEC.md` 中的需求 ID 映射到实现仓库与模块，用于 Spec 驱动开发与 Code Review。

**最后更新**: 2026-06-04

| 需求 ID | 简述 | 主仓库 | 模块/路径 | 版本 |
|---------|------|--------|-----------|------|
| FR-ID-001 | Agent 铸造 | contracts | `AgentNFT.sol` | v0.1 |
| FR-ID-002 | Agent 管理 | contracts + api | 合约 + `agents` 模块 | v0.1 |
| FR-ID-003 | 钱包集成 | web | `wagmi`、连接组件 | v0.1 |
| FR-SK-001 | Skill 注册 | contracts | `SkillRegistry.sol` | v0.1 |
| FR-SK-002 | Skill 验证 | contracts | v0.2 EAS | v0.2 |
| FR-SK-003 | Skill 绑定 | contracts + web | 注册 + Studio UI | v0.1 |
| FR-SK-004 | Skill 搜索 | api + web | `skills` 模块、市场页 | v0.1 |
| FR-ST-001 | Escrow 创建 | contracts + web | `Escrow.sol`、雇佣流 | v0.1 |
| FR-ST-002 | 交付 | contracts + api | Escrow 状态、索引 | v0.1 |
| FR-ST-003 | 争议 | contracts | v0.2 | v0.2 |
| FR-ST-004 | 分账 | contracts | 协议费 + AA 等级 | v0.1+ |
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
| FR-CHAIN-001~006 | Agent L2/激励 | contracts + 链工程 | 见 AGENT_CHAIN.md | v0.7 |
| FR-ECO-* | 生态激励 | contracts + docs | MasterChef、Grant | v0.7+ |
| FR-DEX-001a | AMM Factory/Pair/Router | contracts | `metadex/amm` | v0.15.0 ✅ |
| FR-DEX-001b | ve VotingEscrow/Voter/Gauge | contracts | `metadex/ve` | v0.15.0 ✅ |
| FR-DEX-001c | 部署 + export-abi | contracts, shared | `deploy-metadex` | v0.15.0 🟡 localhost ✅ |
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
| FR-PAY-001 | 公链/Rollup only（弃联盟链） | spec, docs | **已定** | **已定** |
| FR-PAY-002 | EIP-712 Receipt schema | shared, api | v0.2 | v0.2 |
| FR-PAY-003 | Receipt Vault | api | `payments` | v0.2 ✅ |
| FR-PAY-004 | Session Key 授权 | contracts, wallet, api | v0.3 ✅ |
| FR-PAY-005 | Session 预算与撤销 | contracts, api | v0.3 ✅ |
| FR-PAY-009 | signReceipt SDK | shared, api/scripts | v0.3 ✅ |
| FR-PAY-006 | Merkle 批量清算 | contracts | `MicroPaymentSettler` | v0.5 |
| FR-PAY-008 | Bundler 微支付批次 | contracts, api | v0.7 | v0.7 |

## MVP v0.1 验收对照

| SPEC §11 条目 | 仓库 | 状态 |
|---------------|------|------|
| Agent 铸造与市场展示 | contracts, api, web | 进行中 |
| Skill 注册与绑定 | contracts, web | 进行中 |
| Escrow 全流程 | contracts, api, web | 进行中 |
| 任务治理双通道 | api, wallet, worker, admin | MVP+ |
| P2P Beacon | p2p | 未开始 |
| IoT 设备支付 | contracts, sdk | v0.4 |
| Agent 专用链 | 链 + contracts | v0.7 |

变更需求时：**先改 SPEC.md 与本表，再改代码**。

