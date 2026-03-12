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
  // Load featured event + event cards from content.json
  try {
    const res  = await fetch('content.json?v=' + Date.now());
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data.featured_event) renderFeaturedEvent(data.featured_event);
    if (data.event_cards)    renderEventCards(data.event_cards);
  } catch {
    const fe = document.getElementById('featuredEventBlock');
    if (fe) fe.innerHTML = `
      <div style="background:var(--teal-1);border-radius:10px;padding:1.5rem;color:var(--black-3);font-size:0.875rem;">
        Featured event details coming soon. Check our Discord for the latest!
      </div>`;
    const ec = document.getElementById('eventCardsBlock');
    if (ec) ec.innerHTML = `
      <div class="event-card">
        <div class="event-date"><span class="mo">TBA</span><span class="dy" style="font-size:1rem;">Next</span></div>
        <div class="event-info">
          <span class="event-tag">Meeting</span>
          <h3>General Body Meeting</h3>
          <div class="event-meta">📍 University Hall</div>
          <p>Stay tuned for our next general body meeting!</p>
        </div>
      </div>`;
  }
}

// ─────────────────────────────────────────────────────────────
//  GALLERY PAGE
// ─────────────────────────────────────────────────────────────
const CATEGORY_EMOJI = {
  meeting:     { emoji: '🤝', bg: 'linear-gradient(135deg,#E5F8FF,#0169E1)' },
  workshop:    { emoji: '📄', bg: 'linear-gradient(135deg,#D7F9F4,#43D6B9)' },
  competition: { emoji: '🚩', bg: 'linear-gradient(135deg,#003046,#0D9C90)' },
  collab:      { emoji: '🤝', bg: 'linear-gradient(135deg,#fce4ec,#e91e63)' },
  fundraising: { emoji: '💛', bg: 'linear-gradient(135deg,#FDD946,#f09433)' },
  social:      { emoji: '🎉', bg: 'linear-gradient(135deg,#D7F9F4,#FDD946)' },
};
const TAG_LABELS = {
  meeting:'Meeting', workshop:'Workshop', competition:'Competition',
  collab:'Collab', fundraising:'Fundraising', social:'Social'
};

let galleryAllItems  = [];
let galleryVisible   = [];
let galleryIndex     = 0;
let galleryPhotoData = [];

function buildGalleryCard(photo, index) {
  const div      = document.createElement('div');
  div.className  = 'gallery-item';
  div.dataset.category = photo.category || 'social';
  div.dataset.index    = index;
  const fallback  = CATEGORY_EMOJI[photo.category] || { emoji:'📷', bg:'var(--teal-1)' };
  const tagLabel  = TAG_LABELS[photo.category] || photo.category;

  if (photo.image) {
    div.innerHTML = `
      <img src="${escHtml(photo.image)}" alt="${escHtml(photo.title)}"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
      <div class="gallery-placeholder" style="background:${fallback.bg};display:none;">${fallback.emoji}</div>
      <div class="gallery-overlay">
        <span class="go-tag">${tagLabel}</span>
        <h3>${escHtml(photo.title)}</h3>
        <p>${escHtml(photo.caption || photo.date)}</p>
      </div>`;
  } else {
    div.innerHTML = `
      <div class="gallery-placeholder" style="background:${fallback.bg};">${fallback.emoji}</div>
      <div class="gallery-overlay">
        <span class="go-tag">${tagLabel}</span>
        <h3>${escHtml(photo.title)}</h3>
        <p>${escHtml(photo.caption || photo.date)}</p>
      </div>`;
  }

  div.addEventListener('click', () => {
    galleryVisible = galleryAllItems.filter(el => !el.classList.contains('hidden'));
    galleryIndex   = galleryVisible.indexOf(div);
    openLightbox(photo);
  });
  return div;
}

