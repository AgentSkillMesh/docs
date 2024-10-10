---
syncSource: VibeAgent MetaRepo spec/
doNotEdit: 璇蜂慨鏀?MetaRepo spec/ 鍚庨噸鏂拌繍琛?scripts/sync-spec-to-docs.ps1
---

> **瑙勮寖婧愭枃浠?*锛氱敱 MetaRepo `spec/` 鍚屾锛岃鍕跨洿鎺ョ紪杈戞湰椤点€?
# 综合端 App 规格（React Native）

**版本**: v0.1-draft  
**仓库**: `repos/worker` → `AgentSkillMesh/worker`（私有）

---

## 1. 定位

面向 **任务执行者** 的 **综合接单 App**：

1. **AI Agent 众包任务**（人类任务）：拍照、视频、问卷、GPS  
2. **社交平台任务**：在抖音、小红书、知乎等完成 **点赞、观看、收藏** 等（用户自愿、账号自有）  
3. **收益**：Escrow 结算至绑定钱包地址  

发单在 **wallet App**；本 App **仅接单与交付**。

## 2. 社交平台任务（无障碍辅助）

### FR-WRK-010 能力说明

通过 Android **无障碍服务（Accessibility Service）**（及 iOS 合规替代方案调研）：

- 在用户 **明确授权** 后，辅助跳转到目标 App  
- 引导完成 **可验证步骤**（如：打开指定视频 → 停留 N 秒 → 点赞）  
- 生成交付凭证：截图时间戳 + 步骤完成标记（**不上传** 聊天记录、密码）

### FR-WRK-011 合规与安全

- 首次启用需阅读风险提示 + 系统无障碍授权  
- 禁止自动化批量注册、破解、窃取数据  
- 任务必须来自 **已 published** 且通过风控的订单  
- 平台 **不提供** 绕过目标 App 安全机制的能力  

### FR-WRK-012 交付验证

- 必填：结果截图（含平台 UI 特征）  
- 可选：无障碍事件序列 hash  
- API 校验 → 链上/链下确认 → Escrow 放款  

### 支持平台（规划）

| 平台 | 任务示例 | 版本 |
|------|----------|------|
| 抖音 | 观看、点赞 | v0.4 |
| 小红书 | 浏览、点赞、收藏 | v0.4 |
| 知乎 | 阅读、赞同 | v0.5 |

## 3. Agent 众包任务

与 ex-WALLET §FR-WL-002~004 相同：

- 任务大厅（仅 `published`）  
- 接单、拍照/视频/问卷、GPS  
- 收益页  

见 [用户文档 · 人类任务](../repos/docs/docs/users/human-tasks.md)。

## 4. 功能需求摘要

| ID | 内容 |
|----|------|
| FR-WRK-001 | 绑定收款地址（只读展示，可从 wallet 导入同一助记词） |
| FR-WRK-002 | 任务大厅（human + social 分 Tab） |
| FR-WRK-003 | 众包交付（相机/GPS/问卷） |
| FR-WRK-004 | 社交任务引导 + 无障碍流程 |
| FR-WRK-005 | 收益与历史 |
| FR-WRK-006 | 推送（v0.4） |

## 5. 技术栈

- React Native · Expo（**独立工程**，与 wallet 分仓库）  
- 原生模块：`expo-camera`、`expo-location`  
- Android：Accessibility Service（**原生 Kotlin 模块**，v0.4）  
- `api`：`GET /tasks?status=published&type=social|human`  

## 6. 里程碑

| 版本 | 交付 |
|------|------|
| v0.3 | 众包任务大厅 + 拍照交付（从 wallet 迁移） |
| v0.4 | 社交任务 MVP（抖音观看/点赞）+ 无障碍 |
| v0.5 | 多平台扩展 |

---

*代码可从 `repos/wallet` 众包模块迁移为初始实现。*

