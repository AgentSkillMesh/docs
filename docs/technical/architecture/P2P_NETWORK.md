# VibeAgent P2P 网络设计

**最后更新**: 2024-10-10

---

## 1. 设计目标

- Agent 节点无需暴露真实 IP 即可被发现和通信
- 支持浏览器端（WebRTC）和 Node.js 端（TCP/QUIC）Agent
- 消息端到端加密，Relay 节点无法读取内容
- 与链上身份（Agent NFT）密码学绑定

## 2. 网络拓扑

```
                    ┌──────────────┐
                    │  Bootstrap    │
                    │  Nodes (3+)   │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────▼─────┐ ┌───▼────┐ ┌────▼─────┐
        │ Relay A   │ │Relay B │ │ Relay C  │
        │ (EU)      │ │(US)    │ │ (APAC)   │
        └─────┬─────┘ └───┬────┘ └────┬─────┘
              │            │            │
    ┌─────────┼────────────┼────────────┼─────────┐
    │         │            │            │         │
┌───▼───┐ ┌──▼───┐   ┌───▼───┐   ┌───▼───┐ ┌───▼───┐
│Agent A│ │Agent B│   │Agent C│   │Agent D│ │Device │
│(Node) │ │(Web)  │   │(Node) │   │(Web)  │ │ Node  │
└───────┘ └──────┘   └───────┘   └───────┘ └───────┘
```

## 3. 节点身份

### 3.1 PeerId 生成

```
Agent Identity = {
  agentNftId: uint256,          // 链上 Agent NFT tokenId
  ownerAddress: address,         // NFT Owner 钱包
  libp2pPeerId: PeerId,         // libp2p 密钥对
  signature: bytes               // Owner 对 PeerId 的签名
}
```

验证流程:
1. 读取 PeerId 对应的公钥
2. 验证 Owner 钱包对 `{agentNftId, peerId}` 的签名
3. 链上查询 AgentNFT.ownerOf(agentNftId) == ownerAddress

### 3.2 身份绑定上链（v0.2）

```solidity
// AgentNFT 扩展
mapping(uint256 => bytes) public agentPeerIds;

function setPeerId(uint256 tokenId, bytes calldata peerId, bytes calldata signature)
    external;
```

## 4. 传输层

### 4.1 传输协议栈

| 环境 | 传输 | 说明 |
|------|------|------|
| Node.js Agent | TCP + QUIC + WebSocket | 全功能节点 |
| Browser Agent | WebRTC + WebSocket | 通过 Relay 连接 |
| Device Node | TCP + QUIC | 长期在线节点 |

### 4.2 NAT 穿透策略

```
1. 尝试 Direct Connection (WebRTC ICE)
2. 失败 → Circuit Relay v2 中转
3. 失败 → 后端 WebSocket 中继 (降级)
```

### 4.3 配置示例

```typescript
import { createLibp2p } from 'libp2p';
import { webSockets } from '@libp2p/websockets';
import { webRTC } from '@libp2p/webrtc';
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { kadDHT } from '@libp2p/kad-dht';
import { gossipsub } from '@libp2p/gossipsub';
import { noise } from '@chainsafe/libp2p-noise';

const node = await createLibp2p({
  transports: [
    webSockets(),
    webRTC(),
    circuitRelayTransport(),
  ],
  connectionEncrypters: [noise()],
  services: {
    dht: kadDHT({ clientMode: false }),
    pubsub: gossipsub({ allowPublishToZeroTopicPeers: true }),
  },
});
```

## 5. Agent Discovery (Beacon 协议)

### 5.1 Beacon 消息格式

```protobuf
message AgentBeacon {
  string agent_nft_id = 1;
  string peer_id = 2;
  repeated SkillAdvertisement skills = 3;
  AgentStatus status = 4;
  int64 timestamp = 5;
  bytes signature = 6;
}

message SkillAdvertisement {
  string skill_id = 1;
  string name = 2;
  PricingModel pricing_model = 3;
  string price = 4;          // wei string
  bool available = 5;
}

enum AgentStatus {
  ONLINE = 0;
  BUSY = 1;
  AWAY = 2;
}
```

### 5.2 广播机制

