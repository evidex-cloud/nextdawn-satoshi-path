export default {
  id: "send-receive",
  stage: 1,
  order: 3,
  title: "Receiving and Sending: Addresses, Fees, Confirmations",
  difficulty: "intro",
  prereqs: ["keys-addresses"],

  oneLiner:
    "Receiving: just give the other party an address or QR code, and ideally use a fresh address each time. Sending: enter the address and amount, then set a “fee rate” to bid for miners to pack your transaction in sooner; once it's on-chain and has a few “confirmations,” it's all but irreversible — so a wrong transfer can't be undone.",

  intuition: `
**Receiving** is simple: send your **address** (or its QR code) to the other party, and they enter the amount and send. One detail: a good wallet **gives you a new address each time** — not required, but it better protects your privacy (others can't easily string all your receipts into one account).

**Sending** requires filling in three things: **the recipient's address** (double-check it — a wrong transfer can't be undone), **the amount** (precise down to 1 sat = 0.00000001 BTC), and one key new concept — **the fee rate**. Each Bitcoin block has limited space, so paying a fee is essentially a **bidding war**. The demo on the right lets you adjust the fee rate and watch how the fee and the rough wait time change.

**In this lesson we break "receiving and sending" into four pieces:**

- **① Receiving · addresses, QR codes, and "a new address each time" — why switch**
- **② Sending · the three things to fill in, and change — where the money comes from, where the change goes**
- **③ Fees · a bidding war over block space — how the fee is computed, and why it's unrelated to the amount**
- **④ Confirmations and irreversibility · from the mempool to 6 confirmations — why it can't be undone**
`,

  mechanics: `
### ① Receiving: addresses, QR codes, and "a new address each time"

The receiver pays nothing — they just hand the **address** to the payer. The address is usually presented as a QR code to avoid hand-copying errors; modern addresses (Bech32, starting with \`bc1\`) also carry a checksum, so the wallet flags an error if you type a few digits wrong.

- **Why does a good wallet give you a new address each time?** An address can be public for receiving money, but **reusing the same address** lets on-chain observers string all your income into one account and infer your balance and behavior. Using a new address makes that harder — this is a **privacy** issue, not a security one (none of the coins in your old address go missing).
- A whole string of addresses are all derived from the same seed (the HD wallet from Stage 1.2), so "a new one each time" adds **nothing** to your backup burden — back up the seed phrase once, and all addresses can be restored.

### ② Sending: the three things to fill in, and change

When sending, fill in three things: **the recipient's address, the amount, and the fee rate.** Behind "the amount" hides Bitcoin's most counterintuitive point — **change**:

- Bitcoin money exists as individual **unspent outputs (UTXOs)**, and when spending you must **use a whole one** — you can't spend only part of it (covered specifically in Stage 4).
- For example: you have a **1 BTC** UTXO and want to pay **0.3** to someone. The wallet uses that entire 1 BTC as input and creates two outputs: **0.3 to the recipient**, and the remaining roughly **0.7 as change** sent back to **a new address of your own**.
- This is the other source of "a new address each time" — change automatically lands in a new address. You don't have to worry about it; the wallet handles it all automatically, but understanding it explains why some addresses you didn't actively create show up in your wallet.

### ③ Fees: a bidding war over block space

Each block can hold only a limited number of transactions (about one every 10 minutes), so the fee becomes a **bid for grabbing block space**:

- **How it's computed**: fee ≈ **fee rate (sat/vB) × transaction size (vB)**. The fee rate is "how many satoshis you offer per virtual byte," and the transaction size is determined by the **number of inputs and outputs**.
- **Why it's almost unrelated to the amount**: transaction size depends on "how many inputs and outputs," not "how much money was sent." So sending **0.001 BTC** and sending **10 BTC** can have **about the same fee**, as long as the input/output structure is similar. On the other hand, a transaction that gathers a pile of tiny UTXOs (many inputs) is larger and more expensive (detailed in Stage 4).
- **How the fee rate is estimated**: wallets usually offer a few tiers — "fast / medium / slow" — backed by a real-time estimate of how congested the current **mempool (pending pool)** is. When the network is idle a few sat/vB is enough; when congested it may spike to tens or even hundreds.
- **Example**: a common transaction is about **140 vB**; at a fee rate of **10 sat/vB**, the fee is about **1400 sats ≈ 0.000014 BTC**. The same transaction during congestion at **80 sat/vB** costs about **11,200 sats** — the structure didn't change, but it's nearly 8 times more expensive, all due to the fee rate.

### ④ Confirmations and irreversibility: from the mempool to 6 confirmations

A transaction's life cycle after sending directly determines "whether the money really counts as arrived":

- **Entering the mempool**: it first joins the network-wide **pending pool** to queue, waiting for miners to pick and pack it (higher fee rates first).
- **1 confirmation**: once packed into a block, it has 1 confirmation; each new block stacked on top of it afterward adds +1 to the confirmation count.
- **Why more confirmations are safer**: to overturn this transaction, you'd have to **re-mine the block it's in plus every block after it** (back to proof-of-work from Stage 0 and Stage 2). The more confirmations, the thicker the computing power stacked on top, and the higher the cost and the lower the probability of being overturned.
- **How many confirmations are enough**: for small everyday amounts, **1 confirmation** is usually fine; for large amounts, generally wait **6 confirmations** (about an hour) to be safer. **0 confirmations ≠ arrived** — an unconfirmed transaction can still be replaced or pushed out, so for large receipts never ship goods just because you see "sent."
- **Irreversible = no undo button**: after a few confirmations, a transfer is effectively **irreversible**, and no central authority can roll it back. This is exactly the root reason to "**double-check the full address, and test large amounts with a small amount first.**"

> Tip: many wallets support **RBF (Replace-By-Fee)** — if a sent transaction feels too slow, you can "expedite" it by replacing the original with a higher fee rate; there's also **CPFP (child-pays-for-parent)** and other tricks. These are advanced operations — just good to know they exist.
`,

  demo: "fee-confirm",

  analogy: `
Think of block space as **a train that departs every ten minutes with a limited number of seats**. All the transactions wanting to board line up on the platform (the mempool), and **the fee is the ticket price you're willing to pay**: higher bids board first, while lower bids may have to wait for the next train, and the one after that.

The "confirmation count" is like **the number of stations the train has passed after departing**: just boarded (1 confirmation) and you're basically settled; after passing 6 stations (6 confirmations), making the train back up to change your ticket is nearly impossible.
`,

  misconceptions: [
    "“The fee is determined by the transfer amount — send more and it costs more.” — Wrong. The fee depends on the transaction's data size and the current congestion, and is basically unrelated to the amount.",
    "“After a transaction is sent, it can be recalled, or refunded by the platform.” — It can't. After a few confirmations it's effectively irreversible, and no central authority can roll it back. That's why double-checking the address and testing with a small amount first matters.",
    "“0 confirmations means it's arrived, so I can ship immediately.” — An unconfirmed transaction can still be replaced or pushed out. For large receipts, wait for enough confirmations.",
    "“Reusing the same address to receive money is fine.” — Functionally there's no problem, but it harms privacy by letting people link your income and spending together; using a new address is better.",
  ],

  quiz: [
    {
      q: "What does a Bitcoin fee mainly depend on?",
      options: ["The size of the transfer amount", "The transaction's data size and the network's congestion level", "Who the recipient is", "The brand of your wallet"],
      answer: 1,
      explain: "Fee ≈ fee rate × transaction size, basically unrelated to the amount.",
    },
    {
      q: "Why is it recommended to wait about 6 confirmations for large receipts?",
      options: ["To hit a lucky number", "More confirmations means a higher cost to overturn, and more irreversibility", "Otherwise the fee will rise", "Otherwise the address will expire"],
      answer: 1,
      explain: "More confirmations = more proof-of-work stacked on top, making tampering nearly impossible.",
    },
    {
      q: "You accidentally transferred coins to a wrong (but valid) address. What can you do?",
      options: ["Contact support to recall it", "Almost nothing — transfers are irreversible", "Restart the wallet to roll it back", "Wait 24 hours for an automatic refund"],
      answer: 1,
      explain: "This is exactly why you should double-check the address and test with a small amount first.",
    },
    {
      q: "The network is very congested and you're in a hurry. What's the most effective move?",
      options: ["Lower the amount", "Raise the fee rate (or use RBF to expedite)", "Send several identical transactions", "Switch wallets and resend"],
      answer: 1,
      explain: "The fee rate is a bid; higher bids get packed by miners first.",
    },
    {
      q: "You pay 0.3 to someone from a 1 BTC UTXO. How does the wallet usually handle the rest?",
      options: ["Leaves the 0.7 untouched in the original UTXO", "Sends the 0.7 back to a new address of your own as “change”", "Returns the 0.7 to the miners", "Automatically donates the 0.7"],
      answer: 1,
      explain: "A UTXO must be spent whole; the remainder returns to a new address of your own via a “change” output — which is also why new addresses appear in your wallet (detailed in Stage 4).",
    },
  ],

  further: [
    { label: "mempool.space: view the mempool and fee rates in real time", url: "https://mempool.space/" },
    { label: "learnmeabitcoin: Transaction fees (illustrated)", url: "https://learnmeabitcoin.com/beginners/guide/transaction-fees/" },
  ],
};
