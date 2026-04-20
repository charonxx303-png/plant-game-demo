const ASSET = 'assets/';

const plants = {
  kalanchoe: {
    label: '长寿花', potModel: '康康', type: '标准花盆', prefix: 'kangkang-kalanchoe',
    stageNames: ['幼苗期', '生长期', '花苞期', '盛花期'],
    plan: ['建议每 3–5 天观察土壤湿度，避免积水。', '花苞期保持充足散射光，帮助花色稳定。', '康康适合桌面、床头柜等日常陪伴场景。'],
    init: { water: 58, light: 68, fertilizer: 62, battery: 82, health: 78, growth: 8 }
  },
  snakeplant: {
    label: '虎尾兰', potModel: '乐乐', type: '大型植物花盆', prefix: 'lele-snakeplant',
    stageNames: ['新芽期', '幼苗期', '挺拔生长期', '成熟观赏期'],
    plan: ['虎尾兰耐旱，水量不宜过高，保持中等湿度即可。', '放在卧室或客厅时，可通过补光维持稳定光照。', '乐乐适合承托高挑型绿植，摆放更稳定。'],
    init: { water: 66, light: 62, fertilizer: 58, battery: 82, health: 80, growth: 8 }
  },
  monroe: {
    label: '梦露', potModel: '懒懒', type: '小型植物花盆', prefix: 'lanlan-monroe',
    stageNames: ['小苗期', '幼苗期', '莲座生长期', '成熟观赏期'],
    plan: ['多肉应少量浇水，避免长期潮湿。', '保持明亮散射光，叶片会更饱满。', '懒懒适合桌面小型植物，低维护、好上手。'],
    init: { water: 52, light: 72, fertilizer: 60, battery: 84, health: 76, growth: 8 }
  },
  radish: {
    label: '樱桃萝卜', potModel: '壮壮', type: '宽扁型花盆', prefix: 'zhuangzhuang-radish',
    stageNames: ['发芽期', '幼苗期', '叶片生长期', '成熟采收期'],
    plan: ['樱桃萝卜生长较快，保持稳定水量有助于根部膨大。', '叶片旺盛期注意肥力补充，但避免过量。', '壮壮适合宽幅浅根类植物，便于观察生长状态。'],
    init: { water: 56, light: 70, fertilizer: 50, battery: 82, health: 74, growth: 8 }
  }
};

const scenes = {
  'living-room': { label: '客厅', bg: 'scene-living-room.png', x: 29, bottom: 48, width: 23, light: 72, water: 0 },
  bedroom: { label: '卧室', bg: 'scene-bedroom.png', x: 23, bottom: 35, width: 22, light: 48, water: 2 },
  bathroom: { label: '浴室', bg: 'scene-bathroom.png', x: 20, bottom: 35, width: 22, light: 58, water: 10 },
  balcony: { label: '阳台', bg: 'scene-balcony.png', x: 27, bottom: 39, width: 23, light: 86, water: -5 }
};

const personalities = {
  careful: { label: '细致入微', suffix: '我会持续记录每一项环境变化。', style: '细致模式' },
  steady: { label: '沉稳可靠', suffix: '当前建议已给出，请按优先级处理。', style: '可靠模式' },
  lively: { label: '活泼开朗', suffix: '做得不错！它马上就精神起来啦～', style: '活力模式' },
  shy: { label: '文静害羞', suffix: '我会小声提醒你，不会打扰你的。', style: '安静模式' }
};

const actionMeta = {
  water: { label: '加水', stat: 'water', effect: 'water' },
  fertilize: { label: '施肥', stat: 'fertilizer', effect: 'fertilize' },
  diagnose: { label: '诊断', stat: null, effect: 'diagnose' },
  light: { label: '补光', stat: 'light', effect: 'light' },
  charge: { label: '充电', stat: 'battery', effect: 'charge' },
  bug: { label: '除虫', stat: 'health', effect: 'bug' }
};

