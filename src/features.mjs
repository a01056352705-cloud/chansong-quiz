import fs from "fs";
let h = fs.readFileSync("src/template.html", "utf8");
function rep(a, b) { if (!h.includes(a)) { console.log("MISSING", a.slice(0, 70)); return; } h = h.replace(a, () => b); }

// 표지 버튼
rep('<button class="cbtn" onclick="startGame()">시작하기</button>',
`<button class="cbtn" onclick="startGame()">계속 풀기</button>
    <button class="cbtn alt" onclick="openThemes()">⭐ 절기별 찬송</button>
    <button class="cbtn alt" onclick="openDaily()">📅 오늘의 찬송</button>
    <button class="cbtn alt" onclick="openShelf()">📖 찬송가 책장</button>`);

// 새 화면 3개
const sections = `<section id="themes" class="screen">
  <div class="top"><button class="home" onclick="goHome()">‹ 처음으로</button><span></span></div>
  <h1>절기별 찬송</h1>
  <div class="orn"><i></i><b></b><i></i></div>
  <div class="sub">풀고 싶은 때를 골라 보세요</div>
  <div id="tgrid"></div>
</section>

<section id="daily" class="screen">
  <div class="top"><button class="home" onclick="goHome()">‹ 처음으로</button><span></span></div>
  <div class="turn" id="ddate"></div>
  <div class="card dcard">
    <div class="dnum" id="dnum"></div>
    <div class="dname" id="dname"></div>
    <div class="dstory" id="dstory"></div>
  </div>
  <div class="tools two">
    <button id="btnSpeakD" onclick="speakDaily()">📢 읽어주기</button>
    <button onclick="listenToday()">🎵 찬송 듣기</button>
  </div>
  <button class="big g" onclick="startDailyQuiz()">🙏 이 찬송으로 문제 풀기</button>
</section>

<section id="shelf" class="screen">
  <div class="top"><button class="home" onclick="goHome()">‹ 처음으로</button><span></span></div>
  <h1>찬송가 책장</h1>
  <div class="orn"><i></i><b></b><i></i></div>
  <input id="sq" type="search" inputmode="search" placeholder="번호나 제목을 입력하세요" oninput="renderShelf()" autocomplete="off">
  <div id="slist"></div>
</section>

`;
rep('<section id="quiz" class="screen">', sections + '<section id="quiz" class="screen">');

