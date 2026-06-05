/**
 * generate.mjs — THARA-9 full asset generation (45 images)
 * รัน: node generate.mjs
 * P1 → P2 → P3 ตามลำดับ, ข้ามถ้าไฟล์มีอยู่แล้ว
 */
import { GoogleGenAI } from "@google/genai";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-2.5-flash-image";

await fs.mkdir("assets", { recursive: true });

// ─── style ─────────────────────────────────────────────────────────────────
const BASE = "high quality anime sci-fi illustration, clean cel-shaded with soft painterly lighting, semi-bright cinematic mood, deep navy and cyan palette with warm amber accent lights, cohesive single game art style, highly detailed, no text, no letters, no watermark";
const STYLE_CHAR = BASE + ", half-body character portrait, centered, facing viewer, plain flat soft-grey studio background";
const STYLE_BG   = BASE + ", environment background art, no people, wide cinematic establishing shot";
const STYLE_KEY  = BASE + ", dramatic key art, epic wide composition, stunning";
const STYLE_ICON = BASE + ", simple clean icon, single centered symbol, flat dark background, glowing";

// ─── gen helpers ───────────────────────────────────────────────────────────
async function gen(prompt, outPath, refB64=null) {
  if (existsSync(outPath)) { console.log("  skip (exists)", outPath); return await fs.readFile(outPath,'base64'); }
  const parts = [{ text: prompt }];
  if (refB64) parts.unshift({ inlineData: { mimeType:"image/png", data:refB64 } });
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role:"user", parts }],
    config: { responseModalities: ["IMAGE","TEXT"] },
  });
  const img = res.candidates[0].content.parts.find(p => p.inlineData);
  if (!img) throw new Error("ไม่ได้ภาพ: " + outPath);
  const b64 = img.inlineData.data;
  await fs.writeFile(outPath, Buffer.from(b64,"base64"));
  console.log("  ✓ saved", outPath);
  return b64;
}

// ─── P1: KEY ART ───────────────────────────────────────────────────────────
console.log("\n▶ P1: Key Art");
await gen(
  `THARA-9 space station floating in orbit above the planet Jupiter, dramatic lighting from the sun, stars, emergency warning lights glowing red, epic wide shot, ${STYLE_KEY}`,
  "assets/key_title.png"
);

