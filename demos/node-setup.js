// 交互演示：全节点配置助手
// 切换"剪枝模式"，看存储/同步/能力的差别，理解跑全节点的取舍与价值。

export default function mount(root, lang) {
  const en = lang === "en";
  let pruned = false;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🖧 ${en ? "Run a full node · the setup and what you get" : "跑一个全节点 · 配置与你能得到什么"}</div>
      <label class="demo-switch"><input type="checkbox" id="ns-prune" /> ${en ? "Pruned mode (discard old blocks after verifying, saves disk)" : "剪枝模式（验证后丢弃旧区块，省硬盘）"}</label>
      <div class="detail" id="ns-detail"></div>
      <p class="demo-tip">${en ? "In either mode, the node <b>personally verifies every single block</b>. Pruning just means it no longer keeps history long-term. Running a node doesn't mine and doesn't directly earn money — what you get is sovereignty and privacy: the ledger state is decided by your own software." : "无论哪种模式，节点都会<b>亲自验证每一个区块</b>。剪枝只是不再长期保存历史。跑节点不挖矿、不直接赚钱，换来的是主权与隐私：账本状态由你自己的软件说了算。"}</p>
    </div>`;

  root.querySelector("#ns-prune").addEventListener("change", (e) => { pruned = e.target.checked; paint(); });
  function paint() {
    root.querySelector("#ns-detail").innerHTML =
      `<div class="dk">💾 ${en ? "Storage used" : "存储占用"}</div><div>${pruned ? (en ? "~5–10 GB (keeps only recent blocks)" : "约 5–10 GB（只留最近区块）") : (en ? "~600+ GB (full chain, always growing)" : "约 600+ GB（完整链，持续增长）")}</div>
       <div class="dk" style="margin-top:8px">✅ ${en ? "Verification strength" : "验证强度"}</div><div>${en ? "Full: personally checks every consensus rule (same in both modes)" : "完整：亲自校验每一条共识规则（两种模式相同）"}</div>
       <div class="dk" style="margin-top:8px">⏳ ${en ? "Initial sync (IBD)" : "初次同步（IBD）"}</div><div>${en ? "Verifies block by block from genesis, roughly hours to a day or two (depends on hardware/bandwidth)" : "从创世逐块验证，约数小时到一两天（取决于硬件/带宽）"}</div>
       <div class="dk" style="margin-top:8px">📡 ${en ? "Can it serve historical blocks to others" : "能否向他人提供历史区块"}</div><div>${pruned ? (en ? "No (old blocks already discarded)" : "否（已丢弃旧区块）") : (en ? "Yes (keeps full history)" : "可以（保留完整历史）")}</div>
       <div class="dk" style="margin-top:8px">🏅 ${en ? "What you get" : "你得到的"}</div><div>${en ? "No longer trusting any third party about “what happened on-chain,” better privacy, and a voice in consensus (your node enforces the rules you choose)." : "不再信任任何第三方的“链上发生了什么”，更好的隐私，以及在共识里的一份话语权（你的节点执行你选择的规则）。"}</div>`;
  }
  paint();
}
