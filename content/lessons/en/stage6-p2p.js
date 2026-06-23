export default {
  id: "p2p-network",
  stage: 6,
  order: 1,
  title: "The P2P Network: A “Gossip Network” With No Server",
  difficulty: "core",
  prereqs: ["consensus"],

  oneLiner:
    "Bitcoin has no central server. Tens of thousands of nodes connect directly to one another into a single peer-to-peer network, and new transactions and new blocks spread between nodes like gossip — one tells ten, ten tell a hundred. Anyone can join, and no one is the center.",

  intuition: `
When you send a transaction from your wallet, it isn't sent to "Bitcoin Inc.'s server" — there is no such thing. Bitcoin runs on a **P2P (peer-to-peer) network**: every **node** is both a client and a server, all connected directly to one another, and no one is any more "central" than anyone else.

New transactions and new blocks are simply **relayed from one node to its neighbors**, who relay them to their own neighbors, and so on — spreading through the crowd like gossip and reaching the entire globe in seconds. **Joining requires no permission**: download the software, connect to a few neighbors, and you are a part of the network. Precisely because there is no center, this network is **extremely hard to shut down** — to censor it you would have to plug every single node on Earth at once.

The demo on the right: broadcast from one node and watch the message hop its way across the whole network.

**In this lesson we break the "P2P network" into four pieces:**

- **① How nodes find each other — from DNS seeds to address gossip**
- **② How one message reaches the whole network — the inv / getdata handshake**
- **③ Why nodes verify before relaying — the network's built-in "immune system"**
- **④ Why this network can't be turned off — decentralization at the infrastructure layer**
`,

  mechanics: `
### ① How nodes find each other

When a brand-new node boots up, it knows no one, so it "breaks the ice" in two steps:

- **DNS seeds**: Bitcoin Core ships with a handful of community-maintained domains (such as \`seed.bitcoin.sipa.be\`). The node resolves these domains and gets back **a batch of IPs of currently online nodes** to use as its first connections. This is the only step with even a whiff of "centralization," so multiple **independent operators** are deliberately hardcoded to prevent any single point from misbehaving.
- **Address gossip (addr gossip)**: once connected to its first neighbors, nodes exchange \`addr\` / \`getaddr\` messages to **swap lists of "who else I know."** Through this word-of-mouth, a node quickly builds up a local address database (peers.dat) it can use directly on the next boot, no longer needing the DNS seeds.

> There is also a fallback: the software **hardcodes a small set of "seed node" addresses**, so even if every DNS seed fails, a node can still cold-start from these.

### ② How one message reaches the whole network

Nodes don't naively send the full transaction to everyone they see. Instead they use a **"announce first, fetch on demand"** handshake that avoids redundant transfers:

- **inv (inventory announcement)**: after node A receives a new transaction, it broadcasts only a tiny message to its neighbors — "I have something new, its hash is xxx."
- **getdata (request)**: when neighbor B sees that it **doesn't have this hash yet**, only then does it reply with a \`getdata\` to "ask for" the full data; if it already had it, it does nothing.
- **tx / block (delivery)**: only now does A send the full transaction or block to B.

This mechanism is called **gossip**. A transaction typically reaches the vast majority of the network **within seconds**. Block propagation has an extra optimization: nodes often use **compact blocks (BIP152)**, because a neighbor's mempool most likely already contains these transactions, so it only needs to send the "block header + a string of short transaction IDs" and the peer can reassemble the whole block locally, saving a great deal of bandwidth (Stage 6.3 covers block propagation in detail).

### ③ Why nodes verify before relaying

This is the most crucial yet most easily overlooked point about the P2P network: **every node first verifies against the full consensus rules, then decides whether to relay** (callback to Stage 2.4).

- On receiving a transaction, a node checks: does the referenced UTXO still exist, are the signatures valid, is there any double-spend, is the fee rate high enough to enter its own mempool… **fail any one check and it is simply discarded, never relayed**.
- The same goes for blocks: a block that fails proof-of-work or contains an illegal transaction is rejected on the spot.
- The effect: a fake message **at most pesters the immediate ring of neighbors it connects to, and is then "immunized" away layer by layer** — it never spreads. So a malicious node can neither fool you nor pollute the network. This is exactly why **running your own node** is what makes you truly trustless.

### ④ Why this network can't be turned off

Putting the three points above together gives us the censorship resistance of Bitcoin's infrastructure layer:

- **No single point**: in 2026 the network has roughly **tens of thousands of reachable full nodes** (plus many more unreachable nodes hidden behind firewalls), spread across more than a hundred countries. There is no one server whose shutdown stops the network.
- **Resilience**: individual nodes can drop offline, be blocked, or be attacked, and their neighbors automatically reconnect to other nodes while the network keeps running — its topology is designed from the ground up so that "local damage still leaves the whole alive."
- **Resistance to blocking**: truly censoring it worldwide in lockstep is nearly impossible technically; on top of that, nodes can run over hidden networks like **Tor and I2P** (Stage 6.2 will revisit how nodes are run), raising the bar even higher.

This is exactly how decentralization extends from the "ledger" to the "network infrastructure": not only is the data not centralized, **even the pipes that carry the data have no center**.
`,

  demo: "gossip",

  analogy: `
The Bitcoin network is like **gossip in a small town**: there is no broadcast station, but everyone tells a few acquaintances the news they hear, and those acquaintances tell their own acquaintances — a message races across the whole town in no time.

Want to "censor" a piece of gossip? You'd have to cover every single mouth at once. For a network of tens of thousands of nodes spread across the globe, that is all but impossible.
`,

  misconceptions: [
    "“Transactions are sent to Bitcoin's central server.” — There is no central server. A transaction is first broadcast to a few of your node's neighbors, then spreads hop by hop across the network via gossip, with no central party receiving it.",
    "“Shutting down a few big nodes can halt Bitcoin.” — It can't. The network is made up of tens of thousands of peer nodes worldwide; when a few drop offline, neighbors automatically reconnect to others, with no impact.",
    "“Joining the Bitcoin network requires approval.” — It doesn't. Just download node software and connect to neighbors via DNS seeds — no permission, no registration.",
    "“A node relays everything it receives unconditionally.” — It doesn't. Each node first verifies against the full consensus rules and discards anything non-compliant without relaying — a fake message at most pesters one ring of neighbors before being immunized away.",
    "“DNS seeds are a center; block them and Bitcoin is finished.” — It isn't. DNS seeds are used only for that initial cold start; afterward nodes learn peers through addr gossip and a local address database, with hardcoded seed nodes as a final fallback.",
  ],

  quiz: [
    {
      q: "Where is a Bitcoin transaction ultimately sent?",
      options: ["Bitcoin's official server", "A handful of your node's neighbors in the peer-to-peer network, which then relay it onward", "Some exchange", "Satoshi's computer"],
      answer: 1,
      explain: "There is no central server; it spreads through gossip-style relaying between nodes.",
    },
    {
      q: "How does a new node find its first batch of neighbors?",
      options: ["By calling customer support", "Built-in DNS seeds, then exchanging address lists with each other", "By scanning every IP on the internet", "By registering with a mining pool"],
      answer: 1,
      explain: "DNS seeds bootstrap the connections; addr gossip expands the set of peers.",
    },
    {
      q: "Why is the Bitcoin network extremely hard to shut down?",
      options: ["It is protected by an army", "It is decentralized, with no single point to attack; if individual nodes drop, the network runs on", "All nodes are underground", "Governments forbid shutting it down"],
      answer: 1,
      explain: "Censoring it would require plugging every node on Earth at once — almost impossible.",
    },
    {
      q: "What does a node do when it receives a new transaction?",
      options: ["Relay it unconditionally", "Verify it against the rules first, and only accept and relay it to neighbors if compliant", "Collect a fee first", "Report it to a central authority"],
      answer: 1,
      explain: "Verify first, then propagate; non-compliant messages don't spread.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Network / Nodes", url: "https://learnmeabitcoin.com/beginners/guide/" },
    { label: "Bitcoin Core: Running a Full Node", url: "https://bitcoin.org/zh_CN/full-node" },
  ],
};
