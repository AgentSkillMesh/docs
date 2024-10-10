# docs · VibeAgent 官方文档

[AgentSkillMesh](https://github.com/AgentSkillMesh) 组织下的公开文档仓库，基于 [Rspress](https://rspress.rs/)。

**在线地址**：https://agentskillmesh.github.io/docs/

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
git clone https://github.com/AgentSkillMesh/docs.git
cd docs
pnpm install --ignore-scripts && pnpm dev
```

MetaRepo 编排见 [AgentSkillMesh/VibeAgent](https://github.com/AgentSkillMesh/VibeAgent)。

## License

MIT
