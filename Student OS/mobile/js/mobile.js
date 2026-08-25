/* Student OS — shell téléphone (dock flottant 4 icônes + bouton central "+" + overlay + paramètres).
   Les vues, la nav et le chat IA sont partagés via shared/js/views.js. */

function positionDockIndicator(activeEl) {
  const indicator = document.getElementById('dockIndicator');
  if (!activeEl) { indicator.style.opacity = '0'; return; }
  const dock = document.getElementById('dock');
  const dockRect = dock.getBoundingClientRect();
  const btnRect = activeEl.getBoundingClientRect();
  indicator.style.left = (btnRect.left - dockRect.left + btnRect.width / 2 - 20) + 'px';
  indicator.style.opacity = '1';
}

function setActiveView(view) {
  state.view = view;
  let activeBtn = null;
  document.querySelectorAll('.bnav-item').forEach((el) => {
    const active = el.dataset.view === view;
    el.classList.toggle('active', active);
    if (active) activeBtn = el;
  });
  positionDockIndicator(activeBtn);
  closeMenu();

  const root = document.getElementById('viewRoot');
  const html = RENDERERS[view]();
  const update = () => {
    root.innerHTML = html;
    animateIn(root);
    root.scrollTop = 0;
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

function openMenu() { document.getElementById('menuOverlay').classList.add('open'); }
function closeMenu() { document.getElementById('menuOverlay').classList.remove('open'); }

function buildBottomBar() {
  document.querySelectorAll('.bnav-item').forEach((btn) => {
    const icon = NAV_ITEMS.find((n) => n.id === btn.dataset.view).icon;
    document.getElementById('bnav-' + btn.dataset.view).innerHTML = svgIcon(icon);
  });
}
function wireBottomBar() {
  document.querySelectorAll('.bnav-item').forEach((btn) => {
    btn.addEventListener('click', () => setActiveView(btn.dataset.view));
  });
  document.getElementById('menuBtnIcon').innerHTML = svgIcon('plus');
}

function buildMenuGrid() {
  const grid = document.getElementById('menuGrid');
  const tiles = NAV_ITEMS.map((item) => ({ id: item.id, icon: item.icon, color: item.color, label: t(item.labelKey), action: () => setActiveView(item.id) }));
  tiles.push({ id: 'settings', icon: 'settings', color: '#9aa0c3', label: t('settings.title'), action: () => { closeMenu(); openSettings(); } });

  grid.innerHTML = tiles.map((tile, i) => `<button class="menu-tile" data-idx="${i}" style="animation-delay:${i * 30}ms">
    <span class="menu-tile-icon" style="background:${hexToRgba(tile.color, 0.16)};color:${tile.color}">${svgIcon(tile.icon)}</span><span>${tile.label}</span>
  </button>`).join('');

  grid.querySelectorAll('.menu-tile').forEach((btn, i) => btn.addEventListener('click', tiles[i].action));
}

function buildTransportQuickPicks() {
  const row = document.getElementById('menuTransportPicks');
  if (!row) return;
  const tr = STUDENT_OS_DATA.transport;
  row.innerHTML = tr.destinations.map((d) => `<button type="button" class="transport-dest-chip${tr.activeDestination === d.id ? ' active' : ''}" data-dest="${d.id}">${svgIcon(d.icon)}<span>${d.label}</span></button>`).join('');
  row.querySelectorAll('.transport-dest-chip').forEach((btn) => {
    btn.addEventListener('click', () => selectTransportDestination(btn.dataset.dest));
  });
}

function rebuildNav() { buildMenuGrid(); buildTransportQuickPicks(); }

function openSettings() { document.getElementById('settingsBackdrop').classList.add('open'); }
function closeSettings() { document.getElementById('settingsBackdrop').classList.remove('open'); }

function init() {
  applyThemeAndFont();
  applyProfilePersonalization();
  loadPersistedNotes();
  loadPersistedMindmap();
  loadPersistedGroups();
  buildBottomBar();
  wireBottomBar();
  buildMenuGrid();
  buildTransportQuickPicks();

  document.getElementById('mAvatar').textContent = STUDENT_OS_DATA.user.initials;
  document.getElementById('mGreeting').textContent = 'Salut ' + STUDENT_OS_DATA.user.name.split(' ')[0];
  document.getElementById('mSchool').textContent = STUDENT_OS_DATA.user.school;
  document.getElementById('settingsAvatar').textContent = STUDENT_OS_DATA.user.initials;
  document.getElementById('settingsName').textContent = STUDENT_OS_DATA.user.name;
  document.getElementById('settingsSchool').textContent = STUDENT_OS_DATA.user.school;

  document.getElementById('bellIcon').innerHTML = svgIcon('bell');
  document.getElementById('closeMenu').innerHTML = svgIcon('close');
  document.getElementById('closeSettings').innerHTML = svgIcon('close');

  document.getElementById('menuBtn').addEventListener('click', openMenu);
  document.getElementById('closeMenu').addEventListener('click', closeMenu);
  document.getElementById('menuOverlay').addEventListener('click', (e) => { if (e.target.id === 'menuOverlay') closeMenu(); });

  document.getElementById('userMenuBtn').addEventListener('click', openSettings);
  document.getElementById('bellBtn').addEventListener('click', () => setActiveView('inbox'));
  document.getElementById('closeSettings').addEventListener('click', closeSettings);
  document.getElementById('settingsBackdrop').addEventListener('click', (e) => { if (e.target.id === 'settingsBackdrop') closeSettings(); });
  document.getElementById('goConnections').addEventListener('click', () => { closeSettings(); setActiveView('connections'); });
  document.getElementById('logoutBtn').addEventListener('click', () => { window.location.href = 'index.html'; });

  wireSettingsPreferences();
  applyI18n(document);
  setActiveView('home');
  window.addEventListener('resize', () => { const el = document.querySelector('.bnav-item.active'); if (el) positionDockIndicator(el); });
}

document.addEventListener('DOMContentLoaded', init);
