export default {
  id: "block-size-war",
  stage: 8,
  order: 1,
  title: "The Block Size War: A Civil War Over Direction",
  difficulty: "core",
  prereqs: ["node-types", "forks-bips"],

  oneLiner:
    "Bitcoin's blocks have limited capacity, which raises a fundamental question: should we just make blocks bigger to pack in more transactions? The 2015–2017 “block size war” tore the community apart over exactly this — in the end Bitcoin chose to keep blocks small and scale with second layers, preserving the “anyone can run a node” decentralization, while the faction that insisted on big blocks hard-forked into Bitcoin Cash.",

  intuition: `
Every Bitcoin block has limited space (that's where the fee market in Stage 6.3 comes from). On-chain, the network can only handle **around 7** transactions per second — negligible next to Visa's peak of **tens of thousands** per second. One seemingly obvious fix: **why not just make the blocks bigger?** Raise blocks from 1MB to 8MB and throughput goes up eightfold, right?

The catch: **big blocks aren't free.**

- The bigger the blocks, the faster the chain grows — more data to store every year, longer to download, heavier on bandwidth to validate.
- So **fewer and fewer people can run a full node themselves** — and full nodes are precisely the foundation of Bitcoin's trustlessness and censorship resistance (Stage 6.2).
- Once nodes concentrate in the hands of a few large institutions, Bitcoin slowly drifts back into a system that "needs a trusted center": a small group calls the shots, can change the rules, can censor.

That was the core conflict of the 2015–2017 **block size war**: **on-chain scaling (big blocks)** vs **staying decentralized and scaling in layers**. On the surface it looked like a fight over a technical parameter, but at its core it was a choice of values — **what should Bitcoin protect first?** Bitcoin ultimately chose "protect decentralization first"; the faction that insisted on big blocks split off and became **Bitcoin Cash (BCH)**.

Drag the block size on the right and feel for yourself the tug-of-war between "throughput" and "node cost."

**In this lesson we break the "block size war" into four pieces:**

- **① Where the 1MB cap came from — a temporary patch that became a battlefield**
- **② What big blocks actually cost — the three bills of storage, bandwidth, and validation**
- **③ The head-on clash of two scaling philosophies — on-chain camp vs layered camp**
- **④ How the war ended — SegWit, the BCH split, and "who is Bitcoin"**
`,

  mechanics: `
### ① The 1MB cap: a temporary patch

Bitcoin originally had **no** block size limit. In 2010, Satoshi quietly added a line of code capping blocks at **1,000,000 bytes (about 1MB)** — for a simple reason: **to stop anyone from attacking the network with giant junk blocks** (back then coins were nearly worthless, and a single malicious large block could flood other people's disks and bandwidth).

- It was a **temporary safety patch**, not a carefully considered "ultimate capacity." Satoshi himself said at the time that it could be raised in the future.
- But precisely because it was "temporary," nobody imagined it would become the fuse that later split the entire community. 1MB was more than enough at the time; only **as transaction volume approached the cap (starting in 2015)** did the problem erupt: the mempool began to pile up, confirmations slowed, and fees rose significantly for the first time.
- There is a key realization here: **changing a seemingly harmless constant is also changing the consensus rules.** Raise 1MB to 2MB and old nodes will reject the new larger blocks — that is a **hard fork** (Stage 6.4). So "enlarging blocks" was never as simple as changing a number; it required a coordinated upgrade across the whole network.

### ② What big blocks cost: storage, bandwidth, validation

The real cost of "enlarging blocks" hides in **the burden of running a full node.** Tally up three bills:

- **Storage**: the blockchain only grows, never shrinks. 1MB per block, one block every 10 minutes → about **52GB per year**. Switch to 8MB and that's about **420GB per year** — within a few years an ordinary person's hard drive can no longer hold the entire chain.
- **Bandwidth**: blocks must propagate quickly between nodes worldwide. The bigger the block, the slower it propagates, the more likely it produces **orphan blocks**, and the more it leaves regions with poor connectivity (many developing countries) unable to keep up.
- **Validation (IBD, initial block download)**: a new node coming online must **re-verify every transaction** from the genesis block to the present. The bigger the chain and the larger the UTXO set, the more this process stretches from hours into days or even weeks — deterring the vast majority of ordinary people who want to verify for themselves.

**Why is this life-and-death?** Full nodes are Bitcoin's "constitutional court": they **independently verify every rule** and trust no one else's word for the result (Stage 6.2). The fewer people who can run a node, the more the rules end up in the hands of a few large institutions — which is exactly the "trusted center" Bitcoin set out to eliminate. So the layered camp's bottom line is: **an ordinary person should be able to run a node on a second-hand computer with home broadband.** That capability must not be lost.

### ③ The clash of two scaling philosophies

To the same problem, the two camps gave opposite answers:

- **On-chain camp (big blocks)**: just enlarge the blocks so the main chain carries more transactions. They argued "Bitcoin should be electronic cash for everyday payments, so throughput should go up," treating the rising node cost and drift toward centralization as an acceptable price (some even held that "it's fine if professional data centers run the nodes").
- **Layered camp (small blocks + second layers)**: **keep the base layer lean, decentralized, and verifiable by everyone**, and move high-frequency small-value transactions onto **second layers** (like the Lightning Network, next lesson) for settlement. They argued "the main chain is a high-value settlement layer, like interbank clearing; the buying-coffee kind of small payment goes to second layers." Bitcoin took this path.

The conflict peaked in 2017: first came the **"New York Agreement (SegWit2x)"** pushed by large miners and businesses, which aimed to "activate SegWit first, then hard-fork to 2MB," but collapsed under fierce community opposition; meanwhile ordinary users applied pressure through **UASF (BIP148, the user-activated soft fork)**, threatening that "nodes that don't accept SegWit blocks will be orphaned" — **this was a victory of node-running users over miner hashrate**, vividly demonstrating that in Bitcoin "hashrate does not equal say" (callback 6.4).

### ④ How the war ended and "who is Bitcoin"

The dust settled in 2017, leaving three outcomes:

- **SegWit activation (soft fork, August)**: it modestly raised effective capacity and **fixed transaction malleability**, paving the way for the Lightning Network (covered in detail next lesson). It is backward-compatible and does not split the chain.
- **The BCH hard-fork split (August)**: the big-block camp rejected this approach and hard-forked off **Bitcoin Cash (BCH)**, with an 8MB block cap (later splitting off **BSV** as well due to infighting). They became separate chains and coins.
- **"Who is Bitcoin" decided by economic consensus (callback 2.4 / 6.4)**: the chain that kept the original history and the original BTC ticker is the one recognized by the **economic majority** who run nodes, hold, and use Bitcoin. Exchanges, wallets, merchants, and users voted with their feet — BTC kept the name and the overwhelming majority of the value, while BCH/BSV's market caps shrank steadily.

**The deepest lesson this war left behind**: Bitcoin treats **base-layer decentralization as a non-negotiable bottom line**, leaving throughput to second layers. It also proved that Bitcoin's "constitution" is held not by miners or developers, but by the economic majority who independently run nodes and voluntarily adopt the rules — **this is the fundamental reason later upgrades like Taproot and Lightning all took the "gentle, voluntary, non-splitting" route.**
`,

  demo: "scaling-tradeoff",

  analogy: `
Think of Bitcoin's main chain as a **public ledger that every citizen has to verify in person**. Making each page bigger does let you record more entries at once; but the thicker and heavier the ledger gets, the fewer people can lift it, afford to read it, or bother checking it page by page — until only a few big institutions can keep the books, and decentralization exists in name only.

Bitcoin's choice: **keep the ledger itself light and checkable by anyone**, and move the high-frequency small payments — like buying coffee — onto a "second-layer" mini-ledger to settle.
`,

  misconceptions: [
    "“Just make the blocks bigger and you scale for free.” — Not free. The cost is a broad rise in storage, bandwidth, and validation expense, fewer people able to run a full node, and ultimately sacrificed decentralization.",
    "“1MB is Bitcoin's technical limit.” — It was originally a temporary anti-attack patch Satoshi added in 2010, not a technical ceiling; after SegWit, capacity is measured in “weight,” and effective capacity already exceeds 1MB.",
    "“Enlarging blocks just means changing a number.” — Changing that constant is changing the consensus rules; it makes old nodes reject new blocks, and is essentially a hard fork requiring a coordinated upgrade across the whole network.",
    "“Bitcoin Cash is the ‘real Bitcoin.’” — BCH is a hard fork that chose a different set of trade-offs; which chain keeps the original history and the BTC ticker is decided by the consensus of the economic majority who run nodes, hold, and use it.",
    "“This debate was decided by the miners.” — Quite the opposite. The 2017 UASF showed that node-running users could overpower miner hashrate, proving that hashrate does not equal say.",
    "“The scaling debate is completely over and there is no more evolution.” — Layered scaling is still actively advancing (SegWit, Lightning, Taproot and more are all later results).",
  ],

  quiz: [
    {
      q: "What is the main cost of “just making blocks bigger”?",
      options: ["The coin loses value", "The chain grows faster and validation gets pricier, so fewer people can run a full node → centralization", "Transactions slow down", "The supply cap is broken"],
      answer: 1,
      explain: "Big blocks sacrifice decentralization, the very foundation.",
    },
    {
      q: "What path did Bitcoin choose in the scaling war?",
      options: ["Enlarge blocks without limit", "Keep the base layer lean and decentralized, and scale with second layers", "Abolish blocks", "Switch to an account model"],
      answer: 1,
      explain: "Layered scaling: the base layer guards decentralization, while high-frequency small payments go to second layers.",
    },
    {
      q: "What were the direct outcomes of the 2017 dispute?",
      options: ["Bitcoin shut down", "SegWit was activated, and the big-block camp hard-forked into Bitcoin Cash (BCH)", "The supply doubled", "It went back to being centralized"],
      answer: 1,
      explain: "A SegWit soft fork plus the BCH hard-fork split.",
    },
    {
      q: "In the end, what decides “which chain is Bitcoin”?",
      options: ["A developer vote", "The consensus of the economic majority who run nodes, hold, and use it", "Whoever has the biggest blocks", "Government certification"],
      answer: 1,
      explain: "Callback 2.4 / 6.4: economic consensus has the final say.",
    },
  ],

  further: [
    { label: "Wikipedia: Bitcoin Cash (the block size war)", url: "https://en.wikipedia.org/wiki/Bitcoin_Cash" },
    { label: "Book: “The Blocksize War” (a chronicle of the scaling war)", url: "https://en.wikipedia.org/wiki/Bitcoin_scalability_problem" },
  ],
};
