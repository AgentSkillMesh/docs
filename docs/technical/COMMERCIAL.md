---
syncSource: VibeAgent MetaRepo spec/
doNotEdit: 请修改 MetaRepo spec/ 后重新运行 scripts/sync-spec-to-docs.sh
---

> **规范源文件**：由 MetaRepo `spec/` 同步，请勿直接编辑本页。

# 商业收款：封闭 Beta（M5a）与公开 1.0（M5b）

**最后更新**: 2026-09-05  
**关联**: [PRODUCTION.md](./PRODUCTION.md) · [ROADMAP.md](./ROADMAP.md) · FR-PAY-016

M5a 工程可关；M5b 的审计机构、Bounty 账户、Apple/Google 账号、值班人员 **AI 不伪造完成**。

---

## 1. 模式

| `COMMERCIAL_MODE` | 何时 | 白名单 | 限额 | `unaudited` |
|-------------------|------|--------|------|-------------|
| `off` | 本地 / Sepolia | 否 | 否 | 不适用 |
| `beta` | 封闭主网收款 | **必填** | 默认 100 / 500 / 5,000 USDC；Escrow 0.05 ETH | **true**（除非 `COMMERCIAL_AUDITED=true`） |
| `public` | 公开 1.0（M5b） | 关闭 | 提高或取消 | 审计报告公开后 false |

`CHAIN_ID=8453` 禁止 `off`。错误码：`COMMERCIAL_NOT_ALLOWLISTED`、`COMMERCIAL_CAP_EXCEEDED`、`PAYMENTS_PAUSED`。

Vault 主网资产：**Base USDC** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`。Escrow 继续收 **ETH**。

链上 `PaymentVault.pause()`：禁止 `deposit`，**不禁止** `withdraw` / Settler `forceWithdraw`。

---

## 2. M5b 审计包（人类提交）

范围（建议写进审计 SOW）：

- `PaymentVault`、`MicroPaymentSettler`、`CreditLineNetting`、`SettlementBatcher`、`Escrow`、`SessionKeyRegistry`
- `SimpleMultisig` / `DoerFlowTimelock`（admin 不在热钥）
- 已知风险：链下 IOU 直至 Merkle Root 上链；`SETTLER_OPERATOR_KEY` 仅 `commitRoot` / 轧差 / Batcher

交付物：报告 PDF + 修复记录。公开后设 `COMMERCIAL_AUDITED=true`，disclosure `unaudited=false`。

联系审计机构、付费、披露 URL：**人类**。

---

## 3. Bug Bounty

模板范围与审计相同；排除：UI、文档、已公开的链下延迟。  
平台：Immunefi / HackenProof / Cantina（任选）。上线、赏金预算、法务条款：**人类**。

---

## 4. SRE 值班

- 告警：`deploy/prometheus/alerts.yml`（API down、ready、commit 卡住、Indexer 无 leader）
- 接到真实通知渠道（PagerDuty / 邮件 / 短信）后才算 M5b
- 排班表：至少覆盖 Root 提交窗口与 pause 决策人
- 人员名单 **人类填写**；本仓库只提供规则与 Runbook（PRODUCTION §4）

---

## 5. 商店签名（wallet / worker）

已有 MetaRepo 命令：`pnpm run build:wallet:android:store`、`build:wallet:ios:store`。  
M5b Runbook：

1. 配置 EAS / 对应商店账号（人类）
2. 生产 `EXPO_PUBLIC_*` 指向主网 8453 与真实 Vault/Escrow
3. 签名构建、上传、审核
4. A 阶段 **不** 以商店上架为收款前置（Web/API 即可）

---

## 6. 从 Beta 切到 public

1. 审计报告公开 + Bounty 页面可访问  
2. 提高或取消 `MAX_*`；清空 `COMMERCIAL_ALLOWLIST`  
3. `COMMERCIAL_MODE=public`  
4. docs 主网地址页 + `/payments/disclosure` 填 8453  
5. 值班表生效  

在此之前产品文案不得使用「商业版 1.0」。
