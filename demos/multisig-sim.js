// 交互演示：2-of-3 多签
// 一枚 UTXO 由 3 把钥匙共管，需任意 2 把签名才能花。收集签名，凑齐即可广播。

export default function mount(root, lang) {
  const en = lang === "en";
  const signers = [{ k: "alice", name: "Alice" }, { k: "bob", name: "Bob" }, { k: "carol", name: "Carol" }];
  const NEED = 2;
  const signed = new Set();

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🔐 ${en ? "2-of-3 multisig · gather enough keys to spend" : "2-of-3 多签 · 凑齐钥匙才能花"}</div>
      <div class="demo-meta">${en ? "This UTXO is jointly controlled by 3 keys; any <b>2</b> of them must sign to spend it." : "这枚 UTXO 由 3 把钥匙共管，需要其中任意 <b>2</b> 把签名才能动用。"}</div>
      <div class="demo-btns" id="ms-btns"></div>
      <div class="demo-meta" id="ms-status" style="margin-top:8px"></div>
      <div class="demo-btns" style="margin-top:6px"><button class="demo-btn" id="ms-reset">${en ? "Reset" : "重置"}</button></div>
      <p class="demo-tip">${en ? "Stealing a single key can't take the coins (not enough — needs 2); losing one key still lets you spend with the other two—that's the value of multisig in eliminating single points of failure. The standard format for passing this “not-yet-fully-signed transaction” between devices / people is PSBT." : "单把钥匙失窃也偷不走币（不足 2 把）；丢一把也还能用另外两把花掉——这就是多签消除单点故障的价值。在多设备 / 多人之间传递这份\"还没签完的交易\"，用的标准格式就是 PSBT。"}</p>
    </div>`;

  function paint() {
    root.querySelector("#ms-btns").innerHTML = signers.map((s) =>
      `<button class="demo-btn" data-k="${s.k}" ${signed.has(s.k) ? "disabled" : ""}>${signed.has(s.k) ? (en ? "✓ " + s.name + " signed" : "✓ " + s.name + " 已签") : (en ? "Sign with " + s.name + "'s key" : "用 " + s.name + " 的钥匙签名")}</button>`).join("");
    const n = signed.size;
    root.querySelector("#ms-status").innerHTML = n >= NEED
      ? (en ? '<span class="pill ok">✓ Collected ' + n + "/" + NEED + "</span> 2-of-3 satisfied, the transaction can be broadcast." : '<span class="pill ok">✓ 已凑齐 ' + n + "/" + NEED + "</span> 满足 2-of-3，交易可以广播了。")
      : (en ? "Signed " + n + "/" + NEED + ". " + (NEED - n) + " more needed." : "已签 " + n + "/" + NEED + " 把。还差 " + (NEED - n) + " 把。");
    root.querySelectorAll("#ms-btns [data-k]").forEach((b) =>
      b.addEventListener("click", () => { signed.add(b.dataset.k); paint(); }));
  }
  root.querySelector("#ms-reset").addEventListener("click", () => { signed.clear(); paint(); });
  paint();
}
