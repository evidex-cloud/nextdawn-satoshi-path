export default {
  id: "build-and-beyond",
  stage: 10,
  order: 4,
  title: "Build a Transaction in Code, and Where to Go From Here",
  difficulty: "deep",
  prereqs: ["rpc", "script", "signatures"],

  oneLiner:
    "The final step: use a development library (like bitcoinjs-lib or BDK) to construct, sign, and broadcast a transaction with your own hands, turning “understanding” into “being able to do.” Then here's a map for going deeper — Bitcoin's source code, the BIPs, and the community always have another layer to dig into.",

  intuition: `
By this point, you can build a transaction "from nothing" — and you understand why at every step:

- **Select inputs**: pick UTXOs that cover the payment + the fee (Stage 4.1)
- **Create outputs**: payment + change (Stage 4.1 / 4.4)
- **Sign**: unlock each input with your private key, or collaborate via PSBT for multi-party multisig (Stage 3.2 / 7.4)
- **Serialize**: pack it into a raw transaction (raw tx)
- **Broadcast**: \`sendrawtransaction\`, into the mempool to wait for inclusion (Stage 6.3)

Libraries like **bitcoinjs-lib (JS), BDK (Rust), and python-bitcoinlib** handle the low-level cryptography for you; you just **assemble** the pieces. **Practice on testnet / signet first** — that's a free, safe "sandbox Bitcoin" that will never touch real money.

Walk through this standard flow on the right to bring the whole course to a close.

**In this lesson we break "building a transaction + the path onward" into four pieces:**

- **① The five steps of building a transaction — select coins, create outputs, sign, serialize, broadcast**
- **② Which tools to use — development libraries and PSBT, and what they do for you**
- **③ Practicing safely — the testnet / signet sandbox, never touching real money**
- **④ Where to go from here — source code, BIPs, books, and directions**
`,

  mechanics: `
### ① The five steps of building a transaction

Stringing all the earlier lessons into one executable pipeline, this is the full life cycle of a transaction:

- **Step 1 · Select inputs (coin selection)**: pick a few UTXOs from yours that "cover the payment + the fee." With RPC that's \`listunspent\`; with a library, it comes with a coin-selection algorithm. The more fragmented your picks, the bigger and more expensive the transaction (Stage 4.1 / 4.4).
- **Step 2 · Create outputs**: one payment output (the recipient's address), usually plus a change output (back to a new address of your own). ⚠ **Never forget to write the change** — if you do, that portion all turns into a fee gifted to the miner (Stage 4.1).
- **Step 3 · Sign**: unlock each input one by one with the corresponding private key, generating signatures/witnesses. For multi-party collaboration, use **PSBT (Partially Signed Bitcoin Transaction, BIP 174)** to pass it among the parties so each signs their own part — exactly how multisig wallets work (Stage 3.2 / 7.4).
- **Step 4 · Serialize**: pack the version number, inputs, outputs, witness, and locktime into a hex string in the proper format — the **raw transaction (raw tx)**.
- **Step 5 · Broadcast**: \`bitcoin-cli sendrawtransaction <hex>\` (Stage 10.2). On success it returns a txid, the transaction enters the mempool, and it waits for a miner to include it (Stage 6.3). Afterward you can search that txid on an explorer to watch it confirm (Stage 10.3).

A safety net: before broadcasting, run \`bitcoin-cli testmempoolaccept '[“<hex>”]'\` to have the node **pre-check** whether this transaction would be accepted, without actually broadcasting — if you got something wrong, there's still time to fix it.

### ② Which tools to use: development libraries and PSBT

Nobody hand-writes bytes. The common libraries each have their strengths, and what they share is that they **handle the low-level cryptography (elliptic-curve signatures, hashing, encoding) for you, so you only assemble the pieces**:

- **bitcoinjs-lib (JavaScript)**: the most common in the Web and Node ecosystem, and very handy for constructing transactions with its \`PSBT\` class.
- **BDK / rust-bitcoin (Rust)**: the Bitcoin Dev Kit, which comes with a wallet, coin selection, and descriptors — suited to building serious applications.
- **python-bitcoinlib / bitcoinlib (Python)**: script- and teaching-friendly, good for quick experiments.
- Whichever you use, **PSBT** is the modern standard format: it lets "construct — sign — combine — broadcast" be split across different devices / different people (a hardware wallet signs, a collaborator co-signs), making it the common language of multisig and hardware wallets.

### ③ Practicing safely: the testnet / signet sandbox

The first iron rule: **practice on a test network first, don't trial-and-error with real money on mainnet.**

- **testnet**: the old, established test network; its coins (tBTC) have no value and are claimed free from a "faucet." Its downsides are unstable block production and occasional abuse.
- **signet**: a newer, more stable test network with regular block production controlled by signers — **the most recommended** for practicing transaction construction, running a node, and playing with Lightning. Add \`signet=1\` in \`bitcoin.conf\` (or launch with \`-signet\`) to switch over.
- **regtest**: a local private chain where you're the miner yourself, and \`generatetoaddress\` produces as many blocks as you want — the most convenient for automated testing.
- On these networks, **no mistake costs you real money** — they're built for trial and error. Once your flow runs through on signet, going to mainnet is just a matter of changing the network parameter.

### ④ Where to go from here: source code, BIPs, directions

This course is the **foundation, not the finish line**. You've gone all the way from "why we need Bitcoin" (Stage 0) to being able to run a node, use RPC, read an explorer, and construct transactions in code (Stage 10). To go deeper, there are a few clear paths:

- **Read the Bitcoin Core source**: start with the core directories — \`src/validation.cpp\` and \`src/consensus/\` (consensus and validation rules), \`src/net*\` (P2P networking), \`src/wallet/\` (the wallet). You now have the conceptual map, enough to navigate by it.
- **Read the BIPs**: Bitcoin Improvement Proposals are the "primary sources" of the specification — for example BIP 32 (HD wallets), BIP 141 (SegWit), BIP 174 (PSBT), BIP 340–342 (Taproot). Truly understand one BIP and you've thoroughly digested one feature (Stage 6.4).
- **Systematic books**: *Mastering Bitcoin* (comprehensive), *Programming Bitcoin* (build an implementation from scratch — the most rigorous workout).
- **Pick a direction and dig deep**: Lightning Network development, Taproot scripting and Miniscript, PSBT tooling, and even frontier proposals like covenants (Stage 8 / 9).

Ahead lies a much wider open frontier — and now, with your own map and tools, whichever direction you want to go is up to you.
`,

  demo: "build-tx",

  analogy: `
You've gone from "**understanding a language**" to "**being able to write sentences in it**."

The whole "Satoshi Path" has been paved to this point — ahead lies the same open frontier Satoshi once faced; the difference is that **this time, you set out with your own map and tools, too**. Whichever direction you want to go is up to you.
`,

  misconceptions: [
    "“Constructing a transaction requires mastering advanced cryptography.” — Not at all. Libraries like bitcoinjs-lib / BDK handle signing, encoding, and other low-level work for you; you assemble the pieces in the five steps.",
    "“You can only really learn by practicing on mainnet.” — Quite the opposite: using signet / testnet / regtest is free and safe, the coins have no value, and they're built precisely for trial and error.",
    "“There's no way to check whether a transaction is right before broadcasting.” — There is. First use testmempoolaccept to have the node pre-check whether it would be accepted; if something's wrong there's still time to fix it, and it isn't actually broadcast.",
    "“PSBT is only something multisig uses.” — It's the common format for modern construction/signing — hardware wallets, collaborative signing, and cross-device flows all rely on it (BIP 174).",
    "“Finishing this course is the peak.” — This is the foundation. Source code, BIPs, Lightning, Taproot, covenants… every direction can be dug into further.",
    "“Reading the Bitcoin Core source is too hard, not something I can touch.” — You now have the conceptual map (what validation/consensus/net/wallet each handle), enough to follow it through and keep reading.",
  ],

  quiz: [
    {
      q: "What is usually the final step in programmatically constructing a transaction?",
      options: ["Mining", "Broadcasting (sendrawtransaction) into the mempool", "Encryption", "Logging into an exchange"],
      answer: 1,
      explain: "After signing and serializing, you broadcast and wait for inclusion (callback to 6.3).",
    },
    {
      q: "To safely practice constructing transactions and running nodes, you should use?",
      options: ["Small amounts on mainnet", "The testnet / signet test networks (coins have no value)", "Someone else's wallet", "Working it out on paper"],
      answer: 1,
      explain: "Test networks are free and safe, made specifically for trial and error.",
    },
    {
      q: "What do development libraries (bitcoinjs-lib / BDK, etc.) do for you?",
      options: ["Give you free coins", "Handle the low-level cryptography while you assemble the transaction", "Custody your private keys", "Speed up the network"],
      answer: 1,
      explain: "You focus on stitching together inputs/outputs/signatures.",
    },
    {
      q: "Regarding this course and your learning ahead, which is correct?",
      options: ["Finishing it is the peak", "It's the foundation; source code/BIPs/Lightning/covenants can all be dug into further", "There's nothing left to learn", "You can only keep reviewing"],
      answer: 1,
      explain: "You now have the conceptual map to keep exploring the entire Bitcoin world.",
    },
  ],

  further: [
    { label: "Mastering Bitcoin (open-source full book)", url: "https://github.com/bitcoinbook/bitcoinbook" },
    { label: "Programming Bitcoin (hands-on coding)", url: "https://github.com/jimmysong/programmingbitcoin" },
  ],
};
