// 交互演示：八卦式传播（示意）
// 7x7 节点网格，从中心广播，每一跳点亮相邻节点，看消息几跳传遍全网——没有中心服务器。

export default function mount(root, lang) {
  const en = lang === "en";
  const N = 7, total = N * N, src = 24; // 中心

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">📡 ${en ? "Gossip propagation · one tells ten, ten tell a hundred (illustrative)" : "八卦式传播 · 一传十、十传百（示意）"}</div>
      <div class="gossip-grid" id="gg"></div>
      <div class="demo-btns"><button class="demo-btn" id="gg-go">▶ ${en ? "Broadcast a transaction from the center node" : "从中心节点广播一笔交易"}</button></div>
      <div class="demo-meta" id="gg-msg">${en ? "Click broadcast: the message starts at one node, and each hop lights up its neighbors, reaching the whole network within a few hops." : "点广播：消息从一个节点出发，每一跳点亮相邻节点，几跳之内传遍全网。"}</div>
    </div>`;

  const grid = root.querySelector("#gg");
  grid.innerHTML = Array.from({ length: total }, (_, i) => `<div class="gnode ${i === src ? "src" : ""}"></div>`).join("");
  const cells = [...grid.querySelectorAll(".gnode")];
  const dist = (i) => {
    const r = Math.floor(i / N), c = i % N, sr = Math.floor(src / N), sc = src % N;
    return Math.abs(r - sr) + Math.abs(c - sc);
  };
  let running = false;

  root.querySelector("#gg-go").addEventListener("click", async () => {
    if (running) return;
    running = true;
    cells.forEach((c, i) => { c.className = "gnode" + (i === src ? " src" : ""); });
    const msg = root.querySelector("#gg-msg");
    const maxd = Math.max(...cells.map((_, i) => dist(i)));
    for (let d = 1; d <= maxd; d++) {
      await new Promise((r) => setTimeout(r, 420));
      cells.forEach((c, i) => { if (dist(i) === d) c.classList.add("on"); });
      const reached = cells.filter((_, i) => dist(i) <= d).length;
      msg.textContent = en ? "Hop " + d + ": reached " + reached + " / " + total + " nodes." : "第 " + d + " 跳：已传到 " + reached + " / " + total + " 个节点。";
    }
    msg.textContent = en ? "✓ Within a few hops, all " + total + " nodes on the network received it—no central server, just nodes relaying to each other." : "✓ 几跳之内，全网 " + total + " 个节点都收到了——没有中心服务器，全靠节点互相转发。";
    running = false;
  });
}
