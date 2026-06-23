export default {
  id: "covenants",
  stage: 9,
  order: 3,
  title: "Covenants and Evolution: Adding “Spending Conditions” to Coins",
  difficulty: "deep",
  prereqs: ["script", "forks-bips"],

  oneLiner:
    "A “covenant” is a class of proposed new capability: letting a UTXO not only verify “who can spend it” but also restrict “how it may be spent in the future” — for instance forcing a withdrawal to first pass through a time-delayed vault, or limiting the recipient. It could bring safer self-custody, but it also sparks debate over complexity and risk — a microcosm of how Bitcoin evolves “slowly and conservatively.”",

  intuition: `
Today's scripts (Stage 4.2) mainly govern "**who** can spend this coin" (requiring a signature, a hash preimage, a time lock). A **covenant** wants to go a step further: restrict "**how this coin may be spent in the future**" — constraining the form of the next transaction (where the money can go, how long it must wait first, what structure it must preserve).

The most compelling use case is the **vault**:

- After you deposit coins into a vault, you stipulate that **any withdrawal must first enter a delay period.**
- If a hacker steals your hot key and initiates a withdrawal, it gets stuck in the delay period; the moment you notice, you can use a **recovery key** to take the coins back.
- So "a single key being stolen" no longer equals "the coins are gone."

Simulate one on the right: open/close a vault and see what happens after the thief initiates a withdrawal.

But greater power also means greater risk (easier to get wrong, potential impact on fungibility), so proposals like this (e.g. **CTV / OP_VAULT**) are to this day **still under discussion, not yet enabled** — which is exactly how Bitcoin demonstrates its **careful evolution.** This lesson covers both "what covenants can do" and, more so, "why Bitcoin would rather go slow."

**In this lesson we break "covenants and evolution" into four pieces:**

- **① What covenants actually add — from "who can spend" to "how it's spent"**
- **② How a vault defends against theft — the attack-and-defense of delay + recovery path**
- **③ More use cases and the costs — the more powerful, the larger the risk surface**
- **④ Why it still isn't enabled — Bitcoin's "better slow than messy" upgrade philosophy**
`,

  mechanics: `
### ① What covenants add: from "who can spend" to "how it's spent"

To see covenants clearly, first recall the boundaries of existing scripts (Stage 4.2):

- Today's scripts can verify the unlocking conditions for spending **this** transaction — whether a signature is needed, whether a preimage of some hash is needed, whether a time lock must elapse. But they **have no say over the next transaction**: once the conditions are met and the coin is unlocked, where it goes and how it's spent is something the script doesn't ask about at all.
- **Covenants break exactly this boundary**: they let an output **constrain the structure of the next transaction it participates in** — for example, stipulating "spend me, fine, but the resulting funds can only go to address A," "it must first pass through an N-block delay," "the amount must be locked, untouched, back into the same kind of covenant."
- There are two kinds of implementation approaches: one lets scripts **inspect/compare fields of the future transaction** (such as \`OP_CHECKTEMPLATEVERIFY\`/CTV, which hard-codes the template hash of the next transaction); the other introduces **introspection** opcodes that let a script read the transaction's own inputs and outputs before deciding (such as the \`OP_CAT\`, Elements' \`OP_CHECKSIGFROMSTACK\`-style approaches). The means differ, the goal is the same: **let a coin "remember" the rules it must obey in the future.**

### ② How a vault defends against theft: delay + recovery path

The vault is the covenant's most compelling killer use case; let's walk through its attack-and-defense:

- **Deposit**: you lock coins into a vault address. The covenant stipulates: to withdraw, you must first broadcast an "**unlock/trigger**" transaction that sends the coins into an intermediate state with a **mandatory delay (e.g. 144 blocks ≈ 1 day)**, after which they can actually be withdrawn.
- **Normal use**: when you withdraw yourself, you initiate the trigger, wait out the delay, and withdraw — just a day's extra wait.
- **Under theft**: a hacker steals your **hot key** and initiates a withdrawal — but they too can only take the same path, **forcibly stuck in that delay.** When you (or a monitoring service) see a withdrawal "I never initiated" enter the delay, the alarm goes off.
- **Reclaim**: you use the offline-stored **recovery key** to trigger an "abort/clawback" path, moving the coins somewhere safer (or even destroying them so no one can take them). **The result: a single stolen hot key no longer equals all coins lost.** This turns Bitcoin's most painful single point of failure — "private key stolen = funds zeroed" — into "there's still a recoverable gate."

### ③ More use cases and the costs

The value of covenants goes far beyond vaults, but every bit of capability carries a corresponding risk:

- **More use cases**: **congestion control** (using a single CTV commitment to bundle hundreds or thousands of payments into one on-chain transaction, unfolding them when the network is idle — saving fees, easing congestion); easier, more trustless **Lightning channel factories** and second-layer structures (callback 8.3); programmable **custody, inheritance, and fixed-amount payment** schemes, and more.
- **Cost one · complexity and bugs**: the more expressive the power, the larger the surface for a script to "misfire." Covenants can saddle a coin with a chain of rules, and **a hard-to-spot logic flaw could lock a coin away permanently or let it be spent down an unintended path.** Bitcoin carries enormous value, so such an error is extremely costly.
- **Cost two · fungibility concerns**: if a coin can have "how it must be spent in the future" attached to it, might there appear **"tainted/locked" coins** — coins forced to only transfer to a whitelist, say, or stamped with an indelible mark? This would harm **fungibility** (callback 9.1: good money should have every unit be equal and interchangeable). This is one of the opponents' core worries.
- That is why the community will **re-evaluate each specific proposal for years**, weighing whether "the benefits it unlocks" outweigh "the risk surface it opens."

### ④ Why it still isn't enabled: better slow than messy

The story of covenants is, in the end, a lesson on **how Bitcoin evolves** (callback 6.4):

- **An extremely prudent process**: anyone can propose a **BIP** (such as **BIP119 / CTV**, **OP_VAULT**, etc.), but to actually land it must pass **long-term public review, a reference implementation, and broad testing**, and finally be a **soft fork voluntarily adopted by the economic majority** running nodes — no one can force it through (callback 8.1's lesson from the scaling war: even miner hashrate couldn't force things through).
- **Years of debate is the norm, not the exception**: CTV was proposed years ago and is still being debated back and forth — "whether to do it, which scheme, whether the risk is small enough." To outsiders it looks "absurdly slow," but this is precisely a **feature, not a flaw.**
- **Why it must be this slow**: Bitcoin is a monetary system that is **globally shared, carries trillions in value, and whose changes are nearly irreversible.** Once something added turns out to be flawed, the loss can't be undone. So its default stance is that **stability and security outweigh new features** — "**better one fewer feature than one more vulnerability.**"
- Its moat has never been only cryptography, but this **social consensus that "any change must convince almost everyone, and better slow than messy."** Covenants may someday be enabled in some most-restrained form, but the long review road they have walked (and are still walking) is itself the best footnote to Bitcoin's security philosophy.
`,

  demo: "vault",

  analogy: `
An ordinary lock only asks "do you have the key?"; a covenant is like a **smart lock that also dictates "where the money may go once it leaves, and how long it must wait."**

It can build a vault where "even a thief with the key can't make off with the coins" — but the smarter the lock, the larger the surface for bugs. So Bitcoin would rather argue over it for years than lightly add new mechanisms to this "lock shared by everyone."
`,

  misconceptions: [
    "“Covenant functionality is already in Bitcoin.” — Not yet. They're proposals (like CTV/OP_VAULT), not yet enabled via a soft fork.",
    "“Slow upgrades mean Bitcoin is rigid and backward.” — This is deliberate conservatism: for a system carrying enormous value, stability and security come before adding features.",
    "“More features is always better.” — Greater expressive power also means a larger error surface and new risks, requiring careful trade-offs.",
    "“Developers can add whatever they want.” — Any change must pass long-term review and be voluntarily adopted by the economic majority of nodes before it can land.",
  ],

  quiz: [
    {
      q: "What capability do covenants seek to add?",
      options: ["Faster block production", "Restricting ‘how a UTXO may be spent’ in the future", "Increasing the supply", "Eliminating fees"],
      answer: 1,
      explain: "Extending from ‘who can spend’ to constraining ‘how it's spent.’",
    },
    {
      q: "What's the key theft-protection mechanism of a vault?",
      options: ["Encrypting the private key", "Withdrawals first enter a delay period, during which a recovery key can take the coins back", "Never withdrawing", "Mining more"],
      answer: 1,
      explain: "Delay + recovery path, so even a stolen key can't make off with the coins.",
    },
    {
      q: "What is the current status of covenant proposals (CTV/OP_VAULT)?",
      options: ["Enabled long ago", "Still under discussion, not yet enabled via a soft fork", "Permanently banned", "Run privately by miners"],
      answer: 1,
      explain: "Bitcoin evolves carefully; major changes need long-term consensus.",
    },
    {
      q: "Why does Bitcoin upgrade so slowly?",
      options: ["The tech is too poor", "Deliberate conservatism: it carries enormous value, so stability and security come first and need economic-majority adoption", "No one maintains it", "Satoshi forbids it"],
      answer: 1,
      explain: "Callback 6.4: ‘better slow than messy’ is its security philosophy.",
    },
  ],

  further: [
    { label: "Bitcoin Optech: Covenants topic", url: "https://bitcoinops.org/en/topics/covenants/" },
    { label: "BIP119 (OP_CHECKTEMPLATEVERIFY / CTV)", url: "https://github.com/bitcoin/bips/blob/master/bip-0119.mediawiki" },
  ],
};
