/* ===== BOOT LOADER ===== */
const bootSeq = [
  { text: '> INITIALIZING KERNEL MODULES...', delay: 300 },
  { text: '> LOADING SECURITY PROTOCOLS...', delay: 500 },
  { text: '> ESTABLISHING ENCRYPTED TUNNEL...', delay: 700 },
  { text: '> DECRYPTING PROFILE DATA...', delay: 900 },
  { text: '> ACCESS GRANTED ✓', delay: 1100, success: true },
];

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runLoader() {
  const lines = document.getElementById('loaderLines');
  const fill = document.getElementById('loaderFill');
  const pct = document.getElementById('loaderPct');
  const status = document.getElementById('loaderStatus');

  for (let i = 0; i < bootSeq.length; i++) {
    const { text, delay, success } = bootSeq[i];
    const div = document.createElement('div');
    div.className = 'll' + (success ? '' : ' done');
    div.textContent = text;
    lines.appendChild(div);
    const p = Math.round(((i + 1) / bootSeq.length) * 100);
    fill.style.width = p + '%';
    pct.textContent = p + '%';
    status.textContent = success ? 'READY' : 'LOADING...';
    await sleep(delay);
  }
  await sleep(400);
  document.getElementById('loader').classList.add('hide');
  animateCounters();
}
runLoader();

/* ===== MATRIX RAIN ===== */
const mc = document.getElementById('matrixCanvas');
const mctx = mc.getContext('2d');
function resizeMC() { mc.width = innerWidth; mc.height = innerHeight; }
resizeMC();
window.addEventListener('resize', resizeMC);

const mchars = '01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&';
const mfs = 13;
let mdrops = [];
function initDrops() { mdrops = Array(Math.floor(mc.width / mfs)).fill(1); }
initDrops();
window.addEventListener('resize', initDrops);

function drawMatrix() {
  mctx.fillStyle = 'rgba(0,0,0,0.05)';
  mctx.fillRect(0, 0, mc.width, mc.height);
  mctx.font = mfs + 'px monospace';
  mdrops.forEach((y, i) => {
    const bright = Math.random() > 0.97;
    mctx.fillStyle = bright ? '#ffffff' : '#00ff41';
    mctx.globalAlpha = bright ? 0.8 : 0.6;
    mctx.fillText(mchars[Math.floor(Math.random() * mchars.length)], i * mfs, y * mfs);
    mctx.globalAlpha = 1;
    if (y * mfs > mc.height && Math.random() > 0.975) mdrops[i] = 0;
    mdrops[i]++;
  });
}
setInterval(drawMatrix, 38);

/* ===== PARTICLES (Hero) ===== */
const pc = document.getElementById('particleCanvas');
const pctx = pc.getContext('2d');
function resizePC() { pc.width = pc.offsetWidth; pc.height = pc.offsetHeight; }
resizePC();
window.addEventListener('resize', resizePC);

const particles = [];
const PCOUNT = 60;
for (let i = 0; i < PCOUNT; i++) {
  particles.push({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.5 + 0.5,
    a: Math.random(),
  });
}

function drawParticles() {
  pctx.clearRect(0, 0, pc.width, pc.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > pc.width) p.vx *= -1;
    if (p.y < 0 || p.y > pc.height) p.vy *= -1;
    pctx.beginPath();
    pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pctx.fillStyle = `rgba(0,255,65,${p.a * 0.6})`;
    pctx.fill();
  });
  // Lines between close particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        pctx.beginPath();
        pctx.moveTo(particles[i].x, particles[i].y);
        pctx.lineTo(particles[j].x, particles[j].y);
        pctx.strokeStyle = `rgba(0,255,65,${(1 - dist / 120) * 0.12})`;
        pctx.lineWidth = .5;
        pctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ===== CURSOR GLOW ===== */
const cg = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cg.style.left = e.clientX + 'px';
  cg.style.top = e.clientY + 'px';
});

/* ===== SCROLL PROGRESS ===== */
window.addEventListener('scroll', () => {
  const sp = document.getElementById('scrollProgress');
  const pct = (scrollY / (document.body.scrollHeight - innerHeight)) * 100;
  sp.style.width = pct + '%';

  const nav = document.getElementById('navbar');
  nav.style.background = scrollY > 50 ? 'rgba(0,0,0,.96)' : 'rgba(0,0,0,.85)';
});

/* ===== TYPEWRITER ===== */
const roles = ['Developer', 'Security Researcher', 'Bug Bounty Hunter', 'Pentester', 'Creator'];
let ri = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');

function typewrite() {
  const cur = roles[ri];
  if (!deleting) {
    tw.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { deleting = true; setTimeout(typewrite, 2200); return; }
  } else {
    tw.textContent = cur.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(typewrite, deleting ? 45 : 95);
}
typewrite();

/* ===== TAG SCRAMBLE ===== */
const SCHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
function scramble(el) {
  const orig = el.dataset.original || el.textContent;
  el.dataset.original = orig;
  let iter = 0;
  const iv = setInterval(() => {
    el.textContent = orig.split('').map((c, i) => {
      if (c === ' ') return ' ';
      if (i < iter) return orig[i];
      return SCHAR[Math.floor(Math.random() * SCHAR.length)];
    }).join('');
    if (iter >= orig.length) { clearInterval(iv); el.textContent = orig; }
    iter += 1 / 2.5;
  }, 25);
}
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('mouseenter', () => scramble(tag));
});

/* ===== SKILL TABS ===== */
document.querySelectorAll('.skill-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const f = tab.dataset.filter;
    document.querySelectorAll('.skill-card').forEach((c, i) => {
      const show = f === 'all' || c.dataset.cat === f;
      c.classList.toggle('hidden', !show);
      if (show) { c.style.animationDelay = (i * 0.05) + 's'; }
    });
  });
});

/* ===== MOBILE MENU ===== */
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('open'));
});

/* ===== COUNTER ANIMATION ===== */
function countUp(el) {
  const target = parseInt(el.dataset.target);
  let current = 0;
  const step = Math.max(1, Math.floor(target / 40));
  const iv = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(iv);
  }, 40);
}
function animateCounters() {
  document.querySelectorAll('.stat-num, .exp-num').forEach(el => countUp(el));
}

/* ===== PROGRESS BARS ===== */
const progObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.progress-fill').forEach((bar, i) => {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, i * 120);
      });
    }
  });
}, { threshold: 0.2 });
const ps = document.querySelector('.progress-section');
if (ps) progObs.observe(ps);

/* ===== SCROLL REVEAL (stagger) ===== */
document.querySelectorAll('.project-card, .skill-card, .social-card').forEach(el => {
  el.classList.add('reveal');
});
const revObs = new IntersectionObserver(entries => {
  entries.forEach((e, idx) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), idx * 80);
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));
