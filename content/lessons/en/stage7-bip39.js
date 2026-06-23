export default {
  id: "bip39",
  stage: 7,
  order: 2,
  title: "The Mnemonic: The Standard Behind 12 Words (BIP39)",
  difficulty: "core",
  prereqs: ["hd-wallets"],

  oneLiner:
    "Those 12 or 24 English words aren't picked at random: BIP39 takes a chunk of random entropy plus a checksum and encodes them into words from a standard 2048-word list. Words are easy for humans to copy, recite, and stamp into steel, and the built-in checksum flags an error the moment you mis-copy a word.",

  intuition: `
A mnemonic is, at its core, the translation of a long string of **random 0s and 1s** into a sentence of "human words." The standard is **BIP39**. It solves two problems: one, making a random number **easy to remember, copy, recite, and stamp into steel**; two, **flagging an error the moment you mis-copy a word**.

The core flow is short: a chunk of **random entropy** → append a small **checksum** taken from its hash → split into groups of **11 bits**, each group looking up a word in the **2048-word list**. So a string of binary becomes 12 or 24 English words.

Generate a string on the right to see the "entropy → words" structure; then click "change one word by mistake" to see how the checksum fails.

**In this lesson we break "the mnemonic (BIP39)" into four pieces:**

- **① Entropy → checksum → words — why the count is exactly 12 or 24**
- **② The cleverness of the checksum — how it catches your copy errors on the spot**
- **③ The optional passphrase (the 25th word) — a double-edged sword of hidden wallets and permanent loss**
- **④ Mnemonic → seed → key tree — how the three interlock**
`,

  mechanics: `
### ① Entropy → checksum → words: why the count is exactly 12 or 24

The word count isn't arbitrary; behind it is a **divisibility calculation**:

- First take a chunk of **random entropy**: 128 or 256 bits (more entropy is more secure, but 128 bits is already astronomical and plenty).
- Compute the **SHA-256** of that entropy and take the **first few bits** as the checksum: the rule is "1 checksum bit per 32 bits of entropy." So 128 bits of entropy gets **4** checksum bits, and 256 bits gets **8**.
- After concatenating "entropy + checksum," **split into groups of 11 bits**; each group's value (0–2047) exactly indexes a word in the 2048-word list:
  - 128 + 4 = 132 = **12 × 11** → **12 words**
  - 256 + 8 = 264 = **24 × 11** → **24 words**
- That's why a mnemonic is always 12, 24 (and the in-between 15/18/21), and never 13 or 20.

### ② The cleverness of the checksum: how it catches errors on the spot

Those few checksum bits are BIP39's most thoughtful design:

- Because the checksum is **computed from** the entropy, it has a fixed mathematical relationship with the words before it. If you **mis-copy or misremember a word**, the checksum bits contained in the last word will most likely no longer match — **a proper wallet immediately warns "invalid mnemonic"** instead of silently importing your coins into a wrong, empty wallet.
- To quantify: change a word at random and the chance the checksum still passes is only about **1/16** (for 12 words), meaning **about 15/16 of copy errors are caught on the spot**. This blocks the "send to a wrong address and the money's gone" disaster at the very first gate.
- ⚠ But it **only guards against "innocent slips," not "malicious construction"**: an attacker can perfectly well craft a mnemonic with a valid checksum that they control. So **never use a mnemonic someone gives you** — a passing checksum does not mean it's safe.

### ③ The optional passphrase (the 25th word)

BIP39 lets you add a **custom passphrase** on top of the mnemonic, colloquially the "25th word":

- **It and the mnemonic together compute the final seed.** In other words, **the same mnemonic with a different passphrase yields a completely different wallet** (a different whole tree, a different balance).
- **Two main uses**: one, **an extra layer of security** — even if your mnemonic is glimpsed or photographed, without the passphrase the coins can't be moved; two, **a hidden wallet (plausible deniability)** — put some decoy coins under the empty passphrase, with the real money behind some passphrase.
- ⚠ **It's a double-edged sword**: the passphrase is **not** part of the mnemonic and has no checksum or recovery mechanism — **forget it and the corresponding coins are gone forever**, without even a "you mis-copied" warning. So either don't use it, or back it up as solemnly as you back up the mnemonic.

### ④ Mnemonic → seed → key tree: how the three interlock

These three are often conflated, but they form a **one-way generation chain**:

- **Mnemonic →(PBKDF2)→ seed.** The mnemonic (plus the optional passphrase) goes through **PBKDF2-HMAC-SHA512, iterated 2048 times**, outputting a 512-bit **seed**. This step is **deliberately slow** to raise the cost of brute-forcing.
- **Seed →(BIP32)→ key tree.** This seed is exactly the input to the previous lesson's BIP32; feed it in and the whole HD key tree grows (Stage 7.1).
- So the hierarchy is clear: **BIP39 handles "how humans back up the random number," BIP32 handles "how the random number grows into keys."** The mnemonic is the human-facing shell; the seed is the real fuel fed to the math — grasp this and you understand why switching wallets only needs that string of words.
`,

  demo: "mnemonic-anatomy",

  analogy: `
A mnemonic translates a long binary password into a sentence of **easy-to-recite, easy-to-remember human words**; and that bit of checksum at the end is like the **punctuation and grammar** at the end of the sentence — drop one or get one wrong and someone who knows the language sees at a glance that "this sentence doesn't parse," so the wallet rejects it and warns you that you mis-copied.
`,

  misconceptions: [
    "“The words are ordinary English picked at random.” — They aren't. They come from a fixed standard 2048-word list and carry a checksum.",
    "“Change any one word and the wallet still accepts it.” — It won't. Changing a word usually fails the checksum and the wallet declares it invalid — which is exactly the design that helps you guard against copy errors.",
    "“The passphrase (25th word) is optional and no big deal to forget.” — Big mistake. A different passphrase is a different wallet; forget it and the corresponding coins are lost forever.",
    "“A mnemonic must be in English.” — Multiple language word lists are available; but don't mix languages within one mnemonic.",
  ],

  quiz: [
    {
      q: "How is a BIP39 mnemonic created?",
      options: ["The wallet makes up a few random English words", "A chunk of random entropy plus a checksum, mapped to the 2048-word list in groups of 11 bits", "Generated from your password", "Assigned by an exchange"],
      answer: 1,
      explain: "Entropy + checksum → one word per 11 bits, hence 12 or 24 words.",
    },
    {
      q: "What is the role of the “checksum” in a mnemonic?",
      options: ["To encrypt the mnemonic", "When you mis-copy or misremember a word, it fails the checksum and the wallet reports “invalid”", "To increase the number of coins", "To connect to the network"],
      answer: 1,
      explain: "The checksum bits help you catch copy errors on the spot.",
    },
    {
      q: "Which statement about the optional passphrase (25th word) is correct?",
      options: ["It's optional and no big deal to forget", "A different one is a completely different wallet; forget it and the corresponding coins are lost forever", "It's just your login password", "It's generated automatically by the wallet"],
      answer: 1,
      explain: "It and the mnemonic together determine the seed; be sure to remember it.",
    },
    {
      q: "What is the relationship between mnemonic, seed, and key tree?",
      options: ["Unrelated", "Mnemonic →(PBKDF2)→ seed →(BIP32)→ the whole HD key tree", "The seed generates the mnemonic", "The key tree generates the mnemonic"],
      answer: 1,
      explain: "Interlocking: the mnemonic ultimately grows the entire HD wallet.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Mnemonic seed / BIP39", url: "https://learnmeabitcoin.com/technical/keys/hd-wallets/mnemonic-seed/" },
    { label: "BIP39 Word List and Spec", url: "https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki" },
  ],
};
