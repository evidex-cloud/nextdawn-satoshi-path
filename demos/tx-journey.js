// 交互演示：一笔交易的旅程
// 点"下一步"，让一笔交易依次走过：签名 → 广播 → 进 mempool → 被打包 → 确认累积。

export default function mount(root, lang) {
  const en = lang === "en";
  const steps = [
    { t: en ? "1 · Build & sign" : "1 · 构造与签名", d: en ? "The wallet packages “which coins to spend, who to pay, change, fee” and signs it with your private key." : "钱包打包“从哪些币、付给谁、找零、手续费”，用你的私钥签名。" },
    { t: en ? "2 · Broadcast to the network" : "2 · 广播到全网", d: en ? "It's sent to connected nodes, which relay it to their neighbors, reaching the whole network in seconds." : "发给相连的节点，节点再转发给邻居，几秒内传遍全网。" },
    { t: en ? "3 · Enter the mempool" : "3 · 进入待确认池", d: en ? "Each node independently verifies it (is the signature valid? any double-spend?) and, if it passes, queues it in the mempool." : "每个节点独立验证（签名对不对、是否双花），通过则暂存进 mempool 排队。" },
    { t: en ? "4 · Packed by a miner" : "4 · 被矿工打包", d: en ? "A miner picks the best ones (usually highest-fee first) into a block; once mined, the transaction is on-chain and gets its 1st confirmation." : "矿工择优（通常高手续费优先）装进区块；挖出后这笔交易上链，得到第 1 个确认。" },
    { t: en ? "5 · Confirmations stack up" : "5 · 确认累积", d: en ? "After that, roughly every 10 minutes adds one more confirmation—buried deeper and more irreversible each time." : "之后每过约 10 分钟多一个确认，越压越深、越不可逆。" },
  ];
  let cur = -1;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">✉️ ${en ? "The Journey of a Transaction" : "一笔交易的旅程"}</div>
      <div class="journey" id="jy"></div>
      <div class="demo-btns">
        <button class="demo-btn" id="jy-next">▶ ${en ? "Next step" : "下一步"}</button>
        <button class="demo-btn" id="jy-reset">${en ? "Reset" : "重置"}</button>
      </div>
      <div class="demo-meta" id="jy-msg">${en ? "Click “Next step” to follow this transaction through each stage." : "点“下一步”，跟随这笔交易走过每个阶段。"}</div>
    </div>`;

  const jy = root.querySelector("#jy");
  jy.innerHTML = steps.map((s, i) =>
    `<div class="jstep"><span class="jn">${i + 1}</span><div><div class="jt">${s.t}</div><div class="jd">${s.d}</div></div></div>`).join("");
  const els = [...jy.querySelectorAll(".jstep")];
  const msg = root.querySelector("#jy-msg");
  const next = root.querySelector("#jy-next");

  function paint() {
    els.forEach((e, i) => { e.classList.toggle("active", i === cur); e.classList.toggle("done", i < cur); });
  }
  next.addEventListener("click", () => {
    if (cur < steps.length - 1) {
      cur++;
      paint();
      if (cur === steps.length - 1) { msg.textContent = en ? "✓ This transaction is now firmly nailed to the chain—the more confirmations, the more impossible to change." : "✓ 这笔交易已牢牢钉在链上——确认越多，越不可能被改。"; next.disabled = true; }
      else msg.textContent = steps[cur].t;
    }
  });
  root.querySelector("#jy-reset").addEventListener("click", () => {
    cur = -1; paint(); next.disabled = false; msg.textContent = en ? "Click “Next step” to follow this transaction through each stage." : "点“下一步”，跟随这笔交易走过每个阶段。";
  });
  paint();
}
