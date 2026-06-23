export default {
  id: "rpc",
  stage: 10,
  order: 2,
  title: "RPC：和你的节点对话",
  difficulty: "deep",
  prereqs: ["run-node"],

  oneLiner:
    "全节点跑起来后，你通过 RPC（远程过程调用）和它对话——用 bitcoin-cli 敲命令，就能查链高度、查余额、生成地址、估算费率、广播交易。这是把节点从“后台程序”变成“你亲手用的工具”的接口。",

  intuition: `
节点在后台默默验证，那你怎么"用"它？靠 **RPC**：一套让你给节点下命令、取数据的接口。最常用的客户端是 **bitcoin-cli**，敲几个命令就能：

- \`getblockcount\` —— 当前区块高度
- \`getbalance\` —— 钱包余额
- \`getnewaddress\` —— 生成一个新收款地址
- \`estimatesmartfee 6\` —— 估算"6 个区块内确认"该出多少费率
- \`sendrawtransaction\` —— 把一笔签好的交易广播出去

关键是：当这些数据来自**你自己的节点**，你就是在**去信任地**查询——没有任何第三方服务器插在中间。你的钱包、各种工具，底层用的也是同一套 RPC。

右边点几个命令，看你的节点怎么回应。

**这一节，我们把 RPC 拆成四块：**

- **① RPC 是什么——bitcoind 的 JSON-RPC 接口与 bitcoin-cli**
- **② 常用命令分几类——链查询、钱包、费率、网络、原始交易**
- **③ 安全模型——只听本机、cookie 认证，别裸暴露公网**
- **④ 它是万物的数据源——你伸进引擎里的那只手**
`,

  mechanics: `
### ① RPC 是什么：bitcoind 的接口与 bitcoin-cli

\`bitcoind\` 在监听一个 **JSON-RPC 接口**（默认端口主网 8332、testnet 18332、signet 38332）。所谓 RPC（远程过程调用），就是你发一个 JSON 请求"调用某个方法"，它回一个 JSON 结果。

- **\`bitcoin-cli\` 是官方自带的轻量命令行客户端**：你敲 \`bitcoin-cli getblockcount\`，它替你把请求打包成 JSON 发给 \`bitcoind\`，再把回包打印出来。
- 底层其实就是一条 HTTP POST。等价的裸调用长这样：\`curl --user user:pass --data-binary '{\"jsonrpc\":\"1.0\",\"method\":\"getblockcount\",\"params\":[]}' http://127.0.0.1:8332/\` —— bitcoin-cli 只是把这套样板替你省了。
- 想知道某个命令怎么用，直接 \`bitcoin-cli help getblockcount\`，会打印它的参数和返回结构；\`bitcoin-cli help\` 则列出全部命令。

### ② 常用命令分几类

几百个 RPC 大致归成五组，记住分类就能按需查：

- **链查询**：\`getblockchaininfo\`（链整体状态）、\`getblockhash 840000\` + \`getblock <hash>\`（取某高度的区块）、\`getrawtransaction <txid> true\`（取一笔交易的解码结果）、\`gettxout <txid> <n>\`（查某个 UTXO 还在不在）。
- **钱包**：\`getbalance\`、\`getnewaddress\`、\`listunspent\`（列出你能花的 UTXO，正是阶段 4.1 的选币原料）、\`gettransaction <txid>\`。
- **mempool 与费率**：\`getmempoolinfo\`、\`estimatesmartfee 6\`（返回"想在 6 个区块内确认"的建议费率，阶段 4.4）。
- **网络**：\`getpeerinfo\`（看连了哪些邻居）、\`getnetworkinfo\`、\`getconnectioncount\`。
- **原始交易**：\`createrawtransaction\` / \`fundrawtransaction\` / \`signrawtransactionwithwallet\` / \`sendrawtransaction\` —— 手工构造、补找零、签名、广播一条龙，正是最后一节要用的。

举个串起来的小例子：\`estimatesmartfee 6\` 拿到费率 → \`listunspent\` 选出够付的 UTXO → 构造并签名 → \`sendrawtransaction\` 广播。你会发现钱包替你做的，本质就是这串 RPC。

### ③ 安全模型：只听本机、需认证

RPC 能查余额、能广播交易，所以它的访问权限必须管死。Bitcoin Core 的默认设计已经很稳：

- **默认只监听本机（127.0.0.1）**：外网根本连不进来，除非你显式改 \`rpcbind\` / \`rpcallowip\` 把它放出去。
- **必须认证**：启动时节点会在数据目录生成一个 \`.cookie\` 文件（一次性随机口令），本机的 \`bitcoin-cli\` 自动读它；要给程序长期用，则在 \`bitcoin.conf\` 里用 \`rpcauth\` 配一组账号密码（明文密码不进配置文件）。
- ⚠ **绝不要把 8332 裸暴露到公网**。真要远程访问，走 **SSH 隧道**或在内网里通过 VPN——把 RPC 当成你家的总开关，不是前门门铃。

### ④ 它是万物的数据源

想通一件事，你对比特币工具栈的理解就升一层：**区块浏览器、桌面/硬件钱包、记账脚本、闪电节点……底层几乎都在调 RPC（或等价接口）拿数据**。

- 所以同一个问题"我的余额是多少"，区别只在于**问谁的节点**：连别人的节点 = 把信任交给别人；连你自己的节点 = 去信任（阶段 10.1）。
- 一旦能调 RPC，你就能在它之上**写脚本、做自动化、亲手构造交易**（下一节）。节点是引擎，RPC 是你伸进去的那只手——从这里开始，你不再是比特币的"用户"，而是能直接驱动它的人。
`,

  demo: "rpc-console",

  analogy: `
如果说全节点是**引擎**，那 RPC 就是**方向盘和仪表盘**——让你能读取每一个读数、下达每一道指令，真正把这台机器"开起来"，而不只是让它在后台空转。
`,

  misconceptions: [
    "“开了 RPC 就把我的节点暴露给全网了。” —— 默认只监听 127.0.0.1 且需 cookie/账号认证；要对外得自己显式改 rpcbind/rpcallowip，开放与否完全由你决定。",
    "“RPC 只有程序员能用。” —— bitcoin-cli 就是敲几个英文命令，getbalance、getnewaddress 都很直白；help 还会告诉你每个命令怎么用。",
    "“RPC 返回的数据来自互联网/第三方。” —— 来自你自己已验证的节点本地数据库，这正是它去信任的意义。",
    "“查余额只能靠钱包 App。” —— 连自己节点的 RPC 查询（getbalance / listunspent），才是最去信任的方式。",
    "“远程访问 RPC，把端口转发出去就行。” —— 千万别裸暴露 8332；要远程请走 SSH 隧道或 VPN，否则等于把钱包总开关挂在公网上。",
  ],

  quiz: [
    {
      q: "RPC 在这里的作用是？",
      options: ["挖矿", "让你给自己的节点下命令、取数据的接口", "加密通信", "连接交易所"],
      answer: 1,
      explain: "bitcoin-cli 通过 RPC 与节点对话。",
    },
    {
      q: "用自己节点的 RPC 查余额，好处是？",
      options: ["更快", "去信任：不依赖任何第三方服务器", "免手续费", "匿名"],
      answer: 1,
      explain: "数据来自你自己验证过的节点。",
    },
    {
      q: "关于 RPC 的安全，默认情况是？",
      options: ["对全网开放", "只监听本机且需认证，是否对外由你控制", "无需密码", "矿工可访问"],
      answer: 1,
      explain: "默认 localhost + 认证，别裸暴露公网。",
    },
    {
      q: "区块浏览器、钱包的数据，本质来自？",
      options: ["凭空生成", "对某个节点的 RPC 调用（连自己的=去信任）", "中本聪", "交易所"],
      answer: 1,
      explain: "区别只在连的是谁的节点。",
    },
  ],

  further: [
    { label: "Bitcoin Core RPC 命令参考", url: "https://developer.bitcoin.org/reference/rpc/" },
    { label: "learnmeabitcoin：bitcoin-cli", url: "https://learnmeabitcoin.com/technical/" },
  ],
};
