/**
 * Pokémon Battle Kingdom - Advanced Battle Logic & Django REST API Integration
 */

// Type advantages chart
const TYPE_CHART = {
  normal: { normal: 1.0, fire: 1.0, water: 1.0, grass: 1.0, electric: 1.0 },
  fire: { normal: 1.0, fire: 0.5, water: 0.5, grass: 2.0, electric: 1.0 },
  water: { normal: 1.0, fire: 2.0, water: 0.5, grass: 0.5, electric: 1.0 },
  grass: { normal: 1.0, fire: 0.5, water: 2.0, grass: 0.5, electric: 1.0 },
  electric: { normal: 1.0, fire: 1.0, water: 2.0, grass: 0.5, electric: 0.5 }
};

// Pokémon Database with SVGs
const POKEMON_DB = [
  {
    id: 'charizard',
    name: 'Charizard',
    type: 'fire',
    level: 50,
    maxHp: 177, // Customized default player hp base
    attack: 85,
    defense: 68,
    speed: 85,
    description: 'Spits fire that is hot enough to melt boulders.',
    color: '#ff7675',
    moves: [
      { key: 'tackle', name: 'Slash', type: 'normal', power: 35, accuracy: 0.95, desc: 'Normal physical charge.', category: 'attack', energyCost: 0 },
      { key: 'fireblast', name: 'Fire Blast', type: 'fire', power: 65, accuracy: 0.85, desc: 'Combusts massive flame columns.', category: 'attack', energyCost: 8 },
      { key: 'dragonrage', name: 'Dragon Dance', type: 'fire', power: 0, accuracy: 1.0, desc: 'Trainer orders attack buff (1.4x ATK).', category: 'buff', stat: 'atk', mult: 1.4, energyCost: 4 }
    ],
    svg: `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <ellipse cx="50" cy="88" rx="35" ry="8" fill="rgba(0,0,0,0.3)" />
        <g class="flap-wings">
          <path d="M 22 45 C 5 15, -2 35, 10 55 C 20 65, 30 50, 32 45 Z" fill="url(#char-orange)" stroke="#2c3e50" stroke-width="1" />
          <path d="M 18 42 C 8 20, 3 36, 12 50 Z" fill="url(#wing-inside)" />
          <path d="M 78 45 C 95 15, 102 35, 90 55 C 80 65, 70 50, 68 45 Z" fill="url(#char-orange)" stroke="#2c3e50" stroke-width="1" />
          <path d="M 82 42 C 92 20, 97 36, 88 50 Z" fill="url(#wing-inside)" />
        </g>
        <path d="M 32 75 C 10 90, 8 68, 5 70 C 2 72, 5 85, 20 85 C 26 85, 32 80, 32 75 Z" fill="url(#char-orange)" />
        <g class="flicker-flame" transform="translate(4, 66)">
          <path d="M 0 5 Q -10 -15, 0 -22 Q 10 -15, 0 5 Z" fill="#ff9f43" />
          <path d="M 0 2 Q -5 -8, 0 -14 Q 5 -8, 0 2 Z" fill="#ff7675" />
          <circle cx="0" cy="-6" r="3" fill="#ffeaa7" />
        </g>
        <path d="M 35 48 C 30 80, 42 85, 50 86 C 58 85, 70 80, 65 48 C 65 40, 35 40, 35 48 Z" fill="url(#char-orange)" stroke="#2c3e50" stroke-width="1.5" />
        <path d="M 40 52 C 37 76, 44 82, 50 83 C 56 82, 63 76, 60 52 C 60 48, 40 48, 40 52 Z" fill="url(#char-belly)" />
        <path d="M 38 30 C 35 15, 45 10, 50 14 C 55 10, 65 15, 62 30 C 62 38, 38 38, 38 30 Z" fill="url(#char-orange)" stroke="#2c3e50" stroke-width="1.5" />
        <path d="M 42 22 Q 35 6, 38 5 Q 43 14, 43 20 Z" fill="url(#char-orange)" stroke="#2c3e50" stroke-width="1" />
        <path d="M 58 22 Q 65 6, 62 5 Q 57 14, 57 20 Z" fill="url(#char-orange)" stroke="#2c3e50" stroke-width="1" />
        <ellipse cx="46" cy="24" rx="2.5" ry="3.5" fill="#fff" />
        <ellipse cx="46.5" cy="24" rx="1.5" ry="2" fill="#0984e3" />
        <ellipse cx="54" cy="24" rx="2.5" ry="3.5" fill="#fff" />
        <ellipse cx="53.5" cy="24" rx="1.5" ry="2" fill="#0984e3" />
        <path d="M 44 28 C 47 31, 53 31, 56 28" stroke="#d63031" stroke-width="1" fill="none" />
        <path d="M 42 32 L 44 30 L 46 32 L 54 32 L 56 30 L 58 32" stroke="#2c3e50" stroke-width="1.2" fill="none" />
      </svg>
    `
  },
  {
    id: 'blastoise',
    name: 'Blastoise',
    type: 'water',
    level: 50,
    maxHp: 184,
    attack: 74,
    defense: 88,
    speed: 62,
    description: 'Excellent at defense. Shoots pressurized water blasts.',
    color: '#54a0ff',
    moves: [
      { key: 'tackle', name: 'Bite', type: 'normal', power: 35, accuracy: 0.95, desc: 'Normal physical charge.', category: 'attack', energyCost: 0 },
      { key: 'hydropump', name: 'Hydro Pump', type: 'water', power: 65, accuracy: 0.85, desc: 'Blasts high-pressure water streams.', category: 'attack', energyCost: 8 },
      { key: 'irondefense', name: 'Iron Shield', type: 'water', power: 0, accuracy: 1.0, desc: 'Trainer buffs defense (1.5x DEF).', category: 'buff', stat: 'def', mult: 1.5, energyCost: 4 }
    ],
    svg: `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <ellipse cx="50" cy="88" rx="36" ry="8" fill="rgba(0,0,0,0.3)" />
        <path d="M 24 38 C 10 52, 10 74, 28 82 C 50 88, 70 85, 76 78 C 88 64, 88 50, 76 38 Z" fill="url(#shell-brown)" stroke="#2c3e50" stroke-width="2" />
        <path d="M 28 40 C 35 45, 65 45, 72 40 M 30 55 C 38 60, 62 60, 70 55 M 34 70 C 40 74, 60 74, 66 70" stroke="#feca57" stroke-width="1" fill="none" opacity="0.6" />
        <path d="M 25 38 C 22 45, 22 75, 30 82 C 34 76, 32 44, 26 38 Z" fill="#f5f6fa" />
        <path d="M 75 38 C 78 45, 78 75, 70 82 C 66 76, 68 44, 74 38 Z" fill="#f5f6fa" />
        <g>
          <path d="M 22 36 L 12 18 L 22 13 L 29 28 Z" fill="#b2bec3" stroke="#2c3e50" stroke-width="1.8" />
          <ellipse cx="17" cy="15" rx="5" ry="2.5" fill="#2d3436" transform="rotate(-25, 17, 15)" />
          <path d="M 78 36 L 88 18 L 78 13 L 71 28 Z" fill="#b2bec3" stroke="#2c3e50" stroke-width="1.8" />
          <ellipse cx="83" cy="15" rx="5" ry="2.5" fill="#2d3436" transform="rotate(25, 83, 15)" />
        </g>
        <path d="M 28 42 C 26 74, 38 82, 50 83 C 62 82, 74 74, 72 42 C 72 38, 28 38, 28 42 Z" fill="url(#body-blue)" stroke="#2c3e50" stroke-width="1.5" />
        <path d="M 32 46 C 30 70, 42 77, 50 78 C 58 77, 70 70, 68 46 Z" fill="#feca57" stroke="#2c3e50" stroke-width="1" />
        <path d="M 36 28 C 30 14, 42 12, 50 14 C 58 12, 70 14, 64 28 C 64 34, 36 34, 36 28 Z" fill="url(#body-blue)" stroke="#2c3e50" stroke-width="1.5" />
        <path d="M 33 22 Q 28 15, 36 17 Z" fill="url(#body-blue)" />
        <path d="M 67 22 Q 72 15, 64 17 Z" fill="url(#body-blue)" />
        <polygon points="42,21 46,20 48,24 43,25" fill="#fff" />
        <circle cx="45" cy="22.5" r="1.2" fill="#2c3e50" />
        <polygon points="58,21 54,20 52,24 57,25" fill="#fff" />
        <circle cx="55" cy="22.5" r="1.2" fill="#2c3e50" />
        <path d="M 40 30 Q 50 33, 60 30" stroke="#2c3e50" stroke-width="1" fill="none" />
      </svg>
    `
  },
  {
    id: 'venusaur',
    name: 'Venusaur',
    type: 'grass',
    level: 50,
    maxHp: 180,
    attack: 76,
    defense: 76,
    speed: 65,
    description: 'Blooms a solar plant on its back to unleash leaf storms.',
    color: '#2ed573',
    moves: [
      { key: 'tackle', name: 'Tackle', type: 'normal', power: 35, accuracy: 0.95, desc: 'Normal physical charge.', category: 'attack', energyCost: 0 },
      { key: 'solarbeam', name: 'Solar Beam', type: 'grass', power: 70, accuracy: 0.80, desc: 'Solar elements channel laser.', category: 'attack', energyCost: 8 },
      { key: 'synthesis', name: 'Synthesis', type: 'grass', power: 0, accuracy: 1.0, desc: 'Reclaims energy (Heal +35 HP).', category: 'heal', amt: 35, energyCost: 4 }
    ],
    svg: `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <ellipse cx="50" cy="85" rx="38" ry="8" fill="rgba(0,0,0,0.3)" />
        <path d="M 44 35 L 56 35 L 52 48 L 48 48 Z" fill="#b5835a" stroke="#2c3e50" stroke-width="1.2" />
        <g class="sway-slow" style="transform-origin: 50px 48px;">
          <ellipse cx="32" cy="30" rx="14" ry="7" fill="url(#petal-pink)" stroke="#2c3e50" stroke-width="1" transform="rotate(-25, 32, 30)" />
          <ellipse cx="68" cy="30" rx="14" ry="7" fill="url(#petal-pink)" stroke="#2c3e50" stroke-width="1" transform="rotate(25, 68, 30)" />
          <ellipse cx="50" cy="22" rx="16" ry="8" fill="url(#petal-pink)" stroke="#2c3e50" stroke-width="1" />
          <path d="M 20 42 C 10 32, 28 26, 36 38 Z" fill="url(#leaf-green)" stroke="#2c3e50" />
          <path d="M 80 42 C 90 32, 72 26, 64 38 Z" fill="url(#leaf-green)" stroke="#2c3e50" />
          <circle cx="50" cy="26" r="6" fill="#feca57" />
        </g>
        <path d="M 22 48 C 16 80, 40 85, 50 86 C 60 85, 84 80, 78 48 C 78 40, 22 40, 22 48 Z" fill="#00a8ff" stroke="#2c3e50" stroke-width="1.8" />
        <ellipse cx="30" cy="58" rx="4" ry="2.5" fill="#0097e6" />
        <ellipse cx="70" cy="58" rx="4" ry="2.5" fill="#0097e6" />
        <ellipse cx="36" cy="70" rx="3" ry="1.8" fill="#0097e6" />
        <path d="M 34 38 C 28 25, 42 22, 50 24 C 58 22, 72 25, 66 38 C 66 44, 34 44, 34 38 Z" fill="#00a8ff" stroke="#2c3e50" stroke-width="1.5" />
        <polygon points="38,30 43,28 45,32 40,33" fill="#fff" stroke="#2c3e50" stroke-width="0.5" />
        <circle cx="41.5" cy="30.5" r="1.2" fill="#d63031" />
        <polygon points="62,30 57,28 55,32 60,33" fill="#fff" stroke="#2c3e50" stroke-width="0.5" />
        <circle cx="58.5" cy="30.5" r="1.2" fill="#d63031" />
        <path d="M 42 36 Q 50 39, 58 36" stroke="#2c3e50" stroke-width="1" fill="none" />
        <polygon points="43,36 45,38 46,36" fill="#fff" />
        <polygon points="57,36 55,38 54,36" fill="#fff" />
      </svg>
    `
  },
  {
    id: 'pikachu',
    name: 'Pikachu',
    type: 'electric',
    level: 48,
    maxHp: 177, // Perfect HP bar for leveling
    attack: 80,
    defense: 50,
    speed: 95,
    description: 'Stores electricity in its red cheeks. Highly agile.',
    color: '#ffc107',
    moves: [
      { key: 'tackle', name: 'Quick Attack', type: 'normal', power: 38, accuracy: 0.95, desc: 'High agility dash attack.', category: 'attack', energyCost: 0 },
      { key: 'thunderbolt', name: 'Thunderbolt', type: 'electric', power: 60, accuracy: 0.90, desc: 'Strikes target with lightning.', category: 'attack', energyCost: 8 },
      { key: 'agility', name: 'Double Team', type: 'electric', power: 0, accuracy: 1.0, desc: 'Creates clones raising stats.', category: 'buff', stat: 'atk', mult: 1.4, energyCost: 4 }
    ],
    svg: `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <ellipse cx="50" cy="85" rx="28" ry="6" fill="rgba(0,0,0,0.3)" />
        <path d="M 28 68 L 12 55 L 20 48 L 8 30 L 25 35 L 18 48 L 30 50 Z" fill="#fed330" stroke="#f7b731" stroke-width="2.5" />
        <path d="M 33 46 C 28 78, 38 82, 50 83 C 62 82, 72 78, 67 46 C 67 40, 33 40, 33 46 Z" fill="#ffeaa7" stroke="#f7b731" stroke-width="1.5" />
        <path d="M 36 32 C 30 16, 42 15, 50 17 C 58 15, 70 16, 64 32 C 64 38, 36 38, 36 32 Z" fill="#ffeaa7" stroke="#f7b731" stroke-width="1.5" />
        <g>
          <path d="M 34 22 C 22 3, 26 0, 32 8 C 36 14, 38 18, 36 22 Z" fill="#ffeaa7" stroke="#f7b731" stroke-width="1" />
          <path d="M 25 5 C 23 2, 27 0, 31 7 Z" fill="#2d3436" />
          <path d="M 66 22 C 78 3, 74 0, 68 8 C 64 14, 62 18, 64 22 Z" fill="#ffeaa7" stroke="#f7b731" stroke-width="1" />
          <path d="M 75 5 C 77 2, 73 0, 69 7 Z" fill="#2d3436" />
        </g>
        <circle cx="36" cy="31" r="5" fill="#ff7675" class="electric-cheek" />
        <circle cx="64" cy="31" r="5" fill="#ff7675" class="electric-cheek" />
        <circle cx="43" cy="24" r="3" fill="#2d3436" />
        <circle cx="44" cy="23" r="1" fill="#fff" />
        <circle cx="57" cy="24" r="3" fill="#2d3436" />
        <circle cx="56" cy="23" r="1" fill="#fff" />
        <circle cx="50" cy="27" r="0.8" fill="#2d3436" />
        <path d="M 46 29 Q 48 31, 50 29 Q 52 31, 54 29" stroke="#2d3436" stroke-width="1.2" fill="none" />
      </svg>
    `
  }
];

