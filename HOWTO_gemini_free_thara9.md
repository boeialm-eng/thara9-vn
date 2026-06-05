# คู่มือละเอียด — เจนภาพเกม THARA-9 ฟรีด้วย Gemini + Claude Code

> เป้าหมาย: ได้ภาพตัวละคร+ฉากทั้งชุด (15 รูป) ฟรี แล้วเสียบเข้าเกม VN อัตโนมัติ
> ใช้ **Gemini 2.5 Flash Image (Nano Banana)** — ฟรี ~500 รูป/วัน ไม่ต้องใส่บัตร
> ทุกขั้นมีคำสั่งให้ก๊อปวางได้จริง · ส่วนที่ "ต้องทำมือ" = ข้อ 1–4 เท่านั้น ที่เหลือ Claude Code ทำให้

---

## ภาพรวม: อะไรทำมือ อะไร Claude Code ทำให้

| ขั้น | ใคร | เวลา |
|---|---|---|
| 1. ลง Node.js | คุณ | 5 นาที (ครั้งเดียว) |
| 2. เอา API key ฟรีจาก Google AI Studio | คุณ | 2 นาที |
| 3. สร้างโฟลเดอร์ + วางไฟล์เกม | คุณ | 1 นาที |
| 4. เปิด Claude Code + ใส่ key | คุณ | 2 นาที |
| 5. เจนภาพ + แก้โค้ดเกม + ทดสอบ | **Claude Code** | อัตโนมัติ |

---

## ขั้น 1 — ลง Node.js (ครั้งเดียว)

1. ไปที่ **https://nodejs.org** โหลดตัว **LTS** (ปุ่มซ้าย) แล้วติดตั้งตามปกติ (กด Next รัว ๆ)
2. เปิดโปรแกรม **Terminal** (Mac: เปิดแอป Terminal / Windows: เปิด PowerShell)
3. เช็กว่าลงสำเร็จ พิมพ์:
   ```bash
   node -v
   ```
   ถ้าขึ้นเลขเวอร์ชัน (เช่น `v20.x.x`) = ผ่าน ✅

---

## ขั้น 2 — เอา API key ฟรีจาก Google AI Studio

> key คือ "กุญแจ" ที่ผูกกับบัญชี Google ของคุณ — Claude สร้าง/ดึงให้แทนไม่ได้ ต้องทำเอง (แต่ฟรี ไม่ต้องใส่บัตร)

1. ไปที่ **https://aistudio.google.com**
2. ล็อกอินด้วยบัญชี Google ที่มีอยู่แล้ว
3. กดเมนู **"Get API key"** (มุมซ้ายล่าง หรือปุ่ม Get API key ด้านบน)
4. กด **"Create API key"** → เลือกโปรเจกต์ (ถ้าไม่มี กด create project ใหม่ตามที่มันแนะนำ)
5. มันจะได้ข้อความยาว ๆ ขึ้นต้นด้วย `AIza...` → **กดคัดลอกเก็บไว้** (อย่าเอาไปโพสต์ที่ไหน เก็บเป็นความลับเหมือนรหัสผ่าน)

> ⚠️ ห้ามเอา key นี้ไปวางในแชต Claude — ใส่เฉพาะในเครื่องคุณตอนรัน Claude Code (ขั้น 4)

---

## ขั้น 3 — สร้างโฟลเดอร์โปรเจกต์ + วางไฟล์

1. สร้างโฟลเดอร์ใหม่ที่ไหนก็ได้ ตั้งชื่อเช่น `thara9`
2. เอา **2 ไฟล์นี้** ไปไว้ในโฟลเดอร์:
   - `thara9-vn.html` (ไฟล์เกม)
   - `คู่มือนี้` (ไฟล์ .md นี้)
3. ใน Terminal พิมพ์เพื่อเข้าไปในโฟลเดอร์ (ลากโฟลเดอร์มาวางหลัง `cd ` ได้เลยจะได้ path อัตโนมัติ):
   ```bash
   cd /path/ไปยัง/thara9
   ```

---

## ขั้น 4 — เปิด Claude Code + ใส่ key

1. ติดตั้ง Claude Code (ถ้ายังไม่มี) ตามคู่มือทางการที่ **https://docs.claude.com** (ค้น "Claude Code install")
2. ใส่ key ลงใน environment ของ terminal (วางทับ `AIza...` ด้วย key จริงของคุณ):

   **Mac / Linux:**
   ```bash
   export GEMINI_API_KEY="AIza...ของจริง"
   ```
   **Windows (PowerShell):**
   ```powershell
   $env:GEMINI_API_KEY="AIza...ของจริง"
   ```
3. เปิด Claude Code ในโฟลเดอร์นี้ แล้วสั่งว่า:
   > **"อ่านไฟล์คู่มือ .md นี้ แล้วทำตามขั้น 5 ทั้งหมด: เขียน generate.mjs, เจนภาพ 15 รูปด้วย Gemini, แล้วแก้ thara9-vn.html ให้ใช้ภาพจริง"**

