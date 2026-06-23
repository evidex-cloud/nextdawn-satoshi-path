export default {
  id: "script",
  stage: 4,
  order: 2,
  title: "Bitcoin Script: Every Output Is a Lock",
  difficulty: "core",
  prereqs: ["utxo", "signatures"],

  oneLiner:
    "Every UTXO carries a “locking script” — a lock written in Bitcoin's own small scripting language. To spend it, you must supply an “unlocking script” (usually a signature) in the input as the key; the node joins key and lock together, runs them through a little stack machine, and the spend is allowed only if the result comes out true.",

  intuition: `
The last lesson said every UTXO carries a **lock**. That lock isn't a static password — it's a tiny **program**, written in Bitcoin's built-in scripting language, **Bitcoin Script**. The question "who can spend this coin" is, at its core, "who can make this program evaluate to 'true.'"

The way it works is surprisingly plain: every output contains a **locking script (\`scriptPubKey\`)** that sets the spending condition; when you want to spend it, you provide an **unlocking script (\`scriptSig\`)** in the input as the key (usually \`signature + public key\`). The node joins them together — **key first, lock second** — into one continuous script, drops it into a little **stack machine**, and runs it left to right. When it finishes, if the top of the stack is "true," the lock opens and the spend is valid.

The most common lock is called **P2PKH**, which in plain words reads: "whoever can produce the public key that matches this address, and sign with the corresponding private key, can spend it." — and that's exactly the digital signatures from Stage 3 put to work.

On the right is a **real** script stack machine: it gives you a number lock that asks you to "make the sum equal 15," you fill in the key and step through it, watching how each opcode rewrites the stack and how the lock finally opens.

**In this lesson we break Bitcoin Script into four pieces:**

- **① How the stack machine runs — pushing, opcodes, top-of-stack true**
- **② Working through a P2PKH — opcode by opcode, watching the lock open**
- **③ Why it's deliberately "not Turing-complete" — the trade-offs of safe design**
- **④ From P2PKH to P2SH / SegWit — the family tree of locks**
`,

  mechanics: `
### ① The stack machine: pushing, opcodes, top-of-stack true

Bitcoin Script has no variables and no memory addresses — only a **stack** (a last-in-first-out pile of plates) and a string of "words" read left to right. There are only two kinds of words:

- **Data** (numbers, signatures, public keys): when encountered, it's **pushed onto the top of the stack**.
- **Opcodes** (starting with \`OP_\`): they **pop** some items off the top, do an operation, and push the result back. For example, \`OP_ADD\` pops two numbers, adds them, and pushes back their sum; \`OP_EQUAL\` pops two numbers and pushes back \`1\` (true) if they're equal, otherwise \`0\` (false).

**Validation = join and execute.** The node joins the unlocking script and the locking script into one continuous run, and looks at the top of the stack afterward: anything nonzero and non-empty is "true," and the spend passes. The whole process has no randomness and no external input, so **any node running the same script must get the same result** — and that's the prerequisite for the whole network agreeing on "is this spend valid."

> A historical wrinkle: early on, \`scriptSig\` and \`scriptPubKey\` really were concatenated into one string and run together. Later, to plug a security hole, this was changed to **run the two halves separately, passing along the stack state** (run the unlocking script first, then hand the resulting stack to the locking script to continue), but you can still understand it as "key first, lock second."

### ② Working through a P2PKH: opcode by opcode, watching the lock open

The classic P2PKH locking script is these 5 words:

\`OP_DUP  OP_HASH160  <20-byte public-key hash>  OP_EQUALVERIFY  OP_CHECKSIG\`

The unlocking script (the key) provides two things: \`<signature> <public key>\`. Joined and executed, the stack evolves like this (read top-down from the top of the stack):

- Push \`<signature>\`, then push \`<public key>\` → stack: \`public key, signature\`.
- \`OP_DUP\`: duplicate the public key on top → stack: \`public key, public key, signature\`.
- \`OP_HASH160\`: take SHA-256 then RIPEMD-160 of the top public key, yielding a 20-byte hash → stack: \`pubkey-hash', public key, signature\`.
- Push the \`<public-key hash>\` hard-coded in the lock → stack: \`pubkey-hash, pubkey-hash', public key, signature\`.
- \`OP_EQUALVERIFY\`: pop the two hashes and compare; **if they're not equal, abort immediately and fail**; if equal, continue → stack: \`public key, signature\`.
- \`OP_CHECKSIG\`: pop the public key and signature, verify that this signature really was made over **this transaction** by the private key corresponding to that public key; if it passes, push \`1\`.

A single \`1\` is left on top of the stack, and the lock opens. Notice that two independent things were checked here: **the public key you gave really does hash to the value in the address** (proving the address is yours), **and you signed with the corresponding private key** (proving you consent to spend right now). The address (that 20-byte hash) is precisely the "house number" this lock publishes to the outside world.

### ③ Why it's deliberately "not Turing-complete"

Bitcoin Script has **no loops, no jumps, and no recursion** — it's deliberately not Turing-complete. This isn't a lack of ability; it's a **safety design**:

- **Every single node** on the network has to re-execute the script of every transaction to validate it. If a script could contain an infinite loop, one malicious output could freeze every node that validates it — exactly the problem Ethereum later had to tame with "gas pricing."
- Bitcoin took a simpler approach: **make it structurally impossible to run too long**. With no loops, a script's number of execution steps has an upper bound, so validation cost is **predictable and bounded**. Add hard limits on stack depth, opcode count, and the like, and a single script can never drag the network down.
- The price is limited expressiveness: you can write "conditional" spends like multisig, timelocks, and hashlocks, but you cannot write arbitrarily complex on-chain computation. Bitcoin chose to keep programmability restrained — **verifiability comes before programmability** — and that's the fundamental fork between it and the "world computer" path.

### ④ From P2PKH to P2SH and SegWit: the family tree of locks

P2PKH is just the oldest kind of lock. The same stack machine, fed different script templates, grows an entire family (the next lesson looks at these by address type):

- **P2SH (starts with \`3\`)**: the lock holds **only the hash of a script** (\`OP_HASH160 <script hash> OP_EQUAL\`). To spend, you first reveal the **full redeem script**, prove it hashes to the value in the lock, and then satisfy that script itself. The benefit: the burden of a complex condition (like \`2-of-3\` multisig) shifts from the **recipient** to the **spender** — the recipient only has to give you a short address, without stuffing that big multisig script into their own output.
- **P2WPKH / P2WSH (SegWit, starts with \`bc1q\`)**: the "key" (signatures, public keys) is moved from \`scriptSig\` into a dedicated **witness area** of the transaction. The locking script degenerates into the minimal \`OP_0 <hash>\`, with the real verification logic driven by the witness data. This way the signature no longer counts toward the \`txid\` (curing transaction malleability), and witness data also enjoys a **fee discount** (Stage 4.4).
- **P2TR (Taproot, starts with \`bc1p\`)**: based on Schnorr signatures, it can hide "a tree of scripts" behind a single public key — when only the normal path is used, what appears on-chain is indistinguishable from an ordinary transfer, so **complexity becomes invisible** (explored in depth in Stage 8).

Remember one sentence: **an address is just the human-readable encoding of some locking script (or its hash, or a public key)**. Change the address type and you change the lock's style and how it's arranged, but the thing running behind it is always the same little stack machine.
`,

  demo: "script-machine",

  analogy: `
Think of each UTXO as a **safe with a conditional lock**, with the unlocking conditions (the locking script) engraved on its surface.

To take the money out, you have to hand over a **keyring** (the unlocking script: signature and public key). The cashier (the node) **joins your keyring to the conditions on the safe and compares them step by step, by the book**: if the keys fit, the signature is genuine, and the green light comes on at the end (top of stack true), only then does the safe open. Any step that doesn't match, and the safe doesn't budge.
`,

  misconceptions: [
    "“Bitcoin can only do simple transfers, with no programmability.” — It has a scripting language that can express conditions like multisig, timelocks, and hashlocks; it's just deliberately not made Turing-complete, for safety.",
    "“The locking script ‘locks the money in the address.’” — The locking script is a spending condition; whoever satisfies it can spend. An address is just a short encoding of a kind of locking script.",
    "“The unlocking script is ‘decrypting’ something.” — It is not. It merely supplies the data (usually a signature) that makes the whole script evaluate to ‘true’; what the node does is ‘execute and verify,’ not ‘decrypt.’",
    "“Scripts can loop forever and do arbitrary computation.” — They cannot. Bitcoin Script has no loops and is not Turing-complete; its step count is bounded, ensuring every node can validate quickly and within limits.",
    "“P2PKH only verifies the signature.” — It verifies two things: that the public key you gave really hashes to the address in the lock, and that you signed this transaction with the corresponding private key. The former proves the address is yours; the latter proves you consent to spend.",
  ],

  quiz: [
    {
      q: "What is the “lock” on every UTXO called?",
      options: ["The unlocking script", "The locking script (scriptPubKey)", "The private key", "The Merkle root"],
      answer: 1,
      explain: "An output carries a locking script that sets the condition for spending it.",
    },
    {
      q: "When spending a UTXO, what is the “key” you provide in the input, usually?",
      options: ["Your private key itself", "A signature plus a public key (the unlocking script)", "Your balance", "A fee"],
      answer: 1,
      explain: "The unlocking script is usually a signature plus a public key; the private key itself never appears.",
    },
    {
      q: "How does a node decide whether a spend is valid?",
      options: ["Ask an exchange", "Join the unlocking script with the locking script and execute; top-of-stack true means it passes", "Look at the amount", "Spot-check at random"],
      answer: 1,
      explain: "Once the stack machine finishes, a true result unlocks the spend.",
    },
    {
      q: "Why is Bitcoin Script deliberately not made Turing-complete?",
      options: ["The developers were lazy", "For safety: to avoid infinite loops or complex scripts dragging down every validating node", "To save electricity", "Because nobody would use it"],
      answer: 1,
      explain: "Bounded, fast-to-validate execution is a safety prerequisite for a decentralized network.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Script (illustrated)", url: "https://learnmeabitcoin.com/technical/script/" },
    { label: "learnmeabitcoin: P2PKH", url: "https://learnmeabitcoin.com/technical/script/p2pkh/" },
  ],
};
