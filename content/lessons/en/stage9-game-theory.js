export default {
  id: "game-theory",
  stage: 9,
  order: 4,
  title: "Game Theory and the Real World: Why Everyone Chooses Honesty",
  difficulty: "deep",
  prereqs: ["fifty-one", "halving"],

  oneLiner:
    "Bitcoin stands not on cryptography alone but on a set of incentive games that make “honesty the most profitable” strategy: miners earn more by mining honestly than by attacking, nodes each enforce the rules, and users vote with their feet. Layer on its verifiable scarcity (21 million) and ever-expanding real-world adoption (ETFs, institutions, even nations), and together they uphold its standing as money.",

  intuition: `
The earlier cryptography guarantees "can't be altered, can't be forged." But cryptography only solves "can it be done," not "does one want to" — why does a miner holding vast hash power **not** turn to wrongdoing? Bitcoin's true robustness also comes from a layer of **incentive games**: it carefully designed the rules so that every rational, self-interested person, **out of their own self-interest**, ultimately chooses **honesty**:

- **Miners:** an attack burns a fortune in hash power, and once it succeeds, trust collapses, the price crashes, and your own miners and holdings devalue along with it. **Mining honestly is almost always more profitable** (callback 5.4).
- **Nodes:** no one can force your node to accept an invalid block. The rules are enforced **bottom-up** by every validator (callback 6.4).
- **Users:** which chain "is Bitcoin" is decided by the **economic majority** who run nodes, hold, and use it (callback 8.1's scaling war).

Add to that its **verifiable scarcity** (21 million written into the code, callback 2.5) — exactly what fiat can't offer (callback 0.2). So more and more people, from retail to institutions to nations, are starting to treat it as an alternative **store of value.**

Drag your holdings on the right and watch how "cheating" turns into "self-destruction" as your stake deepens.

**In this lesson we break "game theory and the real world" into four pieces:**

- **① How the triple game interlocks — miners, nodes, and users check one another**
- **② Why honesty is most profitable — let's do the math on attacking**
- **③ The digital-gold narrative — verifiable scarcity and real-world adoption**
- **④ A clear-eyed view — the energy debate, no price guarantee, and self-custody**
`,

  mechanics: `
### ① How the triple game interlocks

Bitcoin's security rests on no single role, but on three forces **checking one another**:

- **Miners (hash power)**: compete for the block reward, deciding "which transactions to package and which chain to extend." But they **can't change the rules** — broadcast an invalid block and nodes reject it, burning the electricity for nothing.
- **Nodes (validation)**: every full node independently checks every rule (Stage 6.2), **enforcing consensus bottom-up.** If miners try to quietly change the rules (such as printing extra coins), nodes veto it.
- **Users / the economy (adoption)**: exchanges, merchants, and holders vote with their feet, deciding "which chain has value and is called Bitcoin" (callback 8.1). Hash power and nodes must ultimately serve this economic reality — a chain no one uses is worthless no matter how much hash power it has.
- **The elegance lies in the "separation of powers" among the three**: miners have hash power but no rule-making authority, nodes have rule-making authority but no money, users have money but no block-production power. Any one side trying to do wrong runs into the constraints of the other two — this is the true source of "no one can unilaterally control Bitcoin," not merely the slogan "decentralization."

### ② Why honesty is most profitable: let's do the math

Take the most classic attack — a miner launching a **51% attack** (callback 5.4) — and lay out the costs and benefits:

- **Direct cost**: you must control **over half the network's hash power.** That means an astronomical purchase of mining rigs plus the **real electric bill** burned continuously. The attack isn't one-and-done — to sustain a double-spend/reorg, you must **continuously** stay ahead of the whole network's hash power, money flowing out like water.
- **What you can get**: at most, double-spend a few of **your own** transactions, or censor some transactions. You **can't steal coins from other people's addresses** (that needs the private keys), **can't change the 21-million cap** (nodes reject it), and **can't forge coins out of nothing.** The attack's "loot" is actually pitifully small.
- **The fatal backlash**: your hash power itself is a **multi-billion-dollar asset**, its value entirely bet on "Bitcoin being trustworthy." The moment the attack is discovered, **trust collapses → the price crashes → your rigs and holdings zero out together.** You've spent a fortune to smash your own rice bowl.
- **The conclusion**: take that same hash power and **mine honestly**, steadily earning block rewards + fees — **almost always more worthwhile.** This is "cheating = self-destruction" — the deeper your stake, the higher the cost of betrayal (the demo on the right is exactly this curve). Bitcoin's security is, in essence, **making an attack economically irrational** rather than physically impossible.
- This logic is of a piece with the Lightning Network's penalty mechanism (callback 8.3) and with mining's difficulty adjustment: **replacing trust with economic incentives** is a design motif running through Bitcoin from start to finish.

### ③ The digital-gold narrative: verifiable scarcity and real-world adoption

The incentive games hold security; **scarcity** gives it monetary value:

- **Verifiable scarcity**: Bitcoin takes gold's scarcity to the extreme of being **independently verifiable by anyone** — a total of 21 million written into the code, checked by your own node (callback 0.1's stock-to-flow ratio, 2.5's halving). Gold still requires trusting that no one is secretly producing more; Bitcoin's supply can be **counted by anyone in person.** The "digital gold" narrative springs from exactly this.
- **Seizure-resistant / portable**: a single seed phrase can carry your entire net worth across a border, something physical gold can't do (callback 1.x self-custody).
- **Real-world adoption (as of recent years)**: spot **Bitcoin ETFs** (approved in the US in 2024) make it easier for institutions and traditional money to participate, bringing huge inflows; some public companies have added Bitcoin to their **balance sheets** as a reserve asset; a few nations (such as **El Salvador in 2021**) made it one of their legal currencies. Adoption has moved from "geek toy" all the way to a discussion of "institutional asset + sovereign reserve."

### ④ A clear-eyed view: energy, price, and self-custody

Finally, we must say it fully and soberly:

- **The energy debate**: proof-of-work consumes **real electricity** — this is both the **cost of its security** (an attacker must pay the same electric bill; the bill is a "brick" in the moat) and a source of environmental criticism. The energy mix (increasingly hydro, curtailed power, associated gas), the use of **curtailed power / waste heat**, and "whether the global settlement network this energy buys is worth it" are **detailed, contested** topics — far from anything a phrase like "pure waste" can capture.
- **Price and adoption come with no guarantee**: this is a frontier full of both opportunity and **enormous risk.** Institutional buying and national adoption **do not mean the price must rise** — drawdowns of 70%+ have recurred repeatedly in history. No one can vouch for its future.
- **ETF ≠ self-custody**: holding through an ETF is a **paper claim**; you don't hold the private keys. "**Not your keys, not your coins**" still holds (callback 1.4) — the most revolutionary part of Bitcoin (self-custody, censorship resistance, permissionlessness) is precisely the part this "wrapper" of an ETF gives up. Having understood the games and the scarcity, also understand: **the real way to hold Bitcoin is to hold your own private keys.**
`,

  demo: "honest-cheat",

  analogy: `
Bitcoin is like a finely designed **multiplayer game**: the rules make "playing honestly" each person's optimal move. Miners, nodes, and users each work their own angles, yet together they push the system toward honesty and stability.

Pair that with its scarcity that "anyone can count and no one can alter," and more and more players — retail, institutions, even nations — are starting to put it in their pockets as a new kind of "digital gold."
`,

  misconceptions: [
    "“Bitcoin's security relies on cryptography alone.” — It also relies on incentive games: making honesty the optimal strategy for every participant.",
    "“With ETFs, Bitcoin is now centrally controlled.” — An ETF is just a ‘wrapper’ for participation; the protocol itself remains decentralized — but an ETF share doesn't mean you hold the private keys.",
    "“Institutional buying or national adoption guarantees the price goes up.” — No guarantee. This is a high-opportunity, high-risk frontier, and no one can vouch for the price.",
    "“PoW's energy use is pure waste.” — The energy use is the real cost of security; its energy mix and efficiency are a nuanced, contested topic, not something a single word like ‘waste’ can capture.",
  ],

  quiz: [
    {
      q: "Why does a rational large miner usually choose honesty?",
      options: ["Out of morality", "Attacks are costly and would devalue the miner's own rigs and holdings, so honesty pays more", "There's a legal mandate", "Cheating is technically impossible"],
      answer: 1,
      explain: "The deeper the stake, the more cheating is self-destruction — incentives guard security.",
    },
    {
      q: "In the end, who decides “which chain is Bitcoin”?",
      options: ["The mining pool with the most hash power", "The consensus of the economic majority who run nodes, hold, and use it", "Developers", "Exchanges"],
      answer: 1,
      explain: "Callback 8.1's scaling war: economic consensus has the final say.",
    },
    {
      q: "What is Bitcoin's key monetary advantage over fiat?",
      options: ["Faster transactions", "A fixed scarcity (21 million) that anyone can independently verify", "Government backing", "It always appreciates"],
      answer: 1,
      explain: "Verifiable scarcity — exactly what fiat can't offer (callback 0.2 / 2.5).",
    },
    {
      q: "Which statement about spot Bitcoin ETFs is correct?",
      options: ["It means you've self-custodied Bitcoin", "It's a ‘wrapper’ that makes it easy for traditional money to participate, but a share doesn't mean you hold the private keys", "It centralizes the protocol", "It guarantees price increases"],
      answer: 1,
      explain: "Not your keys, not your coins still applies (callback 1.4).",
    },
  ],

  further: [
    { label: "Bitcoin Whitepaper · Section 6 (Incentive)", url: "https://bitcoin.org/bitcoin.pdf" },
    { label: "Wikipedia: Bitcoin (adoption and controversy)", url: "https://en.wikipedia.org/wiki/Bitcoin" },
  ],
};
