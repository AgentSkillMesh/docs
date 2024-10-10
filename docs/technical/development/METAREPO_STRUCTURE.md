---
title: MetaRepo 工作区
---

# MetaRepo 本地工作区

**完整仓库关系、依赖图、跨仓 PR 顺序** 请以 [仓库关系 REPOS](/technical/REPOS) 为准（与 MetaRepo `spec/REPOS.md` 同步）。

## 快速结构

```
VibeAgent/                 # MetaRepo（私有）
├── spec/                  # 规范源 · Spec 驱动开发
├── repos.manifest.json
├── scripts/
└── repos/
    ├── docs/              # 公开
    ├── contracts/
    ├── api/
    ├── web/
    ├── p2p/
    └── shared/
```

## 常用脚本

```bash
./scripts/init-meta.sh       # 安装依赖
./scripts/clone-repos.sh     # 克隆子仓库
./scripts/sync-spec-to-docs.sh  # spec → 本 docs 站
```

Windows：`sync-spec-to-docs.ps1`、`dev-mvp.ps1`。

## VS Code

打开根目录 `vibe-agent.code-workspace` 可多根加载 MetaRepo 与各 `repos/*`。

---

*原 Turborepo 单仓方案已废弃。*
