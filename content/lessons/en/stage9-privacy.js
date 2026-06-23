export default {
  id: "privacy",
  stage: 9,
  order: 1,
  title: "Privacy: Bitcoin Is “Pseudonymous,” Not “Anonymous”",
  difficulty: "deep",
  prereqs: ["utxo", "taproot"],

  oneLiner:
    "Bitcoin's ledger is fully public — anyone can look up every transaction and every address's balance. You use a pseudonym (an address), not your real name, but the moment someone links an address to you, they can follow the public ledger and trace your money trail. Improving privacy takes habits and tools: use a fresh address each time, avoid needlessly merging UTXOs, and use CoinJoin.",

  intuition: `
A common misconception is that "Bitcoin is anonymous." In reality it's **pseudonymous**: you use an address instead of your real name, but **the whole ledger is public and permanent** — anyone can see how much each address sent and received, and with whom it transacted, and that record **is never deleted**. This is a far cry from the "anonymous like cash" you might imagine.

The danger lies in "putting a name to a number":

- **Address reuse:** always receiving at the same address strings all your income and spending together, like reusing the same phone number over and over.
- **Common-input heuristic:** if a transaction spends 3 of your UTXOs, an analyst assumes those 3 addresses **belong to the same person** and clusters them together.
- **KYC exposure:** the moment the address you withdrew to from a real-name exchange is matched to you, the whole cluster of addresses is matched to your real name too.

Improving privacy relies on **habits + tools**: use a fresh address each time (an HD wallet makes this effortless, callback 7.1), don't casually merge unrelated UTXOs, use **CoinJoin** when needed (mixing your transaction with others' to break the heuristics), and push high-frequency small payments onto the Lightning Network (off-chain).

Toggle CoinJoin on the right and watch the analyst's inference go from "same owner" to "can't tell."

**In this lesson we break "Bitcoin privacy" into four pieces:**

- **① Pseudonymous ≠ anonymous — what a public, permanent ledger means**
- **② The weapons of chain analysis — how heuristics and clustering pin you down**
- **③ The countermeasures — CoinJoin, fresh addresses, Lightning, Taproot**
- **④ The real-world trade-offs and legitimacy — privacy is a practice you must actively maintain**
`,

  mechanics: `
### ① Pseudonymous ≠ anonymous: a public, permanent ledger

The starting point for Bitcoin privacy is recognizing two properties of the ledger: **fully public** and **permanent, undeletable.**

- **Fully public**: the amount, input source, and output destination of every transaction can be looked up by anyone on a block explorer (mempool.space), no permission required. An address is just a string of characters (a pseudonym), but **everything it sends and receives is laid out in the open.**
- **Permanent, undeletable**: on-chain records can't be altered or deleted (Stage 2). A transfer you don't care about today could still, **ten years from now**, be reverse-linked to you by some new analysis technique or some data breach. **Once privacy leaks, it leaks permanently** — this is the most fundamental difference from "cash anonymity": a cash transaction dissipates once it's done, while an on-chain transaction is permanently engraved.
- So "pseudonymity" is a fragile protection: it only holds **as long as no one matches the pseudonym to the real name.** And the entry points for that matching are more numerous than you'd think — exchange KYC, an address exposed when receiving payment, IP correlation, even a tip address you once posted publicly.

### ② The weapons of chain analysis: heuristics and clustering

Chain-analysis firms (like Chainalysis) use a set of **heuristics + clustering** to piece scattered addresses into "entity clusters," then tag them with real identities:

- **Common-input-ownership**: a transaction that spends multiple UTXOs at once is assumed to have those input addresses **belong to the same person** (because usually a single wallet must hold all the private keys to sign them together). This is the strongest and most commonly used heuristic — and it's why "consolidating spends" hurts privacy most.
- **Change-address identification**: a payment often has two outputs, one to the recipient and one as change back to yourself. Analysts guess which is change from amount characteristics (the non-round one, or the one whose address type matches the inputs), thereby merging the change address into your cluster too.
- **Amount and timing correlation**: distinctive amounts and regular timing can string seemingly unrelated transactions together.
- **Once a cluster gets tagged with an identity** (say one of its addresses deposited to a KYC exchange), the cluster's **entire past and future activity** is exposed along with it — which is why a single point of exposure can implicate a whole swath.

### ③ The countermeasures: CoinJoin, fresh addresses, Lightning, Taproot

Against each of the weapons above, a countermeasure:

- **Use a fresh address each time**: directly weakens address reuse and change identification. An HD wallet (callback 7.1) lets you generate endless addresses effortlessly — **always receive at a never-before-used address** is the first lesson of privacy.
- **Avoid merging unrelated UTXOs**: don't spend coins of different origin in the same transaction unless necessary, or you've hand-fed the common-input heuristic. (This sometimes conflicts with saving on fees and requires a trade-off — this is the meaning of "coin control.")
- **How CoinJoin breaks the heuristics**: multiple users pool their inputs into **one transaction** and produce a batch of **equal-value outputs** (e.g. everyone gets back several 0.01 units). This makes "which output belongs to which input" **cryptographically undeterminable**, and the common-input assumption fails outright — it manufactures **plausible deniability**. The cost is needing to coordinate multiple people, and sometimes being flagged by certain exchanges.
- **The Lightning Network (callback 8.3)**: moving high-frequency small payments off-chain means they **leave no trace on the main chain at all**, naturally improving privacy (though routing nodes may observe some information; it's not perfect).
- **How Taproot helps (callback 8.4)**: it makes multisig, contracts, and Lightning channel opens/closes all **look like ordinary single-sig**, erasing the "this is a special wallet/contract" fingerprint and improving the whole network's **fungibility** — when all transactions look the same, analysis gets harder.

### ④ The real-world trade-offs and legitimacy

Finally, a few realities to see clearly:

- **Privacy is a practice, not a default**: Bitcoin **does not automatically** protect your privacy; it requires you to actively maintain it — use the right tools, build the right habits. Don't naively assume "a new address makes me completely invisible"; professional chain analysis is a mature business.
- **Privacy is attack-and-defense, a matter of degree**: there is no "absolute anonymity," only "raising the adversary's analysis cost until it's not worth it." CoinJoin and fresh addresses are about **adding noise and manufacturing ambiguity**, not magic that makes you disappear.
- **Seeking privacy is legitimate**: protecting your financial privacy isn't the same as doing something wrong — just as you wouldn't post your bank statements in the town square, or let the cashier see all the money in your wallet. **Financial privacy is a normal form of self-protection**, and it's also a prerequisite for money's "fungibility" (callback 8.4: when your coins are discriminated against because of their history, they're no longer good money). Stigmatizing the need for privacy as "having something to hide" precisely misunderstands its value.
`,

  demo: "chain-trace",

  analogy: `
The public ledger is like a giant **glass wall** with every transaction etched and wired onto it. You go by a number rather than a name — but the moment someone matches a number to you, they can follow the lines on the wall and see your whole history.

Protecting your privacy is like trying **not to show up repeatedly under the same number, and not to gather unrelated funds into one spend** — so others can't easily connect the dots into a line.
`,

  misconceptions: [
    "“Bitcoin is completely anonymous.” — It isn't. It's pseudonymous: the ledger is public and addresses can be linked to real identities.",
    "“Just use a new address and you're fully anonymous.” — Not enough. Merging UTXOs, timing and amount correlation, and the like can still re-link you.",
    "“Buying on an exchange means no one can trace you.” — A real-name (KYC) exchange is precisely what binds an address to your identity — the biggest de-anonymizing entry point.",
    "“CoinJoin is just illegal money laundering.” — Not so. Protecting privacy is a legitimate need, and CoinJoin is a neutral tool, just as a cash transaction doesn't equal a crime.",
  ],

  quiz: [
    {
      q: "What's the most accurate description of Bitcoin's privacy property?",
      options: ["Completely anonymous", "Pseudonymous: the ledger is public and addresses can be linked to identities", "Completely secret", "Untraceable"],
      answer: 1,
      explain: "Pseudonymous, not anonymous.",
    },
    {
      q: "The “common-input heuristic” means an analyst assumes what?",
      options: ["All outputs belong to one person", "The multiple inputs in a single transaction belong to the same person", "The miner owns the transaction", "The largest amount is the owner"],
      answer: 1,
      explain: "So merging UTXOs in a spend clusters your multiple addresses together.",
    },
    {
      q: "How does CoinJoin improve privacy?",
      options: ["By encrypting the transaction", "Multiple people's inputs are mixed into one transaction producing equal-value outputs, breaking the ‘same owner’ inference", "By hiding amounts down to zero", "By deleting ledger records"],
      answer: 1,
      explain: "It manufactures ambiguity in the input-to-output correspondence.",
    },
    {
      q: "Which of the following **most harms** your privacy?",
      options: ["Using a fresh address each time", "Repeatedly receiving at the same address", "Using Lightning for small payments", "Avoiding merging unrelated UTXOs"],
      answer: 1,
      explain: "Address reuse strings all your income and spending together.",
    },
  ],

  further: [
    { label: "Bitcoin Wiki: Privacy", url: "https://en.bitcoin.it/wiki/Privacy" },
    { label: "learnmeabitcoin: Privacy and chain analysis", url: "https://learnmeabitcoin.com/beginners/guide/" },
  ],
};
