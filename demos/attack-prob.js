// 交互演示：51% 攻击成功概率
// 用中本聪白皮书第 11 节的简化近似 P ≈ (q/p)^z（q<50% 时），
// 看攻击者算力占比 q 和确认数 z 怎样决定双花反超的概率。

export default function mount(root, lang) {
  const en = lang === "en";
  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${en ? "🏁 51% attack success probability (whitepaper §11, simplified)" : "🏁 51% 攻击成功概率（白皮书第 11 节，简化）"}</div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Attacker's hashrate share q:" : "攻击者算力占比 q："}<b id="ap-q">30</b>%</label>
        <input class="demo-slider" id="ap-qq" type="range" min="5" max="60" step="1" value="30" />
        <label class="demo-label" style="margin-top:12px">${en ? "Confirmations your transaction already has z:" : "你的交易已有确认数 z："}<b id="ap-z">6</b></label>
        <input class="demo-slider" id="ap-zz" type="range" min="0" max="12" step="1" value="6" />
      </div>
      <div class="demo-out demo-out-sm" id="ap-out"></div>
      <div class="demo-meta" id="ap-take" style="margin-top:6px"></div>
      <p class="demo-tip">${en ? "Approximate formula P ≈ (q/p)^z (when q &lt; 50%), p = 1 − q. Each extra confirmation drops the success rate exponentially; at q ≥ 50% the security assumption collapses." : "近似公式 P ≈ (q/p)^z（q &lt; 50% 时），p = 1 − q。确认数每 +1，成功率指数级下降；q ≥ 50% 时安全假设崩塌。"}</p>
    </div>`;

  const qq = root.querySelector("#ap-qq"), zz = root.querySelector("#ap-zz");
  const fmt = (p) => {
    if (p >= 0.01) return (p * 100).toFixed(2) + "%";
    if (p >= 1e-6) return (p * 100).toExponential(2) + "%";
    return "< 0.0001%";
  };
  function upd() {
    const q = parseInt(qq.value, 10) / 100, z = parseInt(zz.value, 10), p = 1 - q;
    root.querySelector("#ap-q").textContent = qq.value;
    root.querySelector("#ap-z").textContent = z;
    const out = root.querySelector("#ap-out"), take = root.querySelector("#ap-take");
    if (q >= 0.5) {
      out.innerHTML = en
        ? `<span class="pill bad">q ≥ 50%</span> The attacker has over half the hashrate → they catch up sooner or later, success ≈ 100%. The security assumption collapses.`
        : `<span class="pill bad">q ≥ 50%</span> 攻击者算力过半 → 迟早追上，成功率 ≈ 100%。安全假设崩塌。`;
      take.textContent = en ? "This is exactly why “majority hashrate” is Bitcoin's security red line." : "这正是为什么“过半算力”是比特币安全的红线。";
      return;
    }
    const prob = Math.pow(q / p, z);
    out.innerHTML = en
      ? "Attacker holds <b>" + qq.value + "%</b> of hashrate, your transaction has <b>" + z + "</b> confirmations → probability of being overtaken and double-spent ≈ <b>" + fmt(prob) + "</b>."
      : "攻击者占 <b>" + qq.value + "%</b> 算力、你的交易有 <b>" + z + "</b> 个确认 → 被反超双花的概率 ≈ <b>" + fmt(prob) + "</b>。";
    take.textContent = en
      ? (prob < 1e-4 ? "Practically impossible. A few more confirmations raise security exponentially."
        : (prob < 0.05 ? "Already low, but for large amounts wait for a few more confirmations." : "On the high side — too few confirmations or too strong an attacker; wait for more confirmations."))
      : (prob < 1e-4 ? "几乎不可能。多几个确认，安全性指数级提升。"
        : (prob < 0.05 ? "已经很低，但大额可再多等几个确认。" : "偏高——确认太少或攻击者算力太强，应等更多确认。"));
  }
  qq.addEventListener("input", upd);
  zz.addEventListener("input", upd);
  upd();
}
