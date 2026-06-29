export default {
  id: "derivation-paths",
  stage: 7,
  order: 3,
  title: "Derivation Paths: What m/84'/0'/0'/0/0 Means",
  difficulty: "core",
  prereqs: ["hd-wallets", "address-types"],

  oneLiner:
    "An HD wallet uses a “derivation path” to number every address in the key tree. A path like m/84'/0'/0'/0/0 reads, segment by segment: address type (purpose), coin, account, receive-vs-change, and which address. Different “purpose” numbers correspond to different address types.",

  intuition: `
One seed can derive infinitely many keys — so how does the wallet know "which key to use, which address to generate"? Through the **derivation path** — giving every position on the tree a **standard number**, pinpointing it like a street address.

Take **m/84'/0'/0'/0/0** as an example: starting from the tree root \`m\`, it narrows the scope segment by segment — first picking the **address type**, then the **coin**, the **account**, and finally landing on **receive vs. change** and **which address**. Read these five segments and you can see through any path to where it points.

Drag each segment on the right to see how the path is assembled and what each part means.

**In this lesson we break "derivation paths" into four pieces:**

- **① Dissecting m/84'/0'/0'/0/0 segment by segment — what each of the five levels controls**
- **② The purpose number and address type — the mapping of 44/49/84/86**
- **③ Hardened derivation and the BIP44 standard — what the apostrophe means, and why standardize**
- **④ Why it's life-or-death for "recovery" — the truth behind a balance showing 0**
`,

  mechanics: `
### ① Dissecting m/84'/0'/0'/0/0 segment by segment

A standard path has **five levels**, narrowing from left to right just like an address:

- **m**: the master private key, i.e. the **root** of the entire tree (the starting point derived from the seed in Stage 7.1).
- **84' (purpose)**: determines the **address type** (see ② for details). The apostrophe denotes hardened derivation.
- **0' (coin type)**: 0' = Bitcoin mainnet, 1' = all testnets. This is the number the BIP44 registry assigns to each public chain.
- **0' (account)**: which "account" — **fully independent sub-wallets** that make it easy to categorize funds (e.g. work / personal / savings). Each account has its own complete set of addresses.
- **0 (change)**: only two values. **0 = external chain** (addresses you give to others, for receiving); **1 = internal chain** (change addresses sent back to yourself). The wallet uses this bit to separate "external receiving" from "internal change."
- **0 (index)**: **which address** on this chain, incrementing from 0; each receipt uses the next one, realizing the "switch address after each use" of Stage 7.1.

So \`m/84'/0'/0'/0/0\` reads as: native SegWit, Bitcoin mainnet, account 0, external receiving chain, address 0 — that is, **the first receiving address** the wallet gives you by default.

### ② The purpose number and address type

That "purpose number" in the first segment is the most worth memorizing, because it **binds which kind of address you use and what it looks like**:

- **44'** → legacy P2PKH, addresses starting with **1...** (BIP44).
- **49'** → wrapped SegWit (P2SH-P2WPKH), addresses starting with **3...** (BIP49).
- **84'** → native SegWit (P2WPKH), addresses starting with **bc1q...**, cheaper fees (BIP84).
- **86'** → Taproot (P2TR), addresses starting with **bc1p...**, better privacy and multisig efficiency (BIP86).

In other words, **just by looking at the first segment of a path, you can predict the address prefix** the wallet will generate — the background of address types is in Stage 4.3 (the address-types lesson).

### ③ Hardened derivation and the BIP44 standard

- **An apostrophe = hardened derivation** (the principle was covered in Stage 7.1). The convention is to **harden the first three segments (purpose / coin / account)**, isolating each account's security risk from the others; the last two segments (change / index) use ordinary derivation, which is what lets an account-level xpub derive all receiving addresses and support watch-only wallets (Stage 7.1).
- **This five-segment structure comes from BIP44**, and BIP49/84/86 later reused the same skeleton for new address types. It standardizes "purpose/coin/account/change/index" so that **all wallets speak the same "address language"** — which is exactly the premise that lets different brands of wallets recover the same seed from one another.

### ④ Why it's life-or-death for "recovery"

This is the most practical point of the lesson, and the pit beginners most often fall into:

- When you recover a seed in a new wallet, the new wallet must scan addresses **along the same path** to discover your coins. A correct seed is not enough — **the path must be correct too**.
- If two wallets have **different default paths** (e.g. the old wallet defaults to \`44'\` while the new one defaults to \`84'\`), after recovery you may well see a **balance of 0** — at which point don't panic: **the coins are sitting safe and sound on-chain**, the new wallet is just looking on a different path and naturally sees nothing.
- **The fix**: in the new wallet, **manually specify the correct derivation path** (or import the corresponding account xpub) and the balance comes right back. Understanding this keeps you from being scared by "phantom coin loss" during cross-wallet migration or when setting up a watch-only wallet.
- **Practical tip**: most modern wallets default to \`84'\` (native SegWit) or \`86'\` (Taproot); before migrating, confirm that both sides' path conventions match, which saves a lot of frights.
`,

  demo: "path-decoder",

  analogy: `
A derivation path is like a **library call number**: it narrows the scope segment by segment — which wing (purpose/address type), which language (coin), which shelf (account), which level (receive or change), which book (index).

Following the same numbering scheme, anyone can pinpoint "the same book" in another library — which is exactly the key to different wallets recovering the same seed.
`,

  misconceptions: [
    "“A derivation path is just a nice-looking string.” — It deterministically pinpoints every key on the tree; change one segment and it points to a completely different address.",
    "“Import a seed into any wallet and it shows the same thing.” — Only with the same path convention; a different default path may show an empty balance after recovery (the coins are still there).",
    "“Account and index are the same thing.” — They aren't. An account is an independent sub-wallet; the index is which address on a given chain.",
    "“The purpose number can be filled in however you like.” — It binds the address type and standard (44/49/84/86) and can't be set arbitrarily.",
  ],

  quiz: [
    {
      q: "What does the “84'” in m/84'/0'/0'/0/0 determine?",
      options: ["The account number", "The address type (here, native SegWit, bc1q...)", "The number of coins", "The fee"],
      answer: 1,
      explain: "The purpose number binds the address type: 44/49/84/86 each differ.",
    },
    {
      q: "What does change = 1 mean in the path?",
      options: ["Account 1", "Internal chain: a change address sent back to yourself", "A hard fork", "A fee tier"],
      answer: 1,
      explain: "0 = external receiving address, 1 = internal change address.",
    },
    {
      q: "After recovering a seed in a new wallet, the “balance shows 0” — what's the most likely reason?",
      options: ["The coins were confiscated", "The new wallet's default derivation path differs from the original, so it isn't looking on the right path", "The seed is wrong", "A network failure"],
      answer: 1,
      explain: "Manually specifying the correct path usually recovers it; the coins were on-chain all along.",
    },
    {
      q: "What is the value of BIP44's path structure?",
      options: ["Making addresses shorter", "Standardizing “purpose/coin/account/change/index” so wallets interoperate", "Raising the supply", "Encrypting the path"],
      answer: 1,
      explain: "A unified “address language” brings cross-wallet interoperability.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Derivation paths", url: "https://learnmeabitcoin.com/technical/keys/hd-wallets/derivation-paths/" },
    { label: "BIP44 (original text)", url: "https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki" },
  ],
};