const statLabels = {
  water: '💧 水量',
  light: '☀️ 光照',
  fertilizer: '▦ 肥力',
  battery: '▭ 电量',
  health: '♡ 健康',
  growth: '✦ 成长'
};

let quizStep = 0;
const answers = { plant: 'kalanchoe', scene: 'bedroom', personality: 'careful', name: '' };
let game = { stats: {}, completed: false };

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const sceneBg = $('#sceneBg');
const potLayer = $('#potLayer');
const potImage = $('#potImage');
const potLabel = $('#potLabel');
const chatName = $('#chatName');
const chatMood = $('#chatMood');
const chatList = $('#chatList');
const statList = $('#statList');
const plantTitle = $('#plantTitle');
const plantSub = $('#plantSub');
const stageBadge = $('#stageBadge');
const healthBadge = $('#healthBadge');
const hintBadge = $('#hintBadge');
const nextBadge = $('#nextBadge');
const faceBadge = $('#faceBadge');
const effectLayer = $('#effectLayer');
const toast = $('#toast');

function clamp(n, min = 0, max = 100) { return Math.max(min, Math.min(max, n)); }
function stageIndex() {
  const g = game.stats.growth || 0;
  if (g < 25) return 0;
  if (g < 55) return 1;
  if (g < 82) return 2;
  return 3;
}
function stageFile() {
  const plant = plants[answers.plant];
  const i = stageIndex() + 1;
  const stage = ['sprout', 'seedling', 'growing', 'mature'][i - 1];
  return `${ASSET}${plant.prefix}-stage${i}-${stage}.png`;
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}
function updateClock() {
  const now = new Date();
  $('#timeText').textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  $('#dateText').innerHTML = `${now.getMonth() + 1}月${now.getDate()}日<br>星期${'日一二三四五六'[now.getDay()]}`;
}
setInterval(updateClock, 30_000);
updateClock();

function initQuiz() {
  quizStep = 0;
  $('#introOverlay').classList.remove('show');
  $('#quizOverlay').classList.add('show');
  renderQuiz();
}

function renderQuiz() {
  const content = $('#quizContent');
  const progress = $('#quizProgress');
  const title = $('#quizTitle');
  progress.textContent = `Question ${quizStep + 1} / 4`;
  $('#prevQuizBtn').style.visibility = quizStep === 0 ? 'hidden' : 'visible';
  $('#nextQuizBtn').textContent = quizStep === 3 ? '进入体验' : '下一题';

  if (quizStep === 0) {
    title.textContent = '您想种植什么植物？';
    content.innerHTML = `<div class="option-grid plant-options">${Object.entries(plants).map(([key, p]) => `
      <button class="option-card ${answers.plant === key ? 'selected' : ''}" data-type="plant" data-value="${key}">
        <img src="${ASSET}${p.prefix}-stage4-mature.png" alt="${p.label}">
        <span>${p.label}</span>
      </button>`).join('')}</div>`;
  } else if (quizStep === 1) {
    title.textContent = '您喜欢在哪里栽培植物？';
    content.innerHTML = `<div class="option-grid scene-options">${Object.entries(scenes).map(([key, s]) => `
      <button class="option-card ${answers.scene === key ? 'selected' : ''}" data-type="scene" data-value="${key}">
        <img src="${ASSET}${s.bg}" alt="${s.label}">
        <span>${s.label}</span>
      </button>`).join('')}</div>`;
  } else if (quizStep === 2) {
    title.textContent = '您喜欢什么性格的花盆管家？';
    content.innerHTML = `<div class="option-grid personality-options">${Object.entries(personalities).map(([key, p]) => `
      <button class="option-card ${answers.personality === key ? 'selected' : ''}" data-type="personality" data-value="${key}"><span>${p.label}<br><small>${p.style}</small></span></button>`).join('')}</div>`;
  } else {
    title.textContent = '请为您的专属花盆管家起个名字吧！';
    content.innerHTML = `<div class="name-step">
      <input id="nameInput" type="text" value="${answers.name}" placeholder="请输入名称，例如：小芽 / 康康 / 我的花盆">
      <div class="name-tip">名字会显示在花盆上方，并用于后续对话反馈。</div>
    </div>`;
    setTimeout(() => $('#nameInput')?.focus(), 0);
  }
}

