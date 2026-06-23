// 交互演示：减半与 2100 万
// 拖动滑块走过一个个减半周期，看出块奖励怎么腰斩、累计发行怎么逼近 2100 万。

export default function mount(root, lang) {
  const en = lang === "en";
  const CAP = 21000000;
  const PER = 210000; // 每个减半周期的区块数

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🪙 ${en ? "Halving & 21 Million · An issuance plan written into the code" : "减半与 2100 万 · 写进代码的发行计划"}</div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Halving era" : "第"} <b id="hv-e">4</b> ${en ? "· approx." : "个减半周期 · 约"} <b id="hv-y"></b> ${en ? "" : "年"}</label>
        <input class="demo-slider" id="hv-era" type="range" min="0" max="10" step="1" value="4" />
      </div>
      <div class="demo-block">
        <div class="demo-meta" id="hv-reward"></div>
        <div class="bar2"><span class="lab">${en ? "Cumulative issuance" : "累计发行"}</span><span class="track"><span class="fill" id="hv-fill" style="background:var(--orange)"></span></span><span class="val" id="hv-pct"></span></div>
        <div class="bar2"><span class="lab">${en ? "Cap 21M" : "上限 2100万"}</span><span class="track"><span class="fill" style="background:var(--green);width:100%"></span></span><span class="val">100%</span></div>
        <div class="demo-meta" id="hv-note"></div>
      </div>
      <p class="demo-tip">${en ? "Each era halves the new supply → cumulative issuance reaches 50%, 75%, 87.5%… forever approaching 21 million but never exceeding it. Issuance completes around the year 2140, after which miners rely on fees alone." : "每个周期新增供给砍半 → 累计发行 50%、75%、87.5%… 永远逼近 2100 万、却永不突破。约 2140 年发行完毕，之后矿工只靠手续费。"}</p>
    </div>`;

  const era = root.querySelector("#hv-era");
  function upd() {
    const E = parseInt(era.value, 10);
    const reward = 50 / Math.pow(2, E);
    let cum = 0;
    for (let k = 0; k <= E; k++) cum += PER * (50 / Math.pow(2, k));
    const pct = (cum / CAP) * 100;
    root.querySelector("#hv-e").textContent = E;
    root.querySelector("#hv-y").textContent = (2009 + 4 * E) + "–" + (2013 + 4 * E);
    root.querySelector("#hv-reward").innerHTML = en
      ? "Block reward this era: <b>" + parseFloat(reward.toFixed(8)) + " BTC</b> / block"
      : "本周期出块奖励：<b>" + parseFloat(reward.toFixed(8)) + " BTC</b> / 区块";
    root.querySelector("#hv-fill").style.width = pct + "%";
    root.querySelector("#hv-pct").textContent = pct.toFixed(2) + "%";
    root.querySelector("#hv-note").innerHTML = en
      ? "By the end of this era, cumulative issuance is about <b>" + Math.round(cum).toLocaleString() + "</b> coins (" + pct.toFixed(2) + "% of 21 million)."
      : "到该周期结束，累计发行约 <b>" + Math.round(cum).toLocaleString() + "</b> 枚（占 2100 万的 " + pct.toFixed(2) + "%）。";
  }
  era.addEventListener("input", upd);
  upd();
}
