export default {
  id: "merkle-tree",
  stage: 3,
  order: 3,
  title: "Merkle Trees: Compressing Ten Thousand Transactions into One Fingerprint",
  difficulty: "core",
  prereqs: ["hashing"],

  oneLiner:
    "A Merkle tree takes the thousands of transactions in a block, hashes them in pairs layer by layer, and ultimately distills them into a single “Merkle root” tucked into the block header. It lets you prove that “a given transaction really is in this block” using very little data, without downloading the whole block.",

  intuition: `
A block might hold tens of thousands of transactions. How do you represent all of them with **one** tiny fingerprint, and still efficiently prove that "a given transaction really is in there" without downloading the entire block? The answer is the **Merkle tree** — a structure that rolls everything up layer by layer with hashes.

The method is simple (hashing again): each transaction is hashed into a "leaf," leaves are paired up and hashed into the layer above, and so on layer by layer until only **one** fingerprint remains — the **Merkle root** — which is written into the block header. From this grow two superpowers: altering any transaction **propagates all the way up to the root** (tamper resistance), and proving a single transaction is included needs only a path of about **log₂(n) length** (lightweight proof). This second point is exactly the bedrock that lets phone-based light wallets exist.

The demo on the right: change a leaf and watch how the root changes, then click "prove a transaction is in the tree" to see exactly which hashes it needs.

**In this lesson we break the Merkle tree into four pieces:**

- **① How to build it — from pair-hashing leaves up to a single root**
- **② Superpower one: pull one hair and the whole body moves — how tamper resistance works**
- **③ Superpower two: the Merkle proof — log₂(n) hashes prove inclusion**
- **④ What it holds up — SPV light wallets and implementation details**
`,

  mechanics: `
### ① How to build it: from pair-hashing leaves up to a single root

Take a small block holding 4 transactions (Tx A, B, C, D) and build a tree by hand:

- **Layer 0 (leaves)**: hash each on its own — H_A = hash(A), H_B = hash(B), H_C = hash(C), H_D = hash(D).
- **Layer 1**: concatenate adjacent pairs and hash — H_AB = hash(H_A + H_B), H_CD = hash(H_C + H_D).
- **Layer 2 (root)**: H_ABCD = hash(H_AB + H_CD) — this is the **Merkle root**, written into the block header.
- Each layer up halves the number of nodes, so a tree of n transactions is about **log₂(n)** tall: even 10,000 transactions are only about 14 layers.
- **What about an odd number?** If a layer has an odd number of nodes, Bitcoin **pairs the last one with itself** and hashes (not padding with zeros), making it even to continue upward.

### ② Superpower one: pull one hair and the whole body moves — how tamper resistance works

The Merkle root can "stand in for all transactions" because the hash avalanche effect propagates all the way up:

- Suppose someone secretly alters Tx C's amount → H_C changes → H_CD changes → the root H_ABCD changes.
- And the root is locked in the block header, which itself participates in mining and linking (Stage 2.1) — once the root changes, this block's header hash changes, no longer matches the next block, and **the tampering is exposed on the spot**.
- So a miner **can't swap any transaction in the block without redoing the work**. The Merkle root compresses "tens of thousands of transactions in the block body" into a single 32-byte commitment in the block header.

### ③ Superpower two: the Merkle proof — log₂(n) hashes prove inclusion

This is the most practical part of the Merkle tree. To prove that **Tx C is in this block**, you don't need the contents of A, B, or D — only a **Merkle proof**:

- You're given two "sibling fingerprints": **H_D** (C's neighbor) and **H_AB** (CD's neighbor).
- You compute it yourself: H_C = hash(C) → H_CD = hash(H_C + H_D) → root = hash(H_AB + H_CD).
- If your computed root is **exactly identical** to the root in the block header, it proves C really is in the tree — and you used only **2 hashes**, touching no other transaction.
- In general: n transactions need only about **log₂(n) sibling hashes**. 10,000 transactions → about 14 hashes (a few hundred bytes) can prove inclusion; compared with downloading the whole 1–2 MB block, that's a saving of several thousandfold.
- **Why does it have to be a "tree"?** If you concatenated all transactions and hashed them just once, verifying a single one would require obtaining all of them and recomputing. The tree structure is what buys you this log₂(n) shortcut.

### ④ What it holds up: SPV light wallets and implementation details

The Merkle proof directly gave rise to **light wallets (SPV, simplified payment verification)**:

- A phone wallet doesn't store the whole chain (hundreds of GB), only each block's **block header** (containing the Merkle root, just 80 bytes each).
- To confirm "my transaction was packed," it **asks a full node for a Merkle proof**, computes up to the root itself, and compares against the root in the block header it holds — and it's convinced. The download is tiny (node types covered in detail in Stage 6).
- The trade-off: SPV only verifies "the transaction is included + the work is sufficient," not every rule the way a full node does, so its trust assumption is slightly stronger.
- **A few implementation details**: the tree uses **double SHA-256**; an odd node is paired with itself (see ①, which once led to the CVE-2012-2459 vulnerability, requiring careful deduplication); and the block header stores exactly this root. These come up again in Stages 4 and 5.
- **A one-sentence placement**: a hash is "the fingerprint of one thing," and a Merkle tree is "the total, locally-verifiable fingerprint of a whole pile of things."
`,

  demo: "merkle-tree",

  analogy: `
Imagine a **layered countersigned attendance sheet**: each small group first signs off a group summary name, several groups' summaries are countersigned into a department name, and finally everything rolls up into **one grand company-wide signature** posted at the door.

- If someone secretly alters one member's record, that group's summary changes, propagating all the way to the grand signature at the door — caught at a glance.
- And to prove "a certain employee really was present that day," you don't have to haul out the whole company roster; you only need the **few signatures along their countersigning path** to trace all the way up to the grand signature at the door.
`,

  misconceptions: [
    "“The Merkle root can reconstruct all the transactions.” —— It can't. It's a one-way, layer-by-layer hash summary, usable only to verify, not to recover the original transactions.",
    "“To verify a transaction is in a block, you must download the entire block.” —— You don't. With a Merkle proof, you only need the few sibling hashes from that transaction up to the root (about log₂(n) of them); even 10,000 transactions need only about 14.",
    "“A Merkle proof can tell you an account's balance or a transaction's contents.” —— It can't. It answers only the single yes-or-no question “is this transaction in this block,” revealing nothing about other transactions.",
    "“The Merkle tree was invented by Bitcoin.” —— It wasn't. It was proposed by Ralph Merkle in 1979; Bitcoin applied it within the block structure.",
  ],

  quiz: [
    {
      q: "How is the Merkle root obtained?",
      options: ["By summing all the transaction numbers", "By hashing transactions in pairs, layer by layer, into a single fingerprint", "Randomly generated", "Specified by the miner"],
      answer: 1,
      explain: "Pair-hashing layer by layer yields a final single root, written into the block header.",
    },
    {
      q: "What is the Merkle tree's biggest practical value?",
      options: ["Compressing transactions to save space", "Proving a transaction's inclusion with very little data (about log₂(n) hashes)", "Encrypting transaction contents", "Speeding up mining"],
      answer: 1,
      explain: "This is the Merkle proof, which underpins light wallets (SPV).",
    },
    {
      q: "What happens if you alter a transaction in a block?",
      options: ["Only that one transaction is affected", "Its leaf fingerprint changes all the way up, and the Merkle root changes with it", "The Merkle root stays the same", "A network-wide vote is needed"],
      answer: 1,
      explain: "Pull one hair and the whole body moves — the root changes, the block header no longer matches, and the tampering is exposed.",
    },
    {
      q: "How does a phone light wallet (SPV) confirm a transaction was packed?",
      options: ["Downloads the entire blockchain", "Stores only block headers, then traces up to the root with a Merkle proof", "Phones the miners to ask", "Fully trusts the exchange"],
      answer: 1,
      explain: "The Merkle root in the block header plus a short proof — a tiny download.",
    },
    {
      q: "To prove “a transaction is in a block containing n transactions,” about how many hashes are needed?",
      options: ["n", "About log₂(n) sibling hashes", "1", "n²"],
      answer: 1,
      explain: "You only need the sibling fingerprints along the path from that transaction to the root, about log₂(n); even 10,000 transactions need only about 14.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Merkle root (illustrated)", url: "https://learnmeabitcoin.com/technical/block/merkle-root/" },
    { label: "Wikipedia: Merkle tree", url: "https://en.wikipedia.org/wiki/Merkle_tree" },
  ],
};