// ─── EVENT IMAGES: ช่วงเหตุการณ์กำลังเกิด (12 จุดวิกฤต) ───────────────────
// ใช้ bg เดิมเป็น reference → ดูเหมือนห้องเดิม แต่กำลังเกิดเหตุ
console.log("\n▶ Event images: crisis moments");
const EVENT_BG_REF = { // loc ที่ใช้เป็น reference แต่ละ event
  impact:'bridge', breach:'moduleB', fire:'corridor', nav:'nav', lab:'lab',
  medbay:'medbay', comms:'comms', conflict:'bridge', storage:'storage',
  reactor:'reactor', dock:'dock', ending:'ending',
};
const EVENT_PROMPTS = {
  impact:   "the command bridge violently shaking from a meteor impact, floating sparks and debris in the air, all consoles flickering, red alarms blazing, chaotic zero-gravity debris, dramatic mid-impact moment",
  breach:   "a hull breach crack on the wall with air and debris being sucked toward it, emergency mist escaping into space, yellow hazard stripes, faint sparks, tense dynamic moment of a breach opening",
  fire:     "electrical fire actively spreading along conduits in the corridor, sparks raining down, thick smoke billowing in low gravity, red emergency glow, mid-action fire event with motion blur smoke",
  nav:      "navigation screens showing glitching corrupted star charts, holographic maps flickering with error codes, sparks from a control panel, orbital trajectory data scrambled, system malfunction moment",
  lab:      "an open broken containment pod in the research lab, a small shadowy unidentified creature silhouette escaping into the darkness, knocked-over specimen containers, lab equipment scattered, tense eerie escape moment",
  medbay:   "medical bay in crisis with all monitors alarming, a life support pod actively working, emergency lighting on, medical tools scattered, no faces visible, urgent clinical crisis moment",
  comms:    "communications room with all screens showing NO SIGNAL errors and flat-line waveforms, static interference patterns across every display, a dark tense signal-lost moment",
  conflict: "the bridge with silhouettes of crew members in tense disagreement around a holographic mission table, two conflicting strategy holograms clashing mid-air, dramatic split cyan and amber lighting",
  storage:  "storage room with supply containers tipped and spilled across the floor, one container cracked with contamination warning symbols glowing, amber emergency lighting, contamination alert moment",
  reactor:  "the reactor core flaring critically bright red-orange, all warning gauges in the danger zone, power surge corona visible around the core, cables crackling, dramatic power crisis moment",
  dock:     "docking bay with crew preparing for handover, status lights on airlock cycling green, through the viewport a rescue ship's approach lights are clearly visible closing in, tense hopeful moment",
  ending:   "a rescue spaceship with running lights closing in on the damaged station against a backdrop of Jupiter, docking approach alignment beams exchanging, dawn-like light beginning to wash over the scene",
};
for (const [id, desc] of Object.entries(EVENT_PROMPTS)) {
  const bgFile = `assets/bg_${EVENT_BG_REF[id]}.png`;
  const ref = existsSync(bgFile) ? await fs.readFile(bgFile,'base64') : null;
  const prompt = ref
    ? `In this exact same space/room as the reference image, show this crisis moment: ${desc}. No people faces visible, no text. ${STYLE_BG}`
    : `${desc}, ${STYLE_BG}`;
  await gen(prompt, `assets/event_${id}.png`, ref);
}

// ─── P1: ฉากหลัง 12 จุด ────────────────────────────────────────────────────
console.log("\n▶ P1: Backgrounds");
const BG = {
  bridge:   "space station command bridge interior at night, large curved viewport showing Jupiter and stars, control consoles with glowing panels, red emergency alert lighting",
  moduleB:  "damaged space station module interior, hull breach crack in the wall, yellow-and-black hazard stripes, escaping air mist, faint sparks, dim emergency lighting",
  corridor: "narrow space station corridor with a small electrical fire and drifting smoke, red emergency strip lights, pipes along the walls, tense atmosphere",
  nav:      "space station navigation room, star charts and orbital trajectory displays on curved screens, blue-tinted holographic maps, precise and technical atmosphere",
  lab:      "space station research laboratory, specimen containers, scientific equipment, soft sterile lighting, teal and white, a few containers open on one side",
  medbay:   "space station medical bay, soft teal and white lighting, medical beds, a glowing medical cross symbol, calm clinical mood",
  comms:    "space station communications room, large antenna controls, signal frequency displays, satellite uplink panels, blue and green indicator lights",
  storage:  "space station storage room, shelving with supply containers, some containers open or knocked over, amber utility lighting, practical atmosphere",
  reactor:  "space station reactor core room, a large glowing energy core, heavy pipes and conduits, dramatic blue light, low-power warning ambience",
  dock:     "space station docking bay, large airlock doors, a rescue ship visible through a small porthole, warm hopeful lighting beginning to appear",
  ending:   "space station bridge viewport in calm dawn-like light, a distant rescue ship with running lights approaching among the stars, hopeful serene atmosphere",
};
for (const [k, desc] of Object.entries(BG)) {
  await gen(`${desc}, ${STYLE_BG}`, `assets/bg_${k}.png`);
}

// ─── P1: ตัวละคร นัท ─────────────────────────────────────────────────────
console.log("\n▶ P1: Nut");
const NUT = "Nut, a 17-year-old Thai junior space station crew member, short dark-brown hair, warm brown eyes, fitted teal-green crew jumpsuit with a small round THARA-9 patch, youthful kind face";
const nutRef = await gen(`${NUT}, calm neutral expression with a faint friendly smile, ${STYLE_CHAR}`, "assets/nut_neutral.png");

