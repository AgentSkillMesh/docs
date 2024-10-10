---
syncSource: VibeAgent MetaRepo spec/
doNotEdit: 璇蜂慨鏀?MetaRepo spec/ 鍚庨噸鏂拌繍琛?scripts/sync-spec-to-docs.ps1
---

> **瑙勮寖婧愭枃浠?*锛氱敱 MetaRepo `spec/` 鍚屾锛岃鍕跨洿鎺ョ紪杈戞湰椤点€?
# 工具链规范

**最后更新**: 2025-01-14

| 仓库 | 构建 | 测试 | 代码规范 |
|------|------|------|----------|
| **docs** | [Rspress](https://rspress.rs/) | — | Biome |
| **web** | [Rsbuild](https://rsbuild.rs/) + React | [Rstest](https://rstest.rs/) | Biome |
| **api** | NestJS CLI（`nest build`） | Jest（逐步迁 Rstest） | Biome |
| **shared** | [Rslib](https://lib.rsbuild.dev/) | Rstest | Biome |
| **p2p** | Rslib | Rstest | Biome |
| **contracts** | Hardhat | `hardhat test` | Biome（仅 TS 脚本） |
| **wallet** | Expo / Metro（React Native） | Jest | Biome |
| **worker** | Expo / Metro（React Native） | Jest | Biome |
| **admin** | Rsbuild + React + Ant Design | Rstest（规划） | Biome |

## 原则

- **文档**：只用 Rspress，不用 Vite 跑文档站。
- **前端 / 库**：优先 Rsbuild 生态（Rsbuild、Rslib），不新增 Vite/Webpack 配置。
- **格式化与 Lint**：统一 [Biome](https://biomejs.dev/)，不引入 ESLint + Prettier 双栈。
- **变更规范**：先改 `spec/`，再改实现，最后 `sync-spec-to-docs`。

## 常用命令

```bash
pnpm check    # biome check（各仓）
pnpm format   # biome format --write
pnpm build    # 构建
pnpm test     # 测试（rstest / jest / hardhat）
```

MetaRepo 同步 Biome 配置：

```powershell
.\scripts\sync-tooling.ps1
```

