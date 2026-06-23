// 交互演示：数字签名（真实椭圆曲线）
// 用浏览器内置的 Web Crypto ECDSA（P-256 曲线）做真实的签名/验证：
// 用私钥签名、用公钥验证、改一个字就验签失败。
// 比特币用的是 secp256k1 曲线，机制完全一致；这里用 P-256 只因浏览器原生支持。

const enc = (s) => new TextEncoder().encode(s);
const hex = (buf) => [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, "0")).join("");

export default function mount(root, lang) {
  const en = lang === "en";
  if (!(window.crypto && crypto.subtle && crypto.subtle.generateKey)) {
    root.innerHTML = `<div class="demo-warn">${en ? "Your browser doesn't support Web Crypto. Please open it via the <b>launch.bat</b> local server instead of double-clicking index.html directly." : "浏览器不支持 Web Crypto。请用 <b>launch.bat</b> 本地服务器打开，而不是直接双击 index.html。"}</div>`;
    return;
  }

  let keyPair = null, sig = null;
  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">✍️ ${en ? "Digital Signatures · A real elliptic-curve demo" : "数字签名 · 真实椭圆曲线演示"}</div>
      <div class="demo-btns"><button class="demo-btn" id="sv-gen">🔑 ${en ? "Generate a key pair" : "生成一对密钥"}</button></div>
      <div class="demo-meta" id="sv-pub">${en ? "Public key: not yet generated" : "公钥：尚未生成"}</div>
      <div class="demo-meta">${en ? "Private key: 🔒 secret (not shown, and never leaves this machine)" : "私钥：🔒 保密（不显示，也不会离开本机）"}</div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Message to sign (a “transaction”):" : "要签名的消息（一笔“交易”）："}</label>
        <textarea class="demo-ta" id="sv-msg" rows="2" spellcheck="false">${en ? "I authorize: pay 0.5 BTC to Bob" : "我授权：把 0.5 BTC 付给 Bob"}</textarea>
        <div class="demo-btns">
          <button class="demo-btn" id="sv-sign" disabled>${en ? "Sign with private key" : "用私钥签名"}</button>
          <button class="demo-btn" id="sv-verify" disabled>${en ? "Verify current message with public key" : "用公钥验证当前消息"}</button>
        </div>
      </div>
      <div class="demo-out demo-out-sm" id="sv-sig">${en ? "Signature: —" : "签名：—"}</div>
      <div class="demo-meta" id="sv-fb"></div>
      <p class="demo-tip">${en ? "After signing, try changing one character in the message and click “Verify”—the signature fails instantly. This uses the browser's built-in P-256 curve; Bitcoin uses secp256k1, same principle." : "签名后，试着改消息里的一个字再点“验证”——签名立刻失效。这里用浏览器内置的 P-256 曲线；比特币用 secp256k1，原理一致。"}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  $("#sv-gen").addEventListener("click", async () => {
    keyPair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
    const raw = await crypto.subtle.exportKey("raw", keyPair.publicKey);
    $("#sv-pub").textContent = (en ? "Public key (public): " : "公钥（公开）：") + hex(raw).slice(0, 48) + "…";
    $("#sv-sign").disabled = false;
    $("#sv-verify").disabled = true;
    sig = null;
    $("#sv-sig").textContent = en ? "Signature: —" : "签名：—";
    $("#sv-fb").textContent = en ? "Keys generated. You can sign now." : "密钥已生成。现在可以签名了。";
  });
  $("#sv-sign").addEventListener("click", async () => {
    sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, keyPair.privateKey, enc($("#sv-msg").value));
    $("#sv-sig").textContent = (en ? "Signature: " : "签名：") + hex(sig).slice(0, 64) + "…";
    $("#sv-verify").disabled = false;
    $("#sv-fb").innerHTML = en ? `<span class="pill ok">Signed</span> Now click “Verify”; or first change one character and watch it fail.` : `<span class="pill ok">已签名</span> 现在点“验证”；或先改一个字，看它失效。`;
  });
  $("#sv-verify").addEventListener("click", async () => {
    const ok = await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, keyPair.publicKey, sig, enc($("#sv-msg").value));
    $("#sv-fb").innerHTML = ok
      ? (en ? `<span class="pill ok">✓ Verified</span> This message really was signed by the private-key holder, and hasn't been altered.` : `<span class="pill ok">✓ 验证通过</span> 这条消息确实由私钥持有者签署，且未被改动。`)
      : (en ? `<span class="pill bad">✗ Verification failed</span> The message was changed (or wasn't signed by this private key)—the signature doesn't match the content.` : `<span class="pill bad">✗ 验证失败</span> 消息被改动了（或不是这把私钥签的）——签名与内容对不上。`);
  });
}
