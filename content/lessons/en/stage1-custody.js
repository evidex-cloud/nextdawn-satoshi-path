export default {
  id: "custody",
  stage: 1,
  order: 4,
  title: "Self-Custody vs. Exchanges: Your Keys, Your Coins",
  difficulty: "intro",
  prereqs: ["wallets"],

  oneLiner:
    "Leave your coins on an exchange and all you get is the platform's “IOU” — just like the bank deposits from Stage 0, it can be frozen, misappropriated, or blow up along with the platform. Self-custody (controlling your own private keys) is what truly holding Bitcoin means. It all distills into one slogan: Not your keys, not your coins.",

  intuition: `
You "bought 1 bitcoin" on an exchange, but as long as the coin stays on the exchange, **the private key to that on-chain coin is actually in the platform's hands.** The number in your account is essentially an **IOU** — the platform owing you 1 bitcoin.

Sound familiar? This is exactly the old problem of **fiat and bank deposits** from Stage 0, coming back around — and as we just learned in the last lesson: the private key is ownership itself. Whoever holds the private key owns the coin. The scenario demo on the right walks you through both paths — "the exchange blows up" and "self-custody" — to compare the endings with your own eyes.

**In this lesson we break "self-custody vs. exchanges" into four pieces:**

- **① Coins on an exchange are just an IOU — the private keys aren't in your hands**
- **② The three risks of custody — freezing, misappropriation, blow-up**
- **③ What self-custody gains you, and what it costs you — from counterparty risk to self-custody risk**
- **④ Division of labor in practice — exchanges to trade, self-custody to lock in your gains**
`,

  mechanics: `
### ① Coins on an exchange are just an IOU

The "balance" you see on an exchange is a number in the platform's database — **not an on-chain UTXO whose private key you can control.** Most exchanges pool large numbers of customers' coins into a few of their own wallets ("hot wallet + cold wallet") and use an internal ledger to record "who should have how much."

- This means the relationship between you and the platform is **creditor / debtor**: the platform owes you 1 BTC, which is the same structure as a bank owing you a deposit (Stage 0.2).
- When the platform goes bankrupt, you're often just an **unsecured creditor**, forced to queue for liquidation, with how much you'll recover and when both uncertain — FTX users are still mired in a long recovery process to this day.
- One widely circulated line captures it all precisely: **Not your keys, not your coins.** If the keys aren't in your hands, "your coins" are just a promise on someone else's ledger.

### ② The three risks of custody

Leaving coins on a platform means you bear three typical risks at once:

- **Freezing / censorship**: the platform can **freeze your withdrawals** for compliance, risk control, disputes, or administrative orders — your money is legally held up.
- **Misappropriation / leverage**: the platform may take customer assets to lend, make markets, or add leverage. **FTX** did exactly this, diverting customer funds to its affiliate Alameda for reckless bets; when the hole blew open, billions of dollars of customer assets evaporated.
- **Hacked / bankrupt / absconding**: an exchange is a "honeypot" in hackers' eyes. **Mt. Gox** once handled about **70%** of global Bitcoin trading volume, and collapsed in 2014 after prolonged theft and management chaos, with roughly **850,000** BTC unaccounted for. Size never equals safety.

### ③ What self-custody gains you, and what it costs you

**Self-custody** means the private keys (the seed phrase) are in your own hands, and the coins are recorded directly on-chain at an address you control. What it does is essentially a **swap of risks**:

- **What you gain**: no one can freeze, misappropriate, or reverse your coins, and no platform can blow up on your behalf — you truly "hold" Bitcoin.
- **What you give up**: you go from "**counterparty risk**" (fearing the platform) to "**self-custody risk**" (fearing yourself). Now what you fear is losing your seed phrase, being phished, or your backup burning in a fire or soaking in water.
- So self-custody isn't "zero risk" — it moves the risk from a third party you **can't control** to yourself, whom you **can control through good habits.** This is exactly why the backup and anti-scam habits in the next lesson (Stage 1.5) are **required coursework** for self-custody.

### ④ Division of labor in practice: exchanges to trade, self-custody to lock in your gains

The two aren't either/or but a **division of labor**:

| Dimension | Exchange (custodial) | Self-custody |
| --- | --- | --- |
| Who holds the private keys | The platform | You yourself |
| Main risk | Freezing, misappropriation, blow-up | Losing them yourself or being scammed |
| Best for | Trading, short-term turnover, small amounts | Long-term holding, larger amounts |

- **A typical flow**: **buying / depositing** on an exchange is convenient, but after you buy — especially as the amount grows — **withdrawing the coins to a wallet whose private keys you control** (a hardware wallet for large amounts) is what truly locks in your gains.
- **On "Proof of Reserves"**: the industry uses it to self-attest that a platform really holds full reserves. But it can only prove "there were this many coins on-chain at one moment" — it can't prove the platform isn't simultaneously carrying enormous liabilities, nor can it stop later misappropriation. **It eases information opacity but can't eliminate the fundamental risk of custody.** The only real cure is still: hold your own private keys.
`,

  demo: "custody-scenario",

  analogy: `
Leaving coins on an exchange is like storing gold bars **in a vault someone else runs**, holding only a claim slip. Normally you can redeem gold with the slip, but the moment the vault owner locks the doors and runs off with the money, your slip becomes worthless paper.

Self-custody is moving the gold bars back into **your own home safe**: no one can open the door for you, but you also have to guard the key yourself — lose it, and no one can issue a replacement.
`,

  misconceptions: [
    "“Coins are safest on a big platform — they're so big they won't have problems.” — Mt. Gox was once the world's largest exchange, and FTX was once valued in the tens of billions; both collapsed. Size doesn't equal safety, and the fundamental risk of custody is always there.",
    "“Self-custody is too geeky — ordinary people can't handle it.” — Hardware wallets and phone wallets are quite user-friendly now; the hard part isn't the operation but building the habits of backing up your seed phrase and guarding against phishing (next lesson).",
    "“Seeing a balance on the exchange means I hold Bitcoin.” — That's the platform's liability number. Only by withdrawing to an address whose private key you control do you get coins that truly belong to you on-chain.",
  ],

  quiz: [
    {
      q: "What does “Not your keys, not your coins” mean?",
      options: ["A coin without a keyhole isn't a real coin", "If you don't control the private keys, the coins don't truly belong to you", "If you lose the key, the coins refund automatically", "Coins on an exchange are worth more"],
      answer: 1,
      explain: "Coins on an exchange = the platform's IOU to you; only by controlling your own private keys do you truly hold them.",
    },
    {
      q: "What is the main risk of leaving coins on an exchange?",
      options: ["The address will expire", "The platform freezing, misappropriating, or blowing up", "Higher fees", "The coins depreciating faster"],
      answer: 1,
      explain: "This shares the same root as the bank and fiat counterparty risk from Stage 0.",
    },
    {
      q: "What does self-custody swap the risk for?",
      options: ["No risk at all anymore", "The responsibility of safeguarding your own keys and avoiding scams", "A higher tax", "Twice the platform risk"],
      answer: 1,
      explain: "Counterparty risk → self-custody risk, which is why security habits are required coursework.",
    },
    {
      q: "For larger amounts and long-term holding, what's the more prudent approach?",
      options: ["Keep it on the exchange the whole time", "Withdraw to a (hardware) wallet whose private keys you control", "Spread it across ten exchanges", "Convert to fiat and put it in the bank"],
      answer: 1,
      explain: "Use exchanges for buying and selling; secure your holdings with self-custody.",
    },
    {
      q: "An exchange published a “Proof of Reserves.” What can that demonstrate?",
      options: ["It completely eliminates custody risk, so you can safely store coins there long-term", "Only that there were this many coins on-chain at one moment — not that it isn't simultaneously carrying enormous liabilities or won't misappropriate later", "That its coins are worth more than other exchanges'", "That your private keys are in your own hands"],
      answer: 1,
      explain: "Proof of Reserves eases information opacity but can't eliminate the fundamental risk of custody — the only real cure is holding your own private keys.",
    },
  ],

  further: [
    { label: "Wikipedia: Mt. Gox", url: "https://en.wikipedia.org/wiki/Mt._Gox" },
    { label: "Wikipedia: Bankruptcy of FTX", url: "https://en.wikipedia.org/wiki/Bankruptcy_of_FTX" },
  ],
};
