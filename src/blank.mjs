import fs from "fs";
let h = fs.readFileSync("src/template.html", "utf8");
function rep(a, b) { if (!h.includes(a)) { console.log("MISSING", a.slice(0, 80)); return; } h = h.replace(a, () => b); }

// 출제: 제목 빈칸 + 성경 이야기
rep("return {h,t:h[2]?rnd(['story','story','title','num']):rnd(['title','num'])};",
    "return {h,t:h[2]?rnd(['story','story','blank']):'blank'};");
rep("queue=[{h,t:'num'},{h,t:'title'}];if(h[2])queue.push({h,t:'story'});",
    "queue=[{h,t:'blank'}];if(h[2])queue.push({h,t:'story'});shuffle(H.filter(x=>x!==h)).slice(0,2).forEach(x=>queue.push({h:x,t:'blank'}));");

// 빈칸 계산 + 보기 고르기 + 화면 구성
const a = h.indexOf("function pickOthers(h,n,keyFn){");
const b = h.indexOf("  $('msg').textContent='';$('msg').className='slot';$('btnHint').disabled=false;");
h = h.slice(0, a) + `function blankInfo(h){
  // 제목에서 가장 긴 낱말(2글자 이상)을 빈칸으로 만든다. 없으면 제목 전체
  const toks=h[1].split(/\\s+/);let bi=-1,bl=1;
  toks.forEach((w,i)=>{if(w.length>bl){bl=w.length;bi=i}});
  return bi<0?{toks:[h[1]],bi:0,word:h[1]}:{toks,bi,word:toks[bi]};
}
const BW=[...new Set(H.map(x=>blankInfo(x).word))];
function pickOthers(h,n,keyFn){
  return shuffle(H.filter(x=>x!==h)).sort((a,b)=>Math.abs(keyFn(a)-keyFn(h))-Math.abs(keyFn(b)-keyFn(h))+(Math.random()-.5)*3).slice(0,n);
}
const lenKey=x=>x[1].length;
function render(){
  stopVoice();
  const {h,t}=qcur;tried=false;qtype=t;
  $('barfill').style.width=(((qn-1)%10+1)*10)+'%';$('prog').textContent=qn+'번째 문제 · 맞힌 '+score+'개';
  $('qtitle').className='title';
  if(t==='blank'){
    const bi=blankInfo(h);
    const wrong=shuffle(BW.filter(w=>w!==bi.word)).sort((a,b)=>Math.abs(a.length-bi.word.length)-Math.abs(b.length-bi.word.length)+(Math.random()-.5)*3).slice(0,2);
    const lab=w=>bi.toks.map((x,i)=>i===bi.bi?w:x).join(' ');
    $('qlabel').textContent='🎶 빈칸에 들어갈 말은 무엇일까요?';
    $('qno').textContent=h[0]+'장';
    $('qtitle').innerHTML=bi.toks.map((x,i)=>i===bi.bi?'<span class="blank">&nbsp;</span>':x).join(' ');
    cur={ans:bi.word,opts:[[bi.word,lab(bi.word)],...wrong.map(w=>[w,lab(w)])]};
  }else{
    $('qlabel').textContent='📖 이 이야기와 어울리는 찬송은?';
    $('qno').textContent='';
    $('qtitle').textContent=h[2];$('qtitle').className='title story';
    cur={ans:h[1],opts:[[h[1],h[1]],...pickOthers(h,2,lenKey).map(x=>[x[1],x[1]])]};
  }
` + h.slice(b);

// 읽어주기: 보기에서는 빈칸에 들어갈 낱말만 읽는다
rep("    const o=hymnOf(b.dataset.v);\n    seq.push('audio/n/'+(i+1)+'.mp3',qtype==='num'?'audio/nm/'+o[0]+'.mp3':'audio/t/'+o[0]+'.mp3');",
    "    const v=b.dataset.v;\n    seq.push('audio/n/'+(i+1)+'.mp3',qtype==='blank'?'audio/w/'+(BW.indexOf(v)+1)+'.mp3':'audio/t/'+hymnOf(v)[0]+'.mp3');");
rep("map((b,i)=>['일','이','삼'][i]+', '+b.textContent)", "map((b,i)=>['일','이','삼'][i]+', '+(qtype==='blank'?b.dataset.v:b.textContent))");
rep("const lines=qtype==='num'?[h[1]+'.','몇 장일까요?',ops]:qtype==='title'?[h[0]+'장.','어떤 찬송일까요?',ops]:[h[2]+'.','어울리는 찬송은 무엇일까요?',ops];",
    "const lines=qtype==='blank'?[h[1].replace(blankInfo(h).word,'빈칸')+'.','빈칸에 들어갈 말은 무엇일까요?',ops]:[h[2]+'.','어울리는 찬송은 무엇일까요?',ops];");

// 카드에 장 번호 표시(참고용) + 빈칸 모양
rep('<div class="q" id="qlabel"></div>', '<div class="q" id="qlabel"></div>\n    <div class="qno" id="qno"></div>');
h = h.replace("</style>", () => `.qno{font-family:"Nanum Myeongjo","Noto Serif KR",serif;color:var(--gold);font-size:22px;font-weight:800;margin-top:4px}
.qno:empty{display:none}
.blank{display:inline-block;min-width:2.6em;border-bottom:5px solid var(--gold);color:transparent;margin:0 .1em}
</style>`);
fs.writeFileSync("src/template.html", h);
