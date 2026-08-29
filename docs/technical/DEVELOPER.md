---
syncSource: VibeAgent MetaRepo spec/
doNotEdit: 请修改 MetaRepo spec/ 后重新运行 scripts/sync-spec-to-docs.sh
---

> **规范源文件**：由 MetaRepo `spec/` 同步，请勿直接编辑本页。

# 开发者接入（Agent Trading SDK · M4）

**版本**: v0.4 · **最后更新**: 2026-08-29  
**关联**: [ASYNC_PAYMENTS.md](./ASYNC_PAYMENTS.md) · [ROADMAP.md](./ROADMAP.md) · [SPEC.md](./SPEC.md) §8.1

第三方 **无 App** 即可：发现 Skill → 报价 → Session Key 授权 → `signReceipt` → 链下记账 → 参与 Merkle 清算。

公开叙事页：[docs/developers/agent-trading-sdk](https://docs.doerflow.dev/developers/agent-trading-sdk)（`repos/docs`，非本文件自动同步）。

---

## 1. 包

| 语言 | 包 | 入口 |
|------|-----|------|
| TypeScript | `@vibe-agent/shared/sdk` | `repos/shared/src/sdk` |
| Python | `doerflow` | MetaRepo `sdk/python` |

底层收据类型仍从 `@vibe-agent/shared/payments` 导出（`signReceipt` / Merkle）。

---

## 2. REST（`/api/v1`）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/trading/catalog` | Agent + Skill 目录；无链上 Skill 时含 `demo` 技能 |
| POST | `/trading/quote` | `{ skillId, units }` → 金额、资产、payee、`resourceId` |
| POST | `/trading/jobs` | 创建计费作业；返回 `jobId` + 须写入收据的 `resourceId`（SQLite 持久化） |
| POST | `/trading/jobs/:id/execute` | 云适配器执行（幂等）；写入 `execution.outputCid` |
| GET | `/trading/jobs/:id` | 作业状态（`open` → `settled` 当收据 `resourceId` 匹配） |
| GET | `/channels` | 五通道矩阵 |
| GET | `/openapi.json` | OpenAPI 3.1 |
| GET | `/trading/events?jobId=` | SSE 作业事件 |
| WS | `/trading/ws` | WebSocket 作业事件（`{"jobId"}` 订阅） |
| POST | `/payments/sessions` | 注册 Session Key（EIP-712 `SessionAuthorization`） |
| POST | `/payments/receipts` | 提交已签名收据（payer = session key） |
| GET | `/payments/ledger/balances?account=` | 链下余额 |
| POST | `/payments/ledger/snapshot?enqueue=0` | Merkle Root（`PaymentServiceGuard`） |
| GET | `/payments/ledger/proof?account=&asset=` | 强制提现 proof |
| GET | `/ready` | 生产就绪探针（k8s） |
| GET | `/live` | 存活探针 |

企业回调：创建 job 时带 `callbackUrl`；结算后 POST **CloudEvents 1.0** JSON，头 `X-DoerFlow-Signature: sha256=<hmac>`（`TRADING_WEBHOOK_SECRET`）。信封含 `id` / `source` / `type` / `data`。

五通道实验室（P0–P4）：`GET /channels` · `GET /openapi.json` · `POST /mcp` · `GET /a2a/agent-card` · `POST /trading/jobs/:id/execute` · `/endpoints` · `/devices`。验收：`pnpm run smoke:channels`。

---

## 3. TypeScript 最短路径

```ts
import { DoerFlowClient } from "@vibe-agent/shared/sdk";
import { privateKeyToAccount } from "viem/accounts";

const api = new DoerFlowClient({ baseUrl: "http://localhost:13008/api/v1" });
const owner = privateKeyToAccount(process.env.OWNER_KEY);
const session = privateKeyToAccount(process.env.SESSION_KEY);

const quote = await api.quote({ skillId: "0", units: 1 });
const job = await api.createJob({ skillId: quote.skillId, units: 1 });
await api.authorizeSession({
  owner,
  session,
  allowedPayees: [quote.payee],
  maxAmountPerCall: quote.amount,
  sessionBudget: quote.amount,
});
const paid = await api.payQuote({ session, quote, resourceId: job.resourceId });
const snap = await api.snapshot({ serviceToken: process.env.PAYMENT_SERVICE_JWT, enqueue: false });
```

本机验收：`pnpm run smoke:m4`（API 须已启动）。五通道实验室：`pnpm run smoke:channels`。示例 Runtime：`pnpm run example:agent`。

---

## 4. Python

```bash
pip install -e sdk/python
# 签名可选：pip install -e "sdk/python[sign]"
```

```python
from doerflow import DoerFlowClient
client = DoerFlowClient("http://localhost:13008/api/v1")
print(client.catalog()["skills"][0]["skillId"])
print(client.quote("0", 1)["amount"])
```

EIP-712 签名优先用 TS SDK；Python `eth-account` extra 提供 `sign_receipt`。

---

## 5. AI 验收（M4）

> ① SDK 在无 App 情况下完成至少一笔链下微支付记账并出现在 Merkle 快照 / proof 中；  
> ② 人类发单→审批→接单→结算由 `pnpm run smoke:m3` 覆盖；  
> ③ 本页 + 公开 `agent-trading-sdk` 可按步骤复现。