// 데이터
rep("const H=__DATA__;", "const H=__DATA__;\nconst ALL=__ALL__;\nconst THEMES=__THEMES__;");
// 출제 풀과 대기열
rep("let qcur,qn=0,answered=0,deck=[],score,tried,cur,qtype,missed=[];", "let qcur,qn=0,answered=0,deck=[],pool=H,queue=null,score,tried,cur,qtype,missed=[];");
rep("function drawItem(){\n  if(!deck.length)deck=shuffle(H.filter(x=>!qcur||x!==qcur.h));", "function drawItem(){\n  if(queue)return queue.shift();\n  if(!deck.length)deck=shuffle(pool.filter(x=>!qcur||x!==qcur.h));");
rep("function startGame(){\n  missed=[];score=0;answered=0;qn=0;qcur=null;deck=shuffle(H);\n  show('quiz');nextQuestion();\n}",
`function startGame(themeId){
  missed=[];score=0;answered=0;qn=0;qcur=null;queue=null;pool=H;
  if(themeId){const t=THEMES.find(x=>x.id===themeId);pool=H.filter(x=>t.nums.includes(x[0]))}
  deck=shuffle(pool);
  show('quiz');nextQuestion();
}
function todayHymn(){
  const d=new Date(),day=Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(d.getFullYear(),0,0))/864e5);
  return H[(day+d.getFullYear())%H.length];
}
function openThemes(){
  $('tgrid').innerHTML='';
  THEMES.forEach(t=>{
    const c=document.createElement('button');c.className='tcard';
    c.innerHTML='<em>'+t.icon+'</em><span><b>'+t.name+'</b><small>'+t.desc+' · '+t.nums.length+'곡</small></span>';
    c.onclick=()=>startGame(t.id);$('tgrid').appendChild(c);
  });
  show('themes');
}
function openDaily(){
  const h=todayHymn(),d=new Date();
  $('ddate').textContent=(d.getMonth()+1)+'월 '+d.getDate()+'일 · 오늘의 찬송';
  $('dnum').textContent=h[0]+'장';$('dname').textContent=h[1];
  $('dstory').textContent=h[2]?'📖 '+h[2]:'오늘 하루, 이 찬송을 한 번 불러 보세요 🙏';
  show('daily');
}
function startDailyQuiz(){
  const h=todayHymn();
  missed=[];score=0;answered=0;qn=0;qcur=null;pool=H;deck=[];
  queue=[{h,t:'num'},{h,t:'title'}];if(h[2])queue.push({h,t:'story'});
  show('quiz');nextQuestion();
}
function openShelf(){show('shelf');renderShelf()}
function renderShelf(){
  const v=$('sq').value.trim().replace(/\\s+/g,'');
  let r=ALL;
  if(v)r=/^\\d+$/.test(v)?ALL.filter(x=>String(x[0]).startsWith(v)):ALL.filter(x=>x[1].replace(/\\s+/g,'').includes(v));
  const more=r.length>40;r=r.slice(0,40);
  $('slist').innerHTML=r.length?r.map(x=>'<div class="rowh"><div class="rn">'+x[0]+'장</div><div class="rt">'+x[1]+'</div><button onclick="listenHymn('+x[0]+')">▶</button></div>').join('')+(more?'<div class="sub">더 찾으려면 번호나 제목을 더 입력하세요</div>':''):'<div class="sub">찾는 찬송이 없어요</div>';
}
function ytSearch(n,t){window.open('https://www.youtube.com/results?search_query='+encodeURIComponent('새찬송가 '+n+'장 '+t),'_blank','noopener')}
function listenHymn(n){const x=ALL.find(y=>y[0]===n);if(x)ytSearch(x[0],x[1])}
function listenToday(){const h=todayHymn();ytSearch(h[0],h[1])}
async function speakDaily(){
  if(voiceOn){stopVoice();return}
  stopVoice();const tok=voiceTok;voiceOn=true;setSpeakBtn();
  const h=todayHymn();
  try{for(const u of ['audio/nm/'+h[0]+'.mp3','audio/t/'+h[0]+'.mp3']){if(tok!==voiceTok)return;await playOne(u,tok);await sleep(250)}}
  catch(e){if(tok===voiceTok)await new Promise(res=>{if(!('speechSynthesis' in window))return res();const u=new SpeechSynthesisUtterance(h[0]+'장. '+h[1]);u.lang='ko-KR';u.onend=()=>res();speechSynthesis.speak(u)})}
  if(tok===voiceTok){voiceOn=false;setSpeakBtn()}
}`);
rep("function nextQ(){\n  $('pop').classList.remove('on');stopVoice();\n  nextQuestion();", "function nextQ(){\n  $('pop').classList.remove('on');stopVoice();\n  if(queue&&!queue.length)return finish();\n  nextQuestion();");
rep("function setSpeakBtn(){$('btnSpeak').textContent=voiceOn?'⏹ 멈추기':'📢 읽어주기'}", "function setSpeakBtn(){const l=voiceOn?'⏹ 멈추기':'📢 읽어주기';$('btnSpeak').textContent=l;const d=$('btnSpeakD');if(d)d.textContent=l}");
rep("$('rmsg').textContent='끝까지 함께해 주셔서 감사해요. 할렐루야 🙏';", "$('rmsg').textContent=queue?'오늘의 찬송과 더 가까워지셨어요. 할렐루야 🙏':'끝까지 함께해 주셔서 감사해요. 할렐루야 🙏';");
rep("function listen(){\n  const h=qcur.h;\n  window.open('https://www.youtube.com/results?search_query='+encodeURIComponent('새찬송가 '+h[0]+'장 '+h[1]),'_blank','noopener');\n}", "function listen(){const h=qcur.h;ytSearch(h[0],h[1])}");