function openLightbox(photo) {
  const fallback = CATEGORY_EMOJI[photo.category] || { emoji:'📷', bg:'var(--teal-1)' };
  const lbImg    = document.getElementById('lightboxImg');
  const lbPh     = document.getElementById('lbPlaceholder');
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  if (photo.image) {
    lbImg.src   = photo.image;
    lbImg.alt   = photo.title;
    lbImg.style.display = 'block';
    lbPh.style.display  = 'none';
    lbImg.onerror = () => {
      lbImg.style.display   = 'none';
      lbPh.style.background = fallback.bg;
      lbPh.textContent      = fallback.emoji;
      lbPh.style.display    = 'flex';
    };
  } else {
    lbImg.style.display   = 'none';
    lbPh.style.background = fallback.bg;
    lbPh.textContent      = fallback.emoji;
    lbPh.style.display    = 'flex';
  }

  document.getElementById('lightboxTag').textContent   = (TAG_LABELS[photo.category] || photo.category).toUpperCase();
  document.getElementById('lightboxTitle').textContent = photo.title;
  document.getElementById('lightboxDate').textContent  = '📅 ' + photo.date;
  document.getElementById('lightboxDesc').textContent  = photo.description;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

async function initGalleryPage() {
  const grid    = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  if (!grid) return;

  // Lightbox controls
  const closeBtn = document.getElementById('lightboxClose');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox)  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  if (prevBtn) prevBtn.addEventListener('click', () => {
    if (!galleryVisible.length) return;
    galleryIndex = (galleryIndex - 1 + galleryVisible.length) % galleryVisible.length;
    openLightbox(galleryPhotoData[parseInt(galleryVisible[galleryIndex].dataset.index)]);
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    if (!galleryVisible.length) return;
    galleryIndex = (galleryIndex + 1) % galleryVisible.length;
    openLightbox(galleryPhotoData[parseInt(galleryVisible[galleryIndex].dataset.index)]);
  });

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
    galleryPhotoData = data.gallery || [];

    grid.innerHTML = '';
    if (!galleryPhotoData.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--black-3);">No photos yet — check back soon!</div>';
      return;
    }

    galleryPhotoData.forEach((photo, i) => {
      const card = buildGalleryCard(photo, i);
      grid.appendChild(card);
      galleryAllItems.push(card);
    });
    galleryVisible = [...galleryAllItems];

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        galleryAllItems.forEach(item => {
          item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
        });
        galleryVisible = galleryAllItems.filter(el => !el.classList.contains('hidden'));
      });
    });

  } catch {
    grid.innerHTML = `
      <div style="grid-column:1/-1;background:var(--teal-1);border-radius:10px;padding:2rem;text-align:center;">
        <div style="font-size:2rem;margin-bottom:0.5rem;">📷</div>
        <p style="color:var(--blue-4);font-weight:700;">Gallery coming soon!</p>
        <p style="color:var(--black-3);font-size:0.83rem;margin-top:0.25rem;">Photos will appear here once the site is published on GitHub Pages.</p>
      </div>`;
  }
}

// ─────────────────────────────────────────────────────────────
//  JOIN PAGE — Interest form + localStorage + CSV export
// ─────────────────────────────────────────────────────────────
const INTEREST_KEY = 'gwc_interest_submissions';

function getInterestSubmissions() {
  try { return JSON.parse(localStorage.getItem(INTEREST_KEY)) || []; }
  catch { return []; }
}

function saveInterestSubmission(data) {
  const all = getInterestSubmissions();
  all.push(data);
  localStorage.setItem(INTEREST_KEY, JSON.stringify(all));
}

function refreshAdminTable() {
  const data  = getInterestSubmissions();
  const tbody = document.getElementById('adminTableBody');
  const count = document.getElementById('adminCount');
  if (!tbody) return;
  if (count) count.textContent = `${data.length} submission${data.length !== 1 ? 's' : ''} stored in this browser.`;
  tbody.innerHTML = data.length === 0
    ? '<tr><td colspan="8" style="text-align:center;opacity:0.4;padding:1.5rem;">No submissions yet.</td></tr>'
    : data.map(r => `
        <tr>
          <td>${r.submitted}</td>
          <td>${r.firstName} ${r.lastName}</td>
          <td>${r.email}</td>
          <td>${r.major}</td>
          <td>${r.classification}</td>
          <td>${r.discord}</td>
          <td style="max-width:140px;white-space:normal;">${r.interests}</td>
          <td>${r.heardFrom}</td>
        </tr>`).join('');
}

