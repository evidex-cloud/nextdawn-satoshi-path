// 交互演示：脚本求值器（真实栈式执行）
// 锁定脚本要求"两数之和 = 15"。你在解锁脚本里填两个数当钥匙，
// 机器把"钥匙在前、锁在后"拼起来，从左往右真实地跑一遍，看栈怎么变、锁开不开。
// 这是真正的 Bitcoin Script 栈语义（这里用算术操作码演示）。

export default function mount(root, lang) {
  const en = lang === "en";
  const lock = ["OP_ADD", "15", "OP_EQUAL"]; // 锁：两数相加要等于 15

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${en ? "🔓 Script evaluator · real stack-based execution" : "🔓 脚本求值器 · 真实栈式执行"}</div>
      <div class="demo-meta">${en ? "Locking script (this lock's condition: two numbers sum to 15):" : "锁定脚本（这把锁的条件：两数之和 = 15）："}</div>
      <div class="sm-script" id="sm-lock"></div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Your unlocking script (the key: push two numbers onto the stack)" : "你的解锁脚本（钥匙：填两个数压栈）"}</label>
        <div class="demo-grid"><input class="demo-inp" id="sm-a" value="7" /><input class="demo-inp" id="sm-b" value="8" /></div>
      </div>
      <div class="demo-btns">
        <button class="demo-btn" id="sm-step">${en ? "▶ Step" : "▶ 单步执行"}</button>
        <button class="demo-btn" id="sm-run">${en ? "⏩ Run all" : "⏩ 一键运行"}</button>
        <button class="demo-btn" id="sm-reset">${en ? "Reset" : "重置"}</button>
      </div>
      <div class="demo-meta">${en ? "Combined script (key first, lock after, run left to right):" : "组合脚本（钥匙在前、锁在后，从左往右跑）："}</div>
      <div class="sm-script" id="sm-combined"></div>
      <div class="demo-meta">${en ? "Stack (bottom to top):" : "栈（从下往上）："}</div>
      <div class="sm-stack" id="sm-stack"></div>
      <div class="demo-meta" id="sm-fb"></div>
    </div>`;

  root.querySelector("#sm-lock").innerHTML = lock.map((t) => `<span class="sm-tok">${t}</span>`).join("");

  let program = [], stack = [], idx = 0, done = false;

  function render() {
    root.querySelector("#sm-combined").innerHTML = program.map((t, i) =>
      `<span class="sm-tok ${i < idx ? "done" : ""} ${i === idx && !done ? "active" : ""}">${t}</span>`).join("");
    root.querySelector("#sm-stack").innerHTML = stack.map((v) => `<span class="sm-cell">${v}</span>`).join("");
  }
  function build() {
    const a = parseInt(root.querySelector("#sm-a").value, 10) || 0;
    const b = parseInt(root.querySelector("#sm-b").value, 10) || 0;
    program = [String(a), String(b), ...lock];
    stack = []; idx = 0; done = false;
    render();
    root.querySelector("#sm-fb").textContent = en ? "Click “Step” to go one at a time, or “Run all”." : "点“单步执行”逐步看，或“一键运行”。";
  }
  function step() {
    if (done || idx >= program.length) { finish(); return; }
    const tok = program[idx];
    if (tok === "OP_ADD") { const y = stack.pop(), x = stack.pop(); stack.push(x + y); }
    else if (tok === "OP_SUB") { const y = stack.pop(), x = stack.pop(); stack.push(x - y); }
    else if (tok === "OP_EQUAL") { const y = stack.pop(), x = stack.pop(); stack.push(x === y ? 1 : 0); }
    else if (tok === "OP_DUP") { stack.push(stack[stack.length - 1]); }
    else { stack.push(parseInt(tok, 10)); }
    idx++;
    render();
    if (idx >= program.length) finish();
  }
  function finish() {
    done = true;
    render();
    const ok = stack.length > 0 && stack[stack.length - 1] !== 0;
    root.querySelector("#sm-fb").innerHTML = ok
      ? (en ? `<span class="pill ok">✓ Top of stack is true → lock opens</span> Your key unlocked this UTXO's lock; the spend is valid.` : `<span class="pill ok">✓ 栈顶为真 → 锁打开</span> 这枚 UTXO 的锁被你的钥匙解开了，花费有效。`)
      : (en ? `<span class="pill bad">✗ Top of stack is false → rejected</span> The key doesn't satisfy the lock's condition; the spend is invalid.` : `<span class="pill bad">✗ 栈顶为假 → 拒绝</span> 钥匙不满足锁的条件，花费无效。`);
  }

  root.querySelector("#sm-step").addEventListener("click", () => { if (done || program.length === 0) build(); if (idx < program.length) step(); });
  root.querySelector("#sm-run").addEventListener("click", () => { build(); while (!done && idx < program.length) step(); finish(); });
  root.querySelector("#sm-reset").addEventListener("click", build);
  root.querySelector("#sm-a").addEventListener("input", build);
  root.querySelector("#sm-b").addEventListener("input", build);
  build();
}
