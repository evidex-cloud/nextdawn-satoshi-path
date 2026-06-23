export default {
  id: "address-types",
  stage: 4,
  order: 3,
  title: "Address Types: From 1... to bc1p...",
  difficulty: "core",
  prereqs: ["script"],

  oneLiner:
    "The different-looking Bitcoin addresses you've seen (starting with 1, 3, bc1q, bc1p) actually correspond to different “locks.” They evolved step by step, mainly to be cheaper, safer, and more private — the newer SegWit and Taproot addresses have lower fees and also fix some flaws of the older addresses.",

  intuition: `
A Bitcoin address doesn't have just one look. There are four common kinds, and you can tell them apart by their **prefix**. They're all just different **encodings** of those "locks" from the last lesson — same chain, same coins, only the box holding them comes in a different style:

- **\`1...\` (P2PKH)**: the oldest address, present since the genesis block in 2009. Best compatibility, but larger transaction size and higher fees.
- **\`3...\` (P2SH)**: hides "the hash of a script" in the address, with the full script revealed only when spending. Common for multisig and early "wrapped SegWit."
- **\`bc1q...\` (SegWit v0, P2WPKH)**: the new address brought by Segregated Witness in 2017, **cheaper** (the witness discount), and it also fixes the old "transaction malleability" flaw.
- **\`bc1p...\` (Taproot, P2TR)**: the latest generation from 2021, based on Schnorr signatures, **more private and more efficient** — even a complex multisig or contract can look identical to an ordinary transfer from the outside.

Click around on the right to recognize each address type's prefix, era, encoding, and characteristics.

**In this lesson we break "address types" into four pieces:**

- **① What an address actually is — an encoding of a lock, not an account**
- **② Two encoding schemes — the error-correction gap between Base58Check and Bech32**
- **③ Why it evolved generation after generation — malleability, the witness discount, privacy**
- **④ Practical trade-offs — which to use, and what to watch for when receiving**
`,

  mechanics: `
### ① What an address actually is: an encoding of a lock, not an account

A common misconception treats an address as an "account." In fact an address stores **no balance and no private key** — it merely **encodes some locking script (or its hash, or a public key) into a string of characters** that's easy to copy and hard to mistype.

- When your wallet gives you a \`1...\` address, it's equivalent to saying: "Please construct a P2PKH locking script, filling in the public-key-hash field with the 20 bytes decoded from this string." The payer builds the output accordingly, and the money is locked into that lock.
- So "I have 5 addresses" does not mean "5 accounts" — each address corresponds to a kind of lock; your balance is your wallet adding up all the UTXOs locked by these and belonging to you (Stage 4.1).
- There's no technical obstacle to reusing one address repeatedly, but each reuse binds more UTXOs to the same lock, **harming privacy** (the "fresh address every time" advice from Stage 1).

### ② Two encoding schemes: the error-correction gap between Base58Check and Bech32

The four address types use two very different encodings, and the difference is far more than "they look different":

- **\`1...\` / \`3...\` use Base58Check**: 58 characters (deliberately dropping the easily confused \`0\`, \`O\`, \`I\`, \`l\`), with a 4-byte checksum appended at the end. It can **detect** a typo, but can't tell you where the error is.
- **\`bc1q...\` / \`bc1p...\` use Bech32 / Bech32m**: all lowercase, with a more restricted character set, and a checksum based on a BCH error-correcting code that not only **detects** errors but, when a small number of characters are wrong, can also **locate** roughly which few positions are wrong. \`bc1p\` (Taproot) switched to Bech32m, which fixes an encoding weakness the original Bech32 had at certain lengths.
- All-lowercase also brings a practical benefit: the address can be displayed in **all uppercase** (e.g. engraved on hardware, printed on paper) without ambiguity, and the QR code is more compact.

### ③ Why it evolved generation after generation: malleability, the witness discount, privacy

Each generation of address patches a hole in the previous one:

- **Transaction malleability**: in early transactions, a third party could "tweak" the signature data **without changing the substance**, causing the \`txid\` to change. This was fatal for second layers like the Lightning Network that depend on the \`txid\` of an unconfirmed transaction. **SegWit** moved the signature (witness) into a separate area of the transaction, so the \`txid\` no longer contains the signature, **fixing malleability at its root** (Stages 4.5, 8.2).
- **The witness discount**: witness data is weighted at only one-quarter when computing fees, so a \`bc1q\` transaction has a smaller vByte count and is cheaper at the same fee rate (computed in detail in Stage 4.4). This is a bonus that came alongside the malleability fix, and the direct reason everyone switched to \`bc1\` addresses to save money.
- **Efficiency and privacy (Taproot)**: P2TR uses **Schnorr signatures** (which can aggregate multiple signatures into one) and hides a "tree of spending-condition scripts" behind a single public key. As long as the parties cooperate and take the normal path, what appears on-chain is the most ordinary single-signature transfer — \`2-of-3\` multisig and timelock contracts are **all invisible** from the outside, saving space and protecting privacy (explored in depth in Stage 8).

### ④ Practical trade-offs: which to use, and what to watch for when receiving

- **Default to \`bc1q\` or \`bc1p\`**: lower fees, better error correction. Almost every wallet from 2020 onward already supports them.
- **When receiving, first confirm the other side's wallet recognizes it**: very old wallets or exchanges may not recognize \`bc1p\` (Taproot), and a few may not even recognize \`bc1q\`. A failed receipt is often not a wrong address but **the payer's software being too old**.
- **The dual identity of \`3...\`**: it can be either pure-multisig P2SH or "wrapped SegWit" (P2SH-P2WPKH) — the latter lets an old wallet pay SegWit money to a recipient who "doesn't recognize \`bc1\`," a compromise for the transition period.
- **Always copy-paste or scan to enter an address**: even the best error-correcting code only guards against individual characters, not against you pasting the whole thing wrong. Before a large transfer, double-checking the **first and last few characters** is already a community habit.
`,

  demo: "address-id",

  analogy: `
Address types are like **different versions of a shipping label**: the old version (1...) is accepted at every depot, but it has many boxes and takes up space to stick on (higher fees); the new versions (bc1q, bc1p) are leaner, more resistant to fill-in errors, and come with better privacy and a discount — it's just that a few old depots may not have upgraded yet and don't recognize the new label.

The package (your coins) is always the same; all that changes is the way it's "wrapped and addressed."
`,

  misconceptions: [
    "“Addresses with different prefixes are different coins.” — They're not. They're all bitcoin on the same chain, just different types of “locks” and encodings.",
    "“New addresses (bc1) are insecure or unofficial.” — Quite the opposite: they're newer, cheaper, with better error correction, and they fix old flaws; only a few outdated wallets may not support them.",
    "“They're all the same, so addresses can be reused indefinitely.” — Type has no bearing on the “use a fresh address each time” privacy advice (Stage 1); reuse binds more UTXOs to the same lock.",
    "“SegWit was just about being cheaper.” — It first solved transaction malleability; being cheaper (the witness discount) is a side bonus, and it also paved the way for the Lightning Network.",
    "“The address stores my balance or private key.” — It stores neither. An address is just an encoding of some locking script; the balance is your wallet summing up your UTXOs, and the private key is used only locally when signing.",
  ],

  quiz: [
    {
      q: "Which of these is the newest-generation, Schnorr-based address type?",
      options: ["Starts with 1 (P2PKH)", "Starts with 3 (P2SH)", "Starts with bc1q (SegWit v0)", "Starts with bc1p (Taproot)"],
      answer: 3,
      explain: "bc1p is Taproot (P2TR), introduced in 2021.",
    },
    {
      q: "What was SegWit's most important contribution?",
      options: ["Making addresses shorter", "Moving the signature into a separate area, fixing transaction malleability at its root, and bringing a fee discount", "Raising the supply cap", "Abolishing fees"],
      answer: 1,
      explain: "The malleability fix is key, the fee discount is a bonus, and it benefits the Lightning Network.",
    },
    {
      q: "What is the essential difference between addresses with different prefixes?",
      options: ["Different coins behind them", "They correspond to different types of “locks” (locking scripts) and encodings", "They're run by different companies", "They're just different colors"],
      answer: 1,
      explain: "An address is an encoding of some locking script or public key; different type, same coin.",
    },
    {
      q: "When receiving with a newer bc1 address, what's the main thing to watch for?",
      options: ["It will be less secure", "Confirm the sender's wallet supports that address type (very old wallets may not recognize it)", "You must pay a deposit first", "Only small amounts are allowed"],
      answer: 1,
      explain: "Better features, but the sender's wallet needs to be compatible.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Script / address types", url: "https://learnmeabitcoin.com/technical/script/" },
    { label: "Wikipedia: SegWit", url: "https://en.wikipedia.org/wiki/SegWit" },
  ],
};
