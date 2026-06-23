// 交互演示：地址类型识别
// 点一个前缀，看该类地址的名称、示例、引入年代和特点。

export default function mount(root, lang) {
  const en = lang === "en";
  const types = [
    { k: "p2pkh", name: "P2PKH", prefix: "1...", ex: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2", year: "2009", note: en ? "The oldest address type. Best compatibility, but larger transactions and higher fees." : "最古老的地址。兼容性最好，但交易体积偏大、手续费偏高。" },
    { k: "p2sh", name: "P2SH", prefix: "3...", ex: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy", year: "2012 · BIP16", note: en ? "The lock holds the hash of a script; you reveal the full script when spending. Commonly used for multisig and early wrapped SegWit." : "锁里放“一段脚本的哈希”，花费时再亮出完整脚本。常用于多签与早期包装版 SegWit。" },
    { k: "p2wpkh", name: en ? "P2WPKH (SegWit v0)" : "P2WPKH（SegWit v0）", prefix: "bc1q...", ex: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq", year: "2017 · BIP141/173", note: en ? "Segregated Witness address. Cheaper (witness discount) and fixes transaction malleability." : "隔离见证地址。更便宜（见证折扣），并修复了交易延展性。" },
    { k: "p2tr", name: en ? "P2TR (Taproot)" : "P2TR（Taproot）", prefix: "bc1p...", ex: "bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297", year: "2021 · BIP340-342", note: en ? "The newest generation, based on Schnorr. More private and more efficient — even complex scripts can look like an ordinary payment from the outside." : "最新一代，基于 Schnorr。更隐私、更高效——复杂脚本对外也能像普通支付。" },
  ];
  let cur = "p2pkh";

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${en ? "🏷️ Address type identifier · click a prefix for details" : "🏷️ 地址类型识别 · 点一个前缀看详情"}</div>
      <div class="demo-btns" id="ai-btns"></div>
      <div class="detail" id="ai-detail"></div>
    </div>`;

  function paint() {
    root.querySelector("#ai-btns").innerHTML = types.map((t) =>
      `<button class="sc-col ${t.k === cur ? "active" : ""}" data-k="${t.k}">${t.prefix}</button>`).join("");
    const t = types.find((x) => x.k === cur);
    root.querySelector("#ai-detail").innerHTML =
      `<div><b>${t.name}</b> · ${en ? "prefix" : "前缀"} <span class="addr">${t.prefix}</span></div>
       <div class="dk" style="margin-top:6px">${en ? "Example:" : "示例："}<span class="addr" style="word-break:break-all">${t.ex}</span></div>
       <div class="dk" style="margin-top:6px">${en ? "Introduced:" : "引入："}${t.year}</div>
       <div style="margin-top:8px">${t.note}</div>`;
    root.querySelectorAll("#ai-btns .sc-col").forEach((b) =>
      b.addEventListener("click", () => { cur = b.dataset.k; paint(); }));
  }
  paint();
}
