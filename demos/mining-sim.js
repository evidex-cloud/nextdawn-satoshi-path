// 交互演示：迷你挖矿机
// 选难度（哈希要以几个 0 开头），让浏览器真的不停换 nonce、算真实 SHA-256，直到撞中。
// 体会"找答案要烧海量尝试，验证却只需 1 次哈希"的不对称。

async function H(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export default function mount(root, lang) {
  const en = lang === "en";
  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">⛏️ ${en ? "Mini Miner · Real SHA-256 nonce hunt" : "迷你挖矿机 · 真实 SHA-256 找 nonce"}</div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Difficulty: the hash must start with" : "难度：哈希要以"} <b id="mn-d">3</b> ${en ? "zeros" : "个 0 开头"}</label>
        <input class="demo-slider" id="mn-diff" type="range" min="1" max="4" step="1" value="3" />
      </div>
      <div class="demo-block">
        <div class="demo-meta">${en ? "Block content (fixed): Block #789 · Alice → Bob 0.5 BTC" : "区块内容（固定）：区块#789 · Alice → Bob 0.5 BTC"}</div>
        <div class="demo-btns"><button class="demo-btn" id="mn-go">${en ? "Start mining" : "开始挖矿"}</button></div>
        <div class="demo-out demo-out-sm" id="mn-out">${en ? "Click “Start mining” to let the browser keep trying nonces until it hits a hash that meets the difficulty." : "点“开始挖矿”，让浏览器不停换 nonce 试，直到撞出符合难度的哈希。"}</div>
        <div class="demo-meta" id="mn-stat"></div>
        <p class="demo-tip">${en ? "Each extra zero multiplies the average attempts needed by about ×16; but verifying your answer takes someone else just 1 hash, done in an instant." : "难度每多一个 0，平均要试的次数约 ×16；但别人验证你的答案，只需算 1 次哈希、一瞬间完成。"}</p>
      </div>
    </div>`;

  const diff = root.querySelector("#mn-diff");
  let running = false;
  diff.addEventListener("input", () => { root.querySelector("#mn-d").textContent = diff.value; });

  root.querySelector("#mn-go").addEventListener("click", async () => {
    if (running) return;
    running = true;
    const d = parseInt(diff.value, 10);
    const target = "0".repeat(d);
    const base = "区块#789|Alice->Bob|0.5BTC|nonce=";
    const out = root.querySelector("#mn-out");
    const stat = root.querySelector("#mn-stat");
    const btn = root.querySelector("#mn-go");
    btn.disabled = true; btn.textContent = en ? "Mining…" : "挖矿中…";
    const t0 = Date.now();
    let nonce = 0, h = "";
    const CAP = 3000000;
    while (nonce < CAP) {
      h = await H(base + nonce);
      if (h.startsWith(target)) break;
      nonce++;
      if (nonce % 500 === 0) { stat.textContent = (en ? "Tried " : "已尝试 ") + nonce.toLocaleString() + (en ? " times…" : " 次…"); await new Promise((r) => setTimeout(r, 0)); }
    }
    const ms = Date.now() - t0;
    out.innerHTML = h.startsWith(target)
      ? (en ? "✓ Found it! nonce = <b>" + nonce + "</b><br>hash " + h : "✓ 挖到了！nonce = <b>" + nonce + "</b><br>哈希 " + h)
      : (en ? "Hit the cap without finding one—try lowering the difficulty." : "达到上限仍未找到，试试降低难度。");
    stat.textContent = (en ? "Tried " + (nonce + 1).toLocaleString() + " times · took " + ms + " ms · verifying needs just 1 hash" : "共尝试 " + (nonce + 1).toLocaleString() + " 次 · 用时 " + ms + " ms · 验证只需 1 次哈希");
    btn.disabled = false; btn.textContent = en ? "Mine again" : "重新挖矿";
    running = false;
  });
}
