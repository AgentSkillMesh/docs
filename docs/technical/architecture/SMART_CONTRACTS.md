# VibeAgent 智能合约设计

**最后更新**: 2024-10-10

---

## 1. 合约概览

```
contracts/
├── identity/
│   ├── AgentNFT.sol              # ERC-725 Agent 身份 NFT
│   └── AgentAccount.sol          # ERC-6551 Token Bound Account
├── registry/
│   ├── SkillRegistry.sol         # Skill 注册与绑定
│   └── DeviceRegistry.sol        # 设备节点注册 (v0.3)
├── settlement/
│   ├── Escrow.sol                # 通用托管结算
│   ├── HumanTaskEscrow.sol       # 人类任务 Escrow (v0.3)
│   └── RoyaltySplitter.sol       # 分账逻辑
├── governance/
│   ├── VibeGovernor.sol          # DAO 治理 (v1.0)
│   └── DisputeResolver.sol       # 争议仲裁 (v0.2)
├── verification/
│   └── SkillVerifier.sol         # Skill 验证 (v0.2)
└── interfaces/
    ├── IAgentNFT.sol
    ├── ISkillRegistry.sol
    └── IEscrow.sol
```

## 2. AgentNFT (ERC-725 + ERC-6551)

### 2.1 功能

- 铸造 Agent NFT，绑定 ERC-6551 TBA
- 元数据 URI 指向 IPFS
- 支持转让与授权

### 2.2 接口

```solidity
interface IAgentNFT {
    event AgentMinted(
        uint256 indexed tokenId,
        address indexed owner,
        address tba,
        string metadataURI
    );

    function mint(address to, string calldata metadataURI)
        external returns (uint256 tokenId);

    function getTBA(uint256 tokenId) external view returns (address);

    function updateMetadata(uint256 tokenId, string calldata newURI)
        external;

    function totalSupply() external view returns (uint256);
}
```

### 2.3 ERC-6551 TBA 实现

```solidity
// 使用 reference implementation
// https://github.com/erc6551/reference
//
// 每个 Agent NFT 创建时:
// 1. 计算 TBA 地址 (CREATE2 deterministic)
// 2. 部署 AgentAccount 合约
// 3. TBA 可持有 ETH/ERC-20, 可调用任意合约
```

## 3. SkillRegistry

### 3.1 数据结构

```solidity
enum PricingModel { PER_CALL, SUBSCRIPTION, BUYOUT }

struct Skill {
    bytes32 skillId;
    address creator;
    string metadataURI;       // ipfs://...
    PricingModel pricingModel;
    uint256 price;            // wei or USDC units
    uint256 royaltyBps;       // 版税 basis points (0-1000)
    bool active;
    uint256 createdAt;
}

struct SkillBinding {
    bytes32 skillId;
    uint256 agentId;
    bool active;
}
```

### 3.2 接口

```solidity
interface ISkillRegistry {
    event SkillRegistered(bytes32 indexed skillId, address indexed creator);
    event SkillBound(bytes32 indexed skillId, uint256 indexed agentId);
    event SkillVerified(bytes32 indexed skillId, address indexed verifier);

    function registerSkill(
        string calldata metadataURI,
        PricingModel pricingModel,
        uint256 price,
        uint256 royaltyBps
    ) external returns (bytes32 skillId);

    function bindSkillToAgent(bytes32 skillId, uint256 agentId) external;

    function verifySkill(bytes32 skillId) external;  // v0.2: 仅授权验证者

    function getSkill(bytes32 skillId) external view returns (Skill memory);

    function getAgentSkills(uint256 agentId) external view returns (bytes32[] memory);
}
```

## 4. Escrow

### 4.1 状态机

```
CREATED ──fund──→ FUNDED ──deliver──→ DELIVERED ──confirm──→ COMPLETED
   │                 │                    │
   │                 │                    └──dispute──→ DISPUTED
   │                 │                                    │
   │                 ├──timeout──→ REFUNDED               ├──resolve──→ COMPLETED/REFUNDED
   │                 │
   └──cancel──→ CANCELLED
```

### 4.2 数据结构

