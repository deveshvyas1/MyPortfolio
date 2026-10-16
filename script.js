/* ============================================================
   Devesh Vyas — Portfolio  |  TERMINAL theme interactions v4.0
   ============================================================ */

/* ---------- Theme toggle (terminal defaults to DARK) ---------- */
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);

function updateToggleIcon() {
    const icon = themeToggle.querySelector('i');
    // amber sun in dark, moon in light
    icon.className = htmlEl.getAttribute('data-theme') === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}
updateToggleIcon();

themeToggle.addEventListener('click', () => {
    const next = htmlEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggleIcon();
});

/* ---------- Mobile nav ---------- */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

/* ---------- Smooth scrolling ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ---------- Navbar state + active link on scroll ---------- */
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 220) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
}

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(() => { onScroll(); ticking = false; }); ticking = true; }
});
onScroll();

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.transitionDelay = (entry.target.dataset.delay || '0') + 'ms';
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.addEventListener('DOMContentLoaded', () => {
    const groups = [
        '.section-title', '.hero-text', '.hero-image',
        '.detail-item', '.about-card', '.skills-category', '.learning-section',
        '.project-card', '.stat-card', '.web3-skills', '.web3-achievements',
        '.resume-placeholder', '.resume-highlights',
        '.contact-info', '.contact-form', '.contact-method'
    ];
    groups.forEach(sel => {
        document.querySelectorAll(sel).forEach((el, i) => {
            el.classList.add('reveal');
            el.dataset.delay = Math.min(i * 60, 300);
            revealObserver.observe(el);
        });
    });

    // Safety fallback — never leave content hidden
    setTimeout(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
        });
    }, 1200);
});

window.addEventListener('beforeprint', () => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
});

/* ---------- Terminal typing effect on hero subtitle ---------- */
function typeWriter(element, text, speed = 55) {
    let i = 0;
    element.textContent = '';
    (function type() {
        if (i < text.length) { element.textContent += text.charAt(i++); setTimeout(type, speed); }
    })();
}

document.addEventListener('DOMContentLoaded', () => {
    const subtitle = document.querySelector('.hero-text h2');
    if (subtitle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const original = subtitle.textContent;
        setTimeout(() => typeWriter(subtitle, original, 55), 650);
    }
});

/* ---------- Contact form ---------- */
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const d = new FormData(contactForm);
    const name = d.get('name'), email = d.get('email'), subject = d.get('subject'), message = d.get('message');
    if (!name || !email || !subject || !message) { showNotification('ERROR: all fields are required.', 'error'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showNotification('ERROR: invalid email address.', 'error'); return; }
    showNotification('✓ Message sent. I will reply soon.', 'success');
    contactForm.reset();
});

/* ---------- Toast (terminal-style) ---------- */
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    const bar = { success: '#3fb950', error: '#f85149', info: '#39c5cf' }[type] || '#39c5cf';
    const n = document.createElement('div');
    n.className = `notification ${type}`;
    n.innerHTML = `<div style="display:flex;align-items:center;gap:12px;">
        <span style="color:${bar};">${type === 'error' ? '✗' : type === 'success' ? '✓' : '›'}</span>
        <span>${message}</span>
        <button aria-label="Close" style="background:none;border:none;color:#8b949e;font-size:1.1rem;cursor:pointer;line-height:1;">&times;</button>
    </div>`;
    n.style.cssText = `position:fixed;top:20px;right:20px;background:#11161f;color:#c9d1d9;
        padding:0.8rem 1.1rem;border-radius:8px;border:1px solid #1e2633;border-left:3px solid ${bar};
        box-shadow:0 12px 36px rgba(0,0,0,0.5);z-index:10000;max-width:360px;
        font-family:ui-monospace,monospace;font-size:0.84rem;
        transform:translateX(130%);transition:transform 0.35s cubic-bezier(0.2,0.8,0.2,1);`;
    document.body.appendChild(n);
    requestAnimationFrame(() => { n.style.transform = 'translateX(0)'; });
    const close = () => { n.style.transform = 'translateX(130%)'; setTimeout(() => n.remove(), 350); };
    n.querySelector('button').addEventListener('click', close);
    setTimeout(close, 5000);
}

/* ---------- Cursor follower (terminal block) ---------- */
document.addEventListener('DOMContentLoaded', () => {
    const follower = document.getElementById('cursorFollower');
    if (!follower || !window.matchMedia('(hover: hover)').matches) { if (follower) follower.style.display = 'none'; return; }
    let mx = 0, my = 0, fx = 0, fy = 0, shown = false;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; if (!shown) { follower.style.opacity = '1'; shown = true; } });
    document.addEventListener('mouseleave', () => { follower.style.opacity = '0'; shown = false; });
    (function loop() {
        fx += (mx - fx) * 0.25; fy += (my - fy) * 0.25;
        follower.style.left = fx + 'px'; follower.style.top = fy + 'px';
        requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', e => {
        follower.classList.toggle('hovering', !!e.target.closest('a,button,input,textarea,.btn,.nav-link,[role="button"]'));
    });
});
