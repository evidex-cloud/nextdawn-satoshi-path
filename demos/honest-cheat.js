// 交互演示：诚实 vs 作弊的博弈
// 拖动"你自己持有的比特币价值"，看发动 51% 攻击如何自毁——投入越深，作弊越亏。

export default function mount(root, lang) {
  const en = lang === "en";
  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🎯 ${en ? "The Game: Honest vs. Cheat, Which Pays More" : "博弈：诚实 vs 作弊，哪个更划算"}</div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Value of the bitcoin you (a big miner) hold yourself:" : "你（大矿工）自己持有的比特币价值："}<b id="hc-h">5</b>${en ? " hundred million USD" : " 亿美元"}</label>
        <input class="demo-slider" id="hc-hold" type="range" min="0" max="20" step="1" value="5" />
      </div>
      <div class="cust">
        <div class="cust-cell"><h5>${en ? "Mine honestly" : "诚实挖矿"}</h5><div id="hc-honest"></div></div>
        <div class="cust-cell"><h5>${en ? "Launch a 51% attack" : "发动 51% 攻击"}</h5><div id="hc-attack"></div></div>
      </div>
      <div class="demo-meta" id="hc-verdict" style="margin-top:8px"></div>
      <p class="demo-tip">${en ? "An attack not only burns through sky-high hashrate costs—once it succeeds, trust collapses and the price crashes, so your mining rigs and holdings depreciate together. The deeper your stake, the more cheating is self-destructive. This is the essence of how Bitcoin uses incentives to protect security." : "攻击不仅要烧掉天价算力成本，一旦得手、信任崩塌、币价暴跌，你手里的矿机和持币会一起贬值。投入越深，作弊越是\"自毁\"。这就是比特币用激励守护安全的精髓。"}</p>
    </div>`;

  const hold = root.querySelector("#hc-hold");
  function upd() {
    const h = parseInt(hold.value, 10);
    root.querySelector("#hc-h").textContent = h;
    root.querySelector("#hc-honest").innerHTML = en
      ? '<span class="pill ok">Steady returns</span> You keep collecting block rewards + fees; the assets you hold keep their value.'
      : '<span class="pill ok">稳定收益</span> 持续拿出块奖励 + 手续费；你持有的资产保值。';
    root.querySelector("#hc-attack").innerHTML = en
      ? '<span class="pill bad">Likely a loss</span> Sky-high hashrate costs + a trust collapse that crashes the price, so your own <b>' + h + "</b> hundred-million-dollar position shrinks along with it."
      : '<span class="pill bad">大概率亏</span> 天价算力成本 + 信任崩塌致币价暴跌，你自己 <b>' + h + "</b> 亿美元持仓随之缩水。";
    root.querySelector("#hc-verdict").innerHTML = en
      ? "Conclusion: the more you put in (a position of " + h + " hundred million), the more cheating <b>burns down your own house</b> → <b>honesty is the dominant strategy</b>."
      : "结论：你投入越多（持仓 " + h + " 亿），作弊越是<b>自毁长城</b> → <b>诚实是占优策略</b>。";
  }
  hold.addEventListener("input", upd);
  upd();
}
