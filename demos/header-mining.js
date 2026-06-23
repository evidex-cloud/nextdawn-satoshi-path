// 交互演示：区块头挖矿（双重 SHA-256）
// 把区块头的 6 个字段摆出来，固定前面、疯狂改 nonce，对其做两次 SHA-256，
// 直到哈希以若干个 0 开头（即小于目标）。比 stage2 的 mining-sim 更贴近真实结构。

async function dsha(s) {
  let b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  b = await crypto.subtle.digest("SHA-256", b);
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export default function mount(root, lang) {
  const en = lang === "en";
  const header = {
    version: "0x20000000",
    prev: "00000000000000000002a7c4c1e48d76c5a37902165a9f0a8eea2f1c…",
    merkle: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7a…",
    time: "1718900000",
    bits: "0x17034219",
  };

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${en ? "⛏️ Block header mining · double SHA-256" : "⛏️ 区块头挖矿 · 双重 SHA-256"}</div>
      <div class="hdr">
        <span class="k">${en ? "Version" : "版本"}</span><span class="v">${header.version}</span>
        <span class="k">${en ? "Previous block hash" : "上一区块哈希"}</span><span class="v">${header.prev}</span>
        <span class="k">${en ? "Merkle root" : "默克尔根"}</span><span class="v">${header.merkle}</span>
        <span class="k">${en ? "Timestamp" : "时间戳"}</span><span class="v">${header.time}</span>
        <span class="k">${en ? "Target bits" : "目标 bits"}</span><span class="v">${header.bits}</span>
        <span class="k">nonce</span><span class="v" id="hm-nonce">${en ? "— (unmined)" : "—（待挖）"}</span>
      </div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Difficulty: the header hash must start with " : "难度：区块头哈希要以 "}<b id="hm-d">3</b>${en ? " zeros" : " 个 0 开头"}</label>
        <input class="demo-slider" id="hm-diff" type="range" min="1" max="4" step="1" value="3" />
      </div>
      <div class="demo-btns"><button class="demo-btn" id="hm-go">${en ? "Start mining this header" : "开始挖这个区块头"}</button></div>
      <div class="demo-out demo-out-sm" id="hm-out">${en ? "Change the nonce, run double SHA-256 over these fields, until the hash falls below the target." : "改 nonce、对这串字段做两次 SHA-256，直到哈希落在目标之下。"}</div>
      <div class="demo-meta" id="hm-stat"></div>
    </div>`;

  const diff = root.querySelector("#hm-diff");
  let running = false;
  diff.addEventListener("input", () => { root.querySelector("#hm-d").textContent = diff.value; });

  root.querySelector("#hm-go").addEventListener("click", async () => {
    if (running) return;
    running = true;
    const d = parseInt(diff.value, 10), target = "0".repeat(d);
    const head = [header.version, header.prev, header.merkle, header.time, header.bits, ""].join("|");
    const out = root.querySelector("#hm-out"), stat = root.querySelector("#hm-stat"), btn = root.querySelector("#hm-go");
    btn.disabled = true; btn.textContent = en ? "Mining…" : "挖矿中…";
    const t0 = Date.now();
    let nonce = 0, h = "";
    const CAP = 3000000;
    while (nonce < CAP) {
      h = await dsha(head + nonce);
      if (h.startsWith(target)) break;
      nonce++;
      if (nonce % 500 === 0) { stat.textContent = (en ? "Tried " : "已试 ") + nonce.toLocaleString() + (en ? " nonces…" : " 个 nonce…"); await new Promise((r) => setTimeout(r, 0)); }
    }
    root.querySelector("#hm-nonce").textContent = h.startsWith(target) ? nonce : (en ? "(not found)" : "（未找到）");
    out.innerHTML = h.startsWith(target) ? (en ? "✓ Valid header! Hash " : "✓ 区块头有效！哈希 ") + h : (en ? "Hit the cap without finding one; try lowering the difficulty." : "达到上限仍未找到，降低难度试试。");
    stat.textContent = (en ? "Tried " : "共试 ") + (nonce + 1).toLocaleString() + (en ? " nonces · took " : " 个 nonce · 用时 ") + (Date.now() - t0) + (en ? " ms · double SHA-256" : " ms · 双重 SHA-256");
    btn.disabled = false; btn.textContent = en ? "Mine again" : "重新挖";
    running = false;
  });
}
