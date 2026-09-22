import fs from "fs";
import path from "path";
import { createRequire } from "node:module";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const fontkit = require("next/dist/compiled/@next/font/dist/fontkit/index.js");

const outDir = path.join(process.cwd(), "public", "images", "blog");
const assetDir = "C:/Users/pc/.cursor/projects/d-02-Research-Thesis-port/assets";
const mediaDir = path.join(process.cwd(), ".next", "static", "media");
fs.mkdirSync(outDir, { recursive: true });

const covers = [
  "cover-jev.png",
  "cover-decoupled-agents.png",
  "cover-pacing.png",
  "cover-distillation.png",
  "cover-agentic-coding.png",
  "cover-vla-robotics.png",
  "cover-datacenter-power.png",
  "cover-agent-security.png",
];

for (const file of covers) {
  const src = path.join(assetDir, file);
  if (!fs.existsSync(src)) continue;
  const dest = path.join(outDir, file.replace(/\.png$/, ".webp"));
  await sharp(src).resize(1200, 675, { fit: "cover" }).webp({ quality: 82 }).toFile(dest);
}

function openFace(match) {
  const file = fs.readdirSync(mediaDir).find((name) => name === match);
  if (!file) throw new Error(`Missing font ${match}`);
  return fontkit.default(fs.readFileSync(path.join(mediaDir, file)));
}

const inter = openFace("e4af272ccee01ff0-s.p.woff2");
const syne = openFace("8a1d8947e5852e30-s.p.woff2");

function face(font, weight) {
  try {
    const varied = font.getVariation({ wght: weight });
    varied.layout("A");
    return varied;
  } catch {
    return font;
  }
}

const interText = face(inter, 460);
const interBold = face(inter, 650);
const syneBold = face(syne, 700);

function glyphRun(font, text, size) {
  const scale = size / font.unitsPerEm;
  const run = font.layout(text);
  let cursor = 0;
  const glyphs = run.glyphs.map((glyph, index) => {
    const pos = run.positions[index];
    const node = `<g transform="translate(${cursor + (pos.xOffset || 0)} ${-(pos.yOffset || 0)})"><path d="${glyph.path.toSVG()}"/></g>`;
    cursor += pos.xAdvance || 0;
    return node;
  });
  return { svg: glyphs.join(""), width: cursor * scale, scale };
}

function text(font, value, x, y, size, fill) {
  const run = glyphRun(font, value, size);
  return `<g fill="${fill}" transform="translate(${x} ${y}) scale(${run.scale} ${-run.scale})">${run.svg}</g>`;
}

