// 交互演示：用代码构造并广播一笔交易
// 走一遍 bitcoinjs-lib / BDK 等库构造交易的标准流程，最后广播——也为整门课收尾。

export default function mount(root, lang) {
  const en = lang === "en";
  const steps = [
    { t: en ? "1 · Select UTXOs as inputs" : "1 · 选择 UTXO 作输入", d: en ? "Use a wallet or library to pick unspent outputs that cover the payment plus the fee. (Stage 4.1)" : "用钱包或库挑出够付款加手续费的未花费输出。（阶段 4.1）" },
    { t: en ? "2 · Build the outputs" : "2 · 构造输出", d: en ? "One paying the recipient, one returning change to yourself; the difference is the fee. (Stage 4.1 / 4.4)" : "一个付给对方、一个找零给自己；差额即手续费。（阶段 4.1 / 4.4）" },
    { t: en ? "3 · Sign each input" : "3 · 逐个签名输入", d: en ? "Sign the transaction with the matching private keys to produce the unlocking data; for multisig, collaborate via PSBT. (Stage 3.2 / 7.4)" : "用对应私钥对交易签名，生成解锁数据；多签则用 PSBT 协作。（阶段 3.2 / 7.4）" },
    { t: en ? "4 · Serialize into a raw transaction" : "4 · 序列化为原始交易", d: en ? "Pack the inputs, outputs, and witness into a single hex raw tx." : "把输入、输出、见证打包成一串十六进制 raw tx。" },
    { t: en ? "5 · Broadcast to a node" : "5 · 广播到节点", d: en ? "sendrawtransaction → enters the mempool, waiting to be mined. (Stage 6.3)" : "sendrawtransaction → 进入 mempool，等待打包。（阶段 6.3）" },
  ];
  let cur = -1;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🛠️ ${en ? "Build and broadcast a transaction in code" : "用代码构造并广播一笔交易"}</div>
      <div class="journey" id="bt"></div>
      <div class="demo-btns">
        <button class="demo-btn" id="bt-next">▶ ${en ? "Next" : "下一步"}</button>
        <button class="demo-btn" id="bt-reset">${en ? "Reset" : "重置"}</button>
      </div>
      <div class="demo-meta" id="bt-msg">${en ? "This is the standard flow for building a transaction with libraries like bitcoinjs-lib / BDK. Click “Next” to walk through it." : "这是用 bitcoinjs-lib / BDK 等库构造交易的标准流程。点“下一步”走一遍。"}</div>
    </div>`;

  const jy = root.querySelector("#bt");
  jy.innerHTML = steps.map((s, i) =>
    `<div class="jstep"><span class="jn">${i + 1}</span><div><div class="jt">${s.t}</div><div class="jd">${s.d}</div></div></div>`).join("");
  const els = [...jy.querySelectorAll(".jstep")];
  const next = root.querySelector("#bt-next");
  const msg = root.querySelector("#bt-msg");

  function paint() { els.forEach((e, i) => { e.classList.toggle("active", i === cur); e.classList.toggle("done", i < cur); }); }
  next.addEventListener("click", () => {
    if (cur < steps.length - 1) {
      cur++;
      paint();
      if (cur === steps.length - 1) {
        msg.innerHTML = en ? "🎉 Transaction broadcast! You just walked a transaction through its entire life from nothing — and finished the whole «NextDawn · Satoshi Path» too." : "🎉 交易已广播！你刚走完一笔交易从无到有的全过程——也走完了整条「聪之路」。";
        next.disabled = true;
      } else msg.textContent = steps[cur].t;
    }
  });
  root.querySelector("#bt-reset").addEventListener("click", () => {
    cur = -1; paint(); next.disabled = false; msg.textContent = en ? "Click “Next” to walk through the standard build flow." : "点“下一步”走一遍标准构造流程。";
  });
  paint();
}