// SVG templates for Player Trainer and AI Gary
const TRAINER_PLAYER_SVG = `
<svg viewBox="0 0 100 160" width="100%" height="100%">
  <ellipse cx="50" cy="150" rx="20" ry="6" fill="rgba(0,0,0,0.3)"/>
  <path d="M 38 120 L 36 150 L 44 150 L 44 120 Z" fill="#2d3436" />
  <path d="M 62 120 L 64 150 L 56 150 L 56 120 Z" fill="#2d3436" />
  <path d="M 34 92 C 30 135, 45 130, 50 130 C 55 130, 70 135, 66 92 Z" fill="#2980b9" stroke="#1c5980" stroke-width="1" />
  <path d="M 34 92 L 50 110 L 66 92" stroke="#fff" stroke-width="2" fill="none" />
  <circle cx="50" cy="120" r="4" fill="#f1c40f" />
  <g class="trainer-head">
    <circle cx="50" cy="65" r="15" fill="#ffddc1"/>
    <path d="M 32 60 Q 25 50 36 52 Q 50 46 64 52 Q 75 50 68 60 Z" fill="#2d3436"/>
    <path d="M 32 58 Q 50 38 68 58" fill="#e74c3c" />
    <path d="M 38 58 Q 50 66 62 58 Z" fill="#fff" />
    <circle cx="50" cy="51" r="3" fill="#e74c3c" />
    <path d="M 30 55 Q 12 52 22 48 Q 32 46 32 55 Z" fill="#e74c3c" />
    <ellipse cx="44" cy="66" rx="2" ry="3" fill="#2d3436" />
    <ellipse cx="56" cy="66" rx="2" ry="3" fill="#2d3436" />
    <circle cx="44.5" cy="65" r="0.6" fill="#fff" />
    <circle cx="55.5" cy="65" r="0.6" fill="#fff" />
    <path d="M 46 72 Q 50 75 54 72" stroke="#2d3436" stroke-width="1.2" fill="none" />
  </g>
  <g class="trainer-arm" style="transform-origin: 34px 92px;">
    <path d="M 34 92 C 18 108, 12 120, 20 130" stroke="#2980b9" stroke-width="8" stroke-linecap="round" fill="none" />
    <circle cx="20" cy="130" r="5" fill="#2ecc71" />
  </g>
</svg>
`;

