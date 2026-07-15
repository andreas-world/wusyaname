/* ── Ambil konten dari server & isi ke landing page ──
   Ini bagian yang bikin landing page "dinamis": semua teks
   yang bisa diedit admin, sekarang diambil dari /api/content
   (yang isinya dibaca dari data/content.json di server),
   bukan lagi ditulis manual di index.html. */
async function loadContent() {
  try {
    const res = await fetch('/api/content');
    const data = await res.json();

    // Hero
    setText('heroEyebrow', data.hero.eyebrow);
    setText('heroTitleLine1', data.hero.titleLine1);
    setText('heroTitleLine2', data.hero.titleLine2);
    setText('heroDesc', data.hero.desc);

    const statEls = document.querySelectorAll('#heroStats .stat-item');
    data.hero.stats.forEach((stat, i) => {
      if (!statEls[i]) return;
      statEls[i].querySelector('[data-stat="num"]').textContent = stat.num;
      statEls[i].querySelector('[data-stat="label"]').textContent = stat.label;
    });

    // About
    setText('aboutDesc', data.about.desc);

    // Testimoni (digandakan sekali biar carousel tetap terasa looping)
    const track = document.getElementById('testiTrack');
    if (track) {
      const cardsHtml = data.testimonials.map(renderTestiCard).join('');
      track.innerHTML = cardsHtml + cardsHtml;
    }

    // FAQ
    const faqGrid = document.getElementById('faqGrid');
    if (faqGrid) {
      faqGrid.innerHTML = data.faq.map(renderFaqItem).join('');
    }
  } catch (err) {
    console.error('Gagal memuat konten dari server:', err);
  }
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderTestiCard(t) {
  return `
    <div class="testi-card">
      <div class="testi-stars">★★★★★</div>
      <p class="testi-text">"${t.text}"</p>
      <div class="testi-user">
        <div class="testi-av av-1">${t.initials}</div>
        <div><div class="testi-name">${t.name}</div><div class="testi-role">${t.role}</div></div>
      </div>
    </div>`;
}

function renderFaqItem(f, i) {
  return `
    <div class="faq-item${i === 0 ? ' open' : ''}">
      <div class="faq-q" onclick="toggleFaq(this)">
        <span>${f.question}</span>
        <i class="fa-solid fa-chevron-down faq-chevron"></i>
      </div>
      <div class="faq-a">${f.answer}</div>
    </div>`;
}

loadContent();

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Burger ── */
const burgerBtn  = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;
function closeMenu() { menuOpen = false; mobileMenu.classList.remove('open'); }
burgerBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
});

/* ── Intersection Observer (fade-up) ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* ── FAQ accordion ── */
function toggleFaq(el) {
  const item = el.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ── Staggered fade-up for child lists ── */
document.querySelectorAll('.features-grid .feat-card, .steps-wrap .step-card').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.08) + 's';
});