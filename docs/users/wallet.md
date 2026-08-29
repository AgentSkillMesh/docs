---
title: 钱包 App
---

# 钱包 App：发任务与管资产

面向 **付钱发任务、管理链上资产** 的用户。本 App **不含接单**——接单请用 [综合端 worker](/users/worker)。

## 你能做什么

| 功能 | 说明 |
|------|------|
| **转账** | ETH / USDC 等收发 |
| **收益与流水** | Escrow 支出、结算记录；接单方交付后可在此 **验收** 或开争议 |
| **发布任务** | 填写需求 → 确认清单 → **提交平台审核** |
| **买币入金** | 合规 Onramp Widget（法币买加密资产） |

## 发布任务怎么走

人类众包须写清说明；线下到场可填地点（接单方交付须附 GPS）。社交任务须声明 App 与步骤。

```
填写任务与报酬 → 勾选确认项 → 提交审核
        ↓
简单任务：自动过审上架
复杂任务：运营人工审核后上架
危险 / 违规：告警拦截，不会自动发布
        ↓
仅「已发布」任务对执行者可见，并锁定 Escrow
```

社交刷量、违禁等内容默认进入高危审核，详见 [任务治理与审批](/platform/task-governance)。

## Base Sepolia 链上 Escrow（本机点击）

当前 Expo wallet **不会**连接 MetaMask，只使用 demo 发单地址  
`0xa294bFF1c19Fc0CbbBC60F0b9d15e8EAFB81e359`。  
测试 ETH 若在别的地址（例如 `0xe4bD…`），须先用该钱包转到上面的 demo 地址。

1. MetaMask 切到 **Base Sepolia (84532)**，从有余额的地址转入 **0.03–0.05 ETH** 到 `0xa294…`。
2. 终端：`pnpm run use:sepolia`（若尚未切换）→ `pnpm run dev:api` → `pnpm run dev:wallet` → `pnpm run dev:worker`。
3. **wallet**：连接钱包 → **发任务** → 受众「人类」、关闭社交、打开「发单方验收后再结算」→ 标题 + 说明 + 报酬 `0.008` → 勾选确认 → **提交平台审核**。小额人类单通常自动上架。
4. **worker**：连接接单钱包 → **众包** → 打开该任务 → **接单**。
5. **wallet → 收益**：该任务变为已接单后点 **链上锁定报酬（fund Escrow）** → **确认锁定**。Basescan 应出现 `createEscrow` + `fundEscrow`。
6. **worker**：拍照（须验收任务）→ **交付**（会先链上 `deliverEscrow` 再提交 API）。
7. **wallet → 收益**：点 **验收并放款**。任务 `completed`，Escrow 把报酬打到 **worker 当前 demo 地址**（连接 wallet 后首页可见；**不要**用公开 Hardhat `#1`，公共测试网上会被转走）。

第一次不要走社交任务（须 Logto 人工审）。不要重部 Escrow。

**自动测（推荐）**：wallet/worker 是 Expo，不用 Playwright 点 App。链上闭环用：

```bash
pnpm run demo:worker:sepolia   # 若接单钥仍是 Hardhat #1：轮换并打 0.002 ETH Gas
pnpm run smoke:escrow:check    # 只检查合约与 demo 地址余额
pnpm run dev:api               # 另开终端
pnpm run smoke:escrow          # 真发 Sepolia 交易（约锁定 0.008 ETH）
```

运营台网页登录才用 Playwright：`pnpm run e2e:admin`（需 `pnpm id:up`）。

## 与 worker 的分工

| | 钱包 App | 综合端 worker |
|--|----------|---------------|
| 发任务 | ✅ | ❌ |
| 接单 | ❌ | ✅ |
| 资产 / 转账 | ✅ | 收款为主 |

## 规格与下载

技术规格：[WALLET](/technical/WALLET)

[返回用户总览](/users/)
