// 交互演示：bitcoin-cli RPC 控制台（示意）
// 点命令，向"你的全节点"发问，看返回。输出为示意数据。

export default function mount(root, lang) {
  const en = lang === "en";
  const CMDS = [
    { c: "getblockcount", d: en ? "current block height" : "当前区块高度", o: "862394" },
    { c: "getbalance", d: en ? "wallet balance (BTC)" : "钱包余额(BTC)", o: "0.04250000" },
    { c: "getnewaddress", d: en ? "generate a new receiving address" : "生成新收款地址", o: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq" },
    { c: "getblockchaininfo", d: en ? "chain status" : "链状态", o: '{\n  "chain": "main",\n  "blocks": 862394,\n  "verificationprogress": 0.9999987,\n  "pruned": false,\n  "size_on_disk": 643829114213\n}' },
    { c: "getmempoolinfo", d: en ? "mempool status" : "待确认池状态", o: '{\n  "size": 84217,\n  "bytes": 41882190,\n  "mempoolminfee": 0.00001000\n}' },
    { c: "estimatesmartfee 6", d: en ? "estimate fee rate to confirm within 6 blocks" : "估算 6 块内确认的费率", o: '{\n  "feerate": 0.00012000,\n  "blocks": 6\n}' },
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">⌨️ bitcoin-cli · ${en ? "talk to your node (illustrative)" : "和你的节点对话（示意）"}</div>
      <div class="demo-btns" id="rpc-btns"></div>
      <div class="term" id="rpc-term"><span class="dim">// ${en ? "Click a command above to ask your full node. Outputs are illustrative data." : "点上面的命令，向你的全节点发问。输出为示意数据。"}</span></div>
    </div>`;

  const term = root.querySelector("#rpc-term");
  root.querySelector("#rpc-btns").innerHTML = CMDS.map((c, i) =>
    `<button class="demo-btn" data-i="${i}" title="${c.d}">${c.c.split(" ")[0]}</button>`).join("");
  root.querySelectorAll("#rpc-btns [data-i]").forEach((b) =>
    b.addEventListener("click", () => {
      const cmd = CMDS[+b.dataset.i];
      const line = document.createElement("div");
      line.innerHTML = '<span class="cmd">$ bitcoin-cli ' + cmd.c + "</span>\n<span class=\"out\">" + cmd.o.replace(/</g, "&lt;") + "</span>";
      term.appendChild(line);
      term.scrollTop = term.scrollHeight;
    }));
}
