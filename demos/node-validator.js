// 交互演示：当一回节点
// 来一批区块/交易，你按共识规则判断"接受还是拒绝"。体会"每个节点独立验证、不信任任何人"。

export default function mount(root, lang) {
  const en = lang === "en";
  const cards = [
    { t: en ? "A block claims to pay itself a 100 BTC block reward (current rules only allow 3.125)." : "一个区块声称给自己发了 100 BTC 的出块奖励（当前规则只允许 3.125）。", valid: false, why: en ? "Over-issuance, violating the consensus rules—every node rejects it on its own." : "超额发行，违反共识规则——每个节点都会各自拒绝。" },
    { t: en ? "An ordinary transfer: valid signature, sufficient balance, correct format." : "一笔普通转账：签名有效、余额充足、格式正确。", valid: true, why: en ? "A valid transaction—accept it and place it in the mempool." : "合法交易，接受并放进待打包池。" },
    { t: en ? "A transaction spends coins the ledger shows the same person already spent (double-spend)." : "一笔交易花的币，账本显示同一个人早就花掉了（双花）。", valid: false, why: en ? "Double-spend, reject." : "双花，拒绝。" },
    { t: en ? "A block: all transactions valid, reward amount correct, proof-of-work met, correctly linked to the previous block." : "一个区块：交易都合法、奖励金额正确、工作量达标、正确链接上一个区块。", valid: true, why: en ? "All rules pass—accept it and build on to the next block." : "全部规则通过，接受，并接力到下一个区块。" },
    { t: en ? "A block's hash doesn't meet the current difficulty (not enough work)." : "一个区块的哈希没达到当前难度（工作量不够）。", valid: false, why: en ? "Invalid proof-of-work, reject." : "工作量证明无效，拒绝。" },
    { t: en ? "A transaction's digital signature doesn't match the payer it claims to be from." : "一笔交易的数字签名和它声称的付款人对不上。", valid: false, why: en ? "Invalid signature, reject—you don't hold the private key for these funds." : "签名无效，拒绝——你没有这笔钱的私钥。" },
  ];

  let i = 0, score = 0;
  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🧑‍⚖️ ${en ? "Be a Node · Accept or reject?" : "当一回节点 · 接受还是拒绝？"}</div>
      <div class="scn">
        <div class="scn-q" id="nv-q"></div>
        <div class="demo-btns">
          <button class="demo-btn" id="nv-ok">✅ ${en ? "Accept" : "接受"}</button>
          <button class="demo-btn" id="nv-no">⛔ ${en ? "Reject" : "拒绝"}</button>
        </div>
        <div class="scn-meta" id="nv-fb"></div>
        <div class="demo-btns" style="margin-top:10px"><button class="demo-btn" id="nv-next" style="display:none">${en ? "Next →" : "下一个 →"}</button></div>
      </div>
      <div class="scn-meta" id="nv-score"></div>
    </div>`;

  const q = root.querySelector("#nv-q");
  const fb = root.querySelector("#nv-fb");
  const next = root.querySelector("#nv-next");
  const ok = root.querySelector("#nv-ok");
  const no = root.querySelector("#nv-no");
  const scoreEl = root.querySelector("#nv-score");

  function show() {
    const c = cards[i];
    q.textContent = (i + 1) + ". " + c.t;
    fb.innerHTML = "";
    ok.disabled = no.disabled = false;
    next.style.display = "none";
  }
  function answer(saidValid) {
    const c = cards[i];
    const correct = saidValid === c.valid;
    if (correct) score++;
    ok.disabled = no.disabled = true;
    fb.innerHTML = `<span class="pill ${correct ? "ok" : "bad"}">${correct ? (en ? "Correct" : "判对了") : (en ? "Think again" : "再想想")}</span> ${c.why}`;
    next.style.display = i < cards.length - 1 ? "inline-block" : "none";
    scoreEl.textContent = i === cards.length - 1
      ? (en ? `Done: ${score} / ${cards.length} correct. What you just did is exactly what every node on the network does independently—so no one can sneak anything past.` : `做完啦：${score} / ${cards.length} 正确。你刚做的事，正是全网每个节点都在独立做的——所以谁也别想蒙混过关。`)
      : (en ? `Progress ${i + 1}/${cards.length} · ${score} correct so far` : `进度 ${i + 1}/${cards.length} · 已判对 ${score}`);
  }
  ok.addEventListener("click", () => answer(true));
  no.addEventListener("click", () => answer(false));
  next.addEventListener("click", () => { if (i < cards.length - 1) { i++; show(); } });
  show();
}
