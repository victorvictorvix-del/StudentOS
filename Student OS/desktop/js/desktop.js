/* Student OS — shell desktop/tablette (sidebar + topbar + paramètres).
   Les vues, la nav et le chat IA sont partagés via shared/js/views.js. */

function positionPill(activeEl) {
  const pill = document.getElementById('navPill');
  pill.style.height = activeEl.offsetHeight + 'px';
  pill.style.top = activeEl.offsetTop + 'px';
}

function setActiveView(view) {
  state.view = view;
  document.querySelectorAll('.nav-item').forEach((el) => {
    const active = el.dataset.view === view;
    el.classList.toggle('active', active);
    if (active) positionPill(el);
  });

  const root = document.getElementById('viewRoot');
  const html = RENDERERS[view]();
  const update = () => {
    root.innerHTML = html;
    animateIn(root);
    if (view === 'ai') { if ((state.aiMode || 'assistant') === 'assistant') wireChat(); else wireGroups(); }
    if (view === 'documents') wireDropzone();
    if (view === 'pricing') wirePricing();
    if (view === 'notes' && state.notesTab === 'mindmap') wireMindmap();
  };
  if (document.startViewTransition) {
    document.startViewTransition(update);
  } else {
    root.style.opacity = '0';
    setTimeout(() => { update(); root.style.opacity = '1'; }, 120);
  }
}

function buildSidebar() {
  const nav = document.getElementById('sidebarNav');
  nav.querySelectorAll('.nav-item').forEach((el) => el.remove());
  NAV_ITEMS.forEach((item) => {
    const btn = document.createElement('button');
    btn.className = 'nav-item';
    btn.dataset.view = item.id;
    btn.innerHTML = `${navIconTile(item)}<span>${t(item.labelKey)}</span>`;
    btn.addEventListener('click', () => setActiveView(item.id));
    nav.appendChild(btn);
  });
  const active = nav.querySelector(`.nav-item[data-view="${state.view}"]`);
  if (active) { active.classList.add('active'); positionPill(active); }
}

function rebuildNav() { buildSidebar(); }

function wireSearch() {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const container = document.getElementById('topbarSearch');

  const matchesFor = (q) => NAV_ITEMS.filter((item) => t(item.labelKey).toLowerCase().includes(q));

  const render = (matches) => {
    results.innerHTML = matches.map((item) => `<button type="button" class="search-result" data-view="${item.id}">${navIconTile(item)}<span>${t(item.labelKey)}</span></button>`).join('');
    results.querySelectorAll('.search-result').forEach((btn) => {
      btn.addEventListener('click', () => {
        setActiveView(btn.dataset.view);
        input.value = '';
        results.classList.remove('open');
      });
    });
  };

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.classList.remove('open'); return; }
    const matches = matchesFor(q);
    render(matches);
    results.classList.toggle('open', matches.length > 0);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const match = matchesFor(input.value.trim().toLowerCase())[0];
      if (match) { setActiveView(match.id); input.value = ''; results.classList.remove('open'); }
    }
    if (e.key === 'Escape') { input.value = ''; results.classList.remove('open'); input.blur(); }
  });
  document.addEventListener('click', (e) => { if (!container.contains(e.target)) results.classList.remove('open'); });
}

function openSettings() { document.getElementById('settingsBackdrop').classList.add('open'); }
function closeSettings() { document.getElementById('settingsBackdrop').classList.remove('open'); }

function init() {
  applyThemeAndFont();
  applyProfilePersonalization();
  loadPersistedNotes();
  loadPersistedMindmap();
  loadPersistedGroups();
  buildSidebar();
  document.getElementById('sidebarAvatar').textContent = STUDENT_OS_DATA.user.initials;
  document.getElementById('sidebarName').textContent = STUDENT_OS_DATA.user.name;
  document.getElementById('sidebarSchool').textContent = STUDENT_OS_DATA.user.school;
  document.getElementById('settingsAvatar').textContent = STUDENT_OS_DATA.user.initials;
  document.getElementById('settingsName').textContent = STUDENT_OS_DATA.user.name;
  document.getElementById('settingsSchool').textContent = STUDENT_OS_DATA.user.school;

  document.getElementById('searchIcon').innerHTML = svgIcon('search');
  document.getElementById('bellIcon').innerHTML = svgIcon('bell');
  document.getElementById('settingsIcon').innerHTML = svgIcon('settings');
  document.getElementById('closeSettings').innerHTML = svgIcon('close');

  document.getElementById('userMenuBtn').addEventListener('click', openSettings);
  document.getElementById('settingsBtn').addEventListener('click', openSettings);
  document.getElementById('closeSettings').addEventListener('click', closeSettings);
  document.getElementById('settingsBackdrop').addEventListener('click', (e) => { if (e.target.id === 'settingsBackdrop') closeSettings(); });
  document.getElementById('goConnections').addEventListener('click', () => { closeSettings(); setActiveView('connections'); });
  document.getElementById('logoutBtn').addEventListener('click', () => { window.location.href = 'index.html'; });

  wireSettingsPreferences();
  wireSearch();
  applyI18n(document);
  setActiveView('home');
  window.addEventListener('resize', () => { const el = document.querySelector('.nav-item.active'); if (el) positionPill(el); });
}

document.addEventListener('DOMContentLoaded', init);
