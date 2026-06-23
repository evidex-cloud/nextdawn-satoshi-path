export default {
  id: "signatures",
  stage: 3,
  order: 2,
  title: "Digital Signatures: Stamp with the Private Key, Verify with the Public Key",
  difficulty: "core",
  prereqs: ["hashing", "keys-addresses"],

  oneLiner:
    "A digital signature lets you prove to the whole world that “I authorized this transaction” without ever revealing your private key: you stamp a one-of-a-kind seal on the transaction with your private key, anyone can verify it as genuine with your public key, and changing any single character of the transaction instantly voids the seal. This is how Bitcoin “spends money.”",

  intuition: `
In Stage 1 we said "the private key = the money itself." But when you spend, you don't hand over your private key — that would be like photocopying your wallet key for the whole world. What you hand over is a **digital signature**: an "electronic personal seal" that only you can stamp, yet anyone can verify for authenticity, and that's tightly bound to the contract's contents.

Its magic is that three seemingly contradictory things hold at once: **only the private key can produce a valid signature**, **anyone can verify it as genuine with the public key yet cannot derive the private key**, and **change one character of the transaction and the signature is instantly void**. So miners and nodes don't need to know you, let alone have your private key — from just your public public key and this signature, they can confirm "this spend really was authorized by the private-key holder, and hasn't been tampered with."

On the right is a **real** signing demo (using the browser's built-in elliptic-curve cryptography): generate a key, sign, verify, then change one character and watch the signature fail.

**In this lesson we break the digital signature into four pieces:**

- **① The three magic properties — can sign, can verify, void on edit**
- **② The full flow of one "spend" — how the signature enters the transaction and how nodes verify it**
- **③ Keys and the curve — secp256k1, ECDSA, and Schnorr**
- **④ Security's invisible foundation — randomness, public-key protection, verifying ≠ decrypting**
`,

  mechanics: `
### ① The three magic properties: can sign, can verify, void on edit

A digital signature uses **asymmetric cryptography** (public and private keys in a pair) to do three things:

- **Only the private key can sign.** Using your private key, you compute a one-of-a-kind **signature** over "this transaction" (like a personal seal no one can forge). Switch to a different transaction and the signature is completely different.
- **Anyone can verify it, yet no one can derive the private key.** Anyone holding your public **public key** can run a mathematical check and confirm "this signature really was made by the corresponding private key" — but **cannot work back from the signature or the public key to the private key** (this is the elliptic-curve discrete logarithm problem, which current computing power can't solve).
- **Change one character and the signature is void.** A signature is actually made over a **hash** of the transaction's contents (Stage 3.1). Alter even one punctuation mark of the contents and the hash changes, signature verification instantly fails — this locks "authorization" and "specific contents" together.

### ② The full flow of one "spend": how the signature enters the transaction and how nodes verify it

Walk through Alice spending some coins step by step:

- **Step 1 · Sign**: the wallet pulls out the UTXO to be spent and uses Alice's **private key** to compute a signature over the transaction data (inputs, outputs, amounts).
- **Step 2 · Pack into the transaction**: the signature **+ the corresponding public key** are placed together into the transaction's input, then broadcast (Stage 2.2).
- **Step 3 · Nodes verify the signature**: each node does two things — ① uses the attached public key to verify the signature is self-consistent with the transaction contents; ② confirms **this public key really does hash to the address that locks that UTXO** (recall Stage 1: an address = the hash of a public key). Only if both pass does it accept that Alice has the right to spend.
- If either fails, the transaction is rejected on the spot and can't spread. **The private key never appears throughout the whole process**, and nodes don't need to trust Alice as a person.

### ③ Keys and the curve: secp256k1, ECDSA, and Schnorr

Bitcoin uses **elliptic-curve** cryptography; a few terms are worth recognizing:

- **secp256k1**: the specific elliptic curve Bitcoin chose. The private key is a 256-bit random number, and the public key is a point on this curve derived from the private key — **private key → public key is trivially easy, public key → private key is infeasible**, and this one-wayness is the source of security.
- **ECDSA**: the classic elliptic-curve signature algorithm, which Bitcoin has used since genesis.
- **Schnorr**: a new signature scheme introduced by the 2021 Taproot upgrade (Stage 8), more concise than ECDSA, provably secure, and additionally supporting **multisig aggregation** (multiple signatures combined into one, saving space and improving privacy). Newer address types use it by preference.

### ④ Security's invisible foundation: randomness, public-key protection, verifying ≠ decrypting

A signature's security hides in a few easily overlooked details:

- **Randomness is a matter of life and death.** ECDSA requires a one-time random number \`k\` for each signature. If \`k\` is **reused or predictable**, an attacker can **solve for the private key** from two signatures — wallets really were drained in the 2010s because of weak randomness (Sony's PS3 fell into the same pit). Modern wallets switched to **deterministic randomness (RFC 6979)**, deriving \`k\` from the private key and the message, dodging this landmine entirely.
- **The hash protects the public key.** Early on people received coins directly to a public key; now you usually give out **a hash of the public key** (i.e. the address), revealing the public key and attaching a signature only when you spend. This extra layer of hashing both shortens the address and shields the public key until you spend.
- **Verifying ≠ decrypting.** One more time: there is **no "decryption"** here. The transaction contents are public to begin with; verification is just a mathematical check with the public key, confirming that the signature, the contents, and the public key are all mutually consistent. Treating a signature as "encryption" is the single most common misconception.
`,

  demo: "sign-verify",

  analogy: `
Imagine a **personal seal only you can stamp, but whose authenticity anyone in the world can tell.** You stamp it on a contract (the transaction):

- Others don't have your seal, so they **can't produce** a stamp that passes inspection (no forgery).
- But anyone can compare it against your publicly registered "seal specimen" (the public key) and instantly tell **the stamp is genuine** (verifiable).
- And this stamp is bound to **every single character** of the contract — secretly change one character and the seal's imprint no longer matches (tamper-proof).

Even better: others can verify its authenticity, yet can't **reproduce the seal itself** from a stamp you've made (verification can't derive the private key).
`,

  misconceptions: [
    "“A signature is just encrypting the transaction.” —— It isn't. The transaction's contents are public; the signature only proves authorization and integrity — it hides nothing and there's no “decryption.”",
    "“Verifying a signature requires the private key.” —— It doesn't. Verification uses only the public key; the private key never appears, which is exactly the elegance of it.",
    "“The same signature can be applied to a different transaction.” —— No. A signature is bound to specific transaction contents; switch to a different transaction and it fails.",
    "“Getting my public key or one of my signatures lets you compute my private key.” —— You can't; it's computationally infeasible — unless the random number used in signing was wrongly reused or leaked.",
  ],

  quiz: [
    {
      q: "When spending bitcoin, what do you present to the network?",
      options: ["Your private key", "A digital signature generated with the private key and verifiable with the public key", "Your seed phrase", "Your ID card"],
      answer: 1,
      explain: "The private key never appears; what you present is the signature it generates.",
    },
    {
      q: "What is needed to verify a signature?",
      options: ["The signer's private key", "The signer's public key (which is public)", "Administrator authorization", "Exchange confirmation"],
      answer: 1,
      explain: "The public key verifies, the private key signs, and you can't work back from the public key to the private key.",
    },
    {
      q: "What happens if one character of the transaction contents is secretly changed?",
      options: ["The signature stays valid", "Signature verification instantly fails", "Only the fee changes", "It's only noticed after rebroadcasting"],
      answer: 1,
      explain: "A signature is bound to specific contents, so any change voids it — that's tamper resistance.",
    },
    {
      q: "In ECDSA signing, what most easily leads to a private-key leak?",
      options: ["The public key is too short", "The one-time random number k used in signing is reused or predictable", "The message is too long", "The fee is too low"],
      answer: 1,
      explain: "A reused or predictable k can let the private key be derived; modern wallets use deterministic randomness (RFC 6979) to avoid it.",
    },
    {
      q: "When a node verifies a spend, besides checking the signature is self-consistent with the contents, what else must it confirm?",
      options: ["The payer's real-world identity", "That the attached public key really hashes to the address locking that UTXO", "That the fee is high enough", "That the recipient has agreed"],
      answer: 1,
      explain: "The address is derived from the hash of the public key; only when the public key matches the address and the signature is valid does it prove you have the right to spend this coin.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Digital signature (illustrated)", url: "https://learnmeabitcoin.com/technical/cryptography/digital-signature/" },
    { label: "learnmeabitcoin: Public key", url: "https://learnmeabitcoin.com/technical/cryptography/public-key/" },
  ],
};
