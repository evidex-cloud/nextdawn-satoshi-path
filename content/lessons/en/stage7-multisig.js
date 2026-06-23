export default {
  id: "multisig-psbt",
  stage: 7,
  order: 4,
  title: "Multisig and PSBT: Many Keys, Collaborative Signing",
  difficulty: "core",
  prereqs: ["script", "hd-wallets"],

  oneLiner:
    "Multisig makes spending coins require “M of N keys,” such as 2-of-3 — a single stolen key can't take the funds, and losing one key doesn't mean losing everything. And the standard format for passing around a “not-yet-fully-signed transaction” across different devices or people is called PSBT.",

  intuition: `
An ordinary wallet is "single-sig": one private key can spend — simple, but also a **single point of failure** (lose or have the key stolen and it's all over). **Multisig** upgrades this to "**you need M of N keys** to spend," written **M-of-N**, the most common being **2-of-3**: a single stolen key can't take anything, and losing one key doesn't mean losing everything.

So how do keys scattered across different devices/people "collaborate" to sign one transaction? The answer is **PSBT** — a standard-format "half-finished transaction" that is passed among signers, each signing their own part, then assembled and broadcast once enough are collected, **with no one ever handing over their private key.**

The right side simulates a 2-of-3: sign with each key in turn and watch when enough are collected to broadcast.

**In this lesson we break "multisig and PSBT" into four pieces:**

- **① What M-of-N is — how it eliminates the single point of failure**
- **② Multisig is implemented via script — where the lock lives, who verifies it**
- **③ How a PSBT flows around — signing collaboratively at a distance without exposing private keys**
- **④ Typical uses and a capstone for the whole stage — how it ties everything you've learned into one line**
`,

  mechanics: `
### ① What M-of-N is: how it eliminates the single point of failure

**M-of-N** means: there are **N independent, complete keys** in total, and spending requires the signatures of **any M** of them. Take the classic **2-of-3** as an example:

- **Stolen but can't be moved:** a thief who gets only 1 key can't collect 2, so they can't take your coins. It turns the "lose one and it's all over" disaster into "lose one and you're fine."
- **Lose one and don't fear:** if you lose or damage 1 key, you can still use the remaining 2 to move the coins to safety. **It guards against both theft and loss** — exactly what single-sig can't do.
- **Can be stored in dispersed locations:** the three keys can be kept on **different devices and in different places** (home / office / a safe deposit box elsewhere), or even entrusted to different people or institutions for joint custody; an attacker would have to breach multiple places at once to have any chance.
- **Adjustable threshold:** 2-of-3 is a common compromise; for more security use 3-of-5, for more availability use 2-of-2. The point is that **the trade-off between fault tolerance (how many you can lose) and threshold (how many you need to gather)** is yours to set.

### ② Multisig is implemented via script: where the lock lives, who verifies it

Multisig isn't a proprietary feature of wallet vendors but a **native capability of Bitcoin Script** (callback to Stage 4.2):

- The M-of-N spending condition is encoded into a **locking script**, which can be placed in the "lock" of a **P2SH (3... address)**, a **P2WSH (long bc1q... address)**, or **Taproot (bc1p...)**.
- When nodes verify it, there's **no fundamental difference** from single-sig: it still executes the script and checks "do the supplied keys/signatures satisfy the lock" — satisfy it and it passes, fail and it's rejected.
- **Taproot makes multisig more discreet.** In traditional P2SH/P2WSH, spending reveals "this is a 2-of-3 multisig"; but with Taproot + Schnorr (mentioned in Stage 6.4), the parties can **aggregate their public keys into one**, so on-chain it looks **exactly like an ordinary single-sig** — saving fees and improving privacy at once.

### ③ How a PSBT flows around: collaborating at a distance without exposing private keys

With keys scattered across different devices, how do you get them to **sign the same transaction one after another**? That's the problem **PSBT (Partially Signed Bitcoin Transaction, BIP174)** solves:

- It's a **standard container** holding the entire contents of this transaction plus the information each signer needs to complete their signature (the UTXOs to spend, each one's derivation path, etc.), but **still missing signatures**.
- **The flow**: a coordinator builds an unsigned PSBT → signer A adds A's signature **on their own device** → the PSBT is passed to B via **file / QR code / USB stick / SD card** → B signs too… → once M signatures are collected, it is **combined and finalized** into a complete, broadcastable transaction.
- **The key security property: no one ever has to hand over a private key.** Each signature is generated only inside its own device, and what leaves the device is always just "a transaction with a signature added." This makes **offline / air-gapped hardware-wallet collaboration** possible — the private key can stay forever in a device that never goes online.
- Because PSBT is an **open standard**, hardware wallets and software wallets of different brands can **mix and match** to collaborate (e.g. A uses one brand's hardware wallet and B uses another's), without being locked into any single vendor.

### ④ Typical uses and a capstone for the whole stage

- **Typical uses**: personal cold storage (2-of-3 spread between a hardware wallet and a backup elsewhere, guarding against loss and theft), corporate treasuries (major spending requires several managers to co-sign), inheritance (entrusting one key to a lawyer or family member), and so on. Tools are now quite easy to use, so **individual self-custody is just as worthy of using multisig**.
- **It ties the whole stage into one line**: a multisig's keys also come from an **HD wallet** (Stage 7.1), are backed up by a **mnemonic** (Stage 7.2), and located along a **derivation path** (Stage 7.3); the spending condition is written in a **script** (Stage 4), and is finally broadcast and verified on the **P2P network** (Stage 6). Learn this far and the whole "wallets and keys" block comes full circle.
`,

  demo: "multisig-sim",

  analogy: `
A 2-of-3 multisig is like a **vault that needs two keys to open**, with the three keys given to three people or three places: a thief who steals one gets nowhere, and even if you lose one yourself you can still open it.

A PSBT is like a **draft contract circulated among the signatories**: A signs in their own column first, passes it to B, B signs too, and only once enough signatures are gathered does it formally take effect — and throughout the circulation, no one has to hand over their own seal.
`,

  misconceptions: [
    "“Multisig is just splitting one private key into several pieces.” — It isn't. It's gathering M of N independent, complete keys, not slicing up one key.",
    "“With 2-of-3, lose one key and it's all over.” — It isn't. You still have 2 keys, enough to move the funds; this is exactly multisig's fault-tolerance value.",
    "“A PSBT leaks the private key.” — It doesn't. A PSBT carries the transaction data and each party's signatures; the private keys always stay on their respective signing devices.",
    "“Multisig is too complex; only enterprises use it.” — Tools are now quite easy to use; it's also very valuable for personal cold storage against loss and theft.",
  ],

  quiz: [
    {
      q: "What does a 2-of-3 multisig mean?",
      options: ["All 3 keys must sign", "Any 2 of the 3 keys signing is enough to spend", "Splitting 1 key into 3 pieces", "It needs 3 confirmations"],
      answer: 1,
      explain: "M-of-N: you need M of N independent keys.",
    },
    {
      q: "Which is **not** a benefit of 2-of-3 multisig?",
      options: ["Even if one key is stolen, the coins can't be taken", "Lose one key and you can still use the other two", "Faster transactions", "You can store the keys in dispersed locations"],
      answer: 2,
      explain: "Multisig addresses the single point of failure, not speed.",
    },
    {
      q: "What is a PSBT used for?",
      options: ["Encrypting the private key", "Passing a “not-yet-fully-signed transaction” among multiple signers/devices so each adds their signature", "Storing blocks", "Mining"],
      answer: 1,
      explain: "A standard container circulates a half-signed transaction, with private keys never leaving the device.",
    },
    {
      q: "Where is a multisig's spending condition essentially written?",
      options: ["An exchange's database", "In a Bitcoin Script “lock” (P2SH/P2WSH/Taproot)", "The mnemonic", "The block header"],
      answer: 1,
      explain: "Callback to Stage 4.2: the keys satisfy the lock's script execution.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Multisig", url: "https://learnmeabitcoin.com/technical/script/p2sh/" },
    { label: "BIP174: PSBT Spec", url: "https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki" },
  ],
};
