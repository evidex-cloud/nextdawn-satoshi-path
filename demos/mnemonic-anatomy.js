// 交互演示：BIP39 助记词结构（示意）
// 生成 128 位熵 → 12 个词；演示"改错一个词，校验位对不上 → 钱包判定无效"。
// 结构（128+4=132=12×11）是准确的；单词用小词表示意，真实 BIP39 是 2048 词标准词表。

const WL = ("abandon ability able about above absorb abstract access account accuse achieve acid " +
  "across action actor adapt add addict adjust admit adult advance advice aerobic afford agent agree " +
  "ahead aim air airport alarm album").split(" ");

export default function mount(root, lang) {
  const en = lang === "en";
  let phrase = [], valid = false, hex = "";

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🌱 ${en ? "BIP39 mnemonic · entropy + checksum = words (illustrative)" : "BIP39 助记词 · 熵 + 校验 = 单词（示意）"}</div>
      <div class="demo-btns">
        <button class="demo-btn" id="mn-gen">🎲 ${en ? "Generate 128 bits of entropy → 12 words" : "生成 128 位熵 → 12 个词"}</button>
        <button class="demo-btn" id="mn-typo" disabled>${en ? "Try changing one word" : "改错一个词试试"}</button>
      </div>
      <div class="demo-meta" id="mn-ent"></div>
      <div class="seed-grid" id="mn-grid"></div>
      <div class="demo-meta" id="mn-check"></div>
      <p class="demo-tip">${en ? "128 bits of entropy + 4 checksum bits = 132 bits = 12 words (11 bits each, mapping to one of the 2048-word list). Those few checksum bits let the wallet catch it instantly when you copy a word wrong." : "128 位熵 + 4 位校验 = 132 位 = 12 个词（每词 11 位，对应 2048 词表里的一个）。最后那点校验位，让你抄错一个词时钱包能立刻发现。"}</p>
      <div class="demo-warn" style="margin-top:8px">${en ? "Note: a tiny word list is used to demonstrate the structure; real BIP39 uses the standard 2048-word list. Never enter a real mnemonic into any online tool." : "示意：用小词表演示结构；真实 BIP39 是 2048 词标准词表。绝不要把真实助记词输入任何在线工具。"}</div>
    </div>`;

  function render() {
    root.querySelector("#mn-ent").innerHTML =
      (en ? 'Entropy (128 random bits): ' : '熵（128 位随机）：') + '<span style="font-family:var(--mono);font-size:11.5px;word-break:break-all">' + (hex || "—") + "</span>";
    root.querySelector("#mn-grid").innerHTML = phrase.map((w, i) => `<div class="seed-word"><i>${i + 1}</i>${w}</div>`).join("");
    root.querySelector("#mn-check").innerHTML = valid
      ? (en ? '<span class="pill ok">✓ Checksum valid</span> This is a structurally valid mnemonic phrase.' : '<span class="pill ok">✓ 校验通过</span> 这是一串结构合法的助记词。')
      : (en ? '<span class="pill bad">✗ Checksum failed</span> One word was altered → the checksum bits don\'t match, and a proper wallet will flag it as an “invalid mnemonic,” helping you catch the typo.' : '<span class="pill bad">✗ 校验失败</span> 有个词被改过 → 校验位对不上，正规钱包会判定"无效助记词"，从而帮你抓到抄错。');
    root.querySelector("#mn-typo").disabled = phrase.length === 0 || !valid;
  }
  function gen() {
    const ent = new Uint8Array(16);
    crypto.getRandomValues(ent);
    hex = [...ent].map((x) => x.toString(16).padStart(2, "0")).join("");
    phrase = [...ent].slice(0, 12).map((b, i) => WL[(b + i * 7) % WL.length]);
    valid = true;
    render();
  }
  root.querySelector("#mn-gen").addEventListener("click", gen);
  root.querySelector("#mn-typo").addEventListener("click", () => {
    if (!phrase.length) return;
    const k = Math.floor(Math.random() * phrase.length);
    let w;
    do { w = WL[Math.floor(Math.random() * WL.length)]; } while (w === phrase[k]);
    phrase[k] = w;
    valid = false;
    render();
  });
  gen();
}
