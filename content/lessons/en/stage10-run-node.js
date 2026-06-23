export default {
  id: "run-node",
  stage: 10,
  order: 1,
  title: "Run Your Own Full Node: Become Part of the Network",
  difficulty: "deep",
  prereqs: ["node-types", "p2p-network"],

  oneLiner:
    "Running a full node (like Bitcoin Core) means downloading and verifying the entire chain yourself — from now on you no longer trust anyone’s claim about “what the ledger looks like right now”; your own software decides. This is the most thorough practice of “Don’t trust, verify,” and the greatest measure of sovereignty you can hold in Bitcoin.",

  intuition: `
After learning all this, the step that gives you the most "sense of sovereignty" is to **run a full node yourself**.

What it does is exactly the combination of every rule you've learned so far: starting from the genesis block, it **verifies block by block in person** (signatures, double-spends, PoW, issuance schedule…), **rejects and refuses to relay** anything that doesn't comply, and then **relays** the verified data to its neighbors, becoming a member of the P2P network.

Your reward isn't money, but this: **you never again have to trust any third party telling you "what happened on-chain"** — balances, confirmations, rules, all decided by your own software. As a bonus, it also improves privacy (you no longer hand your addresses over to someone else's server to look up).

Toggle "pruned mode" on the right to see how much storage running a node takes, and what you get for it.

**In this lesson we break "running a full node" into four pieces:**

- **① What a full node actually does — verify, enforce, relay**
- **② How to actually get one running — download, configure, Initial Block Download (IBD)**
- **③ Full vs. pruned — 600 GB or a few GB, same verification strength**
- **④ What running a node means — sovereignty, privacy, and your "one vote"**
`,

  mechanics: `
### ① What a full node does: verify, enforce, relay

A full node isn't a "downloader" — it's an **independent rule-judging machine**. For every block and every transaction it receives, it does three things:

- **Verify**: it checks whether every signature is valid, whether the UTXO each input spends is still in the UTXO set (preventing double-spends), whether the PoW meets the target, whether the block reward overissues, whether the scripts pass… if a single rule fails, the whole thing is rejected.
- **Enforce**: anything invalid, no matter who sent it, the node **discards outright and absolutely will not relay** — this is the physical scene where consensus rules are enforced "bottom-up" (Stage 6.4 / 8.1).
- **Relay**: transactions and blocks that pass verification are passed on to its peers, letting valid data spread across the P2P network (Stage 6.3).

Once it's running, you can use \`bitcoin-cli getblockchaininfo\` to see its overall status, and \`getpeerinfo\` to see which neighbors it's connected to — you'll watch with your own eyes as you become a node on the network.

### ② How to actually get it running: download, configure, IBD

The reference implementation is **Bitcoin Core** (it's what the vast majority of full nodes run). The minimal path is really just three steps:

- **Step 1 · Install**: download the package for your platform from \`bitcoincore.org\`, and **be sure to verify the GPG signature and hash** (confirm what you installed wasn't swapped out).
- **Step 2 · Configure**: write a \`bitcoin.conf\` and place it in the data directory. A few common lines: \`server=1\` (enable RPC, used in the next lesson), \`txindex=1\` (build a full transaction index, needed by block explorers), \`dbcache=4096\` (give it a larger memory cache, which speeds up IBD considerably).
- **Step 3 · Start**: run \`bitcoind\` (the background daemon) or the GUI version \`bitcoin-qt\`. The first launch enters **Initial Block Download (IBD)** — starting from genesis block 0, it **downloads and re-verifies from scratch, block by block**, roughly 900,000 blocks totaling hundreds of GB of history. This usually takes **a few hours to a day or two**, depending on disk speed (an SSD is strongly recommended), bandwidth, and \`dbcache\`.
- **Check progress**: during IBD, repeatedly run \`bitcoin-cli getblockcount\` to watch the height climb; when \`verificationprogress\` in \`getblockchaininfo\` approaches \`1.0\`, you're nearly synced.

Why must it verify from scratch instead of just trusting a "snapshot"? Because the moment you accept a state someone hands you, you've handed the trust over "what the ledger looks like right now" back to them — and the whole point of running a node is precisely to take that trust back into your own hands.

### ③ Full vs. pruned: storage differs a lot, verification strength is the same

By 2026, the complete chain history already exceeds **600 GB** and keeps growing. Afraid your disk can't hold it? Bitcoin gives you an option that's extremely friendly to individuals — **pruning**:

- Write \`prune=550\` in \`bitcoin.conf\` (the unit is MB, and 550 is the smallest allowed value); the node still **fully verifies every block from genesis**, but discards old blocks once they're verified, keeping only a recent slice locally, shrinking disk usage to **a few GB**.
- **Key point: verification strength is not discounted at all**. A pruned node verifies the entire history in person just like a full node, and gets exactly the same security guarantees — the only difference is that it no longer keeps all of history available for others to download, and therefore **can no longer run certain functions that need to revisit old blocks** (such as building a \`txindex\` over historical blocks, or serving as someone else's sync source).
- So the choice is simple: want to be an "archive" for the network, or run a block explorer / full index → full node; just want a trustless wallet backend for yourself → a pruned node is plenty (Stage 6.2).

### ④ What running a node means: sovereignty, privacy, your "one vote"

Why is it worth the trouble? Because in one stroke it gives you three things you can't buy anywhere else:

- **Sovereignty (don't trust, verify)**: your wallet balance, how many confirmations a transaction has, whether a given rule is being followed — from now on all answered by **your own software**, not some company's server. This is the most thorough realization of the whole course's "verify it yourself" spirit.
- **Privacy**: when you use a light wallet to check a balance, you've actually told the other party's server "I care about these addresses"; connect to your own node to check, and that leak disappears (Stage 9.1).
- **Your "one vote" in consensus**: a node **enforces only the rules you choose** and rejects any non-compliant block. The block-size war back then (Stage 8.1) proved that what really decides "what Bitcoin is" isn't miners' hashpower, but **the rules that tens of thousands of validating nodes jointly insist on**. By running a node, you cast the most concrete vote for the rules you endorse (Stage 6.4 / 8.1).
`,

  demo: "node-setup",

  analogy: `
Running a full node is like **keeping a complete original copy of the ledger yourself and checking it page by page**: any balance anyone reports to you, anything that "just happened on-chain," you can re-verify on the spot — no longer having to read anyone's expression or take their one-sided word for it.
`,

  misconceptions: [
    "“Running a full node is the same as mining.” — No. Verifying ≠ mining; the vast majority of full nodes don't mine at all, they only verify and relay, and an ordinary computer can run one (Stage 6.2).",
    "“Running a node requires expensive specialized equipment.” — An ordinary computer plus a hard drive is enough; pruned mode (prune=550) needs only a few GB, so the barrier is very low. The bottleneck is usually just the few hours to a day or two of IBD sync time.",
    "“Running a node will earn me money directly.” — There's no block reward or fees; what it buys you is sovereignty, privacy, and zero trust in third parties — those are its reward.",
    "“Checking my balance in a wallet app is the same as verifying it myself.” — No. Unless that wallet connects to your own node, you're still trusting the numbers the other party's server tells you.",
    "“A pruned node is a ‘crippled version’ with lower security.” — No. It verifies in full from genesis just like a full node, with exactly the same security guarantees; it just discards old blocks and can no longer serve as someone else's sync source.",
  ],

  quiz: [
    {
      q: "What is the most fundamental value of running a full node?",
      options: ["Mining for coins", "Verifying everything yourself, no longer trusting any third party's claims about the chain", "Faster internet speed", "Getting an airdrop"],
      answer: 1,
      explain: "The most thorough practice of Don't trust, verify.",
    },
    {
      q: "How does a “pruned node” compare to a full node?",
      options: ["Weaker verification", "Same verification strength, it just discards old blocks to save storage", "Can't connect to the network", "Needs a mining rig"],
      answer: 1,
      explain: "Full verification isn't compromised at all, yet the barrier is much lower (callback to 6.2).",
    },
    {
      q: "What does “Initial Block Download (IBD)” do?",
      options: ["Mine the first block", "Verify the entire history block by block starting from genesis", "Download a wallet", "Register an account"],
      answer: 1,
      explain: "Only after personally verifying the full history do you truly become trustless.",
    },
    {
      q: "How does running a node embody your “one vote” in consensus?",
      options: ["You get to vote to change the rules", "Your node enforces the rules you choose and won't accept invalid blocks", "You can mine more coins", "You can veto transactions"],
      answer: 1,
      explain: "The rules are enforced bottom-up by every validator (callback to 6.4 / 8.1).",
    },
  ],

  further: [
    { label: "Bitcoin.org: Running A Full Node", url: "https://bitcoin.org/zh_CN/full-node" },
    { label: "Bitcoin Core official site", url: "https://bitcoincore.org/" },
  ],
};
