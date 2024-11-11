import path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: 'docs',
  base: '/',
  globalStyles: path.join(__dirname, 'styles/index.css'),
  title: 'VibeAgent',
  description: 'Agent Economy 去中心化市场 — 让人、设备、技能、企业都能在 AI 时代赚钱',
  icon: '/logo.png',
  logo: '/logo.png',
  logoText: 'VibeAgent',
  themeConfig: {
    nav: [
      { text: '用户赚钱', link: '/users/' },
      { text: '开发者', link: '/developers/' },
      { text: '平台优势', link: '/platform/' },
      { text: '愿景规划', link: '/vision/' },
      { text: '白皮书', link: '/whitepaper/' },
      { text: '技术文档', link: '/technical/' },
      { text: 'GitHub', link: 'https://github.com/doerflow' },
    ],
    sidebar: {
      '/': [
        {
          text: '首页',
          items: [{ text: 'VibeAgent 是什么', link: '/' }],
        },
        {
          text: '快速入口',
          items: [
            { text: '我想赚钱（用户）', link: '/users/' },
            { text: '我是开发者', link: '/developers/' },
            { text: '项目白皮书', link: '/whitepaper/' },
          ],
        },
      ],
      '/users/': [
        {
          text: '用户指南 · 在 AI 时代赚钱',
          items: [
            { text: '总览', link: '/users/' },
            { text: '钱包 App（发任务）', link: '/users/wallet' },
            { text: '综合端 worker（接单）', link: '/users/worker' },
            { text: '人类任务赚钱', link: '/users/human-tasks' },
            { text: '社交平台任务', link: '/users/social-tasks' },
            { text: '闲置算力赚钱', link: '/users/compute' },
            { text: 'Skill 创造者', link: '/users/skill-creator' },
            { text: '企业与云 AI', link: '/users/enterprise' },
          ],
        },
      ],
      '/developers/': [
        {
          text: '开发者',
          items: [
            { text: '总览', link: '/developers/' },
            { text: '开源与安全', link: '/developers/open-source-security' },
            { text: '开发者如何赚钱', link: '/developers/monetization' },
            { text: '参与贡献', link: '/developers/contribute' },
            { text: 'IoT SDK（规划）', link: '/developers/iot-sdk' },
            { text: 'Agent 交易 SDK', link: '/developers/agent-trading-sdk' },
            { text: 'Onramp SDK（规划）', link: '/developers/onramp-sdk' },
          ],
        },
      ],
      '/platform/': [
        {
          text: '平台说明',
          items: [
            { text: '为什么选择我们', link: '/platform/' },
            { text: '任务治理与审批', link: '/platform/task-governance' },
            { text: '物联网交易市场', link: '/platform/iot-marketplace' },
            { text: 'MetaDEX（ve DEX）', link: '/platform/metadex' },
            { text: '跨链与资产互通', link: '/platform/bridge-connectivity' },
            { text: '法币买币 Onramp', link: '/platform/fiat-onramp' },
            { text: 'Agent 异步支付', link: '/platform/async-payments' },
            { text: '生态壮大', link: '/platform/ecosystem-growth' },
            { text: '运营管理平台', link: '/platform/admin-console' },
            { text: '架构与设计', link: '/platform/architecture' },
            { text: '安全与透明', link: '/platform/security' },
          ],
        },
      ],
      '/vision/': [
        {
          text: '愿景与规划',
          items: [
            { text: '项目愿景', link: '/vision/' },
            { text: '发展路线图', link: '/vision/roadmap' },
            { text: '投资者叙事', link: '/vision/investors' },
          ],
        },
      ],
      '/whitepaper/': [
        {
          text: '产品白皮书',
          items: [{ text: '完整白皮书', link: '/whitepaper/' }],
        },
      ],
      '/technical/': [
        {
          text: '技术文档',
          items: [
            { text: '技术索引', link: '/technical/' },
            { text: '技术规格 SPEC', link: '/technical/SPEC' },
            { text: '仓库关系 REPOS', link: '/technical/REPOS' },
            { text: '需求追溯', link: '/technical/traceability' },
            { text: '技术路线图', link: '/technical/ROADMAP' },
            { text: '工具链', link: '/technical/TOOLCHAIN' },
            { text: '客户端总览 CLIENTS', link: '/technical/CLIENTS' },
            { text: '任务系统 TASK_SYSTEM', link: '/technical/TASK_SYSTEM' },
            { text: '任务治理', link: '/technical/TASK_GOVERNANCE' },
            { text: '等级费率 AA', link: '/technical/FEE_TIERS_AA' },
            { text: '本地端口 PORTS', link: '/technical/PORTS' },
            { text: '物联网 IOT', link: '/technical/IOT' },
            { text: 'Agent 专用链', link: '/technical/AGENT_CHAIN' },
            { text: '生态策略 ECOSYSTEM', link: '/technical/ECOSYSTEM' },
            { text: 'MetaDEX', link: '/technical/METADEX' },
            { text: 'MetaDEX 合约计划', link: '/technical/METADEX_CONTRACTS' },
            { text: 'MetaDEX 架构', link: '/technical/METADEX_ARCHITECTURE' },
            { text: 'DataLuminary 外接', link: '/technical/DATALUMINARY' },
            { text: '跨链 BRIDGE', link: '/technical/BRIDGE' },
            { text: '法币 ONRAMP', link: '/technical/ONRAMP' },
            { text: '异步支付 ASYNC_PAYMENTS', link: '/technical/ASYNC_PAYMENTS' },
            { text: '钱包规格 WALLET', link: '/technical/WALLET' },
            { text: '综合端 WORKER', link: '/technical/WORKER' },
            { text: '管理平台 ADMIN', link: '/technical/ADMIN' },
            { text: '系统架构', link: '/technical/architecture/OVERVIEW' },
            { text: '智能合约', link: '/technical/architecture/SMART_CONTRACTS' },
            { text: 'P2P 网络', link: '/technical/architecture/P2P_NETWORK' },
            { text: '开发入门', link: '/technical/development/GETTING_STARTED' },
            { text: 'MetaRepo', link: '/technical/development/METAREPO_STRUCTURE' },
            { text: 'API', link: '/technical/development/API' },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/doerflow/docs',
      },
    ],
    footer: {
      message: 'DoerFlow · doerflow.dev · MIT',
    },
  },
});
