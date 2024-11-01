# docs · DoerFlow 官方文档

[doerflow](https://github.com/doerflow) 组织下的公开文档仓库，基于 [Rspress](https://rspress.rs/)。

**在线地址**：https://docs.doerflow.dev

## 开发

```bash
pnpm install --ignore-scripts
pnpm dev          # http://localhost:5173
pnpm exec rspress build
pnpm preview
```

GitHub Pages 在 push `main` 后由 `.github/workflows/deploy.yml` 自动部署。

## 目录

```
docs/
├── users/          用户赚钱指南
├── developers/     开发者与安全、变现
├── platform/       平台优势与架构
├── vision/         愿景、路线图、投资者
├── whitepaper/     产品白皮书入口
└── technical/      SPEC、合约、API、开发入门
```

## Clone

```bash
git clone https://github.com/doerflow/docs.git
cd docs
pnpm install --ignore-scripts && pnpm dev
```

MetaRepo 编排见 [doerflow/VibeAgent](https://github.com/doerflow/VibeAgent)（私有）。

## 部署（GitHub Pages · docs.doerflow.dev）

### 一次性配置

1. GitHub 仓库 `doerflow/docs` → Settings → Pages → Source: **GitHub Actions**
2. Settings → Pages → Custom domain：`docs.doerflow.dev`（会写入 `docs/public/CNAME`）
3. DNS：`docs` CNAME → `doerflow.github.io`（或 GitHub Pages 提示的目标）
4. `rspress.config.ts` 中 `base: '/'`（自定义域名根路径，非 `/docs/` 子路径）

## License

MIT
