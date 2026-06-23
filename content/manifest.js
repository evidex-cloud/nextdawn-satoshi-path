// 课程地图（双语 + 元数据）。路线图/侧栏只读这个文件。
// 每节课字段：id, title(中), titleEn(英), module(中文正文), status, difficulty(1基础/2进阶/3高级), personas(相关学习目标)
// 英文正文在 ./content/lessons/en/ 下同名文件；难度与 persona 与语言无关。

export const COURSE = {
  title: "NextDawn · 聪之路",
  titleEn: "NextDawn · Satoshi Path",
  subtitle: "从浅到深，一步步理解比特币的全部原理与技术",
  subtitleEn: "From the surface to the depths — understand every principle and technology behind Bitcoin, step by step.",

  tiers: [
    { id: "intro",   label: "入门层 · 浅", labelEn: "Beginner · Surface", color: "#eb9a3f" },
    { id: "core",    label: "原理层",       labelEn: "Principles",         color: "#f7931a" },
    { id: "systems", label: "系统层",       labelEn: "Systems",            color: "#d97c0a" },
    { id: "mastery", label: "精通层 · 深",  labelEn: "Mastery · Deep",     color: "#b3620a" },
  ],

  goals: [
    { id: "curious",     label: "好奇者",   labelEn: "Curious" },
    { id: "investor",    label: "投资者",   labelEn: "Investor" },
    { id: "selfcustody", label: "自托管者", labelEn: "Self-custodian" },
    { id: "developer",   label: "开发者",   labelEn: "Developer" },
  ],

  stages: [
    {
      n: 0, tier: "intro", title: "为什么需要比特币", titleEn: "Why Bitcoin Exists",
      blurb: "货币史 · 双花问题 · 白皮书", blurbEn: "Money history · Double-spend · Whitepaper",
      lessons: [
        { id: "money", title: "货币是什么：从贝壳到黄金", titleEn: "What Is Money: From Seashells to Gold", module: "./content/lessons/stage0-money.js", status: "ready", difficulty: 1, personas: ["curious", "investor", "selfcustody", "developer"] },
        { id: "fiat-problems", title: "法币的问题：信任与通胀", titleEn: "The Problems with Fiat: Trust & Inflation", module: "./content/lessons/stage0-fiat.js", status: "ready", difficulty: 1, personas: ["curious", "investor", "selfcustody", "developer"] },
        { id: "double-spend", title: "数字现金的世纪难题：双花", titleEn: "Digital Cash's Hard Problem: Double-Spending", module: "./content/lessons/stage0-double-spend.js", status: "ready", difficulty: 1, personas: ["curious", "investor", "selfcustody", "developer"] },
        { id: "whitepaper", title: "中本聪的答案：白皮书诞生", titleEn: "Satoshi's Answer: The Whitepaper", module: "./content/lessons/stage0-whitepaper.js", status: "ready", difficulty: 1, personas: ["curious", "investor", "selfcustody", "developer"] },
      ],
    },
    {
      n: 1, tier: "intro", title: "上手使用", titleEn: "Getting Started",
      blurb: "钱包 · 地址 · 收付款 · 自托管", blurbEn: "Wallets · Addresses · Send/Receive · Self-custody",
      lessons: [
        { id: "keys-addresses", title: "私钥与地址：你的钱凭什么是你的", titleEn: "Keys & Addresses: Why Your Coins Are Yours", module: "./content/lessons/stage1-keys-addresses.js", status: "ready", difficulty: 1, personas: ["curious", "investor", "selfcustody", "developer"] },
        { id: "wallets", title: "钱包不是装钱的，是管钥匙的", titleEn: "A Wallet Holds Keys, Not Coins", module: "./content/lessons/stage1-wallets.js", status: "ready", difficulty: 1, personas: ["curious", "investor", "selfcustody"] },
        { id: "send-receive", title: "收款与付款：地址、手续费、确认", titleEn: "Sending & Receiving: Addresses, Fees, Confirmations", module: "./content/lessons/stage1-send-receive.js", status: "ready", difficulty: 1, personas: ["curious", "investor", "selfcustody", "developer"] },
        { id: "custody", title: "自托管 vs 交易所：你的钥匙，你的币", titleEn: "Self-Custody vs Exchanges: Your Keys, Your Coins", module: "./content/lessons/stage1-custody.js", status: "ready", difficulty: 1, personas: ["curious", "investor", "selfcustody"] },
        { id: "security", title: "守好你的币：备份与防骗", titleEn: "Guard Your Coins: Backup & Anti-Scam", module: "./content/lessons/stage1-security.js", status: "ready", difficulty: 1, personas: ["curious", "investor", "selfcustody"] },
      ],
    },
    {
      n: 2, tier: "intro", title: "运作全景（直觉）", titleEn: "How It Works (Intuition)",
      blurb: "区块链 · 挖矿 · 共识", blurbEn: "Blockchain · Mining · Consensus",
      lessons: [
        { id: "blockchain", title: "区块链：一本谁都能查、却改不动的公共账本", titleEn: "The Blockchain: A Public Ledger No One Can Rewrite", module: "./content/lessons/stage2-blockchain.js", status: "ready", difficulty: 1, personas: ["curious", "investor", "selfcustody", "developer"] },
        { id: "tx-journey", title: "一笔交易的旅程：从点击发送到写进区块", titleEn: "A Transaction's Journey: From Send to Block", module: "./content/lessons/stage2-tx-journey.js", status: "ready", difficulty: 1, personas: ["curious", "investor", "selfcustody", "developer"] },
        { id: "mining", title: "挖矿：用算力争夺记账权", titleEn: "Mining: Competing for the Right to Write", module: "./content/lessons/stage2-mining.js", status: "ready", difficulty: 1, personas: ["curious", "investor", "developer"] },
        { id: "consensus", title: "共识：没有老板，大家怎么对同一本账达成一致", titleEn: "Consensus: Agreeing Without a Boss", module: "./content/lessons/stage2-consensus.js", status: "ready", difficulty: 2, personas: ["curious", "investor", "developer"] },
        { id: "halving", title: "2100 万与减半：写进代码的货币政策", titleEn: "21 Million & the Halving: Monetary Policy in Code", module: "./content/lessons/stage2-halving.js", status: "ready", difficulty: 1, personas: ["curious", "investor"] },
      ],
    },
    {
      n: 3, tier: "core", title: "密码学基石", titleEn: "Cryptographic Foundations",
      blurb: "哈希 · 公钥签名 · 默克尔树", blurbEn: "Hashing · Signatures · Merkle Trees",
      lessons: [
        { id: "hashing", title: "哈希函数：比特币的指纹机器", titleEn: "Hash Functions: Bitcoin's Fingerprint Machine", module: "./content/lessons/stage3-hashing.js", status: "ready", difficulty: 2, personas: ["curious", "developer"] },
        { id: "signatures", title: "数字签名：用私钥盖章，用公钥验章", titleEn: "Digital Signatures: Sign with Private, Verify with Public", module: "./content/lessons/stage3-signatures.js", status: "ready", difficulty: 2, personas: ["curious", "developer"] },
        { id: "merkle-tree", title: "默克尔树：把一万笔交易压成一个指纹", titleEn: "Merkle Trees: Ten Thousand Transactions into One Fingerprint", module: "./content/lessons/stage3-merkle.js", status: "ready", difficulty: 2, personas: ["developer"] },
      ],
    },
    {
      n: 4, tier: "core", title: "交易深入", titleEn: "Transactions Deep Dive",
      blurb: "UTXO · 脚本 · 地址类型 · 手续费", blurbEn: "UTXO · Script · Address Types · Fees",
      lessons: [
        { id: "utxo", title: "UTXO 模型：比特币没有余额，只有一张张“现金”", titleEn: "The UTXO Model: No Balances, Just Cash", module: "./content/lessons/stage4-utxo.js", status: "ready", difficulty: 2, personas: ["curious", "selfcustody", "developer"] },
        { id: "script", title: "Bitcoin Script：每个输出都是一道锁", titleEn: "Bitcoin Script: Every Output Is a Lock", module: "./content/lessons/stage4-script.js", status: "ready", difficulty: 2, personas: ["developer"] },
        { id: "address-types", title: "地址类型：从 1... 到 bc1p...", titleEn: "Address Types: From 1... to bc1p...", module: "./content/lessons/stage4-address-types.js", status: "ready", difficulty: 2, personas: ["selfcustody", "developer"] },
        { id: "tx-size-fees", title: "手续费与交易大小：vByte 到底是什么", titleEn: "Fees & Transaction Size: What Is a vByte", module: "./content/lessons/stage4-fees.js", status: "ready", difficulty: 2, personas: ["investor", "selfcustody", "developer"] },
        { id: "raw-transaction", title: "交易的原始结构：逐字节读懂一笔交易", titleEn: "Raw Transaction Structure: Reading a Transaction Byte by Byte", module: "./content/lessons/stage4-raw-transaction.js", status: "ready", difficulty: 3, personas: ["developer"] },
      ],
    },
    {
      n: 5, tier: "core", title: "挖矿与共识", titleEn: "Mining & Consensus",
      blurb: "PoW · 难度调整 · 51% 攻击", blurbEn: "PoW · Difficulty · 51% Attack",
      lessons: [
        { id: "block-header", title: "区块头：被反复哈希的 80 个字节", titleEn: "The Block Header: 80 Bytes Hashed Over and Over", module: "./content/lessons/stage5-block-header.js", status: "ready", difficulty: 3, personas: ["developer"] },
        { id: "difficulty", title: "目标、难度与每两周一次的自动校准", titleEn: "Target, Difficulty & the Two-Week Retarget", module: "./content/lessons/stage5-difficulty.js", status: "ready", difficulty: 2, personas: ["curious", "developer"] },
        { id: "mining-pools", title: "矿池：把中奖彩票拼成稳定工资", titleEn: "Mining Pools: Turning Lottery Tickets into a Salary", module: "./content/lessons/stage5-mining-pools.js", status: "ready", difficulty: 2, personas: ["curious", "investor"] },
        { id: "fifty-one", title: "最长链、重组与 51% 攻击", titleEn: "Longest Chain, Reorgs & the 51% Attack", module: "./content/lessons/stage5-fifty-one.js", status: "ready", difficulty: 3, personas: ["curious", "investor", "developer"] },
        { id: "coinbase", title: "币基交易：新币如何诞生", titleEn: "The Coinbase Transaction: How New Coins Are Born", module: "./content/lessons/stage5-coinbase.js", status: "ready", difficulty: 2, personas: ["curious", "developer"] },
      ],
    },
    {
      n: 6, tier: "systems", title: "网络与协议", titleEn: "Network & Protocol",
      blurb: "节点 · mempool · 分叉 · BIP", blurbEn: "Nodes · Mempool · Forks · BIPs",
      lessons: [
        { id: "p2p-network", title: "P2P 网络：没有服务器的“八卦网”", titleEn: "The P2P Network: A Gossip Net with No Server", module: "./content/lessons/stage6-p2p.js", status: "ready", difficulty: 2, personas: ["curious", "developer"] },
        { id: "node-types", title: "节点类型：全节点、剪枝节点、轻钱包", titleEn: "Node Types: Full, Pruned, Light", module: "./content/lessons/stage6-node-types.js", status: "ready", difficulty: 2, personas: ["selfcustody", "developer"] },
        { id: "mempool-propagation", title: "mempool 与区块传播：交易和区块怎么扩散", titleEn: "Mempool & Block Propagation", module: "./content/lessons/stage6-mempool.js", status: "ready", difficulty: 2, personas: ["investor", "developer"] },
        { id: "forks-bips", title: "软分叉、硬分叉与 BIP：规则怎么升级", titleEn: "Soft Forks, Hard Forks & BIPs", module: "./content/lessons/stage6-forks.js", status: "ready", difficulty: 2, personas: ["curious", "developer"] },
      ],
    },
    {
      n: 7, tier: "systems", title: "钱包与密钥标准", titleEn: "Wallets & Key Standards",
      blurb: "HD · 助记词 · 多签 · PSBT", blurbEn: "HD · Mnemonics · Multisig · PSBT",
      lessons: [
        { id: "hd-wallets", title: "HD 钱包：一颗种子长出一棵钥匙树（BIP32）", titleEn: "HD Wallets: One Seed Grows a Tree of Keys (BIP32)", module: "./content/lessons/stage7-hd-wallets.js", status: "ready", difficulty: 2, personas: ["selfcustody", "developer"] },
        { id: "bip39", title: "助记词：12 个单词背后的标准（BIP39）", titleEn: "Mnemonics: The Standard Behind 12 Words (BIP39)", module: "./content/lessons/stage7-bip39.js", status: "ready", difficulty: 2, personas: ["selfcustody", "developer"] },
        { id: "derivation-paths", title: "派生路径：m/84'/0'/0'/0/0 是什么意思", titleEn: "Derivation Paths: What m/84'/0'/0'/0/0 Means", module: "./content/lessons/stage7-derivation-paths.js", status: "ready", difficulty: 3, personas: ["selfcustody", "developer"] },
        { id: "multisig-psbt", title: "多签与 PSBT：多把钥匙，协作签名", titleEn: "Multisig & PSBT: Many Keys, Collaborative Signing", module: "./content/lessons/stage7-multisig.js", status: "ready", difficulty: 3, personas: ["selfcustody", "developer"] },
      ],
    },
    {
      n: 8, tier: "systems", title: "扩容与二层", titleEn: "Scaling & Layer 2",
      blurb: "SegWit · 闪电网络 · Taproot", blurbEn: "SegWit · Lightning · Taproot",
      lessons: [
        { id: "block-size-war", title: "区块大小之争：一场决定方向的内战", titleEn: "The Block Size War: A Civil War Over Direction", module: "./content/lessons/stage8-block-size-war.js", status: "ready", difficulty: 2, personas: ["curious", "investor"] },
        { id: "segwit", title: "SegWit 隔离见证：把签名搬出去", titleEn: "SegWit: Moving Signatures Out", module: "./content/lessons/stage8-segwit.js", status: "ready", difficulty: 3, personas: ["developer"] },
        { id: "lightning", title: "闪电网络：把高频小额搬到链下", titleEn: "The Lightning Network: Small Payments Off-Chain", module: "./content/lessons/stage8-lightning.js", status: "ready", difficulty: 3, personas: ["curious", "investor", "developer"] },
        { id: "taproot", title: "Taproot 与 Schnorr：更隐私、更高效", titleEn: "Taproot & Schnorr: More Private, More Efficient", module: "./content/lessons/stage8-taproot.js", status: "ready", difficulty: 3, personas: ["developer"] },
      ],
    },
    {
      n: 9, tier: "mastery", title: "前沿与高级主题", titleEn: "Frontier & Advanced Topics",
      blurb: "隐私 · 铭文 · 契约 · 博弈论", blurbEn: "Privacy · Inscriptions · Covenants · Game Theory",
      lessons: [
        { id: "privacy", title: "隐私：比特币是“假名”，不是“匿名”", titleEn: "Privacy: Bitcoin Is Pseudonymous, Not Anonymous", module: "./content/lessons/stage9-privacy.js", status: "ready", difficulty: 2, personas: ["curious", "selfcustody", "developer"] },
        { id: "ordinals", title: "Ordinals 与铭文：在聪上刻东西", titleEn: "Ordinals & Inscriptions: Carving Data onto Sats", module: "./content/lessons/stage9-ordinals.js", status: "ready", difficulty: 2, personas: ["curious", "investor"] },
        { id: "covenants", title: "契约与演进：给币加“使用条件”", titleEn: "Covenants & Evolution: Adding Spending Conditions", module: "./content/lessons/stage9-covenants.js", status: "ready", difficulty: 3, personas: ["developer"] },
        { id: "game-theory", title: "博弈论与现实世界：为什么大家选择诚实", titleEn: "Game Theory & the Real World: Why Everyone Stays Honest", module: "./content/lessons/stage9-game-theory.js", status: "ready", difficulty: 2, personas: ["curious", "investor"] },
      ],
    },
    {
      n: 10, tier: "mastery", title: "动手与构建", titleEn: "Hands-On & Building",
      blurb: "跑全节点 · RPC · 浏览器 · 读源码", blurbEn: "Run a Node · RPC · Explorer · Source",
      lessons: [
        { id: "run-node", title: "跑你自己的全节点：成为网络的一份子", titleEn: "Run Your Own Full Node: Become Part of the Network", module: "./content/lessons/stage10-run-node.js", status: "ready", difficulty: 2, personas: ["selfcustody", "developer"] },
        { id: "rpc", title: "RPC：和你的节点对话", titleEn: "RPC: Talking to Your Node", module: "./content/lessons/stage10-rpc.js", status: "ready", difficulty: 2, personas: ["developer"] },
        { id: "block-explorer", title: "读懂区块浏览器：把所学连起来", titleEn: "Reading a Block Explorer: Tying It All Together", module: "./content/lessons/stage10-block-explorer.js", status: "ready", difficulty: 1, personas: ["curious", "selfcustody", "developer"] },
        { id: "build-and-beyond", title: "用代码构造一笔交易，以及从这里继续", titleEn: "Build a Transaction in Code, and Where to Go Next", module: "./content/lessons/stage10-build-and-beyond.js", status: "ready", difficulty: 3, personas: ["developer"] },
        { id: "btc-numbers", title: "附录：关键数字速查", titleEn: "Appendix: Key Numbers Cheat Sheet", module: "./content/lessons/stage10-btc-numbers.js", status: "ready", difficulty: 1, personas: ["curious", "investor", "selfcustody", "developer"] },
      ],
    },
  ],
};