---

## ขั้น 5 — งานที่ Claude Code ทำให้ (อัตโนมัติ)

### 5.1 ติดตั้ง SDK
```bash
npm init -y
npm i @google/genai
```

### 5.2 เขียนไฟล์ `generate.mjs`

> โมเดล/พารามิเตอร์ของ Gemini เปลี่ยนได้ — Claude Code: เช็ก docs ปัจจุบันที่ **https://ai.google.dev/gemini-api/docs/image-generation** ก่อนรันจริง
> โมเดลฟรี: `gemini-2.5-flash-image` (Nano Banana) · ทำ reference-consistency ได้โดยส่งภาพ neutral เข้าไปเป็น input ตอนเจนสีหน้าอื่น

```js
import { GoogleGenAI } from "@google/genai";
import fs from "node:fs/promises";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-2.5-flash-image";  // Nano Banana (free tier)
await fs.mkdir("assets", { recursive: true });

// --- style ที่ต่อท้ายทุก prompt เพื่อให้ทั้งชุดเป็นสไตล์เดียว ---
const STYLE_CHAR = ", cinematic sci-fi anime illustration, painterly semi-realistic style, soft volumetric lighting, half-body portrait, centered, facing viewer, plain flat light-grey background, deep navy and cyan palette with warm amber rim light, cohesive video game character art, highly detailed, consistent character design";
const STYLE_BG = ", cinematic sci-fi concept art, painterly semi-realistic, dramatic volumetric lighting, deep navy and cyan palette with warm amber accents, atmospheric depth, no people, no text, cohesive video game background art, wide establishing shot, highly detailed, 4:3 aspect";

// เจน 1 รูป — refImages = อาร์เรย์ของ {data(base64), mimeType} สำหรับอ้างอิงความต่อเนื่อง (optional)
async function gen(prompt, outPath, refB64 = null) {
  const parts = [{ text: prompt }];
  if (refB64) parts.unshift({ inlineData: { mimeType: "image/png", data: refB64 } });
  const res = await ai.models.generateContent({ model: MODEL, contents: [{ role: "user", parts }] });
  const img = res.candidates[0].content.parts.find(p => p.inlineData);
  if (!img) throw new Error("ไม่ได้ภาพกลับมา: " + outPath);
  const b64 = img.inlineData.data;
  await fs.writeFile(outPath, Buffer.from(b64, "base64"));
  console.log("saved", outPath);
  return b64; // คืน base64 ไว้ใช้เป็น reference
}

// ===== นัท: เจน neutral ก่อน แล้วใช้เป็น reference ให้สีหน้าอื่น (หน้าคงเดิม) =====
const NUT = "Nut, a 17-year-old Thai junior space station crew member, short dark-brown hair, warm brown eyes, fitted teal-green crew jumpsuit with a small circular THARA-9 mission patch on the chest, youthful expressive face";
const nutExpr = {
  neutral: ", calm neutral expression with a faint friendly smile",
  panic:   ", panicked frightened expression, wide eyes, open mouth, a bead of sweat",
  relieved:", relieved warm expression, soft smile, slightly teary eyes",
  sad:     ", worried sorrowful expression, downcast eyes, trembling lips",
  brave:   ", determined brave expression, focused eyes, firm mouth, chin up",
};
const nutRef = await gen(NUT + nutExpr.neutral + STYLE_CHAR, "assets/nut_neutral.png");
for (const [k, v] of Object.entries(nutExpr)) {
  if (k === "neutral") continue;
  // ส่งภาพ neutral เป็น reference + สั่งให้ "คนเดิม เปลี่ยนแค่สีหน้า"
  await gen("Same character as the reference image, identical face and outfit, only change the expression: " + NUT + v + STYLE_CHAR, `assets/nut_${k}.png`, nutRef);
}

// ===== ARI =====
const ARI = "ARI, a ship's AI shown as a floating holographic geometric core, a glowing translucent crystalline diamond with concentric rings and one luminous central eye, no human features, sci-fi hologram";
const ariMood = { calm:", calm steady cyan-blue glow, serene", smug:", playful amused purple glow, tilted, a single sly curved eye", alert:", alarmed red glow, sharp angular flare, urgent" };
const ariRef = await gen(ARI + ariMood.calm + STYLE_CHAR, "assets/ari_calm.png");
for (const [k, v] of Object.entries(ariMood)) {
  if (k === "calm") continue;
  await gen("Same holographic AI core as the reference, identical shape, only change the color and mood: " + ARI + v + STYLE_CHAR, `assets/ari_${k}.png`, ariRef);
}

// ===== กัปตัน =====
await gen("Captain Orn, a Thai woman in her 50s, station commander, short grey-streaked black hair, calm authoritative yet kind expression, dark navy command jumpsuit with rank insignia" + STYLE_CHAR, "assets/cap_neutral.png");

// ===== ฉาก 6 แบบ =====
const BG = {
  bridge:  "interior of a space station command bridge at night, large curved viewport showing planet Jupiter and stars, control consoles with glowing panels, red emergency alert lighting",
  moduleB: "interior of a damaged space station module, a hull breach crack, yellow-and-black hazard stripes, escaping air mist, faint sparks, dim emergency lighting",
  corridor:"narrow space station corridor with a small electrical fire and drifting smoke, red emergency strip lights, pipes along the walls, tense atmosphere",
  medbay:  "space station medical bay, soft teal and white lighting, medical beds, a softly glowing medical cross symbol, calm clinical mood",
  reactor: "space station reactor core room, a large glowing energy core, heavy pipes and conduits, dramatic blue light, low-power warning ambience",
  ending:  "space station bridge viewport in calm dawn-like light, a distant rescue ship with running lights approaching among the stars, hopeful serene atmosphere",
};
for (const [k, v] of Object.entries(BG)) {
  await gen(v + STYLE_BG, `assets/bg_${k}.png`);
}
console.log("✅ เสร็จ — ภาพทั้งหมดอยู่ใน ./assets/");
```

