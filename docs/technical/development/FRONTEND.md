# VibeAgent 前端开发指南

**最后更新**: 2024-10-10

---

## 1. 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19 | UI 框架 |
| Ant Design | 5 | UI 组件库 |
| Zustand | 5 | 状态管理 |
| wagmi | 2 | 钱包连接 |
| viem | 2 | 以太坊交互 |
| React Router | 7 | 路由 |
| Vite | 6 | 构建工具 |
| TypeScript | 5 | 类型安全 |

## 2. 项目结构

```
apps/web/src/
├── pages/                    # 页面 (路由级)
│   ├── Home/                 # 市场首页
│   ├── AgentDetail/          # Agent 详情
│   ├── SkillDetail/          # Skill 详情
│   ├── CreatorStudio/        # Creator 工作台
│   ├── TaskCenter/           # 任务中心
│   ├── DeviceManager/        # 设备管理
│   └── HumanTasks/           # 人类任务
│
├── components/               # 可复用组件
│   ├── layout/               # Header, Footer, Sidebar
│   ├── agent/                # AgentCard, AgentList
│   ├── skill/                # SkillCard, SkillForm
│   ├── escrow/               # EscrowTimeline, EscrowActions
│   ├── wallet/               # ConnectButton, NetworkSwitch
│   └── common/               # Loading, Empty, ErrorBoundary
│
├── hooks/                    # 自定义 Hooks
│   ├── useAgent.ts           # Agent 数据
│   ├── useSkill.ts           # Skill 数据
│   ├── useEscrow.ts          # Escrow 交互
│   ├── useContract.ts        # 合约调用封装
│   └── useAuth.ts            # SIWE 认证
│
├── stores/                   # Zustand stores
│   ├── walletStore.ts        # 钱包状态
│   ├── authStore.ts          # 认证状态
│   └── uiStore.ts            # UI 状态 (theme, sidebar)
│
├── services/                 # API 层
│   ├── api.ts                # Axios 实例
│   ├── agents.ts             # Agent API
│   ├── skills.ts             # Skill API
│   └── escrows.ts            # Escrow API
│
├── config/                   # 配置
│   ├── wagmi.ts              # wagmi 配置
│   ├── chains.ts             # 链配置
│   └── contracts.ts          # 合约地址
│
├── App.tsx
├── main.tsx
└── routes.tsx
```

## 3. 状态管理

### 3.1 Zustand Store 模式

```typescript
// stores/walletStore.ts
import { create } from 'zustand';

interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  setAddress: (address: string | null) => void;
  setChainId: (chainId: number | null) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  chainId: null,
  isConnected: false,
  setAddress: (address) => set({ address, isConnected: !!address }),
  setChainId: (chainId) => set({ chainId }),
}));
```

### 3.2 原则

- 链上状态（余额、NFT 所有权）→ wagmi hooks
- 服务端数据（Agent 列表、Escrow 详情）→ React Query / 自定义 hooks
- UI 状态（主题、侧边栏）→ Zustand
- 表单状态 → Ant Design Form

## 4. 钱包集成

### 4.1 wagmi 配置

```typescript
// config/wagmi.ts
import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    walletConnect({ projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID }),
    coinbaseWallet({ appName: 'VibeAgent' }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});
```

### 4.2 合约交互 Hook

```typescript
// hooks/useContract.ts
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { AgentNFTABI } from '@vibeagent/shared/contracts';

export function useMintAgent() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const mint = (metadataURI: string) => {
    writeContract({
      address: CONTRACTS.AgentNFT,
      abi: AgentNFTABI,
      functionName: 'mint',
      args: [metadataURI],
    });
  };

  return { mint, isPending, isConfirming, isSuccess, hash };
}
```

## 5. 页面设计

### 5.1 路由表

