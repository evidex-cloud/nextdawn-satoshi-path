// 交互演示：造一笔交易（UTXO 选币）
// 从钱包里的几枚 UTXO 选作输入，凑够"付款 + 手续费"，看找零怎么来。
// 手续费这里用固定值示意；真实手续费取决于交易大小（见 4.4）。

export default function mount(root, lang) {
  const en = lang === "en";
  const wallet = [0.40, 0.15, 0.60, 0.05, 0.25];
  const FEE = 0.0002;
  let pay = 0.5;
  const sel = new Set();

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${en ? "🧱 Build a transaction · pick UTXOs to pay" : "🧱 造一笔交易 · 选 UTXO 付款"}</div>
      <div class="demo-block">
        <label class="demo-label">${en ? "The UTXOs in your wallet (click to use as inputs):" : "你钱包里的 UTXO（点选作为输入）："}</label>
        <div class="coins" id="cs-coins"></div>
      </div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Pay Bob:" : "付给 Bob："}<b id="cs-payl">0.5</b> BTC</label>
        <input class="demo-slider" id="cs-pay" type="range" min="0.05" max="1.2" step="0.05" value="0.5" />
      </div>
      <div class="demo-out demo-out-sm" id="cs-out"></div>
      <p class="demo-tip">${en ? `Fee shown as a flat ${FEE} BTC (real fees depend on transaction size, see 4.4). A UTXO must be spent whole; the difference comes back to you as change.` : `手续费按固定 ${FEE} BTC 示意（真实手续费看交易大小，见 4.4）。UTXO 必须整枚花掉，差额作为找零回到你自己。`}</p>
    </div>`;

  const coinsEl = root.querySelector("#cs-coins");
  const r = (v) => Number(v.toFixed(8));

  function paintCoins() {
    coinsEl.innerHTML = wallet.map((v, i) => `<button class="coin ${sel.has(i) ? "sel" : ""}" data-i="${i}">${v} BTC</button>`).join("");
    coinsEl.querySelectorAll(".coin").forEach((b) =>
      b.addEventListener("click", () => {
        const i = +b.dataset.i;
        sel.has(i) ? sel.delete(i) : sel.add(i);
        paintCoins(); calc();
      }));
  }
  function calc() {
    const out = root.querySelector("#cs-out");
    const inAmt = [...sel].reduce((s, i) => s + wallet[i], 0);
    const need = pay + FEE;
    if (sel.size === 0) { out.innerHTML = (en ? "No UTXOs selected yet. Pick a few to reach " : "还没选 UTXO。选几枚凑够 ") + r(need) + (en ? " BTC (including fee)." : " BTC（含手续费）。"); return; }
    if (inAmt < need - 1e-9) {
      out.innerHTML = (en ? "Inputs total <b>" : "输入合计 <b>") + r(inAmt) + (en ? "</b> BTC, <span style='color:var(--red)'>not enough</span> (need " : "</b> BTC，<span style='color:var(--red)'>不够</span>（需 ") + r(need) + (en ? "). Pick one more." : "）。再选一枚。");
      return;
    }
    const change = r(inAmt - pay - FEE);
    out.innerHTML = en
      ? "✅ Transaction built successfully:<br>Inputs total <b>" + r(inAmt) + "</b> BTC (" + sel.size + " UTXOs)" +
        "<br>→ Output ①　pay Bob　<b>" + pay + "</b> BTC" +
        "<br>→ Output ②　change to yourself　<b>" + change + "</b> BTC" +
        "<br>→ Fee (inputs − outputs) <b>" + FEE + "</b> BTC"
      : "✅ 交易构造成功：<br>输入合计 <b>" + r(inAmt) + "</b> BTC（" + sel.size + " 个 UTXO）" +
        "<br>→ 输出①　付 Bob　<b>" + pay + "</b> BTC" +
        "<br>→ 输出②　找零给自己　<b>" + change + "</b> BTC" +
        "<br>→ 手续费（输入 − 输出）<b>" + FEE + "</b> BTC";
  }

  const payS = root.querySelector("#cs-pay");
  payS.addEventListener("input", () => { pay = parseFloat(payS.value); root.querySelector("#cs-payl").textContent = pay; calc(); });
  paintCoins();
  calc();
}
