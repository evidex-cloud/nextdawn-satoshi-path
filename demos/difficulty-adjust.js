// 交互演示：难度调整模拟
// 拖动"全网算力相对变化"，看协议如何按"期望14天 / 实际用时"重算难度，把出块时间拽回 10 分钟。

export default function mount(root, lang) {
  const en = lang === "en";
  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${en ? "🎯 Difficulty adjustment simulation · the auto-recalibration every two weeks" : "🎯 难度调整模拟 · 两周一次的自动校准"}</div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Relative change in network hashrate over the last period:" : "上个周期全网算力相对变化："}<b id="da-k">2.00</b> ×</label>
        <input class="demo-slider" id="da-hash" type="range" min="0.25" max="4" step="0.05" value="2" />
      </div>
      <div class="demo-block">
        <div class="demo-meta" id="da-actual"></div>
        <div class="demo-meta" id="da-new" style="margin-top:6px"></div>
        <div class="demo-meta" id="da-result" style="margin-top:6px"></div>
      </div>
      <p class="demo-tip">${en ? "Expected: 2016 blocks take 14 days (10 minutes per block). Actually faster → raise difficulty; slower → lower it. Each adjustment is capped at 4×." : "期望：2016 个区块用 14 天（每块 10 分钟）。实际更快 → 调高难度；更慢 → 调低。单次调整上限 4 倍。"}</p>
    </div>`;

  const hash = root.querySelector("#da-hash");
  function upd() {
    const k = parseFloat(hash.value);
    root.querySelector("#da-k").textContent = k.toFixed(2);
    const actualDays = 14 / k;
    let factor = Math.max(0.25, Math.min(4, 14 / actualDays));
    const pct = (factor - 1) * 100;
    root.querySelector("#da-actual").innerHTML = en
      ? "Hashrate became <b>" + k.toFixed(2) + "×</b> → these 2016 blocks actually took only about <b>" + actualDays.toFixed(1) + "</b> days (target 14 days)."
      : "算力变成 <b>" + k.toFixed(2) + "×</b> → 这 2016 个区块实际只用了约 <b>" + actualDays.toFixed(1) + "</b> 天（目标 14 天）。";
    root.querySelector("#da-new").innerHTML = en
      ? "New difficulty = old difficulty × (14 / " + actualDays.toFixed(1) + ") = <b>" + factor.toFixed(2) + "×</b> (" + (pct >= 0 ? "+" : "") + pct.toFixed(0) + "%)."
      : "新难度 = 旧难度 × (14 / " + actualDays.toFixed(1) + ") = <b>" + factor.toFixed(2) + "×</b>（" + (pct >= 0 ? "+" : "") + pct.toFixed(0) + "%）。";
    root.querySelector("#da-result").innerHTML = en ? "After the adjustment, the average block time is pulled back to <b>≈ 10 minutes</b>." : "调整后，平均出块时间又被拽回 <b>≈ 10 分钟</b>。";
  }
  hash.addEventListener("input", upd);
  upd();
}
