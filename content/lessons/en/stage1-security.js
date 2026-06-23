export default {
  id: "security",
  stage: 1,
  order: 5,
  title: "Guarding Your Coins: Backups and Scam Defense",
  difficulty: "intro",
  prereqs: ["wallets"],

  oneLiner:
    "The entire security of self-custody comes down to two things: don't lose your seed phrase, and don't let anyone trick it out of you. Never digitize your seed phrase or enter it on any website; stay instinctively suspicious of “support, airdrops, guaranteed returns”; use a hardware wallet for large amounts, and verify against the address on the device's screen.",

  intuition: `
After self-custody, you are your own bank — which means security is entirely up to you (in the last lesson we just swapped the risk for "self-custody risk"). The good news: the vast majority of thefts fall into the **same few** pits, and avoiding them avoids 99% of the risk. There's a "scam-spotting" quiz on the right to drill your instinctive reactions.

Distill the whole of security into two lifelines: **don't lose your seed phrase**, and **don't let anyone trick it out of you.** Below we look clearly at the pits in each of "losing" and "being scammed," plus a set of hard habits that block the overwhelming majority of attacks.

**In this lesson we break "guarding your coins" into four pieces:**

- **① Lifeline one · don't lose it — the iron rule of offline physical backup**
- **② Lifeline two · don't get scammed — one line that exposes any seed-phrase scam**
- **③ A field guide to common scams — fake support, phishing, airdrops, address poisoning, clipboard hijacking**
- **④ Hardcore habits · what-you-see-is-what-you-sign and multisig — plus the irreversible-bottom-line mindset**
`,

  mechanics: `
### ① Lifeline one · don't lose it: offline physical backup

Coins don't "disappear," but losing the seed phrase = **locking the coins away forever** (the iron rule from Stage 1.1). The goal of backup is: **neither stolen nor destroyed.**

- **Medium**: offline **hand-written on paper**, and for large amounts ideally **engraved on a metal plate** (fire- and water-proof, since paper fears fire and flood).
- **Redundancy**: you can make **multiple copies stored in separate locations** (e.g. at home + another trusted place), so no single mishap (a fire, a theft, losing it in a move) wipes you out entirely.
- **Absolutely forbidden**: screenshots, photos, cloud storage, notes in your phone, emailing yourself, dropping it into a chat log — **anywhere online or that syncs to the cloud** can be stolen. Once the seed phrase is digitized, it's like scattering photocopies of your vault key across the internet.
- **Advanced**: some wallets support a **BIP39 passphrase (the so-called "25th word")**, which adds a password held only in your head on top of the seed phrase — but if you forget it, it likewise can't be recovered, so it's a double-edged sword (just good to know; expanded in Stage 7).

### ② Lifeline two · don't get scammed: one line that exposes it

Remember this one line and you block the single biggest category of theft: **anyone or any website asking you to "enter or provide your seed phrase" is 100% a scam.**

- A legitimate wallet only has you enter the seed phrase **locally, when you're restoring your own wallet** — there is **never** any "support," "security verification," "unlock your airdrop," or "sync your account" that asks for it.
- The seed phrase should also **never** be entered on any **web page**. Wallet restoration happens locally in the app / device, not in some website's input box.
- Treat it as a physical law with no exceptions: **the moment someone wants to know your seed phrase, they're a thief** — no matter how official, urgent, or "for your own good" the pitch sounds.

### ③ A field guide to common scams: recognize them and you can dodge them

- **Fake support / unsolicited DMs offering to "fix your problem"**: they approach you on social platforms or in group chats, luring you to reveal your seed phrase or click a phishing link. The truth: **no legitimate support ever needs your seed phrase**, nor will they DM you out of the blue.
- **Phishing sites / fake apps**: made to look almost identical to the official site or a real wallet, tricking you into entering your seed phrase or downloading a trojaned version. Always **download from official channels** and **verify the domain name letter by letter** (phishing sites often use look-alike letters or an extra hyphen).
- **"Free airdrops," "deposit rebates," "guaranteed-return investments"**: use greed to bait you into signing an approval, transferring, or handing over your seed phrase. **Coins don't fall from the sky**; "urgency + high returns" is the classic phishing recipe.
- **Address poisoning**: the attacker slips a small transfer into your transaction history using an address whose **beginning and ending both look similar** to your usual address, betting you'll grab the wrong one when copying from history next time. Countermeasure: **verify the full address**, don't just glance at the head and tail.
- **Clipboard hijacking**: malware watches your clipboard and, after you copy a receiving address, **quietly swaps it for the hacker's address.** Countermeasure: after pasting, **verify the full address segment by segment**, or use your wallet's **address book** or QR codes.

### ④ Hardcore habits: what-you-see-is-what-you-sign, multisig, and the irreversible mindset

- **What You See Is What You Sign**: when transferring with a hardware wallet, **verify against the address and amount shown on the device's screen**, not just what's on the computer/phone screen. Your internet-connected device **may already be infected and showing a fake address**, but the isolated hardware screen is rendered by the device itself and a trojan can't change it. **The few seconds of verification before signing are the last and hardest line of defense.**
- **Multisig (advanced)**: for large amounts you can use multisig, where moving funds requires **M of N keys** (e.g. 2/3). Storing several keys in separate locations means **a single key being stolen or a single point being destroyed won't lose your coins**, and it removes the single point of failure where "one leaked seed phrase ends everything" (expanded in Stage 7).
- **Bottom-line mindset**: Bitcoin is **irreversible** — there's no "undo," no support to roll things back (Stage 1.3). So the center of gravity of security is always **prevention**: slow down, verify more, and stay instinctively suspicious of anything "urgent," "limited-time," or "guaranteed return." **Suspicion itself is the best antivirus software.**
`,

  demo: "scam-spotter",

  analogy: `
The seed phrase is like the **master key** to your home safe. No bank employee would ever call and ask you to "read me your safe's key so I can verify it" — the moment someone makes that demand, no matter how official or urgent they sound, that someone is a thief.

The core of scam defense isn't really technical, but this instinct: **the key never leaves home.**
`,

  misconceptions: [
    "“Legitimate support or officials sometimes need my seed phrase to verify.” — Never. Anyone asking for your seed phrase is, without exception, a scam.",
    "“My wallet is a big brand and I checked the head and tail of the address, so I'm safe.” — Address poisoning and clipboard hijacking specifically target “only checking the head and tail.” Verify the full address, and with a hardware wallet, go by the device's screen.",
    "“Encrypting my seed phrase and storing it in the cloud or a password manager is safe.” — Any online storage increases your exposure surface. The most solid is an offline physical backup (paper or metal).",
    "“As long as it can be undone, I can fix things after they go wrong.” — Bitcoin is irreversible; there's no undo. Prevention is the only safety net.",
  ],

  quiz: [
    {
      q: "Someone claiming to be official wallet support DMs you that your account is abnormal and asks you to provide your seed phrase to verify. What should you do?",
      options: ["Provide it quickly to cooperate", "Immediately judge it a scam and never provide it", "Provide only the first 6 words", "Move half the funds out first to be safe"],
      answer: 1,
      explain: "Anyone asking for your seed phrase is a scam, no exceptions.",
    },
    {
      q: "What is the most reliable way to back up a seed phrase?",
      options: ["A screenshot in your photo album", "Hand-written offline or engraved on metal, stored physically", "Encrypted and stored in the cloud", "Emailed to yourself"],
      answer: 1,
      explain: "Stay away from all online storage; a physical offline backup is the most solid.",
    },
    {
      q: "What do “address poisoning” and “clipboard hijacking” remind us of?",
      options: ["Checking only the head and tail of the address is enough", "Verify the full address (with a hardware wallet, go by the device's screen)", "The longer the address, the safer", "Just copy it a few more times and it'll be right"],
      answer: 1,
      explain: "Checking only the head and tail is exactly the opening these attacks exploit.",
    },
    {
      q: "Facing a “limited-time airdrop, guaranteed-return investment,” what's the right instinct?",
      options: ["Act fast or miss out — jump in quickly", "Be highly suspicious; it's most likely a scam", "Test the waters with a small amount first", "Ask support whether to participate"],
      answer: 1,
      explain: "Urgency plus high returns is a classic phishing playbook; suspicion is the best protection.",
    },
    {
      q: "When transferring with a hardware wallet, why verify against the address shown on the device's screen rather than just the computer screen?",
      options: ["The device screen is clearer and prettier", "Your internet-connected computer may already be trojan-infected and showing a fake address, while the isolated hardware screen can't be changed — this is “what you see is what you sign”", "The device screen can show more information", "It's just the manufacturer's marketing talk"],
      answer: 1,
      explain: "An online device may be tampered with to show a fake display; the hardware screen is rendered by the device itself. Verifying on the hardware screen before signing is the last line of defense.",
    },
  ],

  further: [
    { label: "Bitcoin.org: Secure your wallet", url: "https://bitcoin.org/zh_CN/secure-your-wallet" },
    { label: "learnmeabitcoin: Wallet security basics", url: "https://learnmeabitcoin.com/beginners/guide/wallets/" },
  ],
};