$('#startQuizBtn').addEventListener('click', initQuiz);
$('#restartBtn').addEventListener('click', () => {
  $('#quizOverlay').classList.add('show');
  quizStep = 0;
  renderQuiz();
});
$('#prevQuizBtn').addEventListener('click', () => { quizStep = Math.max(0, quizStep - 1); renderQuiz(); });
$('#nextQuizBtn').addEventListener('click', () => {
  if (quizStep === 3) {
    const nameInput = $('#nameInput');
    if (nameInput) answers.name = nameInput.value.trim();
    startGame();
  } else {
    quizStep += 1;
    renderQuiz();
  }
});
$('#quizContent').addEventListener('click', (e) => {
  const card = e.target.closest('.option-card');
  if (!card) return;
  answers[card.dataset.type] = card.dataset.value;
  renderQuiz();
});

function applyScene() {
  const s = scenes[answers.scene];
  sceneBg.style.backgroundImage = `url("${ASSET}${s.bg}")`;
  potLayer.style.setProperty('--pot-left', `${s.x}%`);
  potLayer.style.setProperty('--pot-bottom', `${s.bottom}%`);
  potLayer.style.setProperty('--pot-width', `${s.width}vw`);
}

function startGame() {
  $('#quizOverlay').classList.remove('show');
  const p = plants[answers.plant];
  const s = scenes[answers.scene];
  const base = { ...p.init };
  base.light = clamp(s.light + (p.init.light - 65) * 0.35);
  base.water = clamp(p.init.water + s.water);
  game.stats = base;
  game.completed = false;
  chatList.innerHTML = '';
  applyScene();
  updateAll();
  const displayName = answers.name || p.potModel;
  addBot(`主人，欢迎回来！我是${displayName}。我已经把${p.label}安置在${s.label}，现在会帮你监测水量、光照、肥力和电量。`);
  addBot(tone(`先观察右侧状态条，点击合适的养护按钮，就可以让它逐步进入更好的生长状态。`));
}

function tone(text) {
  const mood = personalities[answers.personality];
  const name = answers.name || plants[answers.plant].potModel;
  if (answers.personality === 'lively') return `${name}上线啦！${text} ${mood.suffix}`;
  if (answers.personality === 'shy') return `主人……${text} ${mood.suffix}`;
  if (answers.personality === 'steady') return `${text} ${mood.suffix}`;
  return `${text} ${mood.suffix}`;
}

function addBot(text) { addMessage(text, 'bot'); }
function addUser(text) { addMessage(text, 'user'); }
function addMessage(text, who = 'bot') {
  const div = document.createElement('div');
  div.className = `bubble ${who === 'user' ? 'user' : ''}`;
  div.textContent = text;
  chatList.appendChild(div);
  chatList.scrollTop = chatList.scrollHeight;
}

function getMainHint() {
  const st = game.stats;
  const entries = [
    ['water', st.water, '轻度缺水', 'water'],
    ['light', st.light, '光照偏弱', 'light'],
    ['fertilizer', st.fertilizer, '肥力不足', 'fertilize'],
    ['battery', st.battery, '电量偏低', 'charge'],
    ['health', st.health, '需要照顾', 'bug']
  ];
  const low = entries.filter(([, v]) => v < 62).sort((a, b) => a[1] - b[1])[0];
  if (!low) return { text: '状态舒适', action: null };
  return { text: low[2], action: low[3], stat: low[0] };
}

