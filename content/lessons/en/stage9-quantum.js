export default {
  id: "quantum-threat",
  stage: 9,
  order: 6,
  title: "量子计算与比特币：威胁有多近？",
  titleEn: "Quantum Computing & Bitcoin: How Real Is the Threat?",
  difficulty: 3,
  prereqs: ["signatures", "keys-addresses"],

  oneLiner:
    "A quantum computer will not “steal all of Bitcoin overnight.” The real danger targets only one thing — coins whose public key is already exposed on-chain (reused addresses, ancient P2PK outputs, Taproot key-path payments, and transactions sitting unconfirmed in the mempool). Hashes stay safe; signatures are the soft spot. And a machine that can actually break signatures is still decades out. Bitcoin has both the time and the means (a soft fork to post-quantum signatures) to prepare.",

  intuition: `
The moment the words "quantum computing" appear, the headlines start shouting "Bitcoin is doomed." The truth is far calmer — and far more interesting.

First, lock in one **core distinction**: Bitcoin uses two completely different cryptographic primitives — **hashing** (SHA-256, RIPEMD-160, Stage 3.1) and **digital signatures** (ECDSA / Schnorr over the secp256k1 elliptic curve, Stage 3.2). A quantum computer threatens these two in **wildly different** ways: it can **completely break signatures** (deriving your private key from your public key), yet is **nearly useless against hashes** (it only square-roots the brute-force effort — a shrug).

So the whole "quantum threat" story boils down to one plain question: **is your public key exposed on-chain?** A normal address you've never spent from only publishes a **hash** of the public key — the quantum machine can't see the public key itself, so it has nothing to attack. But the moment you **spend**, your public key gets written into the transaction, in the open — that is the real exposure.

The demo on the right lets you inspect each "way of holding coins" to see whether it's safe or at risk, and flip a "fresh address" yourself from safe to "spent → exposed."

**In this lesson we break the quantum threat into four pieces:**

- **① What quantum computing actually is — qubits, and the two algorithms Shor and Grover**
- **② Why Bitcoin is threatened — signatures are the soft spot; exposed public keys are the real surface**
- **③ How close and how urgent — what kind of machine it takes to break secp256k1**
- **④ How the community should respond — post-quantum cryptography, a soft fork, and the "lost coins" dilemma**
`,

  mechanics: `
### ① What quantum computing is: two algorithms, opposite fates

A classical bit is 0 or 1. A **qubit** uses **superposition** to sit in a probabilistic blend of 0 and 1 at once; entangle several qubits and, for certain problems, they can explore a solution space in parallel in ways a classical machine cannot. Note — a quantum computer is **not** a "faster at everything" magic box. It has an exponential edge only on a **small set of problems with special mathematical structure.** For Bitcoin, just two algorithms truly matter:

- **Shor's algorithm (the lethal one)**: efficiently solves **integer factorization** and the **elliptic-curve discrete-log** problem. secp256k1's security rests precisely on "the elliptic-curve discrete log is hard" — i.e., "knowing the public key, you essentially cannot recover the private key" (Stage 1.1). Shor turns that "essentially impossible" into "feasible": given an **exposed public key**, a strong enough quantum machine can **compute the matching private key**, forge a signature, and spend those coins. ECDSA and Schnorr fall **together**, because they use the same curve.
- **Grover's algorithm (the mild one)**: against "brute-force search / finding a hash pre-image," it offers only a **square-root (quadratic) speedup** — cutting N tries down to about √N. Applied to SHA-256, that shaves its 256-bit security to roughly **128 bits.** And 128 bits stays **safe for the foreseeable future** (you couldn't finish the search in the age of the universe). So hashes are **not broken** — merely "marked down." Mining (Stage 5.x) is also only **mildly** affected by Grover: the theoretical quadratic speedup is largely offset by error-correction overhead and the cost advantage of classical ASICs — more likely "yet another class of faster miner" than a collapse.

In a phrase: **Shor kills signatures, Grover scratches hashes.** That's the key to the next piece.

### ② Why Bitcoin is threatened: exposed public keys are the real surface

Carry that distinction onto the chain and the conclusion is sharp: **coins protected by a hash are safe; coins whose public key is exposed are at risk.** It all hinges on what an "address" actually publishes:

- **A normal address only publishes a hash of the public key**: P2PKH and P2WPKH addresses (Stage 4.3) put a **hash of the public key** (via SHA-256 + RIPEMD-160) in the on-chain locking script. All the quantum machine sees is a hash — even after Grover weakens it, that's still about 128 bits — so it **can't recover the public key, let alone the private key.** Coins in a **never-spent** normal address are shielded by **the wall of hashing.**
- **The public key is exposed the instant you spend**: to spend a UTXO (Stage 4.1) you must **reveal the full public key + signature** in the transaction to prove ownership. Once published, that public key is on-chain forever. Hence:

  - **Reused addresses**: you've received and then spent from the same address — the moment you spent, the public key went public, so any **further** coins received at that address and not yet moved sit **fully exposed** in front of Shor. This is the most common, most avoidable exposure.
  - **Ancient P2PK outputs**: Bitcoin's earliest payment scripts wrote the **public key directly** on-chain (not a hash), including many **early-miner / Satoshi-era** coins. Their public keys have been exposed since day one.
  - **Taproot key-path outputs**: in a P2TR (the Taproot of Stage 8) key-path spend, **the public key appears directly in the address itself.** By design this buys efficiency and privacy — at the cost of the public key no longer being veiled by a hash.
  - **Transactions sitting in the mempool**: in a transaction you've just broadcast but that isn't yet mined, the public key and signature are **already public.** A fast enough quantum machine could, in theory, derive the private key **before that transaction confirms**, build a competing transaction sweeping the coins to itself, and jump the queue with a higher fee — a race of "confirmation vs. cracking."

- **The size of the surface**: combined estimates put **a few million BTC (~25% of supply)** in addresses with **exposed public keys** (reused addresses + ancient P2PK + Taproot, etc.). That is what quantum can actually target; the larger remainder of never-reused coins stays behind the hash wall.

### ③ How close, how urgent: how far today's machines are

Before panicking, look at the orders of magnitude. Here you must separate two kinds of "qubit":

- **Physical qubits vs. logical qubits**: physical qubits on real hardware are **extremely noisy** and error-prone; to run a useful long computation you must use **error correction** to "bundle" many physical qubits into one stable **logical qubit** — often on the order of **a thousand physical qubits per logical qubit.**
- **Where we are today (2026)**: the leading edge sits at **a few hundred to low-thousands of noisy physical qubits**, far short of the fidelity needed for large-scale error correction.
- **What breaking secp256k1 takes**: mainstream estimates call for a **fault-tolerant** machine with **thousands of logical qubits** — which translates to **millions of physical qubits** plus full error correction. Such a "cryptographically-relevant quantum computer (CRQC)" is widely estimated to be **10 to 30+ years** away, deeply uncertain, with no one able to name a date.
- **So: not imminent, but preparation must start early.** Two reasons make "prepare now" the rational choice. First, coins can **lie exposed in an address for decades** — waiting until the machine exists is too late. Second, Bitcoin's mission is to **store value across time**; the ledger is meant to live for decades or centuries — a chain built to last must complete its defensive upgrade before the threat materializes. It's the same logic as buying insurance early.

### ④ How the community should respond: post-quantum cryptography and the "lost coins" dilemma

The good news: the response path is fairly clear, and only the last piece is a genuinely thorny political problem.

- **Post-quantum cryptography (PQC) is already standardized**: in **2024** NIST formally standardized a set of **quantum-resistant signature schemes** — **ML-DSA (a.k.a. Dilithium), SPHINCS+, and Falcon.** Their security does not rest on the elliptic-curve discrete log, so Shor is useless against them.
- **Bitcoin can upgrade via a soft fork**: it's entirely feasible to add a **quantum-resistant signature / address type** through a **soft fork (Stage 6.4)**, letting users **actively migrate** funds to safe addresses. This route is technically sound and is exactly the active research direction today (several proposals are circulating, e.g. new quantum-resistant output types).
- **Mitigation available right now**: **don't reuse addresses.** Use a fresh address for every change output and every receipt, and the public key stays hidden behind a hash — this one habit keeps the vast majority of your own coins out of Shor's range. It's a defense anyone can apply today, at zero cost.
- **The genuinely hard part: coins whose public keys are already exposed and that no one can ever move again.** Ancient P2PK outputs, wallets with lost private keys, Satoshi's ~million coins — their public keys have long been public, yet **no one can migrate them to safety anymore.** When a CRQC arrives, these coins become, in theory, an ownerless treasure: "whoever computes the private key first can take them." This drops the community into a **debate with no clean answer**: should consensus rules **freeze / burn** these exposed, clearly abandoned coins, lest a quantum attacker loot them and shock the market and trust? Freezing other people's coins violates Bitcoin's permissionless, seizure-resistant spirit; doing nothing risks a systemic shock. It's an open question tangled with technology, ethics, and game theory — still at the frontier of active research and community debate.
`,

  demo: "quantum-threat",

  analogy: `
Picture every bitcoin locked in a safe, where **the key is your private key.**

- **A normal address you've never spent from**: the outside of the safe shows only a **pixelated thumbnail of a photo of the key (the hash).** The quantum thief stares at the blur and can't reproduce the key — **safe.**
- **The instant you've opened this safe (spent from it)**: at that moment a **crisp photo of the key (the public key)** gets pinned to the outside forever. Holding the photo, a strong enough quantum thief can cut a matching key — **at risk.**

So the charm is absurdly simple: **don't reuse the same safe.** Use a fresh safe every time and the key's photo stays a blur forever. And the old safes that long ago pinned up a crisp key photo but whose owners can never be found again (Satoshi's coins, wallets with lost keys) — those are the hardest part of the whole story.
`,

  misconceptions: [
    "“The moment a quantum computer appears, it will instantly steal all of Bitcoin.” — No. Only coins with an already-exposed public key (~25%) are at risk, and a machine that can actually break them is far from being built; never-reused addresses are shielded by hashing.",
    "“Quantum computing will break SHA-256 and collapse mining and the ledger.” — No. Grover gives only a square-root speedup, shaving 256 bits to about 128, which stays safe; mining is only mildly affected. Shor breaks signatures, not hashes.",
    "“There are already quantum computers that can break Bitcoin.” — There aren't. Today we have only a few hundred to a few thousand noisy physical qubits; breaking secp256k1 needs thousands of logical qubits (millions of physical qubits + error correction), widely estimated 10–30+ years out.",
    "“It's all going to be broken anyway, so changing addresses won't save you.” — Quite the opposite. Not reusing addresses, keeping the public key hidden behind a hash, is a defense you can apply today and is extremely effective.",
    "“Bitcoin is helpless against quantum and is doomed to obsolescence.” — Wrong. It can soft-fork to NIST-standardized quantum-resistant signatures (ML-DSA / SPHINCS+ / Falcon), and users can then migrate their coins to safe addresses.",
  ],

  quiz: [
    {
      q: "Which correctly describes quantum computing's threat to Bitcoin's two cryptographic primitives?",
      options: [
        "Equally lethal to both hashing and signatures",
        "Shor derives a private key from an exposed public key (breaking signatures); Grover only halves a hash's security (still safe)",
        "It threatens hashing but not signatures",
        "Both are only mildly weakened",
      ],
      answer: 1,
      explain: "Shor kills signatures (elliptic-curve discrete log); Grover gives only a square-root speedup on hashes, 256 bits → about 128, still safe.",
    },
    {
      q: "For which kind of coins is the public key NOT exposed, so it stays protected by hashing?",
      options: [
        "Ancient P2PK outputs",
        "A reused address that has already been spent from",
        "A never-spent normal address (P2PKH / P2WPKH)",
        "A transaction sitting unconfirmed in the mempool",
      ],
      answer: 2,
      explain: "A normal address publishes only a hash of the public key on-chain; the full public key is revealed only when you spend. Never-spent = the public key is still hidden behind a hash.",
    },
    {
      q: "Why is the quantum threat “not imminent, yet still needs early preparation”?",
      options: [
        "Because a quantum computer can never be built",
        "Because breaking it needs thousands of logical qubits (estimated 10–30 years out), but coins lie exposed for decades and the chain must last — so we must upgrade ahead of time",
        "Because SHA-256 is about to be broken",
        "Because today's machines can already break it; no one has just bothered yet",
      ],
      answer: 1,
      explain: "Today's machines fall far short; but exposed coins can sit for decades, and value is meant to be stored across time, so defending early is the rational move.",
    },
    {
      q: "What effective defense can an individual apply today against the quantum threat?",
      options: [
        "Sell all your coins",
        "Consolidate your coins into a single address",
        "Don't reuse addresses, keeping the public key hidden behind a hash",
        "Shut down your own node",
      ],
      answer: 2,
      explain: "Not reusing addresses keeps the public key off-chain; combined with a future soft fork to quantum-resistant signatures (ML-DSA, etc.), it stays safe long-term.",
    },
  ],

  further: [
    { label: "NIST Post-Quantum Cryptography Standards (FIPS 203/204/205)", url: "https://csrc.nist.gov/projects/post-quantum-cryptography" },
    { label: "Bitcoin Wiki: Quantum computing and Bitcoin", url: "https://en.bitcoin.it/wiki/Quantum_computing_and_Bitcoin" },
    { label: "Wikipedia: Shor's algorithm", url: "https://en.wikipedia.org/wiki/Shor%27s_algorithm" },
  ],
};
