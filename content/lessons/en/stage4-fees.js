export default {
  id: "tx-size-fees",
  stage: 4,
  order: 4,
  title: "Fees and Transaction Size: What Exactly Is a vByte",
  difficulty: "core",
  prereqs: ["utxo", "address-types"],

  oneLiner:
    "A Bitcoin fee = fee rate × transaction size, and the unit of size is the “virtual byte (vByte).” The bigger the transaction, the more expensive, and the size is determined mainly by the number of inputs and outputs and the address type — Segregated Witness data gets a “discount,” so using SegWit/Taproot addresses and avoiding fragmented UTXOs both save money.",

  intuition: `
Stage 1 said: a fee = **fee rate (sat/vB) × transaction size (vB)**, with nothing to do with the amount transferred — whether you send 1 satoshi or 1000 BTC, as long as the transaction is the same "size," the fee is the same. This lesson makes the matter of "size" completely clear.

What determines a transaction's size is mainly three things: the **number of inputs** (each extra UTXO you spend adds another piece of "key" data, so overly fragmented UTXOs get expensive), the **number of outputs** (usually one payment + one change), and the **address type** (SegWit puts the signature into the "witness" area, and the witness is **discounted** when computing fees, so the same transaction using a \`bc1\` address is often quite a bit cheaper than using a \`1\` address).

This "size after the discount" is measured in **virtual bytes (vByte / vB)**. A typical transaction is around one or two hundred vB.

The estimator on the right: adjust the input/output counts, switch the address type, and see how the transaction size and fee change.

**In this lesson we break "transaction size and fees" into four pieces:**

- **① Where the fee comes from — why there's no "fee field"**
- **② How a vByte is computed — weight, the witness discount, the ×4 weighting**
- **③ Breaking down a transaction's vByte — the rule-of-thumb numbers for inputs, outputs, and fixed overhead**
- **④ Three fee-saving moves — address type, UTXO management, fee-rate timing**
`,

  mechanics: `
### ① Where the fee comes from: why there's no "fee field"

A Bitcoin transaction has **no field at all that reads "fee"** (callback to Stage 4.1):

- **Fee = total inputs − total outputs**, and this difference is collected by the miner who packages it, in the coinbase (Stage 5.5). You pay by "deliberately writing slightly less in the outputs."
- So "how much fee am I willing to pay" isn't a number you fill in directly; instead **your wallet computes it for you**: it first estimates the transaction's vByte count, multiplies by the fee rate you chose to get how much difference to leave behind, and then shrinks the change output accordingly.
- ⚠ This is also why **forgetting the change is a disaster**: all the surplus turns into fee. Historically people really have paid sky-high fees of several BTC this way. Understanding the vByte is precisely how you come to see what the wallet actually computed for you.

### ② How a vByte is computed: weight, the witness discount, the ×4 weighting

After SegWit, transaction data splits into two parts: **base data** (version, inputs and outputs, locking scripts…) and **witness data** (the witness, mainly signatures and public keys). The protocol weights the witness at only one-quarter when computing size — that's the "witness discount." This introduces two quantities:

- **Weight = base bytes × 4 + witness bytes × 1**
- **Virtual bytes (vByte) = weight ÷ 4**

A concrete example: a transaction with 100 bytes of base data and 64 bytes of witness data. Weight = 100×4 + 64×1 = **464**, vByte = 464 ÷ 4 = **116 vB**. Note: those same 64 bytes, if they were in the base area, would count as 64 vB, but moved to the witness area they count as only 64÷4 = **16 vB** — a saving of **48 vB**. So **the more signatures in the witness, the more the discount saves**, and this is the mathematical root of why SegWit/Taproot is cheaper.

> Why "4 times" specifically? It's a compromise set during the SegWit soft fork: enough discount for witness data to encourage migration, while pinning the block's "weight limit" at **4 million** (= the old 1 million bytes × 4), so that the "1 MB limit" as seen by old nodes and the "4 M weight" as seen by new nodes are exactly compatible (Stage 8.2).

### ③ Breaking down a transaction's vByte: rule-of-thumb numbers

Memorize a few rough numbers and you can mentally estimate most transactions (enough to build intuition):

- A **legacy input** ≈ **148 vB**; a **SegWit (P2WPKH) input** ≈ **68 vB** — more than half off.
- A **Taproot (P2TR) input** ≈ **57 vB**, cheaper still; an ordinary output ≈ **31 vB** (a P2TR output ≈ 43 vB).
- A transaction also has about **10 vB** of fixed overhead (version, locktime, count fields, etc.).

So a "2-input, 2-output" SegWit transaction ≈ 68×2 + 31×2 + 10 ≈ **208 vB**; the same structure with legacy addresses ≈ 148×2 + 31×2 + 10 ≈ **368 vB** — nearly 80% more expensive. The fee = this × the current fee rate (e.g. at 20 sat/vB, the former is about 4160 sats).

### ④ Three fee-saving moves (echoing earlier lessons)

- **Use SegWit / Taproot addresses**: enjoy the witness discount, and the vByte of an equivalent transaction is directly a notch smaller (computed in ② and ③).
- **Manage your UTXOs well, don't hoard a pile of fragments**: the more inputs, the larger and more expensive the transaction. When the network is idle and fee rates are low (e.g. single-digit sat/vB), you can **consolidate** a pile of small coins into one or two large UTXOs, saving the cost of spending them later (the "dust" problem from Stage 4.1).
- **Pick low-fee-rate windows**: the fee rate is an **auction** — miners prioritize transactions that bid high, so it's expensive during congestion and dirt cheap when idle. Use mempool to watch real-time fee rates; for non-urgent transfers, waiting for an idle window can make a tenfold-plus difference.
`,

  demo: "fee-estimator",

  analogy: `
Shipping a parcel is charged by **volumetric weight**, not by how much the contents are worth. Bitcoin is the same: whether it's expensive depends on how big this "parcel" of a transaction is, with nothing to do with how much money you transfer.

An input is like stuffing one more part-with-its-manual into the box (each one takes up space); an output is the recipient's address; and SegWit is like turning that thick stack of manuals into a **thin appendix that counts as only one-quarter when billed** — same contents, smaller volume, and naturally lower shipping cost.
`,

  misconceptions: [
    "“The more money you transfer, the higher the fee.” — No. The fee depends on the transaction's vByte size, not the amount.",
    "“Transaction size is just its byte count.” — After SegWit, fees are charged by vByte (virtual bytes): weight = base×4 + witness×1, then ÷4, so the vByte is usually smaller than the raw byte count.",
    "“The number of UTXO inputs doesn't affect the fee.” — It affects it a lot. Each input carries key data, so more inputs mean a larger, more expensive transaction; one legacy input is about 148 vB.",
    "“Saving fees by switching to a bc1 address is an illusion.” — It really does save. The witness discount makes a SegWit/Taproot transaction's vByte smaller, so it's cheaper at the same fee rate.",
    "“The fee is a separate field in the protocol.” — There is no such field. Fee = total inputs − total outputs, set by the wallet by adjusting the change; forget the change and the whole difference becomes fee.",
  ],

  quiz: [
    {
      q: "What determines a Bitcoin fee?",
      options: ["The amount transferred", "Fee rate × transaction size (vByte)", "The number of recipients", "The wallet brand"],
      answer: 1,
      explain: "Fee = fee rate × vByte, independent of the amount.",
    },
    {
      q: "What's special about a “vByte (virtual byte)” compared to a raw byte?",
      options: ["They're identical", "Witness data (signatures) is weighted at one-quarter, so it's smaller", "It's computed from the amount", "Miners set it arbitrarily"],
      answer: 1,
      explain: "The witness discount: weight ÷ 4 gives the vByte, and the more signatures the more you save.",
    },
    {
      q: "Which of the following does **not** save on fees?",
      options: ["Switching to SegWit/Taproot addresses", "Transacting during low-fee-rate windows", "Spending many fragmented UTXOs all at once as inputs", "Consolidating small coins when idle"],
      answer: 2,
      explain: "More inputs mean a larger, more expensive transaction; consolidate when fees are low, don't just spend them all offhand.",
    },
    {
      q: "For the same “2-input, 2-output” transaction, why is SegWit cheaper than legacy addresses?",
      options: ["Miners play favorites", "A SegWit input's witness data gets a discount, so the vByte is smaller", "The SegWit amount is smaller", "Legacy addresses have to pay tax"],
      answer: 1,
      explain: "The witness discount makes the billable size of an equivalent transaction smaller.",
    },
  ],

  further: [
    { label: "mempool.space: real-time fee rates and blocks", url: "https://mempool.space/" },
    { label: "learnmeabitcoin: Transaction size / vByte", url: "https://learnmeabitcoin.com/technical/transaction/size/" },
  ],
};
