export default {
  id: "security-budget",
  stage: 9,
  order: 5,
  title: "The Security Budget: When the Subsidy Is Gone, Can Fees Secure Bitcoin?",
  difficulty: 3,
  prereqs: ["halving", "game-theory"],

  oneLiner:
    "Bitcoin's security has a price tag, called the “security budget”: it equals the miner's total revenue per block = the block subsidy (newly minted coins) + all the transaction fees, measured in fiat. The bigger this pot, the more expensive a 51% attack becomes. The catch: the subsidy halves every four years and approaches zero around 2140 — so by then, can fees alone keep this moat full? It is Bitcoin's most-debated long-term open question.",

  intuition: `
Why is Bitcoin "unattackable"? Earlier (Stage 9.4) we did the math: launching a 51% attack means continuously burning a fortune in hash power, and hash power is bought with **real money** and fed with **real electricity**. Miners are willing to spend all that on mining because every block carries a **reward**. Now flip it around — **how much a miner earns per block decides how much an attacker must spend to out-hash the whole network.**

This "miner's total revenue per block" is Bitcoin's **security budget**. It's not some field written into the code, but an economic quantity: **the block subsidy + all the fees in that block**, multiplied by the price at the time and converted into fiat. The bigger the budget, the wider the moat; the smaller it gets, the cheaper an attack becomes.

And this moat has a **leak**: the subsidy halves every 210,000 blocks (~4 years) (Stage 2.5), approaching zero around 2140. Of its two pillars, the "subsidy" one is destined to crumble — so on that day, **the entire weight has to rest on the "fees" pillar.** Can it hold?

Drag the halving era, the fees, and the price on the right and watch this budget rise and fall in real time.

**In this lesson we break the security budget into four pieces:**

- **① What the security budget is — how total revenue becomes a moat**
- **② The subsidy is destined for zero — a geometric decay toward 2140**
- **③ Is it dangerous now, and the real worry for the future — are fees “big” and “stable” enough**
- **④ How Bitcoin might cope — value growth, the settlement layer, and the rejected escape hatch**
`,

  mechanics: `
### ① What the security budget is: how total revenue becomes a moat

First, let's nail down the definition of "security budget":

- **Security budget = the miner's total revenue per block = the block subsidy (newly minted coins) + all the transaction fees in that block.** This is precisely the lump sum the coinbase transaction (Stage 5.5) pays the miner.
- The key is to view it **in fiat value**, not just the BTC count. For example, in 2026 a subsidy of 3.125 BTC + roughly 0.3 BTC in fees ≈ 3.4 BTC; at a price of \\$100k, the per-block budget is about **\\$340k**; with ~144 blocks a day network-wide, that's about **\\$49M per day** and roughly **\\$18B per year** of "security spending."
- **Why is this money the same as security?** A miner's total revenue determines how lucrative mining is as a business, which in turn sets the network's total hash power (mining, Stage 2.3). To launch a 51% attack you must amass **more than half** the network's hash power, and that hash power is "fed" by this budget — so the cost to attack scales roughly **in proportion to miner revenue** (51% attack, Stage 5.4). Double the budget and an attack is roughly twice as expensive.
- In one line: **security budget ≈ total miner revenue ≈ the price of a ticket to attack the chain.** This is Bitcoin's economic moat, and it's the flip side of Stage 9.4's "make an attack economically irrational" — 9.4 covers "an attacker's own hash power devalues," while this lesson covers "how much you must burn just to sustain the attacking hash power."

### ② The subsidy is destined for zero: a geometric decay toward 2140

Of the two pillars, the subsidy's fate is **hard-coded**:

- The subsidy halves every 210,000 blocks (~4 years) (Stage 2.5): 50 (2009) → 25 → 12.5 → 6.25 → **3.125 (from 2024)** → 1.5625 (2028) → 0.78125 → … cut all the way down to near zero around **2140**.
- This is a **geometric decay**: 50 + 25 + 12.5 + … this infinite series converges to 21 million, which is exactly where the hard supply cap comes from. In other words, the "subsidy" pillar has been **actively shrinking** since day one, and the speed and direction of that shrinkage are in no doubt whatsoever.
- **The real ratio today (2026)**: in the vast majority of blocks, **the subsidy still dwarfs the fees** — fees are usually only a small slice of total miner revenue (most of the time single digits to a fifth or so). Only when the chain hits a **congestion spike** do fees surge: a classic example is the 2023–2024 **Ordinals / inscription** waves, which several times pushed per-block fees to levels that even **exceeded the subsidy** — but that's a **peak**, not the norm.
- So the trend is clear: the subsidy pillar shortens notch by notch, and **fees must sooner or later take over** as the main support. The question isn't "whether," but "can they catch it."

### ③ Is it dangerous now, and the real worry for the future

Separate the time scales and the conclusions are very different:

- **Short term (now): low risk.** The subsidy is still the bulk, and **long-run price appreciation** offsets the halving. This is the crucial subtlety: the budget is measured in **fiat value**, so even if the subsidy's BTC count is cut in half, as long as the price climbs enough over four years, **the budget in dollars can actually rise rather than fall.** Across past halvings, hash rate has repeatedly hit new highs precisely because this hedge was at work.
- **Long term (subsidy → 0): this is the real open question.** Once the subsidy pillar reaches zero, the security budget is **fees alone**. The core interrogation then comes down to two words — "**big**" and "**stable**":
  - **Big enough?** If, over some stretch, total fees are too low, the security budget shrinks, the attack ticket gets cheaper with it, and the chain's security is directly discounted.
  - **Stable enough?** This is the subtler trouble. Fees are **lumpy — spiky, coming in bursts.** Academic work (e.g., Carlsten et al.) argues that when block revenue comes **mostly from fees** rather than a steady subsidy, mining incentives become **unstable** — it can induce "**fee-sniping**," selfish mining, and the like: rather than mining honestly forward, you'd rather **reorg** that one fee-fat block and grab the fees for yourself. The subsidy acts like a "base salary" that smooths income; with the base salary gone and only "commission" left, miner behavior becomes harder to predict.
- **One more tension: will Layer 2 "drain away" the fees?** Layer 2s like the Lightning Network (Stage 8.3) move large volumes of small payments off-chain, **reducing on-chain transactions**, which over the long run may **depress on-chain fee demand.** This creates a genuine dilemma: **off-chain scaling** makes Bitcoin more usable, yet may **weaken on-chain fees as the future's pillar of security.** There's a real trade-off here.

### ④ How Bitcoin might cope: value growth, the settlement layer, and the rejected escape hatch

This is an **unsettled** question, but on Bitcoin's side there are a few overlapping lines of response:

- **(a) Value growth offsets the shrinkage.** As long as Bitcoin's **total market cap / price** trends higher over the long run, then even with the subsidy gone and the fees' BTC count limited, their **fiat value** may still uphold a sizable budget. Ultimately the security budget is about dollars, not sats.
- **(b) Scarce block space + a settlement-layer role → a real fee market.** Each block's capacity is hard-capped at **4 million weight units** (roughly a 4MB ceiling, typically 1–2MB in practice), making block space inherently scarce. If Bitcoin plays the long game as a **high-value settlement layer** — carrying large settlements, inter-institutional clearing, and the opens/closes of Layer-2 channels (Stage 8.3) — then competition for that scarce space can on its own sustain a **persistent fee market.** The scarcer the blocks and the more real the demand, the better-supported the fees.
- **(c) It's a decades-long gradual transition.** The subsidy doesn't vanish one day; it **halves every four years, slowly approaching zero**, a transition spanning more than a century. That gives the protocol, the market, and the Layer-2 ecosystem **ample time to adapt and iterate** — not a deadline due tomorrow.
- **The rejected escape hatch: tail emission.** In theory, Bitcoin could copy **Monero** and add a **small perpetual issuance** to pay miners a "base salary," solving the security-budget problem once and for all. But this path is **almost entirely rejected** in the Bitcoin community — because the **21-million hard cap is near-sacrosanct**, the bedrock of Bitcoin's "verifiable absolute scarcity" value proposition (Stage 2.5 / 9.4). Touch it, and you've touched the very thing that makes Bitcoin Bitcoin. So the community is **betting on fees.**
- **Be clear-eyed, but don't panic.** This is not a "solved" problem, nor an "inevitable collapse" doomsday. It's a **real, long-term, not-yet-closed open question** — worth taking seriously, but with no sign today that the risk will materialize anytime soon.
`,

  demo: "security-budget",

  analogy: `
Think of Bitcoin's security as a castle's **garrison budget.** Each year this budget is pooled from two sources: coins the king newly mints from the mine (the **subsidy**), and the **tolls** paid by passing merchants (the fees). The fuller the budget, the larger the garrison, and the more an attacker must spend to storm the walls.

But this castle has an ancestral rule: the newly minted coins halve every four years, and **one day the mine runs dry.** From then on, the money that feeds the entire garrison has to come **entirely from the tolls.**

So the whole city is betting on one question: once the minting ends, will **this trade route still be busy enough, and the tolls still large and steady enough**, to pay for the guards holding the walls? No one can promise — but the townsfolk would rather bet on it than break the founding rule that "the total coin count is never inflated."
`,

  misconceptions: [
    "“A miner's revenue is only the block subsidy.” — Wrong. The security budget = subsidy + all the fees in that block, both going to the miner; once the subsidy hits zero, fees will be the whole of it.",
    "“The moment the subsidy hits zero, mining stops and Bitcoin is finished.” — Not necessarily. As long as fees are big enough and stable enough, they can take over and sustain the hash power — this is the heart of the debate, not a settled outcome.",
    "“The security budget is only about how much BTC is mined.” — No. What actually matters is its fiat value. Long-run price appreciation can offset the halving of the subsidy, so the budget in dollars need not fall with each halving.",
    "“Bitcoin will solve this by adding ‘tail emission.’” — Extremely unlikely. The 21-million hard cap is near-sacrosanct, the bedrock of its value proposition; the community is betting on fees, not on new issuance.",
    "“Fees will surely make up the difference, no need to worry.” — No one can guarantee it. This is a real open question: fees may not be big enough, or may be too unstable (spiky fees can distort mining incentives). One shouldn't panic, nor dismiss it.",
  ],

  quiz: [
    {
      q: "What does Bitcoin's “security budget” refer to?",
      options: ["The number of nodes on the network", "The miner's total revenue per block = block subsidy + all fees (measured in fiat)", "The total supply of 21 million", "The total reserves held by exchanges"],
      answer: 1,
      explain: "It equals the total the coinbase pays the miner, viewed in fiat value; the bigger this pot, the more expensive a 51% attack (callback 5.4 / 5.5).",
    },
    {
      q: "As halvings continue, what is the core long-term worry about the security budget?",
      options: ["The subsidy keeps growing", "Nodes keep disappearing", "Once the subsidy hits zero, whether fees alone can provide a “big” and “stable” enough budget", "Blocks keep getting larger"],
      answer: 2,
      explain: "The subsidy reaches zero around 2140 and all the weight rests on fees; fees may be too small or too unstable (callback 2.5).",
    },
    {
      q: "Why does “price appreciation” relieve the pressure from a halving in the short term?",
      options: ["Because it increases the total supply of BTC", "Because the budget is measured in fiat value, so a rising price offsets the falling BTC count of the subsidy", "Because it lowers the electricity bill", "Because it speeds up block production"],
      answer: 1,
      explain: "The budget is about dollars, not sats, so a large enough rally can make the dollar budget rise rather than fall.",
    },
    {
      q: "Which of the following will Bitcoin almost certainly NOT adopt to solve the security-budget problem?",
      options: ["Letting scarce block space sustain a fee market", "Relying on Bitcoin's long-term value growth to offset it", "Adding a perpetual tail emission like Monero's", "Positioning itself as a high-value settlement layer"],
      answer: 2,
      explain: "Tail emission would break the 21-million hard cap — a near-sacrosanct red line the community is loath to touch (callback 2.5).",
    },
  ],

  further: [
    { label: "Bitcoin Whitepaper · Section 6 (Incentive)", url: "https://bitcoin.org/bitcoin.pdf" },
    { label: "Carlsten et al.: On the Instability of Bitcoin Without the Block Reward", url: "https://www.cs.princeton.edu/~arvindn/publications/mining_CCS.pdf" },
    { label: "Lyn Alden: Bitcoin's Security Budget (overview)", url: "https://www.lynalden.com/bitcoin-security-budget/" },
  ],
};
