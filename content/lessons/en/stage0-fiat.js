export default {
  id: "fiat-problems",
  stage: 0,
  order: 2,
  title: "The Problems with Fiat: Trust and Inflation",
  difficulty: "intro",
  prereqs: ["money"],

  oneLiner:
    "After 1971, world money fully decoupled from gold and became pure “fiat currency” — its supply can be expanded without limit, and its value rests on trust in the issuer. This brings two fundamental problems: inflation dilutes your savings, and you must trust a third party that can freeze your account.",

  intuition: `
The word **fiat** comes from the Latin "let it be done." The meaning is blunt: because the government declares it to be money, it is money — there is no longer any gold or physical asset backing it.

Go back to last lesson's ruler: the lifeline of good money is **scarcity**, and scarcity really means "hard to produce more of." Fiat is precisely where this property is fully let go — its supply has no hard ceiling and is decided by policy. That one loosening leads straight to its two unavoidable fundamental problems: **money gets diluted**, and **money isn't truly yours**. The "inflation eroder" on the right lets you feel the first problem directly — that compounding kind of shrinkage.

**In this lesson we break "the problems with fiat" into four pieces:**

- **① What fiat is — "declared to be money," with no physical backing**
- **② How it got here — from the gold standard to the 1971 decoupling**
- **③ Problem one · inflation — how an uncapped supply dilutes your savings**
- **④ Problem two · trust and censorship — the number in your account is just an IOU**
`,

  mechanics: `
### ① What fiat is: no physical backing

In the gold-standard era, paper notes were **claim tickets** on gold — your banknote could, in theory, be taken to a bank and redeemed for a fixed weight of gold, so the amount issued was **hard-constrained** by gold reserves. Fiat severed that redemption link: its value no longer comes from the metal behind it, but from three things — **the government's legal status** (you must pay taxes in it), **the network effect of universal acceptance** (everyone accepts it), and **trust in the issuer** (faith that it won't be printed recklessly).

This "no physical backing" design isn't itself a scam, and its benefits are real: portable, divisible, easy to settle electronically. The problem is that it hands the lifeline of "scarcity" over to policy — and policy can change.

### ② How it got here: from the gold standard to the 1971 decoupling

Decoupling money from gold happened in several steps:

- **The classical gold standard (about 1870s–1914)** → major currencies were directly anchored to gold, issuance was constrained by gold reserves, and prices were quite stable over the long run.
- **The 1944 Bretton Woods system** → the US dollar was anchored to gold (**$35 per ounce**), and other currencies were anchored to the dollar, which indirectly pegged them to gold.
- **The 1971 Nixon shock** → because the dollars the US had issued abroad far exceeded its gold reserves, countries (France especially) increasingly demanded redemption in gold, so the US simply **closed the "dollar-into-gold" window**. The dollar fully decoupled from gold, and the world entered the **pure-fiat era** — the watershed of modern monetary history.

Remember this date: **1971** is the starting point for nearly every discussion that follows (in Stage 0.4 you'll see that Bitcoin is precisely a response to it).

### ③ Problem one · inflation: how an uncapped supply dilutes savings

The essence of inflation is more accurately seen from another angle: **it's not that "prices are rising on their own," but that "the purchasing power of money is falling."** When money grows but goods don't grow in step, the same basket of things naturally costs more.

- **How money grows**: the central bank and the commercial-bank system expand the **broad money supply (M2)** through tools like **credit expansion** and **quantitative easing (QE)**. There's no hard ceiling on the supply side; the speed of new issuance is decided by policy.
- **How brutal compounding shrinkage is**: a seemingly mild **2%** inflation per year **halves purchasing power in 35 years** (0.98 to the 35th power ≈ 0.49); if some years spike to **7%**, purchasing power halves in **just 10 years**. Stretch the timeline out and almost every fiat currency is in a long-term decline against real goods.
- **Who gets hurt most**: people living on cash and savings have their fruits of labor quietly thinned, while those who receive the new money first (financial institutions near the issuance spigot, asset holders) spend, buy, and benefit first — this unfairness of "whose hands the new money reaches first" is called the **Cantillon effect**.

### ④ Problem two · trust and censorship: your money is just an IOU

In the digital age, your "money" is mostly a string of numbers on a bank's ledger. Legally, **a bank deposit is the bank's liability to you** — that is, an IOU. This means a long chain of third parties (banks, payment processors, governments) hold real power over your money:

- **Can freeze**: an account can be frozen for compliance review, disputes, or administrative orders, and withdrawals blocked.
- **Can seize / reverse**: a transaction can be undone, and funds pulled away.
- **Can refuse**: payment rails can refuse to serve certain people or certain transactions (financial censorship).
- **Can fail**: the bank itself may go bankrupt — most countries have deposit insurance, but with a **cap** and conditions, and anything beyond it remains counterparty risk.

The 2008 financial crisis laid this system's fragility bare: excessive trust in third parties, followed by the massive bank **bailouts**, made people see what "money on someone else's ledger" really means. This is the immediate historical backdrop for Bitcoin's birth — the next lesson's double-spend problem, and the newspaper headline embedded in the Stage 0.4 genesis block, both connect right here.
`,

  demo: "inflation-eroder",

  analogy: `
Fiat is like a card game everyone is playing, but **the house can keep dealing extra chips onto the table whenever it likes**. The number of chips in your stack hasn't changed, yet as the house keeps printing new chips into play, what your stack can buy keeps shrinking.

More subtly: whether you can cash out your chips, or even carry them out of the room, still requires **the house's nod**.
`,

  misconceptions: [
    "“Inflation is just prices rising on their own.” — More accurate from another angle: it's usually the purchasing power of money falling. The same basket of things costing more is often because money has grown more plentiful and weaker.",
    "“Money in the bank is my money, perfectly safe.” — Legally, a bank deposit is the bank's liability to you. When a bank fails or an account is frozen, what you face is counterparty risk (most countries have deposit insurance, but with caps and conditions).",
    "“Mild inflation is completely harmless, even a good thing.” — That's a contested policy claim. Whatever the conclusion, the continuous dilution of long-term savers' purchasing power is a real, existing cost.",
    "“The dollar was pure fiat before 1971 too, it was just printed more later.” — Not so. Before 1971 the dollar was anchored to gold under Bretton Woods ($35 per ounce), and issuance was constrained by gold; it was only after the 1971 closing of the gold window that we entered a pure-fiat era with no physical constraint at all.",
    "“Inflation just makes everyone poorer together, so it's fair to all.” — It isn't fair. New money reaches financial institutions and asset holders first (the Cantillon effect); they spend and benefit first, while people relying on cash savings get hurt the most.",
  ],

  quiz: [
    {
      q: "What was the key monetary event of 1971?",
      options: ["Bitcoin was born", "The dollar fully decoupled from gold, and the world entered the pure-fiat era", "Gold was discovered for the first time", "Countries abolished currency"],
      answer: 1,
      explain: "This is the “Nixon shock,” the starting point of the modern pure-fiat system.",
    },
    {
      q: "What is the most direct consequence of “fiat can be issued without limit”?",
      options: ["Purchasing power gets diluted (inflation)", "Money expires and becomes void", "Transactions get faster", "Gold automatically appreciates"],
      answer: 0,
      explain: "With no hard cap on supply, every extra unit issued thins out the purchasing power of the money already in existence.",
    },
    {
      q: "What is a “bank deposit” more accurately described as, legally?",
      options: ["Cash in your safe", "A liability the bank owes you (an IOU)", "A kind of company stock", "A gold certificate"],
      answer: 1,
      explain: "It's precisely for this reason that it carries the counterparty risk of being frozen, reversed, or lost to a bank failure.",
    },
    {
      q: "What does a seemingly mild “2% inflation per year” mean over the long run?",
      options: ["Almost no impact, can be ignored", "Through compounding, purchasing power halves in about 35 years", "Prices only rise each February", "Savings automatically appreciate along with it"],
      answer: 1,
      explain: "0.98 multiplied by itself 35 times ≈ 0.49 — compounding shrinkage means “mild” inflation halves the purchasing power of savings over the long term.",
    },
  ],

  further: [
    { label: "Wikipedia: Nixon shock", url: "https://en.wikipedia.org/wiki/Nixon_shock" },
    { label: "Wikipedia: 2007–2008 financial crisis", url: "https://en.wikipedia.org/wiki/2007%E2%80%932008_financial_crisis" },
  ],
};
