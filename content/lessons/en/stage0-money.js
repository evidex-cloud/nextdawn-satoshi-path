export default {
  id: "money",
  stage: 0,
  order: 1,
  title: "What Is Money: From Seashells to Gold",
  difficulty: "intro",
  prereqs: [],

  oneLiner:
    "Money wasn't invented by governments — it emerged spontaneously from the market to escape the inefficiency of barter. Which thing gets to be money depends on a set of hard properties: portable, durable, divisible, verifiable, and above all scarce.",

  intuition: `
Imagine a world with no money: you raise chickens and want a pair of shoes. But the shoemaker doesn't want chickens — he wants rice. So you first have to trade chickens for rice, then rice for shoes... This requirement that "both parties happen to want exactly what the other has" is called the **double coincidence of wants**, and it's so inefficient that any real division of labor and cooperation can barely get off the ground.

To escape this hassle, people spontaneously settled on something **everyone is willing to accept** as the "in-between medium" for trade — seashells, salt, livestock, and finally gold. The essence of money is really just **the single most sellable, most universally accepted commodity.**

Once you grasp that "money is something the market selects for itself," the remaining question becomes: **why this thing and not something else?** Behind that lies a set of hard properties you can score one by one, and an evolutionary path that's been clearly visible for thousands of years. The "money scorecard" on the right lets you line up gold, fiat, and Bitcoin against these properties and grade them.

**In this lesson we break "what money is" into four pieces:**

- **① Why money appears — from barter to an "in-between medium"**
- **② The five hard properties of good money — portable, durable, divisible, verifiable, scarce**
- **③ The three functions of money — medium, yardstick, store**
- **④ Why gold won for thousands of years — scarcity and the "stock-to-flow ratio"**
`,

  mechanics: `
### ① Why money appears: from barter to an "in-between medium"

A society without money can only do **barter**, and it gets stuck at two gates:

- **The double coincidence of wants**: you have chickens and want shoes, so you must find someone who "has shoes and also happens to want chickens." The more people there are and the finer the division of labor, the less likely such a coincidence ever lands.
- **No common unit of value**: one chicken for how many pairs of shoes? One pair of shoes for how many pecks of rice? With no shared yardstick, every pair of goods needs its own separate negotiation, and the number of combinations explodes.

The solution is that the market spontaneously picks out the **most sellable commodity that everyone will accept**, converting your goods into it first and then using it to buy what you want. This in-between commodity is money. Note the order: **money isn't something anyone invented — it's filtered out by the standard of "sells most easily"** — and this is exactly how the economist Carl Menger explained the origin of money.

### ② The five hard properties of good money

Whether a commodity can win the competition and become money depends on its overall score across five properties:

- **Portable**: easy to carry and transfer. An ox can be a store of value, but you can't slip it into your pocket to buy a drink.
- **Durable**: doesn't rot or spoil when held over time. Grain molds and livestock dies; bury gold for a thousand years and dig it up, and it's still gold.
- **Divisible**: can be split into small portions to buy cheap things, and combined into large portions to buy expensive ones. Diamonds are extremely hard to divide evenly, so they make poor money.
- **Verifiable**: the receiver can confirm at low cost that it's genuine and full weight. Touchstones in antiquity, or biting a gold coin, were ways of verifying.
- **Scarce**: **this is the most crucial one** — it can't be easily produced in greater quantity, or new issuance devalues it. Note that scarcity really means "hard to produce more of," not just "few in number right now."

No commodity scores full marks on all five; money is the one with the **highest overall score**. In the scorecard on the right, you'll see gold winning on durability and scarcity, fiat winning on portability and divisibility, and Bitcoin pushing "scarcity" to the extreme (we go deeper in Stages 0.2 and 0.4).

### ③ The three functions of money

Money does three jobs in an economy, which you can think of as "applications" of the properties above:

- **Medium of exchange**: the in-between thing for buying and selling, which directly dissolves the double coincidence of wants — it draws mainly on **portability, divisibility, and verifiability**.
- **Unit of account**: a common unit for pricing everything, giving conversions like "one chicken = 3 pairs of shoes" a shared yardstick — it draws mainly on **divisibility and stability**.
- **Store of value**: saving today's fruits of labor to spend in the future — it draws mainly on **durability and scarcity**.

An order that's often overlooked: historically, a thing tends to **first become the best "store of value," then slowly grow into a medium of exchange and a unit of account**. Grasp this and you'll understand why early Bitcoin looked more like "digital gold" (treated as a store first) rather than first becoming an everyday payment tool.

### ④ Why gold won for thousands of years: scarcity and the "stock-to-flow ratio"

There's a key metric for measuring "how hard" money is: the **stock-to-flow ratio (S2F) = existing total stock ÷ amount newly mined each year**. The larger the ratio, the more even an all-out global mining effort adds only a drop in the bucket relative to the stock, and **the harder it is to dilute purchasing power**.

- Gold's annual mining is only about **1.5%–2%** of total stock, giving an S2F of roughly **50–60**, the **highest** among all physical commodities — this is precisely the root reason it served as good money for thousands of years.
- A counterexample: seashells by the shore were scarce at first too, but once someone found they could easily gather and ship far more, new supply exploded, S2F collapsed, and they devalued instantly (this actually happened across the Americas and Africa).
- Why **gold-backed paper notes** appeared: gold has poor portability and is awkward for small payments, so "paper redeemable for gold" emerged — paper as a **claim ticket** on gold. But whether the ticket can always be honored depends on the issuer's honesty, and this planted the seed for the later "decoupling of paper money from gold" (detailed in Stage 0.2).

Lock in S2F as a yardstick: it explains both gold's historical standing and, later on, why Bitcoin's "21 million cap, with predictable issuance trending toward zero" earns it the name "digital gold" (Stages 0.4 and 5.5).
`,

  demo: "money-scorecard",

  analogy: `
Money is like a **language that the whole society speaks**. Language itself has no intrinsic value, but because everyone uses it, it becomes the medium of communication. Money is the same — much of its value comes from "everyone being willing to accept it."

And a good, usable language must be simple, stable, and learnable by anyone; good money likewise must be portable, durable, and scarce. Once something is strongest overall on these properties, it gets spontaneously selected, just like a common tongue.
`,

  misconceptions: [
    "“Money was invented by governments, and governments give it its value.” — Backwards. Historically money predates modern governments; it's a product of spontaneous market evolution. Governments only stepped in later to mint coins and issue notes.",
    "“Something must have intrinsic value (like gold) to count as money.” — Not necessarily. What matters for money is being widely accepted, plus that set of monetary properties. Gold happens to have both, but the reason it can serve as money is that it pushes these properties to the extreme.",
    "“Scarce just means small in quantity.” — A more accurate way to put it is hard to produce more of. Seashells by the shore were scarce at first, but once people found they could easily gather and ship more, they lost value — scarcity truly fails when new supply is too easy.",
    "“Stock-to-flow is just an academic term; it doesn't matter whether you remember it.” — It's actually the core yardstick for judging how hard a thing is: the higher the S2F, the less new supply can dilute the stock, and the steadier the purchasing power. Gold winning, seashells losing, and Bitcoin being called “digital gold” all trace back to this one ruler.",
  ],

  quiz: [
    {
      q: "Where does the biggest inefficiency of barter lie?",
      options: ["Things are too heavy to carry", "It requires both parties to happen to want exactly what the other has", "There's no government oversight", "You can't keep records"],
      answer: 1,
      explain: "This is called the **double coincidence of wants**. It's precisely to escape it that people spontaneously chose an “in-between medium” everyone is willing to accept as money.",
    },
    {
      q: "What was gold's most crucial advantage in holding the throne of money for thousands of years?",
      options: ["Its pretty, lustrous color", "Being extremely durable and hard to produce more of (scarce)", "Being mandated by a king's decree", "Being edible"],
      answer: 1,
      explain: "Durability plus being hard to produce more of (a high stock-to-flow ratio) makes gold's purchasing power hard to dilute.",
    },
    {
      q: "Which of the following is **not** a hard property of “good money”?",
      options: ["Portable", "Divisible", "Automatically appreciating over time", "Verifiable"],
      answer: 2,
      explain: "Good money requires being portable, durable, divisible, verifiable, and scarce. “Automatically appreciating” is not a monetary property — simply holding value steadily is already rare.",
    },
    {
      q: "What does a higher “stock-to-flow ratio (S2F)” mean?",
      options: ["This money is more easily diluted by new issuance", "The amount newly added each year is smaller relative to the total stock, making purchasing power harder to dilute", "There's a smaller total quantity of it", "It's more portable"],
      answer: 1,
      explain: "S2F = total stock ÷ annual new supply. The higher the ratio, the less newly mined supply can water down the existing stock, and the “harder” the money — gold's S2F is the highest among physical commodities.",
    },
  ],

  further: [
    { label: "Nick Szabo: Shelling Out — The Origins of Money (classic essay)", url: "https://nakamotoinstitute.org/shelling-out/" },
    { label: "Wikipedia: History of money", url: "https://en.wikipedia.org/wiki/History_of_money" },
  ],
};
