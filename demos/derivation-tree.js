// 交互演示：HD 钱包派生树（示意）
// 从一颗种子确定性地派生出一棵钥匙/地址树。改种子整棵树都变；同一种子永远得到同一棵树。
// 示意用 SHA-256；真实 BIP32 用 HMAC-SHA512 + 椭圆曲线运算。

async function H(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export default function mount(root, lang) {
  const en = lang === "en";
  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🌲 ${en ? "HD wallet · one seed grows a whole key tree (illustrative)" : "HD 钱包 · 一颗种子长出一棵钥匙树（示意）"}</div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Seed (change it, and the whole tree changes):" : "种子（改它，整棵树都变）："}</label>
        <input class="demo-inp" id="dt-seed" value="satoshi-nakamoto" spellcheck="false" />
      </div>
      <div class="demo-btns"><button class="demo-btn" id="dt-regen">${en ? "Regenerate from the same seed" : "用同一种子再生成一次"}</button></div>
      <div class="dtree" id="dt-tree"></div>
      <div class="demo-meta" id="dt-note"></div>
      <div class="demo-warn" style="margin-top:10px">${en ? "Note: real BIP32 derives using HMAC-SHA512 plus elliptic-curve math; here SHA-256 is used to demonstrate the idea that “the same seed → the same deterministic key tree.”" : "示意：真实 BIP32 用 HMAC-SHA512 加椭圆曲线运算派生；这里用 SHA-256 演示\"同一种子 → 同一棵确定性钥匙树\"的思想。"}</div>
    </div>`;

  const seedEl = root.querySelector("#dt-seed");
  const derive = async (seed, path) => (await H(seed + "|" + path)).slice(0, 12);

  async function build() {
    const seed = seedEl.value;
    const m = (await H(seed)).slice(0, 12);
    const rows = [`<div><span class="lbl">${en ? "m (master private key)" : "m （主私钥）"}</span> → <b>${m}</b></div>`];
    for (const a of [0, 1]) {
      rows.push(`<div>&nbsp;&nbsp;<span class="lbl">m/${a}</span> → <b>${await derive(seed, "/" + a)}</b></div>`);
      for (const i of [0, 1]) {
        rows.push(`<div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="lbl">m/${a}/${i}</span> → ${en ? "address" : "地址"} <b>${await derive(seed, "/" + a + "/" + i)}</b></div>`);
      }
    }
    root.querySelector("#dt-tree").innerHTML = rows.join("");
    root.querySelector("#dt-note").innerHTML = en ? "The same seed always derives the same entire key/address tree—so backing up one seed backs up countless addresses." : "同样的种子，永远派生出同样的一整棵钥匙/地址树——所以备份一颗种子，就备份了无数个地址。";
  }
  seedEl.addEventListener("input", build);
  root.querySelector("#dt-regen").addEventListener("click", build);
  build();
}
