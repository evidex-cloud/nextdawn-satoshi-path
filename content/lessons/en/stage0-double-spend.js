export default {
  id: "double-spend",
  stage: 0,
  order: 3,
  title: "The Century-Old Problem of Digital Cash: Double-Spending",
  difficulty: "intro",
  prereqs: ["money"],

  oneLiner:
    "Digital information can inherently be copied perfectly, without limit — and that's exactly what makes “digital cash” nearly impossible: if money is just a string of numbers, what stops you from spending the same money twice? Before Bitcoin, the only workable solution was to ask a center trusted by everyone (a bank) to keep the books on everyone's behalf.",

  intuition: `
Send you a photo, and you can make ten thousand copies, each one **identical** to the original. In the digital world, "copying" is both free and perfect.

For "digital money" this is fatal: if a coin is just a file, I can send it to Alice, then send **the same file** to Bob — and both think they received the money. This is **double-spending**. The experiment on the right lets you spend the same coin twice with your own hands.

Picking up from the last lesson: fiat relies on the bank as a center to keep the books and stop you from spending money twice. So how could a digital cash with **no bank** ever prevent double-spending? This is precisely the century-old problem that stood in front of "digital cash" for decades. To understand Satoshi's answer, you first have to see clearly where the difficulty lies, how people worked around it before, and why those workarounds couldn't go all the way.

**In this lesson we break "the double-spend problem" into four pieces:**

- **① Why digital cash is inherently double-spendable — copying is free and perfect**
- **② It isn't something encryption can solve — signatures prevent forgery, but not sending one coin twice**
- **③ The real difficulty is "ordering and uniqueness" — who spent first, and can it be changed**
- **④ The old solution and Satoshi's breakthrough — from a trusted center to decentralized consensus**
`,

  mechanics: `
### ① Why digital cash is inherently double-spendable

Physical cash has a natural property: a banknote can be in only one person's hands at any given moment — **once I give it to you it's no longer in my pocket**. Digital information has no such property — its copying is both **free** and **perfect**, and the original and the copy are indistinguishable.

- If a "digital coin" is just a file or a string of numbers, I can send it as-is to Alice, then send **the same one** to Bob, and locally nothing is missing.
- Looking only at the data in hand, the recipient **cannot tell whether it has already been spent to someone else** — the data itself doesn't carry the state of "I've already been used."

So the root of the problem isn't the strength of the encryption, but: **how do you make a piece of data that can be copied without limit behave with cash's uniqueness of "once it's spent, it's gone"?**

### ② It isn't something encryption can solve

A common intuition is "just use stronger encryption," but here you have to separate two different things:

- **Digital signatures / encryption** (mature long before Bitcoin) solve **authenticity and integrity**: proving "this money really was signed and sent out with your private key, and wasn't altered along the way."
- But signatures **can't stop you from sending the same already-signed money to two people**. The transfer signature Alice receives and the one Bob receives are **both genuine and both verify** — a signature only proves "you authorized this spend," not "you haven't also spent the same coin elsewhere."

In other words: encryption can prevent forgery, but **it can't prevent reuse**. This is the key leap in understanding double-spending.

### ③ The real difficulty: ordering and uniqueness

Peel it down to the innermost layer and double-spending is really a **consensus problem**. To prevent it, the whole network must agree on two things:

- **Uniqueness**: who each coin belongs to right now, and whether it has been spent.
- **Ordering**: if the same coin was sent to two people, **whose spend counts as first**, with the other voided.

And this consensus must also be **unchangeable after the fact** — otherwise someone could receive goods and then go back and "erase" that payment. In a world with banks, both of these are adjudicated by a central ledger; in a world with **no center at all**, getting a crowd that is scattered around the globe, mutually distrustful, and possibly offline or malicious to reach undisputed, irreversible agreement on "who spent first" is equivalent to the famous consistency problem in distributed systems, layered on top of forgery and rollback prevention — and was long considered nearly unsolvable.

### ④ The old solution and Satoshi's breakthrough

- **The old solution = a trusted center**: find a center everyone trusts (a bank, a payment company) to maintain a **master ledger**. Each spend is crossed off the ledger, and if you try to spend the same money a second time you're refused. It really does prevent double-spending, but the price is that you must **trust this center** — and it can censor, freeze, charge fees, make mistakes, or even go bankrupt (exactly the old fiat problem from the last lesson).
- **Earlier attempts at digital cash**: David Chaum's **DigiCash (ecash)** was well ahead of its time on privacy, but still relied on a **centralized issuer** to settle; other decentralized attempts could never solve double-spending.
- **Satoshi's breakthrough**: solving double-spending **with no trusted center at all**. The approach was to make the ledger **public and maintained jointly by the whole network**, and then use **proof-of-work** to give transactions a single network-wide agreed order that becomes harder to change the further back it is — anyone wanting to overturn a past spend would have to redo an enormous amount of computation and out-pace the entire network, at a cost so high it's impossible (mechanism details in Stage 2 on the blockchain, and Stage 5 on proof-of-work and the longest chain).

Remember one sentence from this lesson: **Bitcoin's innovation isn't "inventing digital money" — it's "solving double-spending even after removing the trusted center."** In the next lesson, we'll go to the moment Satoshi wrote this answer into the whitepaper.
`,

  demo: "double-spend",

  analogy: `
A digital coin is like a **concert ticket that can be photocopied without limit**. With no central ticket-checking system, I can photocopy the same ticket and send it to ten people, and they all show up to get in.

There are only two ways to solve this: either bring in a **ticket-checker** (centralized — you have to trust them); or — like Bitcoin — have **the whole audience jointly maintain a public registry of "which tickets have already been used,"** which no one can alter.
`,

  misconceptions: [
    "“Double-spending can be prevented with encryption.” — It can't. Encryption only guarantees “it was signed by you and hasn't been changed,” but it can't stop you from sending the same signed money to two people. To prevent double-spending, someone must reach consensus on the order of spending.",
    "“Bitcoin's innovation was inventing digital money.” — Attempts at digital money existed long before. Bitcoin's real innovation was solving double-spending without a trusted center.",
    "“Removing banks is just to save on fees.” — At a deeper level it's to remove the single point of trust and the single point of censorship/failure: no single party can freeze, reverse, inflate, or refuse your transactions.",
    "“Two transfers received at the same time, both with genuine signatures, should both be valid.” — That's exactly the case that exposes double-spending: both signatures are genuine, but the same coin can only be spent once. The system must order them, decide whose spend counts as first, and void the other — which is precisely where the difficulty lies.",
  ],

  quiz: [
    {
      q: "Why is “digital cash” especially hard to build?",
      options: ["Digital information can be copied perfectly, so it's easy to spend twice", "Computers don't have enough power", "The internet didn't exist yet", "Encryption is too slow"],
      answer: 0,
      explain: "Being copyable without limit means the same coin can be spent repeatedly — that's exactly the double-spending problem.",
    },
    {
      q: "Before Bitcoin, what was the mainstream way to prevent double-spending?",
      options: ["Relying on a trusted center (a bank) to keep the master ledger", "Relying on users choosing not to cheat", "Relying on cryptography alone to solve it", "It simply couldn't be prevented at the time"],
      answer: 0,
      explain: "A centralized ledger can prevent double-spending, but the price is that you must trust this center.",
    },
    {
      q: "What was Satoshi's true breakthrough?",
      options: ["Inventing cryptography", "Solving double-spending without a trusted center", "Making all transactions free", "Inventing the internet"],
      answer: 1,
      explain: "Solving double-spending in a decentralized way is exactly what sets Bitcoin apart from every digital currency that came before.",
    },
    {
      q: "Peeled down to the innermost layer, what kind of problem is double-spending essentially?",
      options: ["A problem of encryption not being strong enough", "The problem of getting the whole network to agree on “who spent first, and unchangeable after the fact”", "A problem of the network being too slow", "A problem of not enough storage space"],
      answer: 1,
      explain: "The core is consensus on ordering and uniqueness — in a network with no center and mutual distrust, reaching undisputed, irreversible agreement on the order of spending, which is exactly what Satoshi solved with proof-of-work.",
    },
  ],

  further: [
    { label: "Bitcoin whitepaper · Section 2, Transactions (English)", url: "https://bitcoin.org/bitcoin.pdf" },
    { label: "Wikipedia: Double-spending", url: "https://en.wikipedia.org/wiki/Double-spending" },
  ],
};
