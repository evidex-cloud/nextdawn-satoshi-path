// 交互演示：量子威胁敞口
// 逐一查看每种"持币姿势"是安全还是有风险，并把一个全新地址从"未花费"翻到"已花费 → 公钥暴露"。
// 再用滑块对比"今天的逻辑量子比特" vs "破解 secp256k1 所需"，直观感受差距。

export default function mount(root, lang) {
  const en = lang === "en";

  // 每种情形：是否暴露公钥由 exposed() 决定（fresh 地址随 spent 切换）。
  const cases = [
    {
      k: "fresh",
      name: en ? "Fresh, never-spent address" : "全新、从未花费的地址",
      why: en
        ? "Only a hash of the public key is on-chain. Quantum can't see the public key — protected by hashing."
        : "链上只有公钥的哈希。量子机看不到公钥本身——受哈希保护。",
      whyExposed: en
        ? "Once you spend, the full public key is published on-chain forever, and any unspent coins left here are exposed to Shor."
        : "你一花钱，完整公钥就永久写上链；这个地址里剩下没花的币就暴露在 Shor 面前。",
      toggle: true, // 这一条可被 spent 翻转
    },
    {
      k: "reused",
      name: en ? "Reused address (already spent from)" : "重复使用的地址（已花过钱）",
      why: en
        ? "Spending revealed the public key. Coins received here afterward sit exposed."
        : "花钱时已公开公钥。之后再收到的币就一直裸奔。",
      exposed: true,
    },
    {
      k: "p2pk",
      name: en ? "Ancient P2PK output (early-miner / Satoshi era)" : "古老的 P2PK 输出（早期矿工 / 中本聪时代）",
      why: en
        ? "The raw public key was written on-chain from day one — exposed since the very beginning."
        : "公钥从第一天起就直接写在链上——一开始就暴露。",
      exposed: true,
    },
    {
      k: "taproot",
      name: en ? "Taproot key-path output (P2TR)" : "Taproot 公钥路径输出（P2TR）",
      why: en
        ? "The public key appears directly in the address — efficient and private, but not veiled by a hash."
        : "公钥直接出现在地址中——高效又隐私，但没有哈希遮挡。",
      exposed: true,
    },
    {
      k: "mempool",
      name: en ? "Transaction sitting in the mempool" : "内存池里待确认的交易",
      why: en
        ? "Public key + signature are already public; an attacker races to derive the key before it confirms."
        : "公钥和签名都已公开；攻击者抢在确认前算出私钥。",
      exposed: true,
    },
  ];

  let spent = false; // “你从这个全新地址花过钱了吗？”

  function isExposed(c) {
    if (c.toggle) return spent;
    return !!c.exposed;
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">⚛️ ${en ? "Quantum exposure: which coins are safe, which are at risk" : "量子敞口：哪些币安全，哪些有风险"}</div>

      <div class="demo-block">
        <label class="demo-label">
          <input type="checkbox" id="qt-spent" style="vertical-align:middle;margin-right:6px" />
          ${en ? "Have you spent from your fresh address?" : "你从那个全新地址花过钱了吗？"}
          <b id="qt-spent-lbl"></b>
        </label>
      </div>

      <div class="detail" id="qt-list"></div>

      <div class="demo-block" style="margin-top:14px">
        <label class="demo-label">${en ? "Available logical qubits (today, 2026):" : "可用逻辑量子比特（今天，2026）："}<b id="qt-q">0</b></label>
        <input class="demo-slider" id="qt-qubits" type="range" min="0" max="2000" step="50" value="0" />
        <div class="demo-meta" id="qt-gap" style="margin-top:6px"></div>
      </div>

      <p class="demo-tip">${en
        ? "Rule of thumb: a coin is at risk only when its public key is on-chain. Never reusing an address keeps the key behind a hash — the single most effective defense you can apply today. Breaking secp256k1 needs ~2,000+ logical qubits (millions of physical qubits + error correction); today's machines are nowhere close."
        : "一句口诀：只有公钥上链的币才有风险。不复用地址＝把公钥藏在哈希后面，是今天最有效的防御。破解 secp256k1 需要约 2000+ 个逻辑量子比特（数百万物理比特 + 纠错）；今天的机器远远不够。"}</p>
    </div>`;

  const NEED = 2000; // 破解 secp256k1 所需逻辑量子比特的量级

  function paintList() {
    const safe = en ? "SAFE" : "安全";
    const risk = en ? "AT RISK" : "有风险";
    root.querySelector("#qt-list").innerHTML = cases.map((c) => {
      const ex = isExposed(c);
      const pill = ex ? `<span class="pill bad">${risk}</span>` : `<span class="pill ok">${safe}</span>`;
      const reason = c.toggle ? (spent ? c.whyExposed : c.why) : c.why;
      const flip = c.toggle
        ? `<span class="dk" style="margin-left:6px">${en ? "(toggle above to flip)" : "（上方开关可翻转）"}</span>`
        : "";
      return `<div style="margin:8px 0;padding-bottom:8px;border-bottom:1px solid rgba(128,128,128,0.2)">
        <div><b>${c.name}</b> ${pill}${flip}</div>
        <div style="margin-top:4px">${reason}</div>
      </div>`;
    }).join("");
  }

  function paintGap() {
    const have = parseInt(root.querySelector("#qt-qubits").value, 10);
    root.querySelector("#qt-q").textContent = have;
    const gapEl = root.querySelector("#qt-gap");
    if (have < NEED) {
      gapEl.innerHTML = en
        ? `Need <b>~${NEED}+</b> logical qubits to break secp256k1 → still short by <b>${NEED - have}+</b>. <span class="pill ok">No threat yet</span>`
        : `破解 secp256k1 需要 <b>~${NEED}+</b> 个逻辑量子比特 → 还差 <b>${NEED - have}+</b> 个。<span class="pill ok">暂无威胁</span>`;
    } else {
      gapEl.innerHTML = en
        ? `Reached the breaking threshold (hypothetical, not real today). <span class="pill bad">Exposed-key coins at risk</span>`
        : `达到破解门槛（假设，今天并不存在）。<span class="pill bad">公钥暴露的币有风险</span>`;
    }
  }

  function paintSpentLbl() {
    root.querySelector("#qt-spent-lbl").textContent = spent
      ? (en ? " → public key now exposed" : " → 公钥已暴露")
      : (en ? " → public key still hidden (hash only)" : " → 公钥仍隐藏（只有哈希）");
  }

  root.querySelector("#qt-spent").addEventListener("change", (e) => {
    spent = e.target.checked;
    paintSpentLbl();
    paintList();
  });
  root.querySelector("#qt-qubits").addEventListener("input", paintGap);

  paintSpentLbl();
  paintList();
  paintGap();
}
