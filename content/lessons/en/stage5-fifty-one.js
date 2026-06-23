export default {
  id: "fifty-one",
  stage: 5,
  order: 4,
  title: "The Longest Chain, Reorgs, and the 51% Attack",
  difficulty: "core",
  prereqs: ["difficulty", "consensus"],

  oneLiner:
    "Bitcoin's security is, at bottom, an economics problem: to overturn a transaction already on-chain, an attacker must use their own hashrate to secretly build a longer (more cumulative work) chain and overtake the whole network — which requires commanding a majority of the hashrate and burning money continuously. And with every additional confirmation on your transaction, the probability of it being overturned drops exponentially.",

  intuition: `
Back to the consensus rule from Stage 2.4: a node always follows the chain with **the most cumulative work**. For an attacker to erase an already-confirmed transaction (e.g. pay first, receive the goods, then "reverse" the payment), the only way is: **secretly start a fork** from before the block containing that transaction (a fork not containing that payment) → use hashrate to **frantically mine this private chain** until it's **longer** than the honest network's chain → publish it, the whole network switches over per the rules, and the original transaction along with the few blocks after it gets **reorged** out — that's the double-spend.

The hard part: you have to **outrun all the rest of the network's hashrate combined**. With less than half the hashrate, your private chain only falls further behind; only by commanding **a majority of the hashrate (51%)** can you reliably keep overtaking, and that means an astronomical sum of equipment and electricity. Worse still: **every additional block you bury your transaction under (one more confirmation) is one more length the attacker has to catch up, and the success probability drops exponentially** — that's the mathematical basis for "wait for 6 confirmations on large amounts."

Compute it on the right: given the attacker's hashrate share and the number of confirmations, how low is the probability of a successful overtake.

**In this lesson we break the "51% attack" into four pieces:**

- **① The mechanism of the attack — how a private chain overtakes and triggers a reorg**
- **② The success probability — the exponential decay of the whitepaper's Section 11**
- **③ Can and cannot — the limits of what 51% can do**
- **④ Why almost no one actually does it — economic incentives, the ultimate line of defense**
`,

  mechanics: `
### ① The mechanism of the attack: how a private chain overtakes and triggers a reorg

Break the double-spend attack into a sequence of moves and you'll see exactly where the difficulty lies:

- **Setup**: the attacker pays a merchant; this transaction enters the honest chain and accumulates confirmations. Meanwhile, **on their own computer**, the attacker secretly forks from the block before the payment and mines a private chain **not containing this payment**.
- **Waiting**: the merchant ships after seeing \`z\` confirmations. At this moment the attacker's private chain is usually still **behind** the honest chain by several blocks.
- **Overtake and publish**: the attacker keeps frantically mining the private chain, and once its **cumulative work exceeds** the honest chain's, broadcasts it. Nodes switch per the "heaviest chain wins" rule, and that payment on the honest chain, along with the blocks after it, is **reorged out** — the goods are in hand, but the money has returned to the attacker's address.
- **The cost**: throughout the process, the attacker gives up the block rewards they could have earned on the honest chain, and must burn all the electricity needed to overtake. This only pays off when their hashrate is large enough to overtake reliably.

### ② The success probability: the exponential decay of the whitepaper's Section 11

Section 11 of Satoshi's whitepaper gives the solution to this probability problem (in simplified form):

- Let the attacker hold a fraction \`q\` of the network's hashrate, the honest side \`p = 1 − q\`, and let the attacker be \`z\` confirmations behind at shipping time. When \`q < 50%\`, the probability the attacker eventually catches up is about **(q/p)^z** — decaying **exponentially** with the confirmation count \`z\`.
- Example: \`q = 10%\`, \`z = 6\` → \`(1/9)^6 ≈ 0.0000019\`, about two in a million, practically impossible.
- Example: \`q = 40%\`, \`z = 6\` → \`(2/3)^6 ≈ 8.8%\`, clearly on the high side — so against a strong-hashrate adversary, you should wait for more confirmations to be safe.
- \`q ≥ 50%\`: here \`p ≤ q\`, the ratio ≥ 1, and the attacker **will catch up sooner or later** — no number of confirmations can save it, and the security assumption collapses entirely. This is precisely where the number "51%" comes from: **50% is a phase-transition point** — cross it and the nature of the thing changes completely.

> Practical meaning: the confirmation count is not a "more is mystically safer" superstition, but a computable probability. One confirmation is plenty for a small transfer; exchanges often wait 6 for large amounts; and against a suspected strong-hashrate adversary, you can estimate how long to wait yourself using the formula above.

### ③ Can and cannot: the limits of 51% (echoing Stage 2.3)

A majority of hashrate is very powerful, but far from "anything goes." Distinguishing the limits keeps you from over- or under-estimating this threat:

- **Can do**: reorg recent blocks, double-spend **its own** coins, censor (refuse to package) certain transactions, capture most of the block rewards.
- **Cannot do**: mint coins out of thin air (blocks that violate the issuance rules are rejected outright by full nodes), change the supply cap, steal other people's coins **without their private key** (that requires breaking the signature, not a hashrate problem), or tamper with the distant past (the deeper a block, the more work piled on top; you'd have to re-mine every block after it, which is infeasible in practice).
- In one sentence: **a 51% attack is an attack on "recent ordering," not on "the rules and ownership."** The rules are guarded by every node validating independently, and ownership is guarded by the private key; neither line of defense can be pried open by hashrate.

### ④ Why almost no one actually does it: economic incentives, the ultimate line of defense

Bitcoin's deepest security isn't in the math; it's in the **incentives**:

- Acquiring and sustaining a majority of the hashrate requires an astronomical sum of equipment and electricity — that investment is itself a massive sunk cost.
- And once an attack succeeds and trust collapses, **the coin price crashes** — the attacker's mining rigs (built specifically to mine Bitcoin) and the coins they hold **depreciate together**, and they've smashed their own largest asset with their own hands.
- Conversely, taking the same hashrate and honestly mining earns steady block rewards. On balance, **honest mining is often more profitable than attacking**.
- This is the essence of Bitcoin: it doesn't rely on "assuming everyone is good," but designs the system so that **even the most selfish participant finds honesty most profitable**. The math draws the limits of capability; the economic incentives make it so that "even if you can, you wouldn't want to."
`,

  demo: "attack-prob",

  analogy: `
Imagine a **footrace**: you (the attacker), starting several laps behind, have to overtake a "relay team" made up of everyone else on the track.

As long as their combined speed is faster than yours (you have less than half the hashrate), you only fall further behind. Only by being faster than the entire team (a majority of the hashrate) can you catch up. And with each passing stretch of time (each additional confirmation), they've run another length ahead — the gap you must make up keeps growing, and the hope of overtaking grows exponentially slim.
`,

  misconceptions: [
    "“A 51% attack can create bitcoin out of thin air, or steal anyone's coins.” — It cannot. It can only reorg recent blocks, double-spend the attacker's own coins, and censor transactions; minting is rejected by full nodes, and stealing coins requires the private key.",
    "“Holding 51% lets you rewrite the entire history.” — The deeper a block, the more work piled on it; rewriting would require re-mining every block after it, which is infeasible in practice. A 51% attack targets ‘recent ordering,’ not ‘the rules and ownership.’",
    "“Once a transaction is on-chain it's absolutely safe.” — Right after it lands it can still be reorged out by a small reorg; more confirmations mean more safety, which is why large amounts wait for 6 confirmations.",
    "“Since 51% is feasible, Bitcoin isn't secure.” — Acquiring and sustaining a majority of hashrate is extremely costly, and an attack would depreciate the attacker's own rigs and holdings together — it's economically irrational.",
    "“50% and 49% differ by only a little, so the threat is about the same.” — No. 50% is a phase-transition point: below it, the catch-up probability decays exponentially with confirmations; at it, the attacker will catch up sooner or later — the nature is fundamentally different.",
  ],

  quiz: [
    {
      q: "To overturn an already-confirmed transaction, an attacker must?",
      options: ["Break a private key", "Use hashrate to build a chain longer (more work) than the whole network's and overtake it", "Bribe an exchange", "Modify your wallet"],
      answer: 1,
      explain: "Consensus follows the longest chain, and overtaking requires a majority of hashrate sustaining the lead.",
    },
    {
      q: "The more confirmations on your transaction, the probability of it being reorged out is?",
      options: ["Unchanged", "Exponentially decreasing", "Increasing", "Randomly varying"],
      answer: 1,
      explain: "About (q/p)^z, decaying exponentially with the confirmation count z.",
    },
    {
      q: "With 51% of the hashrate, which of these **cannot** be done?",
      options: ["Double-spend the attacker's own coins", "Censor certain transactions", "Mint bitcoin out of thin air or steal others' coins", "Reorg the most recent blocks"],
      answer: 2,
      explain: "Minting and theft require changing the rules or a private key, which a hashrate advantage can't achieve.",
    },
    {
      q: "Why do so few people actually launch a 51% attack in practice?",
      options: ["It's technically impossible", "The cost is extremely high, and the attack would destroy the value of the attacker's own rigs and coins — economically irrational", "Just banning it by law is enough", "No one has that much electricity"],
      answer: 1,
      explain: "Honest mining is usually more profitable than attacking — economic incentives guard security.",
    },
  ],

  further: [
    { label: "Bitcoin Whitepaper · Section 11 (probability of a successful attack)", url: "https://bitcoin.org/bitcoin.pdf" },
    { label: "learnmeabitcoin: Beginners' guide", url: "https://learnmeabitcoin.com/beginners/" },
  ],
};
