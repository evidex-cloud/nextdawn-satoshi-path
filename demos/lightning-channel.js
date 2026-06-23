// 交互演示：闪电支付通道
// Alice、Bob 各押 0.05（开通道上链一次），之后链下来回即时付款，最后关通道结算上链一次。
// 内部用整数单位（0.01 BTC = 1 格）避免浮点误差。

export default function mount(root, lang) {
  const en = lang === "en";
  const TOT = 10; // 0.10 BTC，分 10 格
  let a = 5, b = 5, count = 0, closed = false;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">⚡ ${en ? "Lightning Payment Channel · Instant Off-Chain Micropayments" : "闪电支付通道 · 链下即时小额"}</div>
      <div class="demo-meta">${en ? "Alice and Bob each lock 0.05 BTC on-chain, opening a channel with 0.10 capacity (this step goes on-chain)." : "Alice 和 Bob 在链上各押 0.05 BTC，开了一条容量 0.10 的通道（这一步上链）。"}</div>
      <div class="chan" id="ln-bar"></div>
      <div class="demo-btns">
        <button class="demo-btn" id="ln-atob">${en ? "Alice pays Bob 0.01" : "Alice 付 Bob 0.01"}</button>
        <button class="demo-btn" id="ln-btoa">${en ? "Bob pays Alice 0.01" : "Bob 付 Alice 0.01"}</button>
        <button class="demo-btn" id="ln-close">${en ? "Close channel and settle on-chain" : "关闭通道并上链结算"}</button>
      </div>
      <div class="demo-meta" id="ln-status"></div>
      <p class="demo-tip">${en ? "Payments back and forth inside the channel are instant, nearly free, and stay off-chain—only opening and closing the channel land on the main chain. Thousands of small payments take up just 2 main-chain transactions." : "通道内来回付款即时、几乎零费、且不上链——只有\"开通道\"和\"关通道\"这两笔落到主链。成千上万笔小额，只占用主链 2 笔。"}</p>
    </div>`;

  function paint() {
    const ap = a / TOT * 100;
    root.querySelector("#ln-bar").innerHTML =
      `<div class="a" style="width:${ap}%">Alice ${(a * 0.01).toFixed(2)}</div><div class="b" style="width:${100 - ap}%">Bob ${(b * 0.01).toFixed(2)}</div>`;
    root.querySelector("#ln-status").innerHTML = closed
      ? (en
          ? '<span class="pill ok">Settled on-chain</span> Channel closed: final Alice ' + (a * 0.01).toFixed(2) + " / Bob " + (b * 0.01).toFixed(2) + " BTC, done in a single on-chain transaction. <b>" + count + "</b> off-chain payments in total, all instant and off-chain."
          : '<span class="pill ok">已结算上链</span> 通道关闭：最终 Alice ' + (a * 0.01).toFixed(2) + " / Bob " + (b * 0.01).toFixed(2) + " BTC，一笔上链交易搞定。期间共 <b>" + count + "</b> 笔链下支付，全部即时、免上链。")
      : (en
          ? "Off-chain payments: <b>" + count + "</b> (instant, nearly free, 0 on-chain)."
          : "链下支付 <b>" + count + "</b> 笔（即时、几乎零费、0 笔上链）。");
    root.querySelector("#ln-atob").disabled = closed;
    root.querySelector("#ln-btoa").disabled = closed;
  }
  root.querySelector("#ln-atob").addEventListener("click", () => { if (!closed && a >= 1) { a--; b++; count++; paint(); } });
  root.querySelector("#ln-btoa").addEventListener("click", () => { if (!closed && b >= 1) { b--; a++; count++; paint(); } });
  root.querySelector("#ln-close").addEventListener("click", () => { closed = true; paint(); });
  paint();
}
