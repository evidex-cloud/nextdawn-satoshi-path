export default {
  id: "raw-transaction",
  stage: 4,
  order: 5,
  title: "The Raw Structure of a Transaction: Reading One Byte by Byte",
  difficulty: "deep",
  prereqs: ["utxo", "script", "tx-size-fees"],

  oneLiner:
    "A Bitcoin transaction is, at heart, a string of bytes in a fixed format. Take it apart and you'll see: a version number, a list of inputs (each pointing to a spent UTXO), a list of outputs (each creating a new UTXO), SegWit's witness area, and the locktime. Once you can read raw hex like a sentence, you cross over from “Bitcoin user” to “Bitcoin native.”",

  intuition: `
By now you understand UTXOs, scripts, addresses, and fees. This lesson brings them all **down to the bytes of a real transaction** — you'll learn to read a string of raw hex out loud, like reading a sentence.

Decoded, every transaction is a string with a **fixed order** (front to back): version number (4 bytes) → SegWit's marker and flag (SegWit only) → input list (each pointing to a spent UTXO) → output list (each creating a new UTXO) → witness area (SegWit only) → locktime (4 bytes). There are no labels and no delimiters; everything is bounded purely by **position and length** — and that's exactly why it can be parsed consistently across the whole network.

The **raw transaction decoder** on the right parses a sample (or real hex you copy from mempool.space) into plain language: version, each input and output, script type, locktime, vByte.

**In this lesson we break the "raw transaction" into four pieces:**

- **① Field order and boundaries — walking through the six sections start to finish**
- **② Two low-level encodings — little-endian and varint, the two traps you must step over**
- **③ The byte differences between legacy and SegWit — marker, empty scriptSig, witness area**
- **④ sequence, locktime, and txid — the three mechanisms hidden at the end**
`,

  mechanics: `
### ① Field order and boundaries: walking through the six sections

Decoding relies on "read a fixed-length cell, then use a count field to decide how many variable-length cells follow." Section by section:

- **Version number (4 bytes)**: which rule set to use. Commonly \`01000000\` (version 1) or \`02000000\` (version 2, which enables relative timelocks). Note it's already in little-endian (see ②).
- **Marker + flag (2 bytes, SegWit only)**: \`0001\`. If these two bytes immediately follow the version number, it declares "this is a Segregated Witness transaction."
- **Input count** (varint) → each **input** in turn is: the spent UTXO's \`previous TXID\` (32 bytes) + \`output index vout\` (4 bytes) + \`scriptSig length\` (varint) + \`scriptSig\` (the unlocking script) + \`sequence\` (4 bytes).
- **Output count** (varint) → each **output** in turn is: \`amount\` (8 bytes, in satoshis) + \`scriptPubKey length\` (varint) + \`scriptPubKey\` (the locking script).
- **Witness area** (SegWit only): each input has a corresponding set of witness items (the signatures, public keys, etc. that were moved out of scriptSig), each with its own varint count and length.
- **locktime (4 bytes)**: the earliest time or height at which it can go on-chain.

Walk through a mini example: a P2PKH output whose \`scriptPubKey\` is \`OP_DUP OP_HASH160 <20 bytes> OP_EQUALVERIFY OP_CHECKSIG\` has the bytes \`76 a9 14 <20-byte public-key hash> 88 ac\` — the \`14\` is hex for 20, telling the decoder "the next 20 bytes are the public-key hash." Once you can recognize the fixed shape \`76a914…88ac\`, you can tell at a glance "this is a P2PKH output."

### ② Two low-level encodings: little-endian and varint

These are the two traps most often stepped on when writing a decoder:

- **Little-endian**: multi-byte **numeric values** are **stored backwards** (low-order byte first). Example: 1 BTC = 100,000,000 sats = hex \`05F5E100\`, written in a transaction's amount field as \`00E1F50500000000\` (8 bytes, low-order first). To read it, you must reverse the byte order first and then treat it as a number. **The previous TXID is also reversed in the raw data** — so the txid shown by a block explorer and the 32 bytes in the raw transaction are in exactly opposite byte order, which is the single point that confuses beginners most.
- **varint (variable-length integer)**: count and length fields (input count, output count, script length) use a 1-to-9-byte variable-length encoding to save space: a value < \`0xFD\` (253) is written directly in **1 byte**; otherwise a prefix marks the following length — \`fd\` + 2 bytes, \`fe\` + 4 bytes, \`ff\` + 8 bytes. So when you see an \`fd\`, don't take it as data; it's saying "the real count is in the next 2 bytes."

### ③ The byte differences between legacy and SegWit

For the same transfer, legacy encoding and SegWit encoding lay out their bytes differently, and recognizing the difference is the key to reading real transactions:

- **How do you spot SegWit at a glance?** After the version number comes \`0001\` immediately (marker \`00\` + flag \`01\`). In a legacy transaction this spot is directly the input-count varint (which can never be \`00\`, since there's no zero-input transaction).
- **Under SegWit each input's scriptSig is empty**: the unlocking data (signatures, public keys) is all moved to the witness area at the end, and the corresponding input's \`scriptSig length\` is \`00\`. A legacy transaction stuffs the signature and public key into scriptSig and has no witness area.
- **This is precisely where the fee discount comes from**: witness-area bytes are weighted at one-quarter (Stage 4.4). Moving the signature into the witness area both fixes malleability and saves money (Stage 8.2).

### ④ sequence, locktime, and txid: the three mechanisms at the end

- **sequence (4 bytes per input)**: a field originally designed for "transaction replacement," it now wears two hats — when the value is ≤ \`0xFFFFFFFD\` it enables **RBF (Replace-By-Fee, callback to Stage 1.3)**, letting you later override this transaction with a higher fee rate; it also participates in **relative timelocks (BIP68)**. Set to \`ffffffff\`, it means "no relative lock, final version, not RBF-able."
- **Two meanings of locktime (4 bytes)**: a value < **500,000,000** is interpreted as a **block height**, and ≥ that as a **Unix timestamp**. \`0\` means it can go on-chain immediately. This lets you build a transaction that "nobody can package before block 850,000" — for things like timelocked inheritance or escrow refunds.
- **How the txid comes about**: take a **double SHA-256 of the whole transaction**, then reverse the result bytes for display. The key point: **when computing a SegWit transaction's txid, the witness area is not included** — the signature doesn't go into the txid, so a third party can't change the txid by altering the signature, and that's the byte-level reason malleability is cured (Stage 8.2). SegWit also has a separate \`wtxid\` that does include the witness, used at the network layer and for the witness Merkle root.
`,

  demo: "tx-decoder",

  analogy: `
A raw transaction is like a **telegram typeset in a fixed format**: which cell is the date, which cell is the recipient, which cell is the amount — position and length all follow rules.

To an outsider it looks like a string of gibberish; but once you know "cell 1, 4 bytes, is the version, then comes the input list…", you can read it out like a sentence — "version 2, one input spending TXID:0, two outputs totaling 0.01002 BTC, no timelock."
`,

  misconceptions: [
    "“The numbers in a transaction are written in normal order.” — They're not. Multi-byte numeric values are stored in little-endian (reversed), and the TXID is also reversed in the raw data (the exact opposite of what the explorer shows).",
    "“Count fields are always a fixed 1 byte.” — They use varint variable-length encoding: a value < 253 uses 1 byte, larger values use an fd/fe/ff prefix plus 2/4/8 bytes.",
    "“A SegWit transaction also puts the signature in scriptSig.” — No. Under SegWit scriptSig is empty (length 00), the signature is moved to the witness area, and the txid no longer contains the signature.",
    "“locktime is always a time.” — Below 500 million (500000000) it's treated as a block height; only at or above that is it treated as a Unix timestamp.",
    "“A raw transaction has field names or delimiters to help you tell things apart.” — It doesn't. Everything is bounded by fixed lengths + varint counts, and decoding depends entirely on positional order.",
  ],

  quiz: [
    {
      q: "How do you spot at a glance from the raw hex that this is a SegWit transaction?",
      options: ["Look at the amount", "0001 (marker+flag) comes right after the version number", "Look at the address", "Look at the locktime"],
      answer: 1,
      explain: "After the 0001 marker, scriptSig is empty and the signature is in the witness area.",
    },
    {
      q: "How is the amount field for 1 BTC stored in a transaction?",
      options: ["Decimal 1", "100000000 sats, as 8 bytes in little-endian", "The string “1 BTC”", "Randomly"],
      answer: 1,
      explain: "The unit is satoshis, 8 bytes, little-endian (stored backwards).",
    },
    {
      q: "What is varint used to encode?",
      options: ["Amounts", "Fields like counts/lengths, with a variable length by magnitude (1–9 bytes)", "Signatures", "Addresses"],
      answer: 1,
      explain: "Input count, output count, and script length all use varint.",
    },
    {
      q: "If the locktime field value is 850000, what does it mean?",
      options: ["A Unix timestamp", "A block-height lock: it can't go on-chain before block 850000", "A fee", "A version number"],
      answer: 1,
      explain: "Below 500 million it's treated as a block height; above that, as a timestamp.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Transaction (field-by-field visualization)", url: "https://learnmeabitcoin.com/technical/transaction/" },
    { label: "Mastering Bitcoin · Chapter 6 Transactions", url: "https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch06_transactions.adoc" },
  ],
};
