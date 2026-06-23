// 交互演示：派生路径解码
// 调每一段，看 m/purpose'/coin'/account'/change/index 各表示什么，以及用途号对应的地址类型。

export default function mount(root, lang) {
  const en = lang === "en";
  const purposes = {
    "44": [en ? "Legacy (P2PKH)" : "传统 (P2PKH)", en ? "starts with 1..." : "1... 开头"],
    "49": [en ? "Wrapped SegWit (P2SH)" : "包装 SegWit (P2SH)", en ? "starts with 3..." : "3... 开头"],
    "84": [en ? "Native SegWit (P2WPKH)" : "原生 SegWit (P2WPKH)", en ? "starts with bc1q..." : "bc1q... 开头"],
    "86": [en ? "Taproot (P2TR)" : "Taproot (P2TR)", en ? "starts with bc1p..." : "bc1p... 开头"],
  };

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🧭 ${en ? "Derivation path decoder · what m/84'/0'/0'/0/0 means" : "派生路径解码 · m/84'/0'/0'/0/0 是什么意思"}</div>
      <div class="demo-block">
        <label class="demo-label">${en ? "purpose (determines address type)" : "用途 purpose（决定地址类型）"}</label>
        <select class="demo-inp" id="pd-purpose">
          <option value="44">44'</option><option value="49">49'</option>
          <option value="84" selected>84'</option><option value="86">86'</option>
        </select>
        <label class="demo-label" style="margin-top:10px">${en ? "account" : "账户 account"}：<b id="pd-al">0</b></label>
        <input class="demo-slider" id="pd-acc" type="range" min="0" max="3" step="1" value="0" />
        <label class="demo-label" style="margin-top:10px">${en ? "change" : "找零 change"}：<b id="pd-cl">${en ? "0 (external, receiving)" : "0（外部收款）"}</b></label>
        <input class="demo-slider" id="pd-chg" type="range" min="0" max="1" step="1" value="0" />
        <label class="demo-label" style="margin-top:10px">${en ? "address index" : "地址序号 index"}：<b id="pd-il">0</b></label>
        <input class="demo-slider" id="pd-idx" type="range" min="0" max="20" step="1" value="0" />
      </div>
      <div class="demo-out demo-out-sm" id="pd-path"></div>
      <div class="detail" id="pd-detail"></div>
    </div>`;

  const $ = (id) => root.querySelector(id);
  function upd() {
    const pp = $("#pd-purpose").value, acc = $("#pd-acc").value, chg = +$("#pd-chg").value, idx = $("#pd-idx").value;
    $("#pd-al").textContent = acc;
    $("#pd-il").textContent = idx;
    $("#pd-cl").textContent = chg === 0 ? (en ? "0 (external, receiving)" : "0（外部收款）") : (en ? "1 (internal, change)" : "1（内部找零）");
    const path = "m/" + pp + "'/0'/" + acc + "'/" + chg + "/" + idx;
    $("#pd-path").textContent = path;
    const info = purposes[pp];
    $("#pd-detail").innerHTML = en
      ? `<div><b>${path}</b></div>
       <div style="margin-top:8px"><span class="dk">purpose ${pp}'</span>: ${info[0]}, address <span class="addr">${info[1]}</span></div>
       <div style="margin-top:4px"><span class="dk">coin 0'</span>: Bitcoin mainnet</div>
       <div style="margin-top:4px"><span class="dk">account ${acc}'</span>: account #${acc} (mutually independent sub-wallets within the wallet)</div>
       <div style="margin-top:4px"><span class="dk">change ${chg}</span>: ${chg === 0 ? "external chain (receiving addresses)" : "internal chain (change addresses)"}</div>
       <div style="margin-top:4px"><span class="dk">index ${idx}</span>: address #${idx} on this chain</div>`
      : `<div><b>${path}</b></div>
       <div style="margin-top:8px"><span class="dk">用途 ${pp}'</span>：${info[0]}，地址 <span class="addr">${info[1]}</span></div>
       <div style="margin-top:4px"><span class="dk">币种 0'</span>：比特币主网</div>
       <div style="margin-top:4px"><span class="dk">账户 ${acc}'</span>：第 ${acc} 个账户（钱包里相互独立的子钱包）</div>
       <div style="margin-top:4px"><span class="dk">找零 ${chg}</span>：${chg === 0 ? "外部链（收款地址）" : "内部链（找零地址）"}</div>
       <div style="margin-top:4px"><span class="dk">序号 ${idx}</span>：这条链上的第 ${idx} 个地址</div>`;
  }
  $("#pd-purpose").addEventListener("change", upd);
  ["#pd-acc", "#pd-chg", "#pd-idx"].forEach((s) => $(s).addEventListener("input", upd));
  upd();
}
