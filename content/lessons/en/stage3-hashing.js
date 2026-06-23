// Template lesson —— this is the “fixed template for every lesson”; when writing a new lesson, just fill in this structure.
// See the README for field descriptions. The prose fields support minimal Markdown: **bold**, `code`, [text](link), - lists, > quotes, blank-line paragraph breaks.

export default {
  id: "hashing",
  stage: 3,
  order: 1,
  title: "Hash Functions: Bitcoin's Fingerprint Machine",
  difficulty: "core", // intro | core | deep
  prereqs: [],        // e.g. ["binary-basics"], rendered as prerequisite links

  oneLiner:
    "A hash function compresses any data into a **fixed-length** “fingerprint” — the same input always yields the same fingerprint, changing one character transforms it beyond recognition, and no one can reverse a fingerprint back to the original. Bitcoin relies on this at nearly every turn.",

  // 🧠 Intuition (no jargon — build the mental model first)
  intuition: `
Imagine a machine: you toss in **anything** — a single word, an entire book, a whole movie — and it spits out a string of **fixed length** (the SHA-256 Bitcoin uses is always 256 bits = 64 hexadecimal characters). This machine is called a **hash function**, and it's the shared bedrock of nearly every part of Bitcoin.

Its magic lies in four properties: the same input always yields the same output (deterministic), change one character and the output is unrecognizable (avalanche), reversing a fingerprint back to the original is essentially impossible (one-way), and finding two inputs that collide into the same fingerprint is essentially impossible too (collision-resistant). Lock these four in and Bitcoin's blocks, transactions, mining, and addresses ahead will all follow naturally.

The lab bench on the right lets you **verify these properties with your own hands** — change one character and watch the output turn upside down.

**In this lesson we break the hash function into four pieces:**

- **① The four magic properties — deterministic, avalanche, one-way, collision-resistant**
- **② What SHA-256 looks like — 256 bits and double hashing**
- **③ Five places hashing shows up in Bitcoin — the glue holding the parts together**
- **④ The numerical intuition for avalanche and one-wayness — why brute force can't crack it**
`,

  // ⚙️ Deeper mechanics (for those willing to go deeper; you can switch to “intuition only” at the top of the lesson to hide this section)
  mechanics: `
### ① The four magic properties: deterministic, avalanche, one-way, collision-resistant

Remember these four and you can derive every use of hashing in Bitcoin yourself:

- **Deterministic**: the same input always yields the same output. Compute it today or ten years from now, on any machine anywhere on Earth, and the result is **identical down to the character** — this is the prerequisite for "anyone can verify independently."
- **Avalanche effect**: change **even a single character** of the input (even the case of one punctuation mark) and the output is unrecognizable — on average about **half the bits** flip. You can't "nudge the output" by "nudging the input."
- **One-way**: computing a fingerprint from an input is fast; but taking a fingerprint and trying to work back to the input has **no shortcut at all, only brute-force exhaustion**, which for high-entropy data is physically impossible.
- **Collision-resistant**: it's virtually impossible to find two different inputs that produce the same fingerprint. This is exactly why one hash can "stand in for" its original.

> In a sentence: a hash is data's **fingerprint** — unique, fixed, verifiable, but irreversible.

### ② What SHA-256 looks like: 256 bits and double hashing

Bitcoin's workhorse hash function is **SHA-256** (Secure Hash Algorithm, output **256 bits = 32 bytes = 64 hexadecimal characters**):

- Whether you feed in 1 byte or 1 GB, the output is always this fixed 256 bits — a huge integer between 0 and 2²⁵⁶−1. 2²⁵⁶ is roughly 10⁷⁷, **the same order of magnitude as the total number of atoms in the observable universe**.
- Many key spots actually use **double SHA-256** (written SHA256d, i.e. hashing twice in a row, \`SHA256(SHA256(x))\`): the block header hash, txid, and Merkle tree all use it. Historically the extra pass guards against a class of "length-extension attacks," an added layer of redundant insurance.
- The address path is slightly different: the public key goes through SHA-256 first, then **RIPEMD-160** (a 160-bit, shorter output); this step is called HASH160 (detailed in Stage 4).

### ③ Five places hashing shows up in Bitcoin: the glue holding the parts together

Hashing is nearly everywhere; these five spots hold up the whole system:

- **Block linking**: every block header embeds **the hash of the previous block header**. Alter any old block and its hash changes, breaking every link after it — this is the root of the "chain's" tamper resistance (Stage 2.1).
- **Transaction ID (txid)**: a transaction's contents put through double SHA-256 is its network-wide unique identifier. It's what you search for in an explorer.
- **Merkle tree**: the thousands of transactions in a block are hashed in pairs, layer by layer upward, into a single **Merkle root** tucked into the block header (Stage 3.3 covers this specifically).
- **Proof of work (mining)**: miners keep changing the nonce in the block header and re-hashing until **the block header hash, as a number, is below the target**. Because a hash is unpredictable and avalanches, they can only try again and again — this is the essence of "work" (Stage 2.3 / 5).
- **Addresses**: the public key goes through SHA-256 + RIPEMD-160 to get the public key hash, then gets encoded into the address you commonly see (Stage 4) — one extra layer of hashing means the public key never has to be exposed before you spend.

### ④ The numerical intuition for avalanche and one-wayness: why brute force can't crack it

Why does everyone dare to say "a hash is engineering-irreversible and collision-free"? Feel the scale through some numbers:

- **How hard is reversing by brute force**: to guess back the original from a 256-bit fingerprint, you average 2²⁵⁵ tries. Even running the entire global Bitcoin hashrate (about 10²¹ hashes/sec, the EH/s scale of Stage 2.3), you'd need far longer than the **age of the universe** to finish — this is the physical meaning of "one-way."
- **How rare is a collision**: finding one SHA-256 collision via a birthday attack takes about 2¹²⁸ tries. That number is countless times larger than all the grains of sand on Earth — engineering-wise it's simply treated as "won't happen."
- **What avalanche is good for**: precisely because changing one character flips about half the bits unpredictably, a hash can **sensitively detect tampering** (change a little and it all changes) and **can't be reverse-nudged** (to conjure a specific fingerprint you can only try blindly) — both at once, which is exactly what supports tamper resistance and mining.

In other words: **hashing is the glue that holds all of Bitcoin's parts together.** Understand it thoroughly and the blocks, transactions, and mining ahead will all get much easier.
`,

  // 🔬 Interactive demo (corresponds to a component id under demos/)
  demo: "hash-lab",

  // 🪞 Analogy
  analogy: `
Like a **blender**: you put in an apple, a banana, a whole table of dishes, and it blends them all into a single juice. Blending is fast, but you **can't reconstruct the original fruit from the juice** — that's one-wayness.

Or like a **fingerprint**: everyone's fingerprint is unique and fixed for life, usable to verify identity; but you **can't “grow” a person from a single fingerprint**.
`,

  // ⚠️ Common misconceptions (corrected one by one)
  misconceptions: [
    "“Hashing is encryption.” —— It isn't. Encryption exists so you can later **decrypt** and recover the original; hashing is **irreversible** — there's no such operation as “un-hashing.”",
    "“Different inputs might collide into the same hash, so it's unreliable.” —— Collisions exist in theory, but for SHA-256 the probability is so tiny that you couldn't hit one even running the entire universe's computing power until the universe ends — engineering-wise, it's treated as never happening.",
    "“If you know the hash, you can guess the original.” —— You can only brute-force it. For a high-entropy input (like a random private key), that's physically infeasible.",
  ],

  // ✅ Self-check (click for instant feedback)
  quiz: [
    {
      q: "If you change one character of the input, what happens to the output hash?",
      options: [
        "Barely changes, off by a bit or two",
        "Completely different, with about half the bits flipped",
        "Gets shorter",
        "No way to predict whether it changes",
      ],
      answer: 1,
      explain: "This is the **avalanche effect**: a tiny input change causes a drastic output change. That's exactly why a hash can both sensitively detect tampering and not be “nudged.”",
    },
    {
      q: "Which of the following is **not** a property of a hash function?",
      options: [
        "Deterministic (same input, same output)",
        "Reversible (can recover the original from the hash)",
        "Fixed-length output",
        "Collision-resistant",
      ],
      answer: 1,
      explain: "A hash is **one-way** and irreversible. This is the biggest difference between it and “encryption.”",
    },
    {
      q: "What is Bitcoin mining essentially doing over and over?",
      options: [
        "Decrypting a ciphertext",
        "Repeatedly trying nonces until the block header's hash is below the target",
        "Encrypting transactions",
        "Calculating each transaction's fee",
      ],
      answer: 1,
      explain: "Proof of work is **repeated hashing**, constantly changing the nonce until you hit a hash small enough. Because a hash is unpredictable, there's no shortcut — you can only try. That's the “work.”",
    },
  ],

  // 📚 Further reading
  further: [
    { label: "Bitcoin Whitepaper (Satoshi's original PDF)", url: "https://bitcoin.org/bitcoin.pdf" },
    { label: "learnmeabitcoin: Hash function (illustrated, interactive)", url: "https://learnmeabitcoin.com/technical/cryptography/hash-function/" },
  ],
};
