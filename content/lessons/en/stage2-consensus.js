export default {
  id: "consensus",
  stage: 2,
  order: 4,
  title: "Consensus: With No Boss, How Does Everyone Agree on One Ledger?",
  difficulty: "intro",
  prereqs: ["mining"],

  oneLiner:
    "Bitcoin has no headquarters and no administrator. The whole network reaches agreement through two simple rules: every node independently verifies everything using the same rules, and everyone always follows the chain with “the most accumulated work.” Everyone is equal before the rules, and a cheating block simply can't spread.",

  intuition: `
The most baffling question: **with no center, no voting, and no administrator, how do tens of thousands of mutually unknown nodes ever agree on "what the ledger looks like right now"?** The answer is surprisingly plain — two rules, plus a set of economic incentives that make cheating not worth it.

Rule one is "everyone verifies independently": every node holds an **identical rulebook** and personally checks every transaction and every block, trusting no one. Rule two is "follow the chain with the most accumulated work": should a brief fork occur, everyone automatically converges on the chain with the most electricity burned behind it. Together these two are the famous **Nakamoto consensus** — and its essence is: **truth doesn't rest on authority, but on "whose chain has piled up the most real hashpower."**

The demo on the right lets you play a node: blocks or transactions come in, and you judge by the rules whether to "accept or reject."

**In this lesson we break consensus into four pieces:**

- **① Rule one: everyone verifies independently and trusts no one**
- **② Rule two: follow the chain with the most accumulated work**
- **③ How a fork converges on its own — the full life of an orphan block**
- **④ Why consensus is stable — rules, incentives, and the "constitution" you can't change**
`,

  mechanics: `
### ① Rule one: everyone verifies independently and trusts no one

The first pillar of consensus is that **every node keeps a full copy of the ledger and personally checks everything using the exact same rules**:

- Check what? **Whether the signature is valid**, **whether there's a double-spend** (is the spent UTXO still in the set?), **whether the block reward is excessive**, **whether there's enough work** (is the block header hash < target?), whether the format and scripts are legal… an entire suite of hundreds of rules.
- **Anything non-compliant gets rejected by the node and not relayed** — so a rule-breaking transaction or block simply can't spread, and never even gets the chance to enter anyone else's mempool.
- Key corollary: **nodes have the final say, not miners.** Even if a miner mines a block that "pays itself extra coins," nodes across the network will **reject it in unison**, and that hashpower is burned for nothing. This nails the issuance rules firmly into the hands of users.

### ② Rule two: follow the chain with the most accumulated work

The second pillar handles "two nodes see different chains — who do you believe?":

- **"The longest chain" is a common but imprecise phrasing; the accurate term is "the chain with the most accumulated work"**: what's compared isn't the number of blocks, but the **sum of difficulty** behind the chain (how much hashpower was burned in total).
- A counterintuitive example: a chain of 100 low-difficulty blocks may have **less** work than another chain of 99 high-difficulty blocks — and the latter is the valid one.
- For an attacker to make their fake chain win, they'd have to catch up to and surpass the whole network in **accumulated work** — exactly the 51% problem from the last lesson: it's not about who has more blocks, but about who burned more electricity.

### ③ How a fork converges on its own: the full life of an orphan block

Occasionally two miners produce a valid block at **nearly the same time** (say both at height 840,000), and the network briefly splits into two equally long chains. Watch how nodes flatten this out without holding a meeting:

- **Step 1**: nodes geographically near A receive A's block first and take it as the chain tip; those near B receive B's first. The whole network temporarily splits into two camps, neither of them wrong.
- **Step 2**: everyone keeps mining on the chain tip they saw. Suppose some miner mines the next block **on top of A** first — A's chain instantly overtakes in accumulated work.
- **Step 3**: the moment this longer chain is broadcast, the nodes that had been following B **switch over** to chain A per rule two; B's block is abandoned and becomes an **orphan (stale block)**, and the transactions inside it return to the mempool to be repacked.
- Result: usually within **a block or two**, the whole network reconverges on a single chain. This is also why 0 confirmations are unsafe and you should wait a few confirmations — a freshly added block carries a small chance of being swapped out by exactly this kind of **reorg**.

### ④ Why consensus is stable: rules, incentives, and the "constitution" you can't change

Stack three things together and you have the complete Nakamoto consensus:

- **The software rules are the "constitution."** Whether a transaction is legal or a block compliant is decided by **the same set of consensus rules run by all nodes**. This is also why changing Bitcoin's rules is extremely hard — you'd have to get the vast majority of the whole network to **voluntarily** upgrade to the same new rules (forks and BIPs, Stage 6); no one can force it through.
- **Trustless ≠ verification-free.** People often misread it as "Bitcoin needs no trust, so there's no need to check." Quite the opposite: **precisely because every node meticulously verifies for itself, you don't need to trust any particular person.** Trust is replaced by "rules anyone can independently check."
- **Incentives make honesty the most profitable.** Producing a block burns electricity first, and the reward you mine has value only if the whole network accepts it. Submitting a rule-breaking block just gets it rejected on the spot, electricity down the drain; even a successful 51% attack would crash the price and depreciate your own rigs and coin holdings along with it (Stages 5.4 and 9.4 work out the math). **Honesty is a Nash equilibrium, not merely a moral choice.**
`,

  demo: "node-validator",

  analogy: `
Imagine a competition with no head referee but **tens of thousands of independent referees**, each holding an **identical rulebook**. For any foul, every referee can blow the whistle on their own by the book, so cheating can't slip through.

And when a dispute arises (a fork), they have a simple agreement: **recognize the record that has accumulated the thickest, with the most work behind it.** No meetings or votes needed — the rules plus the work pull everyone to the same conclusion on their own.
`,

  misconceptions: [
    "“Someone or some committee must call the shots on which chain is right.” — No one does. The rules are written into every node's software, the chain with the most accumulated work automatically wins, and no vote or authority is required.",
    "“Trustless = no verification needed.” — Backwards. It's precisely because everyone verifies strictly that you don't need to trust any particular party; verification is the prerequisite for being trustless.",
    "“The longest chain is the one with the most blocks.” — More accurately it's the chain with the most accumulated work (the sum of difficulty). A chain with many low-difficulty blocks can lose to one with fewer high-difficulty blocks.",
    "“Miners have the final say — they can decide the rules.” — No. It's the users running nodes who enforce the rules; a rule-breaking block a miner mines is rejected in unison by nodes across the network, and the hashpower is burned for nothing.",
    "“With 51% of the hashpower you can do anything — conjure coins out of thin air or steal them.” — You can't. You can reorder or censor transactions (a reorg), but you can't change the issuance rules and can't steal coins whose private keys you don't have.",
  ],

  quiz: [
    {
      q: "What does Bitcoin use to decide “which chain is valid”?",
      options: ["A developer vote", "Following the chain with the most accumulated work", "The chain that appeared first", "An exchange announcement"],
      answer: 1,
      explain: "Nakamoto consensus: the longest (most-work) chain wins, no authority needed.",
    },
    {
      q: "What does “trustless” really mean?",
      options: ["No need to verify anything", "Because everyone verifies independently, you don't need to trust any particular party", "Bitcoin is insecure", "Trust only the developers"],
      answer: 1,
      explain: "Verification is the prerequisite for being trustless, not its opposite.",
    },
    {
      q: "What happens to a non-compliant block with an excessive reward or a double-spend?",
      options: ["It's rejected independently by nodes across the network and can't spread", "It's automatically recorded in the ledger", "A committee reviews it", "It passes after paying a fine"],
      answer: 0,
      explain: "Every node vetoes it independently by the same rules, so a non-compliant block gets nowhere.",
    },
    {
      q: "Why do miners tend to produce blocks honestly?",
      options: ["The law forces them to", "A non-compliant block gets rejected and the burned electricity is wasted, so honesty pays best", "Purely out of morality", "No reason"],
      answer: 1,
      explain: "Economic incentives make honesty the optimal strategy.",
    },
    {
      q: "When two miners produce a block at nearly the same time and cause a brief fork, how does the network converge?",
      options: ["They hold a vote to decide", "Everyone keeps mining on their own chain tip; whoever gets a new block attached first and overtakes in accumulated work is followed, and the other block becomes an orphan", "Two chains persist forever", "The largest pool dictates it"],
      answer: 1,
      explain: "Usually within a block or two it converges on the chain with the most accumulated work; the losing block becomes an orphan and its transactions return to the mempool.",
    },
  ],

  further: [
    { label: "Bitcoin Whitepaper · Sections 4, 5, 11 (PoW, Network, Attack Probability)", url: "https://bitcoin.org/bitcoin.pdf" },
    { label: "learnmeabitcoin: Beginner's guide", url: "https://learnmeabitcoin.com/beginners/" },
  ],
};
