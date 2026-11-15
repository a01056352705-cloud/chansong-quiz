import fs from "fs";
let h=fs.readFileSync("src/template.html","utf8");
function rep(a,b){if(!h.includes(a)){console.log("MISSING",a.slice(0,60));return}h=h.replace(a,()=>b)}
// 표지: 아치형 창 + 빛
const a=h.indexOf('<div class="cover-in">'),b=h.indexOf('</section>',a);
h=h.slice(0,a)+`<div class="cover-in">
    <div class="arch"><div class="arch-in"><i class="rays"></i><i class="cv"></i><i class="ch"></i></div></div>
    <div class="eyebrow">은혜의 노래</div>
    <h1 class="cover-title">찬송가 퀴즈</h1>
    <div class="orn"><i></i><b></b><i></i></div>
    <div class="tag">찬송 한 곡에 담긴 은혜와 성경 이야기<br><b>__COUNT__곡</b> 수록 · 틀려도 괜찮아요</div>
    <button class="cbtn" onclick="startGame()">시작하기</button>
    <div class="verse">"여호와를 찬양하라 그는 선하시며"<br>시편 135:3</div>
  </div>
`+h.slice(b);
rep('<div class="turn">🕊️ 오늘도 은혜로운 시간</div>','<div class="turn">오늘의 찬송</div>');
rep('<button class="home" onclick="askQuit()">🏠 처음으로</button>','<button class="home" onclick="askQuit()">‹ 처음으로</button>');
const css=`
/* ===== 교회 분위기의 세련된 디자인 ===== */
:root{--ink:#222b3a;--navy:#1f3355;--navy2:#162540;--gold:#b98a35;--gold2:#e9cf94;--soft:#f3ede0;--mute:#6a6254}
body{background:linear-gradient(180deg,#fdfaf3,#f6efe0) fixed;font-family:"Pretendard","Noto Sans KR","Malgun Gothic",sans-serif}
.screen{padding-top:20px}
h1,.title,.pbox .t{font-family:"Nanum Myeongjo","Noto Serif KR","Batang",serif}
/* 표지 */
#start.screen{background:radial-gradient(700px 480px at 50% 24%,rgba(233,207,148,.38),transparent 62%),linear-gradient(180deg,#101c33,#1f3355 62%,#2a446f)}
#start::before{opacity:.12}
.cover-in{padding-top:30px}
.arch{position:relative;width:176px;height:236px;margin:6px auto 0;padding:7px;border-radius:88px 88px 8px 8px;background:linear-gradient(160deg,#f6e2a8,#b98a35 55%,#e9cf94);box-shadow:0 24px 44px -12px rgba(0,0,0,.6),0 0 60px 6px rgba(233,207,148,.25)}
.arch-in{position:relative;width:100%;height:100%;overflow:hidden;border-radius:81px 81px 3px 3px;background:radial-gradient(circle at 50% 36%,#fffdf0 0,#fff1c9 28%,#9db6dc 78%,#5b7db3 100%)}
.rays{position:absolute;inset:0;background:repeating-conic-gradient(from 0deg at 50% 36%,rgba(255,255,255,.55) 0 7deg,transparent 7deg 22deg);opacity:.5}
.cv,.ch{position:absolute;background:linear-gradient(145deg,#d9a441,#9a6d1f);border-radius:3px;box-shadow:0 2px 6px rgba(80,50,10,.35)}
.cv{left:50%;top:26%;width:14px;height:96px;margin-left:-7px}
.ch{left:50%;top:38%;width:58px;height:14px;margin-left:-29px}
.eyebrow{margin-top:22px;font-size:19px;letter-spacing:.34em;color:var(--gold2);font-weight:600}
.cover-title{font-size:44px;margin:8px 0 4px;color:#fff6df;letter-spacing:.04em;text-shadow:0 2px 0 rgba(0,0,0,.3),0 10px 28px rgba(0,0,0,.4)}
.orn{display:flex;align-items:center;justify-content:center;gap:12px;margin:8px 0 14px}
.orn i{display:block;width:56px;height:1.5px;background:linear-gradient(90deg,transparent,var(--gold2),transparent)}
.orn b{display:block;width:9px;height:9px;background:var(--gold2);transform:rotate(45deg)}
.tag{font-size:21px;color:#dfe6f3;margin-bottom:22px}
.cbtn{font-size:30px;font-weight:700;letter-spacing:.2em;padding:20px 18px;border-radius:999px;background:linear-gradient(145deg,#f3dc9f,#c4953f);color:#2a1d08;box-shadow:0 16px 30px -12px rgba(0,0,0,.7),inset 0 0 0 2px rgba(255,255,255,.35)}
.verse{margin-top:24px;font-family:"Nanum Myeongjo","Noto Serif KR",serif;font-size:18px;line-height:1.7;color:#b8c4dc}
/* 문제 화면 */
.home{background:transparent;color:var(--navy);box-shadow:inset 0 0 0 1.5px rgba(185,138,53,.6)}
#prog{background:transparent;color:var(--navy);font-family:"Nanum Myeongjo","Noto Serif KR",serif;font-weight:800}
.bar{height:6px;background:#e8e0cc}
.bar i{background:linear-gradient(90deg,var(--gold),var(--navy))}
.turn{display:flex;align-items:center;justify-content:center;gap:14px;background:none;box-shadow:none;color:var(--gold);padding:0;margin:16px 0 6px;font-family:"Nanum Myeongjo","Noto Serif KR",serif;font-size:21px;letter-spacing:.3em;font-weight:700}
.turn::before,.turn::after{content:'';flex:0 0 40px;height:1.5px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
.card{border-radius:22px;padding:18px 14px;background:linear-gradient(180deg,#fffdf8,#fff);box-shadow:inset 0 0 0 1.5px rgba(185,138,53,.55),0 18px 34px -24px rgba(31,51,85,.45)}
.title{color:var(--navy)}
.q{letter-spacing:.02em}
.tools button{background:#fff;color:var(--navy);box-shadow:inset 0 0 0 1.5px rgba(185,138,53,.5)}
.opt{border-radius:18px;background:#fff;color:var(--navy2);box-shadow:inset 0 0 0 1.5px rgba(185,138,53,.65),0 10px 20px -16px rgba(31,51,85,.5)}
.opt::before{background:var(--navy);color:#fff;font-family:"Nanum Myeongjo","Noto Serif KR",serif}
.opt.ok::before{background:rgba(255,255,255,.28)}
.slot{color:var(--navy)}
.slot.bad{color:#8a3040}
/* 팝업·결과 */
.pbox{border-radius:26px;box-shadow:inset 0 0 0 1.5px rgba(185,138,53,.6),0 30px 60px -20px rgba(0,0,0,.45)}
.pbox .t{color:var(--navy)}
.ans b{color:var(--navy);font-family:"Nanum Myeongjo","Noto Serif KR",serif}
.big{border-radius:999px;background:linear-gradient(145deg,#2c4a7c,var(--navy2))}
.big.g{background:linear-gradient(145deg,#4f8f74,#357057)}
.listen{border-radius:999px;background:linear-gradient(145deg,#f3dc9f,#c4953f)}
.rank{background:linear-gradient(135deg,#f3dc9f,#c4953f);color:#2a1d08}
.sbox,.rv{box-shadow:inset 0 0 0 1.5px rgba(185,138,53,.5)}
h1{color:var(--navy)}
#start h1{color:#fff6df}
`;
h=h.replace("</style>",()=>css+"</style>");
fs.writeFileSync("src/template.html",h);
