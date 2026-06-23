// 交互演示：节点类型对比
// 点一类节点，看它存什么、验证到什么程度、要信任谁。

export default function mount(root, lang) {
  const en = lang === "en";
  const nodes = [
    {
      k: "full", name: en ? "Full node" : "全节点",
      store: en ? "The entire blockchain (hundreds of GB)" : "整条区块链（数百 GB）",
      valid: en ? "Personally verifies every transaction and the full consensus rules of every block" : "亲自验证每一笔交易、每一个区块的全部共识规则",
      trust: en ? "Trusts no one, only what it has verified itself—“Don’t trust, verify”" : "谁都不信，只信自己验证过的——“Don’t trust, verify”",
      note: en ? "The cornerstone of Bitcoin's trustlessness. Run one yourself and you needn't believe anyone's claims about the chain's state." : "比特币去信任的基石。你自己跑一个，就不必相信任何人告诉你的链状态。",
    },
    {
      k: "pruned", name: en ? "Pruned node" : "剪枝节点",
      store: en ? "Discards old blocks after verifying them, keeping only a recent slice (a few GB)" : "验证后丢弃旧区块，只留最近一小部分（几 GB）",
      valid: en ? "Like a full node, fully validates every block" : "和全节点一样，全量验证每一个区块",
      trust: en ? "Same as a full node: verifies itself, trusts no one" : "同全节点：自己验证，谁都不信",
      note: en ? "A disk-saving full node: verification is no weaker, it simply no longer keeps history long-term and can't serve old blocks to others." : "省硬盘的全节点：验证强度不打折，只是不再长期保存历史、无法把老区块提供给别人。",
    },
    {
      k: "spv", name: en ? "Light wallet (SPV)" : "轻钱包（SPV）",
      store: en ? "Stores only block headers (tens of MB)" : "只存区块头（几十 MB）",
      valid: en ? "Uses a Merkle proof to confirm “my transaction is in some block,” but doesn't verify all the rules" : "用默克尔证明确认“我的交易在某区块里”，但不验证全部规则",
      trust: en ? "Relies more heavily on information provided by full nodes; a stronger trust assumption" : "较多依赖全节点提供的信息，信任假设更强",
      note: en ? "Common in mobile wallets. Lightweight, but less secure than self-verifying—recall the Merkle proof from stage 3.3." : "手机钱包常用。轻便，但安全性弱于自验——回扣阶段 3.3 的默克尔证明。",
    },
  ];
  let cur = "full";

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🖥️ ${en ? "Node types · what each stores, what each trusts" : "节点类型 · 各自存什么、信什么"}</div>
      <div class="demo-btns" id="nt-btns"></div>
      <div class="detail" id="nt-detail"></div>
    </div>`;

  function paint() {
    root.querySelector("#nt-btns").innerHTML = nodes.map((n) =>
      `<button class="sc-col ${n.k === cur ? "active" : ""}" data-k="${n.k}">${n.name}</button>`).join("");
    const n = nodes.find((x) => x.k === cur);
    root.querySelector("#nt-detail").innerHTML =
      `<div><b>${n.name}</b></div>
       <div class="dk" style="margin-top:8px">📦 ${en ? "Storage" : "存储"}</div><div>${n.store}</div>
       <div class="dk" style="margin-top:8px">✅ ${en ? "Validation" : "验证"}</div><div>${n.valid}</div>
       <div class="dk" style="margin-top:8px">🤝 ${en ? "Trust" : "信任"}</div><div>${n.trust}</div>
       <div style="margin-top:10px">${n.note}</div>`;
    root.querySelectorAll("#nt-btns .sc-col").forEach((b) =>
      b.addEventListener("click", () => { cur = b.dataset.k; paint(); }));
  }
  paint();
}
