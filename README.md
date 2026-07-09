# pordee (พอดี)

> ทำไมใช้คำเยอะ ตอบสั้นๆ ก็เข้าใจ

ได้แรงบันดาลใจมาจาก [caveman](https://github.com/JuliusBrussee/caveman) — pordee เป็นรุ่นภาษาไทยที่ลดเฉพาะ **output token** โดยไม่เสียความถูกต้องทาง technical

---

`pordee` คือ Claude Code plugin สั่งให้ agent ตอบภาษาไทยกระชับ — ตัดคำสุภาพ (ครับ/ค่ะ/นะคะ), คำลังเล (อาจจะ/น่าจะ), และคำเชื่อมที่ไม่จำเป็นทิ้ง เก็บ technical term อังกฤษไว้ตามเดิม

ผล: ลด output token 60-75% เนื้อหาเท่าเดิม

---

## ติดตั้งได้หลายวิธี

### One-line installer (แนะนำ)

ตรวจสอบ agent บนเครื่องที่มีอยู่และติดตั้งได้ทันที

**macOS · Linux · WSL · Git Bash**

```bash
curl -fsSL https://raw.githubusercontent.com/kerlos/pordee/main/install.sh | bash
```

**Windows · PowerShell 5.1+**

```powershell
irm https://raw.githubusercontent.com/kerlos/pordee/main/install.ps1 | iex
```

### ผ่าน skills registry

```bash
npx skills add kerlos/pordee
```

สำหรับ agent ที่รองรับ skills registry (Cursor, Windsurf, Cline, Codex, ฯลฯ) เปิดใช้ต่อ session ด้วย `/pordee`

### ทีละ agent

ดูคำสั่งเฉพาะ agent ทั้งหมดและ flags ต่าง ๆ ใน [INSTALL.md](./INSTALL.md)

---

## วิธีใช้

### Slash command

| คำสั่ง | ผล |
|---|---|
| `/pordee` | เปิด default level (full) |
| `/pordee lite` | โหมดเบา — ตัดคำสุภาพและ filler ออก แต่ grammar เต็ม |
| `/pordee full` | โหมดเต็ม — ตัดให้สั้นที่สุด |
| `/pordee stop` | ปิด |
| `/pordee-stats` | ดูสถิติ token ของ session ปัจจุบัน |
| `/pordee-stats --share` | สรุปสถิติ 1 บรรทัด (copy-paste ได้) |

### Keyword (ไม่ต้องพิมพ์ slash)

พิมพ์คำเหล่านี้เป็นข้อความปกติในแชต — pordee จะเปิด/ปิดให้อัตโนมัติ ต้องเป็นข้อความทั้งบรรทัด ไม่ใช่ส่วนหนึ่งของประโยค

| Keyword | ผล |
|---|---|
| `พอดี` | เปิด |
| `พอดีโหมด` | เปิด |
| `พูดสั้นๆ` | เปิด |
| `หยุดพอดี` | ปิด |
| `พูดปกติ` | ปิด |

---

## ระดับ (Levels)

### 🪶 Lite — `/pordee lite`

ตัดคำสุภาพ (ครับ/ค่ะ/นะคะ), คำลังเลใจ (อาจจะ/น่าจะ/จริงๆแล้ว), และคำทักทาย (ได้เลยครับ/แน่นอน) ทิ้ง แต่เก็บ grammar เต็ม อ่านแล้วยังเป็นภาษาไทยปกติ professional

### ⚡ Full — `/pordee` หรือ `/pordee full` (default)

ตัดเหมือน lite + ตัด particle ที่ซ้ำซ้อน (ที่/ซึ่ง/ว่า/อยู่/กำลัง) + ตัด nominalizer (การ-, ความ-) + ใช้คำสั้น (ดู ไม่ใช่ ตรวจสอบ) + ประโยคสั้นได้

Pattern: `[ของ] [ทำ] [เหตุผล]. [ขั้นต่อ].`

---

## ก่อน / หลัง (Before / After)

### ตัวอย่าง 1 — "ทำไม React component ถึง re-render?"

<table>
<tr>
<th width="34%">🗣️ Normal<br><sub>~80 output tokens</sub></th>
<th width="33%">🪶 Lite<br><sub>~45 output tokens · 44% saved</sub></th>
<th width="33%">⚡ Full<br><sub>~22 output tokens · 73% saved</sub></th>
</tr>
<tr>
<td>"แน่นอนครับ ผมยินดีจะอธิบายให้นะครับ จริงๆ แล้วเหตุผลที่ React component ของคุณ re-render นั้น น่าจะเกิดจากการที่คุณส่ง object reference ใหม่เป็น prop ในทุกครั้งที่ component ถูก render ซึ่งทำให้ React มองว่า prop เปลี่ยน และทำการ re-render component ลูก ดังนั้นคุณอาจจะลองใช้ useMemo เพื่อ memoize object นั้นดูครับ"</td>
<td>"React component re-render เพราะส่ง object reference ใหม่เป็น prop ทุกครั้งที่ render ทำให้ React มองว่า prop เปลี่ยน และ re-render component ลูก ลองใช้ useMemo เพื่อ memoize object นั้น"</td>
<td>"Object ref ใหม่ทุก render. Inline object prop = ref ใหม่ = re-render. ห่อด้วย <code>useMemo</code>."</td>
</tr>
</table>

```
┌─────────────────────────────────────┐
│  Lite  ████░░░░░░  44% saved        │
│  Full  ███████░░░  73% saved        │
└─────────────────────────────────────┘
```

---

### ตัวอย่าง 2 — "อธิบาย database connection pooling"

<table>
<tr>
<th width="34%">🗣️ Normal<br><sub>~70 output tokens</sub></th>
<th width="33%">🪶 Lite<br><sub>~35 output tokens · 50% saved</sub></th>
<th width="33%">⚡ Full<br><sub>~18 output tokens · 74% saved</sub></th>
</tr>
<tr>
<td>"ครับ การทำ database connection pooling นั้น โดยทั่วไปแล้วก็คือการที่เราเก็บ connection ของ database ที่เปิดไว้แล้ว เพื่อนำกลับมาใช้ใหม่อีกครั้ง แทนที่จะต้องเปิด connection ใหม่ทุกครั้งที่มี request เข้ามา ซึ่งจะช่วยลด overhead ของการทำ TCP handshake และ authentication ได้อย่างมีประสิทธิภาพ"</td>
<td>"Connection pooling เก็บ connection database ที่เปิดไว้แล้ว เพื่อนำกลับมาใช้ใหม่ ไม่ต้องเปิดใหม่ทุก request ลด overhead ของ TCP handshake และ authentication"</td>
<td>"Pool reuse connection ที่เปิดไว้. ไม่เปิดใหม่ทุก request. ข้าม TCP handshake."</td>
</tr>
</table>

```
┌─────────────────────────────────────┐
│  Lite  █████░░░░░  50% saved        │
│  Full  ███████░░░  74% saved        │
└─────────────────────────────────────┘
```

---

### ตัวอย่าง 3 — Bug report (auth middleware)

<table>
<tr>
<th width="34%">🗣️ Normal<br><sub>~55 output tokens</sub></th>
<th width="33%">🪶 Lite<br><sub>~30 output tokens · 45% saved</sub></th>
<th width="33%">⚡ Full<br><sub>~14 output tokens · 75% saved</sub></th>
</tr>
<tr>
<td>"ครับ ผมตรวจสอบให้แล้วนะครับ ปัญหาที่คุณเจอน่าจะเกิดจาก bug ใน auth middleware ครับ จริงๆ แล้วในส่วนของ token expiry check นั้น โค้ดใช้เครื่องหมาย <code>&lt;</code> แทนที่จะเป็น <code>&lt;=</code> ซึ่งทำให้ token ที่หมดอายุพอดีไม่ถูก reject ดังนั้นเราควรจะแก้ตรงจุดนี้ครับ"</td>
<td>"Bug อยู่ที่ auth middleware ส่วน token expiry check ใช้ <code>&lt;</code> แทนที่จะเป็น <code>&lt;=</code> ทำให้ token ที่หมดอายุพอดีไม่ถูก reject แก้:"</td>
<td>"Bug ที่ auth middleware. Token expiry ใช้ <code>&lt;</code> ไม่ใช่ <code>&lt;=</code>. Fix:"</td>
</tr>
</table>

```
┌─────────────────────────────────────┐
│  Lite  █████░░░░░  45% saved        │
│  Full  ████████░░  75% saved        │
└─────────────────────────────────────┘
```

---

### ตัวอย่าง 4 — "แนะนำอาหารกลางวันให้หน่อย"

<table>
<tr>
<th width="34%">🗣️ Normal<br><sub>~70 output tokens</sub></th>
<th width="33%">🪶 Lite<br><sub>~32 output tokens · 54% saved</sub></th>
<th width="33%">⚡ Full<br><sub>~14 output tokens · 80% saved</sub></th>
</tr>
<tr>
<td>"ได้เลยครับ จริงๆ แล้วการเลือกอาหารกลางวันก็ขึ้นอยู่กับหลายปัจจัยนะครับ เช่น งบประมาณ เวลาที่มี และความต้องการทางโภชนาการของคุณ ถ้าคุณอยากทานอาหารที่ทำง่ายและมีประโยชน์ ผมขอแนะนำว่าน่าจะลองทำสลัดไก่ย่างดูครับ เพราะว่ามีโปรตีนสูงและไม่ใช้เวลาเตรียมนานเลย"</td>
<td>"อาหารกลางวันขึ้นอยู่กับงบ เวลา และโภชนาการ ถ้าอยากกินง่ายและมีประโยชน์ ลองสลัดไก่ย่าง โปรตีนสูงและเตรียมไม่นาน"</td>
<td>"งบ + เวลา + โภชนาการ. ง่ายและดี → สลัดไก่ย่าง. โปรตีนสูง, เตรียมเร็ว."</td>
</tr>
</table>

```
┌─────────────────────────────────────┐
│  Lite  █████░░░░░  54% saved        │
│  Full  ████████░░  80% saved        │
└─────────────────────────────────────┘
```

---

### ตัวอย่าง 5 — "เที่ยวเชียงใหม่ ไปเดือนไหนดี"

<table>
<tr>
<th width="34%">🗣️ Normal<br><sub>~75 output tokens</sub></th>
<th width="33%">🪶 Lite<br><sub>~30 output tokens · 60% saved</sub></th>
<th width="33%">⚡ Full<br><sub>~12 output tokens · 84% saved</sub></th>
</tr>
<tr>
<td>"ครับ ถ้าคุณอยากไปเที่ยวเชียงใหม่ ผมแนะนำว่าน่าจะไปช่วงเดือนพฤศจิกายนถึงกุมภาพันธ์ครับ เพราะว่าเป็นช่วงที่อากาศเย็นสบาย ไม่ร้อนเกินไป และไม่มีฝนตกบ่อยเหมือนช่วงอื่นๆ จริงๆ แล้วเดือนธันวาคมก็เป็นเดือนที่นิยมที่สุดเลยนะครับ แต่ก็จะคนเยอะหน่อย"</td>
<td>"ไปเชียงใหม่ ช่วงพฤศจิกายน-กุมภาพันธ์ดีที่สุด อากาศเย็นสบาย ไม่ร้อน ฝนน้อย ธันวาคมนิยมที่สุดแต่คนเยอะ"</td>
<td>"พ.ย.-ก.พ. ดีสุด. อากาศเย็น, ฝนน้อย. ธ.ค. คนเยอะ."</td>
</tr>
</table>

```
┌─────────────────────────────────────┐
│  Lite  ██████░░░░  60% saved        │
│  Full  ████████░░  84% saved        │
└─────────────────────────────────────┘
```

---

### ตัวอย่าง 6 — "วิธีนอนหลับให้สนิท"

<table>
<tr>
<th width="34%">🗣️ Normal<br><sub>~70 output tokens</sub></th>
<th width="33%">🪶 Lite<br><sub>~32 output tokens · 54% saved</sub></th>
<th width="33%">⚡ Full<br><sub>~14 output tokens · 80% saved</sub></th>
</tr>
<tr>
<td>"ครับ การนอนหลับให้สนิทนั้นมีหลายวิธีนะครับ ก่อนอื่นเลย คุณควรจะหลีกเลี่ยงการดื่มกาแฟหรือเครื่องดื่มที่มีคาเฟอีนหลังบ่ายสาม จริงๆ แล้วก็ควรจะปิดหน้าจอทุกชนิดอย่างน้อย 30 นาทีก่อนนอนนะครับ และพยายามเข้านอนเวลาเดิมทุกวันเพื่อให้ร่างกายปรับนาฬิกาชีวิต"</td>
<td>"นอนหลับสนิทมีหลายวิธี เลี่ยงคาเฟอีนหลังบ่ายสาม ปิดหน้าจอ 30 นาทีก่อนนอน เข้านอนเวลาเดิมทุกวันเพื่อปรับนาฬิกาชีวิต"</td>
<td>"เลี่ยงคาเฟอีนหลังบ่าย 3. ปิดจอ 30 นาทีก่อนนอน. เข้านอนเวลาเดิม → ปรับ circadian."</td>
</tr>
</table>

```
┌─────────────────────────────────────┐
│  Lite  █████░░░░░  54% saved        │
│  Full  ████████░░  80% saved        │
└─────────────────────────────────────┘
```

---

## กลไกการทำงาน

1. ติดตั้ง plugin → Claude Code register hook ของ pordee อัตโนมัติ
2. เริ่ม session ใหม่ → SessionStart hook อ่าน state ที่ `~/.pordee/state.json`
3. ถ้า `enabled=true` → inject กฎ pordee เข้า context ของ session
4. ทุก turn ที่ user พิมพ์ → UserPromptSubmit hook
   - ตรวจ trigger ใน prompt (`/pordee`, `พอดี`, `หยุดพอดี`, ฯลฯ)
   - update state ถ้าเจอ trigger
   - ฉีด reminder ของ level ปัจจุบันเข้า context (กันไม่ให้ model drift)
5. State อยู่ที่ `~/.pordee/state.json` — ถาวรข้าม session

---

## สถิติ (Stats)

`/pordee-stats` แสดง token usage ของ session ปัจจุบัน + ประมาณการ token ที่ประหยัดได้จากการใช้ pordee

```
พอดี Stats
──────────────────────────────────
Session:  ...projects/demo/session.jsonl
Turns:    12
──────────────────────────────────
Output tokens:         8,450
Cache-read tokens:     2,100
──────────────────────────────────
Est. without pordee:   21,667
Est. tokens saved:     13,217 (~61%)
Est. saved (USD):      ~$0.198
Savings est. from benchmarks/ (median per-task). Actual varies by task.
```

| คำสั่ง | ผล |
|---|---|
| `/pordee-stats` | สถิติ session ปัจจุบัน + lifetime summary |
| `/pordee-stats --share` | สรุป 1 บรรทัด — เช่น `⚡ Saved 13,217 output tokens (~$0.198) across 12 turns this session — pordee` |
| `/pordee-stats --all` | สถิติรวมทุก session (lifetime) |
| `/pordee-stats --since 7d` | สถิติย้อนหลัง 7 วัน |

### Benchmark

compression ratio ที่ stats ใช้มาจาก `benchmarks/compression.json` — สร้างจากการรัน prompt ชุดทดสอบภาษาไทย 8 ข้อ ผ่าน API แบบปกติ vs pordee แล้วคิด median

```bash
# รัน benchmark (ต้องมี ANTHROPIC_API_KEY)
export ANTHROPIC_BASE_URL=https://api.kimi.com/coding/v1
node benchmarks/run.js --level full
node benchmarks/run.js --level lite
```

หรือใช้ `--dry-run` สร้าง mock data สำหรับทดสอบ:

```bash
node benchmarks/run.js --dry-run --level full
```

---

## ตอนไหน pordee จะหยุดเอง 

บางสถานการณ์ การพูดสั้นเกินไปอันตรายหรือคนอ่านอาจเข้าใจผิด pordee จะปิดตัวเองชั่วคราว ตอบเป็นภาษาไทยปกติเต็มประโยค จบแล้วค่อยกลับมา

ถ้าผู้ใช้ต้องการให้อธิบายชัด ๆ พิมพ์คำต่อไปนี้ pordee จะหยุดและตอบยาวขึ้น:

| คำที่ผู้ใช้พิมพ์ | ความหมาย |
|---|---|
| `อะไรนะ` | ฟังไม่ทัน ขอใหม่ |
| `พูดอีกที` | ขอตอบซ้ำ |
| `อธิบายชัดๆ` | ขอละเอียดกว่านี้ |
| `ขยายความ` | ขอรายละเอียด |

นอกจากนี้ pordee จะหยุดเองเมื่อ:

- มี **security warning** หรือ ⚠️ ในคำตอบ
- คำสั่งที่ย้อนกลับไม่ได้ — `DROP TABLE`, `rm -rf`, `git push --force`, `git reset --hard`, `git branch -D`
- ขั้นตอนหลายสเต็ปที่ลำดับสำคัญ และ ประโยคสั้นเสี่ยงทำให้สับสน

หลังจบส่วนที่ต้องชัด pordee กลับมาโหมดเดิมทันที

---

## ข้อจำกัด

- ตอนนี้รองรับเฉพาะ Claude Code (v1) — โปรแกรมอื่นๆ จะเพิ่มเข้ามาในทีหลัง

---

## License

MIT
