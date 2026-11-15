import fs from "fs";
const root = "C:/Users/nomus/OneDrive/바탕 화면/찬송퀴즈/";
const list = fs.readFileSync(root + "src/hymns.txt", "utf8").split("\n").filter(Boolean).map(l => { const [n, ...t] = l.split("\t"); return [Number(n), t.join("\t").trim()]; });
const title = new Map(list);
const dupTitles = new Set(list.map(x => x[1]).filter((t, i, a) => a.indexOf(t) !== i));

// 성경 이야기/사연이 있는 찬송 (정답 제목이 이야기에 드러나지 않게 작성)
const stories = {
  8: "하늘 보좌 둘레의 네 생물이 밤낮 쉬지 않고 하나님을 찬양하는 장면 (요한계시록 4장)",
  23: "찰스 웨슬리가 회심한 지 1년을 기념해 지은 것으로 알려진 찬송",
  79: "엿새 동안 하늘과 땅과 바다를 만드신 창조의 이야기 (창세기 1장)",
  97: "천사가 처녀 마리아에게 나타나 아기를 낳을 것이라고 알린 이야기 (누가복음 1장)",
  100: "홍해를 건넌 이스라엘 여자들이 소고를 잡고 춤추며 노래한 이야기 (출애굽기 15장)",
  109: "아기 예수님이 태어나신 베들레헴의 그때 (누가복음 2장)",
  115: "하나님의 아들이 사람으로 오신 성탄의 소식 (누가복음 2장)",
  116: "별을 보고 먼 나라에서 아기 예수님께 선물을 드리러 온 사람들 (마태복음 2장)",
  123: "양을 치던 목자들에게 천사가 나타나 구주의 탄생을 알린 이야기 (누가복음 2장)",
  125: "하늘의 군대가 '지극히 높은 곳에서 하나님께 영광'을 외친 장면 (누가복음 2장)",
  136: "예수님이 물을 포도주로 바꾸신 첫 번째 기적 (요한복음 2장)",
  141: "예수님이 나귀를 타고 예루살렘에 들어가실 때 사람들이 외친 환영 (마태복음 21장)",
  149: "골고다 언덕에서 우리 죄를 위해 돌아가신 예수님의 고난",
  157: "십자가 전날 밤, 예수님이 땀이 핏방울같이 되도록 하나님께 간절히 구하신 이야기 (누가복음 22장)",
  164: "무덤이 비어 있고 예수님이 다시 살아나신 아침 (마태복음 28장)",
  184: "오순절 날 다락방에 모인 제자들에게 하늘에서 바람 소리와 함께 임한 일 (사도행전 2장)",
  187: "예수님이 요단강에서 세례 받으실 때 하늘이 열리고 성령이 내려오신 장면 (마태복음 3장)",
  198: "갈릴리 호숫가에서 고기 잡던 어부들을 제자로 부르신 이야기 (누가복음 5장)",
  225: "태어날 때부터 눈먼 사람이 예수님 말씀대로 연못에서 씻고 눈을 뜬 이야기 (요한복음 9장)",
  258: "'죄와 더러움을 씻는 샘'(스가랴 13장)을 노래한 윌리엄 카우퍼의 찬송",
  281: "하나님의 명령을 피해 배를 타고 도망가다 큰 물고기 뱃속에 들어간 선지자의 이야기",
  297: "길 잃은 양 한 마리를 찾아 나선 목자의 비유 (누가복음 15장)",
  305: "노예선 선장이었다가 하나님의 은혜로 목사가 된 영국인 존 뉴턴이 쓴 찬송",
  338: "야곱이 돌베개를 베고 자다가 하늘에 닿은 사다리 꿈을 꾼 이야기 (창세기 28장)",
  369: "아일랜드 청년 조셉 스크리븐이 어머니를 위로하려고 쓴 시로 알려진 찬송",
  371: "갈릴리 바다에 폭풍이 몰아칠 때 예수님이 바람과 물결을 잔잔하게 하신 이야기 (마가복음 4장)",
  383: "'여호와는 너를 지키시는 이'라 노래하며 산을 바라보는 순례자의 시 (시편 121편)",
  389: "수고하고 무거운 짐 진 사람들에게 쉼을 주시겠다는 예수님의 초대 (마태복음 11장)",
  393: "'새벽마다 새로우니 주의 성실하심이 크도소이다'라고 고백한 예레미야애가의 말씀",
  438: "앞을 보지 못했지만 수천 곡의 찬송시를 쓴 패니 크로스비가 지은 찬송",
  568: "푸른 풀밭과 쉴 만한 물가로 인도하시는 분을 노래한 시편 23편",
  585: "'하나님은 우리의 피난처시요 힘이시니'로 시작하는 시편 46편을 바탕으로 종교개혁자 마르틴 루터가 지은 찬송",
  588: "산상수훈에서 '염려하지 말라, 하나님이 먹이시고 입히신다'고 하신 예수님의 말씀 (마태복음 6장)",
};
const extras = [1, 31, 72, 85, 88, 93, 94, 199, 200, 288, 295, 302, 324, 325, 370, 390, 405, 428, 431, 449, 491, 492, 546, 548, 563, 595, 604, 610, 618, 621, 638, 639, 222, 535, 549, 530, 579, 577, 587, 589, 590, 553];

const themeDefs = [
  {id:'xmas', name:'성탄절', icon:'⭐', desc:'아기 예수님의 탄생을 기리는 찬송', nums:[106,109,115,116,119,120,121,122,123,125]},
  {id:'easter', name:'고난과 부활', icon:'🌅', desc:'십자가와 부활을 기억하는 찬송', nums:[141,143,144,146,147,149,150,157,160,162,164,170]},
  {id:'harvest', name:'추수감사', icon:'🌾', desc:'거두게 하신 은혜에 감사하는 찬송', nums:[587,589,590,591,592,593,594]},
  {id:'newyear', name:'새해와 주일', icon:'🔔', desc:'새해와 주일 예배를 위한 찬송', nums:[43,44,45,46,551,553,554]},
];
const themeNums = themeDefs.flatMap(t => t.nums);
const nums = [...new Set([...Object.keys(stories).map(Number), ...extras, ...themeNums])].sort((a, b) => a - b);
const problems = [];
const data = nums.map(n => {
  const t = title.get(n);
  if (!t) problems.push("번호 없음 " + n);
  if (dupTitles.has(t)) problems.push("제목 중복 " + n + " " + t);
  const s = stories[n] || "";
  // 이야기에 제목 낱말이 그대로 들어갔는지 검사
  if (s) for (const w of t.split(/\s+/)) if (w.length >= 2 && w !== "예수" && s.includes(w)) problems.push("누설 " + n + " " + w);
  return [n, t, s];
});
// 같은 제목 겹침 방지, 보기에서 헷갈리는 비슷한 제목 확인용
for (const t of themeDefs) for (const n of t.nums) if (!title.get(n)) problems.push("테마 번호 없음 " + n);
console.log("hymns", data.length, "stories", data.filter(d => d[2]).length, "problems", problems);

let html = fs.readFileSync(root + "src/template.html", "utf8");
html = html.replace("__ALL__", JSON.stringify(list)).replace("__THEMES__", JSON.stringify(themeDefs)).replace("__DATA__", JSON.stringify(data)).replace("__COUNT__", String(data.length));
fs.writeFileSync(root + "index.html", html);
fs.writeFileSync(root + "src/data.json", JSON.stringify(data));