function svg({ title, subtitle, boxes, arrows }) {
  const boxMarkup = boxes
    .map((b) => {
      const stroke = b.gold ? "#E8B86D" : "#2EE6D6";
      const top = 132;
      const bottom = b.h - 56;
      const step = b.lines.length > 1 ? (bottom - top) / (b.lines.length - 1) : 0;
      const lines = b.lines
        .map((line, i) => text(interText, line, b.x + 28, b.y + top + i * step, 20, "#C5D0E0"))
        .join("");
      return `
      <rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="18" fill="#0C121C" stroke="${stroke}" stroke-opacity="0.9"/>
      ${text(interBold, b.kicker, b.x + 28, b.y + 40, 13, stroke)}
      ${text(syneBold, b.title, b.x + 28, b.y + 78, 26, "#E8EEF7")}
      ${lines}`;
    })
    .join("");
  const arrowMarkup = arrows
    .map((a) => `<path d="${a}" fill="none" stroke="#2EE6D6" stroke-width="2.4" marker-end="url(#arrow)"/>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <rect width="1200" height="675" fill="#06090F"/>
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#2EE6D6"/>
    </marker>
  </defs>
  ${text(interBold, "MAZIZ.ME  ·  ARCHITECTURE", 40, 42, 13, "#E8B86D")}
  ${text(syneBold, title, 40, 92, 34, "#E8EEF7")}
  ${text(interText, subtitle, 40, 128, 16, "#9AA8BD")}
  ${boxMarkup}
  ${arrowMarkup}
</svg>`;
}

const diagrams = {
  "diagram-jev.webp": svg({
    title: "Jev: one parallel decision pass",
    subtitle: "Typed primitives instead of token-by-token prose",
    boxes: [
      { x: 36, y: 168, w: 360, h: 460, kicker: "STATE", title: "Live context", lines: ["Screen, game, or tool state", "No free-form generation", "Questions are predefined", "Typed inputs only"] },
      { x: 420, y: 168, w: 360, h: 460, gold: true, kicker: "JEV", title: "Single forward pass", lines: ["All questions at once", "70-500 ms reported", "No output-token tax", "Parallel, not autoregressive"] },
      { x: 804, y: 168, w: 360, h: 460, kicker: "TYPES", title: "Primitives only", lines: ["Choice", "Score and probability", "Confidence, not prose", "A parse cannot fail"] },
    ],
    arrows: ["M396 398 H420", "M780 398 H804"],
  }),
  "diagram-decoupled.webp": svg({
    title: "Split the computer-use stack",
    subtitle: "Fast decisions for clicks. A large model only for prose.",
    boxes: [
      { x: 36, y: 168, w: 340, h: 460, kicker: "INPUT", title: "Desktop or browser", lines: ["Structured window state", "Skip per-keystroke shots", "Accessibility tree first"] },
      { x: 420, y: 168, w: 360, h: 220, gold: true, kicker: "FAST PATH", title: "Decision model", lines: ["Click, key, wait, or stop", "Millisecond routing"] },
      { x: 420, y: 408, w: 360, h: 220, kicker: "SLOW PATH", title: "Frontier model", lines: ["Only when words are required"] },
      { x: 824, y: 230, w: 340, h: 336, kicker: "ACTION", title: "OS or browser", lines: ["Deterministic next step", "Logged and typed"] },
    ],
    arrows: ["M376 398 H420", "M780 278 H824", "M780 518 H824"],
  }),
  "diagram-pacing.webp": svg({
    title: "Pacing vs capability jumps",
    subtitle: "Release governance only works if evals keep up",
    boxes: [
      { x: 36, y: 168, w: 360, h: 460, kicker: "LAB", title: "Capability jump", lines: ["New weights ready", "Commercial pressure", "Geopolitical race", "Leaderboard week"] },
      { x: 420, y: 168, w: 360, h: 460, gold: true, kicker: "GATE", title: "Voluntary pacing", lines: ["Phased release", "Red team window", "Interpretability gap", "Pinned previous id"] },
      { x: 804, y: 168, w: 360, h: 460, kicker: "PUBLIC", title: "What ships", lines: ["Eval report", "Known failure modes", "Or an unpaced drop", "Your promotion rule"] },
    ],
    arrows: ["M396 398 H420", "M780 398 H804"],
  }),
  "diagram-distillation.webp": svg({
    title: "On-policy distillation path",
    subtitle: "Frontier behavior copied at token level, then opened",
    boxes: [
      { x: 36, y: 168, w: 360, h: 460, kicker: "TEACHER", title: "Closed frontier API", lines: ["Traces on your tasks", "Not the pretraining set", "Frozen prompt set"] },
      { x: 420, y: 168, w: 360, h: 460, gold: true, kicker: "ALIGN", title: "Token-level distill", lines: ["On-policy rollouts", "Lower post-train budget", "Schema must still hold"] },
      { x: 804, y: 168, w: 360, h: 460, kicker: "STUDENT", title: "Open-weight model", lines: ["Own the weights", "Score your own traces", "Do not invent a board"] },
    ],
    arrows: ["M396 398 H420", "M780 398 H804"],
  }),
  "diagram-harness.webp": svg({
    title: "Test-driven agent loop",
    subtitle: "The harness, not the first draft, decides when code is done",
    boxes: [
      { x: 36, y: 176, w: 270, h: 300, kicker: "1", title: "Write", lines: ["Patch the repo", "Stay inside the task"] },
      { x: 322, y: 176, w: 270, h: 300, kicker: "2", title: "Run", lines: ["Tests, lint, build", "Exact commands only"] },
      { x: 608, y: 176, w: 270, h: 300, gold: true, kicker: "3", title: "Read", lines: ["Compiler output", "Exit codes included"] },
      { x: 894, y: 176, w: 270, h: 300, kicker: "4", title: "Repair", lines: ["Until checks pass", "Or the budget stops"] },
    ],
    arrows: ["M306 326 H322", "M592 326 H608", "M878 326 H894", "M1029 476 C1029 620 160 620 160 476"],
  }),
  "diagram-vla.webp": svg({
    title: "Vision-language-action loop",
    subtitle: "One policy sees, names, and moves",
    boxes: [
      { x: 36, y: 168, w: 360, h: 460, kicker: "SEE", title: "Camera frame", lines: ["Novel geometry", "Little demo data", "Floor lighting"] },
      { x: 420, y: 168, w: 360, h: 460, gold: true, kicker: "VLA", title: "Joint policy", lines: ["Language goal", "Visual state", "Motor action"] },
      { x: 804, y: 168, w: 360, h: 460, kicker: "ACT", title: "Dual-arm move", lines: ["Sort, grasp, assemble", "Re-observe next frame", "Limits stay on"] },
    ],
    arrows: ["M396 398 H420", "M780 398 H804"],
  }),
  "diagram-power.webp": svg({
    title: "Cluster power and the shared grid",
    subtitle: "Ratepayer pushback is pushing labs toward dedicated supply",
    boxes: [
      { x: 36, y: 168, w: 340, h: 460, kicker: "LOAD", title: "Training cluster", lines: ["Continuous electrical load", "Cooling water draw", "Region capacity"] },
      { x: 412, y: 168, w: 360, h: 220, kicker: "FRICTION", title: "Municipal utility", lines: ["Rate hikes and permits"] },
      { x: 412, y: 408, w: 360, h: 220, gold: true, kicker: "SUPPLY", title: "Dedicated contract", lines: ["Nuclear, geothermal, solar"] },
      { x: 808, y: 230, w: 356, h: 336, kicker: "CONTRACT", title: "Siting deal", lines: ["Power purchase", "Community terms"] },
    ],
    arrows: ["M376 278 H412", "M376 518 H412", "M772 278 H808", "M772 518 H808"],
  }),
  "diagram-security.webp": svg({
    title: "Least privilege around a desktop agent",
    subtitle: "Screen, shell, and tokens are separate grants",
    boxes: [
      { x: 36, y: 168, w: 340, h: 460, kicker: "AGENT", title: "Background process", lines: ["Wants screen and shell", "Holds no tokens itself"] },
      { x: 412, y: 168, w: 360, h: 220, gold: true, kicker: "GRANT", title: "Screen, scoped", lines: ["One window, time-boxed"] },
      { x: 412, y: 408, w: 360, h: 220, gold: true, kicker: "GRANT", title: "Shell, scoped", lines: ["Allowlisted commands"] },
      { x: 808, y: 230, w: 356, h: 336, kicker: "VAULT", title: "Credentials stay out", lines: ["OS keychain", "Broker attaches tokens"] },
    ],
    arrows: ["M376 278 H412", "M376 518 H412", "M772 278 H808", "M772 518 H808"],
  }),
};

for (const [name, markup] of Object.entries(diagrams)) {
  const dest = path.join(outDir, name);
  await sharp(Buffer.from(markup)).resize(1200, 675).webp({ quality: 86 }).toFile(dest);
  console.log("diagram", name);
}
