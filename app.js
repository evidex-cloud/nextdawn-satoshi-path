// Droplet Labs · 聪之路 · Satoshi Path —— 渲染器（双语 + 难度 + persona）
// 内容在 content/ 下；中文正文 stageX-id.js，英文正文 content/lessons/en/ 同名文件。
// UI 文案用 t(中,英)。难度 1/2/3 与 persona 标签在 manifest 里。

import { COURSE } from "./content/manifest.js?v=11"; // 改了 manifest 要随 app.js?v 一起 bump，破缓存

// 品牌 Logo —— Droplet Labs 水滴 + 内部网络节点，内联 SVG（无背景、随标题字号缩放）
const LOGO = `<svg class="hd-logo-svg" viewBox="0 0 100 118" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Droplet Labs"><defs><linearGradient id="dropletGrad" x1="22" y1="12" x2="80" y2="104" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#264a6e"/><stop offset=".55" stop-color="#3f74a6"/><stop offset="1" stop-color="#6ea3cf"/></linearGradient></defs><path d="M50 10C31 39 18 55 18 74c0 19 15 31 32 31s32-12 32-31C82 55 69 39 50 10Z" stroke="url(#dropletGrad)" stroke-width="3.4" stroke-linejoin="round"/><path d="M45 62 36 51 36 44M50 59V46M57 61 65 52" stroke="url(#dropletGrad)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="36" cy="42" r="2.7" fill="url(#dropletGrad)"/><circle cx="50" cy="43" r="2.7" fill="url(#dropletGrad)"/><circle cx="67" cy="50" r="2.7" fill="url(#dropletGrad)"/><path d="M47 62 58 68 58 80 47 86 36 80 36 68Z" stroke="url(#dropletGrad)" stroke-width="2.2" stroke-linejoin="round"/><path d="M36 68 47 74 58 68M47 86V74" stroke="url(#dropletGrad)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><path d="M64 45 66.4 50.2 72 52 66.4 53.8 64 59 61.6 53.8 56 52 61.6 50.2Z" fill="url(#dropletGrad)"/><path d="M32 92c9 7 27 7 36 0M36 98c7 4 21 4 28 0" stroke="url(#dropletGrad)" stroke-width="2.2" stroke-linecap="round"/></svg>`;

const app = document.getElementById("app");
const PKEY = "satoshi-path-v1";
const V = "10"; // 内容版本：改了 lessons/ 或 demos/ 后 +1，破除浏览器对动态 import 的缓存

/* ---------------- 状态 ---------------- */
function loadState() {
  try {
    return Object.assign({ done: {}, goal: null, lang: "zh" }, JSON.parse(localStorage.getItem(PKEY)) || {});
  } catch {
    return { done: {}, goal: null, lang: "zh" };
  }
}
function saveState(s) { localStorage.setItem(PKEY, JSON.stringify(s)); }
let state = loadState();

/* ---------------- i18n 助手 ---------------- */
const lang = () => state.lang === "en" ? "en" : "zh";
const t = (zh, en) => (lang() === "en" ? en : zh);
const L = (o, k) => (lang() === "en" && o[k + "En"] != null ? o[k + "En"] : o[k]);
const enModulePath = (m) => m.replace("./content/lessons/", "./content/lessons/en/");

const DIFF = { 1: ["基础", "Basic"], 2: ["进阶", "Intermediate"], 3: ["高级", "Advanced"] };
const diffLabel = (d) => t(DIFF[d][0], DIFF[d][1]);
const stars = (d) => `<span class="stars" title="${diffLabel(d)}">${"★".repeat(d)}<span class="off">${"★".repeat(3 - d)}</span></span>`;

/* ---------------- 工具 ---------------- */
const tierOf = (id) => COURSE.tiers.find((t) => t.id === id);
const readyLessons = () => COURSE.stages.flatMap((s) => s.lessons).filter((l) => l.status === "ready");
const findLesson = (id) => {
  for (const s of COURSE.stages) {
    const l = s.lessons.find((x) => x.id === id);
    if (l) return { lesson: l, stage: s };
  }
  return null;
};
const relevant = (lesson) => !state.goal || (lesson.personas || []).includes(state.goal);

