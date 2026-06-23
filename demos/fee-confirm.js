// 交互演示：手续费与确认
// 拖动费率（sat/vB），看费用和大致等待时间怎么变。强调"费用≈费率×交易大小，与金额无关"。
// 等待时间是示意性估计，真实取决于当时 mempool 拥堵程度。

export default function mount(root, lang) {
  const en = lang === "en";
  const SIZE = 141; // vB，典型 1 输入 2 输出交易的大致大小

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🚆 ${en ? "Fees & Confirmation · The fee rate is an auction" : "手续费与确认 · 费率是一场竞价"}</div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Fee rate:" : "费率："}<b id="fc-r">10</b> sat/vB</label>
        <input class="demo-slider" id="fc-rate" type="range" min="1" max="150" step="1" value="10" />
      </div>
      <div class="demo-block">
        <div class="demo-meta" id="fc-fee"></div>
        <div class="demo-meta" id="fc-wait" style="margin-top:6px"></div>
        <p class="demo-tip">${en ? `This transaction is about ${SIZE} vB, determined by the number of inputs/outputs and independent of the amount — so sending 0.001 BTC and sending 10 BTC cost almost the same fee.` : `这笔交易大小约 ${SIZE} vB，由输入/输出个数决定、与金额无关——所以转 0.001 BTC 和转 10 BTC，手续费几乎一样。`}</p>
      </div>
    </div>`;

  const rate = root.querySelector("#fc-rate");
  function upd() {
    const r = parseInt(rate.value, 10);
    root.querySelector("#fc-r").textContent = r;
    const sats = r * SIZE;
    root.querySelector("#fc-fee").innerHTML = en
      ? `Estimated fee ≈ <b>${sats.toLocaleString()}</b> sats (${(sats / 1e8).toFixed(8)} BTC)`
      : `预计手续费 ≈ <b>${sats.toLocaleString()}</b> 聪（${(sats / 1e8).toFixed(8)} BTC）`;
    let wait;
    if (r < 5) wait = en ? "during congestion it may take hours to days" : "拥堵时可能要等数小时到数天";
    else if (r < 20) wait = en ? "usually confirmed within 30–60 minutes" : "通常 30–60 分钟内被打包";
    else wait = en ? "usually confirmed in the next block (about 10 minutes)" : "通常下一个区块（约 10 分钟）就被打包";
    root.querySelector("#fc-wait").innerHTML = en ? `The higher your bid, the higher the priority → ${wait}.` : `出价越高越优先 → ${wait}。`;
  }
  rate.addEventListener("input", upd);
  upd();
}
