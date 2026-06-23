export default {
  id: "block-header",
  stage: 5,
  order: 1,
  title: "The Block Header: 80 Bytes Hashed Over and Over",
  difficulty: "core",
  prereqs: ["mining", "hashing", "merkle-tree"],

  oneLiner:
    "What exactly is mining hashing? The answer is an 80-byte “block header” — it packs together the version, the previous block hash, the Merkle root, the timestamp, the target difficulty, and a nonce. Miners just keep changing the nonce and taking a double SHA-256 of these 80 bytes until the result is smaller than the target value.",

  intuition: `
Stage 2 said mining is "endlessly swapping the nonce and trying hashes." Now let's lift the lid: what a miner repeatedly hashes is not the entire block (which could be megabytes), but a compact **80-byte block header**.

The block header packs 6 things, every one of which we've seen before: the version number, the previous block hash (which chains this block to the prior one, Stage 2.1), the Merkle root (the total fingerprint of all transactions, Stage 3.3), the timestamp, the target \`bits\` (the "passing line" of the current difficulty, next lesson), and the \`nonce\` (the only "trial-and-error knob" you can change freely).

Mining is: fix all the rest, **frantically change the \`nonce\`, take two SHA-256 hashes of these 80 bytes**, until the resulting hash is **smaller than the target value**. Change a \`nonce\`, hash once, fail, change again… hundreds of millions of times per second.

The demo on the right lays out these 6 fields and lets you actually mine: change the difficulty and see how many tries it takes to hit.

**In this lesson we break the "block header" into four pieces:**

- **① What's packed into the 80 bytes — the length and meaning of each field**
- **② Why hash only these 80 bytes — the Merkle root's role as a commitment**
- **③ The inner loop of mining — SHA256d, the 32-bit nonce, and the extranonce**
- **④ Hashrate and energy — how these 80 bytes "weld" the ledger shut**
`,

  mechanics: `
### ① What's packed into the 80 bytes: field by field

The block header is **a fixed 80 bytes**, with 6 fields in order (all stored in little-endian, callback to Stage 4.5):

- **Version (4 bytes)**: declares the rule version, and is also used for signaling (e.g. BIP9 soft-fork voting).
- **Previous block-header hash (32 bytes)**: the SHA256d of the previous block header. This field **strings the blocks into a chain** (Stage 2.1).
- **Merkle root (32 bytes)**: the **unique total fingerprint** produced by hashing all the block's transactions pairwise and merging layer by layer (Stage 3.3).
- **Timestamp (4 bytes)**: the Unix time the miner fills in, which must be roughly reasonable (the rules forbid it from being too far in the future, and require it to exceed the median time of the previous 11 blocks).
- **Target \`bits\` (4 bytes)**: a compact encoding that squeezes the 256-bit target value into 4 bytes — this is the "passing line" (expanded in the next lesson).
- **\`nonce\` (4 bytes)**: a pure 32-bit trial-and-error field.

These two 32 + 32 hashes alone take up 64 bytes, the bulk of the block header; the remaining 16 bytes are the version, time, \`bits\`, and \`nonce\`.

### ② Why hash only these 80 bytes: the Merkle root's commitment

A block may have thousands of transactions and run to megabytes, yet a miner hashes only 80 bytes over and over — what makes this equivalent to "working for the whole block"? The key is the **Merkle root**:

- It's the **single 32-byte root** that results from pairing up **all the block's transactions**, taking SHA256d, and continuing to merge the results pairwise (Stage 3.3).
- Altering **any single** transaction (even by one satoshi) changes its way up this tree to the root → the Merkle root changes → the block header changes → all the previous \`nonce\` trials are voided and it has to be re-mined.
- So hashing these 80 bytes is **equivalent to a commitment to the entire block's contents**: you can't swap out a transaction without re-mining. This binds the "proof of work" tightly to the block's entire contents.

### ③ The inner loop of mining: SHA256d, the 32-bit nonce, and the extranonce

- **Double SHA-256 (SHA256d)**: Bitcoin computes \`SHA256(SHA256(header))\`. Two layers are used to defend against a class of "length-extension attacks" on single-layer SHA-256 — purely conservative security redundancy.
- **The \`nonce\` is only 32 bits ≈ 4.3 billion values**. That sounds like a lot, but a modern miner can do hundreds of trillions of hashes per second — **it burns through all 4.3 billion nonces in a few milliseconds** without hitting. So what then?
- **Change other variable bits to make "a new 80 bytes"**: a miner tweaks the **timestamp**, or more commonly changes a piece of data in the coinbase transaction called the **extranonce** — this changes the Merkle root, which "resets" the entire \`nonce\` space so it can be scanned again (Stage 5.5). In essence, mining is searching for a passing header in a space far larger than 4.3 billion.
- A practical structure: the mining pool hands out a "work template," each miner scans the \`nonce\` + extranonce, and whenever it finds a header meeting a **lower share difficulty** it submits a "share" as proof of effort (Stage 5.3).

### ④ Hashrate and energy: how these 80 bytes "weld" the ledger shut

- **Hashrate = how many SHA256d the whole network can do per second**. Today it's measured in **EH/s (exahashes per second, 10¹⁸)** — an astronomical number.
- Every hash consumes real electricity. The accumulated work of the entire chain is, in essence, **the total sum of energy already burned** — and that's the physical source of what Stage 2.3 called "the ledger is irreversible because changing it costs more than anyone can afford."
- Stringing the whole chapter together: hashing (Stage 3.1) provides unpredictability, the Merkle root (3.3) anchors all transactions, the previous block hash (2.1) strings the chain, the target \`bits\` (next lesson) sets the difficulty, and PoW makes "writing this page" require burning real hashrate. These 80 bytes are where all of it converges.
`,

  demo: "header-mining",

  analogy: `
A block header is like a **shipping label**: it shows the delivery chain (previous block hash), the seal on the contents list (the Merkle root), the time it was sent, and a **forgery-proof number that must be made to match** (the nonce).

The miner's job is to keep trying different forgery-proof numbers until the whole label's "fingerprint" happens to fall within a prescribed, tiny range. Once it hits, the label (the block) is recognized by the whole network and pasted onto the chain.
`,

  misconceptions: [
    "“Mining hashes all the transactions of the entire block.” — No. What a miner hashes over and over is the 80-byte block header; the transactions have already been condensed into the header by the Merkle root.",
    "“The nonce space is infinite, so you can always try them all.” — The nonce is only 32 bits (about 4.3 billion); a miner scans it all in milliseconds. When it's exhausted without a hit, the miner changes the timestamp or the extranonce in the coinbase (thus changing the Merkle root) to make a new header to try.",
    "“Changing one transaction doesn't affect mining.” — It does. Transaction changes → Merkle root changes → block header changes → all the previous work is voided and it must be re-mined.",
    "“The block header stores the difficulty value directly.” — It stores a compactly encoded 4-byte “target (bits)”; the difficulty is converted from it (next lesson).",
    "“A single SHA-256 is enough.” — Bitcoin's block header uses double SHA-256 (SHA256d), i.e. it hashes the header twice, a security-redundancy design.",
  ],

  quiz: [
    {
      q: "What does a miner repeatedly take a double SHA-256 of?",
      options: ["All the transactions of the entire block", "The 80-byte block header", "Your private key", "The mempool"],
      answer: 1,
      explain: "The Merkle root has already squeezed the transactions into the header, so hashing the header commits to the whole block.",
    },
    {
      q: "What is the role of the “Merkle root” in the block header?",
      options: ["Recording the time", "Squeezing all the block's transactions into one total fingerprint", "Storing the nonce", "Pointing to the next block"],
      answer: 1,
      explain: "Altering any transaction changes the Merkle root, which in turn changes the block header.",
    },
    {
      q: "When the 32-bit nonce is fully exhausted without meeting the target, the miner will?",
      options: ["Give up", "Change the timestamp or the Merkle root (extranonce) to make a new header to try, and continue", "Lower the difficulty", "Wait for someone else to mine"],
      answer: 1,
      explain: "By changing other variable fields, it keeps producing new 80-byte headers to try.",
    },
    {
      q: "What is the significance of the “previous block hash” field?",
      options: ["Aesthetics", "Linking this block to the prior one, forming a tamper-proof chain", "Storing transactions", "Recording the miner's name"],
      answer: 1,
      explain: "This is exactly where the “chain” in blockchain comes from (Stage 2.1).",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Block header", url: "https://learnmeabitcoin.com/technical/block/block-header/" },
    { label: "learnmeabitcoin: Mining / nonce", url: "https://learnmeabitcoin.com/technical/mining/" },
  ],
};
