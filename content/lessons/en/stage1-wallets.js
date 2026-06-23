export default {
  id: "wallets",
  stage: 1,
  order: 2,
  title: "A Wallet Doesn't Hold Money — It Manages Keys",
  difficulty: "intro",
  prereqs: ["keys-addresses"],

  oneLiner:
    "There are no coins inside a Bitcoin wallet — the coins are on-chain. A wallet is a tool that generates and safeguards your private keys, and uses them to show balances and construct transactions. A single “seed phrase” is the master seed for all your private keys: remember it, and you can restore all your assets in any wallet.",

  intuition: `
The most counterintuitive point: **there are no coins inside the wallet.** Your coins are records on the network-wide ledger; what the wallet truly safeguards are the **private keys** that can move those records (picking up from the last lesson: the private key is ownership itself).

More precisely, a modern wallet won't make you hand-copy a huge pile of private keys; instead it gives you a **seed phrase (recovery phrase)** — usually 12 or 24 English words. Through a standard algorithm, this phrase can **deterministically** derive all the private keys and addresses you need. Generate an "illustrative seed phrase" on the right to feel what it looks like, and how "the same seed always restores the same set of keys."

**In this lesson we break "the wallet" into four pieces:**

- **① What a wallet actually manages — it manages keys, it doesn't hold coins**
- **② The seed phrase · one seed grows a whole tree of keys — how an HD wallet derives**
- **③ Four kinds of wallets · sorted by "who holds the keys, online or not" — their trade-offs**
- **④ How to choose and how to back up — rules of thumb and the iron rule of offline backup**
`,

  mechanics: `
### ① What a wallet actually manages: it manages keys, it doesn't hold coins

Forget the "wallet" in the name — it's not a cash box, it's a **key manager plus transaction builder**. A wallet does four things for you:

- **Generates and safeguards private keys** (usually in seed-phrase form).
- **Derives addresses** for you to receive money.
- **Scans the ledger and tallies the UTXOs that belong to you**, computing the "balance" to display (a balance is just a sum; the UTXO model is detailed in Stage 4).
- **Constructs and signs transactions**, then broadcasts them.

So "if I switch wallet apps, are my coins still there?" The answer: **the coins were never inside the app — they're on-chain.** As long as you hold the same seed phrase, any compatible wallet can restore the same set of addresses and balances — and this is the foundation for the next lesson's "self-custody vs. exchanges."

### ② The seed phrase: one seed grows a whole tree of keys

Why can a string of words represent your entire wallet? Behind it are two standards (just good to know; deep dive in Stage 7):

- **BIP39**: encodes a chunk of random entropy into **12 or 24** English words drawn from a fixed 2048-word list, with one **checksum** word — so if you copy one word wrong, the wallet can detect it. These words then compute a 512-bit **seed**.
- **BIP32 (HD wallet, hierarchical deterministic)**: starting from this one seed, a deterministic algorithm **derives an entire tree of keys** — thousands of private keys/addresses, all sourced from the same seed.

"Deterministic" is the keyword: **the same seed phrase always derives the same set of keys and addresses.** So you only need to back up this phrase, not back up hundreds or thousands of addresses one by one; on a new phone or a new wallet, enter the seed phrase and it fully rebuilds.

- The seed phrase = the **master key (master seed) to your entire wallet.**
- Write down these 12 or 24 words and you can restore all your assets in **any** compatible wallet, even if the original phone is lost, dropped, or stolen.
- Conversely, **whoever gets this phrase takes all your coins** — it's even more lethal than a single private key, because it controls the whole tree at once.

### ③ Four kinds of wallets: sorted by "who holds the keys, online or not"

The two axes of wallet security are **who holds the private keys** and **whether it's online**:

- **Custodial wallet (exchange account)**: the private keys are in the **platform's** hands, and you only have a login account. Most convenient, but the coins aren't really yours — this is the "IOU" problem from Stage 0 (the next lesson covers it specifically).
- **Non-custodial software wallet (hot wallet)**: the private keys are stored on your **internet-connected** phone or computer, under your own control. Convenient for small everyday amounts, but as long as the device is online there's risk from malware and phishing.
- **Hardware wallet (cold wallet)**: the private keys are isolated in a dedicated device that **never connects to the internet**; signing happens inside the device, and the keys never leave it (echoing the last lesson's "the private key never leaves home"). The top choice for large, long-term storage.
- **Paper / steel backup**: write the seed phrase offline on paper, or engrave it on a metal plate (fire- and water-proof), **specifically to back up the seed itself** — it's not an everyday wallet but a cold backup.

In one line: **custodial is the most worry-free but least yours → a hot wallet is self-custodied but has a large exposure surface → a cold wallet is the safest but a bit heavier to operate.**

### ④ How to choose and how to back up

- **Rule of thumb**: small everyday spending → hot wallet; large, long-term holdings → hardware wallet. Many people **use both**: a hot wallet as the "everyday pocket money wallet," and a cold wallet as the "vault."
- **Offline backup is the iron rule**: whatever wallet you use, **the seed phrase must be hand-written offline or engraved on metal**, kept somewhere safe, and you can store multiple copies in separate locations. **Never** screenshot it, photograph it, save it to the cloud, note it in a memo, or email it to yourself — anything online can be stolen (security detailed in Stage 1.5).
- **12 or 24 words?** For the vast majority of people, the security of 12 words already far exceeds any chance of brute-force; 24 words is more about preference and extreme redundancy than necessity. **The point is always: don't leak it, don't lose it — not the word count.**
`,

  demo: "seed-phrase",

  analogy: `
A wallet is like a **key manager**, not a cash box. Your money is locked in individual compartments inside a public vault (the blockchain), and the wallet safeguards the keys to those compartments for you.

And the seed phrase is the **master copy that can re-cut all the keys**. Write the master copy down and lock it in a safe, and even if the key manager (your phone) is lost, you can re-cut a full set from the master copy and get all your money back, untouched.
`,

  misconceptions: [
    "“I store my coins in the wallet app.” — The app stores keys, not coins; the coins are always on-chain. Switch apps, use the same seed phrase, and the coins are still there.",
    "“Saving the seed phrase in my notes app, taking a photo, or storing it in the cloud is safest.” — Those are exactly the most dangerous. Anything online can be stolen. The seed phrase should be hand-written offline or engraved on metal, never digitized.",
    "“24 words must be far safer than 12, so I must use 24.” — For the vast majority of people, the security of 12 words already far exceeds any chance of brute-force; 24 words is more about preference and extreme redundancy than necessity. The point is always: don't leak it, don't lose it.",
  ],

  quiz: [
    {
      q: "What exactly is stored in a Bitcoin wallet?",
      options: ["Physical bitcoins, one by one", "The private keys / seed phrase that can move the on-chain balance", "A bank card", "Your ID card"],
      answer: 1,
      explain: "The coins are on-chain; the wallet manages the keys.",
    },
    {
      q: "Your phone is lost, but you wrote down the seed phrase. What happens?",
      options: ["All the coins are gone", "Use the seed phrase to fully restore in a new wallet", "You have to wait 30 days", "You must contact the manufacturer"],
      answer: 1,
      explain: "The seed phrase is the master seed; it can restore all assets in any compatible wallet.",
    },
    {
      q: "How should a seed phrase best be safeguarded?",
      options: ["Take a photo and save it to the cloud", "Note it in your phone's notes app", "Hand-write offline or engrave on metal, never digitize it", "Email it to yourself"],
      answer: 2,
      explain: "Any online storage can be stolen; an offline backup is the iron rule.",
    },
    {
      q: "What is most suitable for large, long-term storage?",
      options: ["An exchange account", "An online hot wallet", "A hardware (cold) wallet", "Just keeping it in your head"],
      answer: 2,
      explain: "A hardware wallet keeps the private keys isolated and offline, with signing done inside the device — best for large, long-term holdings.",
    },
    {
      q: "Why does backing up a single 12/24-word seed phrase restore hundreds or thousands of addresses?",
      options: ["The wallet secretly stuffs all the addresses into that phrase too", "The seed phrase is a seed, and an HD wallet (BIP32) uses it to deterministically derive a whole tree of keys", "Every address is actually the same", "The exchange's cloud keeps them for you"],
      answer: 1,
      explain: "The same seed always deterministically derives the same set of keys and addresses, so you only need to back up the seed (the seed phrase) itself.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Wallets (illustrated)", url: "https://learnmeabitcoin.com/beginners/guide/wallets/" },
    { label: "BIP39 English wordlist (reference)", url: "https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt" },
  ],
};
