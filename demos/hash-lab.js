// 交互演示：哈希实验台
// 用浏览器原生 Web Crypto（crypto.subtle）算真实 SHA-256，无需任何外部库。
// 注意：crypto.subtle 仅在"安全上下文"可用 —— http://localhost 或 https 都算安全，file:// 不算。
// 所以请用 launch.bat（本地服务器）打开，而不是直接双击 index.html。
//
// 约定：每个 demo 默认导出一个 mount(root) 函数；app.js 会把它挂到课程里的演示容器上。

async function sha256Hex(text, rounds = 1) {
  let buf = new TextEncoder().encode(text);
  for (let i = 0; i < rounds; i++) {
    buf = await crypto.subtle.digest("SHA-256", buf);
  }
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex) {
  const out = [];
  for (let i = 0; i < hex.length; i += 2) out.push(parseInt(hex.slice(i, i + 2), 16));
  return out;
}

// 两个等长哈希之间有多少位不同（汉明距离），用来量化雪崩效应
function bitDiff(h1, h2) {
  const a = hexToBytes(h1), b = hexToBytes(h2);
  let d = 0;
  for (let i = 0; i < a.length; i++) {
    let x = a[i] ^ b[i];
    while (x) { d += x & 1; x >>= 1; }
  }
  return d;
}

export default function mount(root, lang) {
  const en = lang === "en";
  if (!(window.crypto && window.crypto.subtle)) {
    root.innerHTML =
      `<div class="demo-warn">⚠️ ${en ? "Your browser does not provide <code>crypto.subtle</code>. Please open this tool with <b>launch.bat</b> (a local server) instead of double-clicking index.html directly." : "浏览器没有提供 <code>crypto.subtle</code>。请用 <b>launch.bat</b>（本地服务器）打开本工具，而不是直接双击 index.html。"}</div>`;
    return;
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🔬 ${en ? "Hash Lab · Real SHA-256" : "哈希实验台 · 真实 SHA-256"}</div>

      <!-- 1) 实时哈希 -->
      <div class="demo-block">
        <label class="demo-label">${en ? "Type any text and watch its fingerprint:" : "输入任意文字，看它的指纹："}</label>
        <textarea id="hl-in" class="demo-ta" rows="2" spellcheck="false">Hello, Bitcoin</textarea>
        <div class="demo-row">
          <label class="demo-check"><input type="checkbox" id="hl-double" /> ${en ? "Double SHA-256 (used by Bitcoin)" : "双重 SHA-256（比特币常用）"}</label>
          <span id="hl-len" class="demo-meta"></span>
        </div>
        <div class="demo-out" id="hl-out">…</div>
        <p class="demo-tip">${en ? "Try changing just one character — the whole fingerprint turns upside down. This is the <b>avalanche effect</b>." : "试试只改一个字符 —— 整段指纹会天翻地覆。这就是<b>雪崩效应</b>。"}</p>
      </div>

      <!-- 2) 雪崩对比 -->
      <div class="demo-block">
        <label class="demo-label">${en ? "Side by side: with a one-character difference, how different are the two fingerprints?" : "并排对比：仅一字之差，两个指纹差多少？"}</label>
        <div class="demo-grid">
          <input id="hl-a" class="demo-inp" spellcheck="false" value="Bitcoin" />
          <input id="hl-b" class="demo-inp" spellcheck="false" value="bitcoin" />
        </div>
        <div class="demo-out demo-out-sm" id="hl-ha">…</div>
        <div class="demo-out demo-out-sm" id="hl-hb">…</div>
        <div class="demo-bar"><span id="hl-fill"></span></div>
        <div class="demo-meta" id="hl-diff"></div>
      </div>
    </div>
  `;

  const $ = (id) => root.querySelector(id);
  const inEl = $("#hl-in"), dbl = $("#hl-double"), outEl = $("#hl-out"), lenEl = $("#hl-len");
  const aEl = $("#hl-a"), bEl = $("#hl-b"), haEl = $("#hl-ha"), hbEl = $("#hl-hb");
  const fill = $("#hl-fill"), diffEl = $("#hl-diff");

  async function refreshMain() {
    const rounds = dbl.checked ? 2 : 1;
    outEl.textContent = await sha256Hex(inEl.value, rounds);
    lenEl.textContent = en ? `${inEl.value.length} chars in → 64 chars out` : `${inEl.value.length} 字符输入 → 64 字符输出`;
  }

  async function refreshAvalanche() {
    const ha = await sha256Hex(aEl.value);
    const hb = await sha256Hex(bEl.value);
    haEl.textContent = ha;
    hbEl.textContent = hb;
    const d = bitDiff(ha, hb);
    const pct = Math.round((d / 256) * 100);
    fill.style.width = pct + "%";
    diffEl.innerHTML = aEl.value === bEl.value
      ? (en ? "The two inputs are identical → identical fingerprints (deterministic)." : "两个输入完全相同 → 指纹一模一样（确定性）。")
      : (en ? `<b>${d}</b> of the 256 bits differ (≈ <b>${pct}%</b>). A one-character change flips about half the bits.` : `256 位中有 <b>${d}</b> 位不同（≈ <b>${pct}%</b>）。一字之差，约一半的位翻转。`);
  }

  inEl.addEventListener("input", refreshMain);
  dbl.addEventListener("change", refreshMain);
  aEl.addEventListener("input", refreshAvalanche);
  bEl.addEventListener("input", refreshAvalanche);

  refreshMain();
  refreshAvalanche();
}
