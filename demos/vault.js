// 交互演示：契约金库（Covenant Vault）
// 启用金库时，契约强制提现先进入延时期，你能用恢复钥匙夺回被盗资金；关掉则立刻被卷走。

export default function mount(root, lang) {
  const en = lang === "en";
  let vault = true;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🏰 ${en ? "Covenant Vault · Attaching Conditions to Coins" : "契约金库（Covenant Vault）· 给币加使用条件"}</div>
      <label class="demo-switch"><input type="checkbox" id="vt-on" checked /> ${en ? "Enable vault (the covenant forces withdrawals through a 24-hour delay)" : "启用金库（契约强制提现走 24 小时延时）"}</label>
      <div class="demo-btns">
        <button class="demo-btn" id="vt-steal">${en ? "Thief starts a withdrawal with the stolen key" : "小偷用偷到的钥匙发起提现"}</button>
        <button class="demo-btn" id="vt-reset">${en ? "Reset" : "重置"}</button>
      </div>
      <div class="demo-log" id="vt-log"></div>
      <p class="demo-tip">${en ? "A covenant restricts how a UTXO can be spent in the future. A vault is one example: a withdrawal must first enter a delay period, giving you time to claw it back with a recovery key, so even if a single hot key is stolen you don’t lose your coins. This kind of capability needs a new soft fork (such as the CTV / OP_VAULT proposals) and is still under discussion." : "契约（covenant）限制一个 UTXO 将来\"只能怎么花\"。金库就是一例：提现必须先进入延时期，你有时间用\"恢复钥匙\"夺回，于是单把热钥匙被偷也不至于丢币。这类能力需要新的软分叉（如 CTV / OP_VAULT 提案），仍在讨论中。"}</p>
    </div>`;

  const log = root.querySelector("#vt-log");
  const line = (c, t) => { const d = document.createElement("div"); d.className = c; d.textContent = t; log.appendChild(d); };

  root.querySelector("#vt-on").addEventListener("change", (e) => { vault = e.target.checked; log.innerHTML = ""; });
  root.querySelector("#vt-reset").addEventListener("click", () => { log.innerHTML = ""; });
  root.querySelector("#vt-steal").addEventListener("click", () => {
    log.innerHTML = "";
    if (vault) {
      line("warn", en ? "① The thief starts a withdrawal… the covenant forces it into a 24-hour delay period, so the funds aren’t in hand yet." : "① 小偷发起提现……契约强制：进入 24 小时延时期，资金还没到手。");
      setTimeout(() => line("ok", en ? "② You get an alert and use the recovery key to trigger a “claw-back,” moving the funds to safety. The thief leaves empty-handed." : "② 你收到告警，用恢复钥匙触发“夺回”，资金被安全转走。小偷空手而归。"), 500);
    } else {
      line("bad", en ? "① No vault: the thief uses the stolen key to sweep the coins away immediately, with no way to recover them." : "① 没有金库：小偷用偷到的钥匙立即把币卷走，无法挽回。");
    }
  });
}
