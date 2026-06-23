export default {
  id: "blockchain",
  stage: 2,
  order: 1,
  title: "The Blockchain: A Public Ledger Anyone Can Audit but No One Can Rewrite",
  difficulty: "intro",
  prereqs: ["double-spend"],

  oneLiner:
    "The blockchain is Bitcoin's master ledger: page after page of “blocks” strung into a chain by time, each block embedding the hash fingerprint of the one before it. Alter any old entry and its fingerprint changes, instantly invalidating the entire chain after it — so the ledger is public and auditable, yet practically impossible to change. And it lives on tens of thousands of nodes worldwide at once, with no center.",

  intuition: `
Remember the conclusion from Stage 0? To prevent double-spending without a bank, you need a ledger that is **public, auditable by anyone, yet impossible for anyone to secretly alter**. That ledger is the **blockchain**.

Its skeleton is actually very plain: a batch of transactions is packed into a **block** (one roughly every **10 minutes**), and every block writes the **hash fingerprint of the previous block** into its own header — like train cars coupled head-to-tail into a chain that can only **grow forward, never be edited backward**.

The magic is all in that "hash fingerprint" (you played with it in Stage 0: change one character and the fingerprint turns upside down). Secretly alter one transaction in an old block and its fingerprint immediately changes, so the **"previous fingerprint" recorded in the next block no longer matches** — and everything after that breaks. Caught at a glance. The mini-chain demo on the right lets you tamper with it yourself and watch it "collapse into red."

**In this lesson we break the blockchain into four pieces:**

- **① What's actually inside a block**
- **② How hashes "chain" the blocks into one line**
- **③ Why this makes it "unchangeable" — how costly tampering really is**
- **④ Where this ledger lives — copies across the whole network, with no center**
`,

  mechanics: `
### ① What's inside a block

A block has two parts: a **block header (exactly 80 bytes)** and a **block body (the transaction list)**. Crammed into those 80 header bytes are 6 fields (Stage 5.1 takes them apart byte by byte):

- **Version (4 bytes)**: marks which rule set this block follows and whether certain upgrades are active.
- **Hash of the previous block header (32 bytes)**: links it to the block before — the star of ② below.
- **Merkle root (32 bytes)**: a single fingerprint formed by hashing **all of this block's transactions** in pairs, layer upon layer (Stage 3.3). It lets the 80-byte header "stand in for" the thousands of transactions in the body.
- **Timestamp (4 bytes)**: roughly when the block was mined; the difficulty adjustment uses it (Stage 2.3).
- **Difficulty target \`bits\` (4 bytes)**: the value this block's hash must come in under.
- **Nonce (4 bytes)**: the number miners keep trying.

The body is every transaction packed in:

- **The very first is always the coinbase transaction** — minting new coins from nothing (currently 3.125 BTC, Stage 2.5) and paying them, together with all the fees in this block, to the miner (Stage 5.5).
- A block body caps out around **4 million weight units (≈ 1–2 MB of actual data)** and usually holds **2,000–4,000 transactions**.
- Every block also has a **height**: the genesis block is 0, and each block after adds 1 — this is what "block 840,000" means. Note that height is just a sequence number; a block's **unique identity is its own header hash** (a 64-character hexadecimal string starting with many zeros).

### ② How hashes "chain" the blocks into one line

The key step: **block N's header contains the hash of block N−1's header** (Bitcoin computes this fingerprint with double SHA-256, \`SHA256(SHA256(header))\`).

- So block 3 points to block 2, block 2 points to block 1… all the way back to the **genesis block** (height 0) from January 2009. The genesis block's "previous fingerprint" is written as **all zeros**, the one and only anchor of the whole chain (Satoshi even left a Times headline inside it).
- This pointer chain is **one-way and append-only**: you can only attach new blocks after the latest one; no field anywhere lets you "insert" or "rewrite" a block in the middle — it's structurally sealed off.
- And that header hash is computed from the **entire 80-byte header**, which itself contains the Merkle root and the previous fingerprint. So **any tiny change anywhere (even altering 1 satoshi of one transaction) bubbles up through the Merkle root into the header hash, then gets amplified and exposed all the way down the chain** (detailed in the next piece).

### ③ Why it's "unchangeable": the cost of tampering

Suppose you want to secretly alter one old transaction in block N. The chain reaction goes like this:

- That transaction changes → block N's **Merkle root** changes → block N's **header hash** changes.
- The "previous fingerprint" recorded in block N+1 instantly stops matching → the chain **breaks right there**.
- To patch the chain back together, you must **re-mine** block N (find a fresh nonce that satisfies the difficulty, Stage 2.3) **and every single block after it** — because changing any block forces every later block's "previous fingerprint" to be recomputed too.
- Worse still is the race: **while** you redo the old blocks, the honest network keeps attaching new blocks after the latest one. You have to catch up and overtake **faster than all the rest of the network's hashpower combined** — and as long as you control under half of total hashpower, the gap only widens and you **can never catch up** (this is the 51% threshold, worked out in Stage 5.4).

So security rises **exponentially with the number of confirmations (how deeply it's buried)**. To give an intuitive sense of scale:

- **1 confirmation**: just added to the chain; in theory it could still be swapped out by a small **reorg**, where the attacker only needs to luck into mining 2 blocks in a row.
- **6 confirmations** (about 1 hour): overtaking now requires winning 6 hashpower races in a row, and the cost is already astronomical — which is exactly why exchanges generally require 6 confirmations for large amounts.

That's the real meaning of "the ledger is irreversible" — **not that it's physically impossible to change, but that changing it costs more than anyone can afford to pay**. Its moat isn't law, and it isn't some company's reputation; it's **mathematics plus the real-world cost of electricity**.

### ④ Where the ledger lives: copies across the whole network

The blockchain is **not on any central server**. **Tens of thousands of full nodes** worldwide (roughly 15,000–20,000 publicly reachable in 2026, plus many more that stay private) each keep a **complete** copy of the ledger (now over **600 GB** and still growing) and each **independently verify** whether every new block follows the rules.

- **No center = no single point that can be shut down, censored, or tampered with.** Shut down one country's nodes and the other tens of thousands keep running — this is the bedrock of its censorship resistance and resilience (Stage 6 covers nodes and the network in detail).
- **Redundancy is resilience**: even if 99% of the world's nodes went offline at once, the remaining 1% would still hold a complete, self-verifiable ledger, and the network could recover at any time.
- You can also run a node yourself on a cheap little machine, personally check every rule of the whole chain, and from then on never have to trust anyone's word about "what happened on-chain" (the hands-on Stage 10). This is the slogan — **"Don't trust, verify."**
`,

  demo: "blockchain-tamper",

  analogy: `
Picture a **public ledger sealed in wax, with every page glued shut one after another**: each time you open a new page, you first stamp an **imprint of the previous page's wax seal** onto the start of the new one.

The moment someone tears out and rewrites a page in the middle, that page's seal no longer matches the imprint stamped on the next page — so every page after it has to be re-glued and re-sealed. And this ledger sits in a public square for all the world, with everyone holding a copy to cross-check at any time. Quietly fudge a single entry without anyone noticing? No chance.
`,

  misconceptions: [
    "“The blockchain can be edited any time, like an ordinary database.” — It can't. It only appends forward; changing an old block invalidates the entire chain after it and requires redoing an enormous amount of work.",
    "“The blockchain sits on some central server.” — No. Thousands upon thousands of nodes worldwide each store a complete copy and cross-check one another. There is no center.",
    "“Once a transaction is in a block it's 100% unchangeable forever.” — Strictly speaking it just gets harder and harder to change. Freshly added, it could still in theory be reorged out; but each additional block stacked on top raises the cost of changing it exponentially, and after a few confirmations it's effectively nailed down.",
    "“‘Blockchain’ is the same thing as ‘Bitcoin.’” — The blockchain is merely the data structure Bitcoin uses to keep its ledger; it also needs proof of work, consensus rules, and a P2P network to together form Bitcoin. “Blockchain” gets slapped on all sorts of things these days, but Bitcoin's security comes from the whole package, not the word alone.",
    "“Bigger blocks are better — more transactions means a stronger network.” — The bigger the block, the heavier the storage and bandwidth burden on full nodes, so fewer people can verify for themselves → the more it drifts toward centralization. This is the core tension of the Stage 8 “block-size war.”",
  ],

  quiz: [
    {
      q: "What “chains” the blocks together?",
      options: ["An incrementing number", "Each block embeds the hash fingerprint of the previous block", "A network cable", "An index on a central server"],
      answer: 1,
      explain: "The previous block's fingerprint is written into the next block's header; any change instantly breaks the chain.",
    },
    {
      q: "What happens if you secretly change a very old block?",
      options: ["Nobody notices", "Its fingerprint changes, every block after it breaks, and all must be redone", "Only that one block is affected", "The ledger auto-repairs it for you"],
      answer: 1,
      explain: "Tampering means redoing the work for that block and every block after it, and overtaking the whole network — the very root of why it's “unchangeable.”",
    },
    {
      q: "Why is a transaction safer the more deeply it's buried?",
      options: ["Miners specially protect it", "To overturn it you must redo every block stacked on top of it, and the cost rises exponentially", "Deeper blocks are smaller", "The system auto-encrypts it"],
      answer: 1,
      explain: "More confirmations = more accumulated work on top = overtaking the network becomes ever more impossible.",
    },
    {
      q: "Where is the ledger data stored?",
      options: ["On a company's server", "In complete copies kept by a large number of nodes worldwide", "In your phone wallet", "In an exchange's database"],
      answer: 1,
      explain: "Decentralized: anyone can store, audit, and independently verify it; no single point can be shut down or tampered with.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Blockchain (illustrated)", url: "https://learnmeabitcoin.com/beginners/guide/blockchain/" },
    { label: "Mastering Bitcoin · Chapter 9: The Blockchain", url: "https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch09_blockchain.adoc" },
    { label: "mempool.space: browse real blocks and their header fields", url: "https://mempool.space/" },
  ],
};
