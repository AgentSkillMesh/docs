# VibeAgent 开发入门

**最后更新**: 2024-10-10

---

## 1. 前置要求

| 工具 | 版本 | 说明 |
|------|------|------|
| Node.js | ≥ 20 LTS | 运行时 |
| pnpm | ≥ 9 | 包管理器 |
| Docker | ≥ 24 | 本地服务 |
| Git | ≥ 2.40 | 版本控制 |
| MetaMask | 最新 | 钱包（测试用） |

可选:
- Foundry (forge) — 合约开发替代 Hardhat
- Go ≥ 1.22 — P2P 组件（后期）

## 2. 快速开始

### 2.1 克隆 MetaRepo

```bash
git clone git@github.com:AgentSkillMesh/VibeAgent.git
cd VibeAgent
./scripts/clone-repos.sh
```

### 2.2 初始化（Shell 脚本）

```bash
# Git Bash / WSL
./scripts/init-meta.sh
```

脚本会检查 Node/pnpm/Git，并在 `repos/*` 各子仓库执行 `pnpm install`。

若远程子仓库已创建，也可：

```bash
./scripts/clone-repos.sh
./scripts/setup-dev.sh
```

### 2.3 各子仓库环境变量

```bash
# 合约
cp repos/contracts/.env.example repos/contracts/.env

# API
cp repos/api/.env.example repos/api/.env

# Web
cp repos/web/.env.example repos/web/.env
```

### 2.4 启动本地服务

```bash
# MySQL（MetaRepo 根目录）
docker compose -f infrastructure/docker/docker-compose.yml up -d

# 文档站
cd repos/docs && pnpm dev

# 合约（新终端）
cd repos/contracts && pnpm node
cd repos/contracts && pnpm deploy:local

# API
cd repos/api && pnpm dev

# Web
cd repos/web && pnpm dev
```

访问:
- 文档站: http://localhost:5173（Rspress）
- 前端 DApp: http://localhost:5174（web）
- API: http://localhost:3000/api/v1/health

### 2.5 运行测试

```bash
cd repos/contracts && pnpm test
cd repos/api && pnpm test
```

## 3. 开发工作流

### 3.1 分支策略

```
main          ← 生产就绪
develop       ← 集成分支
feature/*     ← 功能分支
fix/*         ← 修复分支
release/*     ← 发布分支
```

### 3.2 提交规范

遵循 Conventional Commits:

```
feat(contracts): add SkillRegistry contract
fix(api): resolve escrow indexing race condition
docs: update whitepaper tokenomics section
chore: upgrade libp2p to v1.8
```

### 3.3 PR 流程

1. 从 `develop` 创建 feature 分支
2. 完成开发 + 测试
3. 提交 PR 至 `develop`
4. CI 检查通过（lint, test, build）
5. Code Review 至少 1 人 Approve
6. Squash merge

## 4. 本地开发技巧

### 4.1 获取测试 ETH

```bash
# Base Sepolia Faucet
# https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
```

### 4.2 重置本地链

```bash
pnpm --filter @vibeagent/contracts node:reset
pnpm --filter @vibeagent/contracts deploy:local
pnpm --filter @vibeagent/api db:seed
```

### 4.3 查看链上事件

```bash
pnpm --filter @vibeagent/contracts console
# > await escrow.getEscrow(1)
```

### 4.4 生成合约 TypeScript 类型

```bash
pnpm --filter @vibeagent/contracts typechain
# 输出至 packages/shared/src/contracts/
```

## 5. 常见问题

### Q: pnpm install 失败
确保 Node.js ≥ 20 且 pnpm ≥ 9。尝试 `pnpm store prune && pnpm install`。

### Q: Docker MySQL 连接失败
检查端口 3306 是否被占用: `docker compose logs mysql`。

### Q: 钱包连接失败
确认 `VITE_CHAIN_ID` 与本地链/测试网一致。本地 Hardhat 链 ID 为 31337。

### Q: 合约部署后前端无法交互
运行 `pnpm --filter @vibeagent/contracts export-abi` 更新共享 ABI 包。

## 6. 相关文档

- [MetaRepo 结构](./METAREPO_STRUCTURE.md)
- [API 规范](./API.md)
- [前端开发指南](./FRONTEND.md)
- [系统架构](/technical/architecture/OVERVIEW)