const NUT_EXPR = {
  panic:    "panicked frightened expression, wide eyes, open mouth, bead of sweat",
  relieved: "relieved warm expression, soft smile, slightly teary eyes",
  sad:      "worried sorrowful expression, downcast eyes, trembling lips",
  brave:    "determined brave expression, focused eyes, firm mouth, chin slightly up",
};
for (const [k, expr] of Object.entries(NUT_EXPR)) {
  await gen(`Same character as the reference image, identical face and outfit, only change the expression to: ${expr}, ${STYLE_CHAR}`, `assets/nut_${k}.png`, nutRef);
}

// ─── P1: ARI ─────────────────────────────────────────────────────────────
console.log("\n▶ P1: ARI");
const ARI = "ARI, a friendly ship AI shown as a floating holographic geometric core, a glowing translucent crystalline diamond with concentric rings and one soft luminous central eye, no human features, sci-fi hologram";
const ariRef = await gen(`${ARI}, calm steady cyan-blue glow, serene, ${STYLE_CHAR}`, "assets/ari_calm.png");
await gen(`Same holographic AI core as reference, identical shape, change glow to soft purple-blue, slightly tilted, contemplative thinking expression, ${STYLE_CHAR}`, "assets/ari_smug.png", ariRef);
await gen(`Same holographic AI core as reference, identical shape, change glow to urgent red-orange, sharp angular flare, alarmed expression, ${STYLE_CHAR}`, "assets/ari_alert.png", ariRef);

// ─── P1: กัปตัน ──────────────────────────────────────────────────────────
console.log("\n▶ P1: Captain");
await gen(`Captain Orn, a Thai woman in her 50s, station commander, short grey-streaked black hair, calm authoritative yet kind expression, dark navy command jumpsuit with rank insignia, ${STYLE_CHAR}`, "assets/cap_neutral.png");

// ─── P1: card_bg ─────────────────────────────────────────────────────────
console.log("\n▶ P1: Card background");
await gen(`premium results card background, vertical portrait orientation, deep space with subtle nebula, dark navy with gentle cyan and gold particles, elegant minimal, suitable for sharing on social media, ${STYLE_KEY}`, "assets/card_bg.png");

// ─── P2: State variants ───────────────────────────────────────────────────
console.log("\n▶ P2: State variants");
const bgBridgeRef = existsSync("assets/bg_bridge.png") ? await fs.readFile("assets/bg_bridge.png","base64") : null;
if (bgBridgeRef) {
  await gen(`Same space station command bridge as reference, add intense red emergency alert lighting, flashing warning lights, dramatic tension, ${STYLE_BG}`, "assets/bg_bridge_alert.png", bgBridgeRef);
  await gen(`Same space station command bridge as reference, calm restored atmosphere, soft blue-white normal lighting, crisis resolved mood, ${STYLE_BG}`, "assets/bg_bridge_calm.png", bgBridgeRef);
}
const bgModuleRef = existsSync("assets/bg_moduleB.png") ? await fs.readFile("assets/bg_moduleB.png","base64") : null;
if (bgModuleRef) {
  await gen(`Same space station module as reference, hull breach visibly cracked and open, air mist escaping, damaged cables, dangerous atmosphere, ${STYLE_BG}`, "assets/bg_moduleB_breached.png", bgModuleRef);
  await gen(`Same space station module as reference, hull breach now sealed with emergency patches, hazard tape around area, safe but tense atmosphere, ${STYLE_BG}`, "assets/bg_moduleB_sealed.png", bgModuleRef);
}
const bgLabRef = existsSync("assets/bg_lab.png") ? await fs.readFile("assets/bg_lab.png","base64") : null;
if (bgLabRef) {
  await gen(`Same space station lab as reference, all containment containers sealed and secured, green status lights, safe clinical atmosphere, ${STYLE_BG}`, "assets/bg_lab_secure.png", bgLabRef);
}
const bgCommsRef = existsSync("assets/bg_comms.png") ? await fs.readFile("assets/bg_comms.png","base64") : null;
if (bgCommsRef) {
  await gen(`Same communications room as reference, all displays showing active signal, green connection lights, signal successfully restored, ${STYLE_BG}`, "assets/bg_comms_active.png", bgCommsRef);
}

