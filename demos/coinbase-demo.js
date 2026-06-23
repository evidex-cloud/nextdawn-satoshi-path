// 交互演示：币基交易（coinbase）
// 拖动区块高度，看该区块的出块补贴（按减半）、矿工总收入、以及 coinbase 的特殊结构。

export default function mount(root, lang) {
  const en = lang === "en";
  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🪙 ${en ? "Coinbase transaction · how new coins are born" : "币基交易 · 新币如何诞生"}</div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Block height" : "区块高度"}：<b id="cb-h">840000</b></label>
        <input class="demo-slider" id="cb-height" type="range" min="0" max="1300000" step="10000" value="840000" />
      </div>
      <div class="detail" id="cb-detail"></div>
      <p class="demo-tip">${en ? "The first transaction in every block is the coinbase: it has no real input (it creates new coins from nothing), and its output = the block subsidy + the fees of all transactions in the block, all going to the miner. This is the <b>only</b> way new BTC enters circulation. The subsidy halves over time; coins received by a coinbase must wait 100 confirmations (the maturity period) before they can be spent." : "每个区块的第一笔交易就是 coinbase：它没有真正的输入（凭空创造新币），输出 = 出块补贴 + 该区块所有交易的手续费，全归矿工。这是新 BTC 进入流通的<b>唯一</b>途径。补贴按减半递减；coinbase 收到的币要等 100 个确认（成熟期）才能花。"}</p>
    </div>`;

  const h = root.querySelector("#cb-height");
  const FEES = 0.08; // 示意：该区块手续费合计
  function upd() {
    const height = parseInt(h.value, 10);
    const era = Math.floor(height / 210000);
    const subsidy = 50 / Math.pow(2, era);
    root.querySelector("#cb-h").textContent = height.toLocaleString();
    root.querySelector("#cb-detail").innerHTML =
      `<div class="dk">${en ? "Halving epoch" : "减半周期"}</div><div>${en ? "Epoch " + era + " (blocks " + (era * 210000).toLocaleString() + "–" + ((era + 1) * 210000 - 1).toLocaleString() + ")" : "第 " + era + " 期（区块 " + (era * 210000).toLocaleString() + "–" + ((era + 1) * 210000 - 1).toLocaleString() + "）"}</div>
       <div class="dk" style="margin-top:8px">${en ? "Block subsidy (new coins)" : "出块补贴（新币）"}</div><div><b>${parseFloat(subsidy.toFixed(8))}</b> BTC</div>
       <div class="dk" style="margin-top:8px">${en ? "+ block fees (illustrative)" : "+ 区块手续费（示意）"}</div><div>${FEES} BTC</div>
       <div class="dk" style="margin-top:8px">${en ? "= miner total revenue" : "= 矿工总收入"}</div><div><b>${parseFloat((subsidy + FEES).toFixed(8))}</b> BTC</div>
       <div class="dk" style="margin-top:10px">${en ? "What's special about the coinbase" : "coinbase 的特殊之处"}</div>
       <div>${en ? "· The input is “empty”: it references no UTXO, minting coins from nothing<br>· The input data contains the <b>block height</b> (BIP34) and the miner-adjustable <b>extranonce</b> (callback to Stage 5.1)<br>· These new coins can only be spent after <b>100 confirmations</b> (the maturity period)" : "· 输入是\"空的\"：不引用任何 UTXO，凭空铸币<br>· 输入数据里写着<b>区块高度</b>（BIP34）和矿工可调的 <b>extranonce</b>（回扣阶段 5.1）<br>· 这些新币要 <b>100 个确认</b>后（成熟期）才能花"}</div>`;
  }
  h.addEventListener("input", upd);
  upd();
}
