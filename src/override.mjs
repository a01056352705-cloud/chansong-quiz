import fs from "fs";
// 자동으로 고른 빈칸 낱말이 어색한 곡은 직접 지정한다 (곡 번호 → 비울 낱말)
const OV = {1: "근원", 31: "복되신", 94: "귀한", 121: "구주", 184: "불길", 295: "빠진", 324: "오라", 369: "맡은", 383: "산을", 585: "강한", 588: "나는", 591: "농부", 610: "지난", 639: "함께"};
let h = fs.readFileSync("src/template.html", "utf8");
const a = "  const toks=h[1].split(/\\s+/);let bi=-1,bl=1;\n";
if (!h.includes(a)) throw new Error("template marker missing");
h = h.replace(a, () => a + "  const ov=BLANK_OV[h[0]];if(ov){const k=toks.indexOf(ov);if(k>=0)return {toks,bi:k,word:toks[k]}}\n");
h = h.replace("function blankInfo(h){", () => "const BLANK_OV=" + JSON.stringify(OV) + ";\nfunction blankInfo(h){");
fs.writeFileSync("src/template.html", h);

let g = fs.readFileSync("C:/Users/nomus/AppData/Local/Temp/claude/3de43aadf20a6ed2/60ca3c49-f119-4615-a016-1524c57f3ad0/scratchpad/tts/gen8.mjs", "utf8");
g = g.replace("function blankInfo(t) {\n  const toks = t.split(/\\s+/); let bi = -1, bl = 1;",
  () => "const OV = " + JSON.stringify(OV) + ";\nfunction blankInfo(t, n) {\n  const toks = t.split(/\\s+/); let bi = -1, bl = 1;\n  if (OV[n]) { const k = toks.indexOf(OV[n]); if (k >= 0) return {toks, bi: k, word: toks[k]}; }");
g = g.replace("data.map(d => blankInfo(d[1]).word)", () => "data.map(d => blankInfo(d[1], d[0]).word)");
g = g.replace("const b = blankInfo(t);", () => "const b = blankInfo(t, n);");
fs.writeFileSync("C:/Users/nomus/AppData/Local/Temp/claude/3de43aadf20a6ed2/60ca3c49-f119-4615-a016-1524c57f3ad0/scratchpad/tts/gen8.mjs", g);
console.log("ok", g.includes("blankInfo(t, n)"), g.includes("blankInfo(d[1], d[0])"));
