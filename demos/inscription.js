// 交互演示：铭文（把数据刻进见证区）
// 输入内容，看它的字节大小、占用的区块空间（vB，享见证折扣）、以及在某费率下的手续费成本。

export default function mount(root, lang) {
  const en = lang === "en";
  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🪧 ${en ? "Inscriptions · Carving Data Into the Witness" : "铭文 · 把数据刻进见证区"}</div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Content to inscribe on-chain:" : "要刻在链上的内容："}</label>
        <textarea class="demo-ta" id="in-text" rows="2" spellcheck="false">Hello, Ordinals! 🟧</textarea>
      </div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Fee rate" : "费率"}：<b id="in-r">20</b> sat/vB</label>
        <input class="demo-slider" id="in-rate" type="range" min="1" max="120" step="1" value="20" />
      </div>
      <div class="demo-out demo-out-sm" id="in-out"></div>
      <p class="demo-tip">${en ? "Ordinals number every sat so data can be attached to a specific sat; the data itself is stuffed into the witness of a Taproot transaction. It gets the witness discount, but still takes up block space and pushes fees up—which is exactly what the community argues about." : "Ordinals 给每一聪编号，让数据能\"附\"在特定的聪上；数据本身被塞进 Taproot 交易的见证区。它享见证折扣，但仍要占用区块空间、推高费用——这正是社区争议所在。"}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  function upd() {
    const bytes = new TextEncoder().encode($("#in-text").value).length;
    const vb = Math.ceil(bytes / 4) + 10;
    const rate = +$("#in-rate").value;
    $("#in-r").textContent = rate;
    const fee = vb * rate;
    $("#in-out").innerHTML = en
      ? "Content size: <b>" + bytes + "</b> bytes<br>Block space used ≈ <b>" + vb + "</b> vB (after the witness discount)<br>At " + rate +
        " sat/vB, inscribing this costs about <b>" + fee.toLocaleString() + "</b> sats in fees."
      : "内容大小：<b>" + bytes + "</b> 字节<br>占用区块空间 ≈ <b>" + vb + "</b> vB（见证打折后）<br>在 " + rate +
        " sat/vB 下，刻这条铭文约花 <b>" + fee.toLocaleString() + "</b> 聪手续费。";
  }
  ["#in-text", "#in-rate"].forEach((s) => $(s).addEventListener("input", upd));
  upd();
}
