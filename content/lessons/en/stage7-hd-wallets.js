export default {
  id: "hd-wallets",
  stage: 7,
  order: 1,
  title: "HD Wallets: One Seed Grows a Whole Tree of Keys (BIP32)",
  difficulty: "core",
  prereqs: ["wallets", "keys-addresses"],

  oneLiner:
    "Modern wallets are all “Hierarchical Deterministic (HD)” wallets: starting from a single random seed, a deterministic algorithm derives an entire endless tree of private keys/addresses. You only need to back up that one seed (the mnemonic) and you've effectively backed up all your past and future addresses.",

  intuition: `
Stage 1 said "write down the mnemonic and you can recover the whole wallet." The mechanism behind that is the **HD (Hierarchical Deterministic) wallet**, standardized as **BIP32**.

It has two words, each doing one job: **"Hierarchical"** means the keys grow into a layered tree; **"Deterministic"** means the same seed always grows **exactly the same** tree. Put the two together: you only need to back up **one seed**, and that's equivalent to backing up **all** your past and future addresses — type the same mnemonic into a different wallet and the entire tree reappears identically.

Tweak the seed on the right to see how the whole key tree changes; then click "regenerate from the same seed" to see that it comes out identical every time.

**In this lesson we break "HD wallets" into four pieces:**

- **① How one seed grows into a tree — BIP32's derivation mechanism**
- **② The meaning of determinism — why backing up the seed is enough**
- **③ Extended public keys (xpub) — watch-only wallets that can see but not spend**
- **④ Hardened derivation and interoperability — security boundaries and cross-wallet recovery**
`,

  mechanics: `
### ① How one seed grows into a tree (BIP32)

The entire derivation is a chain of **purely deterministic math**, with no randomness involved (randomness enters only at the moment the seed is first generated):

- **Seed → master key.** That 512-bit seed is first run through **HMAC-SHA512**, producing 64 bytes: the left 32 bytes are the **master private key**, and the right 32 bytes are the **master chain code** — the chain code is extra entropy that lets the same private key derive multiple different child keys.
- **Deriving child keys layer by layer (CKD).** To generate the i-th child key, feed "parent key + parent chain code + index i" through HMAC-SHA512 again to get the child private key and child chain code. Repeat this action to grow downward layer by layer and rightward one by one into a **nearly infinite tree**.
- **Repeatable and recoverable.** Because every step is a fixed algorithm with no randomness, **the same input always yields the same output** — which is exactly where the word "deterministic" comes from.

### ② The meaning of determinism: why backing up the seed is enough

Turn the mechanism above around and you get the HD wallet's most practical property:

- **Same seed → same tree.** So you don't have to back up the private key of each address separately — **backing up that one seed (the mnemonic) backs up the countless addresses on the tree**, including ones you won't use until the future.
- **Cross-wallet recovery.** Switch to a different brand of wallet, type in the same mnemonic, and it uses the same algorithm to recompute the entire tree, bringing back your balance and historical addresses identically (provided the derivation-path convention matches, see Stage 7.3).
- **"Use a new address every time" with zero burden.** Stage 1's privacy advice was to switch to a new address for each receipt; in an HD wallet a new address is just the "next index" on the tree, requiring no extra backup. This turns "privacy" from a chore into the default behavior.

### ③ Extended public keys (xpub): watch-only wallets that can see but not spend

BIP32 has a clever asymmetry: **you can derive all receiving addresses from public information alone, yet you can't deduce any private key.**

- Packaging "a layer's public key + that layer's chain code" gives you an **extended public key (xpub)**. With it you can keep deriving **all the child public keys below, and thus all receiving addresses** — but because it lacks the private keys, **it can't spend a single cent**.
- This makes **watch-only wallets** possible: hand an xpub to accounting software, a tax tool, or a block explorer, and they can see your balance and incoming payments in real time while **the private keys stay safely offline** (for example, sitting in a hardware wallet).
- ⚠ **But an xpub is not something to share carelessly.** Whoever gets it can compute **all** your addresses and see through all your on-chain activity — **the private keys are safe, but your privacy is fully exposed**. So an xpub must also be treated as sensitive information and kept safe.

### ④ Hardened derivation and interoperability

- **Hardened derivation.** Levels in a path marked with an apostrophe (like \`84'\`) use "hardened derivation." Ordinary (non-hardened) derivation has a weakness: **if a child private key leaks and the corresponding parent xpub happens to be available, the parent private key can be reverse-derived**, endangering the entire tree. Hardened derivation **deliberately doesn't use the parent public key** in its formula, thereby **cutting off this reverse-derivation chain** — so the levels near the tree root (purpose/coin/account) are usually hardened, isolating the risk inside each account (path details in Stage 7.3).
- **Interoperability.** Because **BIP32/BIP39/BIP44** are all open standards, wallets of different brands follow the same algorithms and can recover the same seed from one another — you **can't be locked in** by any one wallet. This is the confidence that open standards give users: if a wallet company folds, your coins can still be retrieved with another brand's wallet.
`,

  demo: "derivation-tree",

  analogy: `
One seed grows into a **fully deterministic great tree**: the same seed, no matter where or how many times it's planted, grows a tree whose shape, every branch, and the position of every leaf are exactly the same.

So you don't need to photograph and archive every leaf (every address) — just keep that **seed** safe, and you can replant the entire tree identically anywhere.
`,

  misconceptions: [
    "“Every address needs its own private key backed up separately.” — No need. An HD wallet derives all private keys from one seed; backing up the seed is enough.",
    "“Switch to a different brand of wallet and the seed becomes unusable.” — Usually it works. BIP32/39/44 are open standards and wallets can recover one another (mind the derivation path, see the next lesson).",
    "“A leaked extended public key (xpub) = a leaked private key.” — It doesn't leak the private key, but it exposes all your addresses and harms privacy, so an xpub must also be kept safe.",
    "“HD wallet addresses run out with use.” — They don't. The number of derivable addresses is nearly infinite.",
  ],

  quiz: [
    {
      q: "In an HD wallet, what is the role of a single seed?",
      options: ["It generates only one address", "It deterministically derives an entire tree of private keys/addresses", "It encrypts your transactions", "It connects to an exchange"],
      answer: 1,
      explain: "Same seed → same tree, so backing up the seed backs up everything.",
    },
    {
      q: "Why is backing up the mnemonic enough?",
      options: ["It's just a login password", "The seed can deterministically re-derive all private keys and addresses", "The wallet uploads to the cloud", "Customer support can recover it for you"],
      answer: 1,
      explain: "Deterministic derivation lets one seed recover the entire wallet.",
    },
    {
      q: "What can an extended public key (xpub) do?",
      options: ["Derive private keys", "Derive all receiving addresses for a watch-only wallet that can see but not spend, while it can't deduce private keys", "Spend money directly", "Reset a password"],
      answer: 1,
      explain: "It can see the balance without exposing private keys; but it harms privacy and must be kept safe.",
    },
    {
      q: "What lets different brands of wallets recover the same seed from one another?",
      options: ["Luck", "Open standards like BIP32/39/44", "A central server syncing them", "A partnership agreement between vendors"],
      answer: 1,
      explain: "Open standards bring interoperability, so you can't be locked into one wallet.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: HD wallets / BIP32", url: "https://learnmeabitcoin.com/technical/keys/hd-wallets/" },
    { label: "BIP32 (original text)", url: "https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki" },
  ],
};
