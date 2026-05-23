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