// 交互演示：软分叉 vs 硬分叉
// 选一种分叉，让新版矿工出一个"新规则"区块，看没升级的老节点和升级后的新节点分别怎么反应。

export default function mount(root, lang) {
  const en = lang === "en";
  let type = "soft";

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🍴 ${en ? "Soft fork vs hard fork · do old nodes accept it" : "软分叉 vs 硬分叉 · 老节点认不认"}</div>
      <label class="demo-switch"><input type="radio" name="fk" id="fk-soft" checked /> ${en ? "Soft fork (tightens rules, backward-compatible)" : "软分叉（收紧规则，向后兼容）"}</label>
      <label class="demo-switch"><input type="radio" name="fk" id="fk-hard" /> ${en ? "Hard fork (loosens / changes rules, incompatible)" : "硬分叉（放宽 / 改变规则，不兼容）"}</label>
      <div class="demo-btns"><button class="demo-btn" id="fk-go">▶ ${en ? "A new-version miner produces a “new-rules” block" : "新版矿工出一个“新规则”区块"}</button></div>
      <div class="cust">
        <div class="cust-cell"><h5>${en ? "Un-upgraded old node" : "没升级的老节点"}</h5><div id="fk-old">—</div></div>
        <div class="cust-cell"><h5>${en ? "Upgraded new node" : "升级后的新节点"}</h5><div id="fk-new">—</div></div>
      </div>
      <div class="scn-meta" id="fk-take">${en ? "Pick a fork type and click the button to see how old / new nodes each react." : "选一种分叉，点按钮看老 / 新节点分别怎么反应。"}</div>
    </div>`;

  root.querySelector("#fk-soft").addEventListener("change", () => { type = "soft"; });
  root.querySelector("#fk-hard").addEventListener("change", () => { type = "hard"; });
  const pill = (ok, t) => `<span class="pill ${ok ? "ok" : "bad"}">${ok ? (en ? "✓ Accept" : "✓ 接受") : (en ? "✗ Reject" : "✗ 拒绝")}</span> ${t}`;

  root.querySelector("#fk-go").addEventListener("click", () => {
    if (type === "soft") {
      root.querySelector("#fk-old").innerHTML = pill(true, en ? "The new block still looks valid under the old rules" : "新区块在老规则看来依然合法");
      root.querySelector("#fk-new").innerHTML = pill(true, en ? "Conforms to the stricter new rules" : "符合更严的新规则");
      root.querySelector("#fk-take").innerHTML = en ? "Soft fork: the new rules are a <b>subset</b> of the old rules (stricter). Old nodes still accept the new block → <b>no split</b>, the whole network upgrades smoothly (SegWit and Taproot were both soft forks)." : "软分叉：新规则是老规则的<b>子集</b>（更严）。老节点照样接受新块 → <b>不分裂</b>，全网平滑升级（SegWit、Taproot 都是软分叉）。";
    } else {
      root.querySelector("#fk-old").innerHTML = pill(false, en ? "The new block violates the old rules and is rejected" : "新区块违反老规则，被拒绝");
      root.querySelector("#fk-new").innerHTML = pill(true, en ? "Conforms to the new rules" : "符合新规则");
      root.querySelector("#fk-take").innerHTML = en ? "Hard fork: the new rules <b>loosen or change</b> the old rules. Old nodes reject the new block → the two groups of nodes follow their own chains → the <b>chain splits</b> into two (like Bitcoin Cash, BCH, in 2017)." : "硬分叉：新规则<b>放宽或改变</b>了老规则。老节点拒绝新块 → 两拨节点各走各的链 → <b>链分裂</b>成两条（如 2017 年的比特币现金 BCH）。";
    }
  });
}
