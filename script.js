// Typewriter effect
const texts = ['Developer', 'Creator', 'Web Builder', 'Problem Solver'];
let ti = 0, ci = 0, del = false;
const tw = document.getElementById('typewriter');

function typewrite() {
  const cur = texts[ti];
  if (!del) {
    tw.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { del = true; setTimeout(typewrite, 1800); return; }
  } else {
    tw.textContent = cur.slice(0, --ci);
    if (ci === 0) { del = false; ti = (ti + 1) % texts.length; }
  }
  setTimeout(typewrite, del ? 60 : 110);
}
typewrite();

// Mobile menu toggle
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('open'));
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
}, { threshold: 0.3 });

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
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s';
  cardObserver.observe(el);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.background = window.scrollY > 50
    ? 'rgba(15,15,26,0.98)'
    : 'rgba(15,15,26,0.85)';
});
