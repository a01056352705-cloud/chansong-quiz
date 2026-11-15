import fs from "fs";
let h = fs.readFileSync("src/template.html", "utf8");
function rep(a, b) { if (!h.includes(a)) { console.log("MISSING", a.slice(0, 80)); return; } h = h.replace(a, () => b); }

/* 빈칸 선택: 가장 긴 낱말 중 '마지막'을 비운다 (너무 쉬운 앞 낱말을 피함) */
rep("toks.forEach((w,i)=>{if(w.length>bl){bl=w.length;bi=i}});", "toks.forEach((w,i)=>{if(w.length>=2&&w.length>=bl){bl=w.length;bi=i}});");

/* 보기: 바뀌는 낱말만 크게, 나머지는 흐리게 */
rep("    cur={ans:bi.word,opts:[[bi.word,lab(bi.word)],...wrong.map(w=>[w,lab(w)])]};",
    "    cur={ans:bi.word,opts:[[bi.word,lab(bi.word)],...wrong.map(w=>[w,lab(w)])]};\n    cur.html=w=>bi.toks.map((x,i)=>i===bi.bi?'<b class=\"sw\">'+w+'</b>':'<span class=\"dim\">'+x+'</span>').join(' ');");
rep("const b=document.createElement('button');b.className='opt';b.dataset.v=v;b.textContent=label;",
    "const b=document.createElement('button');b.className='opt';b.dataset.v=v;\n    if(qtype==='blank'&&cur.html)b.innerHTML=cur.html(v);else b.textContent=label;");

/* 정답 팝업: 두 번 눌러도 바로 넘어가지 않게, 뜨면 다음 버튼으로 초점 이동 */
rep("setTimeout(()=>$('pop').classList.add('on'),600);",
    "setTimeout(()=>{$('pop').classList.add('on');const nb=$('pnext');nb.disabled=true;setTimeout(()=>{nb.disabled=false;try{nb.focus()}catch(e){}},900)},600);");
/* 힌트를 쓴 뒤 오답: 남은 보기가 정답임을 알려 줌 */
rep("$('msg').textContent=rnd(RETRY);$('msg').className='slot bad';",
    "const left=[...document.querySelectorAll('.opt')].filter(b=>!b.disabled).length;\n    $('msg').textContent=left===1?'남은 보기가 정답이에요 😊':rnd(RETRY);$('msg').className='slot bad';");

/* 오늘의 찬송: 철에 맞는 곡, 철이 아니면 이야기가 있는 곡 */
rep(`function todayHymn(){
  const d=new Date(),day=Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(d.getFullYear(),0,0))/864e5);
  return H[(day+d.getFullYear())%H.length];
}`, `function seasonPool(d){
  const m=d.getMonth()+1,day=d.getDate();
  const ids=m===12?['xmas']:m===11?['harvest']:m===1?['newyear']:((m===3&&day>=15)||m===4)?['easter']:[];
  const nums=THEMES.filter(t=>ids.includes(t.id)).flatMap(t=>t.nums);
  const p=nums.length?H.filter(x=>nums.includes(x[0])):H.filter(x=>x[2]);
  return p.length?p:H;
}
function todayHymn(){
  const d=new Date(),day=Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(d.getFullYear(),0,0))/864e5);
  const p=seasonPool(d);
  return p[(day+d.getFullYear())%p.length];
}`);

/* 표현을 부드럽게 */
rep('const PRAISE=["할렐루야! 정답이에요","은혜가 넘치네요!","역시 믿음이 깊으세요!","아멘! 잘하셨어요"];', 'const PRAISE=["할렐루야! 정답이에요","은혜가 넘치네요!","아멘! 잘하셨어요","참 잘 아시네요!"];');
rep("answered<3?['🌱','시작이 반이에요']:acc>=.9?['👑','찬양의 달인']:acc>=.7?['📖','찬송 박사']:acc>=.4?['🌿','은혜 가득']:['🌱','함께 배우는 중']",
    "answered<3?['🌱','시작이 반이에요']:acc>=.9?['🌟','찬송에 푹 빠지셨어요']:acc>=.7?['📖','찬송과 가까워졌어요']:acc>=.4?['🌿','은혜 가득']:['🌱','함께 배우는 중']");
rep("const uniq=[...new Set(missed)].slice(0,8);", "const uniq=[...new Set(missed)].slice(0,5);");

/* 접근성: 대화상자 역할, 안내 문구 읽기 */
rep('<div id="pop">', '<div id="pop" role="dialog" aria-modal="true" aria-label="정답 안내">');
rep('<div id="quit">', '<div id="quit" role="dialog" aria-modal="true" aria-label="마치기 확인">');
rep('<div class="slot" id="msg"></div>', '<div class="slot" id="msg" aria-live="polite"></div>');
rep('<button class="listen" style="background:none;color:#1f3355;box-shadow:inset 0 0 0 1.5px #b98a35" onclick="clearSave();goHome()">처음으로 (기록 없이)</button>',
    '<button class="quitlink" onclick="clearSave();goHome()">처음으로 (기록 없이)</button>');

