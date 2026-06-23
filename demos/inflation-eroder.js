// 交互演示：通胀侵蚀器
// 拖动"年通胀率"和"年数"，直观感受复利对购买力的侵蚀；并和"供给有硬上限的钱"对比。
// 购买力 = 100 / (1 + r)^n —— 纯数学，仅为建立直觉。

export default function mount(root, lang) {
  const en = lang === "en";
  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">📉 ${en ? "Inflation Eroder · Your purchasing power over time" : "通胀侵蚀器 · 你的购买力随时间"}</div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Annual inflation rate:" : "年通胀率："}<b id="ie-r">7</b>%</label>
        <input class="demo-slider" id="ie-rate" type="range" min="1" max="15" step="0.5" value="7" />
        <label class="demo-label" style="margin-top:14px">${en ? "After <b id=\"ie-y\">20</b> years" : "经过 <b id=\"ie-y\">20</b> 年"}</label>
        <input class="demo-slider" id="ie-years" type="range" min="0" max="50" step="1" value="20" />
      </div>
      <div class="demo-block">
        <div class="bar2"><span class="lab">${en ? "Fiat ¥100" : "法币 ¥100"}</span><span class="track"><span class="fill" id="ie-fill" style="background:var(--orange)"></span></span><span class="val" id="ie-val"></span></div>
        <div class="bar2"><span class="lab">${en ? "Fixed cap" : "固定上限"}</span><span class="track"><span class="fill" style="background:var(--green);width:100%"></span></span><span class="val">¥100</span></div>
        <div class="demo-meta" id="ie-note"></div>
      </div>
    </div>`;

  const rate = root.querySelector("#ie-rate");
  const years = root.querySelector("#ie-years");

  function upd() {
    const r = parseFloat(rate.value);
    const n = parseInt(years.value, 10);
    root.querySelector("#ie-r").textContent = r;
    root.querySelector("#ie-y").textContent = n;
    const power = 100 / Math.pow(1 + r / 100, n);
    root.querySelector("#ie-fill").style.width = power + "%";
    root.querySelector("#ie-val").textContent = "¥" + power.toFixed(1);
    root.querySelector("#ie-note").innerHTML = n === 0
      ? (en ? "Drag the sliders above to let time pass and watch compounding slowly dilute your purchasing power." : "拖动上面的滑块，让时间流逝，看购买力被复利一点点稀释。")
      : (en ? `At <b>${r}%</b> inflation per year, today's <b>¥100</b> keeps only about <b>¥${power.toFixed(1)}</b> of purchasing power after <b>${n}</b> years (shrinking to about <b>1/${(100 / power).toFixed(1)}</b>). The green bar is money with a hard supply cap — it can't be diluted by new issuance.` : `按每年 <b>${r}%</b> 通胀，今天的 <b>¥100</b> 在 <b>${n}</b> 年后只剩约 <b>¥${power.toFixed(1)}</b> 的购买力（缩水到约 <b>1/${(100 / power).toFixed(1)}</b>）。绿色那条是供给有硬上限的钱——它不会被增发稀释。`);
  }

  rate.addEventListener("input", upd);
  years.addEventListener("input", upd);
  upd();
}