// ─── P3: ไอคอน 6 โดเมน ──────────────────────────────────────────────────
console.log("\n▶ P3: Domain icons");
const ICONS = {
  R: "a glowing mechanical gear with a wrench, symbol of engineering and hands-on work, warm amber",
  I: "a glowing magnifying glass over a molecule or data pattern, symbol of analysis and research, cyan blue",
  A: "a glowing paintbrush leaving a colorful cosmic streak, symbol of creativity, purple violet",
  S: "a glowing heart with a gentle pulse line, symbol of care and people, warm gold",
  E: "a glowing star above an upward arrow, symbol of leadership and drive, red orange",
  C: "a glowing organized chart or grid of dots, symbol of systems and order, blue sapphire",
};
for (const [d, desc] of Object.entries(ICONS)) {
  await gen(`${desc}, ${STYLE_ICON}`, `assets/icon_${d}.png`);
}

// ─── P3: ไอคอนกลุ่มอาชีพ ─────────────────────────────────────────────────
console.log("\n▶ P3: Group icons");
const GRP_ICONS = {
  R: "engineer and builder at work, circuit board and tools, hands-on technical atmosphere",
  I: "scientist and researcher, microscope and data screens, laboratory blue light",
  A: "creative artist and designer, digital canvas and creative tools, colorful atmosphere",
  S: "caring figure helping another, warm soft light, compassionate atmosphere",
  E: "confident leader figure presenting or directing, spotlight, commanding atmosphere",
  C: "organized systems, spreadsheet and logistic network, clean structured atmosphere",
};
for (const [d, desc] of Object.entries(GRP_ICONS)) {
  await gen(`${desc}, ${BASE}, small vignette illustration, single scene, no text`, `assets/grp_${d}.png`);
}

// ─── P3: Interlude ───────────────────────────────────────────────────────
console.log("\n▶ P3: Interlude images");
await gen(`space station interior corridor checkpoint scene, warm amber light on one side cool blue on other, halfway through the night, contemplative quiet moment, ${BASE}, wide shot`, "assets/interlude_1.png");
await gen(`space station observation window showing stars and Jupiter, a crew member silhouette looking out, calm reflective atmosphere, turning point moment, ${BASE}, wide shot`, "assets/interlude_2.png");

// ─── CAFE: ภาพ event 12 จุดวิกฤต ────────────────────────────────────────────
console.log("\n▶ Cafe Event images");
const CAFE_STYLE_BG = BASE.replace("deep navy and cyan palette with warm amber accent lights",
  "warm amber and cream palette, wooden furniture, cozy Thai cafe atmosphere") +
  ", cafe interior background art, no people, wide cinematic establishing shot";

