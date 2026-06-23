export default {
  id: "node-types",
  stage: 6,
  order: 2,
  title: "Node Types: Full Nodes, Pruned Nodes, Light Wallets",
  difficulty: "core",
  prereqs: ["p2p-network", "merkle-tree"],

  oneLiner:
    "Not all nodes are the same. A full node verifies everything itself and is the bedrock of trustlessness; a pruned node verifies everything just the same but discards old blocks to save space; a light wallet (SPV) stores only block headers and uses Merkle proofs to confirm its own transactions — lightweight, but it has to trust others a bit more.",

  intuition: `
There is more than one kind of node. You can sort them along three dimensions — "how much you store yourself, how much you verify yourself, and how much you have to trust others" — into a few tiers. The more you store and the more you verify, the less you need to trust others, but the heavier the burden.

The single most important phrase is **"Don't trust, verify."** If you run your own full node, you no longer have to believe anyone's claims about the state of the chain. A light wallet makes a trade-off between portability and trust assumptions.

Click around on the right to compare what each of the three node types stores and what it trusts.

**In this lesson we break "node types" into four pieces:**

- **① Full nodes — the trustless bedrock that independently verifies everything**
- **② Pruned nodes — same full verification, just no hoarding of old blocks**
- **③ Light wallets (SPV) — only block headers, trading Merkle proofs for portability**
- **④ A key clarification — mining ≠ verifying**
`,

  mechanics: `
### ① Full nodes: the trustless bedrock that independently verifies everything

A full node downloads and keeps **the entire chain** (in 2026 the block data already exceeds **600 GB**, and more with indexes) and **personally verifies every consensus rule**: the signature of every transaction, the existence of every UTXO, the proof-of-work of every block, the 21-million issuance cap… reject anything that fails even one.

- **It trusts no one, only what it has computed itself.** No matter how many fake messages others send — forged balances, coins conjured from nothing, double-spends — your node rejects them on the spot per the rules.
- **The real meaning of sovereignty.** You no longer have to believe an exchange, a block explorer, or anyone else "relaying" to you what happened on-chain; the final say over the rules rests in your own hands.
- **The power of consensus comes from numbers.** It is precisely because **countless full nodes around the world each verify independently** that no one can quietly change the rules — even if every miner colluded, nodes would collectively reject non-compliant blocks (callback to Stage 2.4; the forks lesson in Stage 6.4 will reuse this point).

### ② Pruned nodes: same full verification, just no hoarding of old blocks

Pruning is often mistaken for "reduced security," but it absolutely is **not**:

- A pruned node **downloads and validates every single block in full** — from the genesis block to the chain tip, not one skipped — with verification strength **identical** to a full node.
- The only difference: after validating an old block, it **deletes that block from disk**, keeping only a recent, configurable window (minimum about **550 MB**). The current UTXO set (chainstate) is always kept complete, so it can still independently verify new transactions and new blocks.
- **The only cost**: it can no longer **serve** the full historical blocks to others for download (it can't help new nodes with their initial sync) and can't answer queries that need old data.
- **Who it suits**: self-custodians short on disk space. With a few hundred MB of storage you get the same trustless security as a full node — an excellent trade-off.

### ③ Light wallets (SPV): only block headers, trading Merkle proofs for portability

SPV (Simplified Payment Verification) was proposed by Satoshi in Section 8 of the whitepaper, designed for resource-constrained devices like phones:

- **Download only block headers.** Each block header is just **80 bytes**, so all the headers of the entire chain add up to only **tens of MB** (versus hundreds of GB for a full node).
- **How does it confirm "my transaction made it into a block"?** An SPV wallet requests a **Merkle proof** from a full node — a short path from your transaction's hash up to the Merkle root in the block header (callback to Stage 3.3). If the proof matches the root, the transaction really is in that block, without downloading the block's thousands of transactions.
- **Its trust assumption.** SPV **assumes "the header chain with the most cumulative work is honest"** and does not itself verify whether the transactions inside the blocks are all valid (e.g. whether anyone printed coins from nothing). So it **outsources** the question of "are the rules being followed" to full nodes — that is where it is weaker than self-verification.
- **Privacy cost.** To let a full node filter relevant transactions for you, SPV often has to **reveal which addresses you care about**, so privacy is worse.
- **The trade-off in a sentence**: light, power-efficient, great for phones; the cost is a stronger trust assumption and weaker privacy. To be truly trustless, it's best to connect your phone wallet to **your own full node**.

### ④ A key clarification: mining ≠ verifying

This is the point beginners most often confuse: **the vast majority of nodes do not mine.**

- **Miners** "write new pages" — packing transactions into blocks and doing proof-of-work (Stage 5). The entities actually mining are in fact **very few** (highly concentrated among a handful of pools).
- **Full nodes** "audit whether each page is compliant" — no matter who mined a block, if it breaks the rules it is rejected outright. The people running full nodes number in the **tens of thousands**, spread across the globe.
- The two have **a division of labor and mutual checks**: miners have hash power but no power to change the rules, because nodes reject their non-compliant blocks. This is exactly the root of "**hash power is not the same as a say**" (in Stage 6.4 on forks we'll see that even software upgrades come down to the economic majority who run nodes).
`,

  demo: "node-types",

  analogy: `
- **A full node** is like an accountant who checks the **original** ledger page by page: no one can fool him.
- **A pruned node** is like an accountant who, after checking the originals, keeps only the most recent few pages and shreds the old ones — he personally inspected every page, he just no longer hoards them.
- **A light wallet** is like someone who only got a table of contents plus a proof of "your entry is on page X": convenient, but you have to trust that whoever provided the proof played no tricks.
`,

  misconceptions: [
    "“More nodes exist just to store a few extra copies and save space.” — No. Every full node keeps its own complete copy of the ledger, trading redundancy and independent verification for censorship resistance and trustlessness.",
    "“A pruned node has reduced security.” — It doesn't. It fully verifies every block; it just doesn't keep the old blocks after verifying them.",
    "“An SPV light wallet is just as secure as a full node.” — It isn't. SPV relies on a stronger trust assumption and has weaker privacy; a self-verifying full node is the most solid.",
    "“Only miners count as nodes.” — No. The vast majority of nodes don't mine; they only verify and relay. Mining and verifying are two different things.",
  ],

  quiz: [
    {
      q: "Which kind of node does “Don't trust, verify” most aptly describe?",
      options: ["A light wallet (SPV)", "A full node that verifies everything itself", "An exchange's node", "A price-ticker app"],
      answer: 1,
      explain: "A full node independently verifies every rule and need not trust anyone.",
    },
    {
      q: "What is the key difference between a pruned node and a full node?",
      options: ["Weaker verification", "Identical verification strength, just discards old blocks to save storage", "It doesn't connect to the network", "It needs a mining rig"],
      answer: 1,
      explain: "Full verification, undiminished; it just doesn't keep history long-term.",
    },
    {
      q: "How does a light wallet (SPV) confirm that its own transaction was included?",
      options: ["By downloading the entire chain", "It stores only block headers and requests a Merkle proof from a full node to check itself", "By calling a miner", "By fully trusting an exchange"],
      answer: 1,
      explain: "Block headers + Merkle proof: lightweight but with a stronger trust assumption (callback to 3.3).",
    },
    {
      q: "Which statement about “nodes” and “miners” is correct?",
      options: ["All nodes are mining", "The vast majority of nodes don't mine; they only verify and relay — mining and verifying are different things", "Only miners are nodes", "Nodes are responsible for issuing new coins"],
      answer: 1,
      explain: "Miners write new pages; full nodes audit whether each page is compliant — different jobs.",
    },
  ],

  further: [
    { label: "Bitcoin.org: Why and How to Run a Full Node", url: "https://bitcoin.org/zh_CN/full-node" },
    { label: "learnmeabitcoin: SPV / Light Wallets", url: "https://learnmeabitcoin.com/beginners/guide/" },
  ],
};
