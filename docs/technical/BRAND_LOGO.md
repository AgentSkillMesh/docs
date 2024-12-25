---
syncSource: VibeAgent MetaRepo spec/
doNotEdit: 请修改 MetaRepo spec/ 后重新运行 scripts/sync-spec-to-docs.ps1
---

> **规范源文件**：由 MetaRepo spec/ 同步，请勿直接编辑本页。

# DoerFlow Logo 品牌标识规范

**版本**: v1.0 · **最后更新**: 2025-01-14  
**规范源**: `spec/brand/`（资产同步至各子仓，勿在各仓单独改版）

---

## 1. 设计语义

DoerFlow Logo Mark 表达 **Agent 劳动网络**（Agent Labor Network）：

| 元素 | 含义 |
|------|------|
| 圆角方形容器 | 协议边界、可组合模块 |
| 青绿 → 紫色渐变描边 | 品牌主色流动（价值结算） |
| 三个节点 | Agent、Skill、Worker / 发布方·执行方·协调方 |
| 三角连接 | 任务从创建到链上结算的闭环 |

**不是**旧版紫色六边形网络图（已废弃，勿复用）。

---

## 2. 色彩

| Token | 色值 | 用途 |
|-------|------|------|
| Primary | `#00D4AA` | 节点、强调、主按钮 |
| Purple | `#7C3AED` | 渐变终点、次要节点 |
| Background | `#0B1120` | 深色底、favicon / App Icon 背景 |
| Text | `#E7ECF3` | 字标「DoerFlow」 |
| Muted | `#8B97AD` | 副标题「Agent Labor Network」 |

渐变：`linear-gradient(用户空间, #00D4AA 0%, #7C3AED 100%)`，方向 135°（左上→右下）。

---

## 3. 资产文件（规范源）

路径均在 MetaRepo `spec/brand/`：

| 文件 | 尺寸 | 用途 |
|------|------|------|
| `logo-mark.svg` | 40×40 viewBox | **默认**：导航、页眉、文档站、内联展示 |
| `icon.svg` | 40×40 + 深色底 | 浏览器 favicon、Next.js `app/icon.svg` |
| `github-org-avatar.svg` | 560×560 | GitHub 组织头像、App Store 类方形场景 |

同步命令：

```powershell
.\scripts\sync-brand-assets.ps1
```

---

## 4. 各仓库如何使用

### 4.1 规则（必须遵守）

1. **只使用** `logo-mark.svg` 或规范生成的 PNG，禁止占位字母「D」、VibeAgent 旧标、Next.js 默认图标。
2. **不要**在子仓内修改 SVG 源文件；变更只在 `spec/brand/` 编辑后运行同步脚本。
3. **字标**写为 `DoerFlow`（D+F 大写），副标题英文 `Agent Labor Network`。
4. 需要 React 组件时，使用各仓已有的 `BrandLogo` / `Logo` 组件，内部引用 `/brand/logo-mark.svg`（或 Expo `assets/brand/logo-mark.svg`）。

### 4.2 按仓库

| 仓库 | 资产路径 | 组件 | Favicon / App Icon |
|------|----------|------|-------------------|
| **site** | `public/brand/logo-mark.svg` | `components/site/logo.tsx` | `app/icon.svg` |
| **docs** | `docs/public/logo-mark.svg` | Rspress `logo` / `icon` 配置 | 同左 |
| **admin** | `public/brand/logo-mark.svg` | `components/brand/logo.tsx` | `app/icon.svg` |
| **web** | `public/brand/logo-mark.svg` | `src/components/brand/Logo.tsx` | `public/favicon.png`（由脚本生成） |
| **wallet** | `assets/brand/logo-mark.svg` | 按需 `Image` | `assets/icon.png`（脚本生成） |
| **worker** | `assets/brand/logo-mark.svg` | 按需 `Image` | `assets/icon.png`（脚本生成） |

### 4.3 最小使用示例

**Next.js / Rsbuild（img）**

```tsx
<img src="/brand/logo-mark.svg" width={28} height={28} alt="DoerFlow" />
```

**Rspress**（`rspress.config.ts`）

```ts
icon: '/logo-mark.svg',
logo: '/logo-mark.svg',
logoText: 'DoerFlow',
```

**Expo**（`app.json`）

```json
"icon": "./assets/icon.png",
"splash": { "image": "./assets/splash-icon.png", "resizeMode": "contain", "backgroundColor": "#0B1120" }
```

---

## 5. 禁止事项

- 拉伸变形、改色、加描边阴影（除规范渐变外）
- 在浅色底上使用未调整对比度的 mark（必要时用带 `#0B1120` 底的 `icon.svg`）
- 与 LuminaryWorks 姊妹产品 Logo 混搭
- 在 `spec/` 外单独维护第二套品牌 SVG

---

## 6. 追溯

- 官网实现：`repos/site/components/site/logo.tsx`
- 公开说明：`repos/docs/docs/brand/logo.md`
- 同步脚本：`scripts/sync-brand-assets.ps1`
