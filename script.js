/* ===== UTILS ===== */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ===== BOOT LOADER ===== */
const bootSeq = [
  '> INITIALIZING KERNEL MODULES...',
  '> LOADING SECURITY PROTOCOLS...',
  '> ESTABLISHING ENCRYPTED TUNNEL...',
  '> DECRYPTING PROFILE DATA...',
  '> ACCESS GRANTED ✓',
];

function hideLoader() {
  const loader = $('loader');
  if (loader) {
    loader.classList.add('hide');
    setTimeout(() => { loader.style.display = 'none'; }, 700);
  }
  animateCounters();
}

// Guaranteed fallback — always hide after 4s
setTimeout(hideLoader, 4000);

async function runLoader() {
  try {
    const lines = $('loaderLines');
    const fill = $('loaderFill');
    const pct = $('loaderPct');
    const status = $('loaderStatus');
    if (!lines || !fill) { hideLoader(); return; }

    for (let i = 0; i < bootSeq.length; i++) {
      const div = document.createElement('div');
      div.className = i < bootSeq.length - 1 ? 'll done' : 'll';
      div.textContent = bootSeq[i];
      lines.appendChild(div);
      const p = Math.round(((i + 1) / bootSeq.length) * 100);
      fill.style.width = p + '%';
      if (pct) pct.textContent = p + '%';
      if (status) status.textContent = i === bootSeq.length - 1 ? 'READY' : 'LOADING...';
      await sleep(i === bootSeq.length - 1 ? 200 : 280);
    }
    await sleep(350);
    hideLoader();
  } catch (e) {
    hideLoader();
  }
}
runLoader();

/* ===== MATRIX RAIN ===== */
try {
  const mc = $('matrixCanvas');
  if (mc) {
    const mctx = mc.getContext('2d');
    const mchars = '01アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&';
    const mfs = 13;
    let mdrops = [];
    const resizeMC = () => {
      mc.width = innerWidth; mc.height = innerHeight;
      mdrops = Array(Math.floor(mc.width / mfs)).fill(1);
    };
    resizeMC();
    window.addEventListener('resize', resizeMC);
    setInterval(() => {
      mctx.fillStyle = 'rgba(0,0,0,0.05)';
      mctx.fillRect(0, 0, mc.width, mc.height);
      mctx.font = mfs + 'px monospace';
      mdrops.forEach((y, i) => {
        const bright = Math.random() > 0.97;
        mctx.fillStyle = bright ? '#ffffff' : '#00ff41';
        mctx.globalAlpha = bright ? 0.8 : 0.55;
        mctx.fillText(mchars[Math.floor(Math.random() * mchars.length)], i * mfs, y * mfs);
        mctx.globalAlpha = 1;
        if (y * mfs > mc.height && Math.random() > 0.975) mdrops[i] = 0;
        mdrops[i]++;
      });
    }, 38);
  }
} catch (e) {}

/* ===== PARTICLES ===== */
try {
  const pc = $('particleCanvas');
  if (pc) {
    const pctx = pc.getContext('2d');
    const PCOUNT = 55;
    const pts = [];
    const resizePC = () => {
      pc.width = pc.parentElement ? pc.parentElement.offsetWidth || innerWidth : innerWidth;
      pc.height = pc.parentElement ? pc.parentElement.offsetHeight || innerHeight : innerHeight;
    };
    resizePC();
    window.addEventListener('resize', resizePC);
    for (let i = 0; i < PCOUNT; i++) {
      pts.push({
        x: Math.random() * (pc.width || innerWidth),
        y: Math.random() * (pc.height || innerHeight),
        vx: (Math.random() - .5) * .5,
        vy: (Math.random() - .5) * .5,
        r: Math.random() * 1.5 + .5,
        a: Math.random() * .5 + .2,
      });
    }
    const drawPts = () => {
      const w = pc.width, h = pc.height;
      pctx.clearRect(0, 0, w, h);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        pctx.beginPath();
        pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        pctx.fillStyle = `rgba(0,255,65,${p.a})`;
        pctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            pctx.beginPath();
            pctx.moveTo(pts[i].x, pts[i].y);
            pctx.lineTo(pts[j].x, pts[j].y);
            pctx.strokeStyle = `rgba(0,255,65,${(1 - d / 110) * .1})`;
            pctx.lineWidth = .5;
            pctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawPts);
    };
    drawPts();
  }
} catch (e) {}