```solidity
enum EscrowStatus {
    CREATED, FUNDED, DELIVERED, COMPLETED, DISPUTED, REFUNDED, CANCELLED
}

struct EscrowOrder {
    uint256 escrowId;
    address consumer;
    address provider;         // Agent TBA address
    bytes32 skillId;
    uint256 amount;
    string taskCID;
    string deliveryCID;
    EscrowStatus status;
    uint256 deadline;
    uint256 createdAt;
}
```

### 4.3 接口

```solidity
interface IEscrow {
    event EscrowCreated(uint256 indexed escrowId, address consumer, address provider);
    event EscrowFunded(uint256 indexed escrowId, uint256 amount);
    event EscrowDelivered(uint256 indexed escrowId, string deliveryCID);
    event EscrowCompleted(uint256 indexed escrowId);
    event EscrowRefunded(uint256 indexed escrowId);

    function createEscrow(
        address provider,
        bytes32 skillId,
        string calldata taskCID,
        uint256 deadline
    ) external returns (uint256 escrowId);

    function fundEscrow(uint256 escrowId) external payable;

    function deliverEscrow(uint256 escrowId, string calldata deliveryCID) external;

    function confirmDelivery(uint256 escrowId) external;

    function disputeEscrow(uint256 escrowId) external;

    function refundExpired(uint256 escrowId) external;

    function getEscrow(uint256 escrowId) external view returns (EscrowOrder memory);
}
```

### 4.4 分账逻辑

```solidity
function _settle(EscrowOrder storage order) internal {
    uint256 amount = order.amount;
    Skill memory skill = skillRegistry.getSkill(order.skillId);

    uint256 protocolFee = amount * protocolFeeBps / 10000;
    uint256 royalty = amount * skill.royaltyBps / 10000;
    uint256 providerAmount = amount - protocolFee - royalty;

    // Checks-Effects-Interactions
    order.status = EscrowStatus.COMPLETED;

    payable(order.provider).transfer(providerAmount);
    payable(skill.creator).transfer(royalty);
    payable(treasury).transfer(protocolFee);
}
```

## 5. DeviceRegistry (v0.3)

```solidity
struct Device {
    bytes32 deviceId;
    address owner;
    string metadataURI;       // 算力描述、在线时段
    uint256 pricePerHour;
    uint256 stake;            // 质押金额
    bool active;
    uint256 lastHeartbeat;
}

interface IDeviceRegistry {
    function registerDevice(string calldata metadataURI, uint256 pricePerHour)
        external payable returns (bytes32 deviceId);

    function heartbeat(bytes32 deviceId) external;

    function deactivateDevice(bytes32 deviceId) external;
}
```

## 6. 部署策略

### 6.1 网络

| 环境 | 网络 | 说明 |
|------|------|------|
| 本地 | Hardhat | 开发调试 |
| 测试 | Base Sepolia | 集成测试 |
| 生产 | Base Mainnet | 正式部署 |

### 6.2 升级策略

- v0.1-v0.3: 不可升级（快速迭代）
- v1.0: Transparent Upgradeable Proxy + TimelockController
- 升级权限: 多签 → DAO

### 6.3 部署顺序

```
1. AgentAccount Implementation (ERC-6551)
2. AgentNFT
3. SkillRegistry
4. RoyaltySplitter
5. Escrow (注入 SkillRegistry + RoyaltySplitter 地址)
6. [v0.2] DisputeResolver, SkillVerifier
7. [v0.3] DeviceRegistry, HumanTaskEscrow
8. [v1.0] VibeGovernor
```

## 7. 安全考量

| 风险 | 缓解 |
|------|------|
| 重入攻击 | ReentrancyGuard on all fund transfer |
| 权限提升 | AccessControl + onlyRole |
| 整数溢出 | Solidity 0.8+ 内置检查 |
| 前端运行攻击 | 链上验证所有参数 |
| 超时操纵 | block.timestamp + 合理 buffer |
| 恶意交付 | 争议机制 + 仲裁 |
| 合约升级风险 | Timelock + 审计 + 社区公示 |

## 8. 测试策略

```
test/
├── unit/           # 单合约单元测试
├── integration/    # 跨合约集成测试
├── fuzz/           # Foundry fuzz testing
└── invariant/      # 状态不变量测试
```

目标: 合约测试覆盖率 > 95%
