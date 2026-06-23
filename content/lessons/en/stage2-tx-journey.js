export default {
  id: "tx-journey",
  stage: 2,
  order: 2,
  title: "A Transaction's Journey: From Tapping Send to Written into a Block",
  difficulty: "intro",
  prereqs: ["blockchain", "send-receive"],

  oneLiner:
    "After you tap “send,” your wallet signs the transaction with your private key, broadcasts it to nodes across the network, and parks it in a “pending pool” until a miner packs it into a block — only then do you get your 1st confirmation, with one more arriving roughly every 10 minutes, packing it ever tighter.",

  intuition: `
Take the "send and receive" you learned in Stage 1 and place it inside the network-wide picture of Stage 2: when you tap "send," you actually kick off a journey that takes anywhere from a few seconds to a few dozen minutes. This journey has no central authority processing it — it runs itself across a peer-to-peer net.

A transaction passes through five gates on its way from your fingertip to being "nailed onto the chain": first it's signed by your wallet, then broadcast to nodes across the network, then parked in each node's "pending pool," then packed into a block by a miner for its 1st confirmation, and after that it gains one more confirmation roughly every 10 minutes. Understand these five steps and you'll know exactly what "pending / 1 confirmation / 6 confirmations" in your wallet actually mean.

The demo on the right lets you advance step by step and watch the transaction pass through every stage with your own eyes.

**In this lesson we break a transaction's journey into five pieces:**

- **① Construction and signing — what your wallet does the moment you tap "send"**
- **② Broadcast — how the transaction spreads across the whole network in seconds**
- **③ Entering the mempool — each node independently verifies before queuing it**
- **④ Picked up by a miner — why yours gets its turn, and where the 1st confirmation comes from**
- **⑤ Confirmations stacking up — why large amounts wait for 6 blocks**
`,

  mechanics: `
### ① Construction and signing: what your wallet does the moment you tap "send"

All you see is filling in an address, an amount, and tapping send, but behind the scenes your wallet assembles a structured transaction:

- **Coin selection (inputs)**: from the unspent UTXOs sitting in your wallet, it picks enough to cover the payment and treats them as **inputs** (the UTXO model is detailed in Stage 4.1).
- **Writing outputs**: one output pays the recipient's address, and there's usually **a change output** returning the leftover to yourself.
- **Signing**: the wallet uses your **private key** to compute a digital signature over the whole transaction (Stage 3.2), proving "I really did authorize this, and not a single character has been altered." ⚠ Key point: **signing does not leak the private key; the private key never leaves your device**.
- Once signed, the transaction has a unique **txid** (the hash of its own contents) — that's the identifier you search for in a block explorer.

### ② Broadcast: how the transaction spreads across the whole network in seconds

Your wallet sends the signed transaction to the handful of **nodes** it's connected to:

- Each node, on receiving and verifying it, forwards it to its own neighbor nodes, who forward to their neighbors… this is called **gossip**.
- One tells ten, ten tell a hundred — it spreads exponentially: across the tens of thousands of nodes worldwide, everyone usually has it **within seconds**.
- Note: **no central server is "processing" this transaction**. This is the bedrock of its censorship resistance — there's no single shut-downable entry point.

### ③ Entering the mempool: each node independently verifies before queuing

A node doesn't forward blindly; it personally vets the transaction with **the same set of consensus rules** as everyone else (the foundation of consensus, Stage 2.4):

- Check what? **Whether the signature is valid**, **whether those UTXOs really haven't been spent** (anti-double-spend), whether the format is legal, and whether the fee clears the minimum threshold.
- If it passes, the node parks it in its own **mempool (pending pool)** to queue for miners; if it fails, the node discards it on the spot and forwards nothing — so an illegal transaction simply **can't spread**.
- The mempool **is not one globally unified queue**: each node keeps its own copy, and the contents differ slightly (network latency, differing local policies).
- The mempool has limited capacity (Bitcoin Core defaults to about **300 MB**). When the network is congested, **the lowest-fee transactions get evicted** — this is the fee auction of Stage 1 in action: the higher your sat/vByte, the less likely you are to get kicked and the sooner you're packed.

### ④ Picked up by a miner: why yours gets its turn, and where the 1st confirmation comes from

A miner has to pick a batch of transactions from the mempool and pack them into the block it's currently mining (about 1–2 MB, holding 2,000–3,000 transactions):

- Miners chase profit, so they **prioritize the high-fee (sat/vByte) ones**, stuffing the block close to its cap to maximize their fee income — which is why "pay more if you're in a hurry" really works.
- Whoever first mines a valid block (satisfying proof of work, Stage 2.3) broadcasts it onto the chain, and your transaction goes **into a block = 1st confirmation**.
- A block comes out on average **about every 10 minutes**, but this is the average of a Poisson process: sometimes two blocks land within 1 minute, sometimes none for 40 minutes — both are perfectly normal. So "how long until the 1st confirmation" is inherently variable.

### ⑤ Confirmations stacking up: why large amounts wait for 6 blocks

Being in a block still isn't a sure thing — **0 confirmations and 1 confirmation differ enormously in their level of safety**:

- **0 confirmations** (still in the mempool): in theory it can be replaced by a transaction spending the same inputs at a higher fee (RBF), or it might simply never get packed. Fine for accepting coffee money, absolutely not for accepting the price of a house.
- After that, every new block stacked on top adds 1 to the confirmation count. To overturn a transaction buried under N blocks, an attacker must **redo the work of those N blocks and overtake the whole network** (the "unchangeable" of Stage 2.1) — and the cost soars **exponentially with the confirmation count**.
- Industry convention: **1 confirmation is enough for small amounts, wait for 6 confirmations for large ones** (about 1 hour). The number 6 isn't magic — it's the empirical threshold where "the cost is so high no one would bother attacking" (Section 11 of the whitepaper has the probability math).
`,

  demo: "tx-journey",

  analogy: `
Mailing a **postcard stamped with your private wax seal but left unsealed**:

You write it and stamp it with the seal only you can press (signing) → hand it to the postal carriers around you, who run back and forth passing it along until soon every carrier in town knows of it (broadcast) → each carrier first checks your wax seal is genuine and confirms you didn't mail the same postcard twice (verification, entering the mempool) → until some carrier nails it onto the day's "bulletin-board block" (packed onto the chain) → and the bulletin board stacks higher day by day, with the deeper a notice sits, the less anyone can tear it out and rewrite it (confirmations stacking up).
`,

  misconceptions: [
    "“A transaction has to be sent to some central server to be processed.” — No. It's broadcast to the many nodes of a peer-to-peer network and spreads hop by hop via gossip; there is no central processor, and no shut-downable entry point.",
    "“It's irreversible the instant you send it.” — After sending, it first queues in the mempool; only once it's in a block do you get the 1st confirmation. At 0 confirmations it can in theory still be replaced by a same-input, higher-fee transaction (RBF).",
    "“Miners pack transactions on a first-come, first-served basis.” — They usually pack selectively by fee rate (sat/vByte), stuffing the block to maximize fee income, not by simple queue order (so if you're in a hurry, raise the fee).",
    "“Transactions are encrypted, so others can't see them.” — Transaction contents are publicly auditable (amounts and addresses are all visible); the signature only proves authorization and integrity, it doesn't hide the contents.",
    "“Once it's in the mempool it's sure to get packed.” — Not necessarily. When congested, transactions with too low a fee get pushed out of the mempool and can stay stuck for a long time or even vanish, needing a fee bump and rebroadcast or a CPFP/RBF rescue.",
  ],

  quiz: [
    {
      q: "What does the “signature” in a transaction do?",
      options: ["Encrypts and hides the amount", "Proves the payer really authorized it and the contents weren't tampered with", "Speeds up getting on-chain", "Hides the recipient's address"],
      answer: 1,
      explain: "A signature = proof of authorization, not encryption; the transaction contents themselves are public.",
    },
    {
      q: "After a transaction is broadcast, where does it go first?",
      options: ["Straight into a block", "Each node's pending pool (mempool), queued to be packed", "A central clearinghouse", "The recipient's wallet"],
      answer: 1,
      explain: "Into the mempool, gets verified, and only then is packed onto the chain by a miner.",
    },
    {
      q: "What does “the 1st confirmation” mean?",
      options: ["The wallet shows it as sent", "The transaction was packed into a block", "The other party tapped to receive", "The fee was deducted"],
      answer: 1,
      explain: "Into a block = 1 confirmation, and each new block after that adds one.",
    },
    {
      q: "What does each node do when it receives a transaction?",
      options: ["Forwards it unconditionally", "Independently verifies it with the same set of rules (signature, double-spend, format), accepting and forwarding it only if valid", "Charges a fee first", "Reports it to regulators"],
      answer: 1,
      explain: "Independent verification is the foundation of decentralization and consensus; an illegal transaction can't spread.",
    },
    {
      q: "When receiving a large payment, why does convention call for waiting about 6 confirmations?",
      options: ["Miners require it", "Each additional block stacked on top raises the cost of overturning it exponentially, and after 6 confirmations it's effectively nailed down", "You need 6 before you can spend it", "Only then is the fee refunded"],
      answer: 1,
      explain: "Overturning N confirmations means redoing those N blocks and overtaking the whole network; 6 confirmations (about 1 hour) is the empirical safety threshold.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Transaction (illustrated)", url: "https://learnmeabitcoin.com/beginners/guide/transaction/" },
    { label: "mempool.space: see a transaction's status in the mempool", url: "https://mempool.space/" },
  ],
};