/* ===== CURSOR GLOW ===== */
try {
  const cg = $('cursorGlow');
  if (cg) {
    document.addEventListener('mousemove', e => {
      cg.style.left = e.clientX + 'px';
      cg.style.top = e.clientY + 'px';
    });
  }
} catch (e) {}

/* ===== SCROLL PROGRESS ===== */
window.addEventListener('scroll', () => {
  try {
    const sp = $('scrollProgress');
    if (sp) {
      const p = scrollY / (document.body.scrollHeight - innerHeight) * 100;
      sp.style.width = Math.min(p, 100) + '%';
    }
    const nav = $('navbar');
    if (nav) nav.style.background = scrollY > 50 ? 'rgba(0,0,0,.97)' : 'rgba(0,0,0,.85)';
  } catch (e) {}
});

/* ===== TYPEWRITER ===== */
try {
  const roles = ['Developer', 'Security Researcher', 'Bug Bounty Hunter', 'Pentester', 'Creator'];
  let ri = 0, ci = 0, del = false;
  const tw = $('typewriter');
  if (tw) {
    const typewrite = () => {
      const cur = roles[ri];
      if (!del) {
        tw.textContent = cur.slice(0, ++ci);
        if (ci === cur.length) { del = true; setTimeout(typewrite, 2000); return; }
      } else {
        tw.textContent = cur.slice(0, --ci);
        if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
      }
      setTimeout(typewrite, del ? 45 : 95);
    };
    typewrite();
  }
} catch (e) {}

/* ===== SKILL TAB SCRAMBLE ===== */
try {
  const SCHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
  const scramble = el => {
    const orig = el.dataset.original || el.textContent;
    el.dataset.original = orig;
    let iter = 0;
    const iv = setInterval(() => {
      el.textContent = orig.split('').map((c, i) => {
        if (c === ' ') return ' ';
        return i < iter ? orig[i] : SCHAR[Math.floor(Math.random() * SCHAR.length)];
      }).join('');
      if (iter >= orig.length) { clearInterval(iv); el.textContent = orig; }
      iter += 1 / 2.5;
    }, 25);
  };
  $$('.tag').forEach(tag => tag.addEventListener('mouseenter', () => scramble(tag)));
} catch (e) {}

/* ===== SKILL TABS ===== */
try {
  $$('.skill-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.skill-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const f = tab.dataset.filter;
      $$('.skill-card').forEach(c => {
        c.classList.toggle('hidden', f !== 'all' && c.dataset.cat !== f);
      });
    });
  });
} catch (e) {}

/* ===== MOBILE MENU ===== */
try {
  const btn = $('menuBtn'), menu = $('mobileMenu');
  if (btn && menu) {
    btn.addEventListener('click', () => menu.classList.toggle('open'));
    $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }
} catch (e) {}

/* ===== COUNTER ANIMATION ===== */
function animateCounters() {
  try {
    $$('.stat-num, .exp-num').forEach(el => {
      const target = parseInt(el.dataset.target || '0');
      if (!target) return;
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 35));
      const iv = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur;
        if (cur >= target) clearInterval(iv);
      }, 45);
    });
  } catch (e) {}
}

/* ===== PROGRESS BARS ===== */
try {
  const progObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.progress-fill').forEach((bar, i) => {
          setTimeout(() => { bar.style.width = (bar.dataset.width || '0') + '%'; }, i * 100);
        });
      }
    });
  }, { threshold: 0.15 });
  const ps = document.querySelector('.progress-section');
  if (ps) progObs.observe(ps);
} catch (e) {}

/* ===== SCROLL REVEAL ===== */
try {
  $$('.project-card, .skill-card, .social-card').forEach(el => el.classList.add('reveal'));
  const revObs = new IntersectionObserver(entries => {
    entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), idx * 70);
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
  $$('.reveal').forEach(el => revObs.observe(el));
} catch (e) {}

// end script
