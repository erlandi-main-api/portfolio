// Matrix rain
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*';
const fontSize = 13;
let cols = Math.floor(canvas.width / fontSize);
let drops = Array(cols).fill(1);

function drawMatrix() {
  cols = Math.floor(canvas.width / fontSize);
  if (drops.length !== cols) drops = Array(cols).fill(1);
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = fontSize + 'px monospace';
  drops.forEach((y, i) => {
    const bright = Math.random() > 0.95;
    ctx.fillStyle = bright ? '#ffffff' : '#00ff41';
    const char = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(char, i * fontSize, y * fontSize);
    if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}
setInterval(drawMatrix, 38);

// Typewriter effect
const texts = ['Developer', 'Security Researcher', 'Bug Bounty Hunter', 'Pentester', 'Creator'];
let ti = 0, ci = 0, del = false;
const tw = document.getElementById('typewriter');

function typewrite() {
  const cur = texts[ti];
  if (!del) {
    tw.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { del = true; setTimeout(typewrite, 2000); return; }
  } else {
    tw.textContent = cur.slice(0, --ci);
    if (ci === 0) { del = false; ti = (ti + 1) % texts.length; }
  }
  setTimeout(typewrite, del ? 50 : 100);
}
typewrite();

// Mobile menu toggle
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('open'));
});

// Skill tab filter
document.querySelectorAll('.skill-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.skill-category').forEach(cat => {
      const show = filter === 'all' || cat.dataset.cat === filter;
      cat.classList.toggle('hidden', !show);
    });
  });
});

// Progress bar animation on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.progress-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.2 });

const progressSection = document.querySelector('.progress-section');
if (progressSection) observer.observe(progressSection);

// Scroll animation for cards
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card, .skill-category, .social-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s, border-color 0.3s';
  cardObserver.observe(el);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.background = window.scrollY > 50
    ? 'rgba(0,0,0,0.98)'
    : 'rgba(0,0,0,0.92)';
});
