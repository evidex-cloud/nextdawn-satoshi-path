export default {
  id: "btc-numbers",
  stage: 10,
  order: 5,
  title: "Appendix: Key Numbers Quick Reference",
  difficulty: "intro",
  prereqs: [],

  oneLiner:
    "A reference card to look up anytime: the set of numbers a native Bitcoiner should know cold — the 21 million cap, 10-minute blocks, the 2016-block difficulty adjustment, the 210,000-block halving, the 4M weight limit, the SegWit/Taproot activation dates… all on the right, with search.",

  intuition: `
After walking the whole path, many key numbers come up again and again. This page gathers them into a single **reference card** to come back to anytime.

The table on the right supports **search**: type keywords like "halving," "block," "satoshi," or "SegWit" to filter.

**These numbers fall roughly into four categories:**

- **Supply** — the **21 million** hard cap (precise to about 20,999,999.9769 BTC, never exceeded); **1 BTC = 100 million satoshis (satoshi)** is the smallest unit.
- **Time / cadence** — **about one block every 10 minutes**, **a difficulty adjustment every 2016 blocks (about 2 weeks)**, **a halving every 210,000 blocks (about 4 years)**.
- **Capacity** — **4,000,000 weight units (WU)**, the block capacity limit (Stage 4.4 / 8.2).
- **Milestones** — **Genesis 2009-01-03**, **SegWit 2017-08-24**, **Taproot 2021-11-14**.
`,

  demo: "btc-numbers",

  analogy: `
Just as practitioners in every field have an "industry cheat sheet" — pilots remember various speed limits, doctors remember normal ranges — a native Bitcoiner should burn this set of numbers into muscle memory. Look them up enough times and you'll naturally remember them.
`,

  misconceptions: [
    "“21 million is just a rough figure that could be adjusted.” — It's a hard cap written into the consensus rules, precise to about 20,999,999.9769 BTC, and no one can change it.",
    "“The halving and the difficulty adjustment are the same thing.” — They're not. Difficulty adjusts every 2016 blocks (governing block speed); the halving happens every 210,000 blocks (governing issuance).",
  ],

  quiz: [
    {
      q: "What is Bitcoin's maximum supply?",
      options: ["100 million BTC", "About 21 million BTC", "No cap", "10 million BTC"],
      answer: 1,
      explain: "21,000,000, written into consensus and never to be exceeded.",
    },
    {
      q: "What are the periods for the difficulty adjustment and the halving, respectively?",
      options: ["Both every day", "Difficulty every 2016 blocks; halving every 210,000 blocks", "Both every 210,000 blocks", "Both every 2016 blocks"],
      answer: 1,
      explain: "Difficulty adjusts about every 2 weeks, and a halving happens about every 4 years.",
    },
    {
      q: "How many satoshis is 1 BTC?",
      options: ["1,000", "1 million", "100 million", "10,000"],
      answer: 2,
      explain: "1 BTC = 100,000,000 satoshis.",
    },
  ],

  further: [
    { label: "Clark Moody Bitcoin Dashboard (live data)", url: "https://bitcoin.clarkmoody.com/dashboard/" },
    { label: "mempool.space (live blocks/fees/difficulty)", url: "https://mempool.space/" },
  ],
};
