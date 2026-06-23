export default {
  id: "block-explorer",
  stage: 10,
  order: 3,
  title: "Reading a Block Explorer: Tying It All Together",
  difficulty: "deep",
  prereqs: ["utxo", "tx-size-fees", "segwit"],

  oneLiner:
    "A block explorer (like mempool.space) visualizes on-chain data. By this point, you can already read almost every component of a real transaction: inputs/outputs, change, fees and vB, confirmations, witness data… each one maps back to a lesson you've already studied.",

  intuition: `
A block explorer spreads abstract on-chain data out into pages you can click through and inspect in detail: blocks, transactions, addresses. And **by this point, you can read almost every field in them** — think of it as a "final review":

- **txid**: the transaction's fingerprint (Stage 5.1 / 8.2)
- **inputs**: which UTXOs are being spent, with their unlocking scripts/signatures (Stage 4.1 / 4.2)
- **outputs**: payment + change, each carrying a lock, corresponding to different address types (Stage 4.1 / 4.3)
- **fee / vB**: inputs minus outputs, plus the virtual byte size (Stage 4.1 / 4.4)
- **witness**: the segregated signatures (Stage 8.2)
- **confirmations**: how many blocks bury it, and how irreversible it is (Stage 2.2 / 5.4)

Click open the various components of a transaction on the right, and see what each one is and which lesson it maps back to.

> A reminder: a public explorer is **a third party's view**. To be truly trustless, use your own node's explorer/RPC; and looking up your own address on a public explorer can also leak privacy (Stage 9.1).

**In this lesson we break "reading an explorer" into four pieces:**

- **① Read a transaction field by field — map each component back to its lesson**
- **② Follow the trail — inputs backward, outputs forward, the basis of chain analysis**
- **③ Three kinds of pages — what to look at in transactions, blocks, and addresses**
- **④ The limits of public explorers — third-party view and privacy, plus self-hosting**
`,

  mechanics: `
### ① Read a transaction field by field

Open mempool.space, search for any txid, and you'll see a transaction page. Read each field from top to bottom — every one maps back to an earlier lesson:

- **txid**: the hash fingerprint of the entire transaction's contents, unique across the whole network (Stage 5.1). Note that after SegWit there's also a \`wtxid\` that counts the witness in too (Stage 8.2).
- **inputs**: each input points to a UTXO being spent (written as \`previousTXID:index\`) and carries unlocking data. Click one open to see which kind of script it unlocks and the amount (Stage 4.1 / 4.2).
- **outputs**: usually two — payment + change. **How do you recognize the change?** Look at the address type and amount: change often returns to an address of the same type as the sender, with a "leftover" amount. Each output carries its own lock (scriptPubKey), corresponding to address types like \`1...\` (P2PKH), \`3...\` (P2SH), \`bc1q...\` (native SegWit), \`bc1p...\` (Taproot) (Stage 4.3).
- **fee / vB**: the explorer computes \`fee = total inputs − total outputs\` for you, and gives the **vB (virtual byte)** size and the **fee rate (sat/vB)**. Check it: fee rate ≈ fee ÷ vB (Stage 4.1 / 4.4).
- **witness**: in a SegWit transaction, the signatures are moved into a separate witness area and charged at a "weight discount" (this is exactly why it's cheaper, Stage 8.2).
- **confirmations**: how many blocks are buried beneath this transaction. 0 = still in the mempool; 1 = just got into a block; 6+ = nailed down in practice (Stage 2.2 / 5.4).

### ② Follow the trail: backward and forward

What makes the explorer truly powerful is that every input/output is a **clickable link**:

- **Click an input** → jump to "the transaction that created this UTXO," and you can trace the source of funds all the way back into the **past**.
- **Click an output** → if it's already been spent, jump to "the transaction that later spent it," tracing where funds went in the **future**; if it shows \`unspent\`, it's still a live UTXO.
- This back-and-forth tracing is exactly the basis of **chain analysis** — and precisely because of it, reusing addresses or bundling several UTXOs into one transaction leaks linkage information (the privacy lesson of Stage 9.1).

### ③ Three kinds of pages: transaction, block, address

Explorers mainly have three kinds of pages, each showing different things:

- **Transaction page**: the one we just dissected field by field above.
- **Block page**: search for a height (like \`840000\`) or a block hash, and you can see its header fields — timestamp, miner (the tag left in the coinbase), difficulty, Merkle root, how many transactions it packs, and total fees (Stage 5.1).
- **Address page**: enter an address and it lists all the transactions it's received/spent and the current balance. ⚠ But remember: there are no "accounts" on-chain — this "balance" is the explorer **summing up the UTXOs associated with that address** for you to see (Stage 4.1) — and the moment you query, you've told that public service "you care about this address."

### ④ The limits of public explorers and self-hosting

Public explorers are convenient, but have two fundamental limitations that echo the main thread of the whole course:

- **It's a third-party view**: mempool.space shows you the chain as seen by **its node**. 99% of the time that's fine, but the "most authoritative" source is always a node you verified yourself — don't treat the explorer's display as absolute truth.
- **Queries leak privacy**: looking up your own address/transactions on a public explorer is like exposing to it "these are what I care about," which can be linked and analyzed (Stage 9.1).
- **The fix: self-hosting**. mempool.space, BTC RPC Explorer, and others are all **open source** and can be **set up on your own full node** (connecting Stage 10.1's node + Stage 10.2's RPC). That way you reclaim authority and leak no queries — trustlessness and privacy in one shot. At this point, all the abstract concepts from before become things you can click open with your own eyes and point to, one by one.
`,

  demo: "explorer",

  analogy: `
A block explorer is like an **X-ray machine**, showing the skeleton of every transaction crystal clear.

Having walked this whole path, you've gone from facing "incomprehensible gibberish" to being a "radiologist" who can read the films block by block — you know exactly what every bone is called and what it connects to.
`,

  misconceptions: [
    "“What the explorer shows is the absolute truth.” — It's one third party's view; the most authoritative source is a node you verified yourself.",
    "“Looking up my own address on a public explorer carries no risk.” — It can expose to that service that ‘you care about these addresses,’ harming your privacy (Stage 9.1).",
    "“A txid alone can reveal my real identity.” — Only when it's linked to you somewhere else; the chain itself is only pseudonymous.",
    "“The explorer decides the confirmation count.” — It merely reflects how many blocks bury this transaction, which is determined by the chain.",
  ],

  quiz: [
    {
      q: "How is a transaction's fee computed on an explorer?",
      options: ["A percentage of the amount", "Total inputs − total outputs", "A fixed value", "Randomly assigned by the explorer"],
      answer: 1,
      explain: "The difference goes to the miner, ≈ fee rate × vB (callback to 4.1 / 4.4).",
    },
    {
      q: "Clicking open an “output” in an explorer lets you trace?",
      options: ["Who the miner is", "Which transaction later spent it (or that it's still unspent)", "Your identity", "The coin price"],
      answer: 1,
      explain: "A UTXO's history is also the basis of chain analysis (9.1).",
    },
    {
      q: "To browse on-chain data both trustlessly and privately, it's best to?",
      options: ["Use the biggest public explorer", "Host an open-source explorer on your own node", "Ask an exchange", "Trust a screenshot"],
      answer: 1,
      explain: "Your own node = authoritative + private.",
    },
    {
      q: "What is the fundamental limitation of a public block explorer?",
      options: ["The data is fake", "It's a third party's view, and your queries can leak your privacy", "It's slow", "It charges a fee"],
      answer: 1,
      explain: "The most authoritative and most private source is always your own node.",
    },
  ],

  further: [
    { label: "mempool.space (self-hostable open-source explorer)", url: "https://mempool.space/" },
    { label: "learnmeabitcoin: browse real transactions", url: "https://learnmeabitcoin.com/explorer/" },
  ],
};
