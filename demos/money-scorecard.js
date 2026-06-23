// 交互演示：货币计分卡
// 把黄金 / 法币 / 比特币按几条"好钱"的硬性质摆在一起打分，点列名看该种钱的强弱小结。
// 评分 1~3（圆点数）是教学性简化，目的是建立直觉，不是精确度量。

export default function mount(root, lang) {
  const en = lang === "en";
  const props = [
    { k: en ? "Portability" : "便携性", g: 1, f: 3, b: 3 },
    { k: en ? "Durability" : "耐久性", g: 3, f: 2, b: 3 },
    { k: en ? "Divisibility" : "可分割", g: 1, f: 3, b: 3 },
    { k: en ? "Scarcity" : "稀缺性", g: 3, f: 1, b: 3 },
    { k: en ? "Verifiability" : "易验真", g: 2, f: 2, b: 3 },
    { k: en ? "Censorship resistance" : "抗审查没收", g: 2, f: 1, b: 3 },
  ];
  const cols = [
    { id: "g", name: en ? "Gold" : "黄金", verdict: en ? "A hard money for thousands of years: extremely scarce and durable; but heavy, hard to use for small payments, and difficult to move across borders." : "几千年的硬通货：极稀缺、超耐久；但笨重、难付小额、跨国转移困难。" },
    { id: "f", name: en ? "Fiat" : "法币", verdict: en ? "Portable, divisible, and easy to verify; but it can be printed without limit, and it relies on third parties that can freeze your account." : "便携、可分、验真容易；但可被无限增发，且依赖能冻结你账户的第三方。" },
    { id: "b", name: en ? "Bitcoin" : "比特币", verdict: en ? "A digital hard money: a fixed 21-million cap, global transfer in seconds, verifiable by anyone, and permissionless." : "数字化的硬通货：2100 万硬上限、全球秒级转移、人人可自行验真、无需许可。" },
  ];

  let active = "b";
  const dots = (n) => [1, 2, 3].map((i) => `<span class="sc-dot ${i <= n ? "on" : ""}"></span>`).join("");

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🪙 ${en ? "Money Scorecard · Click a name above to see its strengths and weaknesses" : "货币计分卡 · 点上方的名字看它的强弱"}</div>
      <div id="sc-wrap"></div>
    </div>`;
  const wrap = root.querySelector("#sc-wrap");

  function paint() {
    wrap.innerHTML = `
      <table class="sc">
        <thead><tr><th></th>${cols.map((c) =>
          `<th><button class="sc-col ${c.id === active ? "active" : ""}" data-c="${c.id}">${c.name}</button></th>`).join("")}</tr></thead>
        <tbody>${props.map((p) =>
          `<tr><td>${p.k}</td>${cols.map((c) => `<td>${dots(p[c.id])}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
      <div class="sc-verdict">${cols.find((c) => c.id === active).verdict}</div>`;
    wrap.querySelectorAll(".sc-col").forEach((b) =>
      b.addEventListener("click", () => { active = b.dataset.c; paint(); }));
  }
  paint();
}
