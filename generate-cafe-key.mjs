/**
 * generate-cafe-key.mjs — เจนภาพ key art สำหรับเกมคาเฟ่เพียงภาพเดียว
 *
 * วิธีรัน:
 *   export GEMINI_API_KEY="AIza..."   ← ใส่ key ของคุณ
 *   node generate-cafe-key.mjs
 *
 * ผลลัพธ์: assets/cafe_key_title.png
 */
import { GoogleGenAI } from "@google/genai";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ไม่มี GEMINI_API_KEY — รัน: export GEMINI_API_KEY=\"AIza...\"");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-2.5-flash-image";

await fs.mkdir("assets", { recursive: true });

const OUT = "assets/cafe_key_title.png";
if (existsSync(OUT)) {
  console.log("✓ มีไฟล์อยู่แล้ว:", OUT);
  process.exit(0);
}

const PROMPT = [
  "a cozy warm Thai street cafe key art,",
  "large glass windows with warm golden hour sunlight streaming in,",
  "wooden tables and chairs, pendant lamps casting amber glow,",
  "fresh flowers in small vases, steaming coffee cups,",
  "lush potted plants along the window, cheerful busy cafe atmosphere,",
  "people visible as soft silhouettes outside on the street,",
  "high quality anime illustration, clean cel-shaded with soft painterly lighting,",
  "warm amber and cream palette, cozy Thai cafe atmosphere,",
  "cohesive game art style, highly detailed,",
  "no text, no letters, no Thai script, no watermark,",
  "dramatic key art, epic wide composition, stunning cinematic shot",
].join(" ");

console.log("▶ กำลังเจน cafe_key_title.png …");

const res = await ai.models.generateContent({
  model: MODEL,
  contents: [{ role: "user", parts: [{ text: PROMPT }] }],
  config: { responseModalities: ["IMAGE", "TEXT"] },
});

const img = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
if (!img) {
  console.error("❌ ไม่ได้ภาพจาก Gemini — ตรวจ quota หรือ key");
  process.exit(1);
}

await fs.writeFile(OUT, Buffer.from(img.inlineData.data, "base64"));
console.log("✅ บันทึกแล้ว:", OUT);
console.log("   → reload หน้า index.html เพื่อดูภาพใหม่");