const TRAINER_ENEMY_SVG = `
<svg viewBox="0 0 100 150" width="100%" height="100%">
  <ellipse cx="50" cy="140" rx="18" ry="5" fill="rgba(0,0,0,0.3)"/>
  <path d="M 38 115 L 36 140 L 43 140 L 43 115 Z" fill="#2d3436" />
  <path d="M 62 115 L 64 140 L 57 140 L 57 115 Z" fill="#2d3436" />
  <path d="M 36 86 C 32 125, 45 120, 50 120 C 55 120, 68 125, 64 86 Z" fill="#9b59b6" stroke="#6c5ce7" stroke-width="1" />
  <g class="trainer-head">
    <circle cx="50" cy="62" r="14" fill="#ffddc1"/>
    <path d="M 32 54 Q 22 34 38 39 Q 50 28 62 39 Q 78 34 68 54 Q 72 64 64 62 Q 50 66 36 62 Z" fill="#d35400"/>
    <ellipse cx="44" cy="62" rx="1.5" ry="2.5" fill="#2d3436" />
    <ellipse cx="56" cy="62" rx="1.5" ry="2.5" fill="#2d3436" />
    <path d="M 47 68 Q 52 70 54 67" stroke="#2d3436" stroke-width="1.2" fill="none" />
  </g>
  <g class="enemy-trainer-arm" style="transform-origin: 64px 86px;">
    <path d="M 64 90 C 78 108, 82 118, 76 126" stroke="#9b59b6" stroke-width="8" stroke-linecap="round" fill="none" />
    <circle cx="76" cy="126" r="4.5" fill="#ffddc1" />
  </g>
</svg>
`;

class BattleArena {
  constructor() {
    this.trainerId = null;
    this.trainerName = '';
    this.trainerLevel = 1;
    this.battleType = 'Wild Pokémon';
    
    this.playerPoke = null;
    this.enemyPoke = null;
    
    this.playerHp = 0;
    this.enemyHp = 0;
    this.playerEnergy = 24; // 24 max
    this.maxEnergy = 24;

    this.playerAtkMult = 1.0;
    this.playerDefMult = 1.0;
    this.enemyAtkMult = 1.0;
    this.enemyDefMult = 1.0;

    this.selectedEnv = 'grass-plains';
    this.isControlsLocked = false;
    this.logQueue = [];
    this.isWritingLog = false;
    
    this.rewards = { xp: 0, coins: 0 };
    this.confettiActive = false;
    
    this.setupView = null;
    this.arenaView = null;
    this.resultsOverlay = null;
    this.logContainer = null;
    
    this.trainersList = [];
    this.initDOM();
  }

  initDOM() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupView = document.getElementById('setup-view');
      this.arenaView = document.getElementById('arena-view');
      this.resultsOverlay = document.getElementById('results-overlay');
      this.logContainer = document.getElementById('log-box');
      
