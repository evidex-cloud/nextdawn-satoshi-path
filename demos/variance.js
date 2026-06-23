// 交互演示：单干 vs 矿池
// 同样的算力份额，模拟 solo 挖矿（忽高忽低、看运气）和矿池（每块稳定分一点）的收入差别。

export default function mount(root, lang) {
  const en = lang === "en";
  const BLOCKS = 210, REWARD = 3.125;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${en ? "🎰 Solo vs pool · same hashrate, different lives" : "🎰 单干 vs 矿池 · 同样算力，不同人生"}</div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Your share of network hashrate:" : "你占全网算力："}<b id="va-s">2</b>%</label>
        <input class="demo-slider" id="va-share" type="range" min="1" max="10" step="1" value="2" />
      </div>
      <div class="demo-btns"><button class="demo-btn" id="va-run">${en ? `▶ Simulate ${BLOCKS} blocks (about ${Math.round(BLOCKS * 10 / 60 / 24)} days)` : `▶ 模拟 ${BLOCKS} 个区块（约 ${Math.round(BLOCKS * 10 / 60 / 24)} 天）`}</button></div>
      <div class="demo-meta">${en ? `Solo: the cells where you win a block on your own (only orange ones earn ${REWARD} BTC)` : `单干：每个区块你独自中奖的格子（橙色才有 ${REWARD} BTC 入账）`}</div>
      <div class="var-strip" id="va-strip"></div>
      <div class="demo-meta" id="va-solo"></div>
      <div class="demo-meta" id="va-pool" style="margin-top:4px"></div>
      <div class="demo-meta" id="va-take" style="margin-top:6px"></div>
    </div>`;

  const share = root.querySelector("#va-share");
  share.addEventListener("input", () => { root.querySelector("#va-s").textContent = share.value; });

  root.querySelector("#va-run").addEventListener("click", () => {
    const p = parseInt(share.value, 10) / 100;
    let wins = 0;
    const cells = [];
    for (let i = 0; i < BLOCKS; i++) { const win = Math.random() < p; if (win) wins++; cells.push(win); }
    root.querySelector("#va-strip").innerHTML = cells.map((w) => `<span class="var-cell ${w ? "win" : ""}"></span>`).join("");
    const soloIncome = wins * REWARD;
    const poolIncome = BLOCKS * p * REWARD;
    root.querySelector("#va-solo").innerHTML = en
      ? "Solo: out of " + BLOCKS + " blocks you only won <b>" + wins + "</b> → income <b>" + soloIncome.toFixed(3) + "</b> BTC (wildly up and down, all luck)."
      : "单干：" + BLOCKS + " 个块里你只中了 <b>" + wins + "</b> 个 → 收入 <b>" + soloIncome.toFixed(3) + "</b> BTC（忽高忽低，全看运气）。";
    root.querySelector("#va-pool").innerHTML = en
      ? "Pool: each block pays out steadily by your " + share.value + "% share → total <b>" + poolIncome.toFixed(3) + "</b> BTC (a steady trickle)."
      : "矿池：每块按 " + share.value + "% 份额稳定分到一点 → 累计 <b>" + poolIncome.toFixed(3) + "</b> BTC（细水长流）。";
    root.querySelector("#va-take").innerHTML = en
      ? 'Both have the <b>same long-run expectation</b>, but the pool smooths the “lottery-ticket” swings into a “steady salary.” Click “Simulate” a few more times and watch the solo result come out very differently each time.'
      : '两者<b>长期期望相同</b>，但矿池把"中彩票"般的波动抹平成"稳定工资"。多点几次"模拟"，看单干结果每次都大不一样。';
  });
}
