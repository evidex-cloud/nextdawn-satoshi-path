// 交互演示：交易延展性与 SegWit
// 传统交易把签名算进 txid，第三方微调签名 → txid 变（依赖它的二层失效）；
// SegWit 把签名移出 txid 计算 → txid 稳定。用真实 SHA-256。

async function H(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export default function mount(root, lang) {
  const en = lang === "en";
  const content = "付款: Alice → Bob 0.5 BTC";
  let sig = "SIG-9f3a";

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🔁 ${en ? "Transaction Malleability · Why SegWit Saves the Lightning Network" : "交易延展性 · SegWit 为什么能救闪电网络"}</div>
      <div class="demo-btns">
        <button class="demo-btn" id="ml-tweak">${en ? "Third party tweaks the signature (amount unchanged)" : "第三方微调签名（不改金额）"}</button>
        <button class="demo-btn" id="ml-reset">${en ? "Reset" : "重置"}</button>
      </div>
      <div class="cust" style="margin-top:6px">
        <div class="cust-cell"><h5>${en ? "Legacy transaction (signature counted into txid)" : "传统交易（签名算进 txid）"}</h5>
          <div class="demo-meta">${en ? "Signature" : "签名"}：<span id="ml-lsig" style="font-family:var(--mono)"></span></div>
          <div class="demo-meta" style="margin-top:4px">txid：<b id="ml-ltxid" style="font-family:var(--mono);color:var(--orange)"></b></div>
          <div id="ml-lflag" class="demo-meta" style="margin-top:6px"></div>
        </div>
        <div class="cust-cell"><h5>${en ? "SegWit transaction (signature moved to witness)" : "SegWit 交易（签名移到见证）"}</h5>
          <div class="demo-meta">${en ? "Witness signature" : "见证签名"}：<span id="ml-ssig" style="font-family:var(--mono)"></span></div>
          <div class="demo-meta" style="margin-top:4px">txid：<b id="ml-stxid" style="font-family:var(--mono);color:var(--green)"></b></div>
          <div id="ml-sflag" class="demo-meta" style="margin-top:6px"></div>
        </div>
      </div>
      <div class="demo-meta" id="ml-take" style="margin-top:8px"></div>
    </div>`;

  async function render(tweaked) {
    const ltxid = (await H(content + "|" + sig)).slice(0, 16);
    const stxid = (await H(content)).slice(0, 16);
    root.querySelector("#ml-lsig").textContent = sig;
    root.querySelector("#ml-ssig").textContent = sig;
    root.querySelector("#ml-ltxid").textContent = ltxid + "…";
    root.querySelector("#ml-stxid").textContent = stxid + "…";
    if (tweaked) {
      root.querySelector("#ml-lflag").innerHTML = en ? '<span class="pill bad">✗ txid changed</span>' : '<span class="pill bad">✗ txid 变了</span>';
      root.querySelector("#ml-sflag").innerHTML = en ? '<span class="pill ok">✓ txid unchanged</span>' : '<span class="pill ok">✓ txid 不变</span>';
      root.querySelector("#ml-take").innerHTML = en ? 'Legacy transaction: tweak the signature and the txid changes—any follow-up transaction that referenced this unconfirmed transaction (such as a Lightning channel) is invalidated. SegWit moves the signature out of the txid computation → <b>txid is stable</b>, so layer two can be built safely on top of it.' : '传统交易：改一下签名，txid 就变——任何"引用了这笔未确认交易"的后续交易（如闪电通道）全部失效。SegWit 把签名移出 txid 的计算 → <b>txid 稳定</b>，二层才能安全地建立在它之上。';
    } else {
      root.querySelector("#ml-lflag").innerHTML = "";
      root.querySelector("#ml-sflag").innerHTML = "";
      root.querySelector("#ml-take").textContent = en ? 'Click the button above to let a third party redraw the signature without changing the amount, and watch how each transaction’s txid reacts.' : '点上面的按钮，让第三方在不改金额的前提下"描摹"一下签名，看两种交易的 txid 反应。';
    }
  }
  root.querySelector("#ml-tweak").addEventListener("click", () => { sig = "SIG-" + Math.random().toString(16).slice(2, 6); render(true); });
  root.querySelector("#ml-reset").addEventListener("click", () => { sig = "SIG-9f3a"; render(false); });
  render(false);
}