function updateAll() {
  const p = plants[answers.plant];
  const s = scenes[answers.scene];
  const displayName = answers.name || p.potModel;
  applyScene();
  potImage.src = stageFile();
  potLabel.innerHTML = `植趣管家<br><strong>${displayName}</strong>`;
  chatName.textContent = displayName;
  chatMood.textContent = personalities[answers.personality].label;
  plantTitle.textContent = p.label;
  plantSub.textContent = `${p.potModel} · ${p.type} · ${s.label}`;

  const si = stageIndex();
  stageBadge.textContent = p.stageNames[si];
  nextBadge.textContent = si < 3 ? `下一阶段：${p.stageNames[si + 1]}` : '已进入成熟阶段';
  const mainHint = getMainHint();
  hintBadge.textContent = mainHint.text;
  const healthText = game.stats.health >= 76 ? '健康' : game.stats.health >= 55 ? '需关注' : '待恢复';
  healthBadge.textContent = healthText;
  healthBadge.style.background = game.stats.health >= 76 ? 'rgba(146,208,80,.76)' : '#f2c94c';

  faceBadge.textContent = game.stats.health >= 76 && !mainHint.action ? '^_^' : game.stats.health < 55 ? 'T_T' : 'o_o';

  renderStats();
  renderRecommendedAction(mainHint.action);
}

function renderStats() {
  statList.innerHTML = ['water', 'light', 'fertilizer', 'battery', 'health', 'growth'].map(key => {
    const value = Math.round(game.stats[key]);
    const color = key === 'growth' ? 'linear-gradient(90deg,#92d050,#2fc25b)' : value < 45 ? 'linear-gradient(90deg,#f7a19b,#d43030)' : value < 65 ? 'linear-gradient(90deg,#f2c94c,#f7d76a)' : 'linear-gradient(90deg,#92d050,#2fc25b)';
    return `<div class="stat-row">
      <div>${statLabels[key]}</div>
      <div class="stat-track"><div class="stat-fill" style="width:${value}%;background:${color}"></div></div>
      <div class="stat-value">${value}%</div>
    </div>`;
  }).join('');
}

function renderRecommendedAction(action) {
  $$('.action-btn').forEach(btn => btn.classList.toggle('recommend', action && btn.dataset.action === action));
}

function actionFeedback(action) {
  const p = plants[answers.plant];
  const s = game.stats;
  const name = answers.name || p.potModel;
  const feedback = {
    water: `已完成加水，当前水量恢复到 ${Math.round(s.water)}%。我会提醒你避免过度浇水。`,
    fertilize: `肥力已经补充，${p.label}的成长速度会更稳定。`,
    diagnose: `诊断完成：${diagnoseText()}。`,
    light: `补光已开启，当前光照更适合${p.label}继续生长。`,
    charge: `电量已恢复，我可以继续稳定监测环境数据。`,
    bug: `已完成虫害处理，健康值正在恢复。`
  };
  return tone(feedback[action] || `${name}已经记录本次操作。`);
}

function diagnoseText() {
  const st = game.stats;
  const sorted = [
    ['水量', st.water, '建议优先加水'],
    ['光照', st.light, '建议开启补光'],
    ['肥力', st.fertilizer, '建议适量施肥'],
    ['电量', st.battery, '建议及时充电'],
    ['健康', st.health, '建议进行除虫或继续观察']
  ].sort((a,b) => a[1] - b[1]);
  const lowest = sorted[0];
  if (lowest[1] >= 65) return '各项数据较稳定，继续保持当前养护节奏';
  return `${lowest[0]}偏低，${lowest[2]}`;
}

function triggerEffect(type) {
  effectLayer.className = `effect-layer ${type || ''}`;
  potImage.classList.remove('bump');
  void potImage.offsetWidth;
  potImage.classList.add('bump');
  setTimeout(() => { effectLayer.className = 'effect-layer'; }, 950);
}

