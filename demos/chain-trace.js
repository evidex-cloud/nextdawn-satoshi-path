// 交互演示：链上隐私（假名不是匿名）
// 一笔花掉 3 个 UTXO 的交易，链上分析师会用"共同输入"启发式推断它们同属一人；
// 切到 CoinJoin，多人输入混在一起，这个推断被打断。

export default function mount(root, lang) {
  const en = lang === "en";
  let coinjoin = false;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🕵️ ${en ? "On-Chain Privacy · Pseudonymous Isn’t Anonymous" : "链上隐私 · 假名不是匿名"}</div>
      <label class="demo-switch"><input type="checkbox" id="ct-cj" /> ${en ? "Use CoinJoin (mix the transaction with strangers)" : "使用 CoinJoin（和陌生人混合交易）"}</label>
      <div class="demo-meta" style="margin-top:8px">${en ? "You’re about to spend 3 UTXOs at once. When a chain analyst sees this transaction, what will they infer?" : "你要一次花掉 3 个 UTXO。链上分析师看到这笔交易，会推断出什么？"}</div>
      <div class="detail" id="ct-detail"></div>
      <p class="demo-tip">${en ? "By default, the multiple inputs of one transaction are assumed to belong to the same person (the common-input heuristic)—so your addresses get linked together. CoinJoin lets multiple people pool their inputs into one transaction with equal-value outputs, breaking this inference." : "默认下，一笔交易的多个输入会被假定\"同属一人\"（共同输入启发式）——你的地址因此被串联。CoinJoin 让多人把输入凑进同一笔、产出等额输出，打断这种推断。"}</p>
    </div>`;

  root.querySelector("#ct-cj").addEventListener("change", (e) => { coinjoin = e.target.checked; paint(); });
  function paint() {
    const d = root.querySelector("#ct-detail");
    d.innerHTML = coinjoin
      ? (en
          ? '<div>👁️ The analyst sees: <b>10 inputs</b> (from many users), <b>10 equal-value outputs</b></div>' +
            '<div style="margin-top:6px">🔗 Inference: <span class="pill ok">hard to determine</span> which output maps to which input is unclear, and the “same person” assumption is broken.</div>' +
            '<div style="margin-top:6px" class="dk">Combine this with “use a fresh address each time, avoid pointlessly merging UTXOs” and privacy improves further.</div>'
          : '<div>👁️ 分析师看到：<b>10 个输入</b>（来自多名用户）、<b>10 个等额输出</b></div>' +
            '<div style="margin-top:6px">🔗 推断：<span class="pill ok">难以确定</span> 哪个输出对应哪个输入说不清，"同属一人"的假设被打断。</div>' +
            '<div style="margin-top:6px" class="dk">再配合"每次用新地址、避免无谓合并 UTXO"，隐私进一步提升。</div>')
      : (en
          ? '<div>👁️ The analyst sees: <b>3 inputs</b> (from your 3 addresses) flowing into one transaction</div>' +
            '<div style="margin-top:6px">🔗 Inference: <span class="pill bad">same person</span> your 3 addresses are linked, and past and future activity can be correlated and traced.</div>' +
            '<div style="margin-top:6px" class="dk">Once any one of those addresses is exposed at a KYC exchange, the whole trail points back to you.</div>'
          : '<div>👁️ 分析师看到：<b>3 个输入</b>（来自你 3 个地址）汇入同一笔交易</div>' +
            '<div style="margin-top:6px">🔗 推断：<span class="pill bad">同属一人</span> 你这 3 个地址被串联，过去和将来的活动可被关联追踪。</div>' +
            '<div style="margin-top:6px" class="dk">一旦其中某个地址在 KYC 交易所暴露，整串轨迹都对上了你。</div>');
  }
  paint();
}
