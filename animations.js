/* ============================================================
   ANIMATIONS.JS — Awwwards-level motion design
   ============================================================ */

/* ── 1. PAGE LOADER ─────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const fill   = document.querySelector('.loader-fill');
  const text   = document.querySelector('.loader-text');
  const msgs   = ['Initializing...', 'Loading Assets...', 'Almost Ready...', 'Welcome.'];
  let  progress = 0, msgIdx = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress > 100) progress = 100;
    fill.style.width = progress + '%';

    if (progress > 30 && msgIdx === 0) { text.textContent = msgs[1]; msgIdx = 1; }
    if (progress > 65 && msgIdx === 1) { text.textContent = msgs[2]; msgIdx = 2; }
    if (progress >= 100) {
      text.textContent = msgs[3];
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('loader-out');
        setTimeout(() => { loader.style.display = 'none'; revealHome(); }, 700);
      }, 400);
    }
  }, 80);
});

function revealHome() {
  const els = document.querySelectorAll('.home-content h1, .home-content .text-animate, .home-content p, .btn-box, .home-sci');
  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200 + i * 150);
  });
}

/* ── 2. PARTICLE CANVAS ─────────────────────────────────── */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let   W, H, mouse = { x: -999, y: -999 }, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(true); }
  reset(init) {
    this.x  = Math.random() * W;
    this.y  = init ? Math.random() * H : H + 10;
    this.r  = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(Math.random() * 0.4 + 0.1);
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '0,212,255' : '124,58,237';
  }
  update() {
    const dx = this.x - mouse.x, dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      const force = (120 - dist) / 120;
      this.vx += (dx / dist) * force * 0.6;
      this.vy += (dy / dist) * force * 0.6;
    }
    this.vx *= 0.97;
    this.vy *= 0.97;
    this.x += this.vx;
    this.y += this.vy;
    if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset(false);
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 160; i++) particles.push(new Particle());

/* draw connecting lines between nearby particles */
function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 90) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,212,255,${0.08 * (1 - d / 90)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, W, H);
  drawLines();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
document.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

/* ── 3. DUAL CURSOR ─────────────────────────────────────── */
const cursorGlow = document.querySelector('.cursor-glow');
const cursorDot  = document.querySelector('.cursor-dot');
let cx = 0, cy = 0, gx = 0, gy = 0;

document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });

(function animateCursor() {
  gx += (cx - gx) * 0.12;
  gy += (cy - gy) * 0.12;
  cursorGlow.style.left = gx - 15 + 'px';
  cursorGlow.style.top  = gy - 15 + 'px';
  cursorDot.style.left  = cx - 3 + 'px';
  cursorDot.style.top   = cy - 3 + 'px';
  requestAnimationFrame(animateCursor);
})();

/* cursor scale on hover interactive elements */
document.querySelectorAll('a, button, .btn, .content, .skills-content').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorGlow.style.transform = 'scale(2.5)';
    cursorGlow.style.opacity   = '0.6';
  });
  el.addEventListener('mouseleave', () => {
    cursorGlow.style.transform = 'scale(1)';
    cursorGlow.style.opacity   = '1';
  });
});

/* ── 4. SCROLL REVEAL ───────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* staggered card reveals */
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.content, .skills-content, .progress');
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.classList.add('card-revealed');
        }, i * 80);
      });
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.education-box, .skills-box, .education-row').forEach(el => cardObserver.observe(el));

/* ── 5. MAGNETIC BUTTONS ────────────────────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width  / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)';
    btn.style.transition = 'transform 0.4s ease';
  });
});

/* ── 6. TILT CARDS ──────────────────────────────────────── */
document.querySelectorAll('.content').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateY(0)';
    card.style.transition = 'transform 0.5s ease';
  });
});

/* ── 7. GLITCH TEXT ON HOVER ────────────────────────────── */
document.querySelectorAll('.heading').forEach(h => {
  h.addEventListener('mouseenter', () => h.classList.add('glitch'));
  h.addEventListener('mouseleave', () => h.classList.remove('glitch'));
});

/* ── 8. RIPPLE CLICK EFFECT ─────────────────────────────── */
document.addEventListener('click', e => {
  const ripple = document.createElement('div');
  ripple.className = 'click-ripple';
  ripple.style.left = e.clientX + 'px';
  ripple.style.top  = e.clientY + 'px';
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 800);
});

/* ── 9. NAVBAR SCROLL PROGRESS BAR ─────────────────────── */
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = scrolled + '%';
});

/* ── 10. SECTION NUMBER COUNTER ANIMATION ───────────────── */
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target + '+'; clearInterval(timer); }
    else el.textContent = Math.floor(start) + '+';
  }, 16);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.count));
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.home-content').forEach(el => statObserver.observe(el));