const CAFE_EVENTS = {
  orders:    "a small cozy cafe counter overwhelmed with stacked order slips, multiple drink tickets hanging, a steaming espresso machine working at full capacity, cups queued up, warm chaotic busy rush moment",
  stock:     "a cafe kitchen with an empty basket where lemongrass used to be, an open refrigerator showing bare shelves, a worried helper's hands visible, scattered ingredient bags, mid-crisis kitchen shortage moment",
  complaint: "a cafe floor with an upset customer at a corner table, arms crossed, other customers subtly glancing over, spilled or wrong-order drink visible on the table, tense cafe atmosphere",
  conflict:  "a narrow cafe backroom with two silhouetted staff members in tense disagreement, lockers and staff bags in background, harsh overhead light, stressful break-room conflict moment",
  equipment: "a cafe espresso machine with steam venting wrong, error lights on, coffee grounds spilled around it, a small puddle of espresso on the counter, broken equipment crisis moment",
  review:    "a smartphone screen prominently showing a glowing negative review with red star rating and angry comment, a cafe counter softly visible in the background, social media crisis moment",
  group:     "a small cozy cafe entrance with fifteen tourists crowding the doorway, bags and cameras, no reservation, excited but chaotic group arrival, warm lighting inside vs bright outside",
  accounts:  "a small cafe office desk with scattered receipts and a calculator showing a discrepancy, a handwritten ledger with crossed-out numbers, a 500 baht difference circled in red, accounting problem moment",
  menu:      "a cafe kitchen counter with fresh ripe yellow mangoes just delivered, a blank menu board nearby, seasonal ingredient decision moment, warm creative kitchen atmosphere",
  safety:    "a cafe storage room with stacked milk cartons showing tomorrow's expiry date sticker clearly visible, a worried hand holding one carton up to check, amber utility lighting, food safety crisis moment",
  burnout:   "a cafe backroom with two staff members sitting slumped and visibly exhausted during a break, empty coffee cups around them, tired slouched postures, dim corner lighting, burnout moment",
  closing:   "a cozy cafe at closing time, chairs being stacked on tables, warm low light, a hand wiping down the counter, the entrance door half-closed with golden evening light streaming in, peaceful end-of-day moment",
};
for (const [id, desc] of Object.entries(CAFE_EVENTS)) {
  await gen(`${desc}, ${CAFE_STYLE_BG}`, `assets/cafe_event_${id}.png`);
}

// ─── CAFE: ตัวละคร มิ้น + แม่ต้า ──────────────────────────────────────────
console.log("\n▶ Cafe Characters");
const STYLE_CHAR_CAFE = "high quality anime illustration, clean cel-shaded with soft painterly lighting, warm cozy mood, amber and cream palette, cohesive game art style, highly detailed, no text, no letters, no watermark, half-body character portrait, centered, facing viewer, plain warm cream-beige studio background";

// มิ้น — ลูกทีมรุ่นน้อง บาริสต้าสาว
const MINT_BASE = "Mint, a cheerful 20-year-old Thai female barista, short straight black hair tucked behind ears, wearing a warm amber-orange cafe apron over a white shirt with a small round cafe badge, bright round expressive eyes, youthful energetic appearance";
const mintRef = await gen(`${MINT_BASE}, calm gentle neutral expression, ${STYLE_CHAR_CAFE}`, "assets/mint_neutral.png");
const MINT_EXPR = {
  panic:    "panicked frightened expression, wide open eyes, open mouth, small bead of sweat",
  relieved: "relieved happy expression, warm closed-eye smile, rosy cheeks",
  sad:      "worried sad expression, downcast eyes, slight downward lip",
  brave:    "determined brave expression, focused narrowed eyes, confident closed-mouth smile",
};
for (const [k, expr] of Object.entries(MINT_EXPR)) {
  await gen(`Same character as reference image, identical face and outfit, only change expression to: ${expr}, ${STYLE_CHAR_CAFE}`, `assets/mint_${k}.png`, mintRef);
}

// แม่ต้า — เจ้าของร้าน/รุ่นพี่
const OWNER_BASE = "Mae Ta, a warm Thai woman in her late 30s, experienced cafe owner, shoulder-length dark hair with subtle grey streaks at the temple, wearing a dark burgundy apron with small embroidered flowers, calm kind authoritative face";
const ownerRef = await gen(`${OWNER_BASE}, calm neutral expression with gentle smile, ${STYLE_CHAR_CAFE}`, "assets/owner_neutral.png");
const OWNER_EXPR = {
  happy:   "warm happy expression, bright open smile, crinkled kind eyes",
  worried: "worried concerned expression, furrowed brows, tense slight frown",
};
for (const [k, expr] of Object.entries(OWNER_EXPR)) {
  await gen(`Same character as reference image, identical face and outfit, only change expression to: ${expr}, ${STYLE_CHAR_CAFE}`, `assets/owner_${k}.png`, ownerRef);
}