      this.fetchTrainers();
      this.fetchBattleHistory();
      this.renderSetupSquad();
      this.setupEventListeners();
    });
  }

  setupEventListeners() {
    // Start Battle Button
    const startBtn = document.getElementById('start-battle-btn');
    startBtn.addEventListener('click', () => {
      this.startBattle();
    });

    // Trainer Select profile change
    const profileSelect = document.getElementById('trainer-profile-select');
    const nameInput = document.getElementById('trainer-name-input');
    
    profileSelect.addEventListener('change', (e) => {
      const selectedId = e.target.value;
      const statsPreview = document.getElementById('trainer-stats-preview');
      
      if (selectedId) {
        const tr = this.trainersList.find(t => t.id == selectedId);
        if (tr) {
          this.trainerId = tr.id;
          this.trainerName = tr.name;
          this.trainerLevel = tr.level;
          
          nameInput.value = tr.name;
          nameInput.disabled = true;
          
          statsPreview.textContent = `Active Profile: ${tr.name} | Level ${tr.level} | ${tr.xp} XP | ${tr.coins} Coins`;
          statsPreview.style.display = 'block';
        }
      } else {
        this.trainerId = null;
        this.trainerName = '';
        nameInput.value = '';
        nameInput.disabled = false;
        statsPreview.style.display = 'none';
      }
      this.checkStartButton();
    });

    nameInput.addEventListener('input', (e) => {
      this.trainerName = e.target.value.trim();
      this.checkStartButton();
    });

    // Refresh profiles
    document.getElementById('refresh-trainers-btn').addEventListener('click', () => {
      window.audioSynth.playClick();
      this.fetchTrainers();
    });

    // Environment select buttons
    const envBtns = document.querySelectorAll('.env-btn');
    envBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.audioSynth.playClick();
        envBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.setEnvironment(e.currentTarget.dataset.env);
      });
    });

    // Mute control
    const muteBtn = document.getElementById('audio-toggle-btn');
    muteBtn.addEventListener('click', () => {
      const isMuted = window.audioSynth.toggleMute();
      muteBtn.classList.toggle('muted', isMuted);
      muteBtn.innerHTML = isMuted ? 
        `<svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/></svg>` : 
        `<svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M11.536 14.01A8.473 8.473 0 0 0 14 10c0-3-2.5-5.5-5.5-5.5v1.1c2.2 0 4.4 1.8 4.4 4.4 0 2.2-1.8 4.4-4.4 4.4v1.1c3 0 5.5-2.5 5.5-5.5zm-2.5 2v-1.1c3.8 0 6.6-2.8 6.6-6.6 0-3.8-2.8-6.6-6.6-6.6V.3c4.4 0 7.7 3.3 7.7 7.7s-3.3 7.7-7.7 7.7zm-4.325-4.89L2.325 8.5H.5A.5.5 0 0 1 0 8V6a.5.5 0 0 1 .5-.5h1.825l2.388-2.11a.5.5 0 0 1 .8-.39V12a.5.5 0 0 1-.825.39z"/></svg>`;
      window.audioSynth.playClick();
    });

    // Action Sidebar buttons listeners
    document.getElementById('action-physical').addEventListener('click', () => {
      if (this.isControlsLocked) return;
      this.executeRound('tackle');
    });

    document.getElementById('action-special').addEventListener('click', () => {
      if (this.isControlsLocked) return;
      const specialMove = this.playerPoke.moves.find(m => m.key !== 'tackle' && m.category === 'attack');
      if (specialMove) {
        this.executeRound(specialMove.key);
      }
    });

    document.getElementById('action-buff').addEventListener('click', () => {
      if (this.isControlsLocked) return;
      const buffMove = this.playerPoke.moves.find(m => m.category === 'buff' || m.category === 'heal');
      if (buffMove) {
        this.executeRound(buffMove.key);
      }
    });

    document.getElementById('action-item').addEventListener('click', () => {
      if (this.isControlsLocked) return;
      this.executeRestAction();
    });

    document.getElementById('action-run').addEventListener('click', () => {
      if (this.isControlsLocked) return;
      this.executeRunAway();
    });

    // Results screen buttons
    document.getElementById('btn-restart').addEventListener('click', () => {
      window.audioSynth.playClick();
      this.resetToSelection();
    });

    document.getElementById('btn-rechoose').addEventListener('click', () => {
      window.audioSynth.playClick();
      this.resetToSelection();
    });

    document.getElementById('btn-dashboard').addEventListener('click', () => {
      window.audioSynth.playClick();
      this.resetToSelection();
    });
  }

  checkStartButton() {
    const startBtn = document.getElementById('start-battle-btn');
    startBtn.disabled = !this.trainerName || !this.playerPoke;
  }

  fetchTrainers() {
    fetch('/api/trainers/')
      .then(res => res.json())
      .then(data => {
        this.trainersList = data;
        const select = document.getElementById('trainer-profile-select');
        select.innerHTML = '<option value="">-- Create New Trainer Profile --</option>';
        data.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.id;
          opt.textContent = `${t.name} (Lv. ${t.level})`;
          select.appendChild(opt);
        });
        
        // Retain selection if trainerId exists
        if (this.trainerId) {
          select.value = this.trainerId;
        }
      })
      .catch(err => console.error("Error fetching trainers:", err));
  }

  fetchBattleHistory() {
    fetch('/api/battles/')
      .then(res => res.json())
      .then(data => {
        const tbody = document.getElementById('history-table-body');
        tbody.innerHTML = '';
        if (data.length === 0) {
          tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No battles logged yet.</td></tr>';
          return;
        }
        data.slice(0, 10).forEach(b => {
          const tr = document.createElement('tr');
          const resultBadge = b.result === 'Win' ? '<span class="badge-result win">Victory</span>' : '<span class="badge-result loss">Defeat</span>';
          const rewardsText = b.result === 'Win' ? `+${b.xp_earned} XP, +${b.coins_earned} C` : '0 XP';
          
          tr.innerHTML = `
            <td class="fw-bold">${b.player_name}</td>
            <td class="text-info">${b.opponent}</td>
            <td>${resultBadge}</td>
            <td class="text-warning">${rewardsText}</td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch(err => console.error("Error fetching battles history:", err));
  }

  renderSetupSquad() {
    const grid = document.getElementById('setup-pokemon-grid');
    grid.innerHTML = '';
    
    POKEMON_DB.forEach(poke => {
      const card = document.createElement('div');
      card.className = 'pokemon-card glass-panel';
      card.dataset.id = poke.id;
      
      card.innerHTML = `
        <div class="pokemon-sprite-container">
          ${poke.svg}
        </div>
        <div class="pokemon-card-name">${poke.name}</div>
        <span class="badge-type ${poke.type}">${poke.type}</span>
        <div class="pokemon-card-stats">
          <div class="stat-row"><span>HP</span><span class="stat-val">${poke.maxHp}</span></div>
          <div class="stat-row"><span>ATK</span><span class="stat-val">${poke.attack}</span></div>
          <div class="stat-row"><span>DEF</span><span class="stat-val">${poke.defense}</span></div>
          <div class="stat-row"><span>SPD</span><span class="stat-val">${poke.speed}</span></div>
        </div>
      `;

      card.addEventListener('click', () => {
        window.audioSynth.playClick();
        document.querySelectorAll('.pokemon-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.playerPoke = poke;
        this.checkStartButton();
      });

      grid.appendChild(card);
    });
  }

  setEnvironment(envKey) {
    this.selectedEnv = envKey;
    const stage = document.getElementById('battlefield-stage');
    stage.className = `battlefield-container ${envKey}`;
    
    // Clear and build dynamic scenery elements
    const sceneryContainer = document.getElementById('battlefield-scenery');
    sceneryContainer.innerHTML = '';
    
    // Environmental particles
    const particlesContainer = document.getElementById('stage-particles');
    particlesContainer.innerHTML = '';

    // Weather overlay
    const weatherOverlay = document.getElementById('weather-overlay');
    weatherOverlay.innerHTML = '';

    const pPlatform = document.getElementById('platform-player-element');
    const ePlatform = document.getElementById('platform-enemy-element');
    
    // Change platform titles
    const fieldTitle = document.getElementById('active-field-title');
    
    if (envKey === 'mystic-forest') {
      fieldTitle.textContent = "Mystic Forest";
      
      // Set Forest Platforms
      pPlatform.innerHTML = `
        <svg viewBox="0 0 260 60" width="100%" height="100%">
          <ellipse cx="130" cy="30" rx="120" ry="25" fill="#1b9e54" stroke="#10b981" stroke-width="2.5" />
          <path d="M 30 30 Q 130 50, 230 30" fill="none" stroke="#0f6a36" stroke-width="2" />
        </svg>
      `;
      ePlatform.innerHTML = `
        <svg viewBox="0 0 260 60" width="100%" height="100%">
          <ellipse cx="130" cy="30" rx="110" ry="20" fill="#147d41" stroke="#00b894" stroke-width="1.8" />
        </svg>
      `;

      // Trees
      const t1 = this.createScenerySVG('pine', 'width: 75px; height: 130px; left: 5%; bottom: 65px; z-index: 2;', 'sway-slow');
      const t2 = this.createScenerySVG('oak', 'width: 85px; height: 150px; right: 6%; bottom: 90px; z-index: 2;', 'sway-slow');
      const t3 = this.createScenerySVG('pine', 'width: 60px; height: 110px; left: 28%; bottom: 40px; z-index: 3;', 'sway-fast');
      sceneryContainer.appendChild(t1);
      sceneryContainer.appendChild(t2);
      sceneryContainer.appendChild(t3);

      // Bioluminescent fireflies
      for (let i = 0; i < 15; i++) {
        const dot = document.createElement('div');
        dot.style.position = 'absolute';
        dot.style.background = '#10b981';
        dot.style.borderRadius = '50%';
        dot.style.width = Math.random() * 3 + 2 + 'px';
        dot.style.height = dot.style.width;
        dot.style.left = Math.random() * 100 + '%';
        dot.style.top = Math.random() * 75 + '%';
        dot.style.opacity = Math.random() * 0.7 + 0.3;
        dot.style.filter = 'blur(1px) drop-shadow(0 0 4px #10b981)';
        dot.style.animation = `floatEnemy ${Math.random() * 3 + 2}s ease-in-out infinite alternate`;
        particlesContainer.appendChild(dot);
      }
    } else if (envKey === 'dragon-mountain') {
      fieldTitle.textContent = "Dragon Mountain";
      
      // Volcanic platforms
      pPlatform.innerHTML = `
        <svg viewBox="0 0 260 60" width="100%" height="100%">
          <polygon points="10,10 250,5 240,55 20,55" fill="#3d3d3d" stroke="#ff4757" stroke-width="3" filter="drop-shadow(0 0 6px #ff4757)" />
        </svg>
      `;
      ePlatform.innerHTML = `
        <svg viewBox="0 0 260 60" width="100%" height="100%">
          <polygon points="20,10 240,10 230,50 30,50" fill="#2f3542" stroke="#ff4757" stroke-width="2" />
        </svg>
      `;

      // Rocks / magma
      const r1 = this.createScenerySVG('peak', 'width: 100px; height: 150px; left: 8%; bottom: 65px; z-index: 2;');
      const r2 = this.createScenerySVG('chimney', 'width: 80px; height: 130px; right: 10%; bottom: 85px; z-index: 2;');
      sceneryContainer.appendChild(r1);
      sceneryContainer.appendChild(r2);

      // Embers rising
      for (let i = 0; i < 20; i++) {
        const ash = document.createElement('div');
        ash.style.position = 'absolute';
        ash.style.background = 'linear-gradient(to top, #ef4444, #f59e0b)';
        ash.style.borderRadius = '50%';
        ash.style.width = Math.random() * 3 + 2 + 'px';
        ash.style.height = ash.style.width;
        ash.style.left = Math.random() * 100 + '%';
        ash.style.bottom = '10%';
        ash.style.opacity = Math.random() * 0.8 + 0.2;
        ash.style.animation = `floatPlayer ${Math.random() * 2 + 1.5}s ease-out infinite`;
        particlesContainer.appendChild(ash);
      }
    } else {
      fieldTitle.textContent = "Grass Plains";
      
      // Default Grass platforms
      pPlatform.innerHTML = `
        <svg viewBox="0 0 260 60" width="100%" height="100%">
          <ellipse cx="130" cy="30" rx="120" ry="24" fill="#a7f3d0" stroke="#10b981" stroke-width="2" />
        </svg>
      `;
      ePlatform.innerHTML = `
        <svg viewBox="0 0 260 60" width="100%" height="100%">
          <ellipse cx="130" cy="30" rx="110" ry="20" fill="#a7f3d0" stroke="#10b981" stroke-width="1.5" />
        </svg>
      `;

      // Grass puffs
      const g1 = this.createScenerySVG('pine', 'width: 50px; height: 80px; left: 10%; bottom: 50px; opacity:0.8;', 'sway-slow');
      const g2 = this.createScenerySVG('oak', 'width: 60px; height: 90px; right: 15%; bottom: 60px; opacity:0.7;', 'sway-slow');
      sceneryContainer.appendChild(g1);
      sceneryContainer.appendChild(g2);

      // Fluffy clouds floating at the top of the canvas
      for (let i = 0; i < 4; i++) {
        const cloud = document.createElement('div');
        cloud.style.position = 'absolute';
        cloud.style.background = 'rgba(255,255,255,0.2)';
        cloud.style.borderRadius = '50px';
        cloud.style.width = Math.random() * 120 + 80 + 'px';
        cloud.style.height = '30px';
        cloud.style.left = Math.random() * 80 + '%';
        cloud.style.top = Math.random() * 80 + 30 + 'px';
        cloud.style.filter = 'blur(4px)';
        particlesContainer.appendChild(cloud);
      }
    }
  }

  createScenerySVG(type, styleString, animClass = '') {
    const el = document.createElement('div');
    el.className = `scenery-item ${animClass}`;
    el.style.cssText = styleString;
    
    let svgContent = '';
    if (type === 'pine') {
      svgContent = `
        <svg viewBox="0 0 80 140" width="100%" height="100%">
          <rect x="36" y="90" width="8" height="50" fill="#6d4c41" />
          <polygon points="40,10 15,60 65,60" fill="#10b981" />
          <polygon points="40,30 20,75 60,75" fill="#10b981" />
          <polygon points="40,50 25,95 55,95" fill="#059669" />
        </svg>
      `;
    } else if (type === 'oak') {
      svgContent = `
        <svg viewBox="0 0 100 160" width="100%" height="100%">
          <path d="M 44 110 Q 50 160, 50 160 L 60 160 Q 56 110, 56 95 Z" fill="#5c4033" />
          <circle cx="50" cy="55" r="42" fill="#10b981" opacity="0.95" />
          <circle cx="38" cy="40" r="28" fill="#34d399" />
          <circle cx="62" cy="42" r="28" fill="#059669" />
        </svg>
      `;
    } else if (type === 'peak') {
      svgContent = `
        <svg viewBox="0 0 100 150" width="100%" height="100%">
          <polygon points="50,15 10,150 90,150" fill="#2d3436" stroke="#1e272e" stroke-width="1.5" />
          <polygon points="50,15 32,70 50,85 68,70" fill="#7f8c8d" opacity="0.4" />
        </svg>
      `;
    } else if (type === 'chimney') {
      svgContent = `
        <svg viewBox="0 0 90 140" width="100%" height="100%">
          <polygon points="45,25 15,140 75,140" fill="#3d3d3d" />
          <ellipse cx="45" cy="25" rx="10" ry="4" fill="#ff7675" />
        </svg>
      `;
    }

    el.innerHTML = svgContent;
    return el;
  }

  startBattle() {
    if (!this.trainerName || !this.playerPoke) return;
    
    // Fetch battle type selection
    const bTypeEl = document.querySelector('input[name="battle-type"]:checked');
    this.battleType = bTypeEl ? bTypeEl.value : 'Wild Pokémon';

    window.audioSynth.playClick();
    
    // Choose opponent Pokémon
    let availableEnemies = POKEMON_DB.filter(p => p.id !== this.playerPoke.id);
    if (availableEnemies.length === 0) availableEnemies = POKEMON_DB;
    this.enemyPoke = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];

    // Initialize HP, Energy, and Multipliers
    this.playerHp = this.playerPoke.maxHp;
    this.enemyHp = this.enemyPoke.maxHp;
    this.playerEnergy = 24;
    
    this.playerAtkMult = 1.0;
    this.playerDefMult = 1.0;
    this.enemyAtkMult = 1.0;
    this.enemyDefMult = 1.0;

    // Set UI HUD Text & Elements
    document.getElementById('hud-player-trainer').textContent = `Trainer ${this.trainerName}`;
    document.getElementById('hud-player-name').textContent = this.playerPoke.name;
    document.getElementById('hud-player-level').textContent = `Lv.${this.trainerLevel}`;
    document.getElementById('hud-player-type').className = `badge-type ${this.playerPoke.type}`;
    document.getElementById('hud-player-type').textContent = this.playerPoke.type;
    
    // Set Opponent HUD details based on battle type
    const enemyTrainerTag = document.getElementById('hud-enemy-trainer');
    if (this.battleType === 'Trainer Duel') {
      enemyTrainerTag.textContent = "Gary Oak";
      document.getElementById('hud-enemy-level').textContent = `Lv.50`;
    } else if (this.battleType === 'Tournament') {
      enemyTrainerTag.textContent = "Tournament Rival";
      document.getElementById('hud-enemy-level').textContent = `Lv.52`;
    } else {
      enemyTrainerTag.textContent = "Wild Pokémon";
      document.getElementById('hud-enemy-level').textContent = `Lv.50`;
    }
    
    document.getElementById('hud-enemy-name').textContent = this.enemyPoke.name;
    document.getElementById('hud-enemy-type').className = `badge-type ${this.enemyPoke.type}`;
    document.getElementById('hud-enemy-type').textContent = this.enemyPoke.type;

    // Load SVG structures
    document.getElementById('player-trainer-box').innerHTML = TRAINER_PLAYER_SVG;
    document.getElementById('enemy-trainer-box').innerHTML = (this.battleType !== 'Wild Pokémon') ? TRAINER_ENEMY_SVG : '';
    
    document.getElementById('player-sprite-box').innerHTML = this.playerPoke.svg;
    document.getElementById('enemy-sprite-box').innerHTML = this.enemyPoke.svg;

    // Initial animations hide state
    const playerWrapper = document.getElementById('player-sprite-wrapper');
    const enemyWrapper = document.getElementById('enemy-sprite-wrapper');
    const playerTrainer = document.getElementById('player-trainer-wrapper');
    const enemyTrainer = document.getElementById('enemy-trainer-wrapper');
    
    playerWrapper.style.opacity = '0';
    playerWrapper.style.transform = 'scale(0)';
    enemyWrapper.style.opacity = '0';
    enemyWrapper.style.transform = 'scale(0)';
    
    playerTrainer.style.opacity = '1';
    playerTrainer.style.transform = 'scale(1)';
    if (this.battleType !== 'Wild Pokémon') {
      enemyTrainer.style.opacity = '1';
      enemyTrainer.style.transform = 'scale(1)';
    } else {
      enemyTrainer.style.opacity = '0';
    }

    this.updateHpBars();
    this.updateEnergyBars();
    this.renderActionSidebar();

    // Transition Setup Screen to Arena Screen
    this.setupView.classList.remove('active');
    setTimeout(() => {
      this.setupView.style.display = 'none';
      this.arenaView.style.display = 'block';
      setTimeout(() => {
        this.arenaView.classList.add('active');
        this.setEnvironment(this.selectedEnv);
        this.clearLogs();
        this.executeIntroThrow();
      }, 50);
    }, 500);
  }

  renderActionSidebar() {
    // We update action tooltips or labels based on chosen Pokémon moves
    const physMove = this.playerPoke.moves[0];
    const specMove = this.playerPoke.moves[1];
    const buffMove = this.playerPoke.moves[2];

    const physBtn = document.getElementById('action-physical');
    const specBtn = document.getElementById('action-special');
    const buffBtn = document.getElementById('action-buff');

    physBtn.title = `${physMove.name} (Power: ${physMove.power}, Cost: ${physMove.energyCost} EN)`;
    physBtn.querySelector('.action-label').textContent = physMove.name;

    specBtn.title = `${specMove.name} (Power: ${specMove.power}, Cost: ${specMove.energyCost} EN)`;
    specBtn.querySelector('.action-label').textContent = specMove.name;

    buffBtn.title = `${buffMove.name} (${buffMove.desc}, Cost: ${buffMove.energyCost} EN)`;
    buffBtn.querySelector('.action-label').textContent = buffMove.name.split(' ')[0];
  }

  executeIntroThrow() {
    this.lockControls();
    
    const pTrainer = document.getElementById('player-trainer-wrapper');
    const eTrainer = document.getElementById('enemy-trainer-wrapper');

    if (this.battleType === 'Trainer Duel') {
      this.queueLog(`Gary Oak challenges you to a duel!`, 'system');
    } else if (this.battleType === 'Tournament') {
      this.queueLog(`Round 1: Pokémon Kingdom Tournament!`, 'system');
    } else {
      this.queueLog(`A wild ${this.enemyPoke.name.toUpperCase()} appeared!`, 'system');
    }
    
    setTimeout(() => {
      if (this.battleType !== 'Wild Pokémon') {
        eTrainer.classList.add('trainer-throw');
        window.audioSynth.playQuickAttack();
        this.queueLog(`Gary: Get ready! Go, ${this.enemyPoke.name.toUpperCase()}!`, 'enemy');
      } else {
        this.queueLog(`Wild ${this.enemyPoke.name.toUpperCase()} roars into the arena!`, 'enemy');
      }
      
      this.triggerIntroBallVfx('enemy', () => {
        if (this.battleType !== 'Wild Pokémon') {
          eTrainer.classList.remove('trainer-throw');
        }
        const enemyWrapper = document.getElementById('enemy-sprite-wrapper');
        enemyWrapper.style.opacity = '1';
        enemyWrapper.style.transform = 'scale(1)';
        window.audioSynth.playHit();
        
        setTimeout(() => {
          pTrainer.classList.add('trainer-throw');
          window.audioSynth.playQuickAttack();
          this.queueLog(`${this.trainerName}: Go! ${this.playerPoke.name.toUpperCase()}!`, 'player');
          
          this.triggerIntroBallVfx('player', () => {
            pTrainer.classList.remove('trainer-throw');
            const playerWrapper = document.getElementById('player-sprite-wrapper');
            playerWrapper.style.opacity = '1';
            playerWrapper.style.transform = 'scale(1.15) scaleX(-1)';
            window.audioSynth.playHit();
            
            setTimeout(() => {
              this.unlockControls();
            }, 500);
          });
        }, 1000);
      });
    }, 1000);
  }

  triggerIntroBallVfx(side, onComplete) {
    const overlay = document.getElementById('vfx-overlay');
    const ball = document.createElement('div');
    ball.style.position = 'absolute';
    ball.style.width = '24px';
    ball.style.height = '24px';
    ball.style.zIndex = '5';
    ball.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    ball.innerHTML = `
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        <circle cx="12" cy="12" r="11" fill="#fff" stroke="#2c3e50" stroke-width="1.5" />
        <path d="M 1 12 C 1 6, 23 6, 23 12 Z" fill="#ef4444" />
        <line x1="1" y1="12" x2="23" y2="12" stroke="#2c3e50" stroke-width="1.5" />
        <circle cx="12" cy="12" r="4" fill="#fff" stroke="#2c3e50" stroke-width="1.5" />
      </svg>
    `;

    if (side === 'player') {
      ball.style.left = '6%';
      ball.style.bottom = '150px';
      overlay.appendChild(ball);
      
      setTimeout(() => {
        ball.style.left = '28%';
        ball.style.bottom = '120px';
        ball.style.transform = 'rotate(360deg) scale(0.6)';
        setTimeout(() => {
          ball.remove();
          onComplete();
        }, 500);
      }, 50);
    } else {
      ball.style.right = '7%';
      ball.style.top = '140px';
      overlay.appendChild(ball);
      
      setTimeout(() => {
        ball.style.right = '28%';
        ball.style.top = '190px';
        ball.style.transform = 'rotate(-360deg) scale(0.6)';
        setTimeout(() => {
          ball.remove();
          onComplete();
        }, 500);
      }, 50);
    }
  }

  updateHpBars() {
    const playerPct = Math.max(0, (this.playerHp / this.playerPoke.maxHp) * 100);
    const enemyPct = Math.max(0, (this.enemyHp / this.enemyPoke.maxHp) * 100);

    const playerBar = document.getElementById('player-hp-bar');
    const enemyBar = document.getElementById('enemy-hp-bar');

    playerBar.style.width = `${playerPct}%`;
    enemyBar.style.width = `${enemyPct}%`;

    document.getElementById('player-hp-text').textContent = `${this.playerHp}/${this.playerPoke.maxHp}`;
    document.getElementById('enemy-hp-text').textContent = `${this.enemyHp}/${this.enemyPoke.maxHp}`;

    this.updateBarColor(playerBar, playerPct);
    this.updateBarColor(enemyBar, enemyPct);
  }

  updateBarColor(barElement, percentage) {
    if (percentage > 50) {
      barElement.style.backgroundImage = 'var(--hp-green)';
    } else if (percentage > 20) {
      barElement.style.backgroundImage = 'var(--hp-orange)';
    } else {
      barElement.style.backgroundImage = 'var(--hp-red)';
    }
  }

  updateEnergyBars() {
    const energyPct = Math.max(0, (this.playerEnergy / this.maxEnergy) * 100);
    const energyBar = document.getElementById('player-energy-bar');
    energyBar.style.width = `${energyPct}%`;
    document.getElementById('player-energy-text').textContent = `${this.playerEnergy}/${this.maxEnergy}`;
  }

  queueLog(message, styleClass) {
    this.logQueue.push({ message, styleClass });
    this.processLogQueue();
  }

  processLogQueue() {
    if (this.isWritingLog || this.logQueue.length === 0) return;

    this.isWritingLog = true;
    const { message, styleClass } = this.logQueue.shift();

    const line = document.createElement('div');
    line.className = `log-line ${styleClass}`;
    this.logContainer.appendChild(line);
    this.logContainer.scrollTop = this.logContainer.scrollHeight;

    let index = 0;
    const typeNextChar = () => {
      if (index < message.length) {
        line.textContent += message[index];
        index++;
        setTimeout(typeNextChar, 15);
      } else {
        this.isWritingLog = false;
        this.processLogQueue();
      }
    };
    typeNextChar();
  }

  clearLogs() {
    this.logQueue = [];
    this.logContainer.innerHTML = '';
    this.isWritingLog = false;
  }

  lockControls() {
    this.isControlsLocked = true;
    document.querySelectorAll('.sidebar-action-btn').forEach(btn => btn.disabled = true);
  }

  unlockControls() {
    this.isControlsLocked = false;
    document.querySelectorAll('.sidebar-action-btn').forEach(btn => btn.disabled = false);
  }

  calculateDamage(attacker, defender, move, atkMult, defMult) {
    const level = attacker.level || 50;
    const attack = attacker.attack * atkMult;
    const defense = defender.defense * defMult;
    const power = move.power;

    let damage = Math.floor((((2 * level / 5 + 2) * power * (attack / defense)) / 50) + 2);

    const attackerType = move.type || attacker.type;
    const defenderType = defender.type;
    const multiplier = TYPE_CHART[attackerType][defenderType] || 1.0;

    let isSuperEffective = multiplier > 1.0;
    let isNotEffective = multiplier < 1.0;
    damage = Math.floor(damage * multiplier);

    let isCritical = Math.random() < 0.12;
    if (isCritical) {
      damage = Math.floor(damage * 1.8);
    }

    const missChance = 1 - move.accuracy;
    let isMiss = Math.random() < missChance;
    if (isMiss) {
      damage = 0;
    }

    return {
      damage,
      isCritical,
      isSuperEffective,
      isNotEffective,
      isMiss
    };
  }

  executeRound(moveKey) {
    const move = this.playerPoke.moves.find(m => m.key === moveKey);
    if (!move) return;

    // Check Energy Cost
    if (this.playerEnergy < move.energyCost) {
      window.audioSynth.playMiss();
      this.queueLog(`Not enough Energy! Rest or Strike to recover EN.`, 'system');
      return;
    }

    this.lockControls();

    // Deduct Energy
    this.playerEnergy = Math.max(0, this.playerEnergy - move.energyCost);
    this.updateEnergyBars();

    const playerWrapper = document.getElementById('player-sprite-wrapper');
    const enemyWrapper = document.getElementById('enemy-sprite-wrapper');
    const playerTrainer = document.getElementById('player-trainer-wrapper');
    const stage = document.getElementById('battlefield-stage');

    // Command trigger
    playerTrainer.classList.add('trainer-command');
    this.queueLog(`${this.trainerName}: ${this.playerPoke.name.toUpperCase()}, use ${move.name.toUpperCase()}!`, 'player');

    setTimeout(() => {
      playerTrainer.classList.remove('trainer-command');
      
      // Move execution
      if (move.category === 'heal') {
        window.audioSynth.playClick();
        this.triggerVfxOverlay('player', 'heal');
        
        const oldPlayerHp = this.playerHp;
        this.playerHp = Math.min(this.playerPoke.maxHp, this.playerHp + move.amt);
        this.updateHpBars();
        
        const diff = this.playerHp - oldPlayerHp;
        this.queueLog(`${this.playerPoke.name.toUpperCase()} recovered ${diff} HP!`, 'advantage');
        this.triggerTextPopup(playerWrapper, `+${diff} HP`, 'effective');

        setTimeout(() => {
          this.executeEnemyTurn();
        }, 1400);

      } else if (move.category === 'buff') {
        window.audioSynth.playClick();
        this.triggerVfxOverlay('player', 'shield');

        if (move.stat === 'atk') {
          this.playerAtkMult = move.mult;
          this.queueLog(`${this.playerPoke.name.toUpperCase()}'s Attack rose sharply!`, 'system');
        } else {
          this.playerDefMult = move.mult;
          this.queueLog(`${this.playerPoke.name.toUpperCase()}'s Defense rose sharply!`, 'system');
        }
        
        this.triggerTextPopup(playerWrapper, 'BUFF UP!', 'effective');

        setTimeout(() => {
          this.executeEnemyTurn();
        }, 1400);

      } else {
        // Physical/Special Strike
        playerWrapper.classList.add('attack-dash-player');
        
        // Attack SFX
        if (move.type === 'electric') window.audioSynth.playThunder();
        else if (move.type === 'fire') window.audioSynth.playHeavyAttack();
        else if (move.type === 'water') window.audioSynth.playQuickAttack();
        else window.audioSynth.playTackle();

        setTimeout(() => {
          playerWrapper.classList.remove('attack-dash-player');
          this.triggerVfxOverlay('enemy', move.key);

          const results = this.calculateDamage(this.playerPoke, this.enemyPoke, move, this.playerAtkMult, this.enemyDefMult);

          if (results.isMiss) {
            window.audioSynth.playMiss();
            this.queueLog(`The attack MISSED!`, 'system');
            this.triggerTextPopup(enemyWrapper, 'MISS!', 'miss');
          } else {
            this.enemyHp = Math.max(0, this.enemyHp - results.damage);
            this.updateHpBars();

            if (results.isCritical) {
              window.audioSynth.playCritical();
              stage.classList.add('shake-screen');
              enemyWrapper.classList.add('flash-red');
              this.queueLog(`CRITICAL HIT!`, 'critical');
              this.triggerTextPopup(enemyWrapper, 'CRITICAL HIT!', 'critical');
              setTimeout(() => stage.classList.remove('shake-screen'), 400);
            } else {
              window.audioSynth.playHit();
              enemyWrapper.classList.add('flash-red');
              this.triggerTextPopup(enemyWrapper, `-${results.damage}`, 'damage');
            }

            setTimeout(() => {
              enemyWrapper.classList.remove('flash-red');
            }, 500);

            if (results.isSuperEffective) {
              this.queueLog(`It's SUPER EFFECTIVE!`, 'advantage');
              this.triggerTextPopup(enemyWrapper, 'SUPER EFFECTIVE!', 'effective');
            }

            this.queueLog(`Dealt ${results.damage} damage to wild ${this.enemyPoke.name.toUpperCase()}!`, 'damage');
          }

          if (this.enemyHp <= 0) {
            setTimeout(() => {
              this.endBattle(true);
            }, 1200);
          } else {
            setTimeout(() => {
              this.executeEnemyTurn();
            }, 1400);
          }
        }, 300);
      }
    }, 700);
  }

  executeEnemyTurn() {
    const enemyWrapper = document.getElementById('enemy-sprite-wrapper');
    const playerWrapper = document.getElementById('player-sprite-wrapper');
    const enemyTrainer = document.getElementById('enemy-trainer-wrapper');
    const stage = document.getElementById('battlefield-stage');

    // AI Selects move (cannot choose moves that cost more energy than it has)
    // Gary tracks simulated energy or just selects randomly (for simplicity, selects randomly)
    const move = this.enemyPoke.moves[Math.floor(Math.random() * this.enemyPoke.moves.length)];

    if (this.battleType !== 'Wild Pokémon') {
      enemyTrainer.classList.add('trainer-command');
      this.queueLog(`Gary: Go, ${move.name.toUpperCase()}!`, 'enemy');
    } else {
      this.queueLog(`Wild ${this.enemyPoke.name.toUpperCase()} uses ${move.name.toUpperCase()}!`, 'enemy');
    }

    setTimeout(() => {
      if (this.battleType !== 'Wild Pokémon') {
        enemyTrainer.classList.remove('trainer-command');
      }

      if (move.category === 'heal') {
        window.audioSynth.playClick();
        this.triggerVfxOverlay('enemy', 'heal');
        
        const oldEnemyHp = this.enemyHp;
        this.enemyHp = Math.min(this.enemyPoke.maxHp, this.enemyHp + move.amt);
        this.updateHpBars();
        
        const diff = this.enemyHp - oldEnemyHp;
        this.queueLog(`Opponent ${this.enemyPoke.name.toUpperCase()} recovered ${diff} HP!`, 'advantage');
        this.triggerTextPopup(enemyWrapper, `+${diff} HP`, 'effective');

        setTimeout(() => {
          this.endTurnRecharge();
        }, 1400);

      } else if (move.category === 'buff') {
        window.audioSynth.playClick();
        this.triggerVfxOverlay('enemy', 'shield');

        if (move.stat === 'atk') {
          this.enemyAtkMult = move.mult;
          this.queueLog(`Opponent ${this.enemyPoke.name.toUpperCase()}'s Attack rose sharply!`, 'system');
        } else {
          this.enemyDefMult = move.mult;
          this.queueLog(`Opponent ${this.enemyPoke.name.toUpperCase()}'s Defense rose sharply!`, 'system');
        }
        this.triggerTextPopup(enemyWrapper, 'BUFF UP!', 'effective');

        setTimeout(() => {
          this.endTurnRecharge();
        }, 1400);

      } else {
        enemyWrapper.classList.add('attack-dash-enemy');

        if (move.type === 'electric') window.audioSynth.playThunder();
        else if (move.type === 'fire') window.audioSynth.playHeavyAttack();
        else if (move.type === 'water') window.audioSynth.playQuickAttack();
        else window.audioSynth.playTackle();

        setTimeout(() => {
          enemyWrapper.classList.remove('attack-dash-enemy');
          this.triggerVfxOverlay('player', move.key);

          const results = this.calculateDamage(this.enemyPoke, this.playerPoke, move, this.enemyAtkMult, this.playerDefMult);

          if (results.isMiss) {
            window.audioSynth.playMiss();
            this.queueLog(`Gary's attack MISSED!`, 'system');
            this.triggerTextPopup(playerWrapper, 'MISS!', 'miss');
          } else {
            this.playerHp = Math.max(0, this.playerHp - results.damage);
            this.updateHpBars();

            if (results.isCritical) {
              window.audioSynth.playCritical();
              stage.classList.add('shake-screen');
              playerWrapper.classList.add('flash-red');
              this.queueLog(`CRITICAL HIT on your Pokémon!`, 'critical');
              this.triggerTextPopup(playerWrapper, 'CRITICAL HIT!', 'critical');
              setTimeout(() => stage.classList.remove('shake-screen'), 400);
            } else {
              window.audioSynth.playHit();
              playerWrapper.classList.add('flash-red');
              this.triggerTextPopup(playerWrapper, `-${results.damage}`, 'damage');
            }

            setTimeout(() => {
              playerWrapper.classList.remove('flash-red');
            }, 500);

            if (results.isSuperEffective) {
              this.queueLog(`It's SUPER EFFECTIVE on ${this.playerPoke.name.toUpperCase()}!`, 'advantage');
              this.triggerTextPopup(playerWrapper, 'SUPER EFFECTIVE!', 'effective');
            }

            this.queueLog(`${this.enemyPoke.name.toUpperCase()} dealt ${results.damage} damage to your Pokémon!`, 'damage');
          }

          if (this.playerHp <= 0) {
            setTimeout(() => {
              this.endBattle(false);
            }, 1200);
          } else {
            setTimeout(() => {
              this.endTurnRecharge();
            }, 800);
          }
        }, 300);
      }
    }, 700);
  }

  executeRestAction() {
    this.lockControls();
    
    // REST action: uses 0 energy, recovers +50 HP and restores +24 energy fully!
    this.queueLog(`${this.trainerName} orders ${this.playerPoke.name.toUpperCase()} to REST!`, 'system');
    
    const playerWrapper = document.getElementById('player-sprite-wrapper');
    window.audioSynth.playClick();
    this.triggerVfxOverlay('player', 'heal');

    setTimeout(() => {
      // HP heal
      const oldHp = this.playerHp;
      this.playerHp = Math.min(this.playerPoke.maxHp, this.playerHp + 50);
      const hpDiff = this.playerHp - oldHp;
      this.updateHpBars();

      // Energy fully restore
      this.playerEnergy = this.maxEnergy;
      this.updateEnergyBars();

      this.queueLog(`${this.playerPoke.name.toUpperCase()} rested, recovering +${hpDiff} HP and fully restoring Energy!`, 'advantage');
      this.triggerTextPopup(playerWrapper, `REST & RECHARGE`, 'effective');

      setTimeout(() => {
        this.executeEnemyTurn();
      }, 1400);
    }, 600);
  }

  executeRunAway() {
    this.lockControls();
    this.queueLog(`Running away from the battle...`, 'system');
    
    window.audioSynth.playDefeat();
    setTimeout(() => {
      this.endBattle(false, true); // Log as Loss
    }, 800);
  }

  endTurnRecharge() {
    // Regenerate +3 energy at end of full round
    this.playerEnergy = Math.min(this.maxEnergy, this.playerEnergy + 3);
    this.updateEnergyBars();
    this.queueLog(`Your Pokémon regenerated +3 Energy.`, 'system');
    this.unlockControls();
  }

  triggerVfxOverlay(targetSide, moveKey) {
    const overlay = document.getElementById('vfx-overlay');
    const vfx = document.createElement('div');
    vfx.className = 'vfx-element';
    
    if (targetSide === 'enemy') {
      vfx.style.right = '28%';
      vfx.style.top = '140px';
    } else {
      vfx.style.left = '24%';
      vfx.style.bottom = '80px';
    }

    let svgContent = '';
    
    if (moveKey === 'thunderbolt' || moveKey === 'thunder') {
      vfx.className += ' vfx-lightning';
      svgContent = `
        <svg viewBox="0 0 90 340" width="100%" height="100%">
          <path d="M 45 0 L 15 130 L 70 150 L 20 340 L 30 340 L 80 180 L 30 150 L 60 0 Z" fill="#ff7" stroke="#fbbf24" stroke-width="2"/>
        </svg>
      `;
    } else if (moveKey === 'fireblast' || moveKey === 'power') {
      vfx.className += ' vfx-fire';
      vfx.style.color = '#ff4757';
      svgContent = `
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <path d="M 50 10 C 20 50, 40 80, 50 90 C 60 80, 80 50, 50 10 Z" fill="#f87171" stroke="#ef4444" stroke-width="2" />
        </svg>
      `;
    } else if (moveKey === 'hydropump' || moveKey === 'waterpulse') {
      vfx.className += ' vfx-water';
      vfx.style.color = '#3b82f6';
      svgContent = `
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="30" fill="#93c5fd" stroke="#3b82f6" stroke-width="3" opacity="0.85"/>
        </svg>
      `;
    } else if (moveKey === 'solarbeam') {
      vfx.className += ' vfx-grass';
      vfx.style.color = '#10b981';
      svgContent = `
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <ellipse cx="50" cy="50" rx="40" ry="15" fill="#a7f3d0" stroke="#10b981" stroke-width="3" />
        </svg>
      `;
    } else if (moveKey === 'heal' || moveKey === 'synthesis' || moveKey === 'rest') {
      vfx.className += ' vfx-heal';
      svgContent = `
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <rect x="44" y="20" width="12" height="60" fill="#fff" rx="3" />
          <rect x="20" y="44" width="60" height="12" fill="#fff" rx="3" />
        </svg>
      `;
    } else if (moveKey === 'shield' || moveKey === 'irondefense') {
      vfx.style.color = '#10b981';
      svgContent = `
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#34d399" stroke-width="4" stroke-dasharray="10 5"/>
        </svg>
      `;
    } else {
      // Strike impact
      vfx.style.color = '#f3f4f6';
      svgContent = `
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <polygon points="50,10 55,40 85,35 60,55 80,85 50,65 20,85 40,55 15,35 45,40" fill="#fff" stroke="#9ca3af" stroke-width="2" />
        </svg>
      `;
    }

    vfx.innerHTML = svgContent;
    overlay.appendChild(vfx);

    setTimeout(() => {
      vfx.remove();
    }, 800);
  }

  triggerTextPopup(targetWrapper, text, badgeClass) {
    const popup = document.createElement('div');
    popup.className = `battle-text-popup ${badgeClass}`;
    popup.textContent = text;
    popup.style.top = '10px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    
    targetWrapper.appendChild(popup);
    
    setTimeout(() => {
      popup.remove();
    }, 1200);
  }

  endBattle(isVictory, isFled = false) {
    this.lockControls();
    
    const card = document.getElementById('results-card-element');
    const playerTrainer = document.getElementById('player-trainer-wrapper');
    const enemyTrainer = document.getElementById('enemy-trainer-wrapper');
    const levelupAlert = document.getElementById('levelup-alert');
    levelupAlert.style.display = 'none';

    let resultString = '';
    
    if (isVictory) {
      resultString = 'Win';
      window.audioSynth.playVictory();
      
      if (this.battleType !== 'Wild Pokémon') {
        enemyTrainer.classList.add('trainer-dizzy');
      }
      document.getElementById('enemy-sprite-wrapper').style.opacity = '0';
      document.getElementById('enemy-sprite-wrapper').style.transform = 'scale(0)';

      card.className = 'results-card victory glass-panel';
      document.getElementById('results-title-text').textContent = 'VICTORY';
      document.getElementById('results-subtitle-text').textContent = `Congratulations, Trainer ${this.trainerName}!`;
      
      // Calculate rewards
      const levelFactor = this.enemyPoke.level;
      const xpReward = Math.floor(650 + (levelFactor * 15) + (Math.random() * 100));
      const coinsReward = Math.floor(100 + (levelFactor * 4) + (Math.random() * 30));
      this.rewards = { xp: xpReward, coins: coinsReward };
      
      document.getElementById('reward-xp').textContent = `+${xpReward} XP`;
      document.getElementById('reward-coins').textContent = `+${coinsReward} Coins`;
      
      document.getElementById('btn-rechoose').style.display = 'none';
      document.getElementById('btn-restart').style.display = 'block';

      this.resultsOverlay.classList.add('active');
      this.startConfetti();
      
      this.postBattleResult(resultString, xpReward, coinsReward);
    } else {
      resultString = 'Loss';
      window.audioSynth.playDefeat();
      
      playerTrainer.classList.add('trainer-dizzy');
      document.getElementById('player-sprite-wrapper').style.opacity = '0';
      document.getElementById('player-sprite-wrapper').style.transform = 'scale(0)';

      card.className = 'results-card defeat glass-panel';
      document.getElementById('results-title-text').textContent = 'DEFEAT';
      if (isFled) {
        document.getElementById('results-subtitle-text').textContent = `You fled from the battle field. Gary Oak claims victory.`;
      } else {
        document.getElementById('results-subtitle-text').textContent = `Your ${this.playerPoke.name} fainted. Gary claims victory.`;
      }
      
      this.rewards = { xp: 0, coins: 0 };
      document.getElementById('reward-xp').textContent = '0 XP';
      document.getElementById('reward-coins').textContent = '0 Coins';
      
      document.getElementById('btn-rechoose').style.display = 'block';
      document.getElementById('btn-restart').style.display = 'none';

      this.resultsOverlay.classList.add('active');
      
      this.postBattleResult(resultString, 0, 0);
    }
  }

  postBattleResult(resultStr, xpEarned, coinsEarned) {
    const postData = {
      opponent: this.enemyPoke.name,
      opponent_level: this.enemyPoke.level,
      result: resultStr,
      xp_earned: xpEarned,
      coins_earned: coinsEarned
    };

    if (this.trainerId) {
      postData.player = this.trainerId;
    } else {
      postData.player_name = this.trainerName;
    }

    // CSRF helper
    const getCookie = (name) => {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    };
    
    const csrftoken = getCookie('csrftoken');

    fetch('/api/battles/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken || ''
      },
      body: JSON.stringify(postData)
    })
      .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then(data => {
        // Update display to match secure backend rewards
        document.getElementById('reward-xp').textContent = `+${data.xp_earned} XP`;
        document.getElementById('reward-coins').textContent = `+${data.coins_earned} Coins`;

        // Update local trainer details on Victory/Defeat
        if (data.trainer) {
          const t = data.trainer;
          this.trainerId = t.id;
          this.trainerLevel = t.level;
          
          // Level up alert display
          if (t.level > this.trainerLevel || (this.trainerLevel && t.level > this.trainerLevel)) {
            const lvlAlert = document.getElementById('levelup-alert');
            document.getElementById('reward-level').textContent = `Lv. ${t.level}`;
            lvlAlert.style.display = 'flex';
          }
        }
        
        // Refresh Hall of Fame list & profiles list
        this.fetchBattleHistory();
        this.fetchTrainers();
      })
      .catch(err => console.error("Error posting battle results:", err));
  }

  resetToSelection() {
    this.stopConfetti();
    this.resultsOverlay.classList.remove('active');
    this.arenaView.classList.remove('active');
    
    document.getElementById('player-trainer-wrapper').className = 'trainer-wrapper player-trainer-wrapper float-anim-player';
    if (this.battleType !== 'Wild Pokémon') {
      document.getElementById('enemy-trainer-wrapper').className = 'trainer-wrapper enemy-trainer-wrapper float-anim-enemy';
    }

    setTimeout(() => {
      this.arenaView.style.display = 'none';
      this.setupView.style.display = 'block';
      setTimeout(() => {
        this.setupView.classList.add('active');
        
        // Refresh selections
        this.playerPoke = null;
        this.renderSetupSquad();
        
        // Retain trainer profile selections if they exist
        if (this.trainerId) {
          document.getElementById('trainer-profile-select').value = this.trainerId;
          const tr = this.trainersList.find(t => t.id == this.trainerId);
          if (tr) {
            document.getElementById('trainer-stats-preview').textContent = `Active Profile: ${tr.name} | Level ${tr.level} | ${tr.xp} XP | ${tr.coins} Coins`;
            document.getElementById('trainer-stats-preview').style.display = 'block';
          }
        } else {
          document.getElementById('trainer-profile-select').value = '';
          document.getElementById('trainer-name-input').value = '';
          document.getElementById('trainer-name-input').disabled = false;
          document.getElementById('trainer-stats-preview').style.display = 'none';
        }
        
        this.checkStartButton();
        this.unlockControls();
      }, 50);
    }, 500);
  }

  startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#ffeaa7', '#8c7ae6'];
    const particles = [];
    
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 5 + 3,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 8 - 4,
        tiltAngleIncremental: Math.random() * 0.05 + 0.02,
        tiltAngle: 0
      });
    }
    
    this.confettiActive = true;
    
    const draw = () => {
      if (!this.confettiActive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 2.5 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 12;
        
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
        
        if (p.y > canvas.height) {
          particles[idx] = p;
          p.x = Math.random() * canvas.width;
          p.y = -20;
        }
      });
      
      requestAnimationFrame(draw);
    };
    
    draw();
  }

  stopConfetti() {
    this.confettiActive = false;
    const canvas = document.getElementById('confetti-canvas');
    canvas.style.display = 'none';
  }
}

// Global reference initialization
window.battleSystem = new BattleArena();
