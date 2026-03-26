// =============================================================
//  GWC @ AUGUSTA UNIVERSITY — main.js
//  All site JavaScript lives here. Pages reference this file
//  via <script src="main.js" defer></script>
//  Page-specific init functions are called via data-page on <body>
// =============================================================

// ─────────────────────────────────────────────────────────────
//  SHARED: Mobile nav accordion (Resources dropdown)
// ─────────────────────────────────────────────────────────────
function toggleMobileResources(btn) {
  const sub   = document.getElementById('mobileResourcesSub');
  const caret = btn.querySelector('.mobile-acc-caret');
  const open  = sub.classList.toggle('open');
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  caret.innerHTML = open ? '&#9660;' : '&#9658;';
}

// ─────────────────────────────────────────────────────────────
//  SHARED: Utility
// ─────────────────────────────────────────────────────────────
function escHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─────────────────────────────────────────────────────────────
//  EVENTS PAGE
// ─────────────────────────────────────────────────────────────
const TAG_STYLES = {
  'Workshop':    'background:var(--teal-1);color:var(--teal-3);',
  'Meeting':     'background:var(--blue-1);color:var(--blue-3);',
  'Competition': 'background:#fff3cd;color:#664d03;',
  'Hackathon':   'background:var(--teal-1);color:var(--teal-4);',
  'Social':      'background:#fce4ec;color:#c2185b;',
  'Collab':      'background:#e8f5e9;color:#2e7d32;',
};
const DATE_COLORS = {
  'Workshop':    'var(--teal-3)',
  'Meeting':     'var(--blue-3)',
  'Competition': 'var(--yellow-3)',
  'Hackathon':   'var(--teal-4)',
  'Social':      '#e91e63',
  'Collab':      '#2e7d32',
};

function parseDisplayDate(str) {
  if (!str || str === 'TBA') return ['TBA', '?'];
  const parts = str.trim().split(/[\s,]+/);
  if (parts.length >= 2) {
    return [parts[0].substring(0, 3).toUpperCase(), parts[1]];
  }
  return [str, ''];
}

function renderFeaturedEvent(fe) {
  const imgSrc  = fe.flyer_image || '';
  const imgHtml = imgSrc
    ? `<img src="${escHtml(imgSrc)}" alt="Event Flyer" style="max-width:100%;max-height:220px;border-radius:8px;object-fit:contain;">`
    : `<div style="background:rgba(0,0,0,0.08);border-radius:8px;height:160px;display:flex;align-items:center;justify-content:center;color:var(--black-3);font-size:0.78rem;">Flyer coming soon</div>`;

  const metaRows = [];
  if (fe.date_display) metaRows.push(`<span>📅 ${escHtml(fe.date_display)}</span>`);
  if (fe.time)         metaRows.push(`<span>⏰ ${escHtml(fe.time)}</span>`);
  if (fe.location)     metaRows.push(`<span>📍 ${escHtml(fe.location)}</span>`);
  if (fe.note)         metaRows.push(`<span style="color:var(--teal-3);font-weight:700;">✅ ${escHtml(fe.note)}</span>`);

  const el = document.getElementById('featuredEventBlock');
  if (!el) return;
  el.innerHTML = `
    <div style="background:var(--teal-1);border-radius:12px;padding:2rem;display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:center;">
      <div>
        <span style="background:var(--yellow-2);color:var(--blue-4);font-weight:700;font-family:var(--font-mono);font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 10px;border-radius:20px;">Featured</span>
        <h3 style="font-size:1.4rem;font-weight:900;color:var(--blue-4);margin:0.6rem 0 0.5rem;line-height:1.2;">
          ${escHtml(fe.title)}<br>
          ${fe.subtitle ? `<span style="color:var(--teal-3);">${escHtml(fe.subtitle)}</span>` : ''}
        </h3>
        <p style="color:var(--black-3);margin-bottom:1.1rem;line-height:1.6;font-size:0.9rem;">${escHtml(fe.description)}</p>
        <div style="font-family:var(--font-mono);font-size:0.78rem;color:var(--blue-4);display:flex;flex-direction:column;gap:0.35rem;margin-bottom:1.25rem;">
          ${metaRows.join('')}
        </div>
        <a href="community.html" class="btn btn-primary" style="font-size:0.8rem;">Join Our Discord for Updates</a>
      </div>
      <div style="text-align:center;">${imgHtml}</div>
    </div>`;
}