function handleAction(action) {
  const st = game.stats;
  switch (action) {
    case 'water':
      st.water = clamp(st.water + 18); st.health = clamp(st.health + 4); st.growth = clamp(st.growth + (st.water > 92 ? 2 : 8)); break;
    case 'fertilize':
      st.fertilizer = clamp(st.fertilizer + 16); st.health = clamp(st.health + 2); st.growth = clamp(st.growth + (st.fertilizer > 92 ? 3 : 9)); break;
    case 'diagnose':
      st.growth = clamp(st.growth + 3); st.health = clamp(st.health + 1); break;
    case 'light':
      st.light = clamp(st.light + 17); st.health = clamp(st.health + 3); st.growth = clamp(st.growth + 8); break;
    case 'charge':
      st.battery = clamp(st.battery + 24); st.growth = clamp(st.growth + 4); break;
    case 'bug':
      st.health = clamp(st.health + 14); st.growth = clamp(st.growth + 6); break;
  }
  // small natural decay / variation to make the game feel alive
  if (action !== 'charge') st.battery = clamp(st.battery - 2);
  if (action !== 'water') st.water = clamp(st.water - 2);
  if (action !== 'light') st.light = clamp(st.light - 1);

  triggerEffect(actionMeta[action]?.effect);
  updateAll();
  addBot(actionFeedback(action));
  checkComplete();
}

$('#actionGrid').addEventListener('click', (e) => {
  const btn = e.target.closest('.action-btn');
  if (!btn) return;
  handleAction(btn.dataset.action);
});

$('#chatForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $('#chatInput');
  const text = input.value.trim();
  if (!text) return;
  addUser(text);
  input.value = '';
  setTimeout(() => addBot(replyTo(text)), 160);
});

function replyTo(text) {
  const p = plants[answers.plant];
  const st = game.stats;
  const lower = text.toLowerCase();
  if (text.includes('状态') || text.includes('怎么样') || text.includes('好吗')) {
    return tone(`现在${p.label}的水量 ${Math.round(st.water)}%、光照 ${Math.round(st.light)}%、肥力 ${Math.round(st.fertilizer)}%、健康值 ${Math.round(st.health)}%。${diagnoseText()}。`);
  }
  if (text.includes('浇') || text.includes('水')) return tone(`${p.label}不需要盲目浇水，我会根据水量数据提醒你。当前水量是 ${Math.round(st.water)}%。`);
  if (text.includes('光') || text.includes('晒')) return tone(`当前光照是 ${Math.round(st.light)}%。如果低于 60%，可以点击补光让环境更稳定。`);
  if (text.includes('施肥') || text.includes('肥')) return tone(`当前肥力是 ${Math.round(st.fertilizer)}%。适量施肥可以帮助它进入更好的生长阶段。`);
  if (text.includes('名字') || text.includes('你是谁')) return tone(`我是${answers.name || p.potModel}，是负责监测和提醒的花盆管家，不是植物本身在说话哦。`);
  return tone(`我已经收到啦。你也可以问我“现在状态怎么样”或者直接点击右侧养护按钮。`);
}

function checkComplete() {
  if (game.stats.growth >= 100 && !game.completed) {
    game.completed = true;
    showResult();
  }
}
function showResult() {
  const p = plants[answers.plant];
  const s = scenes[answers.scene];
  $('#resultText').textContent = `${answers.name || p.potModel} 已为 ${s.label} 中的 ${p.label} 生成专属养护方案。`;
  $('#planList').innerHTML = p.plan.map(item => `<div>✓ ${item}</div>`).join('') + `<div>✓ 推荐型号：${p.potModel}｜${p.type}</div>`;
  $('#resultModal').classList.add('show');
}
$('#closeResultBtn').addEventListener('click', () => $('#resultModal').classList.remove('show'));
$('#playAgainBtn').addEventListener('click', () => {
  $('#resultModal').classList.remove('show');
  $('#quizOverlay').classList.add('show');
  quizStep = 0;
  renderQuiz();
});

$$('.nav-link').forEach(btn => btn.addEventListener('click', () => showToast(btn.dataset.toast)));
$('#settingsBtn').addEventListener('click', () => showToast('设置模块为后续扩展，本次 Demo 保留入口。'));

// default preview behind intro
applyScene();
updateAll();
