// 交互演示：交易大小与手续费估算器
// 调输入/输出个数、费率，切换是否用 SegWit 地址，看 vByte 大小和手续费怎么变。
// 大小是粗略经验值，用于建立直觉。

export default function mount(root, lang) {
  const en = lang === "en";
  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">${en ? "📐 Transaction size & fee estimator" : "📐 交易大小与手续费估算器"}</div>
      <div class="demo-block">
        <label class="demo-label">${en ? "Number of inputs (UTXOs spent):" : "输入（花掉的 UTXO）个数："}<b id="fe-in">2</b></label>
        <input class="demo-slider" id="fe-inputs" type="range" min="1" max="10" step="1" value="2" />
        <label class="demo-label" style="margin-top:12px">${en ? "Number of outputs:" : "输出个数："}<b id="fe-out">2</b></label>
        <input class="demo-slider" id="fe-outputs" type="range" min="1" max="4" step="1" value="2" />
        <label class="demo-label" style="margin-top:12px">${en ? "Fee rate:" : "费率："}<b id="fe-rate">10</b> sat/vB</label>
        <input class="demo-slider" id="fe-feerate" type="range" min="1" max="100" step="1" value="10" />
        <label class="demo-switch" style="margin-top:12px"><input type="checkbox" id="fe-segwit" checked /> ${en ? "Use a Segregated Witness address (SegWit, with witness discount)" : "用隔离见证地址（SegWit，享见证折扣）"}</label>
      </div>
      <div class="demo-block">
        <div class="bar2"><span class="lab">${en ? "Legacy" : "传统 legacy"}</span><span class="track"><span class="fill" id="fe-bar-l" style="background:var(--muted)"></span></span><span class="val" id="fe-v-l"></span></div>
        <div class="bar2"><span class="lab">SegWit</span><span class="track"><span class="fill" id="fe-bar-s" style="background:var(--orange)"></span></span><span class="val" id="fe-v-s"></span></div>
        <div class="demo-meta" id="fe-fee"></div>
      </div>
      <p class="demo-tip">${en ? "More inputs and legacy addresses make transactions bigger and more expensive; the SegWit witness discount makes the same transaction smaller in vBytes. Fee = vBytes × fee rate." : "输入越多、用传统地址，交易越大越贵；SegWit 见证折扣让同样的交易 vByte 更小。手续费 = vByte × 费率。"}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const vsize = (inputs, outputs, seg) => 11 + inputs * (seg ? 68 : 148) + outputs * 31;

  function upd() {
    const ni = +$("#fe-inputs").value, no = +$("#fe-outputs").value, rate = +$("#fe-feerate").value, seg = $("#fe-segwit").checked;
    $("#fe-in").textContent = ni; $("#fe-out").textContent = no; $("#fe-rate").textContent = rate;
    const vL = vsize(ni, no, false), vS = vsize(ni, no, true), maxv = Math.max(vL, vS);
    $("#fe-bar-l").style.width = (vL / maxv * 100) + "%"; $("#fe-v-l").textContent = vL + " vB";
    $("#fe-bar-s").style.width = (vS / maxv * 100) + "%"; $("#fe-v-s").textContent = vS + " vB";
    const v = seg ? vS : vL, fee = v * rate;
    $("#fe-fee").innerHTML = en
      ? "Current choice (" + (seg ? "SegWit" : "legacy") + ", " + ni + " inputs / " + no + " outputs): size <b>" + v +
        " vB</b> × " + rate + " sat/vB = <b>" + fee.toLocaleString() + " sats</b> fee (" + (fee / 1e8).toFixed(8) + " BTC)."
      : "当前选择（" + (seg ? "SegWit" : "传统") + "，" + ni + " 输入 / " + no + " 输出）：大小 <b>" + v +
        " vB</b> × " + rate + " sat/vB = <b>" + fee.toLocaleString() + " 聪</b> 手续费（" + (fee / 1e8).toFixed(8) + " BTC）。";
  }
  ["#fe-inputs", "#fe-outputs", "#fe-feerate"].forEach((s) => $(s).addEventListener("input", upd));
  $("#fe-segwit").addEventListener("change", upd);
  upd();
}