function exportInterestCSV() {
  const data = getInterestSubmissions();
  if (!data.length) { alert('No submissions to export yet!'); return; }
  const headers = ['Submitted','First Name','Last Name','Email','Major','Classification','Discord','Interests','Heard From','Why Interested'];
  const rows = data.map(r => [
    r.submitted, r.firstName, r.lastName, r.email, r.major, r.classification,
    r.discord, r.interests, r.heardFrom, r.statement
  ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(','));
  downloadCSV([headers.join(','), ...rows].join('\n'), 'gwc_interest_forms.csv');
}

function clearInterestData() {
  if (confirm('Are you sure? This will delete ALL stored interest form submissions from this browser.')) {
    localStorage.removeItem(INTEREST_KEY);
    refreshAdminTable();
  }
}

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

  submitBtn.addEventListener('click', () => {
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

    saveInterestSubmission({
      submitted: new Date().toLocaleString(),
      firstName, lastName, email, major, classification,
      discord: discord || '—', interests: checked || '—',
      heardFrom: heardFrom || '—', statement: interest
    });

    const form    = document.getElementById('interestForm');
    const success = document.getElementById('formSuccess');
    if (form)    form.style.display = 'none';
    if (success) success.classList.add('show');
    refreshAdminTable();
  });

  const adminDetails = document.getElementById('adminDetails');
  if (adminDetails) adminDetails.addEventListener('toggle', function() {
    if (this.open) refreshAdminTable();
  });
}

// ─────────────────────────────────────────────────────────────
//  SUGGESTION PAGE
// ─────────────────────────────────────────────────────────────
const SUG_KEY = 'gwc_suggestions';

function getSuggestions() {
  try { return JSON.parse(localStorage.getItem(SUG_KEY)) || []; } catch { return []; }
}

function refreshSugTable() {
  const data  = getSuggestions();
  const count = document.getElementById('sugAdminCount');
  const tbody = document.getElementById('sugAdminTableBody');
  if (!tbody) return;
  if (count) count.textContent = `${data.length} suggestion${data.length !== 1 ? 's' : ''} stored in this browser.`;
  tbody.innerHTML = data.length === 0
    ? '<tr><td colspan="5" style="text-align:center;opacity:.4;padding:1.25rem;">No suggestions yet.</td></tr>'
    : data.map(r => `<tr>
        <td>${r.submitted}</td><td>${r.category}</td>
        <td>${r.name}</td>
        <td style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.link !== '—' ? `<a href="${r.link}" target="_blank" style="color:var(--teal-2)">${r.link}</a>` : '—'}</td>
        <td style="max-width:200px;white-space:normal;">${r.why}</td>
      </tr>`).join('');
}

function resetSugForm() {
  ['sugCategory','sugName','sugLink','sugWhy'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const wrap    = document.getElementById('suggestionFormWrap');
  const success = document.getElementById('sugFormSuccess');
  if (wrap)    wrap.style.display = 'block';
  if (success) success.classList.remove('show');
}

function exportSugCSV() {
  const data = getSuggestions();
  if (!data.length) { alert('No suggestions to export yet!'); return; }
  const headers = ['Submitted','Category','Resource / Topic','Link','Why Add It?'];
  const rows = data.map(r => [r.submitted, r.category, r.name, r.link, r.why]
    .map(v => `"${String(v).replace(/"/g,'""')}"`).join(','));
  downloadCSV([headers.join(','), ...rows].join('\n'), 'gwc_suggestions.csv');
}

function clearSugData() {
  if (confirm('Delete ALL stored suggestions from this browser?')) {
    localStorage.removeItem(SUG_KEY); refreshSugTable();
  }
}

function initSuggestionPage() {
  const submitBtn = document.getElementById('sugSubmitBtn');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', () => {
    const cat  = document.getElementById('sugCategory').value;
    const name = document.getElementById('sugName').value.trim();
    const link = document.getElementById('sugLink').value.trim();
    const why  = document.getElementById('sugWhy').value.trim();
    if (!cat || !name || !why) {
      alert('Please fill in the required fields (Category, Name, and Why).'); return;
    }
    const entry = { submitted: new Date().toLocaleString(), category: cat, name, link: link || '—', why };
    const all = getSuggestions(); all.push(entry);
    localStorage.setItem(SUG_KEY, JSON.stringify(all));
    const wrap    = document.getElementById('suggestionFormWrap');
    const success = document.getElementById('sugFormSuccess');
    if (wrap)    wrap.style.display = 'none';
    if (success) success.classList.add('show');
    refreshSugTable();
  });

  const adminDetails = document.getElementById('sugAdminDetails');
  if (adminDetails) adminDetails.addEventListener('toggle', function() {
    if (this.open) refreshSugTable();
  });
}

// ─────────────────────────────────────────────────────────────
//  SHARED: CSV download helper
// ─────────────────────────────────────────────────────────────
function downloadCSV(csvString, filename) {
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────
//  PAGE ROUTER — runs on DOMContentLoaded
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;
  if (page === 'events')     initEventsPage();
  if (page === 'gallery')    initGalleryPage();
  if (page === 'join')       initJoinPage();
  if (page === 'suggestion') initSuggestionPage();
});
