---
syncSource: VibeAgent MetaRepo spec/
doNotEdit: 请修改 MetaRepo spec/ 后重新运行 scripts/sync-spec-to-docs.sh
---

> **规范源文件**：由 MetaRepo `spec/` 同步，请勿直接编辑本页。

# 生产就绪（M5 工程闸门）

**版本**: v1.0-rc · **最后更新**: 2026-08-30  
**关联**: [ROADMAP.md](./ROADMAP.md) · [ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md) · [ONRAMP.md](./ONRAMP.md)

本文件是 **AI 可自动验收** 的生产工程清单。  
**不能** 用 Creator DApp 迭代代替：外部审计报告、主网真实资金、Bug Bounty 平台上线、SRE 值班排班属于 **人类商业宣布门槛**，见 §6。

---

## 1. 探针

| 路径 | 用途 |
|------|------|
| `GET /api/v1/live` | 进程存活 |
| `GET /api/v1/ready` | SQLite 索引 / Postgres 账本+Receipt Vault+Session / 披露可读则 200；Indexer RPC 失败为 `degraded` 仍 200 |
| `GET /api/v1/health` | 链配置 + Indexer 游标 |
| `GET /api/v1/payments/disclosure` | 异步支付模型与强制提现路径 |

监控：Prometheus 抓 `ready`/`health`；告警规则见 `deploy/prometheus/alerts.yml`。

---

## 2. 生产环境变量（禁止默认值）

复制 `deploy/production.env.example`。硬性：

| 变量 | 要求 |
|------|------|
| `NODE_ENV` | `production` |
| `DB_SYNCHRONIZE` | `false`（只跑 migration） |
| `PAYMENT_SERVICE_JWT_SECRET` | 强随机；禁止 lab 默认 |
| `SIWE_JWT_SECRET` / `PLATFORM_JWT_SECRET` | 非 `dev-*` |
| `LEDGER_STORE` | `postgres` + `LEDGER_DATABASE_URL`（与本地默认相同；禁止生产用 `memory`） |
| `COMMIT_ROOT_QUEUE` | `bull` + `REDIS_URL` + `SETTLER_OPERATOR_KEY`（生产禁止 `off`） |
| `CORS_ORIGIN` | 显式 allowlist，禁止 `*` |
| `TRADING_WEBHOOK_SECRET` | 企业回调 HMAC |

---

## 3. 主网部署（脚本就绪，资金人工）

Hardhat 网络 `base`（chainId **8453**）。部署顺序与 Sepolia 相同：AgentNFT → SkillRegistry → Escrow → SessionKeyRegistry → Mock 仅测试网 → PaymentVault → MicroPaymentSettler。

1. 设置 `DEPLOYER_PRIVATE_KEY` 与主网 `RPC_URL`（不得写入 Git）  
2. `pnpm --dir repos/contracts compile`  
3. 人工确认余额与 multisig 后再 `deploy`  
4. `export-abi` → 写入 `repos/api/deployments.json` 的 `"8453"` 键  
5. 公开披露地址（docs + `/payments/disclosure`）

**当前**：Base Sepolia 已部署（见 ROADMAP）；Base Mainnet 地址在资金与审计通过前 **不得填写伪造地址**。

---

## 4. 运维 Runbook

| 项 | 做法 |
|----|------|
| **备份** | SQLite：停写后拷贝 `SQLITE_PATH`；Postgres：`pg_dump` 日备 + WAL；Proofs `PROOFS_DIR` / IPFS 本地目录一并备份 |
| **Root 提交值班** | `GET /payments/ledger/commits?status=pending`；超时未上链告警；`SETTLER_OPERATOR_KEY` 仅 api 进程 |
| **强制提现演练** | 用最新 epoch `GET /payments/ledger/proof` 在 Hardhat/Sepolia 调 `forceWithdraw`；主网演练用小额 |
| **Indexer** | `health.indexer` 游标停滞告警；可切 `RPC_URL` |
| **密钥轮换** | Payment service JWT、SIWE、webhook HMAC 分轨轮换 |

---

## 5. 产品与合规披露

- Onramp：平台不碰法币/KYC，见 [ONRAMP.md](./ONRAMP.md)  
- 链下 IOU：最终清算在公链稳定币；用户可 Merkle 强制提现  
- wallet / worker / admin / web：生产构建命令见 MetaRepo `package.json`（`build:wallet*`、各仓 `pnpm build`）  
- ABI / 测试网地址：`repos/api/deployments.json` + ROADMAP Sepolia 表  

内部预审（非外部审计）：`pnpm --dir repos/contracts test`、`pnpm --dir repos/api test:m2`、本仓库 `pnpm run smoke:m5`。

---

## 6. 人类商业宣布门槛（AI 不伪造）

| 项 | 状态 |
|----|------|
| 外部审计报告（Vault / Settler / Escrow）公开 | 需审计机构 |
| Bug Bounty 平台上线 | 需法务/安全预算 |
| Base Mainnet 真实部署与资金 | 需部署钥与 ETH/USDC |
| 24/7 SRE 值班表 | 需人员 |

工程 1.0-rc **不** 把上表标成已完成。对外宣布「商业版 1.0」须上表关闭。

---

## 7. AI 验收

```bash
pnpm run smoke:m5
```

检查：生产文档与 env 模板、Hardhat `base` 网络、探针与 disclosure、M4 SDK 路径文件、M3/M4 冒烟（API 可达时）。