function renderEventCards(cards) {
  const grid = document.getElementById('eventCardsBlock');
  if (!grid) return;
  if (!cards || !cards.length) {
    grid.innerHTML = '<p style="color:var(--black-3);">No upcoming events scheduled. Check back soon!</p>';
    return;
  }
  grid.innerHTML = cards.map(card => {
    const tagStyle = TAG_STYLES[card.tag] || 'background:var(--teal-1);color:var(--teal-3);';
    const dateBg   = DATE_COLORS[card.tag] || 'var(--teal-3)';
    const [datePart, dayPart] = parseDisplayDate(card.date_display);
    const metaParts = [];
    if (card.time)     metaParts.push(`⏰ ${escHtml(card.time)}`);
    if (card.location) metaParts.push(`📍 ${escHtml(card.location)}`);
    return `
      <div class="event-card">
        <div class="event-date" style="background:${dateBg};">
          <span class="mo">${datePart}</span>
          <span class="dy" style="${dayPart.length > 2 ? 'font-size:1rem;' : ''}">${dayPart}</span>
        </div>
        <div class="event-info">
          <span class="event-tag" style="${tagStyle}">${escHtml(card.tag)}</span>
          <h3>${escHtml(card.title)}</h3>
          ${metaParts.length ? `<div class="event-meta">${metaParts.join(' &nbsp;·&nbsp; ')}</div>` : ''}
          <p>${escHtml(card.description)}</p>
        </div>
      </div>`;
  }).join('');
}

async function initEventsPage() {
  const el = document.getElementById('monthlyFlyerBlock');
  if (!el) return;
  try {
    const res  = await fetch('content.json?v=' + Date.now());
    if (!res.ok) throw new Error();
    const data = await res.json();
    const fe   = data.featured_event || {};
    if (fe.flyer_image) {
      el.innerHTML = `
        <div class="flyer-card">
          <img src="${escHtml(fe.flyer_image)}" alt="Monthly Events Flyer" class="flyer-expandable" title="Click to expand">
        </div>`;
      const flyerImg = el.querySelector('.flyer-expandable');
      if (flyerImg) {
        flyerImg.addEventListener('click', () => {
          const ov = document.createElement('div');
          ov.id = 'flyerOverlay';
          ov.innerHTML = `<img src="${escHtml(fe.flyer_image)}" alt="Monthly Events Flyer"><button id="flyerOverlayClose">✕</button>`;
          ov.addEventListener('click', e => { if (e.target === ov) { ov.remove(); document.body.style.overflow = ''; } });
          document.body.appendChild(ov);
          document.body.style.overflow = 'hidden';
          document.getElementById('flyerOverlayClose').addEventListener('click', () => { ov.remove(); document.body.style.overflow = ''; });
        });
      }
    } else {
      el.innerHTML = `<div style="background:var(--teal-1);border-radius:10px;padding:2rem;color:var(--black-3);font-size:0.875rem;">Flyer coming soon — check our Discord for the latest!</div>`;
    }
  } catch {
    el.innerHTML = `<div style="background:var(--teal-1);border-radius:10px;padding:2rem;color:var(--black-3);font-size:0.875rem;">Flyer coming soon — check our Discord for the latest!</div>`;
  }
}

// ─────────────────────────────────────────────────────────────
//  GALLERY PAGE — filterable masonry wall
// ─────────────────────────────────────────────────────────────
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

