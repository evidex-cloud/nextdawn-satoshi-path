// 交互演示：安全预算（subsidy + fees → 攻击门票）
// 拖动减半周期看补贴腰斩，再调手续费和币价，看“矿工每区块总收入（美元）”这道护城河如何此消彼长。
// 安全预算（美元）= (出块补贴 + 区块手续费) × 币价。补贴注定归零，迟早靠手续费撑住。

export default function mount(root, lang) {
  const en = lang === "en";

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🛡️ ${en ? "Security Budget · subsidy + fees = the price to attack" : "安全预算 · 补贴 + 手续费 = 攻击的门票"}</div>

      <div class="demo-block">
        <label class="demo-label">${en ? "Halving era" : "第"} <b id="sb-e">4</b> ${en ? "· approx." : "个减半周期 · 约"} <b id="sb-y"></b> ${en ? "" : "年"}</label>
        <input class="demo-slider" id="sb-era" type="range" min="0" max="12" step="1" value="4" />

        <label class="demo-label" style="margin-top:14px">${en ? "Avg fees per block:" : "每区块平均手续费："}<b id="sb-f">0.30</b> BTC</label>
        <input class="demo-slider" id="sb-fees" type="range" min="0" max="6" step="0.05" value="0.30" />

        <label class="demo-label" style="margin-top:14px">${en ? "BTC price:" : "比特币价格："}$<b id="sb-p">100,000</b></label>
        <input class="demo-slider" id="sb-price" type="range" min="10000" max="2000000" step="10000" value="100000" />
      </div>

      <div class="demo-block">
        <div class="bar2"><span class="lab">${en ? "Subsidy" : "出块补贴"}</span><span class="track"><span class="fill" id="sb-fill-sub" style="background:var(--orange)"></span></span><span class="val" id="sb-val-sub"></span></div>
        <div class="bar2"><span class="lab">${en ? "Fees" : "手续费"}</span><span class="track"><span class="fill" id="sb-fill-fee" style="background:var(--green)"></span></span><span class="val" id="sb-val-fee"></span></div>
        <div class="demo-meta" id="sb-budget"></div>
        <div class="demo-meta" id="sb-cross" style="margin-top:6px"></div>
      </div>

      <p class="demo-tip">${en ? "Security budget (USD) = (subsidy + fees) × price = the miner's total revenue per block, and roughly the cost to out-hash the network. The subsidy halves every era toward zero by ~2140 — so fees must eventually dominate. Notice: a rising <b>price</b> can offset a falling subsidy, since the budget is measured in fiat, not BTC." : "安全预算（美元）= (补贴 + 手续费) × 币价 = 矿工每区块总收入，也大致是“追平全网算力”的成本。补贴每周期腰斩、约 2140 年归零——所以手续费迟早要成为主力。注意：币价上涨能对冲补贴下降，因为预算按法币而非 BTC 计。"}</p>
    </div>`;

  const era = root.querySelector("#sb-era");
  const fees = root.querySelector("#sb-fees");
  const price = root.querySelector("#sb-price");

  const fmtUSD = (x) => {
    if (x >= 1e9) return "$" + (x / 1e9).toFixed(2) + (en ? "B" : " 十亿");
    if (x >= 1e6) return "$" + (x / 1e6).toFixed(2) + (en ? "M" : " 百万");
    if (x >= 1e3) return "$" + (x / 1e3).toFixed(1) + (en ? "k" : " 千");
    return "$" + Math.round(x);
  };

  function upd() {
    const E = parseInt(era.value, 10);
    const F = parseFloat(fees.value);
    const P = parseFloat(price.value);

    const subsidy = 50 / Math.pow(2, E);
    const total = subsidy + F;
    const budgetUSD = total * P;
    const subUSD = subsidy * P;
    const feeUSD = F * P;

    // 条形占比：补贴 vs 手续费，谁是主力
    const subPct = total > 0 ? (subsidy / total) * 100 : 0;
    const feePct = total > 0 ? (F / total) * 100 : 0;

    root.querySelector("#sb-e").textContent = E;
    root.querySelector("#sb-y").textContent = (2009 + 4 * E) + "–" + (2013 + 4 * E);
    root.querySelector("#sb-f").textContent = F.toFixed(2);
    root.querySelector("#sb-p").textContent = Math.round(P).toLocaleString();

    root.querySelector("#sb-fill-sub").style.width = subPct + "%";
    root.querySelector("#sb-fill-fee").style.width = feePct + "%";
    root.querySelector("#sb-val-sub").textContent = parseFloat(subsidy.toFixed(8)) + " BTC";
    root.querySelector("#sb-val-fee").textContent = F.toFixed(2) + " BTC";

    root.querySelector("#sb-budget").innerHTML = en
      ? `Per-block revenue: <b>${parseFloat(total.toFixed(8))} BTC</b> → security budget <b>${fmtUSD(budgetUSD)}</b> / block (≈ <b>${fmtUSD(budgetUSD * 144 * 365)}</b> / year of attack cost). Subsidy ${fmtUSD(subUSD)} · fees ${fmtUSD(feeUSD)}.`
      : `每区块收入：<b>${parseFloat(total.toFixed(8))} BTC</b> → 安全预算 <b>${fmtUSD(budgetUSD)}</b> / 区块（≈ 全年攻击成本 <b>${fmtUSD(budgetUSD * 144 * 365)}</b>）。补贴 ${fmtUSD(subUSD)} · 手续费 ${fmtUSD(feeUSD)}。`;

    // 交叉点提示：手续费是否已成为主力
    let cross;
    if (subsidy < 1e-6) {
      cross = en
        ? `Subsidy ≈ 0 — the budget rests <b>entirely on fees</b>. This is the post-2140 world: fees must be both big and steady, or the moat shrinks.`
        : `补贴 ≈ 0 —— 预算<b>全靠手续费</b>。这就是 2140 年后的世界：手续费必须又大又稳，否则护城河缩水。`;
    } else if (F >= subsidy) {
      cross = en
        ? `Fees now <b>exceed</b> the subsidy — like a congestion spike (e.g. the Ordinals waves). A taste of the future fee-driven security model.`
        : `手续费已<b>超过</b>补贴 —— 就像拥堵尖峰（如 Ordinals 浪潮）。这是未来“手续费驱动安全”模型的预演。`;
    } else {
      const ratio = (subsidy / F);
      cross = en
        ? `Subsidy still dominates (~${ratio.toFixed(1)}× the fees), today's normal. As eras advance it shrinks — but a higher price can keep the USD budget from falling.`
        : `补贴仍是主力（约为手续费的 ${ratio.toFixed(1)} 倍），这是当下常态。随周期推进它会萎缩——但更高的币价能让美元计的预算不掉下来。`;
    }
    root.querySelector("#sb-cross").innerHTML = cross;
  }

  era.addEventListener("input", upd);
  fees.addEventListener("input", upd);
  price.addEventListener("input", upd);
  upd();
}
