// 交互演示：默克尔树
// 4 笔交易 → 叶子哈希 → 两两向上 → 默克尔根（真实 SHA-256）。
// 改一笔看根怎么变；点"证明"看一条默克尔证明只需要哪几个哈希。

async function H(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
const short = (h) => h.slice(0, 10) + "…";

export default function mount(root, lang) {
  const en = lang === "en";
  const txs = ["Alice→Bob 1 BTC", "Bob→Carol 2 BTC", "Carol→Dave 3 BTC", "Dave→Eve 4 BTC"];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🌳 ${en ? "Merkle Tree · A pile of transactions squeezed into one root" : "默克尔树 · 一堆交易压成一个根"}</div>
      <div class="mk">
        <div class="mk-row"><div class="mk-node mk-root" id="mk-root">${en ? "Root" : "根"}</div></div>
        <div class="mk-row"><div class="mk-node" id="mk-01">H01</div><div class="mk-node" id="mk-23">H23</div></div>
        <div class="mk-row" id="mk-leaves"></div>
      </div>
      <div class="demo-btns"><button class="demo-btn" id="mk-proof">${en ? "Prove the 3rd transaction (tx#2) is in the tree" : "证明第 3 笔（tx#2）在树里"}</button></div>
      <div class="demo-meta" id="mk-note">${en ? "Change any transaction and watch its fingerprint ripple all the way up, changing the Merkle root." : "改任意一笔交易，看它的指纹如何一路向上、改变默克尔根。"}</div>
    </div>`;

  const leavesEl = root.querySelector("#mk-leaves");
  const leaf = [];
  txs.forEach((t, i) => {
    const el = document.createElement("div");
    el.className = "mk-leaf";
    el.innerHTML = `<input class="mk-in" /><div class="mk-h" id="mk-h${i}"></div>`;
    const inp = el.querySelector(".mk-in");
    inp.value = t;
    inp.addEventListener("input", () => { txs[i] = inp.value; rebuild(i); });
    leavesEl.appendChild(el);
    leaf.push(el);
  });

  function clearHi() {
    root.querySelectorAll(".changed, .proof").forEach((e) => e.classList.remove("changed", "proof"));
  }

  async function rebuild(changed) {
    const h = await Promise.all(txs.map(H));
    const h01 = await H(h[0] + h[1]);
    const h23 = await H(h[2] + h[3]);
    const rt = await H(h01 + h23);
    h.forEach((x, i) => { root.querySelector("#mk-h" + i).textContent = short(x); });
    root.querySelector("#mk-01").textContent = short(h01);
    root.querySelector("#mk-23").textContent = short(h23);
    root.querySelector("#mk-root").textContent = (en ? "Root " : "根 ") + short(rt);
    clearHi();
    if (changed >= 0) {
      leaf[changed].classList.add("changed");
      (changed < 2 ? root.querySelector("#mk-01") : root.querySelector("#mk-23")).classList.add("changed");
      root.querySelector("#mk-root").classList.add("changed");
      root.querySelector("#mk-note").textContent = en ? ("Changed transaction #" + (changed + 1) + " → its fingerprint, the layer above it, and the root all changed.") : ("改了第 " + (changed + 1) + " 笔 → 它的指纹、它上层、以及根，全都变了。");
    }
  }

  root.querySelector("#mk-proof").addEventListener("click", () => {
    clearHi();
    leaf[2].classList.add("proof");
    root.querySelector("#mk-23").classList.add("proof");
    root.querySelector("#mk-root").classList.add("proof");
    root.querySelector("#mk-note").innerHTML = en
      ? 'With just <b>tx#2</b> itself plus two “sibling fingerprints”—<b>the fingerprint of tx#3</b> and <b>H01</b>—anyone can compute the root themselves and confirm tx#2 is in the tree, <b>without needing any other transactions</b>. This is a Merkle proof, exactly what light wallets rely on.'
      : '只要拿着 <b>tx#2</b> 本身，再加两个"兄弟指纹"——<b>tx#3 的指纹</b> 和 <b>H01</b>——任何人都能自己算到根、确认 tx#2 在树里，<b>无需其它交易</b>。这就是默克尔证明，轻钱包正是靠它。';
  });

  rebuild(-1);
}
