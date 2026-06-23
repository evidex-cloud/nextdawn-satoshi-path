// 交互演示：扩容的权衡
// 拖大区块，看链上吞吐上升的同时，每年存储增长也飙升 → 能跑全节点的人变少 → 中心化。

export default function mount(root, lang) {
  const en = lang === "en";
  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">⚖️ ${en ? "The Scaling Trade-off · Big Blocks Aren’t Free" : "扩容的权衡 · 大区块不是免费的"}</div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Block size" : "区块大小"}：<b id="sc-mb">1</b> MB</label>
        <input class="demo-slider" id="sc-size" type="range" min="1" max="32" step="1" value="1" />
      </div>
      <div class="demo-block">
        <div class="bar2"><span class="lab">${en ? "On-chain throughput" : "链上吞吐"}</span><span class="track"><span class="fill" id="sc-tps" style="background:var(--orange)"></span></span><span class="val" id="sc-tps-v"></span></div>
        <div class="bar2"><span class="lab">${en ? "Storage per year" : "每年存储"}</span><span class="track"><span class="fill" id="sc-stor" style="background:var(--red)"></span></span><span class="val" id="sc-stor-v"></span></div>
        <div class="demo-meta" id="sc-note"></div>
      </div>
      <p class="demo-tip">${en ? "The bigger the block, the more transactions the chain can process per second—but the more data must be stored each year, so fewer people can afford to run and personally verify the chain, pushing it toward centralization. Bitcoin chooses to keep blocks small and scale on layer two." : "区块越大，链上每秒能处理的交易越多——但每年要存的数据也越多，能负担、能亲自验证的人就越少，越走向中心化。比特币选择保持小区块、靠二层扩容。"}</p>
    </div>`;

  const size = root.querySelector("#sc-size");
  const maxTps = 32 * 2500 / 600, maxStor = 32 * 144 * 365 / 1024;
  function upd() {
    const mb = parseInt(size.value, 10);
    root.querySelector("#sc-mb").textContent = mb;
    const tps = mb * 2500 / 600;
    const storYr = mb * 144 * 365 / 1024;
    root.querySelector("#sc-tps").style.width = (tps / maxTps * 100) + "%";
    root.querySelector("#sc-tps-v").textContent = tps.toFixed(0) + " tx/s";
    root.querySelector("#sc-stor").style.width = (storYr / maxStor * 100) + "%";
    root.querySelector("#sc-stor-v").textContent = storYr.toFixed(0) + (en ? " GB/yr" : " GB/年");
    root.querySelector("#sc-note").innerHTML = mb <= 2
      ? (en ? "Small blocks: throughput is limited, but an ordinary hard drive and a home broadband line can run a full node → <b>anyone can verify</b>." : "小区块：吞吐有限，但一块普通硬盘、一根家用宽带就能跑全节点 → <b>人人可验证</b>。")
      : (mb <= 8
        ? (en ? "Blocks get bigger: throughput rises, but yearly storage pressure grows and fewer people can self-host a node." : "区块变大：吞吐上去了，但每年存储压力上升，能自托管节点的人开始变少。")
        : (en ? "Big blocks: throughput is high, but tens to hundreds of GB of growth per year means eventually only a few large institutions can afford to run a node → <b>toward centralization</b>." : "大区块：吞吐很高，但每年数十上百 GB 的增长，最终只有少数大机构跑得起节点 → <b>走向中心化</b>。"));
  }
  size.addEventListener("input", upd);
  upd();
}
