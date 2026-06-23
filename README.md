# NextDawn · 聪之路 · Satoshi Path

一个**本地优先、中英双语**的比特币学习工具：把比特币从浅到深拆成一条主线，让任何零基础的人都能一步步走到「能跑节点、读源码、亲手用代码构造一笔交易」。

灵感来自 [aipath](https://aipath.buynao.com/) 的「路线 → 阶段 → 例子 → 选择」体验。

> 🔗 **在线体验**：<https://evidex-cloud.github.io/nextdawn-satoshi-path/>

## 特性

- **一条主线，11 个阶段，48 节课**，分 4 个深度层（入门 → 原理 → 系统 → 精通），后面的硬核都建立在前面的直觉之上。
- **处处可玩**：每节课配一个浏览器内交互演示，很多是**真算**——真实 SHA-256、ECDSA 签名、找 nonce 挖矿、默克尔证明、裸交易逐字节解码。
- **固定模板，认知负担最小**：直觉 → 深入原理（先讲主干，再拆分支）→ 演示 → 类比 → 常见误解 → 自测 → 延伸阅读。
- **中英双语**：右上角随时切换 EN / 中文，每节课、每个演示都有英文版。
- **难度评级与学习目标**：每节标 ★ 基础 / ★★ 进阶 / ★★★ 高级；选好奇者 / 投资者 / 自托管者 / 开发者后，相关课高亮、无关课弱化。
- **本地优先**：进度只存在你自己浏览器的 `localStorage`，纯本地、不上传，与比特币的自托管精神一致。
- **纯静态、零依赖、无构建**：原生 HTML/CSS/JS（ES modules），没有后端、没有打包步骤。

## 本地运行

双击 **`launch.bat`**（需已装 Python），它会起本地服务器并打开 `http://localhost:8777/`。

或手动：

```bash
python -m http.server 8777
# 然后浏览器打开 http://localhost:8777/
```

> ⚠️ **请勿直接双击 `index.html`。** 演示用到 `crypto.subtle`，只在 `localhost` / `https` 这类「安全上下文」可用；课程内容也是按需 `import` 的，都需要一个服务器。部署到 GitHub Pages（https）后这些都自动满足。

## 目录结构

```
satoshi-path/
├─ index.html                 外壳（引样式与 app.js，含全站页脚）
├─ styles.css                 设计系统（浅色高级感 · Inter 字体 · 比特币橙）
├─ app.js                     渲染器：路线图 / 课程页 / 自测 / 进度 / 双语 / 难度 / persona
├─ launch.bat                 本地启动
├─ content/
│  ├─ manifest.js             课程地图（11 阶段、配色、目标、难度、persona）—— 路线图只读这个
│  └─ lessons/
│     ├─ stage*-*.js          48 节中文课
│     └─ en/                  48 节英文课（同名文件）
└─ demos/
   └─ *.js                    47 个交互演示（默认导出 mount(root, lang)）
```

**设计原则：内容与代码分离。** 课文内容才是主体；`app.js` 只是渲染器。加内容不用动核心代码。

## 加一节课（两步）

1. 在 `content/lessons/` 新建文件，照现有课的结构填空：

   ```js
   export default {
     id: "merkle-tree",
     stage: 3, order: 3,
     title: "默克尔树：把一万笔交易压成一个指纹",
     difficulty: 2,               // 1 基础 / 2 进阶 / 3 高级
     prereqs: ["hashing"],        // 前置课 id，渲染成可点链接
     oneLiner: "一句话概括……",
     intuition: `直觉解释，结尾给一张「主干地图」`,
     mechanics: `深入原理，用 ### 小标题拆成几个分支`,
     demo: "merkle-tree",         // 对应 demos/merkle-tree.js，没有就删掉本行
     analogy: `类比`,
     misconceptions: ["误解一……", "误解二……"],
     quiz: [{ q: "题干", options: ["A","B"], answer: 1, explain: "解析" }],
     further: [{ label: "延伸资料", url: "https://…" }],
   };
   ```

   英文版放到 `content/lessons/en/` 下的同名文件（结构一致，正文译英）。

2. 在 `content/manifest.js` 对应 stage 的 `lessons[]` 里登记：

   ```js
   { id: "merkle-tree", title: "默克尔树……", titleEn: "Merkle Trees…",
     module: "./content/lessons/stage3-merkle.js", status: "ready",
     difficulty: 2, personas: ["developer"] }
   ```

刷新即生效。

### prose 字段支持的 Markdown
`**加粗**`（课文内会荧光高亮）· `` `代码` `` · `[文字](链接)` · `- 列表` · `> 引用` · `### 小标题` · 空行分段。

### 缓存说明（开发时）
浏览器会缓存静态资源。改了 `app.js` / `styles.css` 后，把 `index.html` 里的 `?v=N` 版本号 +1；改了 `lessons/` 或 `demos/` 后，把 `app.js` 里的 `const V` +1；改了 `manifest.js` 则把 `app.js` 第 5 行的 `?v=` 与 `app.js?v=` 一起 +1。

## 路线图（11 阶段）

| 层 | 阶段 |
|---|---|
| 入门 · 浅 | 0 为什么需要比特币 · 1 上手使用 · 2 运作全景 |
| 原理 | 3 密码学基石 · 4 交易深入 · 5 挖矿与共识 |
| 系统 | 6 网络与协议 · 7 钱包与密钥标准 · 8 扩容与二层 |
| 精通 · 深 | 9 前沿与高级主题 · 10 动手与构建 |

---

Developed by **EvideX Research**
