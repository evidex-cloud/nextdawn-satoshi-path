// 交互演示：下一个区块装什么
// 区块空间有限，矿工按费率从高到低塞交易，直到装满。看哪些入块、哪些等下一轮。

export default function mount(root, lang) {
  const en = lang === "en";
  const BUDGET = 1000; // vB（示意）
  const mempool = [
    { id: "tx-a", vb: 200, fr: 60 }, { id: "tx-b", vb: 150, fr: 5 },
    { id: "tx-c", vb: 250, fr: 40 }, { id: "tx-d", vb: 180, fr: 80 },
    { id: "tx-e", vb: 300, fr: 12 }, { id: "tx-f", vb: 120, fr: 25 },
    { id: "tx-g", vb: 220, fr: 3 }, { id: "tx-h", vb: 160, fr: 50 },
  ];

  const sorted = [...mempool].sort((a, b) => b.fr - a.fr);
  let used = 0, fees = 0, minIn = Infinity;
  const inSet = new Set();
  for (const t of sorted) {
    if (used + t.vb <= BUDGET) { inSet.add(t.id); used += t.vb; fees += t.vb * t.fr; minIn = Math.min(minIn, t.fr); }
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🧩 ${en ? "What goes in the next block · fee-rate auction" : "下一个区块装什么 · 费率竞价"}</div>
      <div class="demo-meta">${en ? `Block space is limited (here illustrated as ${BUDGET} vB). The miner packs transactions from highest fee rate to lowest until it's full.` : `区块空间有限（这里示意 ${BUDGET} vB）。矿工按费率从高到低塞，直到装满。`}</div>
      <div id="bb-list" style="margin-top:10px">${sorted.map((t) =>
        `<div class="mp-tx ${inSet.has(t.id) ? "in" : ""}"><span>${t.id} · ${t.vb} vB</span><span class="fr">${t.fr} sat/vB ${inSet.has(t.id) ? (en ? "✓ included" : "✓ 入块") : (en ? "· waits for next round" : "· 等下一轮")}</span></div>`).join("")}</div>
      <div class="demo-meta" id="bb-sum" style="margin-top:8px">${en ? `This block used <b>${used}/${BUDGET}</b> vB and collected <b>${fees.toLocaleString()}</b> sats in fees. Minimum entry fee rate ≈ <b>${minIn}</b> sat/vB—anything below that has to wait for the next block.` : `本区块用了 <b>${used}/${BUDGET}</b> vB，收取手续费 <b>${fees.toLocaleString()}</b> 聪。最低入场费率 ≈ <b>${minIn}</b> sat/vB——低于它的只能等下一个区块。`}</div>
    </div>`;
}
