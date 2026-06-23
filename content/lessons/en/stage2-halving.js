export default {
  id: "halving",
  stage: 2,
  order: 5,
  title: "21 Million and the Halving: Monetary Policy Written into Code",
  difficulty: "intro",
  prereqs: ["mining", "fiat-problems"],

  oneLiner:
    "Bitcoin's total supply is permanently locked at about 21 million coins. New coins are issued only through the block reward, and that reward “halves” roughly every four years — issuance slows down more and more, ultimately approaching but never breaking through 21 million. This is the radical, root-and-branch answer to Stage 0's “fiat can be printed without limit.”",

  intuition: `
Back to the original problem: fiat's fatal flaw is that **it can be issued without limit**, diluting your purchasing power. Bitcoin's answer is simple and extreme — **write the issuance schedule into code no one can change**, rather than entrusting it to some issuer who will be tempted.

Its move has three layers: there is **only one** faucet (the miner's block reward), this reward **halves** roughly every four years, and all the phases added together converge on a hard cap of about **21 million coins**. So the supply growth rate slows more and more, and the total forever approaches but never breaks through the ceiling. This is the root-and-branch answer to Stage 0's "fiat can be printed without limit."

Drag the slider on the right to walk through the halving steps and watch the block reward get cut in half while the total supply approaches 21 million.

**In this lesson we break "21 million and the halving" into four pieces:**

- **① The issuance mechanism — where new coins come from, the one and only faucet**
- **② The halving steps — how the reward gets cut in half, and which step we're on now**
- **③ Why 21 million — how a geometric series converges to a hard cap**
- **④ Why this rule is unchangeable and matters — verifiable scarcity**
`,

  mechanics: `
### ① The issuance mechanism: where new coins come from

Bitcoin has no "printing press," only one **sole faucet** for issuance:

- New coins are produced **only** through the **first coinbase transaction** in each block, paid to the miner together with that block's fees (Stage 5.5). Apart from this, there is no other way to conjure bitcoins from nothing.
- The block reward amount is a **hard-coded consensus rule**: if a miner pays itself even 1 extra satoshi, nodes across the network will **reject the block in unison** (Stage 2.4). The issuance power is held firmly in the hands of the users running nodes.
- A block comes out on average about every 10 minutes (the difficulty adjustment of Stage 2.3 guarantees the rhythm), so new coins trickle into circulation at a **predictable, verifiable** rate.

### ② The halving steps: how the reward gets cut in half, and which step we're on now

The block reward isn't constant; it **halves** every **210,000 blocks** mined (210,000 × 10 minutes ≈ **4 years**):

- 50 (2009) → 25 (2012) → 12.5 (2016) → 6.25 (2020) → **3.125 (2024)** → 1.5625 (around 2028)…
- We're now in the **3.125 BTC/block** phase, after the fourth halving in 2024.
- There will be **33 halvings** in all: after the 33rd, the reward drops below 1 satoshi, is rounded down to zero, and the issuance of new coins ends, at roughly the year **2140**.
- Note that the halving is a hard rule triggered **by block height**, not by the calendar — because block times fluctuate, the actual date of each halving drifts by a few weeks either way.

### ③ Why 21 million: how a geometric series converges to a hard cap

"21 million" isn't an arbitrarily chosen round number — it's the **sum** of that sequence above:

- The new coins issued in each phase = 210,000 blocks × the reward of that period. Phase 1 issued 210,000 × 50 = **10.5 million** (exactly half of the total); phase 2 issued 210,000 × 25 = 5.25 million (half of what remained)…
- This is a **geometric series** with a common ratio of ½: 10.5M + 5.25M + 2.625M + … = 10.5M × (1 + ½ + ¼ + …) = 10.5M × 2 = **21 million**.
- The beauty of a geometric series: each time you only cut off half, so it **forever approaches 21 million yet never reaches it, much less exceeds it**. This is the mathematical origin of the "hard cap."
- **Easter egg: the actual amount is slightly under 21 million.** Because the reward is rounded down to zero in whole satoshis at each step (some phases don't divide evenly), the final cap comes out **slightly below** 21,000,000 (about 20,999,999.97 BTC). The difference is tiny, so by convention we still say 21 million.

### ④ Why this rule is unchangeable and matters

Writing the hard cap into code and "trusting the central bank not to print extra" are **two completely different things**:

- **Scarcity is "verifiable."** Anyone running a full node can check for themselves that the issuance rules are strictly enforced block by block — there's no possibility of secret over-issuance. You don't need to trust anyone's promise.
- **Changing it amounts to self-dilution and is nearly impossible to pull off.** Raising the cap would require the vast majority of the network's nodes to **voluntarily** upgrade and accept it — which would dilute every holder's share, so no one has the incentive to agree (forks, Stage 6). The rule's "unchangeability" comes precisely from everyone's shared self-interest.
- **The halving and the "digital gold" narrative.** Viewed through Stage 0's "stock-to-flow ratio": each halving cuts the flow in half, doubling the stock-to-flow ratio, making Bitcoin ever "harder." This is like taking gold's scarcity and pushing it, via code, to an extreme that's also certain.
- **What sustains miners after issuance ends?** As the block subsidy approaches zero, miner income will come **entirely from transaction fees**. The long-term sustainability of this incentive is an open question still under discussion (touched on again in Stages 5 and 8).
- **A unit reminder:** 1 BTC = 100,000,000 satoshis. Even when the price is very high, you can transact in tiny "sats" — 21 million coins split into 2.1 × 10¹⁵ sats, so there's no way it'll be "not enough to go around."
`,

  demo: "halving-supply",

  analogy: `
Imagine a gold mine where **the boss (the code) has laid down an unchangeable house rule**: for the first four years, you're allowed to dig 50 baskets of gold a day; after every four years, the daily quota is **automatically halved** — 25 baskets, 12.5, 6.25…

No matter how high the gold price goes or how many people want to dig, the quota only shrinks, never grows, and the total was capped long ago. The mine gets harder to extract from over time, and no one can ask the boss to "bend the rules and issue a bit more" — because the "boss" is a hard-coded house rule that the whole village is watching to enforce.
`,

  misconceptions: [
    "“21 million is far too few to serve the whole world.” — Each coin divides into 100 million sats, plenty of granularity; when the price is high you just price things in sats, so “not enough to go around” is an illusion.",
    "“Developers can change the supply cap or the halving rule whenever they want.” — Changing it would require the vast majority of the network's nodes to voluntarily accept it, which amounts to self-dilution and is nearly impossible to achieve; that's exactly why it's credible.",
    "“As soon as a halving hits, the price must skyrocket.” — A halving only guarantees the supply growth rate is cut in half; the price is set by the market, with no guarantee whatsoever. Conflating the mechanism with a price prediction is a common mistake.",
    "“Once the miner reward hits zero, Bitcoin grinds to a halt.” — It won't. By then miners sustain themselves on fees; the long-term economics are an open question, but the network doesn't stop running just because the subsidy ends.",
  ],

  quiz: [
    {
      q: "How are new bitcoins issued?",
      options: ["A central bank issues them periodically", "Only through the miner's block reward, halving roughly every 4 years", "Generated when users deposit funds", "Auto-issued in step with transaction volume"],
      answer: 1,
      explain: "The only issuance channel is the block reward, which decreases on the halving schedule, with the total capped at about 21 million.",
    },
    {
      q: "What exactly does the “halving” cut?",
      options: ["The coin's price", "The block reward a miner gets per block", "Transaction fees", "Block size"],
      answer: 1,
      explain: "Every 210,000 blocks, the block reward is cut in half: 50→25→12.5→…",
    },
    {
      q: "Why is this the answer to “fiat can be printed without limit”?",
      options: ["Because Bitcoin is more expensive", "Because the issuance schedule is written into code that no one can change and anyone can verify", "Because it has government backing", "Because no one uses fiat anymore"],
      answer: 1,
      explain: "Scarcity is guaranteed by code and network-wide verification, not by trust in an issuer.",
    },
    {
      q: "Once the block reward eventually hits zero, what do miners rely on?",
      options: ["They stop mining", "Entirely on transaction fees", "Government subsidies", "A new round of issuance"],
      answer: 1,
      explain: "As the subsidy approaches zero, fees provide the incentive; the long-term economics remain an open question.",
    },
    {
      q: "Why does adding up all the phases converge exactly to about 21 million, and never more?",
      options: ["There's a master switch that stops at 21 million", "Each phase's issuance is a geometric series with ratio ½, 10.5M×(1+½+¼+…)=21M, forever approaching yet never reaching it", "Miners voluntarily stop mining", "It's a cap set by a central bank"],
      answer: 1,
      explain: "The first phase already issued half (10.5 million), and each phase after issues half of what remains; the geometric series converges to 21 million.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Halving / issuance mechanism", url: "https://learnmeabitcoin.com/technical/mining/target/" },
    { label: "Wikipedia: Bitcoin (supply cap)", url: "https://en.wikipedia.org/wiki/Bitcoin" },
  ],
};