/* ---------------- 极简 Markdown ---------------- */
function esc(s) { return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}
function md(text) {
  if (!text) return "";
  return text.trim().split(/\n\s*\n/).map((block) => {
    const b = block.trim();
    if (b.startsWith("### ")) return `<h4 class="subhead">${inline(b.slice(4))}</h4>`;
    if (b.startsWith("- ")) {
      const items = b.split("\n").map((l) => `<li>${inline(l.replace(/^-\s+/, ""))}</li>`).join("");
      return `<ul>${items}</ul>`;
    }
    if (b.startsWith("> ")) return `<blockquote>${inline(b.replace(/^>\s?/gm, ""))}</blockquote>`;
    return `<p>${inline(b)}</p>`;
  }).join("");
}

/* ---------------- 语言切换按钮（常驻右上角） ---------------- */
function renderLangToggle() {
  let el = document.getElementById("lang-toggle");
  if (!el) {
    el = document.createElement("button");
    el.id = "lang-toggle";
    document.body.appendChild(el);
    el.addEventListener("click", () => {
      state.lang = lang() === "en" ? "zh" : "en";
      saveState(state);
      renderLangToggle();
      render();
    });
  }
  el.textContent = lang() === "en" ? "中文" : "EN";
  el.setAttribute("aria-label", lang() === "en" ? "Switch to Chinese" : "切换到 English");
}

/* ---------------- 路由 ---------------- */
async function render() {
  const hash = location.hash.replace(/^#/, "");
  if (hash.startsWith("lesson/")) await renderLesson(hash.slice("lesson/".length));
  else renderRoadmap();
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", render);

/* ---------------- 视图：路线图 ---------------- */
function renderRoadmap() {
  const total = readyLessons().length;
  const doneN = readyLessons().filter((l) => state.done[l.id]).length;
  const pct = total ? Math.round((doneN / total) * 100) : 0;

  let html = `
    <header class="hd">
      <h1 class="hd-title"><span class="hd-logo">${LOGO}</span>${L(COURSE, "title")}</h1>
      <p class="hd-sub">${L(COURSE, "subtitle")}</p>
      <div class="hd-bar">
        <div class="progress">
          <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="progress-text">${t("已完成", "Completed")} ${doneN} / ${total} ${t("节", "lessons")} · ${pct}%</div>
        </div>
        <div class="goals" role="group" aria-label="${t("学习目标", "Learning goal")}">
          <span class="goals-label">${t("我的目标：", "My goal:")}</span>
          ${COURSE.goals.map((g) => `<button class="goal-chip" data-goal="${g.id}" aria-pressed="${state.goal === g.id}">${L(g, "label")}</button>`).join("")}
        </div>
      </div>
    </header>`;

  html += `
    <section class="philosophy">
      <h2 class="ph-title">${t("设计理念", "Design Philosophy")}</h2>
      <p class="ph-lead">${t("把比特币拆成一条<strong>从浅到深</strong>的主线，让任何零基础的人，都能一步步走到“能跑节点、读源码、亲手构造一笔交易”。", "Bitcoin laid out as one <strong>shallow-to-deep</strong> path, so anyone starting from zero can walk all the way to running a node, reading the source, and building a transaction by hand.")}</p>
      <div class="ph-grid">
        <div class="ph-card"><div class="ph-ic">🧭</div><h3>${t("一条主线", "One Path")}</h3><p>${t("11 个阶段、4 个深度层（入门 → 原理 → 系统 → 精通），后面的硬核都建立在前面的直觉之上。", "11 stages across 4 depth tiers (Beginner → Principles → Systems → Mastery); every hardcore part builds on earlier intuition.")}</p></div>
        <div class="ph-card"><div class="ph-ic">🔬</div><h3>${t("处处可玩", "Hands-On")}</h3><p>${t("每节配一个浏览器内交互演示，很多是真算——真实 SHA-256、ECDSA 签名、挖矿、默克尔证明。", "Every lesson has an in-browser interactive demo; many compute for real — true SHA-256, ECDSA signatures, mining, Merkle proofs.")}</p></div>
        <div class="ph-card"><div class="ph-ic">🧩</div><h3>${t("固定模板", "Fixed Template")}</h3><p>${t("直觉 → 原理（可折叠）→ 演示 → 类比 → 常见误解 → 自测 → 延伸，认知负担最小。", "Intuition → Mechanics (collapsible) → Demo → Analogy → Misconceptions → Quiz → Further reading. Minimal cognitive load.")}</p></div>
        <div class="ph-card"><div class="ph-ic">🔒</div><h3>${t("本地优先", "Local-First")}</h3><p>${t("进度只存在你自己的浏览器，纯本地、不上传，与比特币的自托管精神一致。", "Progress lives only in your own browser — fully local, never uploaded, in the spirit of self-custody.")}</p></div>
      </div>
    </section>`;

  if (total > 0 && doneN === total) {
    html += `<div class="done-banner">${t(`🎉 恭喜！你已读完整条「聪之路」——全部 ${total} 节，从“为什么需要比特币”到“用代码构造一笔交易”。`, `🎉 Congratulations! You've completed the entire Droplet Labs · Satoshi Path — all ${total} lessons, from “Why Bitcoin” to “build a transaction in code.”`)}</div>`;
  }

  let lastTier = null;
  for (const s of COURSE.stages) {
    if (s.tier !== lastTier) { html += `<div class="tier-head">${L(tierOf(s.tier), "label")}</div>`; lastTier = s.tier; }
    html += stageHTML(s);
  }
  app.innerHTML = `<div class="home">${html}</div>`;

  app.querySelectorAll("[data-goal]").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.goal = state.goal === btn.dataset.goal ? null : btn.dataset.goal;
      saveState(state);
      renderRoadmap();
    }));
  app.querySelectorAll("[data-open]").forEach((el) =>
    el.addEventListener("click", () => { location.hash = `lesson/${el.dataset.open}`; }));
}

