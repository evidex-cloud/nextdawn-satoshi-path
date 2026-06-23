export default {
  id: "difficulty",
  stage: 5,
  order: 2,
  title: "Target, Difficulty, and the Automatic Recalibration Every Two Weeks",
  difficulty: "core",
  prereqs: ["block-header"],

  oneLiner:
    "“The hash must start with a long string of zeros” is, precisely, “the hash must be smaller than a target value.” The smaller the target, the harder it is to qualify. To keep roughly one block every 10 minutes no matter how the network's hashrate changes, the protocol automatically raises or lowers the difficulty every 2016 blocks (about two weeks), based on the actual block-production speed.",

  intuition: `
Earlier we said "the hash must start with many zeros," but that's just an intuitive way of putting it. The precise rule is: **the block header's hash (treated as a 256-bit big number) must be smaller than a target value (the target)**.

- The **smaller** the target, the **rarer** a qualifying hash, and the **harder** mining is. "More leading zeros" is just the visual manifestation of "a smaller numeric value."
- **Difficulty** is a relative number that's convenient for people to read: difficulty = the original target ÷ the current target. The higher the difficulty, the smaller and harder the current target.

But the network's hashrate is always changing (miners get stronger, miners come and go). If the difficulty stayed fixed, then when hashrate rose, blocks would come faster and faster, and the whole issuance rhythm would fall apart. So Bitcoin has an **automatic recalibration**: every time **2016 blocks** are produced (ideally exactly **two weeks**), nodes look back at how long those 2016 blocks **actually** took — faster than 14 days means **raise the difficulty**, slower than 14 days means **lower the difficulty**, always pulling the average block time back to **10 minutes**.

Drag "network hashrate change" on the right and watch how the difficulty automatically follows, pulling block time back to 10 minutes.

**In this lesson we break "target and difficulty" into four pieces:**

- **① The target value — the precise definition of "qualifying" in mining**
- **② bits encoding and difficulty — three ways of saying the same target**
- **③ The recalibration every 2016 blocks — the formula, the 4× cap, and a famous bug**
- **④ The negative-feedback loop — why it's stayed at 10 minutes for decades**
`,

  mechanics: `
### ① The target value: the precise definition of "qualifying" in mining

Treat the block header's SHA256d output (32 bytes) as an **unsigned big integer up to about 2²⁵⁶**. The passing condition for mining is one sentence: **this number < target**.

- The target is a big number of the same bit width, drawing a line on the number axis — only a hash landing in the range \`[0, target)\` counts as a hit.
- Since SHA256d's output is **uniformly random**, the probability of a hit ≈ \`target ÷ 2²⁵⁶\`. The smaller the target, the narrower this range, the rarer a hit.
- "The number of leading zeros" is just a naked-eye approximation of "a very small value": a hash starting with \`0x0000…\` naturally has a value that lands in a small range far to the left. But the real criterion is **comparing integers by magnitude**, not counting zeros.

### ② bits encoding and difficulty: three ways of saying the same target

Three words surround "difficulty," and they're really different expressions of the same thing:

- **target**: that 256-bit real threshold, the most precise but too long.
- **\`bits\` (nBits)**: only 4 bytes in the block header, encoding the target in a compact format like scientific notation (1 exponent byte + 3 mantissa bytes). A node given the \`bits\` can reconstruct the full target — this is the form actually stored on-chain (Stage 5.1).
- **difficulty**: a relative number for people to read, \`difficulty = the easiest-ever target ÷ the current target\`. At genesis the difficulty was 1; today it's already on the order of tens of trillions, meaning today's target is tens of trillions of times smaller than back then.

Remember: **smaller target ⟺ smaller bits-encoded value ⟺ larger difficulty ⟺ harder to mine**.

### ③ The recalibration every 2016 blocks: the formula, the 4× cap, and a famous bug

- **The recalibration formula (simplified)**: \`new target = old target × (actual time taken ÷ expected time)\`, where the expected time = 2016 × 10 minutes = **20160 minutes (two weeks)**. The faster the actual time, the smaller the ratio → the target shrinks → it gets harder; the slower the actual time, the opposite. (In terms of difficulty, this is \`new difficulty = old difficulty × expected time ÷ actual time\`.)
- **The 4× upper and lower bounds**: a single adjustment is clamped between \`×1/4 and ×4\`, preventing the difficulty from leaping wildly when hashrate fluctuates sharply.
- **The famous "off-by-one" bug**: the protocol measures the **difference between the timestamps of the first and last blocks** in these 2016 blocks, which actually spans only 2015 intervals but is treated as 2016. This small bias has never been fixed (fixing it would trigger a hard fork) and is a deliberately preserved historical quirk — also a reminder: once a consensus rule is live, even a bug becomes "the rule."

### ④ The negative-feedback loop: why it's stayed at 10 minutes for decades

This mechanism is a classic **negative-feedback control loop**:

- Hashrate↑ → blocks come faster → two weeks later the recalibration raises the difficulty↑ → blocks slow down, back to 10 minutes. Hashrate↓ does the reverse; everything is symmetric.
- For exactly this reason, no matter by **how many orders of magnitude** hashrate rises or falls (from a single CPU to hundreds of EH/s globally), Bitcoin's average block time has stayed pinned at about 10 minutes for over a decade. This is no coincidence; it's this loop continually correcting course.
- **Division of labor with the halving**: the difficulty adjustment governs "**how fast**" blocks are produced; the halving governs "**how much** new coin each block issues" (Stage 2.5). The two mechanisms are completely independent, yet together they lock in Bitcoin's predictable rhythm and issuance curve — the core of its "monetary policy written into the math."
`,

  demo: "difficulty-adjust",

  analogy: `
The difficulty adjustment is like a **cruise control**: the target speed is one block every 10 minutes.

Going downhill (hashrate surges, blocks fly out), the system **brakes more** (raises the difficulty); going uphill (hashrate leaves, blocks slow down), it **eases off and gives gas** (lowers the difficulty). The drivers change over and over and the road conditions rise and fall, but the speed is always pulled back to that set value.
`,

  misconceptions: [
    "“The difficulty is set manually by developers or miners.” — It is not. It's computed automatically by the protocol on a fixed formula every 2016 blocks, and verified by every node independently.",
    "“If hashrate doubles, blocks come faster forever.” — Only for about two weeks; the next difficulty adjustment pulls it back to 10 minutes.",
    "“‘The number of leading zeros’ is the difficulty.” — That's just intuition. The real rule is to treat the hash as a big integer and check that it's < the target value; difficulty is a relative conversion of the target.",
    "“The difficulty adjustment changes the block reward or supply.” — It does not. It only governs block speed; issuance is decided separately by the halving rule.",
    "“A single difficulty adjustment can spike or crash arbitrarily.” — No. Each adjustment is clamped between ×1/4 and ×4, preventing extreme jumps.",
  ],

  quiz: [
    {
      q: "What is the precise criterion for “qualifying” in mining?",
      options: ["The hash just needs to start with 0", "The block-header hash (as a number) is smaller than the target value", "The hash is long enough", "The nonce is large enough"],
      answer: 1,
      explain: "Many leading zeros is just the look of a small value; the rule is hash < target.",
    },
    {
      q: "How often, and by what, is the difficulty adjusted?",
      options: ["Daily, by the coin price", "Every 2016 blocks (about two weeks), by the actual block-production speed", "Every block", "Never"],
      answer: 1,
      explain: "Faster than the actual 14 days, raise it; slower, lower it — pulling back to 10 minutes.",
    },
    {
      q: "If the network's hashrate suddenly doubles, what happens to block time in the long run?",
      options: ["It becomes 5 minutes forever", "After about two weeks, a difficulty raise brings it back to about 10 minutes", "It becomes 20 minutes", "Block production stops"],
      answer: 1,
      explain: "The negative-feedback loop stabilizes average block time at 10 minutes.",
    },
    {
      q: "What is the relationship between the difficulty adjustment and the halving?",
      options: ["They're the same thing", "They're independent: difficulty governs block speed, the halving governs per-block issuance", "The halving determines the difficulty", "The difficulty determines the supply"],
      answer: 1,
      explain: "Two independent mechanisms that together maintain a predictable rhythm and issuance.",
    },
  ],

  further: [
    { label: "learnmeabitcoin: Difficulty / Target", url: "https://learnmeabitcoin.com/technical/mining/target/" },
    { label: "mempool.space: real-time difficulty-adjustment countdown", url: "https://mempool.space/" },
  ],
};