// ─── ISLAND: สไตล์และ helpers ──────────────────────────────────────────────
console.log("\n▶ Island assets");
const ISL_BASE = "high quality anime illustration, clean cel-shaded with soft painterly lighting, warm tropical mood, ocean blue and forest green palette with warm sand accent, cohesive single game art style, highly detailed, no text, no letters, no watermark";
const ISL_CHAR = ISL_BASE + ", half-body character portrait, centered, facing viewer, plain soft sky-blue studio background";
const ISL_BG   = ISL_BASE + ", environment background art, no people, wide cinematic establishing shot";

// ─── ISLAND: key art + card bg ────────────────────────────────────────────
await gen(`a deserted tropical island with lush jungle and a white sandy beach at golden hour, shipwreck debris visible on the shore, dramatic ocean waves, distant horizon, epic survival atmosphere, ${ISL_BASE}, dramatic key art, epic wide composition, stunning`, "assets/isl_key_title.png");
await gen(`premium results card background, vertical portrait, tropical ocean with deep blue water and green jungle silhouette, warm sunrise light, calm hopeful mood, elegant minimal, suitable for sharing on social media, ${ISL_BASE}, dramatic key art`, "assets/isl_card_bg.png");

// ─── ISLAND: ฉากพื้นหลัง 10 จุด ──────────────────────────────────────────
const ISL_BG_SCENES = {
  beach:  "tropical deserted island beach at sunrise, white sand, turquoise water, debris from shipwreck on shore, dramatic sky, survival atmosphere",
  jungle: "dense tropical jungle interior, thick green canopy, dappled sunlight, mysterious lush vegetation, humid atmosphere, survival setting",
  camp:   "a simple survival campsite in a jungle clearing, log shelter under construction, small campfire, tropical trees surrounding, late afternoon golden light",
  forest: "tropical forest with fruit trees and dense undergrowth, birds visible in canopy, sunlight filtering through green leaves, foraging atmosphere",
  storm:  "dramatic tropical storm approaching a beach, dark clouds, rough ocean waves, wind-bent palm trees, rain beginning to fall, intense atmosphere",
  cliff:  "dramatic coastal cliff overlooking the ocean on a tropical island, panoramic view, blue sea below, survival crossroads moment",
  cave:   "a dim cave entrance on a tropical island, moss-covered rocks, faint light inside, mysterious shelter, survival hideout atmosphere",
  ruin:   "ancient stone ruins in a tropical jungle, vines covering crumbling walls, old artifacts, mysterious abandoned structure, discovery atmosphere",
  peak:   "top of a tropical island hill at sunset, panoramic ocean view in all directions, golden sky, hope and signal sending atmosphere",
  night:  "tropical island beach at night, full moon reflection on calm water, campfire embers glowing, silhouette of jungle against starry sky, quiet despair atmosphere",
};
for (const [k, desc] of Object.entries(ISL_BG_SCENES)) {
  await gen(`${desc}, ${ISL_BG}`, `assets/isl_bg_${k}.png`);
}

