// 交互演示：双花实验
// 关掉"公共账本"时，币只是个可复制的文件 —— 同一枚能花给好几个人（双花）。
// 打开账本后，第二次花同一枚币会被账本拒绝。借此体会"为什么数字现金需要一本总账"。

export default function mount(root, lang) {
  const en = lang === "en";
  let ledger = false;   // 是否启用公共账本
  let owner = null;     // 账本模式下，币#1 当前归谁
  let copies = 0;       // 无账本模式下，币被复制发出了几次

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🪙 ${en ? "Double-Spend Lab · Can the same coin be spent twice?" : "双花实验 · 同一枚币能花两次吗？"}</div>
      <label class="demo-switch"><input type="checkbox" id="ds-ledger" /> ${en ? "Enable the public ledger (a shared, network-wide record)" : "启用公共账本（全网共享的总账）"}</label>
      <div class="demo-block" style="display:flex;align-items:center;gap:12px">
        <span class="demo-coin">₿</span>
        <span class="demo-meta">${en ? "You hold one digital coin <b>#1</b>" : "你手里有一枚数字币 <b>#1</b>"}</span>
      </div>
      <div class="demo-btns">
        <button class="demo-btn" data-to="Alice">${en ? "Send coin #1 to Alice" : "把币 #1 发给 Alice"}</button>
        <button class="demo-btn" data-to="Bob">${en ? "Send the same coin to Bob" : "把同一枚币 发给 Bob"}</button>
        <button class="demo-btn" id="ds-reset">${en ? "Reset" : "重置"}</button>
      </div>
      <div class="demo-log" id="ds-log"></div>
    </div>`;

  const log = root.querySelector("#ds-log");
  const line = (cls, txt) => {
    const d = document.createElement("div");
    d.className = cls;
    d.textContent = txt;
    log.appendChild(d);
  };
  function reset() {
    owner = null;
    copies = 0;
    log.innerHTML = "";
  }

  root.querySelector("#ds-ledger").addEventListener("change", (e) => {
    ledger = e.target.checked;
    reset();
    line("warn", ledger
      ? (en ? "Public ledger enabled: every coin's recipient is recorded, and a second attempt to spend the same coin will be rejected." : "已启用公共账本：每枚币花给谁都会被记下，第二次想花同一枚会被拒绝。")
      : (en ? "No ledger: the coin is just a file you can copy endlessly… try sending the same one to two people." : "没有账本：币只是一个可以无限复制的文件……试试把同一枚发给两个人。"));
  });

  root.querySelectorAll("[data-to]").forEach((b) =>
    b.addEventListener("click", () => {
      const to = b.dataset.to;
      if (ledger) {
        if (owner === null) {
          owner = to;
          line("ok", en ? `Ledger records: coin #1 → ${to}. ✓ ${to} received it.` : `账本记下：币 #1 → ${to}。✓ ${to} 收到了。`);
        } else {
          line("bad", en ? `✗ The ledger shows coin #1 already belongs to ${owner}; the double-spend is rejected. ${to} got nothing.` : `✗ 账本显示币 #1 已经属于 ${owner}，拒绝双花。${to} 没收到。`);
        }
      } else {
        copies++;
        line("ok", en ? `✓ Sent a copy of coin #1 to ${to}; ${to} thinks the money arrived.` : `✓ 把币 #1 的副本发给了 ${to}，${to} 以为自己收到了钱。`);
        if (copies >= 2) {
          line("warn", en ? "⚠ You spent the same coin twice! This is double-spending — without a ledger, a digital coin is worthless." : "⚠ 你把同一枚币花了两次！这就是双花 —— 没有账本时，数字币形同废纸。");
        }
      }
    })
  );

  root.querySelector("#ds-reset").addEventListener("click", reset);
}
