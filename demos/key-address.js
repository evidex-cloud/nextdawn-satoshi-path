// 交互演示：私钥 → 地址（单向，示意）
// 真实比特币用椭圆曲线 secp256k1，这里用 SHA-256 作"单向函数"的示意，建立直觉即可。
// 重点传达：确定性、改一个字全变、不可反推；以及"私钥即钱、地址可公开"。

async function sha256Hex(t) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function randHex(n) {
  const a = new Uint8Array(n);
  crypto.getRandomValues(a);
  return [...a].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export default function mount(root, lang) {
  const en = lang === "en";
  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🔑 ${en ? "Private Key → Address · One-way derivation (illustrative)" : "私钥 → 地址 · 单向推导（示意）"}</div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Private key (change a character, or generate one at random):" : "私钥（改一个字，或随机生成一把）："}</label>
        <textarea class="demo-ta" id="ka-pk" rows="2" spellcheck="false">correct horse battery staple</textarea>
        <div class="demo-btns"><button class="demo-btn" id="ka-rand">🎲 ${en ? "Generate a random private key" : "随机生成一把私钥"}</button></div>
        <label class="demo-label">${en ? "The address derived one-way from it (illustrative):" : "由它单向算出的地址（示意）："}</label>
        <div class="demo-out" id="ka-addr">…</div>
        <p class="demo-tip">${en ? "The same private key always gives the same address (deterministic); change one character and the address changes completely; but no one can work back from the address to the private key (one-way). Real Bitcoin uses elliptic curves and a different address format, but the one-way principle is the same." : "同样的私钥永远得到同样的地址（确定性）；改一个字，地址全变；但没人能从地址反推回私钥（单向）。真实比特币用椭圆曲线，地址格式不同，单向原理一致。"}</p>
        <div class="demo-warn">${en ? "For demonstration only: never enter a <b>real</b> private key or seed phrase into any website or tool." : "演示用途：永远不要把<b>真实</b>私钥或助记词输入任何网站或工具。"}</div>
      </div>
    </div>`;

  const pk = root.querySelector("#ka-pk");
  const addr = root.querySelector("#ka-addr");
  async function upd() {
    const h = await sha256Hex("btc-demo:" + pk.value);
    addr.textContent = (en ? "Illustrative address " : "示意地址 ") + h.slice(0, 40);
  }
  pk.addEventListener("input", upd);
  root.querySelector("#ka-rand").addEventListener("click", () => { pk.value = randHex(32); upd(); });
  upd();
}