function stageHTML(s) {
  const color = tierOf(s.tier).color;
  const ready = s.lessons.filter((l) => l.status === "ready");
  const stageDone = ready.length > 0 && ready.every((l) => state.done[l.id]);
  const chips = s.lessons.length
    ? s.lessons.map((l) => {
        const done = state.done[l.id];
        const rec = state.goal && relevant(l);
        const dim = state.goal && !relevant(l);
        return `
          <button class="chip ${dim ? "dim" : ""} ${rec ? "rec" : ""}" data-open="${l.id}">
            <span class="chip-mark ${done ? "done" : ""}">${done ? "✓" : ""}</span>
            <span class="chip-title">${L(l, "title")}</span>
            ${stars(l.difficulty)}
            ${rec ? `<span class="rec-badge">${t("推荐", "Pick")}</span>` : ""}
            <span class="chip-arrow">→</span>
          </button>`;
      }).join("")
    : `<div class="chip chip-soon"><span class="chip-mark"></span>${t("课程编写中…", "Coming soon…")}</div>`;

  return `
    <section class="stage ${stageDone ? "done" : ""}">
      <div class="stage-num" style="background:${color}">${stageDone ? "✓" : s.n}</div>
      <div class="stage-body">
        <div class="stage-title">${L(s, "title")}${stageDone ? `<span class="stage-done-badge">${t("已完成", "Done")}</span>` : ""}</div>
        <p class="stage-blurb">${L(s, "blurb")}</p>
        <div class="chips">${chips}</div>
      </div>
    </section>`;
}

/* ---------------- 左侧导航栏 ---------------- */
function sidebarHTML(currentId) {
  const total = readyLessons().length;
  const doneN = readyLessons().filter((l) => state.done[l.id]).length;
  const pct = total ? Math.round((doneN / total) * 100) : 0;
  let html = `<nav class="sidebar">
    <div class="sb-home" data-back><span class="hd-logo">${LOGO}</span>${L(COURSE, "title")}</div>
    <div class="sb-progress">${t("已完成", "Done")} ${doneN}/${total} · ${pct}%</div>`;
  for (const s of COURSE.stages) {
    const color = tierOf(s.tier).color;
    html += `<div class="sb-stage"><div class="sb-stage-h"><span class="n" style="background:${color}">${s.n}</span>${L(s, "title")}</div>`;
    html += s.lessons.length
      ? s.lessons.map((l) => {
          const dim = state.goal && !relevant(l);
          return `<div class="sb-lesson${l.id === currentId ? " active" : ""}${dim ? " dim" : ""}" data-go="${l.id}"><span class="sb-check">${state.done[l.id] ? "✓" : ""}</span><span class="sb-t">${L(l, "title")}</span>${stars(l.difficulty)}</div>`;
        }).join("")
      : `<div class="sb-lesson soon"><span class="sb-check"></span>${t("课程编写中…", "Coming soon…")}</div>`;
    html += `</div>`;
  }
  return html + `</nav>`;
}

