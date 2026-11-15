import fs from "fs";
let h = fs.readFileSync("src/template.html", "utf8");
function rep(a, b) { if (!h.includes(a)) { console.log("MISSING", a.slice(0, 80)); return; } h = h.replace(a, () => b); }

/* 1. 문제 중 '찬송 듣기'는 정답을 알려 주므로 문제 화면에서 뺀다(정답 팝업에서만 열림) */
rep('\n    <button onclick="listen()">🎵 찬송 듣기</button>\n  </div>\n  <div id="opts"></div>', '\n  </div>\n  <div id="opts"></div>');

/* 4. 안내 문구를 한 줄로 줄여 보기 버튼이 밀리지 않게 */
rep('const RETRY=["괜찮아요! 천천히 다시 골라보세요 😊","거의 다 왔어요! 다시 골라보세요 😊","아깝다! 한 번 더 기회예요 😊"];',
    'const RETRY=["다시 골라보세요 😊","한 번 더 기회예요 😊","거의 다 왔어요 😊"];');
rep("$('msg').textContent='✨ 틀린 보기 하나를 지웠어요!';", "$('msg').textContent='✨ 보기 하나를 지웠어요';");

/* 2·3. 어색하거나 실제 다른 찬송 제목이 되는 틀린 보기를 걸러낸다 */
rep("const lenKey=x=>x[1].length;", `const lenKey=x=>x[1].length;
const NORM=s=>s.replace(/\\s+/g,'');
const REAL=ALL.map(x=>[x[1],NORM(x[1])]);
function lev(a,b){
  const m=a.length,n=b.length;let p=[...Array(n+1).keys()];
  for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}
  return p[n];
}
// 실제 다른 찬송 제목과 같거나 비슷하면(글자 2개 이하 차이) 보기로 쓰지 않는다
function tooClose(label,h){const n=NORM(label);return REAL.some(([t,tn])=>t!==h[1]&&(tn===n||lev(tn,n)<=2))}
function pickWrongWords(bi,lab,h){
  const base=BW.filter(w=>w!==bi.word);
  let c=base.filter(w=>!tooClose(lab(w),h));
  if(c.length<2)c=base;
  const sc=w=>(w.slice(-1)===bi.word.slice(-1)?-3:0)+Math.abs(w.length-bi.word.length)+Math.random()*2;
  return c.sort((a,b)=>sc(a)-sc(b)).slice(0,2);
}
const themeIds=h=>THEMES.filter(t=>t.nums.includes(h[0])).map(t=>t.id);
const SAYEON=new Set([23,258,305,369,438,585]);`);
rep("    const wrong=shuffle(BW.filter(w=>w!==bi.word)).sort((a,b)=>Math.abs(a.length-bi.word.length)-Math.abs(b.length-bi.word.length)+(Math.random()-.5)*3).slice(0,2);",
    "    const lab=w=>bi.toks.map((x,i)=>i===bi.bi?w:x).join(' ');\n    const wrong=pickWrongWords(bi,lab,h);");
rep("    const lab=w=>bi.toks.map((x,i)=>i===bi.bi?w:x).join(' ');\n    $('qlabel')", "    $('qlabel')");
rep("    cur={ans:h[1],opts:[[h[1],h[1]],...pickOthers(h,2,lenKey).map(x=>[x[1],x[1]])]};",
`    // 같은 절기의 찬송은 보기에서 빼서 정답이 겹치지 않게 한다
    const mine=themeIds(h);
    let others=H.filter(x=>x!==h&&x[1]!==h[1]&&!themeIds(x).some(id=>mine.includes(id)));
    if(others.length<2)others=H.filter(x=>x!==h);
    const two=shuffle(others).sort((a,b)=>Math.abs(lenKey(a)-lenKey(h))-Math.abs(lenKey(b)-lenKey(h))+(Math.random()-.5)*3).slice(0,2);
    cur={ans:h[1],opts:[[h[1],h[1]],...two.map(x=>[x[1],x[1]])]};`);
rep("$('qlabel').textContent='📖 이 이야기와 어울리는 찬송은?';", "$('qlabel').textContent=SAYEON.has(h[0])?'📖 이 사연과 어울리는 찬송은?':'📖 이 이야기와 어울리는 찬송은?';");

