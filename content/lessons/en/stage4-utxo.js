export default {
  id: "utxo",
  stage: 4,
  order: 1,
  title: "The UTXO Model: Bitcoin Has No Balances, Only Individual “Bills”",
  difficulty: "core",
  prereqs: ["send-receive", "signatures"],

  oneLiner:
    "There is no such thing as an “account balance” in Bitcoin. What you own is a collection of “unspent transaction outputs (UTXOs)” — like individual fixed-denomination bills in your wallet. To spend one, you have to use the whole bill, and the leftover comes back to you as “change.” Your balance is just your wallet adding up all these UTXOs for you.",

  intuition: `
A bank account is a single **number**: you have 100, you spend 30, and the account becomes 70. Bitcoin does **not** work this way — it has no "account" at all, and no "balance" either.

Bitcoin money comes as individual **UTXOs (Unspent Transaction Outputs)** — think of each UTXO as a **fixed-denomination bill** sitting in your wallet. The "balance" you see is nothing more than your wallet adding up all the bills you can spend and showing you the total. The rules for spending are exactly like cash: spend the whole bill, change comes back to yourself, and if one bill isn't enough, grab a few more to make up the amount.

The "build a transaction" panel on the right lets you pick coins from a handful of UTXOs to pay with, and watch with your own eyes how outputs and change come about.

**In this lesson we break the UTXO model into four pieces:**

- **① What a UTXO actually is — individual cash, each with an "ID card"**
- **② Walking through a complete example — the full life of one transaction**
- **③ Where the fee comes from — inputs minus outputs, and why more inputs cost more**
- **④ Why UTXOs instead of account balances**
`,

  mechanics: `
### ① What a UTXO is: individual cash, each with an "ID card"

Every UTXO has three things:

- **An amount**: counted in **satoshis** (1 BTC = 100 million sats), an integer.
- **A lock**: the locking script (\`scriptPubKey\`), which specifies "what condition must be met to spend me" (covered in detail in the next lesson, Bitcoin Script).
- **A unique coordinate (outpoint)**: located by "the TXID of the transaction that created it : the output index," written as \`TXID:index\` (index starts at 0). Every single UTXO in the world has this one-of-a-kind identity.

The whole network maintains all the "outputs that have not yet been spent" as a **UTXO set (chainstate)**, numbering roughly **80–100 million** as of 2026. Validating a transaction essentially means checking that the UTXOs it spends are **still in the set and have not been spent before** — and this is exactly where **double-spends are prevented**.

> A small concept: **dust**. If a UTXO's amount is so tiny that "the fee to spend it costs more than the UTXO itself is worth," it becomes practically unspendable — dust stuck in your wallet. So "lots of tiny UTXOs" does not add up to easy-to-use money.

### ② Walking through a complete example: the full life of one transaction

Suppose **Alice's wallet holds three UTXOs**: 0.5, 0.3, and 0.2 BTC (the wallet displays "balance 1.0," but it's really three independent bills). She wants to pay **0.7 to Dave**:

- **Step 1 · Coin selection**: the wallet picks out enough UTXOs to cover the payment — it selects **0.5 + 0.3 = 0.8** (the 0.2 isn't needed, so it's left untouched).
- **Step 2 · Build the inputs**: two inputs, each pointing to the \`TXID:index\` of the 0.5 and 0.3 UTXOs, each with Alice's signature attached (proving she's entitled to spend it).
- **Step 3 · Build the outputs**: output ① **0.7 → Dave's** address (the payment); output ② **0.0999 → Alice's own** change address (the change).
- **Step 4 · The fee**: total inputs 0.8 − total outputs 0.7999 = **0.0001 BTC**; this difference automatically goes to the miner who packages it.
- **Step 5 · Update the UTXO set**: once confirmed, the 0.5 and 0.3 UTXOs are **removed (permanently invalidated)**; two new ones appear — 0.7 (belonging to Dave) and 0.0999 (belonging to Alice); and the 0.2 sits untouched, still in Alice's hands.

Understand this example and you've grasped the essence of a transaction: **old coins disappear, new coins are born**, and the ledger simply gains a few records of "who spent which UTXOs and created which new ones."

### ③ The fee: inputs − outputs, and why more inputs cost more

A Bitcoin transaction has **no separate "fee field"**:

- **Fee = total inputs − total outputs**, and the difference is taken by the miner who packages it. You pay by **deliberately writing slightly less in the outputs**.
- ⚠ If you **forget the change**, all the surplus turns into fee — historically people really have paid sky-high fees of **several BTC** this way. Wallets handle change automatically, but understanding this is a prerequisite for reading raw transactions (Stage 4.5).
- **Why do more inputs cost more?** A transaction's size is determined mainly by the **number of inputs** (each input has to carry its own signature data). So the more UTXOs you pull together — and the more fragmented they are — the larger the transaction and the higher the fee (the vByte details come in Stage 4.4). Conversely, when the network is idle and fee rates are low, **consolidating** a pile of fragmented UTXOs into one large one saves on future fees.

### ④ Why UTXOs, not account balances

Satoshi didn't use the more intuitive "account balance"; he chose UTXOs, for four deeper reasons:

- **Parallel validation**: different UTXOs are independent and can be checked simultaneously; an account model must process in order (to prevent the same balance from being double-spent).
- **Better privacy**: each change output can use a new address, so not all activity is tied to one identity.
- **Simpler validation**: you only check whether a UTXO is still in the set, with no need to replay an entire account history.
- **Overspending is structurally impossible**: you can't reference a UTXO that doesn't exist, so spending more than you have is impossible by construction.

**Contrast with Ethereum (the account model)**: Ethereum is like a bank account — the balance is a number, deducted in nonce order, with all activity tied to one address. Bitcoin is like individual cash — naturally parallelizable and more private, but with far weaker scripting than Ethereum's smart contracts. Each model has its strengths (you'll return to this comparison when you study Ethereum).
`,

  demo: "coin-selection",

  analogy: `
A UTXO is just **an individual bill or coin in your wallet**. You don't have an abstract "balance number" — you have specific pieces of money.

Buy a 17 coffee and you hand over a 20 (spend the whole bill); the clerk gives you 3 back (change). You don't tear 17 off the 20 to pay — and Bitcoin is the same: a UTXO is either spent in full or left untouched, and the difference always comes back to you in the form of "change."
`,

  misconceptions: [
    "“A Bitcoin address stores a balance number.” — It does not. On-chain there are only individual UTXOs; the balance is your wallet adding up the UTXOs that belong to you.",
    "“You can spend only part of a UTXO and leave the rest where it is.” — You cannot. A UTXO must be spent in full as an input, and the remainder returns to you via a “change” output.",
    "“The fee is a separate charge deducted on the side.” — It is not. Fee = total inputs − total outputs — it's the part of the output you deliberately leave out, and the miner takes it. Forget your change and it all becomes fee.",
    "“Hoarding lots of small UTXOs has no downside.” — It does. The more inputs you spend, the larger and more expensive the transaction; UTXOs that are too small (dust) can even be too costly to spend at all.",
  ],

  quiz: [
    {
      q: "What do you actually “own” in Bitcoin?",
      options: ["A balance number", "A collection of unspent transaction outputs (UTXOs)", "A bank card", "A password"],
      answer: 1,
      explain: "A balance is just your wallet summing up your UTXOs for display.",
    },
    {
      q: "Alice pays 0.7 to Dave using two UTXOs of 0.5 + 0.3. Roughly what are the change and the fee?",
      options: ["Change 0.3, fee 0", "Change about 0.0999, fee about 0.0001", "No change, fee 0.1", "Change 0.2, fee 0.1"],
      answer: 1,
      explain: "Input 0.8 = payment 0.7 + change 0.0999 + fee 0.0001.",
    },
    {
      q: "Why does spending more inputs (UTXOs) tend to cost a higher fee?",
      options: ["Miners discriminate", "Every input carries signature data, so the transaction gets larger, and it's priced by size", "The amount is larger", "It confirms more slowly"],
      answer: 1,
      explain: "Transaction size is determined mainly by the number of inputs; more fragmented UTXOs cost more (Stage 4.4).",
    },
    {
      q: "What does a transaction do to the UTXOs it spends?",
      options: ["Copies them", "Marks them as spent, permanently invalidates them, and creates new outputs", "Returns them", "Nothing"],
      answer: 1,
      explain: "Consuming old UTXOs and creating new ones is the essence of a transaction.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: UTXO (illustrated)", url: "https://learnmeabitcoin.com/technical/transaction/utxo/" },
    { label: "learnmeabitcoin: Transaction structure", url: "https://learnmeabitcoin.com/technical/transaction/" },
    { label: "Mastering Bitcoin · Chapter 6 Transactions", url: "https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch06_transactions.adoc" },
  ],
};
