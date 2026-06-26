// 双语术语表（悬浮提示用）。课程渲染器读取每条 terms（按当前语言），
// 在课文中查找首个出现的字符串，并以 def 作为悬浮释义显示。
// terms = 在正文中要匹配的词，def = 简明的一到两句释义。
// 注意：def 用双引号包裹，内部不得出现 ASCII 直引号，需用中文/弯引号 “ ” ‘ ’。

export const GLOSSARY = [
  {
    zh: { terms: ["私钥"], def: "一串保密的随机大数，是你对这枚币的最终控制权；用它对交易签名即可花费。私钥一旦泄露，资产即失。" },
    en: { terms: ["private key", "private keys"], def: "A secret random number that is your ultimate control over a coin; you sign transactions with it to spend. Leak it and the funds are gone." },
  },
  {
    zh: { terms: ["公钥"], def: "由私钥单向推导出的数，用来验证签名、生成地址。公开它本身不会暴露私钥。" },
    en: { terms: ["public key", "public keys"], def: "A number derived one-way from the private key, used to verify signatures and form addresses. Sharing it does not expose the private key." },
  },
  {
    zh: { terms: ["地址"], def: "由公钥经哈希和编码得到的一串字符，是接收比特币的“收款账号”。它是公开信息，可安全分享给付款方。" },
    en: { terms: ["address", "addresses"], def: "A string derived by hashing and encoding a public key; it is the account you receive bitcoin to. It is public and safe to share with senders." },
  },
  {
    zh: { terms: ["助记词", "种子短语"], def: "通常为 12 或 24 个英文单词，是私钥的人类可读备份；按顺序记下它就能恢复整个钱包。任何看到它的人都能拿走你的币。" },
    en: { terms: ["mnemonic", "seed phrase", "recovery phrase"], def: "Usually 12 or 24 words that are a human-readable backup of your keys; writing them in order can restore the whole wallet. Anyone who sees them can take your coins." },
  },
  {
    zh: { terms: ["自托管"], def: "由你自己持有私钥、直接掌控比特币，而不交给交易所或第三方代管。其代价是你要对安全和备份负全责。" },
    en: { terms: ["self-custody", "self custody"], def: "Holding your own private keys and controlling your bitcoin directly, instead of trusting an exchange or third party. The trade-off is that security and backups are entirely your responsibility." },
  },
  {
    zh: { terms: ["冷存储"], def: "把私钥保存在永不联网的设备或介质上，以隔离黑客攻击。适合长期、大额持有。" },
    en: { terms: ["cold storage"], def: "Keeping private keys on a device or medium that never touches the internet, to isolate them from online attackers. It suits long-term, large holdings." },
  },
  {
    zh: { terms: ["硬件钱包"], def: "一种专用小设备，把私钥锁在内部并在设备上完成签名，私钥从不离开它。即使连到中毒电脑也较为安全。" },
    en: { terms: ["hardware wallet", "hardware wallets"], def: "A dedicated small device that keeps private keys inside it and signs transactions on-device, so the keys never leave. It stays fairly safe even when plugged into an infected computer." },
  },
  {
    zh: { terms: ["法币", "法定货币"], def: "由政府发行、靠法律强制流通的货币（如美元、人民币），本身无内在价值，发行量可由央行增加。" },
    en: { terms: ["fiat", "fiat money", "fiat currency"], def: "Government-issued money that circulates by legal decree (such as dollars or yuan); it has no intrinsic value, and central banks can expand its supply." },
  },
  {
    zh: { terms: ["通货膨胀"], def: "货币供应增加或购买力下降，使同样的钱能买到的东西变少。比特币用固定的发行上限来抵御它。" },
    en: { terms: ["inflation"], def: "A rise in money supply or fall in purchasing power, so the same money buys less over time. Bitcoin resists it with a fixed supply cap." },
  },
  {
    zh: { terms: ["双花", "双重支付"], def: "把同一笔钱花两次的企图，是数字货币的核心难题。比特币靠全网共识对交易排序来杜绝它。" },
    en: { terms: ["double-spend", "double spend", "double-spending"], def: "An attempt to spend the same money twice, the core problem of digital cash. Bitcoin prevents it by ordering transactions through network-wide consensus." },
  },
  {
    zh: { terms: ["区块链"], def: "把交易打包成区块、并以哈希首尾相连形成的不可篡改账本。改动任一旧区块都会破坏后续所有链接。" },
    en: { terms: ["blockchain"], def: "A tamper-evident ledger that groups transactions into blocks chained together by hashes. Altering any old block breaks every link that follows it." },
  },
  {
    zh: { terms: ["区块"], def: "一批被一起确认的交易及其元数据的集合，是区块链的基本单位。比特币平均约每 10 分钟产生一个。" },
    en: { terms: ["block", "blocks"], def: "A batch of transactions confirmed together along with their metadata, the basic unit of a blockchain. Bitcoin produces one roughly every 10 minutes on average." },
  },
  {
    zh: { terms: ["区块头"], def: "区块开头的一小段摘要，含上一区块哈希、默克尔根、时间戳、难度和 nonce。矿工反复哈希的就是它。" },
    en: { terms: ["block header", "block headers"], def: "The small summary at the start of a block, holding the previous block hash, Merkle root, timestamp, difficulty, and nonce. It is what miners repeatedly hash." },
  },
  {
    zh: { terms: ["矿工"], def: "运行算力反复尝试哈希、争相打包下一个区块的参与者；成功者获得新币和手续费奖励。" },
    en: { terms: ["miner", "miners"], def: "A participant who runs computing power to repeatedly hash and compete to produce the next block; the winner earns newly minted coins plus fees." },
  },
  {
    zh: { terms: ["挖矿"], def: "矿工不断改变 nonce 计算哈希、寻找满足难度目标结果的过程，从而赢得记账权与奖励。它把电力转化为账本安全。" },
    en: { terms: ["mining"], def: "The process of miners varying the nonce and hashing to find a result meeting the difficulty target, winning the right to add a block and earn rewards. It converts electricity into ledger security." },
  },
  {
    zh: { terms: ["工作量证明"], def: "要求提交难以计算、却易于验证的哈希答案作为投入算力的凭证。它让伪造历史的代价高到不可行。" },
    en: { terms: ["proof of work", "proof-of-work"], def: "A scheme requiring a hard-to-compute but easy-to-verify hash answer as proof that real work was spent. It makes rewriting history prohibitively expensive." },
  },
  {
    zh: { terms: ["nonce", "随机数"], def: "区块头里一个可任意改变的数字，矿工不断调整它来碰出符合难度目标的哈希。" },
    en: { terms: ["nonce"], def: "A freely changeable number in the block header that miners keep adjusting to find a hash meeting the difficulty target." },
  },
  {
    zh: { terms: ["共识"], def: "全网节点对哪条链有效、账本状态如何达成的一致。比特币用最长有效工作量链规则自动达成它。" },
    en: { terms: ["consensus"], def: "Network-wide agreement on which chain is valid and what the ledger state is. Bitcoin reaches it automatically via the most-work valid chain rule." },
  },
  {
    zh: { terms: ["减半"], def: "约每四年一次，区块奖励的新币数量减半的事件。它让总量逐步逼近 2100 万的上限。" },
    en: { terms: ["halving"], def: "An event about every four years that cuts the new-coin block reward in half. It gradually drives total supply toward the 21 million cap." },
  },
  {
    zh: { terms: ["创世区块"], def: "比特币的第一个区块，由中本聪于 2009 年挖出，其中嵌入了一句泰晤士报头条。它是整条链的源头。" },
    en: { terms: ["genesis block"], def: "Bitcoin’s very first block, mined by Satoshi in 2009, with a newspaper headline embedded in it. It is the root of the entire chain." },
  },
  {
    zh: { terms: ["哈希", "散列"], def: "把任意数据压成固定长度指纹的单向函数；输入稍变指纹就全变，且无法反推原文。它是区块链链接与挖矿的基石。" },
    en: { terms: ["hash", "hashes", "hashing"], def: "A one-way function that compresses any data into a fixed-length fingerprint; a tiny input change flips the whole output and you cannot reverse it. It underpins chaining and mining." },
  },
  {
    zh: { terms: ["SHA-256", "SHA256"], def: "比特币使用的哈希算法，输出 256 位指纹。挖矿、地址和区块链接都依赖它。" },
    en: { terms: ["SHA-256", "SHA256"], def: "The hash algorithm Bitcoin uses, producing a 256-bit fingerprint. Mining, addresses, and block chaining all rely on it." },
  },
  {
    zh: { terms: ["默克尔树", "默克尔根", "Merkle树"], def: "把大量交易两两哈希、层层归并到单一根哈希的结构。凭它可高效证明某笔交易确实在区块内。" },
    en: { terms: ["Merkle tree", "Merkle root", "merkle tree"], def: "A structure that hashes transactions in pairs and merges upward to a single root hash. It lets you efficiently prove a transaction is included in a block." },
  },
  {
    zh: { terms: ["数字签名"], def: "用私钥对消息生成、可用公钥验证的密码学凭证，证明“持私钥者授权了这笔交易”且内容未被篡改。" },
    en: { terms: ["digital signature", "digital signatures", "signature", "signatures"], def: "A cryptographic proof created with a private key and checkable with the public key, showing the key holder authorized the transaction and the content was not altered." },
  },
  {
    zh: { terms: ["secp256k1"], def: "比特币选用的特定椭圆曲线，私钥、公钥和签名都基于其上的数学运算。" },
    en: { terms: ["secp256k1"], def: "The specific elliptic curve Bitcoin uses; private keys, public keys, and signatures are all built on math over this curve." },
  },
  {
    zh: { terms: ["ECDSA"], def: "比特币最初采用的椭圆曲线数字签名算法，用于证明交易由私钥持有者授权。Taproot 后逐步转向 Schnorr。" },
    en: { terms: ["ECDSA"], def: "The Elliptic Curve Digital Signature Algorithm Bitcoin originally used to prove a transaction is authorized by the key holder. It is being complemented by Schnorr after Taproot." },
  },
  {
    zh: { terms: ["UTXO", "未花费输出"], def: "“未花费的交易输出”，即一笔尚未被支出的币。你的余额其实是钱包能动用的所有 UTXO 之和。" },
    en: { terms: ["UTXO", "UTXOs", "unspent output"], def: "An Unspent Transaction Output, a chunk of coin not yet spent. Your balance is really the sum of all UTXOs your wallet can spend." },
  },
  {
    zh: { terms: ["找零"], def: "当输入金额大于支付额时，差额作为一笔新的输出退回给自己的地址，类似现金交易的找零。" },
    en: { terms: ["change"], def: "When the inputs are worth more than the payment, the difference is returned to your own address as a new output, like cash change." },
  },
  {
    zh: { terms: ["比特币脚本", "Script脚本"], def: "比特币内置的一种简单、刻意非图灵完备的栈式脚本语言，用来规定一笔币在什么条件下可被花费。" },
    en: { terms: ["Bitcoin Script", "Script"], def: "Bitcoin’s built-in, deliberately non-Turing-complete stack-based scripting language that sets the conditions under which a coin may be spent." },
  },
  {
    zh: { terms: ["锁定脚本", "scriptPubKey"], def: "附在每个输出上的花费条件脚本；要支出它，必须提供能让该脚本通过的解锁数据（通常是签名）。" },
    en: { terms: ["scriptPubKey", "locking script"], def: "The spending-condition script attached to each output; to spend it you must supply unlocking data, usually a signature, that makes the script pass." },
  },
  {
    zh: { terms: ["vByte", "虚拟字节"], def: "隔离见证引入的交易大小计量单位，用于公平计费。手续费通常按每 vByte 的聪数来报价。" },
    en: { terms: ["vByte", "vbyte", "virtual byte"], def: "A transaction-size unit introduced with SegWit for fair fee accounting. Fees are usually quoted in satoshis per vByte." },
  },
  {
    zh: { terms: ["手续费", "交易费"], def: "付给矿工以激励其优先打包你交易的费用；它取决于交易占用的字节数而非金额。区块拥堵时费率上涨。" },
    en: { terms: ["transaction fee", "transaction fees"], def: "A fee paid to miners to incentivize including your transaction; it depends on the transaction’s size in bytes, not its amount. Rates rise when blocks are congested." },
  },
  {
    zh: { terms: ["币基交易", "coinbase交易"], def: "每个区块的第一笔特殊交易，凭空铸出区块奖励的新币并收取本区块手续费，付给挖出该块的矿工。" },
    en: { terms: ["coinbase transaction"], def: "The special first transaction in each block that mints the block reward out of thin air and collects the block’s fees, paying the miner who found the block." },
  },
  {
    zh: { terms: ["难度"], def: "衡量挖出一个区块需要多少算力的参数，约每两周自动调整，使出块时间稳定在约 10 分钟。" },
    en: { terms: ["difficulty"], def: "A parameter measuring how much work it takes to find a block; it auto-adjusts about every two weeks to keep block times near 10 minutes." },
  },
  {
    zh: { terms: ["矿池"], def: "众多矿工联合算力共同挖矿、按贡献分配奖励的组织，让收益更稳定。但算力集中也带来中心化担忧。" },
    en: { terms: ["mining pool", "mining pools"], def: "A group of miners that combine hash power to mine together and split rewards by contribution, smoothing income. Concentrating hash power also raises centralization concerns." },
  },
  {
    zh: { terms: ["51%攻击", "51％攻击"], def: "当某一方掌握过半算力时，可能重组近期区块、撤销自己的交易实现双花。但它无法凭空盗走他人的币。" },
    en: { terms: ["51% attack", "51 percent attack"], def: "If one party controls a majority of hash power, it can reorganize recent blocks and reverse its own transactions to double-spend. It still cannot steal coins it lacks keys to." },
  },
  {
    zh: { terms: ["链重组", "重组", "reorg"], def: "当出现一条工作量更多的竞争链时，节点放弃原链尾部、改用新链，被丢弃区块里的交易回到待确认状态。" },
    en: { terms: ["reorg", "reorganization", "chain reorganization"], def: "When a competing chain with more work appears, nodes drop the tail of the old chain and adopt the new one; transactions in the discarded blocks return to unconfirmed." },
  },
  {
    zh: { terms: ["节点"], def: "运行比特币软件、验证并转发交易与区块的计算机。它们共同维护网络、各自独立执行规则。" },
    en: { terms: ["node", "nodes"], def: "A computer running Bitcoin software that validates and relays transactions and blocks. Together they maintain the network, each enforcing the rules on its own." },
  },
  {
    zh: { terms: ["全节点"], def: "完整下载并独立校验每一笔交易和区块、不信任任何第三方的节点。它让你以“不信任而验证”的方式使用比特币。" },
    en: { terms: ["full node", "full nodes"], def: "A node that downloads and independently verifies every transaction and block, trusting no third party. It lets you use Bitcoin in a don’t-trust-verify way." },
  },
  {
    zh: { terms: ["mempool", "内存池"], def: "节点暂存已收到但尚未被打包进区块的待确认交易的区域。矿工通常从中优先挑选费率高的交易。" },
    en: { terms: ["mempool"], def: "The area where a node holds received but not-yet-confirmed transactions waiting to enter a block. Miners typically pick the higher-fee ones from it first." },
  },
  {
    zh: { terms: ["软分叉"], def: "向后兼容的规则收紧：旧节点仍接受新区块，只是看不懂新增的约束。它能在不分裂网络的情况下升级。" },
    en: { terms: ["soft fork", "soft forks"], def: "A backward-compatible tightening of the rules: old nodes still accept new blocks but cannot see the added constraints. It upgrades the network without splitting it." },
  },
  {
    zh: { terms: ["硬分叉"], def: "不向后兼容的规则变更：旧节点会拒绝新区块，若双方都坚持运行就会分裂成两条链。" },
    en: { terms: ["hard fork", "hard forks"], def: "A non-backward-compatible rule change: old nodes reject the new blocks, and if both sides keep running the chain splits in two." },
  },
  {
    zh: { terms: ["BIP", "比特币改进提案"], def: "“比特币改进提案”，描述协议变更或标准的公开文档，供社区讨论与采纳。许多功能都以编号 BIP 形式定义。" },
    en: { terms: ["BIP", "BIPs"], def: "A Bitcoin Improvement Proposal, a public document describing a protocol change or standard for the community to discuss and adopt. Many features are defined as numbered BIPs." },
  },
  {
    zh: { terms: ["RBF", "费用替换"], def: "“按费替换”，允许用更高手续费的新版本替换一笔尚未确认的交易，从而加速确认。" },
    en: { terms: ["RBF", "Replace-By-Fee", "replace-by-fee"], def: "Replace-By-Fee, which lets you replace an unconfirmed transaction with a new version paying a higher fee to speed up confirmation." },
  },
  {
    zh: { terms: ["HD钱包", "分层确定性钱包"], def: "“分层确定性”钱包，从单一种子按树状结构推导出无数密钥与地址。只需备份种子即可恢复全部。" },
    en: { terms: ["HD wallet", "HD wallets", "hierarchical deterministic wallet"], def: "A hierarchical deterministic wallet that derives unlimited keys and addresses from a single seed in a tree structure. Backing up the seed alone restores everything." },
  },
  {
    zh: { terms: ["BIP39"], def: "把随机熵编码为助记词、再由助记词生成种子的标准。它让备份变成一串可朗读、可手写的单词。" },
    en: { terms: ["BIP39", "BIP 39"], def: "The standard that encodes random entropy into a mnemonic and turns that mnemonic into a seed. It makes backups a list of readable, writable words." },
  },
  {
    zh: { terms: ["派生路径", "推导路径"], def: "形如 m/84'/0'/0'/0/0 的索引序列，指明 HD 钱包从种子推导某个具体密钥的位置。路径不同，地址也不同。" },
    en: { terms: ["derivation path", "derivation paths"], def: "An index sequence like m/84'/0'/0'/0/0 that tells an HD wallet where to derive a specific key from the seed. Different paths produce different addresses." },
  },
  {
    zh: { terms: ["多签", "多重签名"], def: "要求多把私钥中至少 m 把共同签名才能花费的方案（如 2-of-3）。它消除单点故障，提升安全或实现共管。" },
    en: { terms: ["multisig", "multisignature", "multi-signature"], def: "A scheme requiring at least m of several keys to sign before coins can move, such as 2-of-3. It removes single points of failure and enables shared control." },
  },
  {
    zh: { terms: ["PSBT", "部分签名比特币交易"], def: "“部分签名比特币交易”，一种标准格式，让多方或多设备分步收集签名后再合并广播。多签与硬件钱包常用它。" },
    en: { terms: ["PSBT"], def: "A Partially Signed Bitcoin Transaction, a standard format that lets multiple parties or devices collect signatures step by step before combining and broadcasting. Multisig and hardware wallets rely on it." },
  },
  {
    zh: { terms: ["xpub", "扩展公钥"], def: "“扩展公钥”，可推导出一连串收款地址却无法花费的公钥。给它能监控余额，但泄露会损害隐私。" },
    en: { terms: ["xpub", "extended public key"], def: "An extended public key that can derive a whole sequence of receiving addresses but cannot spend. Sharing it lets someone watch your balance, but it harms privacy if leaked." },
  },
  {
    zh: { terms: ["隔离见证", "SegWit"], def: "把签名（见证数据）移出交易主体的升级，修复了交易延展性并变相扩容、降低费用。它是闪电网络的基础。" },
    en: { terms: ["SegWit", "Segregated Witness"], def: "An upgrade that moves signatures (witness data) out of the main transaction body, fixing malleability while effectively raising capacity and lowering fees. It paved the way for Lightning." },
  },
  {
    zh: { terms: ["闪电网络", "Lightning"], def: "建于比特币之上的二层网络，靠双方支付通道实现近乎即时、极低费用的小额支付，无需每笔都上链。" },
    en: { terms: ["Lightning Network", "Lightning"], def: "A second layer on top of Bitcoin that uses payment channels for near-instant, very low-fee payments without putting every transaction on-chain." },
  },
  {
    zh: { terms: ["HTLC", "哈希时间锁合约"], def: "“哈希时间锁合约”，一种用密码哈希加时间期限作条件的脚本，让资金能跨多个闪电通道安全路由。" },
    en: { terms: ["HTLC", "Hashed Timelock Contract"], def: "A Hashed Timelock Contract, a script conditioned on revealing a hash preimage within a time limit, letting funds route safely across multiple Lightning channels." },
  },
  {
    zh: { terms: ["Taproot"], def: "2021 年激活的升级，引入 Schnorr 签名与默克尔脚本树，让复杂花费条件在链上看起来与普通支付无异，提升隐私与效率。" },
    en: { terms: ["Taproot"], def: "A 2021 upgrade introducing Schnorr signatures and a Merkle script tree, so complex spending conditions look like ordinary payments on-chain, improving privacy and efficiency." },
  },
  {
    zh: { terms: ["Schnorr签名", "Schnorr"], def: "Taproot 引入的签名方案，更简洁高效，并能把多把密钥的签名聚合成一个，增强隐私与扩展性。" },
    en: { terms: ["Schnorr signature", "Schnorr signatures", "Schnorr"], def: "The signature scheme brought in by Taproot; it is simpler and more efficient and can aggregate many keys’ signatures into one, boosting privacy and scalability." },
  },
  {
    zh: { terms: ["隐私"], def: "比特币地址虽匿名却完全公开可追溯，故隐私不是默认就有的，需要靠新地址、CoinJoin 等手段主动保护。" },
    en: { terms: ["privacy"], def: "Bitcoin addresses are pseudonymous yet fully public and traceable, so privacy is not automatic and must be protected with fresh addresses, CoinJoin, and similar tactics." },
  },
  {
    zh: { terms: ["CoinJoin"], def: "多名用户把各自的输入合并进同一笔交易，打乱资金与所有者的对应关系，从而提升隐私的协作方式。" },
    en: { terms: ["CoinJoin"], def: "A collaborative method where many users merge their inputs into one transaction, scrambling the link between coins and owners to improve privacy." },
  },
  {
    zh: { terms: ["Ordinals", "铭文"], def: "一种为单个聪编号、并在其上附着图片或文本等数据的方案，催生了比特币上的“铭文/NFT”玩法。也因占用区块空间而有争议。" },
    en: { terms: ["Ordinals", "inscriptions"], def: "A scheme that numbers individual satoshis and attaches data such as images or text to them, enabling inscriptions and NFTs on Bitcoin. It is debated for consuming block space." },
  },
  {
    zh: { terms: ["契约", "Covenant"], def: "一类提议中的脚本能力，可限制一笔币未来只能以特定方式被花费（如只能发往某些地址）。它能实现金库等高级用途，但也引发争论。" },
    en: { terms: ["covenant", "covenants"], def: "A proposed scripting ability that restricts how a coin may be spent in the future, such as only to certain addresses. It enables features like vaults but remains contentious." },
  },
  {
    zh: { terms: ["安全预算"], def: "矿工因保护网络而获得的总收入（区块奖励加手续费）。随着减半使新币奖励趋零，未来的安全将越来越依赖手续费。" },
    en: { terms: ["security budget"], def: "The total income miners earn for securing the network, namely the block reward plus fees. As halvings drive new-coin rewards toward zero, future security increasingly depends on fees." },
  },
  {
    zh: { terms: ["量子计算"], def: "利用量子力学原理的新型计算，理论上可能威胁现有公钥密码。但对比特币的实际风险尚远，且可通过升级应对。" },
    en: { terms: ["quantum computing", "quantum computers"], def: "A new form of computing based on quantum mechanics that could in theory threaten today’s public-key cryptography. The practical risk to Bitcoin is still distant and can be met by upgrading." },
  },
  {
    zh: { terms: ["后量子密码", "抗量子密码"], def: "为抵御量子计算机而设计的新一代密码算法。比特币未来或通过软分叉引入它们来保护资金安全。" },
    en: { terms: ["post-quantum cryptography", "post-quantum"], def: "A new generation of cryptographic algorithms designed to withstand quantum computers. Bitcoin may adopt them via a future soft fork to keep funds secure." },
  },
];
