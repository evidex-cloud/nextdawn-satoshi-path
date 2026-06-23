// 交互演示：助记词种子（示意）
// 生成 12 个词的"示意助记词"，演示"一串词确定性地恢复整个钱包"。
// 注意：这是教学示意，真实 BIP39 有 2048 词的标准词表和校验位。

const WORDS = ("abandon ability able about above absorb abstract access account accuse achieve acid " +
  "across action actor adapt add addict adjust admit adult advance advice aerobic afford agent agree " +
  "ahead aim air airport alarm album").split(" ");

async function sha256Hex(t) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function pick12() {
  const a = new Uint32Array(12);
  crypto.getRandomValues(a);
  return [...a].map((x) => WORDS[x % WORDS.length]);
}

export default function mount(root, lang) {
  const en = lang === "en";
  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🌱 ${en ? "Seed Phrase · A few words restore your whole wallet (illustrative)" : "助记词种子 · 一串词恢复整个钱包（示意）"}</div>
      <div class="demo-btns">
        <button class="demo-btn" id="sp-gen">🎲 ${en ? "Generate an illustrative seed phrase" : "生成一串示意助记词"}</button>
        <button class="demo-btn" id="sp-rec" disabled>${en ? "Restore in another wallet" : "在另一个钱包里恢复"}</button>
      </div>
      <div class="seed-grid" id="sp-grid"></div>
      <div class="demo-meta" id="sp-note">${en ? "Click above to generate one and see what a seed phrase looks like." : "点上面生成，看一串助记词长什么样。"}</div>
      <div class="demo-warn" style="margin-top:10px">${en ? "For illustration only: real BIP39 seed phrases use a standard 2048-word list and a checksum. <b>Never</b> enter a real seed phrase into any online tool." : "示意用途：真实 BIP39 助记词有标准 2048 词表和校验位。<b>绝不要</b>把真实助记词输入任何在线工具。"}</div>
    </div>`;

  let phrase = [];
  const grid = root.querySelector("#sp-grid");
  const note = root.querySelector("#sp-note");
  const rec = root.querySelector("#sp-rec");

  async function addrOf(p) {
    return (en ? "Illustrative main address " : "示意主地址 ") + (await sha256Hex("seed:" + p.join(" "))).slice(0, 32);
  }
  async function gen() {
    phrase = pick12();
    grid.innerHTML = phrase.map((w, i) => `<div class="seed-word"><i>${i + 1}</i>${w}</div>`).join("");
    note.textContent = (en ? "These words derive → " : "这串词派生出 → ") + (await addrOf(phrase));
    rec.disabled = false;
  }
  root.querySelector("#sp-gen").addEventListener("click", gen);
  rec.addEventListener("click", async () => {
    note.textContent = en
      ? "✓ Enter these same 12 words in a new wallet → it computes back the same " + (await addrOf(phrase)) + ", and the balance comes right back."
      : "✓ 在新钱包输入同样这 12 个词 → 又算回同样的 " + (await addrOf(phrase)) + "，余额原样回来。";
  });
}
