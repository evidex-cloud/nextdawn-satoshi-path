// 交互演示：原始交易解码器
// 真正解析一串原始交易十六进制：版本 / SegWit标记 / varint / 逐个输入输出 / 见证 / locktime，
// 并识别脚本类型、计算 vByte。这是把"读懂裸交易"做成可玩工具。

const reverseHex = (h) => (h.match(/../g) || []).reverse().join("");

function detectType(spk, en) {
  if (/^76a914[0-9a-f]{40}88ac$/.test(spk)) return en ? "P2PKH (1… legacy)" : "P2PKH（1… 传统）";
  if (/^a914[0-9a-f]{40}87$/.test(spk)) return en ? "P2SH (3…)" : "P2SH（3…）";
  if (/^0014[0-9a-f]{40}$/.test(spk)) return en ? "P2WPKH (bc1q… native SegWit)" : "P2WPKH（bc1q… 原生SegWit）";
  if (/^0020[0-9a-f]{64}$/.test(spk)) return en ? "P2WSH (bc1q…)" : "P2WSH（bc1q…）";
  if (/^5120[0-9a-f]{64}$/.test(spk)) return en ? "P2TR (bc1p… Taproot)" : "P2TR（bc1p… Taproot）";
  if (/^6a/.test(spk)) return en ? "OP_RETURN (embedded data)" : "OP_RETURN（嵌入数据）";
  return en ? "Other / unknown" : "其它 / 未知";
}

function cursor(hex) {
  let p = 0;
  const api = {
    read(bytes) { const s = hex.substr(p, bytes * 2); p += bytes * 2; return s; },
    int(bytes) { const s = hex.substr(p, bytes * 2); p += bytes * 2; let n = 0; for (let i = 0; i < bytes; i++) n += parseInt(s.substr(i * 2, 2), 16) * Math.pow(256, i); return n; },
    big8() { const s = hex.substr(p, 16); p += 16; let n = 0n; for (let i = 0; i < 8; i++) n += BigInt(parseInt(s.substr(i * 2, 2), 16)) * (256n ** BigInt(i)); return n; },
    varint() { const f = parseInt(hex.substr(p, 2), 16); p += 2; if (f < 0xfd) return f; if (f === 0xfd) return api.int(2); if (f === 0xfe) return api.int(4); return Number(api.big8()); },
    pos() { return p / 2; },
  };
  return api;
}

function parse(hexRaw, en) {
  const hex = hexRaw.trim().toLowerCase().replace(/[^0-9a-f]/g, "");
  if (hex.length < 20) throw new Error(en ? "Hex too short, doesn't look like a transaction" : "十六进制太短，不像一笔交易");
  const c = cursor(hex);
  const version = c.int(4);
  let segwit = false;
  if (hex.substr(c.pos() * 2, 4) === "0001") { segwit = true; c.read(2); }
  const nin = c.varint();
  const inputs = [];
  for (let i = 0; i < nin; i++) {
    const prev = reverseHex(c.read(32));
    const vout = c.int(4);
    const ssLen = c.varint();
    const ss = c.read(ssLen);
    const seq = c.read(4);
    inputs.push({ prev, vout, ssLen, ss, seq });
  }
  const nout = c.varint();
  const outputs = [];
  for (let i = 0; i < nout; i++) {
    const sats = c.big8();
    const spkLen = c.varint();
    const spk = c.read(spkLen);
    outputs.push({ sats, type: detectType(spk, en) });
  }
  const witStart = c.pos();
  const witnesses = [];
  if (segwit) {
    for (let i = 0; i < nin; i++) {
      const items = c.varint();
      const arr = [];
      for (let j = 0; j < items; j++) { const len = c.varint(); c.read(len); arr.push(len); }
      witnesses.push(arr);
    }
  }
  const witEnd = c.pos();
  const locktime = c.int(4);

  const total = hex.length / 2;
  const witTotal = segwit ? 2 + (witEnd - witStart) : 0;
  const base = total - witTotal;
  const weight = base * 4 + witTotal;
  const vsize = Math.ceil(weight / 4);
  return { version, segwit, inputs, outputs, witnesses, locktime, total, weight, vsize };
}

