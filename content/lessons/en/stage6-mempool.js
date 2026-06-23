export default {
  id: "mempool-propagation",
  stage: 6,
  order: 3,
  title: "The Mempool and Block Propagation: How Transactions and Blocks Spread",
  difficulty: "core",
  prereqs: ["p2p-network", "tx-size-fees"],

  oneLiner:
    "After a transaction is broadcast, it enters each node's own “pending pool (mempool)” to wait, bidding by fee rate to be packed into a block; miners always pick the highest-fee-rate transactions to stuff into the limited block space. Once a new block is mined, it likewise spreads through the network at high speed, bringing everyone up to the latest height.",

  intuition: `
From the moment a transaction is "sent" to the moment it lands "on-chain," it lives in the **mempool (pending pool)**, waiting in line to be packed. Block space is **limited**, and miners always pick transactions **from highest fee rate to lowest** to stuff in until the block is full (callback to the fee-rate bidding of Stages 1 and 4) — so the mempool is essentially a **live auction**: the fee rate you offer is your bid.

Once a block is mined it must **spread at high speed** across the whole network so every node updates to the latest height. This lesson makes both "how transactions wait in line" and "how blocks propagate" crystal clear.

The demo on the right: a pool of transactions at different fee rates — watch which ones the miner stuffs into the next limited-size block.

**In this lesson we break "the mempool and block propagation" into four pieces:**

- **① What the mempool is — one pending pool per node**
- **② The fee-rate auction — how miners pick, and what the "minimum entry fee rate" means**
- **③ What to do when stuck — eviction, RBF, and CPFP fee bumping**
- **④ How blocks propagate — competing blocks, orphans, and compact blocks**
`,

  mechanics: `
### ① What the mempool is: one pending pool per node

The mempool (memory pool) is **a set of "verified, pending-confirmation" transactions that each node maintains in its own memory.**

- **It is not globally unified.** Different nodes receive transactions at different times and have slightly different configured policies (minimum fee rate, capacity cap), so **every node's mempool contents differ slightly**. What you see on mempool.space is just one particular node's view.
- **Verification comes before the pool.** For a transaction to enter a given node's mempool, it must first pass that node's full validation (signatures, no double-spend, a fee rate no lower than that node's floor…) — which is why every transaction in the mempool is "valid but not yet packed."
- **There is a default capacity cap** (Bitcoin Core defaults to about **300 MB**). Once it fills up, eviction kicks in (see ③).

### ② The fee-rate auction: how miners pick, and what the "minimum entry fee rate" means

When a miner builds a block, the goal is to **maximize fee revenue within limited space**, so it greedily stuffs in transactions **from highest fee rate (sats/vByte) to lowest**:

- Note that the sort is by **fee rate**, not **total fee**. A transaction with a high fee rate but small size may be more attractive than a bulkier one with a higher total fee — because it "earns more per unit of space" (the vByte concept is in Stage 4.4).
- Stuffing continues until the block (about **4 M weight units**, equivalent to several thousand transactions at full load) is full; the fee rate of the last transaction squeezed in becomes that block's **"minimum entry fee rate"**: bids above it get into this block, lower ones keep waiting for the next.
- So **fees soar when congested and crash to the floor when idle**: a market driven purely by supply and demand, with no one "setting the price."

### ③ What to do when stuck: eviction, RBF, and CPFP

What happens if you set your transaction's fee rate too low?

- **Eviction.** When the mempool is full and an incoming higher-fee transaction needs room, the node **discards the lowest-fee-rate transactions**. A transaction with too low a fee rate may go unconfirmed for a long time and eventually be squeezed out of most nodes' mempools (it looks like it "disappeared," but it never made it on-chain and can be re-sent).
- **RBF (Replace-By-Fee, BIP125):** rebuild a transaction with the **same inputs** but a **higher fee rate** to replace the still-unconfirmed one. Good for the payer to proactively speed things up when "I realized after sending that I underpaid."
- **CPFP (Child-Pays-For-Parent):** when you are the **recipient** and can't touch that low-fee transaction, you can **spend its output** to create a high-fee "child transaction." A miner wanting the child's high fee must **pack the parent transaction along with it** — so the child "pulls" the parent into confirmation.
- The distinction in one line: **RBF is the sender changing their own transaction; CPFP is anyone who can spend that output dragging it onto the train with a new transaction.**

### ④ How blocks propagate: competing blocks, orphans, and compact blocks

Once a block is mined it must also spread across the P2P network (callback to Stage 6.1), and **the faster the better** — because latency directly causes forks:

- **Near-simultaneous blocks → a temporary fork.** Two miners may each mine a valid block at nearly the same moment, and the network briefly shows two chains of equal length. Nodes **accept whichever they receive first**, until the next block appears and extends one of them.
- **Convergence on the chain with more work.** The network eventually unifies on the chain with the most cumulative work; the block on the other chain becomes an **orphan / stale block**, and its transactions (if not included in the new chain) fall back into the mempool to wait in line again (callback to Stages 2.4 and 5.4). The miner who mined a stale block wasted their electricity — so **reducing propagation latency has real monetary value to miners**.
- **Compact blocks (BIP152).** To minimize latency, nodes usually don't resend the whole block but only **the block header + a string of short transaction IDs**; because a neighbor's mempool most likely already holds those transactions, it can **reassemble the whole block almost instantly** locally, drastically saving bandwidth and time.
`,

  demo: "block-builder",

  analogy: `
The mempool is like a **departure lounge**, transactions are passengers waiting to board, and **the fee is the ticket price**. Each flight (block) has limited seats, so the ground crew invites **first class (high fee rate)** to board first, with economy tickets behind.

Passengers who paid too little may wait for the next flight, and the next, and when the lounge gets too crowded they may even be asked to leave (eviction). Want to cut the line? Just pay the difference to upgrade (an RBF fee bump).
`,

  misconceptions: [
    "“There is one unified mempool across the whole network.” — There isn't. The mempool is maintained by each node separately, and contents differ slightly.",
    "“A transaction will wait in the mempool until it confirms.” — Not necessarily. If the fee rate is too low and the pool is congested, it may be evicted, requiring a re-send or fee bump.",
    "“A block can hold an arbitrary number of transactions.” — It can't. Block space is limited, which is the very root of fee-rate bidding.",
    "“Miners pack transactions first-come, first-served.” — Usually they pick by fee rate, not by plain queue order.",
  ],

  quiz: [
    {
      q: "After a transaction is broadcast but before it's on-chain, where does it live?",
      options: ["In a miner's pocket", "In each node's own pending pool, the mempool", "In an exchange account", "In the block header"],
      answer: 1,
      explain: "It waits in the mempool for miners to pick it on merit.",
    },
    {
      q: "On what basis do miners stuff transactions into a limited block?",
      options: ["First come, first served", "Fee rate, from highest to lowest, until full", "Amount, from largest to smallest", "At random"],
      answer: 1,
      explain: "Highest fee rate first, so each block has a “minimum entry fee rate.”",
    },
    {
      q: "What can happen to a transaction with too low a fee rate?",
      options: ["It confirms instantly", "It stays unconfirmed for a long time, and may even be evicted when the mempool is congested", "Its fee is bumped automatically", "It is refunded"],
      answer: 1,
      explain: "You can re-send it or rescue it with an RBF/CPFP fee bump.",
    },
    {
      q: "What happens when two miners mine a block at nearly the same time?",
      options: ["Both are permanently valid", "A temporary fork; the network converges on the chain with more work, and the other becomes an orphan", "The network crashes", "The coins double"],
      answer: 1,
      explain: "Longest-chain convergence (callback to 2.4 / 5.4).",
    },
  ],

  further: [
    { label: "mempool.space: Watch the Mempool Live", url: "https://mempool.space/" },
    { label: "learnmeabitcoin: Mempool / Transaction Propagation", url: "https://learnmeabitcoin.com/beginners/guide/" },
  ],
};
