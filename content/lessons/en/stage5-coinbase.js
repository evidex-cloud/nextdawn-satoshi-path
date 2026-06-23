export default {
  id: "coinbase",
  stage: 5,
  order: 5,
  title: "The Coinbase Transaction: How New Coins Are Born",
  difficulty: "core",
  prereqs: ["block-header", "halving"],

  oneLiner:
    "The first transaction in every block is a special “coinbase transaction”: it spends no existing UTXO and instead mints new coins out of thin air — the amount = the block subsidy + all the transaction fees in that block, all going to the miner. This is the one and only way new bitcoin enters circulation.",

  intuition: `
Where does the mining "reward" actually come from? The answer is the **first — and only — special transaction** in every block: the **coinbase transaction**.

Its biggest difference from an ordinary transaction: it has **no real input** (an ordinary transaction must spend an existing UTXO, but the coinbase's "input" is an empty placeholder, **creating new coins out of thin air**); its **output = block subsidy + fees** (the subsidy portion of new coins decreases via the halving, plus **all the transaction fees in this block**, paid together to the miner); and **this is the sole source of new coins** — Bitcoin has no other "issuance valve," and every single coin on the network was originally minted by some block's coinbase.

Drag the block height on the right to see the subsidy, the miner's total income, and the coinbase's special structure across different eras.

**In this lesson we break the "coinbase transaction" into four pieces:**

- **① The structure of creating from nothing — the empty input and that special outpoint**
- **② How the amount is computed — subsidy + fees, and take less and it's burned**
- **③ The coinbase data field — block height, extranonce, and the genesis message**
- **④ Maturity and the end of issuance — 100 confirmations, and after the year 2140**
`,

  mechanics: `
### ① The structure of creating from nothing: the empty input and that special outpoint

An ordinary transaction must reference an existing UTXO as an input (Stage 4.1); the coinbase precisely cannot, because it has to **create something from nothing**. The protocol carves out a dedicated exception for it:

- It has exactly **one input**, whose outpoint points to a **nonexistent UTXO** — the previous TXID is all \`0\` and the output index is \`0xFFFFFFFF\`. This "pointing into the void" special shape is exactly how full nodes recognize "this is a coinbase."
- Since there's no real input, nodes **skip the signature check** when validating it (there's no UTXO to lock, so no unlocking script is needed). The spot where the unlocking script would normally go is freed up as freely-fillable **coinbase data** (see ③).
- It's always the **transaction at index 0** in the block body, and each block **has exactly one**.

### ② How the amount is computed: subsidy + fees, and take less and it's burned

There's a hard cap on how much a miner can write into the coinbase output:

- **Total coinbase output ≤ the block subsidy + the sum of all transaction fees within the block**. Exceed it by even one satoshi and the whole block **violates consensus and is rejected by full nodes** — a red line no miner dares cross.
- **The subsidy** in the Nth halving period is \`50 ÷ 2ᴺ\` BTC: period 0 is 50, period 1 is 25, period 2 is 12.5… today (period 4) it's **3.125 BTC** (callback to Stage 2.5).
- **The fees** are the sum of the "input − output" differences of every ordinary transaction in this block (Stage 4.4) — this portion isn't printed from nothing; it's paid by users.
- Interestingly, a miner **may take less**, but the surplus is neither refunded nor kept — it's **permanently destroyed**. Historically miners really have, due to software bugs, underfilled and burned subsidy for nothing. So a rational miner always **takes the full cap**.

### ③ The coinbase data field: block height, extranonce, and the genesis message

That freed-up coinbase data (2 to 100 bytes) is one of the few "free doodle areas" in Bitcoin:

- Per **BIP34**, it **must begin with the block height**. This was to fix an early problem: if the coinbases of different blocks had identical contents, they'd produce identical TXIDs and collide; forcing the height in guarantees every coinbase is naturally unique.
- It often holds the **extranonce**: when the 32-bit \`nonce\` is scanned dry by a miner in a few milliseconds without a hit, the miner changes the extranonce, which **changes the coinbase → changes the Merkle root → yields a brand-new 80-byte header**, so the \`nonce\` space can be scanned all over again (callback to the mining loop in Stage 5.1).
- The miner can fill the remaining space freely: pools often write their own name or slogan. Satoshi left that Times headline "Chancellor on brink of second bailout for banks" in the coinbase of the **genesis block** (Stage 0.4) — both a timestamp proof and a manifesto.

### ④ Maturity and the end of issuance: 100 confirmations, and after the year 2140

- **Maturity**: the new coins a coinbase mints must wait **100 confirmations** before they can be spent. The reason is that coinbase proceeds are the most prone to evaporating in a **chain reorg (Stage 5.4)** — if you mined and immediately spent them, but a later block was reorged out, this "new coin" would vanish into thin air and trigger a cascade of invalid transactions. Waiting 100 blocks far exceeds common reorg depths, ensuring it's "welded shut" before being moved.
- **The end of issuance**: the subsidy halves every 210,000 blocks, approaching zero around the year **2140**. At that point the coinbase will hold **only the fee portion** — miner income shifts entirely to transaction fees. This raises an open question (Stage 2.5): once the subsidy is gone, can fees alone sustain a sufficient security budget? It's one of the most debated points in Bitcoin's long-term incentive model.
`,

  demo: "coinbase-demo",

  analogy: `
An ordinary transaction is like **shuffling money around** within what already exists; the coinbase transaction is like a **central bank's printing press** — the block's first transaction prints this round's new coins out of thin air and, together with everyone's "tolls" (fees), pays them to the miner who completed the proof of work.

It's just that this printing press has its output hard-coded in the code and halved every four years, with no back door for anyone to print more.
`,

  misconceptions: [
    "“New bitcoin has multiple issuance channels.” — There's only one: each block's coinbase transaction. There's no other way to mint coins.",
    "“Miner income is only the block subsidy.” — It also includes all the transaction fees in that block; once the subsidy approaches zero, fees will be the whole of it.",
    "“Coinbase coins can be spent right after they're mined.” — No, they must wait 100 confirmations (maturity), to prevent the chaos of already-spent new coins vanishing into thin air when a block is reorged.",
    "“The coinbase also has to spend an old UTXO.” — No. Its input points to a nonexistent UTXO (all-zero TXID), creating new coins out of thin air — and that's exactly what makes it special.",
    "“A miner can write whatever reward they like for themselves.” — No. A block whose total output exceeds ‘subsidy + fees within the block’ is rejected by full nodes; take less, and the surplus is permanently destroyed.",
  ],

  quiz: [
    {
      q: "How does new bitcoin enter circulation?",
      options: ["Issued by exchanges", "Each block's coinbase transaction", "User deposits", "Generated along with fees"],
      answer: 1,
      explain: "The coinbase is the only way to mint coins.",
    },
    {
      q: "What is the miner's total income from a block?",
      options: ["Only the block subsidy", "The block subsidy + all the transaction fees in that block", "Only the fees", "A fixed 6.25 BTC"],
      answer: 1,
      explain: "The subsidy (new coins) plus all the fees within the block.",
    },
    {
      q: "What is the biggest difference between a coinbase transaction and an ordinary one?",
      options: ["A larger amount", "It has no real input and creates new coins out of thin air", "No miner is needed", "It doesn't go on-chain"],
      answer: 1,
      explain: "An empty input plus minting new coins is its essential characteristic.",
    },
    {
      q: "Why must coinbase coins wait 100 confirmations before they can be spent?",
      options: ["To round it off", "To prevent already-spent new coins from vanishing into thin air if a block is reorged", "For tax collection", "To make miners wait longer"],
      answer: 1,
      explain: "Maturity avoids the chaos a reorg would bring (callback to Stage 5.4).",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Coinbase transaction", url: "https://learnmeabitcoin.com/technical/mining/coinbase-transaction/" },
    { label: "Mastering Bitcoin · Chapter 8 Mining", url: "https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch08_mining.adoc" },
  ],
};