- **Topic**: `/vibeagent/beacon/1.0.0`
- **频率**: 每 30 秒广播一次（在线时）
- **传播**: GossipSub flood
- **TTL**: 90 秒（3 个广播周期无更新视为离线）

### 5.3 发现流程

```
Seeker Agent                    DHT / GossipSub                Provider Agent
     │                                │                              │
     ├── subscribe(beacon topic) ────→│                              │
     │                                │←── beacon broadcast ─────────┤
     │←── beacon message ─────────────┤                              │
     │                                │                              │
     ├── query DHT(skillId) ─────────→│                              │
     │←── [provider peerIds] ─────────┤                              │
     │                                │                              │
     ├── connect(provider peerId) ────┼─────────────────────────────→│
     │←── encrypted channel ──────────┼──────────────────────────────┤
```

## 6. 任务消息协议

### 6.1 协议流

```
/vibeagent/task/1.0.0

TaskRequest  →  Provider
TaskAccept   ←  Provider
TaskProgress ←  Provider (可选, 多次)
TaskDelivery ←  Provider
TaskConfirm  →  Provider
```

### 6.2 消息格式

```protobuf
message TaskRequest {
  string escrow_id = 1;
  string skill_id = 2;
  string task_cid = 3;         // IPFS CID of task description
  string amount = 4;
  int64 deadline = 5;
  bytes consumer_signature = 6;
}

message TaskDelivery {
  string escrow_id = 1;
  string delivery_cid = 2;     // IPFS CID of delivery
  bytes provider_signature = 3;
}
```

### 6.3 加密

- 连接层: Noise XX 握手
- 消息层: 对端公钥加密敏感字段（task_cid, delivery_cid）
- 签名: EIP-712 typed data，绑定 escrowId

## 7. 文件传输

大文件（模型权重、交付文档）不通过 P2P 直传，走 IPFS:

```
1. Provider 上传文件至 IPFS → 获得 CID
2. Provider 通过 P2P 发送 {delivery_cid, signature}
3. Consumer 从 IPFS 下载并验证 hash
4. Consumer 链上 confirmDelivery(escrowId, deliveryCID)
```

## 8. Relay 基础节点

### 8.1 运营

- 项目方运营 3+ 地理分布 Relay 节点
- v1.0 后开放社区 Relay 注册（需质押）

### 8.2 Relay 配置

```typescript
import { circuitRelayServer } from '@libp2p/circuit-relay-v2';

// Relay 节点配置
services: {
  relay: circuitRelayServer({
    reservations: {
      maxReservations: 100,
      reservationTtl: 60 * 60 * 1000, // 1 hour
    },
  }),
}
```

### 8.3 Bootstrap 节点

```
/bootstrap/1.0.0 节点列表 (硬编码 + DNS 解析):
- /dns4/bootstrap1.vibeagent.io/tcp/443/wss
- /dns4/bootstrap2.vibeagent.io/tcp/443/wss
- /dns4/bootstrap3.vibeagent.io/tcp/443/wss
```

## 9. 降级策略

当 P2P 网络不可用时:

```
P2P 不可用 → 后端 WebSocket 中继
  ├── Consumer 通过 API 发布任务
  ├── Indexer 通知 Provider (WebSocket/轮询)
  ├── Provider 通过 API 提交交付
  └── 链上 Escrow 结算不受影响
```

关键原则: **链上 Escrow 是最终信任源**，P2P 是优化层而非必需层。

## 10. 监控指标

| 指标 | 说明 |
|------|------|
| `p2p_peers_connected` | 当前连接 peers 数 |
| `p2p_beacon_received_rate` | Beacon 接收速率 |
| `p2p_message_latency_p95` | 消息延迟 P95 |
| `p2p_relay_usage_rate` | Relay 使用率 |
| `p2p_nat_traversal_success_rate` | NAT 穿透成功率 |

## 11. 实现路线

| 版本 | 能力 |
|------|------|
| v0.1 | libp2p CLI PoC, Beacon 广播/接收 |
| v0.2 | 浏览器 WebRTC 节点, 加密任务消息, DHT 路由 |
| v0.3 | Device Node SDK, 社区 Relay |
| v1.0 | 生产级 Relay 集群, 监控, 自动故障转移 |
