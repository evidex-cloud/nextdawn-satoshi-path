// 交互演示：交易所 vs 自托管
// 点一个情景，看两种保管方式下的不同结果。诚实呈现：两边各有各的风险。

export default function mount(root, lang) {
  const en = lang === "en";
  const events = [
    { t: en ? "Platform halts withdrawals" : "平台暂停提现", ex: { ok: false, m: en ? "Can't withdraw" : "取不出来" }, self: { ok: true, m: en ? "Unaffected" : "不受影响" } },
    { t: en ? "Platform hacked / customer funds misused" : "平台被黑 / 挪用客户资产", ex: { ok: false, m: en ? "Possible loss" : "可能损失" }, self: { ok: true, m: en ? "Unaffected" : "不受影响" } },
    { t: en ? "Platform goes bankrupt or absconds (Mt.Gox / FTX)" : "平台破产跑路（Mt.Gox / FTX）", ex: { ok: false, m: en ? "Could lose everything" : "可能血本无归" }, self: { ok: true, m: en ? "Safe and sound" : "安然无恙" } },
    { t: en ? "You lose your seed phrase" : "你弄丢了助记词", ex: { ok: true, m: en ? "Can still log in to recover" : "还能登录找回" }, self: { ok: false, m: en ? "Coins locked forever" : "币永久锁死" } },
    { t: en ? "You get phished out of your seed phrase" : "你被钓鱼骗走助记词", ex: { ok: true, m: en ? "Platform may block it" : "平台或可风控拦截" }, self: { ok: false, m: en ? "Coins stolen" : "币被盗走" } },
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🏦 ${en ? "Exchange vs Self-Custody · Click a scenario to see the outcome" : "交易所 vs 自托管 · 点一个情景看结果"}</div>
      <div class="demo-btns">${events.map((e, i) => `<button class="demo-btn" data-i="${i}">${e.t}</button>`).join("")}</div>
      <div class="cust">
        <div class="cust-cell"><h5>${en ? "On an exchange (custodial)" : "放在交易所（托管）"}</h5><div id="cs-ex">—</div></div>
        <div class="cust-cell"><h5>${en ? "Self-custody (you hold the keys)" : "自托管（你拿钥匙）"}</h5><div id="cs-self">—</div></div>
      </div>
      <div class="scn-meta" id="cs-take">${en ? "Pick a scenario to see what happens under each way of holding your coins." : "选一个情景，看两种保管方式下会发生什么。"}</div>
    </div>`;

  const pill = (o) => `<span class="pill ${o.ok ? "ok" : "bad"}">${o.ok ? "✓" : "✗"} ${o.m}</span>`;
  root.querySelectorAll("[data-i]").forEach((b) =>
    b.addEventListener("click", () => {
      const e = events[+b.dataset.i];
      root.querySelector("#cs-ex").innerHTML = pill(e.ex);
      root.querySelector("#cs-self").innerHTML = pill(e.self);
      root.querySelector("#cs-take").textContent =
        e.self.ok && !e.ex.ok ? (en ? "Platform risk: self-custody lets you avoid it." : "平台风险：自托管能躲开它。")
        : (!e.self.ok && e.ex.ok ? (en ? "Self-custody risk: this is exactly the homework self-custody requires — backups and scam protection (next section)." : "自我保管风险：这正是自托管要补的功课——备份与防骗（下一节）。") : "");
    })
  );
}
