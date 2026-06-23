export default {
  id: "keys-addresses",
  stage: 1,
  order: 1,
  title: "Private Keys and Addresses: What Makes Your Money Yours",
  difficulty: "intro",
  prereqs: [],

  oneLiner:
    "Bitcoin ownership is just a private key. An address is like the receiving slot on your front door (public — anyone can drop money in), while the private key is the only key that opens it to take the money out (top secret). The address is derived one-way from the private key — you can generate the slot from the key, but no one can reverse the key from the slot.",

  intuition: `
Bitcoin has no "account password," and there's no customer service to help you recover one. The only thing that decides who a coin belongs to is one thing: the **private key**.

An analogy:

- **Private key** = a one-of-a-kind key (or a personal seal). Whoever holds it can move the money. **It must never be known to anyone.**
- **Address** = the **receiving mailbox / house number** at your front door. It's public — you give it to others and they can send money to it, but **having the number alone won't open the mailbox to take the money out.**

The key piece of magic is that it's **one-way**: the address is computed from the private key — you can make the door number from the key; but **no one can reverse-engineer the key from the door number** (this is the same idea as the "irreversible" hashing you played with in Stage 0). The demo on the right lets you change the private key and watch the address change.

**In this lesson we break "private keys and addresses" into four pieces:**

- **① What a private key really is — an absurdly large random number**
- **② The one-way chain · private key → public key → address — computable forward, not reversible**
- **③ Three iron rules — the private key is the money, losing it loses the coin forever, the address can be public**
- **④ The private key never leaves home — how signing spends money without exposing the key**
`,

  mechanics: `
### ① What a private key really is: an absurdly large random number

A private key is essentially a **256-bit random integer** — its range is close to **2 to the 256th power**, on the order of about **10 to the 77th power**. How big is that number? It's roughly the same order of magnitude as the **total number of atoms in the observable universe**.

- Precisely because the space is so vast, the probability of **two people randomly generating the same private key** is so small it can be treated as zero — you don't need to "apply for" or "register" a private key; pick one at random yourself and it's all but guaranteed to be unique.
- For the same reason, **the quality of the private key's randomness is critical**: it must be generated from a truly random source. Historically, wallets with insufficiently random (predictable) numbers led to private keys being computed en masse and funds stolen.
- A corollary: brute-forcing private keys to "guess" some funded address is **computationally impossible** — not "very hard," but physically out of reach.

### ② The one-way chain: private key → public key → address

Real Bitcoin uses **elliptic-curve public-key cryptography (the curve secp256k1)**, and going from private key to address takes two steps, each of which **can only be computed forward, never reversed**:

- **Step 1 · private key → public key**: use elliptic-curve multiplication (the big number that is your private key × a fixed base point G on the curve) to compute the **public key**. Computing forward is fast; trying to solve back from the public key to the private key is equivalent to the "elliptic-curve discrete logarithm problem," which has no practical solution in reality.
- **Step 2 · public key → address**: hash the public key with **SHA-256** then **RIPEMD-160** (yielding a 160-bit public-key hash), add a network prefix and checksum, and finally encode it into the **address** you see (modern addresses mostly use Bech32 encoding, e.g. starting with \`bc1\`).

This **private key → public key → address** chain is the same idea as the "irreversible" hashing you played with in Stage 0: **the forward path is open, while every reverse path is blocked.** So publishing the address, or even the public key, can never leak the private key.

### ③ Three iron rules

The whole one-way chain, applied in practice, comes down to three rules you must burn into muscle memory:

- **Private key = the money itself.** Whoever gets the private key can spend the coin, **without needing your permission, and you can't stop it.** So the private key isn't a "password" — it's more like "the money itself," and it should never be seen by anyone (backup methods in Stage 1.2 on the seed phrase).
- **Lose the private key = lose the coin forever.** There's no "recover password," no human support, and no one on-chain can help you. The coin doesn't disappear, but it's **locked away forever** at that address, where no one can move it.
- **The address can be shared freely.** Giving someone your address to receive money is perfectly safe; posting it online won't leak the private key either. An address is just a receiving label — **what you fear leaking is the private key, not the address.**

> Note a distinction: an address being public is by design; but **reusing the same address** to receive money harms privacy (it lets people string your income and spending into one account), which is why good wallets give you a new address each time — this is a privacy issue, not a security issue (expanded in Stages 1.3 and 4).

### ④ The private key never leaves home: how signing spends money

Since the private key is so precious, does it get sent onto the network when you spend? **No.** This relies on the other half of public-key cryptography — the **digital signature**:

- When spending, you use the private key to generate a **signature** over "this transaction," and broadcast the signature together with the transaction; the private key **itself never leaves your device**.
- Anyone on the network can use your **public key** to verify the signature is genuine (that it was indeed signed by the corresponding private key, and the transaction wasn't altered), yet **cannot derive your private key**.
- This is why a hardware wallet can keep the private key locked inside an offline device and still spend: the transaction goes into the device, the signature comes out, and **the private key never leaves home** (Stage 1.5 on security, Stage 4 on the signature mechanism).

To sum it up in one line: **the private key is for "signing," the public key for "verifying," and the address for "receiving"** — each with its own job, and the only one you must guard with your life is the private key (and its seed-phrase backup).
`,

  demo: "key-address",

  analogy: `
Imagine a **transparent donation box** with your name and number on the front (the address — visible to everyone, and anyone can drop money in), but **only you have the box's key** (the private key).

Everyone can see how much money is inside and can drop money in, yet only you, holding the key, can open it and take the money out. Once the key is copied, someone else can drain your money — which is why safeguarding the key is, essentially, all of Bitcoin security.
`,

  misconceptions: [
    "“The address is my account password, so I should keep it secret.” — Backwards. The address is for receiving money, and sharing it is perfectly safe; what's truly critical is the private key, and its backup — the seed phrase.",
    "“Coins are stored inside the address.” — Coins are actually recorded on the network-wide ledger; the address is just a receiving label on that ledger. What you control is the private key that can move that record, not some box holding coins.",
    "“If I forget the private key, I can recover it.” — You can't. Bitcoin has no central authority and no “recover password” button. Once the private key or seed phrase is completely lost, the corresponding coins are locked away forever.",
    "“When spending, the private key has to be sent to the network for verification.” — It doesn't. You generate a signature locally with the private key and broadcast only the signature; the network verifies the signature with the public key but can't derive the private key. The private key never leaves home — that's exactly how a hardware wallet can sign offline.",
    "“No matter how big the private-key space is, enough computing power can brute-force it.” — There are about 2 to the 256th power private keys, on the same order as the number of atoms in the universe. Enumerating them one by one to hit some funded address isn't “very hard” — it's physically impossible.",
  ],

  quiz: [
    {
      q: "Which of the following **must** be kept strictly secret?",
      options: ["The address", "The private key (and its seed-phrase backup)", "The number of coins you own", "The brand of wallet you use"],
      answer: 1,
      explain: "An address is safe to share for receiving money; the private key is the money itself, and leaking it means being robbed.",
    },
    {
      q: "What about “reverse-engineering the private key from the address”?",
      options: ["Very easy, just use a calculator", "Effectively infeasible (one-way)", "Requires the bank's cooperation", "Resets after three wrong tries"],
      answer: 1,
      explain: "Each step of private key → public key → address is one-way; reversing it is infeasible in reality.",
    },
    {
      q: "What happens if you completely lose both the private key and the seed phrase?",
      options: ["Contact customer service to recover them", "The corresponding coins are locked away forever, and no one can unlock them", "They transfer automatically to a backup account", "They recover automatically after three months"],
      answer: 1,
      explain: "There's no central authority and no recovery mechanism — this is both the risk and the price of decentralization.",
    },
    {
      q: "When spending with a hardware wallet, what happens to the private key?",
      options: ["It's uploaded to the network for nodes to verify", "It always stays inside the device, and only the generated signature is sent out", "It's temporarily copied into the computer's memory", "It's broadcast publicly along with the address"],
      answer: 1,
      explain: "Signing is done inside the device and the private key never leaves home; the network verifies with the public key and can't derive the private key — that's exactly “the private key never leaves home.”",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Private Key (illustrated)", url: "https://learnmeabitcoin.com/beginners/guide/private-key/" },
    { label: "learnmeabitcoin: Address (illustrated)", url: "https://learnmeabitcoin.com/beginners/guide/address/" },
  ],
};
