---
syncSource: VibeAgent MetaRepo spec/
doNotEdit: 璇蜂慨鏀?MetaRepo spec/ 鍚庨噸鏂拌繍琛?scripts/sync-spec-to-docs.ps1
---

> **瑙勮寖婧愭枃浠?*锛氱敱 MetaRepo `spec/` 鍚屾锛岃鍕跨洿鎺ョ紪杈戞湰椤点€?
# 本地开发端口

**默认 API 端口 `13008`**（避免与多项目默认 3000 冲突）。各仓通过环境变量覆盖。

| 服务 | 端口 | 环境变量 |
|------|------|----------|
| **API** | **13008** | `PORT` |
| Site 官网 | 13010 | `next dev --port` |
| Admin 运营台 | 13011 | `next dev --port` |
| Web DApp | 5174 | Rsbuild dev |
| Hardhat | 8545 | — |
| Expo Metro | 8081+ | — |

```bash
# API
PORT=13008

# 客户端指向 API
EXPO_PUBLIC_API_URL=http://localhost:13008/api/v1
VITE_API_URL=http://localhost:13008
```

真机调试时将 `localhost` 换为电脑局域网 IP。

