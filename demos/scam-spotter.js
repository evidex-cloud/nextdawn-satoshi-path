// 交互演示：骗局识别小游戏
// 一题一题判断"安全 / 危险"，即时反馈 + 解释，最后给分。强化"助记词永远不出门"的本能。

export default function mount(root, lang) {
  const en = lang === "en";
  const cards = [
    { t: en ? 'A wallet “official support” agent DMs you, says your account has a problem, and asks for your seed phrase to “unlock” it.' : '钱包"官方客服"私信你，说账户异常，要你提供助记词来"解锁"。', danger: true, why: en ? "Anyone asking for your seed phrase is a scammer, no exceptions." : "任何索要助记词的都是骗局，没有例外。" },
    { t: en ? "A friend sends you his receiving address and asks you to transfer to him." : "朋友把他的收款地址发给你，让你转账给他。", danger: false, why: en ? "An address is meant to be shared for receiving; verify it and you can send." : "地址本就用来公开收款；核对无误即可转。" },
    { t: en ? "A website says you won an airdrop and asks you to enter your seed phrase to claim it." : "一个网站说你中了空投，要你输入助记词来领取。", danger: true, why: en ? "Entering your seed phrase = handing over all your assets. Legitimate claims never need it." : "输入助记词＝交出全部资产。正规领取从不需要助记词。" },
    { t: en ? "Before sending, you verified the receiving address on your hardware wallet's own screen." : "转账前，你在硬件钱包的设备屏幕上核对了收款地址。", danger: false, why: en ? "Verifying against an isolated device's screen is exactly the right habit." : "以隔离设备的屏幕为准核对，正是好习惯。" },
    { t: en ? "You wrote your seed phrase on paper by hand and locked it in a drawer or safe at home." : "你把助记词手写在纸上，锁进家里的抽屉或保险柜。", danger: false, why: en ? "An offline physical backup is correct (engraving it on metal is even better)." : "离线物理备份是对的（刻在金属上更佳）。" },
    { t: en ? 'Someone sends you a “limited-time high-yield investment” that promises guaranteed profits.' : '有人发来"限时高收益理财"，承诺稳赚不赔。', danger: true, why: en ? "Urgency + guaranteed high returns = the classic scam playbook." : "紧迫感＋保证高回报＝经典骗局套路。" },
    { t: en ? "You took a photo of your seed phrase and saved it to your phone's gallery so you won't forget it." : "你把助记词拍照，存进手机相册以防忘记。", danger: true, why: en ? "Any online or digital storage can be stolen; never digitize your seed phrase." : "任何联网或数字化存储都可能被偷；助记词绝不数字化。" },
    { t: en ? "After pasting a receiving address, you checked the full address digit by digit." : "粘贴收款地址后，你逐位核对了完整地址。", danger: false, why: en ? "This defends against address poisoning and clipboard hijacking—don't just glance at the first and last characters." : "能防住地址投毒和剪贴板劫持——别只看头尾。" },
  ];

  let i = 0, score = 0;
  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🛡️ ${en ? "Scam Spotter · Train your instincts" : "骗局识别 · 练练你的本能"}</div>
      <div class="scn">
        <div class="scn-q" id="ss-q"></div>
        <div class="demo-btns">
          <button class="demo-btn" id="ss-safe">✅ ${en ? "Safe / Do it" : "安全 / 该做"}</button>
          <button class="demo-btn" id="ss-danger">⚠️ ${en ? "Dangerous / Don't" : "危险 / 别做"}</button>
        </div>
        <div class="scn-meta" id="ss-fb"></div>
        <div class="demo-btns" style="margin-top:10px"><button class="demo-btn" id="ss-next" style="display:none">${en ? "Next →" : "下一题 →"}</button></div>
      </div>
      <div class="scn-meta" id="ss-score"></div>
    </div>`;

  const q = root.querySelector("#ss-q");
  const fb = root.querySelector("#ss-fb");
  const next = root.querySelector("#ss-next");
  const safe = root.querySelector("#ss-safe");
  const danger = root.querySelector("#ss-danger");
  const scoreEl = root.querySelector("#ss-score");

  function show() {
    const c = cards[i];
    q.textContent = (i + 1) + ". " + c.t;
    fb.innerHTML = "";
    safe.disabled = danger.disabled = false;
    next.style.display = "none";
  }
  function answer(saidDanger) {
    const c = cards[i];
    const correct = saidDanger === c.danger;
    if (correct) score++;
    safe.disabled = danger.disabled = true;
    fb.innerHTML = `<span class="pill ${correct ? "ok" : "bad"}">${correct ? (en ? "Correct" : "答对了") : (en ? "Careful" : "要小心")}</span> ${c.why}`;
    next.style.display = i < cards.length - 1 ? "inline-block" : "none";
    scoreEl.textContent = i === cards.length - 1
      ? (en ? `Done: ${score} / ${cards.length} correct. Remember the iron rule—your seed phrase never leaves home.` : `做完啦：${score} / ${cards.length} 正确。记住那条铁律——助记词永远不出门。`)
      : (en ? `Progress ${i + 1}/${cards.length} · ${score} correct so far` : `进度 ${i + 1}/${cards.length} · 已答对 ${score}`);
  }
  safe.addEventListener("click", () => answer(false));
  danger.addEventListener("click", () => answer(true));
  next.addEventListener("click", () => { if (i < cards.length - 1) { i++; show(); } });
  show();
}