async function initGalleryPage() {
  const wall     = document.getElementById('galleryWall');
  const lightbox = document.getElementById('lightbox');
  if (!wall) return;

  const lbImg    = document.getElementById('lightboxImg');
  const lbPh     = document.getElementById('lbPlaceholder');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn  = document.getElementById('lightboxPrev');
  const nextBtn  = document.getElementById('lightboxNext');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  // lbVisible = photos currently shown (respects active filter)
  let allPhotos = [], lbVisible = [], lbIndex = 0;

  function showLb() {
    const photo = lbVisible[lbIndex];
    lbImg.src = photo.src;
    lbImg.alt = '';
    lbImg.style.display = 'block';
    lbPh.style.display  = 'none';
    lbImg.onerror = () => {
      lbImg.style.display = 'none';
      lbPh.style.background = 'var(--teal-1)';
      lbPh.textContent = '📷';
      lbPh.style.display = 'flex';
    };
    document.getElementById('lightboxTag').textContent   = '';
    document.getElementById('lightboxTitle').textContent = '';
    document.getElementById('lightboxDate').textContent  = '';
    document.getElementById('lightboxDesc').textContent  = `${lbIndex + 1} / ${lbVisible.length}`;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { lbIndex = (lbIndex - 1 + lbVisible.length) % lbVisible.length; showLb(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { lbIndex = (lbIndex + 1) % lbVisible.length; showLb(); });
  document.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  prevBtn && prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn && nextBtn.click();
  });

  try {
    const res  = await fetch('content.json?v=' + Date.now());
    if (!res.ok) throw new Error();
    const data = await res.json();
    allPhotos  = data.gallery_photos || [];

    if (!allPhotos.length) {
      wall.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--black-3);">No photos yet — check back soon!</div>';
      return;
    }

    // Build wall items
    wall.innerHTML = '';
    allPhotos.forEach((photo) => {
      const item = document.createElement('div');
      item.className = 'gallery-wall-item';
      item.dataset.category = photo.category || 'other';
      item.innerHTML = `<img src="${escHtml(photo.src)}" alt="" loading="lazy">`;
      item.addEventListener('click', () => {
        lbVisible = allPhotos.filter((_, j) =>
          !wall.children[j].classList.contains('gw-hidden')
        );
        lbIndex = lbVisible.indexOf(photo);
        showLb();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
      wall.appendChild(item);
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.gallery-wall-item').forEach(item => {
          const matches = filter === 'all' || item.dataset.category === filter;
          if (matches) {
            item.classList.remove('gw-hidden');
          } else {
            item.classList.add('gw-hidden');
          }
        });
      });
    });

  } catch {
    wall.innerHTML = `
      <div style="background:var(--teal-1);border-radius:10px;padding:2rem;text-align:center;">
        <div style="font-size:2rem;margin-bottom:0.5rem;">📷</div>
        <p style="color:var(--blue-4);font-weight:700;">Gallery coming soon!</p>
        <p style="color:var(--black-3);font-size:0.83rem;margin-top:0.25rem;">Photos will appear here once the site is published on GitHub Pages.</p>
      </div>`;
  }
}

// ─────────────────────────────────────────────────────────────
//  JOIN PAGE — Interest form → Google Sheets via Apps Script
//  After deploying your Apps Script, paste the Web App URL below
// ─────────────────────────────────────────────────────────────

// ↓↓↓ PASTE YOUR INTEREST FORM WEB APP URL HERE ↓↓↓
const INTEREST_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyKUb_adzeaC1Ysx2f2UJdoEAiGU4s6Q1ZQALbuS_Xhmvgy-HG7CZDgunUVYu4DpQM7Iw/exec';
// ↑↑↑ Example: 'https://script.google.com/macros/s/ABC123.../exec'

function resetInterestForm() {
  ['firstName','lastName','email','major','classification','discord','interest','heardFrom']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.querySelectorAll('.check-item input').forEach(c => c.checked = false);
  const form    = document.getElementById('interestForm');
  const success = document.getElementById('formSuccess');
  if (form)    form.style.display = 'block';
  if (success) success.classList.remove('show');
}

function initJoinPage() {
  const submitBtn = document.getElementById('submitBtn');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', async () => {
    const firstName      = document.getElementById('firstName').value.trim();
    const lastName       = document.getElementById('lastName').value.trim();
    const email          = document.getElementById('email').value.trim();
    const major          = document.getElementById('major').value;
    const classification = document.getElementById('classification').value;
    const discord        = document.getElementById('discord').value.trim();
    const interest       = document.getElementById('interest').value.trim();
    const heardFrom      = document.getElementById('heardFrom').value;
    const checked        = [...document.querySelectorAll('.check-item input:checked')].map(c => c.value).join('; ');

    if (!firstName || !lastName || !email || !major || !classification || !interest) {
      alert('Please fill in all required fields (marked with *).'); return;
    }
    if (!email.includes('@')) { alert('Please enter a valid email address.'); return; }

    if (!INTEREST_SHEET_URL) {
      alert('Form setup not complete — the Google Sheet URL has not been configured yet. Please check back soon!');
      return;
    }

    // Disable button while submitting
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    try {
      await fetch(INTEREST_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',  // required for Apps Script web apps
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName, lastName, email, major, classification,
          discord:   discord   || '—',
          interests: checked   || '—',
          heardFrom: heardFrom || '—',
          statement: interest
        })
      });
      // no-cors means we can't read the response — assume success if no exception thrown
      const form    = document.getElementById('interestForm');
      const success = document.getElementById('formSuccess');
      if (form)    form.style.display = 'none';
      if (success) success.classList.add('show');
    } catch (err) {
      alert('Something went wrong submitting your form. Please try again or contact us on Discord.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Interest Form ✓';
    }
  });
}