// ─── ISLAND: event images 12 จุด ──────────────────────────────────────────
const ISL_EVENTS = {
  shore:    "a group of survivors crawling onto a tropical beach, scattered debris from a shipwreck floating in the ocean, dramatic arrival moment, survival chaos, no visible faces, motion and urgency",
  water:    "a sun-drenched tropical jungle with a person's hands parting thick leaves searching for water, empty water bottles nearby, desperate thirst moment, green humid atmosphere",
  shelter:  "partially built jungle shelter from branches and palm fronds, tools scattered around, a storm approaching in the background, urgent construction moment",
  food:     "a dark jungle floor with animal tracks and edible plants, a hand-crafted primitive trap made from sticks, foraging and survival moment, no people visible",
  injury:   "a makeshift first aid scene in a jungle camp, a torn shirt used as bandage, scattered improvised medical supplies, urgent care moment, no visible faces",
  storm:    "a violent tropical storm hitting an island, enormous waves crashing on the beach, bent palm trees, flying debris, intense chaotic storm moment",
  conflict: "two silhouetted figures standing on a cliff overlooking the ocean, facing different directions in disagreement, dramatic tension, island horizon behind them",
  ration:   "hands carefully dividing small amounts of food and water into equal portions, survival rations on a large leaf, scarcity and careful management moment",
  ruin:     "ancient stone ruins discovered in a jungle, vines and moss covering carved stones, a weathered artifact visible, discovery and wonder moment, no people",
  signal:   "a large bonfire blazing on top of a hill at night, smoke rising dramatically into the dark sky, SOS signal rocks arranged on the ground, hope moment",
  morale:   "a group of silhouettes sitting around dying campfire embers at night, slumped postures showing exhaustion, dark beach, low morale atmosphere",
  ship:     "a distant ship with lights visible on the ocean horizon at dusk, seen from a beach, hope and urgency, someone's arms raised in the foreground silhouette",
};
for (const [id, desc] of Object.entries(ISL_EVENTS)) {
  await gen(`${desc}, ${ISL_BG}`, `assets/isl_event_${id}.png`);
}

// ─── ISLAND: ตัวละคร ปลา ─────────────────────────────────────────────────
console.log("\n▶ Island: ปลา (Pla)");
const PLA_DESC = "Pla, a 17-year-old Thai teenager, short messy dark hair, wide expressive eyes, wearing torn and sand-stained casual clothes from a beach accident, looks young and vulnerable but kind-hearted";
const plaRef = await gen(`${PLA_DESC}, calm neutral expression with slight worry, ${ISL_CHAR}`, "assets/pla_neutral.png");
const PLA_EXPR = {
  panic:    "panicked terrified expression, wide open eyes, open mouth, trembling",
  relieved: "relieved grateful expression, soft warm smile, misty eyes",
  sad:      "sad worried expression, downcast eyes, quivering lip",
  brave:    "determined brave expression, focused eyes, firm resolved face",
};
for (const [k, expr] of Object.entries(PLA_EXPR)) {
  await gen(`Same character as reference image, identical face and outfit, only change expression to: ${expr}, ${ISL_CHAR}`, `assets/pla_${k}.png`, plaRef);
}

// ─── ISLAND: ตัวละคร ไกด์ ─────────────────────────────────────────────────
console.log("\n▶ Island: ไกด์ (Guide)");
const GUIDE_DESC = "Guide Pom, a Thai man in his late 30s, experienced outdoor guide, short cropped dark hair, weathered tan skin, wearing torn guide shirt and cargo shorts from the accident, calm authoritative presence";
const guideRef = await gen(`${GUIDE_DESC}, calm neutral expression, ${ISL_CHAR}`, "assets/guide_neutral.png");
const GUIDE_EXPR = {
  calm:    "calm composed expression, steady eyes, reassuring slight nod",
  worried: "worried concerned expression, furrowed brow, tense jaw",
  hopeful: "hopeful optimistic expression, bright eyes, gentle encouraging smile",
};
for (const [k, expr] of Object.entries(GUIDE_EXPR)) {
  await gen(`Same character as reference image, identical face and outfit, only change expression to: ${expr}, ${ISL_CHAR}`, `assets/guide_${k}.png`, guideRef);
}

// ─── สรุป ────────────────────────────────────────────────────────────────
const pngs = (await fs.readdir("assets")).filter(f=>f.endsWith(".png"));
console.log(`\n✅ เสร็จ — ได้ ${pngs.length} ไฟล์ใน ./assets/`);
