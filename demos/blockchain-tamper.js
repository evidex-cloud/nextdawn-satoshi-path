// 交互演示：区块链篡改实验
// 一条 4 个区块的小链，每块存着"上一区块指纹"。改任意一块的内容 → 它指纹变 →
// 后面区块对不上 → 整条链从那里开始变红。用真实 SHA-256。

async function H(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export default function mount(root, lang) {
  const en = lang === "en";
  const N = 4;
  const GEN = "0".repeat(64);
  const data = en
    ? ["Genesis block: the ledger opens", "Alice → Bob: 5 BTC", "Bob → Carol: 2 BTC", "Carol → Dave: 1 BTC"]
    : ["创世区块：账本开张", "Alice → Bob：5 BTC", "Bob → Carol：2 BTC", "Carol → Dave：1 BTC"];
  const prev = new Array(N).fill(GEN);
  const hash = new Array(N).fill("");
  const dirty = new Array(N).fill(false);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">⛓️ ${en ? "Blockchain Tamper Lab · Change one block, watch the rest collapse" : "区块链篡改实验 · 改一块，看后面崩塌"}</div>
      <div class="bc-chain" id="bc"></div>
      <div class="demo-btns"><button class="demo-btn" id="bc-reseal">🔒 ${en ? "Re-seal the whole chain" : "重新封装整条链"}</button></div>
      <div class="demo-meta">${en ? "Change any block's content: its fingerprint changes instantly, the next block's stored “previous fingerprint” no longer matches, and the chain breaks from there (turns red). To fix this in reality, you'd have to redo all the proof-of-work for every block after it—so costly it's impossible." : '改任意区块的内容：它的指纹立刻变，后面区块存的"上一指纹"就对不上，链条从那里断裂（变红）。现实中要修复，得把后面每个区块的算力全部重做——成本高到不可能。'}</div>
    </div>`;

  const wrap = root.querySelector("#bc");
  const blocks = [];
  for (let i = 0; i < N; i++) {
    const el = document.createElement("div");
    el.className = "bc-block";
    el.innerHTML = `
      <div class="bc-h"><span>${en ? "Block" : "区块"} #${i}</span><span class="bc-tag"></span></div>
      <input class="bc-data" />
      <div class="bc-hash">${en ? "Prev fingerprint" : "上一指纹"} <span class="bc-prev"></span></div>
      <div class="bc-hash">${en ? "This block's fingerprint" : "本块指纹"} <b class="bc-self"></b></div>`;
    const inp = el.querySelector(".bc-data");
    inp.value = data[i];
    inp.addEventListener("input", () => { data[i] = inp.value; dirty[i] = true; recompute(); });
    wrap.appendChild(el);
    blocks.push({ el, tag: el.querySelector(".bc-tag"), prev: el.querySelector(".bc-prev"), self: el.querySelector(".bc-self") });
  }

  async function recompute() {
    for (let i = 0; i < N; i++) hash[i] = await H(i + "|" + data[i] + "|" + prev[i]);
    let brokenBefore = false;
    for (let i = 0; i < N; i++) {
      const linkBad = i > 0 && prev[i] !== hash[i - 1];
      const broken = dirty[i] || linkBad || brokenBefore;
      brokenBefore = broken;
      const b = blocks[i];
      b.el.classList.toggle("broken", broken);
      b.prev.textContent = i === 0 ? (en ? "—— Genesis ——" : "—— 创世 ——") : prev[i].slice(0, 16) + "…";
      b.self.textContent = hash[i].slice(0, 16) + "…";
      b.tag.className = "bc-tag " + (i === 0 ? "" : broken ? "bad" : "ok");
      b.tag.textContent = i === 0 ? (en ? "Genesis block" : "创世区块") : broken ? (en ? "✗ Link broken" : "✗ 链接断裂") : (en ? "✓ Link valid" : "✓ 链接有效");
    }
  }

  async function reseal() {
    for (let i = 0; i < N; i++) {
      prev[i] = i === 0 ? GEN : hash[i - 1];
      hash[i] = await H(i + "|" + data[i] + "|" + prev[i]);
      dirty[i] = false;
    }
    recompute();
  }

  root.querySelector("#bc-reseal").addEventListener("click", reseal);
  reseal();
}