// ─────────────────────────────────────────────────────────────
//  SUGGESTION PAGE — Suggestion form → Google Sheets via Apps Script
//  After deploying your Apps Script, paste the Web App URL below
// ─────────────────────────────────────────────────────────────

// ↓↓↓ PASTE YOUR SUGGESTION FORM WEB APP URL HERE ↓↓↓
const SUGGESTION_SHEET_URL = 'https://script.google.com/macros/s/AKfycby6LT5fbN_5i0C43iI8OHf1MmgBZdx2al8QMGU98hTCqol8ZQlcC6lQrgkkh9WIi3W16g/exec';
// ↑↑↑ Example: 'https://script.google.com/macros/s/XYZ789.../exec'

function resetSugForm() {
  ['sugCategory','sugName','sugLink','sugWhy'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const wrap    = document.getElementById('suggestionFormWrap');
  const success = document.getElementById('sugFormSuccess');
  if (wrap)    wrap.style.display = 'block';
  if (success) success.classList.remove('show');
}

function initSuggestionPage() {
  const submitBtn = document.getElementById('sugSubmitBtn');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', async () => {
    const cat  = document.getElementById('sugCategory').value;
    const name = document.getElementById('sugName').value.trim();
    const link = document.getElementById('sugLink').value.trim();
    const why  = document.getElementById('sugWhy').value.trim();

    if (!cat || !name || !why) {
      alert('Please fill in the required fields (Category, Name, and Why).'); return;
    }

    if (!SUGGESTION_SHEET_URL) {
      alert('Form setup not complete — the Google Sheet URL has not been configured yet. Please check back soon!');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    try {
      await fetch(SUGGESTION_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: cat, name, link: link || '—', why })
      });
      const wrap    = document.getElementById('suggestionFormWrap');
      const success = document.getElementById('sugFormSuccess');
      if (wrap)    wrap.style.display = 'none';
      if (success) success.classList.add('show');
    } catch (err) {
      alert('Something went wrong. Please try again or contact us on Discord.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Suggestion ✓';
    }
  });
}

// ─────────────────────────────────────────────────────────────
//  HOME PAGE — monthly flyer
// ─────────────────────────────────────────────────────────────
async function initHomePage() {
  const el = document.getElementById('homeFlyerBlock');
  if (!el) return;
  try {
    const res  = await fetch('content.json?v=' + Date.now());
    if (!res.ok) throw new Error();
    const data = await res.json();
    const fe   = data.featured_event || {};
    if (fe.flyer_image) {
      el.innerHTML = `
        <div class="flyer-card">
          <img src="${escHtml(fe.flyer_image)}" alt="Monthly Events Flyer" class="flyer-expandable" title="Click to expand">
        </div>`;
      const flyerImg = el.querySelector('.flyer-expandable');
      if (flyerImg) {
        flyerImg.addEventListener('click', () => {
          const ov = document.createElement('div');
          ov.id = 'flyerOverlay';
          ov.innerHTML = `<img src="${escHtml(fe.flyer_image)}" alt="Monthly Events Flyer"><button id="flyerOverlayClose">✕</button>`;
          ov.addEventListener('click', e => { if (e.target === ov) { ov.remove(); document.body.style.overflow = ''; } });
          document.body.appendChild(ov);
          document.body.style.overflow = 'hidden';
          document.getElementById('flyerOverlayClose').addEventListener('click', () => { ov.remove(); document.body.style.overflow = ''; });
        });
      }
    } else {
      el.innerHTML = `<p style="color:var(--black-3);font-size:0.875rem;">Flyer coming soon — check our <a href="https://discord.gg/9CEqm6gjn7" style="color:var(--teal-3);font-weight:700;">Discord</a> for updates!</p>`;
    }
  } catch {
    el.innerHTML = `<p style="color:var(--black-3);font-size:0.875rem;">Flyer coming soon — check our <a href="https://discord.gg/9CEqm6gjn7" style="color:var(--teal-3);font-weight:700;">Discord</a> for updates!</p>`;
  }
}

// ─────────────────────────────────────────────────────────────
//  PAGE ROUTER — runs on DOMContentLoaded
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page === 'home')       initHomePage();
  if (page === 'events')     initEventsPage();
  if (page === 'gallery')    initGalleryPage();
  if (page === 'join')       initJoinPage();
  if (page === 'suggestion') initSuggestionPage();
});