const css = `
/* ===== 새 기능: 표지 버튼, 절기별, 오늘의 찬송, 책장 ===== */
.arch{width:140px;height:186px;border-radius:70px 70px 7px 7px}
.arch-in{border-radius:64px 64px 3px 3px}
.cv{height:72px;width:12px;margin-left:-6px}.ch{width:44px;height:12px;margin-left:-22px}
.cover-in{padding-top:20px}
.eyebrow{margin-top:14px;font-size:17px}
.cover-title{font-size:38px;margin:4px 0 2px}
.orn{margin:6px 0 8px}
.tag{font-size:18px;margin-bottom:14px;line-height:1.5}
.cbtn{font-size:27px;padding:15px 18px;margin:10px 0;letter-spacing:.12em}
.cbtn.alt{font-size:22px;padding:13px 16px;letter-spacing:.04em;color:#fff6df;background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1.5px rgba(233,207,148,.6)}
.verse{margin-top:14px;font-size:16px}
.tcard{display:flex;align-items:center;gap:16px;width:100%;margin:12px 0;padding:18px 18px;border-radius:22px;text-align:left;color:var(--navy2);background:#fff;box-shadow:inset 0 0 0 1.5px rgba(185,138,53,.6),0 12px 24px -18px rgba(31,51,85,.5)}
.tcard em{font-style:normal;font-size:44px;width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:var(--soft);flex:none}
.tcard b{display:block;font-size:29px;font-family:"Nanum Myeongjo","Noto Serif KR",serif}
.tcard small{display:block;font-size:20px;color:var(--mute);font-weight:500;line-height:1.35;margin-top:2px}
.dcard{padding:26px 16px}
.dnum{font-family:"Nanum Myeongjo","Noto Serif KR",serif;font-size:64px;font-weight:800;color:var(--gold);line-height:1.1}
.dname{font-family:"Nanum Myeongjo","Noto Serif KR",serif;font-size:36px;font-weight:800;color:var(--navy);margin:6px 0 14px;line-height:1.25;text-wrap:balance}
.dstory{font-size:23px;line-height:1.55;color:var(--mute);background:var(--soft);border-radius:16px;padding:12px 14px}
.tools.two button{font-size:22px;padding:14px 6px}
#daily .big{margin-top:16px}
#sq{display:block;width:100%;font-size:28px;padding:16px 20px;border-radius:999px;border:0;background:#fff;box-shadow:inset 0 0 0 1.5px rgba(185,138,53,.7);outline:none;color:var(--navy2);text-align:center;margin:6px 0 12px;font-family:inherit}
#sq:focus{box-shadow:inset 0 0 0 2.5px var(--navy)}
.rowh{display:flex;align-items:center;gap:12px;padding:10px 12px 10px 16px;margin:8px 0;border-radius:16px;background:#fff;text-align:left;box-shadow:inset 0 0 0 1px rgba(185,138,53,.45)}
.rowh .rn{flex:none;min-width:76px;font-family:"Nanum Myeongjo","Noto Serif KR",serif;font-weight:800;font-size:25px;color:var(--gold)}
.rowh .rt{flex:1;font-size:24px;font-weight:700;color:var(--navy2);line-height:1.3}
.rowh button{flex:none;width:52px;height:52px;border-radius:50%;font-size:22px;background:linear-gradient(145deg,#2c4a7c,var(--navy2))}
`;
h = h.replace("</style>", () => css + "</style>");
fs.writeFileSync("src/template.html", h);
