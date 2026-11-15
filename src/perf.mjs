import fs from "fs";
let h = fs.readFileSync("src/template.html", "utf8");
const a = h.indexOf("function pickWrongWords(bi,lab,h){");
const b = h.indexOf("const themeIds=");
if (a < 0 || b < 0) throw new Error("markers");
h = h.slice(0, a) + `function pickWrongWords(bi,lab,h){
  // 점수가 좋은 후보부터 하나씩 검사해서, 필요한 2개를 찾으면 바로 멈춘다 (폰에서도 빠르게)
  const sc=new Map();
  const base=BW.filter(w=>w!==bi.word);
  base.forEach(w=>sc.set(w,(w.slice(-1)===bi.word.slice(-1)?-3:0)+Math.abs(w.length-bi.word.length)+Math.random()*2));
  base.sort((x,y)=>sc.get(x)-sc.get(y));
  const out=[];
  for(const w of base){if(out.length>=2)break;if(!tooClose(lab(w),h))out.push(w)}
  for(const w of base){if(out.length>=2)break;if(!out.includes(w))out.push(w)}
  return out;
}
` + h.slice(b);
h = h.replace("return REAL.some(([t,tn])=>t!==h[1]&&(tn===n||lev(tn,n)<=2))", () => "return REAL.some(([t,tn])=>t!==h[1]&&(tn===n||(Math.abs(tn.length-n.length)<=2&&lev(tn,n)<=2)))");
fs.writeFileSync("src/template.html", h);
console.log("ok", h.includes("Math.abs(tn.length-n.length)<=2"));
