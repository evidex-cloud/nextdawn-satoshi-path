export default {
  id: "taproot",
  stage: 8,
  order: 4,
  title: "Taproot and Schnorr: More Private, More Efficient",
  difficulty: "core",
  prereqs: ["signatures", "address-types", "multisig-psbt"],

  oneLiner:
    "The 2021 Taproot upgrade introduced Schnorr signatures: they can “aggregate” the signatures of many keys into one, so a multisig or a complex contract looks on-chain exactly like the most ordinary single-signature transfer — saving space and greatly boosting privacy.",

  intuition: `
You've seen Taproot addresses (bc1p) back in Stage 4.3; this lesson explains why they're good. At the core is a new signature algorithm, **Schnorr**, which has a beautiful mathematical property — **it can "aggregate" multiple signatures and public keys into one**.

This brings two big things:

- **Multisig that looks like single-sig.** With Schnorr, a 3-of-3 multisig can aggregate three keys into **one** public key and three signatures into **one** signature. On-chain you only see an ordinary signature, **saving space and hiding the fact that it's a multisig** → a big privacy gain.
- **Complex conditions can be hidden (MAST/Taproot).** A single UTXO can carry both a "normal cooperative spend" and several sets of "backup terms." As long as everyone **cooperates and takes the normal path**, the backup terms are **never even revealed**; what shows up on-chain is, again, a perfectly unremarkable transfer.

Put together: even a multisig, a Lightning channel, or a time-locked contract becomes **indistinguishable from an ordinary payment** as long as it takes the cooperative path — which both boosts privacy (**fungibility**) and saves on fees. Taproot is a soft fork that activated in 2021, and so far the **last** major consensus upgrade; it builds on the witness-version space that SegWit reserved (callback 8.2).

Toggle ECDSA / Schnorr on the right and see how differently the same 3-of-3 multisig shows up on-chain.

**In this lesson we break Taproot into five pieces:**

- **① Why Schnorr can aggregate — and ECDSA can't**
- **② Key aggregation in practice — MuSig compresses multisig down to single-sig**
- **③ MAST and the script tree — hiding the terms that go unused, completely**
- **④ Key path vs script path — Taproot's "two sides of one coin"**
- **⑤ Who benefits, how it's adopted — privacy, fungibility, and gradual migration**
`,

  mechanics: `
### ① Why Schnorr can aggregate, ECDSA can't

The key is one mathematical property: **linearity.**

- The **ECDSA** signatures Bitcoin originally used include an **inversion (a multiplicative inverse modulo \`n\`)** in their verification equation, which makes them **non-linear** — you can't simply "add" two people's ECDSA signatures to get a signature valid for the "sum of the two public keys." So a multisig has to list each person's signature **separately** on-chain: n people means n public keys + n signatures, which is both large and obviously "an n-signer multisig" at a glance.
- **Schnorr (BIP340)**'s signature equation is **purely linear**: a form like \`s = k + e·x\`, with no annoying inversion. So signatures and public keys can be **added directly** — several signatures summed together are exactly a valid signature for the aggregated public key formed by summing those public keys.
- A bonus: Schnorr has **provable security** (under standard assumptions) and **deterministic nonces** (mandated by BIP340, avoiding the historical ECDSA disasters where reused nonces leaked private keys). In other words, Schnorr isn't just "able to aggregate"; it is itself a cleaner, safer signature.

### ② Key aggregation in practice: MuSig compresses multisig down to single-sig

Linearity is only the foundation; what actually puts it to use are **key aggregation** schemes like **MuSig (and the improved MuSig2)**:

- **n private keys → 1 aggregated public key \`P = P₁ + P₂ + … + Pₙ\`** (in practice multiplied by coefficients that defend against "rogue-key" attacks), and **n partial signatures → 1 aggregated signature**.
- On-chain **only one public key and one signature appear**, **byte-for-byte indistinguishable** from the most ordinary single-signature transfer. A 3-of-3 multisig that originally had to write 3 public keys + 3 signatures on-chain now shrinks to 1 + 1 — **massively saving on fees and completely hiding the fact that it's a multisig.**
- ⚠ Note the boundary: pure key aggregation like MuSig naturally corresponds to **n-of-n (everyone signs)**. To do a **k-of-n threshold (like 2-of-3)**, you either take the script path below, or use more complex threshold signatures (FROST and the like, still evolving). So "multisig disguised as single-sig" is most perfect for **fully-cooperative** scenarios.

### ③ MAST and the script tree: hiding the unused terms

Aggregating keys alone isn't enough. Real contracts often have **multiple spending branches** ("normal cooperative spend" / "unilateral refund after timeout" / "go to arbitration if there's a dispute"…). The old approach (P2SH) had to expose **all the branch scripts** on-chain, which is both large and leaks privacy. **MAST (Merklized Alternative Script Trees)** solves this with a Merkle tree:

- Each branch script is **hashed into a leaf**, the leaves form a **Merkle tree**, and on-chain you commit only to the tree's **root**.
- When spending, you **reveal only the one branch actually used**, plus a **Merkle proof** (showing it really belongs to this tree); the existence of the other branches **can't even be seen**.
- The more branches, the more you save and the deeper you hide: a contract with 8 terms exposes, when spent, only 1 of them + a few hashes, rather than all 8 scripts.

### ④ Key path vs script path: Taproot's two sides of one coin

The essence of **Taproot (BIP341/342)** is to stitch ②'s key aggregation and ③'s script tree **into the same output.** A Taproot output commits to two things at once:

- **Key path**: an aggregated "cooperative public key." As long as the relevant parties **are willing to cooperate**, they use MuSig to assemble one signature and take this path — what shows up on-chain is **a perfectly ordinary single-signature transfer**, and no one knows whether there's a contract, a multisig, or backup terms behind it.
- **Script path**: that MAST script tree. Only when **cooperation breaks down and some backup term must be invoked** is **that one** branch revealed.
- The clever part: the aggregated public key goes through a one-time "**taproot tweak**" that **hides the script tree's root inside the public key itself** — so when taking the key path, the script tree is **completely invisible**; only taking the script path reveals it. **The vast majority of the time everyone cooperates and takes the key path**, so in the on-chain world, Lightning channels, vaults, and multisig wallets **all wear the face of an "ordinary transfer."**

### ⑤ Who benefits, how it's adopted

- **Who benefits?** Multisig users, the Lightning Network (cheaper and stealthier channel opens/closes), and all kinds of conditional spends — they can all "disguise" themselves as ordinary payments. This benefits not only individual privacy but also the whole network's **fungibility**: when on-chain transactions all **look the same**, it gets harder to "label and discriminate against" certain coins (callback Stage 9.1 privacy). A smaller witness also directly means **lower fees**.
- **Gradual adoption (callback 6.4's upgrade philosophy):** Taproot **coexists** with older address types (P2PKH, bc1q SegWit v0, etc.), and wallets and the ecosystem are migrating step by step — exchanges and wallets must add bc1p support one by one and implement the MuSig signing flow, which takes time. Whether and how much to use it is **up to users and services**, with no compulsion and no split. This "provide the capability, adopt it voluntarily, roll it out slowly" approach is yet another expression of Bitcoin's conservative evolution philosophy.
`,

  demo: "schnorr-agg",

  analogy: `
Think of a multisig as a contract that needs several people's signatures. The **old way (ECDSA)** sticks each person's signature on the front of the contract, so anyone can tell "this is a 3-person contract."

**Schnorr** is like having three people co-write a **single unified signature that doesn't look co-written** — outsiders see just one ordinary signature, saving paper and hiding the inside story. **Taproot** adds one more trick: the contract actually comes with several sets of backup terms, but as long as everyone cooperates and takes the "normal set," the backup terms are never even revealed.
`,

  misconceptions: [
    "“Taproot lets Bitcoin run smart contracts like Ethereum.” — It improves the privacy and efficiency of scripting, but the base layer did not become a Turing-complete contract platform.",
    "“Schnorr replaces the concept of private keys/addresses.” — It doesn't. It's the same key model, just with a better, safer signature algorithm (deterministic nonces).",
    "“Aggregated signatures make multisig less secure.” — They don't. Each signer still needs their own key to participate; aggregation only changes the on-chain ‘representation,’ not the security threshold.",
    "“Any multisig can be disguised as a single-sig without a trace.” — The most perfect case is n-of-n full cooperation; a k-of-n threshold either takes the script path that exposes the script, or uses still-evolving threshold-signature schemes.",
    "“With Taproot, privacy is absolutely perfect.” — It works best only when you take the cooperative key path and the ecosystem adopts it broadly; taking the script path still exposes the branch, and chain analysis still exists.",
  ],

  quiz: [
    {
      q: "What is Schnorr's key new ability compared to ECDSA?",
      options: ["Faster block production", "Aggregating multiple public keys/signatures into one", "Raising the supply", "Free fees"],
      answer: 1,
      explain: "Linearity enables key aggregation, letting a multisig disguise itself as single-sig.",
    },
    {
      q: "After Schnorr aggregation, what does a 3-of-3 multisig look like on-chain?",
      options: ["Three signatures listed separately", "An ordinary single-signature transfer", "A block", "A string of gibberish"],
      answer: 1,
      explain: "Outsiders can't tell it's a multisig → improved privacy and fungibility.",
    },
    {
      q: "What's the benefit of Taproot's MAST (tree of alternative scripts)?",
      options: ["It makes transactions bigger", "Only the one spending branch actually used is exposed; the rest stay hidden", "It raises difficulty", "It eliminates signatures"],
      answer: 1,
      explain: "When taking the cooperative key path, complex conditions aren't revealed at all.",
    },
    {
      q: "Which statement about Taproot adoption is correct?",
      options: ["Everyone is forced to switch immediately", "It coexists with old addresses, and users and the ecosystem migrate gradually", "Only miners can use it", "It has been deprecated"],
      answer: 1,
      explain: "Gradual adoption, reflecting Bitcoin's conservative upgrade philosophy.",
    },
  ],

  further: [
    { label: "Wikipedia: Taproot (Bitcoin)", url: "https://en.wikipedia.org/wiki/Taproot_(Bitcoin)" },
    { label: "learnmeabitcoin: Schnorr / Taproot", url: "https://learnmeabitcoin.com/technical/upgrades/taproot/" },
  ],
};
