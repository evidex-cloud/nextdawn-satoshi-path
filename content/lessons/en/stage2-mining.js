export default {
  id: "mining",
  stage: 2,
  order: 3,
  title: "Mining: Competing for the Right to Write the Ledger with Hashpower",
  difficulty: "intro",
  prereqs: ["blockchain"],

  oneLiner:
    "Mining isn't “computing bitcoins into existence” — it's miners frantically trying random numbers to compete for the right to “write the next block”: whoever first makes a block's hash hit a tiny target value gets to produce the block and take the block reward plus fees. This work, which burns real money (electricity), is exactly what makes the ledger tamper-proof.",

  intuition: `
The word "mining" is easy to misread — miners aren't "digging up" hidden coins. They're solving a puzzle that **can only be brute-forced yet is trivially easy to verify**, in order to compete for the **right to write the ledger** (the right to write the next block).

The puzzle looks like this (here's where your hash intuition from Stage 0 pays off): assemble a batch of transactions and a random number, the **nonce**, into a block header and compute its hash; the rule requires this hash to be **smaller than a tiny target value** (intuitively: it has to start with a long run of zeros). A hash is unpredictable, with no shortcut — **you can only keep changing the nonce and trying over and over**, hundreds of quintillions of times per second across the whole network. Whoever first hits a valid one produces the block and collects the reward.

The mini miner on the right lets you pick a difficulty and go find a valid nonce yourself, so you feel how "every notch of added difficulty makes the number of tries you need explode."

**In this lesson we break mining into four pieces:**

- **① What mining is actually doing — finding a valid hash**
- **② Why this protects the ledger — hard to do, easy to verify, electricity-burning**
- **③ Difficulty and the 10-minute rhythm — the network's automatic metronome**
- **④ Reward and incentive — why miners choose to be honest**
`,

  mechanics: `
### ① What mining is doing: finding a valid hash

Precisely speaking, what a miner computes over and over is the double SHA-256 of the 80-byte **block header** (Stage 5.1 takes the fields apart), aiming to make the result, **as a 256-bit number**, smaller than the difficulty target \`target\`:

- "Starts with N zeros" is just the intuitive way of saying "the value is small enough"; the real criterion is \`SHA256(SHA256(header)) < target\`. The smaller the target, the rarer a qualifying hash and the harder it is to hit.
- On each try the miner only changes the **nonce** in the header, leaves the rest untouched, and recomputes the hash to check whether it qualifies. Thanks to the avalanche effect (Stage 3.1), changing one nonce turns the output upside down and makes it **utterly unpredictable** — so there's no shortcut other than trying one at a time.
- But the nonce is only **32 bits (about 4.3 billion possibilities)**. A modern single miner already computes hundreds of trillions of hashes per second (**100+ TH/s**), so 4.3 billion nonces are **exhausted in under a millisecond**. Then what? The miner changes the **timestamp**, or changes the **extranonce** in the coinbase transaction — which changes the Merkle root, effectively producing a "brand-new header to try," giving another 4.3 billion nonces to test (Stage 5.5).
- Total network hashpower in 2026 has reached **hundreds of EH/s (hundreds × 10¹⁸ hashes per second)**. To convert: the number of attempts the whole network makes per second is more than the total number of grains of sand on Earth — that's the scale of energy "welding" the ledger shut.
- How low are the odds of winning? At the current difficulty, a single top-tier miner would have to compute for **hundreds of thousands of years** on average to mine one block independently — which is why miners **band together into pools**, combining hashpower and splitting the reward, smoothing income from "a once-in-a-lifetime jackpot" into "a steady daily wage."

### ② Why this protects the ledger: hard to do, easy to verify, electricity-burning

The essence of proof of work is an extreme **asymmetry**:

- **Finding the answer is extremely hard**: no shortcut, only brute-force exhaustion, on average \`1/probability\` tries, burning a huge amount of electricity. The difficulty can be quantified exactly — it equals "how many hashes on average it takes to hit a qualifying one."
- **Verifying the answer is extremely easy**: anyone handed your block need only compute double SHA-256 **once** to confirm in an instant that "yes, it's below the target." **Doing it burns quintillions of computations of electricity, verifying takes just one** — that chasm is the source of security.
- So "producing a block" becomes an **expensive, unforgeable proof-of-work receipt**: the mere existence of this hash proves someone really burned the corresponding electricity behind it. You can't fake "I burned electricity."
- To tamper with an old block, you'd have to **redo all the work of that block and every block after it, and overtake the whole network** — a cost so high it's impossible (the "unchangeable" of Stage 2.1; this is its root).
- **The energy isn't waste — it's an "anchor"**: Bitcoin anchors the ledger's security to **electricity actually consumed** in the real world. To overturn history, first lay out an electricity bill and a rig fleet on par with the entire network — a wall built out of physics, not relying on any law or reputation.

### ③ Difficulty and the 10-minute rhythm: the network's automatic metronome

Total network hashpower is in constant flux (rig upgrades, price swings, miners entering and leaving — it can move by orders of magnitude), but the protocol wants a block on average **every 10 minutes**. How do you hold the rhythm steady amid such violent hashpower swings?

- Every **2016 blocks** (10 minutes × 2016 ≈ **14 days**), every node does a division for itself: it looks at how long those 2016 blocks **actually** took.
  - If it was **faster** than 14 days (hashpower flooded in) → shrink the target, **raise the difficulty**;
  - If it was **slower** than 14 days → enlarge the target, **lower the difficulty**.
  - The adjustment is proportional to "actual time / 14 days," and is **clamped between 1/4× and 4×** to keep any one jump from being too violent (Stage 5.2 gives the formula).
- This is a **negative-feedback loop**: hashpower floods in → blocks come faster → next period's difficulty ↑ → block speed gets pulled back to 10 minutes. Because of this, network hashpower has grown trillions of times over more than a decade, yet Bitcoin has stayed steady at roughly one block every 10 minutes.
- **Edge case**: difficulty only adjusts once every two weeks, so if hashpower plunges within a period (say a country suddenly bans mining), blocks **genuinely slow down** until the next adjustment corrects it — when hashpower was halved in 2021, block intervals stretched to over ten minutes for a stretch.
- It and the halving mind their own lanes and don't interfere: **difficulty governs "how fast blocks come" (about 10 minutes), the halving governs "how many new coins each block issues" (Stage 2.5)**.

### ④ Reward and incentive: why miners choose to be honest

A miner's income comes from each block's **first coinbase transaction**: **the block subsidy (new coins, currently 3.125 BTC) + all the transaction fees in this block** (Stage 5.5).

- This is both the **sole faucet** for issuing new coins and the **economic engine** that makes miners willing to burn electricity. The subsidy still far exceeds fees today, but as it decreases with each halving, the fee share will keep rising.
- **Coinbase maturity**: newly mined coins must wait **100 confirmations** before they can be spent — preventing the chaos of a reward that's already been spent vanishing after a block gets reorged out.
- Why not cheat? Do the math:
  - Submitting a **rule-breaking block** (say, paying yourself an extra reward, or stuffing in a double-spend) gets **rejected on the spot** by nodes across the network using the same rules (Stage 2.4) — the block is never accepted, and the electricity you burned for it is **pure loss**.
  - Even if you really amass 51% of hashpower and launch an attack: all you can do is **reorder or censor transactions**, and you **can't change the issuance rules or steal coins you don't hold the private key to** (theft needs the private key, and hashpower can't buy it).
  - And the moment an attack is exposed, trust collapses and the price crashes, so the pile of specialized rigs in your hands (useless for anything but mining) and your coin holdings **depreciate together** — you'd be smashing your own biggest asset.
- Conclusion: **honest mining almost always pays better than attacking.** Bitcoin doesn't constrain miners through morality; it designs the incentives so that "honest = optimal strategy" (Stages 5.4 and 9.4 work out the math).
`,

  demo: "mining-sim",

  analogy: `
Mining is like a **global password-guessing contest running simultaneously everywhere**: the challenge is "find a number that, hashed together with this ledger page, produces a fingerprint starting with many zeros." No one can calculate it; they can only try one after another like mad.

Whoever guesses first **wins the right to sign this page**, walks away with the prize (new coins plus fees), and loudly announces the answer — everyone else checks "sure enough, it starts with that many zeros" and accepts it within seconds, and then everyone moves on to the next puzzle together. Guessing right takes a staggering amount of electricity, but verifying takes only an instant — this asymmetry is the ledger's moat.
`,

  misconceptions: [
    "“Mining solves a useful math problem.” — No. It's a deliberately designed puzzle solvable only by brute force; its value lies precisely in being “hard to do, easy to verify, and electricity-burning.”",
    "“With enough hashpower you can rewrite or forge other people's transactions.” — More hashpower only makes it easier to grab the right to produce a block; it can't forge a signature to spend someone else's coins (that needs the private key). The threat from hashpower is reordering and censorship, not theft.",
    "“Mining is pure energy waste.” — Whether it's “waste” is debatable, but mechanically, this energy expenditure is exactly the source of the ledger's tamper resistance — an attacker must pay an equivalent magnitude of real cost.",
    "“Miners can just hand themselves extra rewards.” — They can't. The block reward amount is a hard-coded consensus rule, and a block with an excessive reward is rejected outright by nodes across the network (covered next).",
    "“Mined block rewards can be spent right away.” — No. The new coins minted by a coinbase must wait 100 confirmations (the maturity period) before they can be spent, to prevent the chaos of a block being reorged out (Stage 5.5).",
  ],

  quiz: [
    {
      q: "What is a miner essentially doing over and over while mining?",
      options: ["Solving an equation with real-world meaning", "Repeatedly changing the nonce and hashing until the result is below the target", "Encrypting transactions", "Calculating fees"],
      answer: 1,
      explain: "Proof of work is brute-forcing the nonce to find a valid hash — there's no shortcut.",
    },
    {
      q: "What is the “asymmetry” of proof of work?",
      options: ["Mining and verifying are equally slow", "Finding the answer is extremely hard (burns electricity), but verifying takes an instant", "Verifying is even harder than mining", "Both are very easy"],
      answer: 1,
      explain: "Hard to do, easy to verify — this is the key to its role as a “security anchor.”",
    },
    {
      q: "What is the automatic difficulty adjustment for?",
      options: ["To let miners earn more", "To keep the average block time steady at about 10 minutes", "To speed up transaction confirmation", "To increase the total coin supply"],
      answer: 1,
      explain: "Roughly every two weeks it auto-adjusts based on actual hashpower, maintaining the 10-minute rhythm.",
    },
    {
      q: "What can and can't an attacker with more than half the network's hashpower do?",
      options: ["Forge signatures and steal anyone's coins", "Reorder or censor transactions, but not spend coins they weren't authorized to spend out of thin air", "Anything they want", "Nothing at all"],
      answer: 1,
      explain: "Stealing coins requires the private key; a hashpower advantage brings only reorg and censorship threats.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Mining (illustrated)", url: "https://learnmeabitcoin.com/beginners/guide/mining/" },
    { label: "learnmeabitcoin: Proof of Work", url: "https://learnmeabitcoin.com/technical/mining/proof-of-work/" },
    { label: "Mastering Bitcoin · Chapter 8: Mining", url: "https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch08_mining.adoc" },
  ],
};
