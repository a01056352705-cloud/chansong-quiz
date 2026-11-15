import fs from "fs";
let h=fs.readFileSync("src/template.html","utf8");
function rep(a,b){if(!h.includes(a)){console.log("MISSING",a.slice(0,70));return}h=h.replace(a,()=>b)}
// 상태와 출제 방식: 끝없이 이어서 출제
rep("let qs,idx,score,tried,cur,qtype,missed=[];",
`let qcur,qn=0,answered=0,deck=[],score,tried,cur,qtype,missed=[];
function drawItem(){
  if(!deck.length)deck=shuffle(H.filter(x=>!qcur||x!==qcur.h));
  const h=deck.pop();
  return {h,t:h[2]?rnd(['story','story','title','num']):rnd(['title','num'])};
}
function nextQuestion(){qn++;qcur=drawItem();render()}`);
const a=h.indexOf("function startGame(){"),b=h.indexOf("function pickOthers");
h=h.slice(0,a)+`function startGame(){
  missed=[];score=0;answered=0;qn=0;qcur=null;deck=shuffle(H);
  show('quiz');nextQuestion();
}
`+h.slice(b);
rep("const {h,t}=qs[idx];tried=false;qtype=t;","const {h,t}=qcur;tried=false;qtype=t;");
rep("$('barfill').style.width=((idx+1)*10)+'%';$('prog').textContent=(idx+1)+' / 10 문제';","$('barfill').style.width=(((qn-1)%10+1)*10)+'%';$('prog').textContent=qn+'번째 문제 · 맞힌 '+score+'개';");
rep("const {h}=qs[idx];\n  if(v===cur.ans){","const {h}=qcur;\n  if(v===cur.ans){");
rep("if(!tried)score++;","if(!tried)score++;answered++;$('prog').textContent=qn+'번째 문제 · 맞힌 '+score+'개';");
rep("$('ptxt').textContent=tried?'끝까지 해내셨어요!\n두 번째 도전 성공! 👏':rnd(PRAISE);","$('ptxt').textContent=(answered%10===0?'🎉 '+answered+'문제 달성!\n':'')+(tried?'끝까지 해내셨어요!\n두 번째 도전 성공! 👏':rnd(PRAISE));");
rep("    $('pnext').textContent=idx===9?'결과 보기 ▶':'다음 문제 ▶';\n","");
// nextQ, finish
const c=h.indexOf("function nextQ(){"),d=h.indexOf("function showHint(){");
h=h.slice(0,c)+`function nextQ(){
  $('pop').classList.remove('on');stopVoice();
  nextQuestion();
}
function finishNow(){
  closeQuit();stopVoice();$('pop').classList.remove('on');
  if(answered===0)goHome();else finish();
}
function finish(){
  show('result');
  const acc=score/answered;
  const [ri,rn]=answered<3?['🌱','시작이 반이에요']:acc>=.9?['👑','찬양의 달인']:acc>=.7?['📖','찬송 박사']:acc>=.4?['🌿','은혜 가득']:['🌱','함께 배우는 중'];
  $('rtitle').textContent=answered+'문제를 푸셨어요!';
  $('rrank').innerHTML='<span>'+ri+'</span> '+rn;
  $('rmsg').textContent='끝까지 함께해 주셔서 감사해요. 할렐루야 🙏';
  $('rscore').innerHTML='<div class="sbox">한 번에 맞힌 개수<small>'+answered+'문제 중</small><span>'+score+'개</span></div>';
  const uniq=[...new Set(missed)].slice(0,8);
  $('rreview').innerHTML=uniq.length
    ?'<div class="rvh">🎼 다시 불러보면 좋은 찬송</div>'+uniq.map(m=>'<div class="rv"><b>'+m[1]+'</b><span>'+m[0]+'장</span></div>').join('')
    :'<div class="rvh">🎉 한 곡도 안 틀렸어요! 대단해요</div>';
  chime();setTimeout(applause,500);
}
`+h.slice(d);
h=h.split("qs[idx]").join("qcur");
// 종료 확인창
rep("function askQuit(){$('quit').classList.add('on')}","function askQuit(){$('qinfo').textContent=answered?'지금까지 '+answered+'문제를 푸셨어요':'아직 푼 문제가 없어요';$('quit').classList.add('on')}");
const e=h.indexOf('<div id="quit">'),f=h.indexOf("<script>");
h=h.slice(0,e)+`<div id="quit"><div class="pbox"><div class="t">여기서 마칠까요?</div><div class="ans" id="qinfo"></div>
  <button class="big g" onclick="closeQuit()">계속할래요 😊</button>
  <button class="big" onclick="finishNow()">결과 볼래요</button>
  <button class="listen" style="background:none;color:#1f3355;box-shadow:inset 0 0 0 1.5px #b98a35" onclick="goHome()">처음으로 (기록 없이)</button></div></div>

`+h.slice(f);
rep('‹ 처음으로','‹ 마치기');
rep("<b>__COUNT__곡</b> 수록 · 틀려도 괜찮아요","<b>__COUNT__곡</b> 수록 · 원하는 만큼 계속 풀어요");
rep('<div style="font-size:84px">🕊️</div>\n  <h1 id="rtitle">은혜로운 시간이었어요</h1>','<div style="font-size:84px">🕊️</div>\n  <h1 id="rtitle">은혜로운 시간이었어요</h1>');
fs.writeFileSync("src/template.html",h);