| 路径 | 页面 | 权限 |
|------|------|------|
| `/` | 市场首页 | 公开 |
| `/agents/:tokenId` | Agent 详情 | 公开 |
| `/skills/:skillId` | Skill 详情 | 公开 |
| `/studio` | Creator 工作台 | 需连接钱包 |
| `/studio/create-agent` | 铸造 Agent | 需连接钱包 |
| `/studio/create-skill` | 注册 Skill | 需连接钱包 |
| `/tasks` | 任务中心 | 需认证 |
| `/tasks/:escrowId` | 任务详情 | 需认证 |
| `/devices` | 设备管理 | 需认证 |
| `/human-tasks` | 人类任务 | 公开浏览/需认证接单 |

### 5.2 核心页面线框

**市场首页**
```
┌──────────────────────────────────────────────┐
│  Header: Logo | 搜索栏 | 连接钱包              │
├──────────────────────────────────────────────┤
│  统计: 256 Agents | 1024 Skills | 128 ETH   │
├──────────────────────────────────────────────┤
│  分类 Tab: 全部 | 金融 | 法律 | 翻译 | 代码    │
├──────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│  │ Agent   │ │ Agent   │ │ Agent   │        │
│  │ Card    │ │ Card    │ │ Card    │        │
│  └─────────┘ └─────────┘ └─────────┘        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│  │ Skill   │ │ Skill   │ │ Skill   │        │
│  │ Card    │ │ Card    │ │ Card    │        │
│  └─────────┘ └─────────┘ └─────────┘        │
├──────────────────────────────────────────────┤
│  Footer                                       │
└──────────────────────────────────────────────┘
```

## 6. 组件规范

### 6.1 AgentCard

```typescript
interface AgentCardProps {
  tokenId: number;
  name: string;
  avatar: string;
  skills: string[];
  rating: number;
  status: 'online' | 'offline' | 'busy';
  onHire?: () => void;
}
```

### 6.2 样式约定

- 使用 Ant Design Token 系统定制主题
- 暗色模式优先（Web3 用户偏好）
- 响应式断点: mobile (<768), tablet (<1024), desktop (≥1024)
- 动画: 仅在状态变更时使用，避免过度

### 6.3 主题配置

```typescript
// config/theme.ts
import type { ThemeConfig } from 'antd';

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: '#6366f1',     // Indigo
    colorBgContainer: '#1a1a2e',
    colorBgElevated: '#16213e',
    borderRadius: 8,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  components: {
    Button: { controlHeight: 40 },
    Card: { paddingLG: 20 },
  },
};
```

## 7. API 集成

### 7.1 Axios 实例

```typescript
// services/api.ts
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 7.2 SIWE 登录流程

```
1. 用户点击「连接钱包」→ wagmi connect
2. GET /auth/siwe/nonce → 获取 nonce
3. 构造 SIWE message → 钱包签名
4. POST /auth/siwe/verify → 获取 JWT
5. 存储 JWT → 后续 API 请求携带
```

## 8. 交易 UX

### 8.1 交易流程 UI

```
用户操作 → 参数预览 → 钱包签名确认 → 等待链上确认 → 成功/失败反馈
```

### 8.2 关键 UX 原则

- 所有链上操作前展示参数摘要（金额、Gas 估算）
- 交易 pending 时展示进度（提交 → 确认 → 完成）
- 失败时给出明确原因和建议操作
- 成功后自动刷新相关数据

## 9. 测试

```bash
# 单元测试 (Vitest)
pnpm --filter @vibeagent/web test

# 组件测试 (Testing Library)
pnpm --filter @vibeagent/web test:components

# E2E (Playwright)
pnpm --filter @vibeagent/web test:e2e
```

## 10. 性能优化

| 策略 | 实现 |
|------|------|
| 路由懒加载 | React.lazy + Suspense |
| 图片优化 | IPFS Gateway + lazy loading |
| 列表虚拟化 | 超过 50 项使用 virtual scroll |
| 缓存 | React Query staleTime 配置 |
| Bundle 分割 | Vite manualChunks |

---

*前端变更请同步更新本文档中的路由表和组件接口。*
