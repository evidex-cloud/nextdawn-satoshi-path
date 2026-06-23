export default {
  id: "ordinals",
  stage: 9,
  order: 2,
  title: "Ordinals and Inscriptions: Carving Things onto Sats",
  difficulty: "deep",
  prereqs: ["taproot", "tx-size-fees"],

  oneLiner:
    "Ordinal theory numbers every satoshi by the order it was mined, letting a specific sat be tracked and collected. On top of that, an “inscription” carves data such as images or text directly into the witness area of a Taproot transaction, attached to a particular sat — spawning on-chain NFTs, BRC-20, and the like, while drawing endless controversy for taking up block space and pushing fees higher.",

  intuition: `
Starting in 2023, a new kind of activity sprang up on Bitcoin, built around two concepts:

- **Ordinals:** number **every satoshi** by the order in which it was mined. So a **specific sat** gains a unique identity and can be tracked and collected — like printing a serial number on each banknote.
- **Inscriptions:** carve a piece of data (an image, text, even a tiny program) directly **into the witness area of a Taproot transaction**, "attached" to a particular sat. This amounts to making an **on-chain NFT** on Bitcoin; on top of it, experimental token schemes like **BRC-20** have also grown.

This works thanks to **Taproot (Stage 8.4)** loosening up what data the witness can hold.

But it's also highly controversial: inscriptions **take up block space**, competing with ordinary transfers for slots, and have **pushed everyone's fees higher** (callback 4.4). One camp feels "this isn't what Bitcoin should be doing"; another argues "it's permissionless — whoever can pay the fee gets to use it, and miners earn more on top." This dispute has no referee, only the market and culture wrestling it out.

Type in some content on the right and see how big an inscription is and how much fee it costs.

**In this lesson we break Ordinals and inscriptions into four pieces:**

- **① Ordinal theory — how to number every sat and track a "specific sat"**
- **② How an inscription gets on-chain — the "commit—reveal" two steps in the Taproot witness**
- **③ Meta-protocols like BRC-20 — conjuring "coins" out of thin air on top of inscriptions**
- **④ The block-space dispute — how a scarce public resource should be used**
`,

  mechanics: `
### ① Ordinal theory: numbering every sat

To ordinary eyes "all sats are alike," but ordinal theory gives each sat a **unique identity**:

- **Numbering rule**: number all roughly **21×10¹⁵ sats** in sequence, starting from 0, by the order in which they were **mined (minted)**. The first sat of the first block is 0, incrementing from there.
- **How to track**: as a sat moves through transactions, ordinal theory uses a convention ("first-in, first-out" — the sats in the inputs fill the outputs in order) to **determine which output each sat went to**. So a sat numbered "#1,234,567,890,123" can, in theory, be tracked from minting all the way to today's holder.
- **The key realization**: this numbering is **entirely an off-chain interpretation**; the Bitcoin protocol itself **has no idea** ordinals exist (see ④). It changes no bytes and no rules — it's just a shared agreement to "look at on-chain data through this lens." That's why it could appear "out of thin air," **requiring no upgrade or fork.** It also means that if different software agrees on different conventions, it could in theory see different results (in practice there's a standard implementation, \`ord\`, to unify them).
- The "rare sats" concept follows from this: sats in special positions (the first sat of each block, the first sat after a halving) are sought after by collectors — essentially a cultural game of manufacturing scarcity for "digital items."

### ② How an inscription gets on-chain: the commit—reveal two steps

Ordinals give sats an identity; an **inscription** "carves" content onto a sat. It uses Taproot's script path, completed in two transactions:

- **Commit**: first create a Taproot output whose script tree **hides** the data to be inscribed (the bytes of an image/text), but at this point the data is not yet exposed on-chain (callback 8.4's script-tree hiding property).
- **Reveal**: then spend this output, **taking the script path**, and **reveal** that data along with the script into the witness area — only at this moment is the data actually written into a block, "attached" to a particular sat of this transaction.
- **Why hide it in the witness?** Because witness data enjoys the **1/4 weight discount** (callback 8.2's weight accounting), inscribing the same amount of data is about **4x cheaper** in the witness area than in an ordinary output. Taproot also removed some size limits on individual scripts, making it possible to inscribe an **entire image.**
- ⚠ But "discounted" doesn't mean "free": an inscription **still consumes real block weight.** An image of a few dozen KB takes up a considerable share of a block, and during peak times fills blocks and pushes fee rates high (this happened repeatedly in 2023–2024).

### ③ Meta-protocols like BRC-20: "minting coins" on top of inscriptions

Since an inscription can carve arbitrary data, people used it to play with **tokens**:

- **BRC-20**'s approach is extremely plain: just inscribe a piece of **specifically-formatted JSON text** (such as \`{"p":"brc-20","op":"mint","tick":"ordi","amt":"1000"}\`), with the agreement that "inscribing this represents minting/transferring that many tokens."
- This is a **meta-protocol**: Bitcoin's consensus layer **doesn't recognize** these "tokens" at all; in its eyes they're just a pile of ordinary inscription text. "Who holds how much" depends entirely on **off-chain indexers** that interpret all the relevant inscriptions by the agreed rules and keep their own ledger.
- So BRC-20 is **not** an official Bitcoin token standard (Bitcoin has no official token standard), is **not at the consensus layer**, and its security is **not guaranteed by Bitcoin** — its rules are community conventions, mutable and contestable. It's more accurate to understand it as "keeping books in a customary format on Bitcoin's public bulletin board." It is a highly experimental, speculative practice.

### ④ The block-space dispute: how a scarce public resource should be used

The deepest controversy over inscriptions touches a fundamental question: **what should Bitcoin's limited block space be used for?**

- **One camp (against)**: holds that Bitcoin is **peer-to-peer electronic cash / a value-settlement network**, and block space should be prioritized for payments and settlement. Inscribing images is "hogging the spot," raising everyone's transfer costs, and bloating the chain faster (the same nerve as the big-block dispute, callback 8.1). Some even want to filter out inscriptions at the software level.
- **One camp (for / neutral)**: holds that Bitcoin is **permissionless** — **whoever can pay the fee has the right to use the block space**, and no one is entitled to dictate "which transactions are noble." Inscriptions also bring miners substantial **fee income**, which is actually a good thing for the long-term problem after future halvings (callback 2.5) where the block subsidy dwindles and the security budget must be carried by fees.
- **No central referee**: this is precisely **two sides of the same coin** of Bitcoin's "permissionless" nature — you can't stop others from using it in ways you dislike, just as others can't stop you. In the end, it's the **fee market** that allocates space (higher bidders go first), and the **cultural and technical debate** that shapes the ecosystem's direction. This dispute is itself a vivid lesson in "no one in a decentralized system can unilaterally define the 'correct usage.'"
`,

  demo: "inscription",

  analogy: `
Number every banknote with a unique serial number in printing order (Ordinals), and a specific banknote can be tracked and collected; an **inscription** is like stamping a picture in the banknote's blank space, making this "coin" carry extra information.

Some find it fun and collectible; others find it space-hogging and a driver of everyone's transfer costs — and that "space" is shared by all, so the argument is inevitable.
`,

  misconceptions: [
    "“Inscriptions modified Bitcoin's protocol or supply.” — They didn't. Ordinals are just an off-chain numbering convention, and inscriptions use the existing Taproot capability.",
    "“NFTs are impossible on Bitcoin.” — Inscriptions do exactly that — they write arbitrary data onto the chain, realizing on-chain collectibles.",
    "“Inscribing is free.” — It requires a fee and competes with ordinary transactions for block space, and can be quite expensive when popular.",
    "“BRC-20 is Bitcoin's official token standard.” — It isn't. It's an experimental meta-protocol built on top of inscriptions, not at the consensus layer.",
  ],

  quiz: [
    {
      q: "What are Ordinals essentially?",
      options: ["A hard fork", "An off-chain convention numbering each sat, changing no consensus rules", "A new coin", "A mining-pool protocol"],
      answer: 1,
      explain: "The protocol itself doesn't know about ordinals; it's an off-chain interpretation.",
    },
    {
      q: "Where do inscriptions store data in a transaction?",
      options: ["The block header", "The witness area of a Taproot transaction", "The Merkle root", "Inside the address"],
      answer: 1,
      explain: "Made possible by the witness-data capability that Taproot loosened up.",
    },
    {
      q: "What is the main reason inscriptions are controversial?",
      options: ["They're free", "They take up scarce block space and push fees higher", "They modified the supply", "They're insecure"],
      answer: 1,
      explain: "Block space is a shared resource, hence the dispute over how it's used.",
    },
    {
      q: "Which statement about BRC-20 is correct?",
      options: ["Bitcoin's official token standard", "An experimental meta-protocol built on inscriptions, not at the consensus layer", "A kind of sidechain", "A miner reward"],
      answer: 1,
      explain: "It uses inscription bookkeeping to simulate tokens — an experimental practice.",
    },
  ],

  further: [
    { label: "The official Ordinals handbook", url: "https://docs.ordinals.com/" },
    { label: "Wikipedia: Ordinals (Bitcoin)", url: "https://en.wikipedia.org/wiki/Ordinals" },
  ],
};
