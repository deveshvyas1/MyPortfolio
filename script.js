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

/* ---------- Terminal boot sequence on hero ---------- */
function typeInto(element, text, speed, done) {
    let i = 0;
    element.textContent = '';
    element.classList.add('boot-caret');
    (function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i++);
            setTimeout(type, speed);
        } else {
            element.classList.remove('boot-caret');
            if (done) done();
        }
    })();
}

document.addEventListener('DOMContentLoaded', () => {
    const subtitle = document.querySelector('.hero-text h2');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!subtitle) return;

    if (reduce) return; // leave static content as-is

    const roleText = subtitle.textContent;
    // Type the role line like a terminal response, with a caret while typing.
    setTimeout(() => typeInto(subtitle, roleText, 45), 600);
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

/* ---------- Scroll progress bar ---------- */
(function () {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    function update() {
        const h = document.documentElement;
        const scrolled = h.scrollTop;
        const max = h.scrollHeight - h.clientHeight;
        bar.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();

/* ---------- Animated stat counters ---------- */
(function () {
    const metrics = document.querySelectorAll('.stat-metric');
    if (!metrics.length) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function run(metric) {
        const target = parseInt(metric.dataset.count, 10) || 0;
        const suffix = metric.dataset.suffix || '';
        const valueEl = metric.querySelector('.stat-value');
        if (reduce) { valueEl.textContent = target + suffix; return; }
        const duration = 1300;
        const start = performance.now();
        (function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            valueEl.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
        })(start);
    }

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.4 });
    metrics.forEach(m => obs.observe(m));
})();

/* ---------- Interactive mini-terminal ---------- */
(function () {
    const launch = document.getElementById('termLaunch');
    const overlay = document.getElementById('termOverlay');
    const closeBtn = document.getElementById('termClose');
    const body = document.getElementById('termBody');
    const input = document.getElementById('termInput');
    if (!launch || !overlay || !body || !input) return;

    const history = [];
    let histIdx = -1;

    const COMMANDS = {
        help() {
            return `<span class="ok">Available commands:</span>
  <b>about</b>      — who I am
  <b>skills</b>     — tech stack &amp; tools
  <b>projects</b>   — my QA + dev projects
  <b>experience</b> — background summary
  <b>contact</b>    — how to reach me
  <b>resume</b>     — view / download CV
  <b>social</b>     — github / linkedin / whatsapp
  <b>goto</b> &lt;section&gt; — scroll to a section (e.g. goto projects)
  <b>theme</b>      — toggle light / dark
  <b>clear</b>      — clear the screen`;
        },
        about() {
            return `Devesh Vyas — QA Automation Engineer (India).
BCA grad (2022), pursuing MCA. Focused on reliable test coverage,
early defect detection, and structured QA workflows across web + mobile.`;
        },
        skills() {
            return `<span class="ok">QA Automation:</span> Playwright · TypeScript · Regression · Smoke · Reporting
<span class="ok">Process &amp; Tools:</span> Test Case Design · Bug Reporting · Jira · Postman · Agile
<span class="ok">Technical:</span> HTML · CSS · JavaScript · Git · GitHub`;
        },
        projects() {
            return `1. Manual QA — UPI &amp; Web App Validation  <span class="ok">[✓ passing]</span>
2. Educase iOS QA Suite — pre-login coverage  <span class="ok">[✓ passing]</span>
3. Playwright + TypeScript automation (120+ cases)  <span class="ok">[✓ passing]</span>
Type <b>goto projects</b> to jump to them.`;
        },
        experience() {
            return `• 120+ structured test cases across web &amp; mobile
• Detailed defect reports: repro steps, severity/priority mapping
• Agile-style collaboration, requirements → test scenarios
• Automation suites that cut repetitive manual effort`;
        },
        contact() {
            return `email:    <a href="mailto:medeveshvyas@gmail.com">medeveshvyas@gmail.com</a>
location: India
status:   <span class="warn">open to QA roles (manual + automation)</span>
Type <b>goto contact</b> to open the contact form.`;
        },
        resume() {
            window.open('https://drive.google.com/file/d/1kzZr87ZSrr76uaSzPAU_iGTV8lEEcxxh/view?usp=sharing', '_blank');
            return 'Opening resume in a new tab…';
        },
        social() {
            return `github:   <a href="https://github.com/deveshvyas1" target="_blank">github.com/deveshvyas1</a>
linkedin: <a href="https://www.linkedin.com/in/devesh-vyas-52a511328/" target="_blank">linkedin.com/in/devesh-vyas</a>
whatsapp: <a href="https://wa.me/918112246291" target="_blank">+91 81122 46291</a>`;
        },
        theme() {
            const next = htmlEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            htmlEl.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            if (typeof updateToggleIcon === 'function') updateToggleIcon();
            return `theme switched to <span class="ok">${next}</span>`;
        },
        goto(arg) {
            const map = {
                home: '#home', about: '#about', skills: '#skills',
                projects: '#qa-projects', 'qa-projects': '#qa-projects',
                other: '#projects', resume: '#resume', contact: '#contact', stats: '#stats'
            };
            const sel = map[(arg || '').toLowerCase()];
            if (!sel) return `<span class="term-err">goto: unknown section '${arg || ''}'. Try: about, skills, projects, resume, contact</span>`;
            const target = document.querySelector(sel);
            if (target) { setTimeout(() => { close(); target.scrollIntoView({ behavior: 'smooth' }); }, 400); return `navigating to ${arg}…`; }
            return `<span class="term-err">section not found</span>`;
        },
        clear() { body.innerHTML = ''; return null; },
        whoami() { return 'devesh — QA Automation Engineer'; },
        ls() { return 'about  skills  projects  experience  resume  contact  social'; }
    };

    function print(html, cls) {
        const line = document.createElement('div');
        line.className = 'term-line ' + (cls || 'term-out');
        line.innerHTML = html;
        body.appendChild(line);
        body.scrollTop = body.scrollHeight;
    }

    function exec(raw) {
        const cmd = raw.trim();
        print(`<span class="tp">visitor@devesh:~$</span> ${cmd.replace(/</g, '&lt;')}`, 'term-cmd');
        if (!cmd) return;
        history.unshift(cmd); histIdx = -1;
        const [name, ...rest] = cmd.split(/\s+/);
        const fn = COMMANDS[name.toLowerCase()];
        if (!fn) { print(`<span class="term-err">command not found: ${name.replace(/</g, '&lt;')}. Type 'help'.</span>`, 'term-err'); return; }
        const out = fn(rest.join(' '));
        if (out !== null && out !== undefined) print(out);
    }

    function open() {
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        setTimeout(() => input.focus(), 60);
    }
    function close() {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
    }

    launch.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') { exec(input.value); input.value = ''; }
        else if (e.key === 'ArrowUp') { if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx]; } e.preventDefault(); }
        else if (e.key === 'ArrowDown') { if (histIdx > 0) { histIdx--; input.value = history[histIdx]; } else { histIdx = -1; input.value = ''; } e.preventDefault(); }
    });
})();
