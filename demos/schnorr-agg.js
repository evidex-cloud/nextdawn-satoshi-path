// 交互演示：Schnorr 签名聚合
// 同一笔 3-of-3 多签，对比 ECDSA（不能聚合，3 个签名各自单列）和 Schnorr（聚合成 1 个）。

export default function mount(root, lang) {
  const en = lang === "en";
  let scheme = "schnorr";

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🔗 ${en ? "Schnorr Signature Aggregation · Multisig That Looks Like a Single Sig" : "Schnorr 签名聚合 · 多签也能看起来像单签"}</div>
      <label class="demo-switch"><input type="radio" name="sg" id="sg-ecdsa" /> ${en ? "ECDSA (Bitcoin’s original signature, can’t aggregate)" : "ECDSA（比特币原签名，不能聚合）"}</label>
      <label class="demo-switch"><input type="radio" name="sg" id="sg-schnorr" checked /> ${en ? "Schnorr (Taproot, aggregatable)" : "Schnorr（Taproot，可聚合）"}</label>
      <div class="demo-meta" style="margin-top:8px">${en ? "For the same 3-of-3 multisig, what gets left on-chain:" : "同一笔 3-of-3 多签，链上会留下什么："}</div>
      <div class="detail" id="sg-detail"></div>
    </div>`;

  root.querySelector("#sg-ecdsa").addEventListener("change", () => { scheme = "ecdsa"; paint(); });
  root.querySelector("#sg-schnorr").addEventListener("change", () => { scheme = "schnorr"; paint(); });

  function paint() {
    const d = root.querySelector("#sg-detail");
    if (scheme === "ecdsa") {
      d.innerHTML = en
        ? "<div>🔑 Public keys: <b>3</b> (one each for Alice, Bob, Carol, all exposed on-chain)</div>" +
          '<div style="margin-top:6px">✍️ Signatures: <b>3</b>, each listed separately</div>' +
          '<div style="margin-top:6px">📦 On-chain size: <b>large</b> (about 3×)</div>' +
          '<div style="margin-top:6px">🕵️ Privacy: <span class="pill bad">exposed</span> you can tell at a glance this is a 3-party multisig</div>'
        : "<div>🔑 公钥：<b>3 个</b>（Alice、Bob、Carol 各一个，都暴露在链上）</div>" +
          '<div style="margin-top:6px">✍️ 签名：<b>3 个</b>，各自单列</div>' +
          '<div style="margin-top:6px">📦 链上体积：<b>大</b>（约 3 倍）</div>' +
          '<div style="margin-top:6px">🕵️ 隐私：<span class="pill bad">暴露</span> 一眼看出这是一笔 3 人多签</div>';
    } else {
      d.innerHTML = en
        ? "<div>🔑 Public key: <b>1</b> (3 keys aggregated into one)</div>" +
          '<div style="margin-top:6px">✍️ Signature: <b>1</b> (aggregated signature)</div>' +
          '<div style="margin-top:6px">📦 On-chain size: <b>small</b> (≈ a normal single sig)</div>' +
          '<div style="margin-top:6px">🕵️ Privacy: <span class="pill ok">hidden</span> on-chain it looks exactly like an ordinary single-sig transfer</div>'
        : "<div>🔑 公钥：<b>1 个</b>（3 把钥匙聚合成一个）</div>" +
          '<div style="margin-top:6px">✍️ 签名：<b>1 个</b>（聚合签名）</div>' +
          '<div style="margin-top:6px">📦 链上体积：<b>小</b>（≈ 普通单签）</div>' +
          '<div style="margin-top:6px">🕵️ 隐私：<span class="pill ok">隐藏</span> 链上看起来和一笔最普通的单签转账一模一样</div>';
    }
  }
  paint();
}