/* ---------------- 视图：课程页 ---------------- */
async function renderLesson(id) {
  const hit = findLesson(id);
  if (!hit) { location.hash = ""; return; }

  let data, fellBack = false;
  try {
    if (lang() === "en") {
      try { data = (await import(enModulePath(hit.lesson.module) + "?v=" + V)).default; }
      catch { data = (await import(hit.lesson.module + "?v=" + V)).default; fellBack = true; }
    } else {
      data = (await import(hit.lesson.module + "?v=" + V)).default;
    }
  } catch (e) {
    app.innerHTML = `<button class="back" data-back>← ${t("返回路线图", "Back to roadmap")}</button>
      <div class="demo-warn">${t("课程加载失败", "Failed to load lesson")}：${esc(String(e))}</div>`;
    app.querySelectorAll("[data-back]").forEach((b) => b.addEventListener("click", () => { location.hash = ""; }));
    return;
  }

  const done = !!state.done[id];
  const prereq = (data.prereqs || []).map((p) => {
    const ph = findLesson(p);
    return ph ? `<a href="#lesson/${p}">${L(ph.lesson, "title")}</a>` : p;
  }).join(t("、", ", "));

  const seq = readyLessons();
  const si = seq.findIndex((l) => l.id === id);
  const prevL = seq[si - 1], nextL = seq[si + 1];
  const navHTML = `
    <div class="lsn-nav">
      ${prevL ? `<button class="navbtn" data-go="${prevL.id}">← ${t("上一课", "Prev")}<span>${L(prevL, "title")}</span></button>` : "<span></span>"}
      ${nextL ? `<button class="navbtn navbtn-next" data-go="${nextL.id}">${t("下一课", "Next")} →<span>${L(nextL, "title")}</span></button>` : "<span></span>"}
    </div>`;

  const SH = (icon, zh, en) => `<div class="section-h">${icon} ${t(zh, en)}</div>`;

  app.innerHTML = `
    <div class="lesson-layout">
      <button class="sb-toggle" data-sbtoggle>📚 ${t("课程目录", "Lessons")}</button>
      ${sidebarHTML(id)}
      <div class="lesson-main">
    <div class="breadcrumb"><a data-back>${L(COURSE, "title")}</a> › ${t("阶段", "Stage")} ${hit.stage.n} · ${L(hit.stage, "title")}</div>
    <h1 class="lsn-title">${L(data, "title") || data.title}<span class="diff-badge" title="${diffLabel(hit.lesson.difficulty)}">${stars(hit.lesson.difficulty)} ${diffLabel(hit.lesson.difficulty)}</span></h1>
    ${fellBack ? `<div class="fallback-note">${t("（本节英文版正在翻译中，暂以中文显示）", "(English version of this lesson is being translated; showing Chinese for now.)")}</div>` : ""}
    ${prereq ? `<div class="lsn-tag">${t("前置：", "Prerequisites: ")}${prereq}</div>` : ""}
    <div class="oneliner">${inline(data.oneLiner)}</div>

    <label class="depth-toggle"><input type="checkbox" id="depth" /> ${t("只看直觉版（隐藏「深入原理」）", "Intuition only (hide Mechanics)")}</label>

    <div class="section">${SH("🧠", "直觉解释", "Intuition")}${md(data.intuition)}</div>
    ${data.mechanics ? `<div class="section deep" id="mech">${SH("⚙️", "深入原理", "Mechanics")}${md(data.mechanics)}</div>` : ""}
    ${data.demo ? `<div class="section">${SH("🔬", "动手玩一玩", "Try It Yourself")}<div id="demo-mount"></div></div>` : ""}
    ${data.analogy ? `<div class="section">${SH("🪞", "类比", "Analogy")}${md(data.analogy)}</div>` : ""}
    ${(data.misconceptions || []).length ? `<div class="section">${SH("⚠️", "常见误解", "Common Misconceptions")}<ul class="miscon">${data.misconceptions.map((m) => `<li>${inline(m)}</li>`).join("")}</ul></div>` : ""}
    ${(data.quiz || []).length ? `<div class="section">${SH("✅", "自测", "Quick Quiz")}<div id="quiz"></div></div>` : ""}
    ${(data.further || []).length ? `<div class="section">${SH("📚", "延伸阅读", "Further Reading")}<div class="further">${data.further.map((f) => `<a href="${f.url}" target="_blank" rel="noopener">${f.label} ↗</a>`).join("")}</div></div>` : ""}

    <button class="complete ${done ? "done" : ""}" id="complete">${done ? t("✓ 已完成本节", "✓ Completed") : t("标记为已完成", "Mark as complete")}</button>
    ${navHTML}
      </div>
    </div>
  `;

  app.querySelectorAll("[data-back]").forEach((b) => b.addEventListener("click", () => { location.hash = ""; }));
  app.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => { location.hash = `lesson/${b.dataset.go}`; }));
  app.querySelector("[data-sbtoggle]")?.addEventListener("click", () => {
    app.querySelector(".lesson-layout")?.classList.toggle("sb-open");
  });
  app.querySelector(".sb-lesson.active")?.scrollIntoView({ block: "nearest" });

  const depth = app.querySelector("#depth");
  const mech = app.querySelector("#mech");
  if (depth && mech) depth.addEventListener("change", () => { mech.hidden = depth.checked; });

  if (data.demo) {
    const mountEl = app.querySelector("#demo-mount");
    try {
      const demo = (await import(`./demos/${data.demo}.js?v=${V}`)).default;
      demo(mountEl, lang());
    } catch (e) {
      mountEl.innerHTML = `<div class="demo-warn">${t("演示加载失败", "Demo failed to load")}：${esc(String(e))}</div>`;
    }
  }

  if ((data.quiz || []).length) renderQuiz(app.querySelector("#quiz"), data.quiz);

  const btn = app.querySelector("#complete");
  btn.addEventListener("click", () => {
    if (state.done[id]) return;
    state.done[id] = true;
    saveState(state);
    btn.classList.add("done");
    btn.textContent = t("✓ 已完成本节", "✓ Completed");
    if (readyLessons().every((l) => state.done[l.id])) {
      btn.insertAdjacentHTML("afterend", `<div class="done-banner" style="margin-top:14px">${t("🎉 你已读完整条「聪之路」！回到路线图，看看你点亮的全程。", "🎉 You've finished the entire Droplet Labs · Satoshi Path! Head back to the roadmap to see your whole journey lit up.")}</div>`);
    }
    const nb = app.querySelector(".navbtn-next");
    if (nb) nb.classList.add("pulse");
  });
}

function renderQuiz(root, quiz) {
  root.innerHTML = quiz.map((q, qi) => `
    <div class="quiz-q">
      <div class="quiz-stem">${qi + 1}. ${inline(q.q)}</div>
      <div class="quiz-opts">
        ${q.options.map((o, oi) => `<button class="quiz-opt" data-q="${qi}" data-o="${oi}">${inline(o)}</button>`).join("")}
      </div>
      <div class="quiz-explain" hidden data-explain="${qi}">${inline(q.explain || "")}</div>
    </div>`).join("");

  root.querySelectorAll(".quiz-opt").forEach((btn) =>
    btn.addEventListener("click", () => {
      const qi = +btn.dataset.q, oi = +btn.dataset.o;
      const q = quiz[qi];
      root.querySelectorAll(`.quiz-opt[data-q="${qi}"]`).forEach((b, i) => {
        b.disabled = true;
        if (i === q.answer) b.classList.add("correct");
      });
      if (oi !== q.answer) btn.classList.add("wrong");
      root.querySelector(`[data-explain="${qi}"]`).hidden = false;
    }));
}

/* ---------------- 启动 ---------------- */
renderLangToggle();
render();