// 用构造器生成保证合法的样例（避免手抄出错）
function le(n, bytes) { let s = ""; for (let i = 0; i < bytes; i++) s += (Math.floor(n / Math.pow(256, i)) % 256).toString(16).padStart(2, "0"); return s; }
function vi(n) { return n < 0xfd ? n.toString(16).padStart(2, "0") : "fd" + le(n, 2); }
function samples() {
  const prev = "7b1eabe0209b1fe794124575ef807057c77ada2138ae4fa8d6c4de0398a14f3f";
  const h20 = "751e76e8199196d454941c45d1b3a323f1433bd6";
  const sig = "30440220" + "a".repeat(64) + "0220" + "b".repeat(64) + "01"; // 71 字节
  const pub = "02" + "c".repeat(64); // 33 字节
  const p2wpkh = "0014" + h20, p2pkh = "76a914" + h20 + "88ac";
  const segwit = "02000000" + "0001" + "01" + prev + "00000000" + "00" + "ffffffff" +
    "02" + le(1000000, 8) + vi(p2wpkh.length / 2) + p2wpkh + le(2000, 8) + vi(p2pkh.length / 2) + p2pkh +
    "02" + vi(sig.length / 2) + sig + vi(pub.length / 2) + pub + "00000000";
  const ss = vi(sig.length / 2) + sig + vi(pub.length / 2) + pub;
  const legacy = "01000000" + "01" + prev + "00000000" + vi(ss.length / 2) + ss + "ffffffff" +
    "01" + le(5000000, 8) + vi(p2pkh.length / 2) + p2pkh + "00000000";
  return { segwit, legacy };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const S = samples();
  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🧬 ${en ? "Raw transaction decoder · read bare hex in plain words" : "原始交易解码器 · 把裸十六进制读成人话"}</div>
      <div class="demo-btns">
        <button class="demo-btn" id="td-segwit">${en ? "Load SegWit sample" : "载入 SegWit 样例"}</button>
        <button class="demo-btn" id="td-legacy">${en ? "Load legacy sample" : "载入 传统样例"}</button>
      </div>
      <textarea class="demo-ta" id="td-in" rows="3" spellcheck="false" style="font-family:var(--mono);font-size:12px"></textarea>
      <div class="demo-btns"><button class="demo-btn" id="td-go">▶ ${en ? "Decode" : "解码"}</button></div>
      <div class="demo-out demo-out-sm" id="td-out"></div>
      <p class="demo-tip">${en ? "You can also copy real hex from any transaction's 'Details → Raw' on mempool.space and paste it in to decode. The script type is recognized from the byte pattern of the scriptPubKey." : "也可以从 mempool.space 任意交易的\"Details → Raw\"复制真实十六进制粘进来解码。脚本类型由 scriptPubKey 的字节模式识别。"}</p>
    </div>`;

  const inEl = root.querySelector("#td-in");
  inEl.value = S.segwit;
  const decode = () => {
    const out = root.querySelector("#td-out");
    try {
      const t = parse(inEl.value, en);
      const lt = t.locktime === 0 ? (en ? "0 (no timelock, can be mined immediately)" : "0（无时间锁，可立即上链）")
        : (t.locktime < 500000000 ? t.locktime + (en ? " (block height lock)" : "（区块高度锁）") : t.locktime + (en ? " (Unix timestamp lock)" : "（Unix 时间戳锁）"));
      out.innerHTML =
        `${en ? "Version" : "版本"}：<b>${t.version}</b> · ${en ? "type" : "类型"}：<b>${t.segwit ? "SegWit" : (en ? "legacy" : "传统 legacy")}</b><br>` +
        `<br>${en ? "Inputs" : "输入"} ×${t.inputs.length}：<br>` +
        t.inputs.map((x, i) => `&nbsp;&nbsp;#${i} ${en ? "spends" : "花费"} ${x.prev.slice(0, 12)}…:${x.vout}　scriptSig ${x.ssLen === 0 ? (en ? "empty (in witness)" : "空（见证里）") : x.ssLen + (en ? " bytes" : " 字节")}　seq ${x.seq}`).join("<br>") +
        `<br><br>${en ? "Outputs" : "输出"} ×${t.outputs.length}：<br>` +
        t.outputs.map((o, i) => `&nbsp;&nbsp;#${i} <b>${Number(o.sats).toLocaleString()}</b> ${en ? "sats" : "聪"}（${(Number(o.sats) / 1e8).toFixed(8)} BTC）→ ${o.type}`).join("<br>") +
        (t.segwit ? `<br><br>${en ? "Witness" : "见证"}：${en ? "per input " : "每个输入 "}${t.witnesses.map((w) => w.length + (en ? " items" : " 项")).join(en ? ", " : "、")}` : "") +
        `<br><br>locktime：${lt}` +
        `<br>${en ? "Size" : "大小"}：<b>${t.total}</b> ${en ? "bytes" : "字节"} · ${en ? "weight" : "权重"} <b>${t.weight}</b> WU · <b>${t.vsize}</b> vB`;
    } catch (e) {
      out.innerHTML = `<span class="pill bad">${en ? "Parse failed" : "解析失败"}</span> ${e.message}${en ? " (make sure it's complete, correct raw transaction hex)" : "（请确认是完整、正确的原始交易十六进制）"}`;
    }
  };
  root.querySelector("#td-segwit").addEventListener("click", () => { inEl.value = S.segwit; decode(); });
  root.querySelector("#td-legacy").addEventListener("click", () => { inEl.value = S.legacy; decode(); });
  root.querySelector("#td-go").addEventListener("click", decode);
  decode();
}
