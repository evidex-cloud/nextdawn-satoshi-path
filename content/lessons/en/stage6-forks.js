export default {
  id: "forks-bips",
  stage: 6,
  order: 4,
  title: "Soft Forks, Hard Forks, and BIPs: How the Rules Are Upgraded",
  difficulty: "core",
  prereqs: ["consensus", "node-types"],

  oneLiner:
    "Bitcoin has no boss; upgrading the rules can only happen through network-wide coordination. A soft fork tightens the rules and is backward-compatible, so old nodes still accept the blocks — a smooth upgrade (SegWit, Taproot); a hard fork loosens or changes the rules, is incompatible, and splits the chain into two (like Bitcoin Cash). Improvement ideas are discussed through the open BIP process.",

  intuition: `
Bitcoin's consensus rules are written into every node's software (Stage 2.4). But it has **no boss and no board** — to change the rules, you can only rely on voluntary, network-wide coordination. There are two ways to change them, and the difference comes entirely down to "whether the new rules are compatible with the old ones."

The intuition in one sentence: **a soft fork "tightens" the rules (old nodes still accept them); a hard fork "loosens or changes" the rules (old nodes will reject them)**. The former is a smooth network-wide upgrade; the latter may split the chain in two.

The demo on the right: choose a soft or hard fork, have a new-version miner produce a new block, and watch whether old nodes accept it and whether the chain splits.

**In this lesson we break "forks and upgrades" into four pieces:**

- **① Soft forks — tightening the rules, a backward-compatible smooth upgrade**
- **② Hard forks — loosening the rules, incompatible, possibly splitting the chain**
- **③ The BIP process — how improvement ideas are proposed, discussed, and numbered**
- **④ Who decides — economic consensus, and why Bitcoin is conservative**
`,

  mechanics: `
### ① Soft forks: tightening the rules, backward-compatible

The essence of a soft fork is: **the new rules are a subset of the old rules** — it only turns some things that "used to be valid" into "no longer valid," and never turns something "previously invalid" into valid.

- So any block that conforms to the **new** rules is **also valid** under the **old** rules. Therefore **old, un-upgraded nodes still accept the new blocks**, the network doesn't split, and the upgrade is smooth.
- **The cost is that old nodes "can't see everything."** For example, SegWit (BIP141) puts witness data in a place old nodes ignore — an old node thinks "this block is valid" but isn't actually validating that new portion of the rules. It didn't go offline; it was just downgraded to "half-understanding."
- **Real cases**: **SegWit (2017)** fixed transaction malleability and paved the way for the Lightning Network; **Taproot (2021, BIP340–342)** introduced Schnorr signatures to make multisig more private and space-efficient. Both were soft forks, and neither split off a new coin.
- **How is it activated?** Historically the **BIP9 version bits** were used (miners "vote" in their blocks, and activation locks in once a threshold is reached); later Taproot was activated via **Speedy Trial** (a fast BIP9-style version-bits deployment), with BIP8 debated as an alternative but not used. The key point: a miner's "vote" is only a **coordination signal** — the rules are still ultimately enforced by full nodes.

### ② Hard forks: loosening the rules, incompatible

A hard fork **loosens or changes** the rules — turning something previously invalid into valid (e.g. raising the block limit from about 1 M weight, or changing the issuance curve).

- A new block built this way is **invalid** under the **old** rules, and old nodes will **reject it on the spot**. The result: those who upgrade follow the new chain, those who don't stay on the old chain, and **the chain splits permanently** into two, each with its own coins and each continuing on.
- **It is not a "failure," but a deliberate incompatible change.** Yet the cost is enormous: you must persuade **nearly everyone** to upgrade in sync, or you get a split. Coordinating the whole network like this in a leaderless system is extremely hard, which is why **Bitcoin's main net rarely does hard forks**.
- **Real case**: in **2017 Bitcoin Cash (BCH)** hard-forked away from Bitcoin over the "should we enlarge the block" dispute (the backdrop being the "block size war" of Stage 8). At the moment of the fork, every coin holder got **a copy on both chains**; afterward the two chains evolved independently, with wildly divergent prices.

### ③ The BIP process: how improvement ideas are proposed

Since no company makes the call, improvements rely on an open, transparent proposal process — the **BIP (Bitcoin Improvement Proposal)**:

- **Anyone can write a BIP**, discuss it in a public repository, get it a number, provide a reference implementation, and submit it for the whole community to review.
- BIPs come in three kinds: **Standards Track** (changing the protocol itself, e.g. a new address type), **Informational** (design guidelines), and **Process** (the governance process itself).
- **A number ≠ being in effect.** Getting a number is only "on the record"; it's still far from going live — it must be thoroughly discussed by the community, given a reliable implementation, and then go through an activation process. Many BIPs remain in the draft stage forever.
- **BIPs you've already used**: BIP32/39/44 (HD wallets and mnemonics, Stages 7.1–7.3), BIP141 (SegWit), BIP340–342 (Taproot), BIP174 (PSBT, Stage 7.4), BIP125 (RBF, Stage 6.3).

### ④ Who decides: economic consensus and conservatism

The final say lies neither with developers nor with miners, but with the **"economic majority" who run nodes**:

- **Developers** can only write code and propose ideas; they can't force anyone to run it (callback to Stage 6.2: the rules are enforced by full nodes).
- **Miners** have hash power, but hash power only decides "who mines a block first," not "which rules are valid" — the non-compliant blocks they produce are rejected by full nodes.
- **What truly counts are the economic nodes**: the full nodes run by exchanges, merchants, wallets, and self-custodians that "settle in real money." A change only takes hold when the **economic majority voluntarily upgrades and enforces it** (this also explains the 2017 SegWit tug-of-war: in the end the user-activated soft fork, UASF, pushed the situation forward).
- **Why does Bitcoin change so slowly and stay so conservative?** Because it carries enormous value, **security and stability always come before new features**. Any change must assume "it could be attacked, it could have a bug" — better slow than wrong. "Being hard to change" is itself one source of its credibility as money — a currency that no one can unilaterally tamper with is the kind worth holding long-term.
`,

  demo: "fork-sim",

  analogy: `
**A soft fork** is like tightening "you can't run a red light" into "you can't run a red or a yellow light" — those who keep the old rule automatically keep the new one too, no one is left behind, and it's still the same road.

**A hard fork** is like changing "drive on the right" to "drive on the left" — those who didn't switch sides and those who did can't share the road, so they have to split into two roads and each go their own way.
`,

  misconceptions: [
    "“Developers can force any change into Bitcoin.” — They can't. A change must be voluntarily adopted by the economic majority who run nodes, or it won't take effect.",
    "“A soft fork also requires everyone to upgrade.” — It doesn't. It's backward-compatible, and old nodes still accept the new blocks.",
    "“A hard fork is just a failed upgrade.” — Not necessarily. It's a deliberate incompatible change that produces a chain split; it's just costly to coordinate, so Bitcoin rarely uses it.",
    "“Once a BIP gets a number it automatically takes effect.” — No. The number is only a registration; actually taking effect depends on adoption by the community and economic nodes.",
  ],

  quiz: [
    {
      q: "Why doesn't a soft fork split the chain?",
      options: ["Miners vote unanimously", "The new rules are a subset of the old rules, so old nodes still accept the new blocks", "No one upgrades", "Satoshi approved it"],
      answer: 1,
      explain: "Backward compatibility is the key to a soft fork's smooth upgrade.",
    },
    {
      q: "Which of these are soft forks?",
      options: ["Bitcoin Cash (BCH)", "SegWit and Taproot", "Changing the supply to 42 million", "Abolishing fees"],
      answer: 1,
      explain: "SegWit and Taproot are both backward-compatible soft forks.",
    },
    {
      q: "What is the typical result of a hard fork?",
      options: ["A seamless network-wide upgrade", "Old nodes reject the new blocks, and the chain splits permanently into two (each with its own coins)", "The supply doubles", "Transactions get faster"],
      answer: 1,
      explain: "An incompatible change → upgraders and non-upgraders each follow their own chain.",
    },
    {
      q: "Whether a change ultimately takes hold depends on?",
      options: ["Developers deciding", "Whether the economic majority who run nodes voluntarily adopt it", "Who has the most hash power", "The size of the BIP number"],
      answer: 1,
      explain: "Callback to 2.4: the rules are enforced jointly by the network's validators.",
    },
  ],

  further: [
    { label: "The BIPs Repository (GitHub)", url: "https://github.com/bitcoin/bips" },
    { label: "Wikipedia: Bitcoin Cash (a hard-fork case)", url: "https://en.wikipedia.org/wiki/Bitcoin_Cash" },
  ],
};
