export default {
  id: "mining-pools",
  stage: 5,
  order: 3,
  title: "Mining Pools: Pooling Lottery Tickets into a Steady Paycheck",
  difficulty: "core",
  prereqs: ["difficulty"],

  oneLiner:
    "Mining solo is like one person buying lottery tickets: in theory there's 3.125 BTC per block, but you might not hit one for years. A mining pool lets thousands of miners mine together and split the reward in proportion to the hashrate each contributes — trading wildly swinging luck for predictable, steady income at the cost of a small fee. The price is that hashrate concentrates into a few pools.",

  intuition: `
The whole network produces only one block every 10 minutes, and the reward goes only to the single winner. If you hold just one ten-thousandth of the network's hashrate, you'd **wait many years on average** to mine a block on your own — your expected return is unchanged, but the cash flow is wildly unstable, like a lottery.

A **mining pool** is exactly what solves this "luck variance": thousands of miners **pool their hashrate together** to mine, and when the pool finds a block it **splits the reward in proportion to each person's hashrate share**; a miner proves they're truly working by submitting "shares" — hashes that meet a difficulty far lower than the whole network's — and gets paid accordingly.

So your income goes from "a big jackpot once every few years" to "a steady paycheck of a little each day." **The expected return is basically unchanged, but the variance is smoothed out.** The price is a small fee to the pool, and — hashrate starting to concentrate into a few large pools (which bears on the next lesson's security).

The right side simulates "going solo vs joining a pool": with the same hashrate share, see how different the income looks.

**In this lesson we break "mining pools" into four pieces:**

- **① Why going solo is like buying lottery tickets — where the variance comes from**
- **② The share mechanism — proving effort proportionally with low-difficulty hashes**
- **③ Settlement methods and fees — who bears the risk under PPS vs PPLNS**
- **④ The centralization concern and Stratum V2 — returning the packaging power to miners**
`,

  mechanics: `
### ① Why going solo is like buying lottery tickets: where the variance comes from

A mining hit is a **Poisson process**: every hash is an independent, extremely-low-probability draw, completely unrelated to how many times you've tried before (there's no "my turn is coming soon").

- Suppose you hold a share \`p\` of the network's hashrate. On average you hit a block once every \`1/p\` blocks — if \`p\` = one ten-thousandth, that's once every 10,000 blocks (about 70 days) on average, and this is only the **average**: in reality you could go through a drought of hundreds of days in a row.
- The key point: the expected return is determined by \`p\`, **regardless of whether you go solo or join up**; but going solo, the **variance** of income is enormous — it's either 0 or a whole block reward, with nothing in between.
- A pool doesn't change \`p\` (doesn't change the long-run expectation); it merely spreads "all or nothing" into "a little each day," **cutting the variance**. This is exactly the essential value of insurance and cooperation.

### ② The share mechanism: proving effort proportionally with low-difficulty hashes

How does a pool know how much effort you put in and how much to pay you? Through **shares**:

- The pool sets a **share difficulty**, far below the network difficulty (say, a few thousand times lower). Every time you find a hash meeting the share difficulty, you submit a share.
- A share proves you're **really hashing against the correct work template** — find no shares and you get no pay; find shares but never reach network difficulty and you still don't lose out, because your effort is faithfully recorded.
- In a rare case, some share happens to **also meet the network difficulty** — it's a real block, the pool collects the full block reward, and then splits it among everyone by their share counts.
- An intuition: the share difficulty only affects "statistical precision" (how often you report effort), not the long-run distribution ratio.

### ③ Settlement methods and fees: who bears the luck risk

There are several schemes for how a pool converts the block reward into your paycheck, and the core difference is **who bears the luck risk**:

- **PPS (Pay Per Share)**: for every share you submit, the pool immediately pays you a fixed amount at its theoretical value, **regardless of whether the pool actually found a block lately**. The luck risk is borne entirely by the pool, so PPS fees are usually higher.
- **PPLNS (Pay Per Last N Shares)**: payouts happen only when the pool actually finds a block, computed by your share of the "last N shares." The luck risk is shared among miners, the fee is lower, but short-term income still fluctuates.
- **Fees**: the pool takes anywhere from 1% to 3% as compensation for providing the "stability service" and bearing the risk. This is the insurance premium you pay for "trading the lottery for a paycheck."

### ④ The centralization concern and Stratum V2

- **The centralization concern**: a few large pools command a very large share of the network's hashrate. Two things must be distinguished — **hashrate belongs to the miners** (an individual miner can switch pools at any time), but **the decision of "which transactions to include" has traditionally belonged to the pool**. The latter is the real risk point: if a pool approaches half the network's hashrate for a sustained period, it gains the ability to censor transactions and even mount a 51% attack (next lesson).
- **Stratum V2**: a new-generation pool protocol whose most important improvement is "Job Negotiation," letting **an individual miner decide for themselves which transactions to include**, while the pool only handles settling the paycheck. This returns the transaction-selection power from the pool to thousands of miners, **weakening the harm of centralization without sacrificing steady income** — and it's the main direction for mitigating pool centralization today.
`,

  demo: "variance",

  analogy: `
Mining solo is like **one person buying lottery tickets**: an occasional big jackpot, but most days nothing at all, and no way to make a living off it.

A mining pool is like **a group of coworkers chipping in to buy together and splitting any winnings**: the thrill of a single ticket hitting is gone, but every drawing you reliably get a little. The number of tickets you buy (your hashrate) hasn't changed and the long-run return is about the same; all that changes is — you no longer have to endure the long "drought."
`,

  misconceptions: [
    "“Joining a pool raises your total return.” — The long-run expectation is basically unchanged (and you even pay a fee); what a pool lowers is the variance of income, not the expectation.",
    "“The pool owns the miners' coins or hashrate.” — The pool handles assigning work and settling pay, but a miner can switch pools at any time; it doesn't hold your coins.",
    "“A pool share is also a valid block.” — It is not. A share is a lower-difficulty “proof of work” used only to prove contribution to the pool; only the very few shares that also reach network difficulty become real blocks.",
    "“Pool centralization doesn't affect security.” — It does. The real risk point is the pool holding the ‘transaction-packaging power’; if one pool approaches half the network's hashrate for a sustained period, it raises censorship and 51% concerns (Stratum V2 tries to return the packaging power to miners).",
    "“The longer the drought, the sooner the hit.” — No. Mining is a memoryless Poisson process; every hash is independent, and past failures don't raise the next one's hit probability.",
  ],

  quiz: [
    {
      q: "Why do miners join a pool, mainly?",
      options: ["To raise the long-run expected return", "To lower income variance, turning the “lottery” into a steady paycheck", "To avoid paying fees", "To gain more hashrate out of thin air"],
      answer: 1,
      explain: "Expectation unchanged, variance greatly reduced — the value of cooperation and insurance.",
    },
    {
      q: "What is a “share” in a mining pool?",
      options: ["A valid block", "A hash meeting a lower “share difficulty,” used to prove you're working hard at mining", "A kind of token", "Your private key"],
      answer: 1,
      explain: "Real block rewards are distributed in proportion to the shares submitted.",
    },
    {
      q: "Regarding pool centralization, which is correct?",
      options: ["There's no risk at all", "If one pool approaches half the network's hashrate, it raises censorship and 51% concerns", "The pool owns the miners' coins", "Centralization raises returns"],
      answer: 1,
      explain: "Excessive hashrate concentration is a real security and decentralization concern.",
    },
    {
      q: "What characterizes mining solo compared to a pool?",
      options: ["Higher returns", "Income is wildly variable and you may not hit for a long time, but the long-run expectation is similar", "More secure", "No hashrate needed"],
      answer: 1,
      explain: "Similar expectation, but enormous variance, like buying lottery tickets.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Mining pools", url: "https://learnmeabitcoin.com/technical/mining/" },
    { label: "Wikipedia: Mining pool", url: "https://en.wikipedia.org/wiki/Mining_pool" },
  ],
};