### 5.3 รันเจนภาพ
```bash
node generate.mjs
```
เช็กว่าได้ครบ 15 ไฟล์ในโฟลเดอร์ `assets/` (nut_*.png 5, ari_*.png 3, cap_neutral.png, bg_*.png 6)

### 5.4 แก้ `thara9-vn.html` ให้ใช้ภาพจริง

แทนที่ 4 ฟังก์ชันนี้ (ของเดิมคืน SVG ให้เปลี่ยนเป็นคืน `<img>`):

```js
function faceNut(expr){ return `<img class="sprite" src="assets/nut_${expr}.png" alt="">`; }
function faceAri(mood){ return `<img class="sprite" src="assets/ari_${mood}.png" alt="">`; }
function faceCap(){ return `<img class="sprite" src="assets/cap_neutral.png" alt="">`; }
function bgArt(loc){ return `<img src="assets/bg_${loc}.png" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`; }
```

เพิ่ม CSS นี้ในแท็ก `<style>`:
```css
#char img.sprite{height:100%;width:auto;object-fit:contain;filter:drop-shadow(0 8px 22px rgba(0,0,0,.5));}
```

> ชื่อไฟล์ตรงกับค่าในเกมพอดี: นัท expr=neutral/panic/relieved/sad/brave · ARI mood=calm/smug/alert · ฉาก loc=bridge/moduleB/corridor/medbay/reactor/ending — ไม่ต้องแก้ส่วนอื่นเลย

### 5.5 ทดสอบ
เปิด `thara9-vn.html` ในเบราว์เซอร์ เล่นตั้งแต่ต้นจนจบ เช็กว่าภาพขึ้นครบ สีหน้าเปลี่ยนตามอารมณ์ ฉากเปลี่ยนตามจุด

---

## ปัญหาที่อาจเจอ + วิธีแก้

| อาการ | สาเหตุ / แก้ |
|---|---|
| `GEMINI_API_KEY is not defined` | ยังไม่ได้ `export` key ในเทอร์มินัลเดียวกับที่รัน หรือเปิด terminal ใหม่แล้วลืม export ซ้ำ |
| ภาพไม่ขึ้นในเกม (กรอบว่าง) | เปิด .html ตรง ๆ บางเบราว์เซอร์บล็อกโหลดไฟล์ในเครื่อง → ให้ Claude Code รันเซิร์ฟเวอร์ง่าย ๆ: `npx serve` แล้วเปิดผ่าน localhost |
| หน้านัทเพี้ยนข้ามสีหน้า | ย้ำในคำสั่งให้ใช้ภาพ neutral เป็น reference เสมอ (โค้ดทำให้แล้ว) หรือเพิ่มรายละเอียดหน้าใน NUT prompt |
| โดนลิมิตฟรี (รัน gen หลายรอบ) | free tier ~500 รูป/วัน ปกติไม่ชน แต่ถ้าชนรอวันถัดไป |
| โมเดลชื่อ error | เช็กชื่อโมเดลปัจจุบันที่ ai.google.dev/gemini-api/docs/image-generation แล้วแก้ค่า `MODEL` |

---

## สรุปสิ่งที่คุณต้องทำมือจริง ๆ
1. ลง Node (ครั้งเดียว)
2. กดเอา key ฟรีจาก aistudio.google.com
3. วางไฟล์ในโฟลเดอร์ + `export GEMINI_API_KEY=...`
4. บอก Claude Code: "อ่านคู่มือนี้แล้วทำตามขั้น 5"

เท่านี้ — ที่เหลือ Claude Code เจนภาพ + แก้เกม + ทดสอบให้เอง และทั้งหมด **ฟรี** ด้วย Nano Banana free tier
