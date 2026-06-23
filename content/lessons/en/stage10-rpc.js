export default {
  id: "rpc",
  stage: 10,
  order: 2,
  title: "RPC: Talking to Your Node",
  difficulty: "deep",
  prereqs: ["run-node"],

  oneLiner:
    "Once your full node is running, you talk to it through RPC (Remote Procedure Call) — type commands with bitcoin-cli to check the chain height, check balances, generate addresses, estimate fee rates, and broadcast transactions. This is the interface that turns the node from a “background program” into a “tool you operate with your own hands.”",

  intuition: `
The node quietly verifies in the background — so how do you actually "use" it? Through **RPC**: a set of interfaces that let you give the node commands and pull data from it. The most common client is **bitcoin-cli**, and a few commands let you:

- \`getblockcount\` — the current block height
- \`getbalance\` — the wallet balance
- \`getnewaddress\` — generate a new receiving address
- \`estimatesmartfee 6\` — estimate the fee rate needed to "confirm within 6 blocks"
- \`sendrawtransaction\` — broadcast a signed transaction

The key point: when this data comes from **your own node**, you're querying **trustlessly** — no third-party server sits in the middle. Your wallet and all sorts of tools use this same RPC underneath.

Click a few commands on the right to see how your node responds.

**In this lesson we break RPC into four pieces:**

- **① What RPC is — bitcoind's JSON-RPC interface and bitcoin-cli**
- **② What the common commands break down into — chain queries, wallet, fees, network, raw transactions**
- **③ The security model — listens locally only, cookie auth, never expose it bare to the public internet**
- **④ It's the data source for everything — the hand you reach into the engine with**
`,

  mechanics: `
### ① What RPC is: bitcoind's interface and bitcoin-cli

\`bitcoind\` listens on a **JSON-RPC interface** (default ports: mainnet 8332, testnet 18332, signet 38332). RPC (Remote Procedure Call) means you send a JSON request to "call a method" and it returns a JSON result.

- **\`bitcoin-cli\` is the official lightweight command-line client that ships with it**: you type \`bitcoin-cli getblockcount\`, and it packages the request into JSON, sends it to \`bitcoind\`, and prints the reply back for you.
- Underneath it's really just an HTTP POST. The equivalent raw call looks like this: \`curl --user user:pass --data-binary '{“jsonrpc”:“1.0”,“method”:“getblockcount”,“params”:[]}' http://127.0.0.1:8332/\` — bitcoin-cli just saves you all that boilerplate.
- To learn how a command works, just run \`bitcoin-cli help getblockcount\`, which prints its parameters and return structure; \`bitcoin-cli help\` lists every command.

### ② What the common commands break down into

The few hundred RPCs roughly fall into five groups; remember the categories and you can look up what you need:

- **Chain queries**: \`getblockchaininfo\` (overall chain status), \`getblockhash 840000\` + \`getblock <hash>\` (get the block at a given height), \`getrawtransaction <txid> true\` (get the decoded result of a transaction), \`gettxout <txid> <n>\` (check whether a given UTXO still exists).
- **Wallet**: \`getbalance\`, \`getnewaddress\`, \`listunspent\` (list the UTXOs you can spend — exactly the raw material for coin selection in Stage 4.1), \`gettransaction <txid>\`.
- **Mempool and fees**: \`getmempoolinfo\`, \`estimatesmartfee 6\` (returns the suggested fee rate to "confirm within 6 blocks," Stage 4.4).
- **Network**: \`getpeerinfo\` (see which neighbors you're connected to), \`getnetworkinfo\`, \`getconnectioncount\`.
- **Raw transactions**: \`createrawtransaction\` / \`fundrawtransaction\` / \`signrawtransactionwithwallet\` / \`sendrawtransaction\` — hand-construct, add change, sign, and broadcast in one chain, exactly what the final lesson uses.

Here's a small example tying it together: \`estimatesmartfee 6\` gets a fee rate → \`listunspent\` selects UTXOs large enough to pay → construct and sign → \`sendrawtransaction\` broadcasts. You'll find that what the wallet does for you is essentially this chain of RPCs.

### ③ The security model: listens locally only, requires authentication

RPC can check balances and broadcast transactions, so its access permissions must be locked down tight. Bitcoin Core's default design is already quite solid:

- **By default it listens only on the local machine (127.0.0.1)**: the outside internet can't connect at all, unless you explicitly change \`rpcbind\` / \`rpcallowip\` to let it out.
- **Authentication is mandatory**: on startup the node generates a \`.cookie\` file in the data directory (a one-time random password), which the local \`bitcoin-cli\` reads automatically; for a program to use it long-term, configure a set of credentials with \`rpcauth\` in \`bitcoin.conf\` (the plaintext password never goes into the config file).
- ⚠ **Never expose 8332 bare to the public internet.** If you really need remote access, use an **SSH tunnel** or a VPN on your internal network — treat RPC as the master switch of your house, not a front-door doorbell.

### ④ It's the data source for everything

Understand one thing and your grasp of the Bitcoin toolchain rises a level: **block explorers, desktop/hardware wallets, accounting scripts, Lightning nodes… almost all of them call RPC (or an equivalent interface) underneath to get data**.

- So the same question "what's my balance" differs only in **whose node you ask**: connecting to someone else's node = handing trust to others; connecting to your own node = trustless (Stage 10.1).
- Once you can call RPC, you can **write scripts, automate, and hand-construct transactions** on top of it (next lesson). The node is the engine, RPC is the hand you reach in with — from here on you're no longer a "user" of Bitcoin, but someone who can drive it directly.
`,

  demo: "rpc-console",

  analogy: `
If the full node is the **engine**, then RPC is the **steering wheel and dashboard** — letting you read every gauge and issue every command, truly "driving" this machine rather than just letting it idle in the background.
`,

  misconceptions: [
    "“Turning on RPC exposes my node to the whole internet.” — By default it listens only on 127.0.0.1 and requires cookie/account authentication; to face outward you have to explicitly change rpcbind/rpcallowip yourself — whether it's open is entirely your decision.",
    "“RPC is only for programmers.” — bitcoin-cli is just a few English commands; getbalance and getnewaddress are very straightforward; help even tells you how each command works.",
    "“The data RPC returns comes from the internet / a third party.” — It comes from your own already-verified node's local database, which is exactly what makes it trustless.",
    "“Checking a balance can only be done through a wallet app.” — Querying through your own node's RPC (getbalance / listunspent) is the most trustless way of all.",
    "“To access RPC remotely, just forward the port.” — Never expose 8332 bare; for remote access use an SSH tunnel or VPN, otherwise it's like hanging your wallet's master switch out on the public internet.",
  ],

  quiz: [
    {
      q: "What is RPC's role here?",
      options: ["Mining", "The interface that lets you command your own node and pull data from it", "Encrypted communication", "Connecting to an exchange"],
      answer: 1,
      explain: "bitcoin-cli talks to the node via RPC.",
    },
    {
      q: "What's the benefit of checking your balance via your own node's RPC?",
      options: ["Faster", "Trustless: it doesn't depend on any third-party server", "No fees", "Anonymity"],
      answer: 1,
      explain: "The data comes from your own verified node.",
    },
    {
      q: "Regarding RPC security, what is the default situation?",
      options: ["Open to the whole internet", "Listens locally only and requires authentication; whether it faces outward is up to you", "No password needed", "Miners can access it"],
      answer: 1,
      explain: "Default is localhost + authentication; never expose it bare to the public internet.",
    },
    {
      q: "Where does the data in block explorers and wallets essentially come from?",
      options: ["Generated out of thin air", "An RPC call to some node (connecting to your own = trustless)", "Satoshi", "Exchanges"],
      answer: 1,
      explain: "The only difference is whose node you connect to.",
    },
  ],

  further: [
    { label: "Bitcoin Core RPC command reference", url: "https://developer.bitcoin.org/reference/rpc/" },
    { label: "learnmeabitcoin: bitcoin-cli", url: "https://learnmeabitcoin.com/technical/" },
  ],
};