/* 5. 폰의 뒤로 가기, 이어서 풀기(기록 저장) */
rep("function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));$(id).classList.add('on');window.scrollTo(0,0)}",
`let navPushed=false;
function pushNav(){if(!navPushed){try{history.pushState({app:1},'')}catch(e){}navPushed=true}}
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));$(id).classList.add('on');window.scrollTo(0,0);
  if(id!=='start')pushNav();else updateResume();
}
// 폰의 뒤로 가기: 문제를 푸는 중이면 마칠지 먼저 묻고, 다른 화면이면 처음 화면으로
window.addEventListener('popstate',()=>{
  navPushed=false;
  const on=document.querySelector('.screen.on');
  if(!on||on.id==='start')return;
  if(on.id==='quiz'){
    if($('quit').classList.contains('on'))closeQuit();else if($('pop').classList.contains('on')){/* 정답 팝업은 그대로 */}else askQuit();
    pushNav();return;
  }
  stopVoice();show('start');
});
const SAVE_KEY='chansong-quiz-save';
function saveSession(){
  if(queue)return;
  try{localStorage.setItem(SAVE_KEY,JSON.stringify({theme:lastTheme,score,answered,missed:missed.map(m=>m[0])}))}catch(e){}
}
function loadSave(){try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');return s&&s.answered>0?s:null}catch(e){return null}}
function clearSave(){try{localStorage.removeItem(SAVE_KEY)}catch(e){}}
function updateResume(){
  const b=$('resumeBtn');if(!b)return;
  const s=loadSave();
  b.style.display=s?'':'none';
  if(s)b.textContent='▶ 이어서 풀기 ('+s.answered+'문제 푼 상태)';
}
function resumeGame(){const s=loadSave();if(s)startGame(s.theme,s)}
function replay(){lastDaily?startDailyQuiz():startGame(lastTheme)}`);
rep("let qcur,qn=0,answered=0,deck=[],pool=H,queue=null,score,tried,cur,qtype,missed=[];",
    "let qcur,qn=0,answered=0,deck=[],pool=H,queue=null,score,tried,cur,qtype,missed=[],lastTheme=null,lastDaily=false;");
rep("function startGame(themeId){\n  missed=[];score=0;answered=0;qn=0;qcur=null;queue=null;pool=H;\n  if(themeId){const t=THEMES.find(x=>x.id===themeId);pool=H.filter(x=>t.nums.includes(x[0]))}",
`function startGame(themeId,resume){
  missed=[];score=0;answered=0;qn=0;qcur=null;queue=null;pool=H;lastTheme=themeId||null;lastDaily=false;
  $('qturn').textContent='찬송가 퀴즈';
  if(themeId){const t=THEMES.find(x=>x.id===themeId);pool=H.filter(x=>t.nums.includes(x[0]));$('qturn').textContent=t.name+' 찬송'}
  if(resume){score=resume.score;answered=resume.answered;qn=resume.answered;missed=resume.missed.map(n=>H.find(x=>x[0]===n)).filter(Boolean)}`);
rep("  missed=[];score=0;answered=0;qn=0;qcur=null;pool=H;deck=[];\n  queue=[{h,t:'blank'}];",
    "  missed=[];score=0;answered=0;qn=0;qcur=null;pool=H;deck=[];lastDaily=true;$('qturn').textContent='오늘의 찬송';\n  queue=[{h,t:'blank'}];");
rep("if(!tried)score++;answered++;$('prog').textContent=qn+'번째 문제 · 맞힌 '+score+'개';", "if(!tried)score++;answered++;$('prog').textContent=qn+'번째 문제 · 맞힌 '+score+'개';saveSession();");
rep("function finish(){\n  show('result');", "function finish(){\n  clearSave();show('result');");

// HTML
rep('<div class="turn">오늘의 찬송</div>', '<div class="turn" id="qturn">찬송가 퀴즈</div>');
rep('<button class="cbtn" onclick="startGame()">계속 풀기</button>', '<button class="cbtn alt" id="resumeBtn" style="display:none" onclick="resumeGame()"></button>\n    <button class="cbtn" onclick="startGame()">계속 풀기</button>');
rep('onclick="startGame()">🔁 다시 하기</button>', 'onclick="replay()">🔁 다시 하기</button>');
rep('onclick="goHome()">처음으로 (기록 없이)</button>', 'onclick="clearSave();goHome()">처음으로 (기록 없이)</button>');
h = h.replace("</style>", () => `.slot{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tools button{font-size:21px;padding:14px 6px}
</style>`);
fs.writeFileSync("src/template.html", h);
