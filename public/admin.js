let currentData = null;

/* ══ INIT ══ */
(async function init() {
  const sessionRes = await fetch('/api/session').then(r => r.json());
  if (sessionRes.loggedIn) {
    showDashboard();
  } else {
    showLogin();
  }
})();

function showLogin() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('dashboard').style.display = 'none';
}

async function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  currentData = await fetch('/api/content').then(r => r.json());
  renderForm(currentData);
}

/* ══ LOGIN / LOGOUT ══ */
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errEl = document.getElementById('loginError');
  errEl.textContent = '';

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.ok) {
    showDashboard();
  } else {
    errEl.textContent = data.error || 'Login gagal';
  }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' });
  showLogin();
});

/* ══ RENDER FORM DARI DATA ══ */
function renderForm(data) {
  document.getElementById('f-hero-eyebrow').value = data.hero.eyebrow;
  document.getElementById('f-hero-title1').value = data.hero.titleLine1;
  document.getElementById('f-hero-title2').value = data.hero.titleLine2;
  document.getElementById('f-hero-desc').value = data.hero.desc;
  document.getElementById('f-about-desc').value = data.about.desc;

  const statsWrap = document.getElementById('statsFields');
  statsWrap.innerHTML = data.hero.stats.map((s, i) => `
    <div class="stat-field">
      <label>Angka #${i + 1}</label>
      <input type="text" data-stat-num="${i}" value="${escapeAttr(s.num)}" placeholder="cth: 50K+" />
      <input type="text" data-stat-label="${i}" value="${escapeAttr(s.label)}" placeholder="cth: Pengguna Aktif" />
    </div>`).join('');

  renderTestiFields(data.testimonials);
  renderFaqFields(data.faq);
}

function renderTestiFields(list) {
  const wrap = document.getElementById('testiFields');
  wrap.innerHTML = list.map((t, i) => `
    <div class="entry-card" data-testi-index="${i}">
      <div class="entry-head">
        <button class="btn-remove" onclick="removeTestimonial(${i})"><i class="fa-solid fa-trash"></i> Hapus</button>
      </div>
      <div class="entry-row">
        <div class="field"><label>Nama</label><input type="text" data-t-name value="${escapeAttr(t.name)}" /></div>
        <div class="field"><label>Peran / Kota</label><input type="text" data-t-role value="${escapeAttr(t.role)}" /></div>
      </div>
      <div class="entry-row">
        <div class="field"><label>Inisial (2 huruf)</label><input type="text" data-t-initials maxlength="2" value="${escapeAttr(t.initials)}" /></div>
      </div>
      <div class="field"><label>Isi testimoni</label><textarea data-t-text rows="2">${escapeHtml(t.text)}</textarea></div>
    </div>`).join('');
}

function renderFaqFields(list) {
  const wrap = document.getElementById('faqFields');
  wrap.innerHTML = list.map((f, i) => `
    <div class="entry-card" data-faq-index="${i}">
      <div class="entry-head">
        <button class="btn-remove" onclick="removeFaq(${i})"><i class="fa-solid fa-trash"></i> Hapus</button>
      </div>
      <div class="field"><label>Pertanyaan</label><input type="text" data-f-q value="${escapeAttr(f.question)}" /></div>
      <div class="field"><label>Jawaban</label><textarea data-f-a rows="2">${escapeHtml(f.answer)}</textarea></div>
    </div>`).join('');
}

/* ══ TAMBAH / HAPUS ENTRI ══ */
function addTestimonial() {
  collectFormIntoCurrentData();
  currentData.testimonials.push({ name: '', role: '', initials: '', text: '' });
  renderTestiFields(currentData.testimonials);
}
function removeTestimonial(i) {
  collectFormIntoCurrentData();
  currentData.testimonials.splice(i, 1);
  renderTestiFields(currentData.testimonials);
}
function addFaq() {
  collectFormIntoCurrentData();
  currentData.faq.push({ question: '', answer: '' });
  renderFaqFields(currentData.faq);
}
function removeFaq(i) {
  collectFormIntoCurrentData();
  currentData.faq.splice(i, 1);
  renderFaqFields(currentData.faq);
}

/* ══ AMBIL ISI FORM KE currentData ══ */
function collectFormIntoCurrentData() {
  currentData.hero.eyebrow = document.getElementById('f-hero-eyebrow').value;
  currentData.hero.titleLine1 = document.getElementById('f-hero-title1').value;
  currentData.hero.titleLine2 = document.getElementById('f-hero-title2').value;
  currentData.hero.desc = document.getElementById('f-hero-desc').value;
  currentData.about.desc = document.getElementById('f-about-desc').value;

  currentData.hero.stats.forEach((s, i) => {
    const numEl = document.querySelector(`[data-stat-num="${i}"]`);
    const labelEl = document.querySelector(`[data-stat-label="${i}"]`);
    if (numEl) s.num = numEl.value;
    if (labelEl) s.label = labelEl.value;
  });

  document.querySelectorAll('[data-testi-index]').forEach(card => {
    const i = Number(card.dataset.testiIndex);
    currentData.testimonials[i] = {
      name: card.querySelector('[data-t-name]').value,
      role: card.querySelector('[data-t-role]').value,
      initials: card.querySelector('[data-t-initials]').value,
      text: card.querySelector('[data-t-text]').value
    };
  });

  document.querySelectorAll('[data-faq-index]').forEach(card => {
    const i = Number(card.dataset.faqIndex);
    currentData.faq[i] = {
      question: card.querySelector('[data-f-q]').value,
      answer: card.querySelector('[data-f-a]').value
    };
  });
}

/* ══ SIMPAN KE SERVER ══ */
document.getElementById('saveBtn').addEventListener('click', async () => {
  collectFormIntoCurrentData();
  const res = await fetch('/api/content', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(currentData)
  });
  const banner = document.getElementById('saveBanner');
  if (res.ok) {
    banner.textContent = '✓ Perubahan tersimpan. Refresh landing page untuk melihat hasilnya.';
    banner.style.display = 'block';
  } else {
    banner.textContent = '✗ Gagal menyimpan. Coba login ulang.';
    banner.style.background = 'rgba(255,107,107,.12)';
    banner.style.color = '#ff9b9b';
    banner.style.display = 'block';
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => { banner.style.display = 'none'; }, 4000);
});

/* ══ Util escape sederhana biar aman disisipkan ke HTML ══ */
function escapeHtml(str) {
  return String(str || '').replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}
