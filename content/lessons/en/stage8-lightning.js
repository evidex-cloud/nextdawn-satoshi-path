export default {
  id: "lightning",
  stage: 8,
  order: 3,
  title: "The Lightning Network: Moving Small Frequent Payments Off-Chain",
  difficulty: "core",
  prereqs: ["segwit", "tx-size-fees"],

  oneLiner:
    "The Lightning Network is Bitcoin's “second layer”: two people first open a “payment channel” on-chain, after which they can pay each other back and forth instantly and at almost zero fee, entirely off-chain; only opening and closing the channel ever hit the main chain. Connect channels into a network and you can “route” a payment to anyone through intermediaries.",

  intuition: `
The base layer produces one block every 10 minutes and has limited space — inherently unsuited to high-frequency small payments like "buying a cup of coffee." The **Lightning Network** is Bitcoin's **second layer** — it moves those payments **off-chain**, touching the main chain only at the start and the end.

In one sentence: two people first **open a channel** on-chain (escrow funds into a jointly controlled address), after which they can pay each other **back and forth instantly and at almost zero fee** inside the channel, never touching the chain; when they're done they **close the channel** and settle the final balances back to the main chain in one shot. So **thousands of payments take up just 2 transactions on the main chain.** Connect countless channels into a network and, with **routing**, you can even pay someone you've never opened a channel with, through intermediaries.

Open a channel on the right, pay a few times back and forth, then close and settle — and feel how "off-chain is instant, and the main chain only sees two transactions."

**In this lesson we break the Lightning Network into four pieces:**

- **① The life of a channel — open, pay, close**
- **② Why no one can renege — revocation keys and the penalty**
- **③ How to pay a stranger — routing and HTLCs**
- **④ The current state, the trade-offs, and other second layers**
`,

  mechanics: `
### ① The life of a channel: open, pay, close

- **Open the channel (one on-chain transaction)**: Alice and Bob lock funds into a **2-of-2 multisig** address (callback 7.4; both must sign to move it). Say they each escrow 0.05 BTC, for a total channel capacity of 0.1. Once this "**funding transaction**" confirms on-chain, the channel is open. Note: although the funds are locked in a jointly controlled address, **either party can unilaterally close the channel at any time and reclaim their share** — there is no "I can't get my money back if the other party won't cooperate" risk. This is a prerequisite for Lightning's safety.
- **Pay back and forth off-chain**: after that, the two keep **exchanging re-signed "balance commitment transactions"** — each payment updates both balances (e.g. from "Alice 0.05 / Bob 0.05" to "Alice 0.04 / Bob 0.06"). These commitment transactions are **both signed, each side holds a copy, but neither is broadcast**; they **can** be put on-chain at any time, but as long as both keep cooperating they stay off-chain. So payments are instant, almost free, unlimited in count, and as small as **a fraction of a satoshi (millisatoshis, msat)** — something the main chain can't do. **It is precisely because SegWit fixed transaction malleability (last lesson) that this mechanism — a "commitment transaction referencing an as-yet-unconfirmed / unbroadcast funding transaction" — doesn't collapse when the txid gets changed.**
- **Close the channel (one on-chain transaction)**: there are two kinds. **Cooperative close** — both are online and negotiate a clean settlement transaction, cheap and fast; **force close** — the other party is unreachable or cheating, so you unilaterally broadcast the latest commitment transaction on-chain and settle by the balances recorded in it (your share may have to wait out a time lock before you can move it, see ②). Either way, the main chain only sees **open + close**, two transactions; it knows nothing of the thousands in between.

### ② Why no one can renege: revocation keys and the penalty

Off-chain payment relies on "both parties holding a commitment that can be put on-chain at any time." The flaw is obvious: I **keep every old version of the commitment transaction**, so what if I pick an **old one, from back when my balance was higher**, and broadcast it to renege? Lightning seals this off with a mechanism called **LN-Penalty**:

- **Every time the state updates to a new one, the two parties exchange the previous state's "revocation key"** — effectively handing the counterparty a "self-destruct switch" that voids the old state.
- At the same time, **your own share** in the commitment transaction has a **time lock added (e.g. 144 blocks ≈ 1 day)**: after you force-close, you have to wait out this period before you can take your money.
- That delay is the counterparty's **counterattack window**: the moment you broadcast a voided old state, the counterparty can use the revocation key they hold to **sweep all the funds in the channel (including your share) in one go**, within the delay.
- **Cheating = bankruptcy**, while honest settlement is completely unharmed — so "settle honestly by the latest state" becomes the only rational choice. This "replace trust with economic penalty" design is of a piece with mining's "honesty pays most" game (Stage 9.4), and is the root of Lightning's trustlessness.

### ③ How to pay a stranger: routing and HTLCs

You don't have to open a channel with everyone (that would take N² channels, which is impractical). As long as a **channel path** exists (you → Bob → Carol), you can send the money **atomically** to Carol through Bob. The key tool is the **HTLC (Hashed Time-Locked Contract)**:

- Carol first generates a random number (the **preimage** \`R\`), computes its **hash** \`H = hash(R)\`, and gives you \`H\` via an invoice.
- You say to Bob: "Here's a conditional 0.01 — **whoever can produce a preimage whose hash equals \`H\`, within 48 hours**, can claim it; if it times out, it returns to me."
- Bob says the same to Carol, but with a **shorter deadline (e.g. 24 hours)** — this **decreasing time lock** is crucial: it guarantees the upstream "renege window" is always longer than downstream, so once downstream claims, upstream always has time to claim too.
- Carol knows \`R\`, reveals it to Bob to claim Bob's hop; Bob, now holding \`R\`, reveals it to you to claim your hop. **The preimage unlocks the whole path in reverse, like a row of dominoes.**
- The result: **either the whole path settles successfully, or (after timeout) everything is safely refunded**, and no hop in the middle can **steal it** (without \`R\` you can't claim) or **freeze your money** (timeout auto-refunds). Bob, as the intermediary, earns a tiny **routing fee** as a reward for providing liquidity. (This "conditional payment via a hash preimage" is also the basis of **cross-chain atomic swaps**.)

### ④ The current state, the trade-offs, and other second layers

Lightning isn't a cure-all; it has real trade-offs:

- **Liquidity and capacity**: you can only receive up to your channel's **inbound capacity** and only pay up to your **outbound capacity**. New users often hit "can't receive payments" because nobody has pushed funds toward your side yet. Managing liquidity (opening channels, rebalancing) is Lightning's central pain point, and it gave rise to roles like the **LSP (liquidity service provider)**.
- **Stay online / watchtowers**: catching cheating yourself and striking back within the counterattack window requires your node to be **online**. Afraid someone will broadcast an old state while you're offline? You can delegate a **watchtower** — hand it the encrypted "penalty transaction," and it watches your channel 24/7 and triggers the confiscation on your behalf.
- **The small-payment UX compromise**: running your own Lightning node has a non-trivial barrier, so many phone wallets lean **custodial or semi-custodial** (managing channels for you), trading a bit of self-custody for ease of use — the old "Not your keys" problem returns in a new form on the second layer (callback 1.4).
- **Other second-layer routes**: Lightning is currently the most mainstream off-chain scaling solution, but not the only one. **Sidechains** (such as the federated **Liquid**, with faster settlement and the ability to hide amounts, but requiring trust in a federation), **Ark**, **statechains** and others each have their own trade-offs; and if **covenants (Stage 9.3)** are ever enabled, they may unlock new designs like easier channel factories and trustless vaults. Scaling is a road still being paved.
`,

  demo: "lightning-channel",

  analogy: `
Opening a channel is like **starting a tab** with the café you frequent: you each put down a deposit (on-chain once), and after that every daily coffee is just a mark on the little tab — fast, no fee, never bothering the bank; when you stop going, you settle the tab's final balance in one shot (on-chain once).

Routing is like this: you have a tab with A, and A has a tab with B, so you can **pay B — whom you've never dealt with — through A**, and A in the middle can neither skim anything nor renege.
`,

  misconceptions: [
    "“The Lightning Network is a different coin.” — It isn't. It is Bitcoin; it just moves transactions off-chain and uses the main chain for final settlement.",
    "“Off-chain transactions aren't safe — the counterparty can renege.” — Cheating by broadcasting an old state gets all your funds confiscated by the penalty mechanism; multi-hop routing is kept un-interceptable by HTLCs.",
    "“Using Lightning means never touching the main chain at all.” — Opening and closing a channel are still two on-chain transactions; what you save are the thousands in between.",
    "“The intermediaries who route can steal the money I send.” — They can't. HTLCs make a path either fully succeed or be safely refunded, so a middleman can't pocket it.",
  ],

  quiz: [
    {
      q: "For a Lightning channel, which operations need to go on-chain?",
      options: ["Every single payment", "Only opening and closing the channel", "Nothing ever goes on-chain", "Once every hour"],
      answer: 1,
      explain: "The huge number of small payments in between happen off-chain, taking just 2 main-chain transactions.",
    },
    {
      q: "What structure locks a Lightning channel's funds?",
      options: ["An exchange account", "A 2-of-2 multisig jointly controlled address", "A mining pool", "A new block"],
      answer: 1,
      explain: "Callback 7.4 multisig; its safety in turn depends on SegWit's malleability fix.",
    },
    {
      q: "What happens if someone broadcasts an old channel state that favors themselves, to renege?",
      options: ["They get away with it", "The penalty mechanism confiscates all the funds in the channel", "No one can do anything", "An exchange compensates"],
      answer: 1,
      explain: "The cost of cheating is enormous, making honest settlement the rational choice.",
    },
    {
      q: "What keeps an intermediary from stealing money in multi-hop routing?",
      options: ["Trust", "HTLCs (Hashed Time-Locked Contracts), which make a path either fully succeed or be safely refunded", "Insurance", "Fees"],
      answer: 1,
      explain: "HTLCs make the path atomic, so it can't be intercepted midway.",
    },
  ],

  further: [
    { label: "Wikipedia: Lightning Network", url: "https://en.wikipedia.org/wiki/Lightning_Network" },
    { label: "Lightning Network whitepaper (Poon & Dryja)", url: "https://lightning.network/lightning-network-paper.pdf" },
    { label: "learnmeabitcoin: Lightning / Layer 2", url: "https://learnmeabitcoin.com/beginners/guide/" },
  ],
};
