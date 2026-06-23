// 交互演示：读懂区块浏览器
// 点一笔真实交易的各个部件，看它是什么、对应你学过的哪一课——一次总复习。

export default function mount(root, lang) {
  const en = lang === "en";
  const parts = [
    { k: "txid", label: en ? "Transaction ID" : "交易 ID", exp: en ? "This transaction's unique fingerprint, the hash of its contents. After SegWit it excludes the signatures, so it's stable. (Stage 5.1 / 8.2)" : "这笔交易的唯一指纹，对交易内容哈希得到。SegWit 后它不含签名，因而稳定。（阶段 5.1 / 8.2）" },
    { k: "in", label: en ? "Inputs ×2" : "输入 ×2", exp: en ? "Point to the 2 UTXOs you're spending, with an unlocking script/witness (signature) attached. The spent UTXOs are now invalidated. (Stage 4.1 / 4.2)" : "指向你要花的 2 个 UTXO，并附上解锁脚本/见证（签名）。被花的 UTXO 就此作废。（阶段 4.1 / 4.2）" },
    { k: "out", label: en ? "Outputs ×2" : "输出 ×2", exp: en ? "Newly created UTXOs: one paying the recipient, one returning change to yourself, each with its own lock. (Stage 4.1 / 4.3)" : "新创造的 UTXO：一个付给对方、一个找零给自己，各带一把锁。（阶段 4.1 / 4.3）" },
    { k: "fee", label: en ? "Fee" : "手续费", exp: en ? "Total inputs − total outputs, going to the miner who includes it. ≈ fee rate × transaction size (vB). (Stage 4.1 / 4.4)" : "输入总额 − 输出总额，归打包的矿工。≈ 费率 × 交易大小(vB)。（阶段 4.1 / 4.4）" },
    { k: "wit", label: en ? "Witness" : "见证", exp: en ? "The segregated signature data, weighted at 1/4 for a discount, and fixing transaction malleability. (Stage 8.2)" : "隔离出去的签名数据，按 1/4 计权享折扣，并修复了交易延展性。（阶段 8.2）" },
    { k: "conf", label: en ? "Confirmations 6" : "确认数 6", exp: en ? "Getting into a block counts as 1 confirmation; the more there are, the more irreversible. 6 confirmations is already solid for large amounts. (Stage 2.2 / 5.4)" : "进区块算 1 个确认，越多越不可逆；6 个确认对大额已很稳。（阶段 2.2 / 5.4）" },
  ];
  let cur = "txid";

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🔎 ${en ? "Reading a block explorer · the parts of a real transaction" : "读懂区块浏览器 · 一笔真实交易的部件"}</div>
      <div class="demo-meta">${en ? "Click any part to see what it is and which lesson it matches:" : "点任意部件，看它是什么、对应你学过的哪一课："}</div>
      <div class="demo-btns" id="ex-btns" style="margin-top:8px"></div>
      <div class="detail" id="ex-detail"></div>
      <p class="demo-tip">${en ? "Tip: a public explorer is a third party's view; to truly not have to trust, use your own node's explorer/RPC. Looking up your own address on a public explorer can also leak privacy (Stage 9.1)." : "提示：公共浏览器是第三方的视角；要真正去信任，用你自己节点的浏览器/RPC。在公共浏览器查自己的地址也可能泄露隐私（阶段 9.1）。"}</p>
    </div>`;

  function paint() {
    root.querySelector("#ex-btns").innerHTML = parts.map((p) =>
      `<button class="sc-col ${p.k === cur ? "active" : ""}" data-k="${p.k}">${p.label}</button>`).join("");
    const p = parts.find((x) => x.k === cur);
    root.querySelector("#ex-detail").innerHTML = "<div><b>" + p.label + "</b></div><div style=\"margin-top:8px\">" + p.exp + "</div>";
    root.querySelectorAll("#ex-btns .sc-col").forEach((b) =>
      b.addEventListener("click", () => { cur = b.dataset.k; paint(); }));
  }
  paint();
}
