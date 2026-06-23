export default {
  id: "segwit",
  stage: 8,
  order: 2,
  title: "SegWit: Moving the Signatures Out",
  difficulty: "core",
  prereqs: ["script", "tx-size-fees", "forks-bips"],

  oneLiner:
    "SegWit separates a transaction's “witness” (the signature) from its main body. That single move conveniently solves three things at once: it cures transaction malleability (paving the way for Lightning), gives witness data a discount (cheaper), and gently raises block capacity through a new “weight” accounting.",

  intuition: `
The name "Segregated Witness (SegWit)" is actually pretty literal: take the **witness** in a transaction (that is, the **signature**) and **segregate it out** into its own separate area. That one move untangles three old problems at once:

- **① Cures transaction malleability.** In the old design the signature was part of the main transaction body and got folded into the **txid**. But the encoding of a signature can be "re-traced" and tweaked by a third party (same amount, different txid). Any protocol that references an **unconfirmed transaction** (like a Lightning channel) would break because of this. SegWit moves the signature out of the txid calculation → **stable txid**, which lets second layers be built safely.
- **② Discounted witness, so cheaper.** When billing, witness data only counts at one-quarter weight (the vByte discount from Stage 4.4 comes from here).
- **③ Gentle scaling.** A new "weight" limit replaces the rigid 1MB, letting blocks hold more transactions (especially signature-heavy ones).

Even better: these three things are really three byproducts of **the same action** (moving the witness out) — and that is the elegance of SegWit's design. It also had to be accomplished **without splitting the network** (the aftermath of the block size war, callback 8.1), so the engineers came up with an ingenious "backward-compatible" trick.

The demo on the right: have a third party "re-trace" a signature, and compare whose txid changes — a legacy transaction or a SegWit transaction.

**In this lesson we break SegWit into five pieces:**

- **① What transaction malleability actually is — an old bug that plagued Bitcoin for years**
- **② How "segregating the witness" actually works — the split between txid and wtxid**
- **③ Weight and capacity — how the 4x discount is calculated**
- **④ Why it qualifies as a soft fork — the "anyone-can-spend" sleight of hand**
- **⑤ The bonus gains — bech32 addresses and paving the way for Taproot**
`,

  mechanics: `
### ① Transaction malleability: an old bug

**Malleability** means: a third party can change a transaction's byte representation — and therefore its **txid** — **without invalidating the signature, changing the amount, or stealing any money.**

- How is that done? Early Bitcoin's signature encoding (DER format plus some script operations) admitted multiple "equivalent ways to write it." For example, an ECDSA signature \`(r, s)\` and \`(r, -s mod n)\` are both mathematically valid but differ in bytes → the hashed txid differs. A man-in-the-middle, or even a miner, could **reskin** the transaction you broadcast before packaging it.
- For an **ordinary transfer** this is no big deal: the money still arrives, only the txid changed, so you just can't look it up by the original txid.
- But for **second-layer protocols it is fatal.** The Lightning channel trick is: "I sign in advance a commitment transaction that spends an **unconfirmed funding transaction**, and hold it as insurance" (next lesson). But if that funding transaction's txid can be changed by someone, the "insurance" I'm holding references a **nonexistent txid** and is void in an instant — and the channel funds could be carried off by the other party. **Until malleability is fixed, the Lightning Network simply cannot run safely.**

### ② How "segregating" actually works: txid and wtxid split apart

SegWit's core surgery: **take the witness (signature + unlocking script) out of the transaction body, put it into a separate "witness area," and make the txid computation no longer include it.**

- So a transaction now has **two hashes**: the **txid** (hashing only the "non-witness" part — amounts, input references, outputs, etc.) and the **wtxid** (the full hash including the witness).
- Since the txid no longer touches the signature, **however much someone "re-traces" the signature, the txid doesn't budge** → malleability is cured.
- The witness data is committed via a new **witness Merkle root** added to the block (tucked inside the coinbase transaction), guaranteeing it wasn't tampered with. Old nodes can't see this structure, but new nodes verify it.

### ③ Weight and capacity: how the 4x discount is calculated

SegWit took the opportunity to redefine block capacity. The block limit changed from "1MB of bytes" to "**4 million weight units (WU)**":

- **Base data** (the non-witness part) counts as **4** WU per byte; **witness data** counts as **1** WU per byte.
- So **vByte = weight ÷ 4** (the fee accounting from callback 4.4). The more signatures a transaction has (multisig, complex scripts), the more of its bytes land in the "90%-off" witness area, the smaller its effective size, and the more it saves on fees.
- **Why this particular discount?** It's a carefully tuned knob: it both gives witness data a break (encouraging everyone to use SegWit) and keeps the **maximum block at roughly a 4MB theoretical ceiling, about 1.5–2MB in practice** — modestly scaling capacity while **not actually pushing node burden to the level the big-block camp wanted**, holding the line on decentralization (callback 8.1). One number, soothing both demands at once.

### ④ Why it qualifies as a soft fork: backward-compatible sleight of hand

The hardest part: how do you add all this **without forcing everyone to upgrade and without splitting the network** (callback 6.4)?

- The answer exploits an old rule. A SegWit output, **in the eyes of old nodes**, is constructed as an "**anyone-can-spend**" script like \`OP_TRUE\` — by the old rules this is perfectly legal, and old nodes accept it without question.
- But **upgraded new nodes** see another layer of rules: to spend this output, you must provide a valid signature in the witness area. New nodes enforce this stricter rule.
- The result: old nodes think "everything is normal," keep validating and keep accepting these blocks, while new nodes genuinely enforce the SegWit rules — **the network does not split.** This is the classic soft-fork technique of "tightening with stricter rules rather than loosening." (The price is that old nodes aren't actually verifying that part of the signatures, so it needs enough hashrate and economic majority to upgrade for safety.)

### ⑤ The bonus gains: bech32 and paving the way for Taproot

SegWit also brought along two things with long-term payoff:

- **The new bech32 address (starting with bc1q)**: stronger error correction (mistyping a character or two can be detected), all-lowercase for easier reading, and smaller QR codes. This is the mainstream address format you see today.
- **Versioned room to upgrade**: SegWit introduced the concept of "witness versions" (v0 being today's bech32). This reserved a **clean upgrade path** for the later **Taproot (witness v1, starting with bc1p)** — no need for another major surgery (the last lesson of this stage). You could say SegWit not only solved the immediate problem but also **laid the roadbed** for Bitcoin's evolution over the years that followed.
`,

  demo: "malleability",

  analogy: `
An old transaction is like a contract with **the body and signature written on the same sheet, and the signature photocopied right into the serial number** — someone re-traces your signature's strokes and the contract's serial number changes, so anyone looking up the contract by the old number comes up empty.

SegWit **tears the signature off onto an attached page**: the body's serial number (txid) now depends only on the body, and however much the signature gets re-traced it doesn't affect the number. That both stabilizes the number (which saved Lightning) and makes things cheaper, because the attached page "bills at a discount."
`,

  misconceptions: [
    "“SegWit was just about making transactions cheaper.” — Cheaper is a bonus; the deeper point is curing transaction malleability, which makes second layers like Lightning possible.",
    "“SegWit was a hard fork.” — It wasn't. It's a backward-compatible soft fork; using the ‘anyone-can-spend’ sleight of hand, old nodes still accept the new blocks, with no split.",
    "“Witness data doesn't count toward block size.” — It does — it just counts at one-quarter weight (4 WU vs 1 WU, the source of the vByte discount).",
    "“Malleability lets someone steal the money in my transfer.” — It can't. It only changes the txid's byte representation, not the amount or the recipient; the real victims are second-layer protocols that reference unconfirmed transactions.",
    "“Only people using SegWit addresses are affected.” — It's the structure of the sender's transaction that changes; using a bc1 address makes your transaction's vByte smaller, which genuinely saves on fees.",
  ],

  quiz: [
    {
      q: "What did SegWit “segregate” out of a transaction?",
      options: ["The amount", "The witness (signature)", "The receiving address", "The fee"],
      answer: 1,
      explain: "It moves the signature into a separate witness area.",
    },
    {
      q: "What is SegWit's most far-reaching contribution?",
      options: ["Shorter addresses", "Curing transaction malleability so the txid is stable, paving the way for second layers like Lightning", "Raising the supply cap", "Eliminating fees"],
      answer: 1,
      explain: "The malleability fix is key; cheaper fees and scaling are bonuses.",
    },
    {
      q: "What does “transaction malleability” mean?",
      options: ["The transaction amount can change", "A third party can change the txid without invalidating the signature", "The block size can change", "The fee can change"],
      answer: 1,
      explain: "A txid altered by a third party would break protocols that reference unconfirmed transactions.",
    },
    {
      q: "What kind of upgrade is SegWit?",
      options: ["A hard fork that splits the chain", "A backward-compatible soft fork with no split", "A centralizing upgrade", "A private change"],
      answer: 1,
      explain: "Old nodes still accept the new blocks, allowing a smooth activation (callback 6.4).",
    },
  ],

  further: [
    { label: "Wikipedia: SegWit", url: "https://en.wikipedia.org/wiki/SegWit" },
    { label: "learnmeabitcoin: Segregated Witness", url: "https://learnmeabitcoin.com/technical/transaction/segwit/" },
  ],
};
