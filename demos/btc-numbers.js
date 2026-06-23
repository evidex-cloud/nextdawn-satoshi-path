// 交互演示：关键数字速查表（可搜索）
// 比特币原生应该烂熟于心的一组数字。输入关键词过滤。

export default function mount(root, lang) {
  const en = lang === "en";
  const ROWS = [
    [en ? "Maximum supply" : "最大供应量", en ? "21,000,000 BTC (precisely 20,999,999.9769)" : "21,000,000 BTC（精确 20,999,999.9769）"],
    [en ? "Smallest unit (satoshi)" : "最小单位（聪 satoshi）", en ? "0.00000001 BTC = 1 sat" : "0.00000001 BTC = 1 sat"],
    [en ? "1 BTC equals" : "1 BTC 等于", en ? "100,000,000 sats" : "100,000,000 聪"],
    [en ? "Current block subsidy (epoch 5)" : "当前出块补贴（第 5 期）", en ? "3.125 BTC / block" : "3.125 BTC / 区块"],
    [en ? "Average block time" : "平均出块时间", en ? "~10 minutes (target 600 seconds)" : "约 10 分钟（目标 600 秒）"],
    [en ? "Difficulty adjustment period" : "难度调整周期", en ? "every 2,016 blocks (~2 weeks)" : "每 2,016 个区块（约 2 周）"],
    [en ? "Halving period" : "减半周期", en ? "every 210,000 blocks (~4 years)" : "每 210,000 个区块（约 4 年）"],
    [en ? "Next halving (epoch 6)" : "下次减半（第 6 期）", en ? "~April 2028, subsidy drops to 1.5625 BTC" : "约 2028 年 4 月，补贴降到 1.5625 BTC"],
    [en ? "Last satoshi mined" : "最后一聪挖出", en ? "~year 2140, after which miners rely on fees only" : "约 2140 年，此后矿工只靠手续费"],
    [en ? "Block header size" : "区块头大小", en ? "80 bytes" : "80 字节"],
    [en ? "Block weight limit" : "区块权重上限", en ? "4,000,000 weight units (WU) ≈ 1.7–2 MB" : "4,000,000 权重单位（WU）≈ 1.7–2 MB"],
    [en ? "Base layer throughput" : "基础层吞吐", en ? "~7 TPS" : "约 7 TPS"],
    [en ? "Genesis block date" : "创世区块日期", en ? "January 3, 2009" : "2009 年 1 月 3 日"],
    [en ? "SegWit activation" : "SegWit 激活", en ? "August 24, 2017 (block 481,824)" : "2017 年 8 月 24 日（区块 481,824）"],
    [en ? "Taproot activation" : "Taproot 激活", en ? "November 14, 2021 (block 709,632)" : "2021 年 11 月 14 日（区块 709,632）"],
    [en ? "Nonce length" : "nonce 长度", en ? "32 bits (~4.3 billion values)" : "32 位（约 43 亿种）"],
    [en ? "Private key length" : "私钥长度", en ? "256 bits" : "256 位"],
    [en ? "UTXO set size (2026)" : "UTXO 集规模（2026）", en ? "~80 million–100 million UTXOs" : "约 8,000 万–1 亿个 UTXO"],
    [en ? "Coinbase maturity" : "coinbase 成熟期", en ? "100 confirmations" : "100 个确认"],
    [en ? "BIP derivation path" : "BIP 派生路径", "m / purpose' / coin' / account' / change / index"],
    [en ? "Address prefixes" : "地址前缀", "1=P2PKH · 3=P2SH · bc1q=SegWit · bc1p=Taproot"],
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">📊 ${en ? "Key numbers cheat sheet · know these cold as a Bitcoiner" : "关键数字速查 · 比特币原生该烂熟于心"}</div>
      <input class="demo-inp" id="bn-q" placeholder="${en ? "Search: e.g. halving / block / sat / SegWit …" : "搜索：如 减半 / 区块 / 聪 / SegWit …"}" spellcheck="false" />
      <div id="bn-list" style="margin-top:10px"></div>
    </div>`;

  const q = root.querySelector("#bn-q");
  const list = root.querySelector("#bn-list");
  function render() {
    const kw = q.value.trim().toLowerCase();
    const rows = ROWS.filter((r) => !kw || (r[0] + r[1]).toLowerCase().includes(kw));
    list.innerHTML = rows.length
      ? rows.map((r) => `<div class="mp-tx"><span>${r[0]}</span><span class="fr" style="text-align:right">${r[1]}</span></div>`).join("")
      : `<div class="demo-meta">${en ? "No matching entries." : "没有匹配的条目。"}</div>`;
  }
  q.addEventListener("input", render);
  render();
}