/* 글씨 크기 바꾸기 */
rep('<div class="verse">', '<button class="zoombtn" id="zoomBtn" onclick="cycleZoom()"></button>\n    <div class="verse">');
rep("</script>\n</body>", `const ZL=['글씨 보통','글씨 크게','글씨 아주 크게'];let zi=0;
function applyZoom(i){zi=i;document.body.classList.remove('z1','z2');if(i)document.body.classList.add('z'+i);const b=$('zoomBtn');if(b)b.textContent='🔍 '+ZL[i]+' · 눌러서 바꾸기'}
function cycleZoom(){applyZoom((zi+1)%3);try{localStorage.setItem('chansong-zoom',String(zi))}catch(e){}}
try{applyZoom(Number(localStorage.getItem('chansong-zoom'))||0)}catch(e){applyZoom(0)}
updateResume();
</script>
</body>`);

h = h.replace("</style>", () => `
/* ===== 중간 개선 ===== */
.turn,.qno,.dnum,.rowh .rn{color:#8a6218}
.home{font-size:22px;padding:10px 16px}
.dim{font-weight:600;color:#7d7566}
.sw{color:var(--navy2)}
.opt.ok .dim{color:rgba(255,255,255,.85)}.opt.ok .sw{color:#fff}
.opt.gone{opacity:1;background:#ece5d3;color:#6f6755;text-decoration:line-through;padding-right:90px}
.opt.gone .dim,.opt.gone .sw{color:#6f6755}
.opt.gone::after{content:'지움';position:absolute;right:16px;top:50%;transform:translateY(-50%);font-size:18px;font-weight:700;text-decoration:none;color:#6a6254;background:#fff;border-radius:999px;padding:2px 12px}
.big:disabled{opacity:.55}
.quitlink{display:block;margin:22px auto 0;background:none;color:#665d4f;font-size:20px;text-decoration:underline;padding:8px 12px;font-weight:600}
.zoombtn{display:block;margin:12px auto 0;background:none;color:#b8c4dc;font-size:17px;text-decoration:underline;padding:6px;font-weight:500}
body.z1{zoom:1.12}body.z2{zoom:1.25}
@media (max-height:700px){
  .screen{padding-top:12px}.turn{display:none}
  .card{padding:12px 12px;margin:6px 0 8px}.title{font-size:34px;margin:4px 0 0}.title.story{font-size:23px}
  .q{font-size:18px}.opt{font-size:27px;padding-top:9px;padding-bottom:9px;margin:6px 0}.opt::before{width:34px;height:34px;font-size:19px}
  .tools button{padding:10px 4px;font-size:18px}.slot{min-height:28px;line-height:28px;margin-top:4px}
}
</style>`);
fs.writeFileSync("src/template.html", h);

/* 빌드 스크립트: 제목 띄어쓰기와 이야기 문구 보정 */
let b = fs.readFileSync("src/build.mjs", "utf8");
function repb(a, c) { if (!b.includes(a)) { console.log("MISSING(build)", a.slice(0, 60)); return; } b = b.replace(a, () => c); }
repb("const title = new Map(list);", `// 띄어쓰기가 어색한 제목 보정
const spacing = {369: "죄 짐 맡은 우리 구주", 585: "내 주는 강한 성이요", 383: "눈을 들어 산을 보니", 281: "요나처럼 순종 않고", 610: "고생과 수고가 다 지난 후", 591: "저 밭에 농부 나가"};
for (const e of list) if (spacing[e[0]]) e[1] = spacing[e[0]];
const title = new Map(list);`);
repb('297: "길 잃은 양 한 마리를 찾아 나선 목자의 비유 (누가복음 15장)"', '297: "잃어버린 하나를 찾을 때까지 포기하지 않는 목자의 비유 (누가복음 15장)"');
repb(`383: "'여호와는 너를 지키시는 이'라 노래하며 산을 바라보는 순례자의 시 (시편 121편)"`, `383: "예루살렘을 향해 올라가는 순례자들이 '나의 도움이 어디서 올까' 하고 노래한 시편 121편"`);
repb('164: "무덤이 비어 있고 예수님이 다시 살아나신 아침 (마태복음 28장)"', '164: "안식일이 지난 이른 아침, 여인들이 찾아간 예수님의 무덤이 비어 있던 이야기 (마태복음 28장)"');
repb('149: "골고다 언덕에서 우리 죄를 위해 돌아가신 예수님의 고난"', '149: "골고다 언덕에서 우리 죄를 위해 돌아가신 예수님의 고난 (마태복음 27장)"');
fs.writeFileSync("src/build.mjs", b);
